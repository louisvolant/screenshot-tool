import { EffectState } from '../store/types';

const DEG = Math.PI / 180;

export interface ProjectResult {
  points: Array<{ x: number; y: number; w: number }>;
  minX: number;
  minY: number;
  width: number;
  height: number;
}

export function project3D(w: number, h: number, effect: EffectState): ProjectResult {
  const ax = effect.rotateX * DEG;
  const ay = effect.rotateY * DEG;
  const az = effect.rotateZ * DEG;
  const d = effect.perspective * Math.max(w, h);

  const corners: [number, number][] = [
    [-w / 2, -h / 2],
    [w / 2, -h / 2],
    [-w / 2, h / 2],
    [w / 2, h / 2],
  ];

  const points = corners.map(([x0, y0]) => {
    // Rotate Z (roll)
    let x = x0 * Math.cos(az) - y0 * Math.sin(az);
    let y = x0 * Math.sin(az) + y0 * Math.cos(az);
    let z = 0;

    // Rotate X (pitch)
    const y1 = y * Math.cos(ax) - z * Math.sin(ax);
    z = y * Math.sin(ax) + z * Math.cos(ax);
    y = y1;

    // Rotate Y (yaw)
    const x1 = x * Math.cos(ay) + z * Math.sin(ay);
    z = -x * Math.sin(ay) + z * Math.cos(ay);
    x = x1;

    // Perspective projection
    const k = d / (d - z);
    return { x: x * k, y: y * k, w: 1 / k };
  });

  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);
  const minX = Math.min(...xs);
  const minY = Math.min(...ys);

  return {
    points,
    minX,
    minY,
    width: Math.max(...xs) - minX,
    height: Math.max(...ys) - minY,
  };
}

export function has3dEffect(effect: EffectState): boolean {
  return Math.abs(effect.rotateX) > 0.01 || Math.abs(effect.rotateY) > 0.01 || Math.abs(effect.rotateZ) > 0.01;
}

let glCanvas: HTMLCanvasElement | null = null;
let gl: WebGLRenderingContext | null = null;
let program: WebGLProgram | null = null;
let buffer: WebGLBuffer | null = null;
let texture: WebGLTexture | null = null;

const VS = `
attribute vec4 a_pos;
attribute vec2 a_uv;
varying vec2 v_uv;
void main() {
  gl_Position = a_pos;
  v_uv = a_uv;
}
`;

const FS = `
precision mediump float;
varying vec2 v_uv;
uniform sampler2D u_image;
void main() {
  gl_FragColor = texture2D(u_image, v_uv);
}
`;

function initGL(): boolean {
  if (gl) return true;
  try {
    glCanvas = document.createElement('canvas');
    gl = glCanvas.getContext('webgl', { antialias: true, alpha: true });
    if (!gl) return false;

    const vs = gl.createShader(gl.VERTEX_SHADER)!;
    gl.shaderSource(vs, VS);
    gl.compileShader(vs);

    const fs = gl.createShader(gl.FRAGMENT_SHADER)!;
    gl.shaderSource(fs, FS);
    gl.compileShader(fs);

    program = gl.createProgram()!;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    gl.useProgram(program);

    buffer = gl.createBuffer();
    texture = gl.createTexture();
    return true;
  } catch {
    return false;
  }
}

/**
 * Renders an image or source canvas in 3D perspective using WebGL
 */
export function renderPerspective(
  source: HTMLCanvasElement | HTMLImageElement,
  effect: EffectState
): { canvas: HTMLCanvasElement; projection: ProjectResult } {
  const sw = source instanceof HTMLImageElement ? source.naturalWidth || source.width : source.width;
  const sh = source instanceof HTMLImageElement ? source.naturalHeight || source.height : source.height;
  const projection = project3D(sw, sh, effect);

  if (!has3dEffect(effect) || !initGL() || !gl || !glCanvas || !program || !buffer || !texture) {
    const directCanvas = document.createElement('canvas');
    directCanvas.width = sw;
    directCanvas.height = sh;
    const ctx = directCanvas.getContext('2d')!;
    ctx.drawImage(source, 0, 0);
    return { canvas: directCanvas, projection };
  }

  const outW = Math.max(1, Math.ceil(projection.width));
  const outH = Math.max(1, Math.ceil(projection.height));
  glCanvas.width = outW;
  glCanvas.height = outH;
  gl.viewport(0, 0, outW, outH);

  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);

  // Normalize points to clip space [-1, 1]
  const clip = projection.points.map((p) => {
    const x = ((p.x - projection.minX) / outW) * 2 - 1;
    const y = -(((p.y - projection.minY) / outH) * 2 - 1);
    return { x: x * p.w, y: y * p.w, w: p.w };
  });

  // Two triangles: (0, 1, 2) and (2, 1, 3)
  const vertices = new Float32Array([
    // x, y, z, w, u, v
    clip[0].x, clip[0].y, 0, clip[0].w, 0, 0,
    clip[1].x, clip[1].y, 0, clip[1].w, 1, 0,
    clip[2].x, clip[2].y, 0, clip[2].w, 0, 1,

    clip[2].x, clip[2].y, 0, clip[2].w, 0, 1,
    clip[1].x, clip[1].y, 0, clip[1].w, 1, 0,
    clip[3].x, clip[3].y, 0, clip[3].w, 1, 1,
  ]);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  const aPos = gl.getAttribLocation(program, 'a_pos');
  const aUv = gl.getAttribLocation(program, 'a_uv');
  gl.enableVertexAttribArray(aPos);
  gl.enableVertexAttribArray(aUv);

  gl.vertexAttribPointer(aPos, 4, gl.FLOAT, false, 24, 0);
  gl.vertexAttribPointer(aUv, 2, gl.FLOAT, false, 24, 16);

  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLES, 0, 6);

  // Copy result to standalone canvas for compositing
  const outCanvas = document.createElement('canvas');
  outCanvas.width = outW;
  outCanvas.height = outH;
  const outCtx = outCanvas.getContext('2d')!;
  outCtx.drawImage(glCanvas, 0, 0);

  return { canvas: outCanvas, projection };
}
