import { LayoutState, Alignment, AspectRatio } from '../store/types';
import { hexToRgb, rgba } from './colors';

export interface ComputedLayout {
  canvasW: number;
  canvasH: number;
  contentX: number;
  contentY: number;
  contentW: number;
  contentH: number;
  scaleFactor: number;
}

export function computeLayout(
  targetW: number,
  targetH: number,
  layout: LayoutState
): ComputedLayout {
  const scale = (layout.scale || 100) / 100;
  const padding = layout.padding || 80;

  // Scaled dimensions of the center content object
  const scaledW = targetW * scale;
  const scaledH = targetH * scale;

  let canvasW: number;
  let canvasH: number;

  switch (layout.aspect) {
    case '16:9':
      canvasW = 1920;
      canvasH = 1080;
      break;
    case '4:3':
      canvasW = 1600;
      canvasH = 1200;
      break;
    case '3:2':
      canvasW = 1800;
      canvasH = 1200;
      break;
    case '1:1':
      canvasW = 1200;
      canvasH = 1200;
      break;
    case '4:5':
      canvasW = 1080;
      canvasH = 1350;
      break;
    case '9:16':
      canvasW = 1080;
      canvasH = 1920;
      break;
    case '1200:630':
      canvasW = 1200;
      canvasH = 630;
      break;
    case '1500:500':
      canvasW = 1500;
      canvasH = 500;
      break;
    case 'auto':
    default:
      canvasW = Math.round(scaledW + padding * 2);
      canvasH = Math.round(scaledH + padding * 2);
      break;
  }

  // Calculate alignment within the canvas bounds (considering padding)
  const availW = canvasW - padding * 2;
  const availH = canvasH - padding * 2;

  let contentX = padding;
  let contentY = padding;

  const align = layout.align || 'mc';

  // Horizontal position
  if (align.endsWith('l')) {
    contentX = padding;
  } else if (align.endsWith('r')) {
    contentX = canvasW - padding - scaledW;
  } else {
    // center 'c'
    contentX = (canvasW - scaledW) / 2;
  }

  // Vertical position
  if (align.startsWith('t')) {
    contentY = padding;
  } else if (align.startsWith('b')) {
    contentY = canvasH - padding - scaledH;
  } else {
    // middle 'm'
    contentY = (canvasH - scaledH) / 2;
  }

  // Apply manual offsets
  contentX += layout.offsetX || 0;
  contentY += layout.offsetY || 0;

  return {
    canvasW,
    canvasH,
    contentX,
    contentY,
    contentW: scaledW,
    contentH: scaledH,
    scaleFactor: scale,
  };
}

export function drawContentShadow(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  layout: LayoutState
): void {
  if (layout.shadow <= 0 && layout.halo <= 0) return;

  ctx.save();

  // 1. Halo Ambient Glow
  if (layout.halo > 0) {
    const haloRadius = layout.halo * 2.5;
    ctx.shadowColor = rgba(layout.border.color || '#6d5efc', 0.6);
    ctx.shadowBlur = haloRadius;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    roundedRectPath(ctx, x, y, w, h, layout.radius);
    ctx.fill();
  }

  // 2. Realistic Layered Drop Shadow
  if (layout.shadow > 0) {
    const s = layout.shadow;
    const angleRad = ((layout.shadowAngle || 0) * Math.PI) / 180;
    const baseColor = layout.shadowColor || '#0b0b1e';

    if (layout.shadowStyle === 'hard') {
      // Hard retro drop shadow
      const offX = Math.cos(angleRad) * (s * 0.4);
      const offY = Math.sin(angleRad) * (s * 0.4) + s * 0.2;
      ctx.shadowColor = 'transparent';
      ctx.fillStyle = rgba(baseColor, 0.85);
      roundedRectPath(ctx, x + offX, y + offY, w, h, layout.radius);
      ctx.fill();
    } else {
      // Soft layered natural shadow
      const layers = [
        { blur: s * 0.3, alpha: 0.14, dy: s * 0.15 },
        { blur: s * 0.8, alpha: 0.22, dy: s * 0.35 },
        { blur: s * 1.5, alpha: 0.28, dy: s * 0.6 },
      ];

      for (const layer of layers) {
        ctx.shadowColor = rgba(baseColor, layer.alpha);
        ctx.shadowBlur = layer.blur;
        ctx.shadowOffsetX = Math.cos(angleRad) * (layer.dy * 0.3);
        ctx.shadowOffsetY = Math.sin(angleRad) * (layer.dy * 0.3) + layer.dy;
        ctx.fillStyle = 'rgba(0,0,0,0.1)';
        roundedRectPath(ctx, x, y, w, h, layout.radius);
        ctx.fill();
      }
    }
  }

  ctx.restore();
}

export function drawContentBorder(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  layout: LayoutState
): void {
  if (!layout.border || layout.border.width <= 0) return;

  ctx.save();
  ctx.lineWidth = layout.border.width;
  ctx.strokeStyle = rgba(layout.border.color || '#ffffff', (layout.border.opacity || 40) / 100);
  roundedRectPath(ctx, x, y, w, h, layout.radius);
  ctx.stroke();
  ctx.restore();
}

export function roundedRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  radius: number
): void {
  const r = Math.min(radius, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
