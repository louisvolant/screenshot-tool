import { hexToRgb, rgba } from '../render/colors';

export interface WallpaperDef {
  id: string;
  name: string;
  colors: string[];
}

export const WALLPAPERS: WallpaperDef[] = [
  { id: 'satin', name: 'Satin', colors: ['#ff5a6e', '#ff9a8b', '#ffd3c4'] },
  { id: 'dunes', name: 'Dunes', colors: ['#ffe3c4', '#f4a582', '#b8604d'] },
  { id: 'aurora', name: 'Aurora', colors: ['#10002b', '#7b2ff7', '#f107a3'] },
  { id: 'chrome', name: 'Chrome', colors: ['#f3e7ff', '#9ee7ff', '#ffc2e2'] },
  { id: 'mist', name: 'Mist', colors: ['#e6eee4', '#7f9c80', '#2d4632'] },
  { id: 'ripple', name: 'Ripple', colors: ['#d9fff3', '#8ee3c8', '#b8c6ff'] },
  { id: 'blobs', name: 'Blobs', colors: ['#fff1f6', '#ff8fab', '#ffd84d'] },
  { id: 'ember', name: 'Ember', colors: ['#140806', '#ff6a00', '#ffc46b'] },
  { id: 'clouds', name: 'Clouds', colors: ['#3d9bff', '#ffffff', '#a9cdf5'] },
  { id: 'waves', name: 'Waves', colors: ['#0b2a6f', '#1fa2ff', '#a6ffcb'] },
  { id: 'glass', name: 'Glass', colors: ['#6d5efc', '#ec5fb0', '#ffd166'] },
  { id: 'sunset', name: 'Sunset', colors: ['#2b1055', '#ff7a59', '#140a2e'] },
];

export function renderWallpaper(
  ctx: CanvasRenderingContext2D,
  id: string,
  w: number,
  h: number,
  customColors?: string[]
): void {
  const def = WALLPAPERS.find((item) => item.id === id) || WALLPAPERS[0];
  const colors = customColors && customColors.length >= 2 ? customColors : def.colors;

  ctx.save();

  // Base background fill
  const baseGrad = ctx.createLinearGradient(0, 0, w, h);
  baseGrad.addColorStop(0, colors[0]);
  baseGrad.addColorStop(1, colors[colors.length - 1]);
  ctx.fillStyle = baseGrad;
  ctx.fillRect(0, 0, w, h);

  switch (id) {
    case 'satin':
    case 'waves': {
      // Fluid sinusoidal bezier ribbon curves
      for (let i = 0; i < 4; i++) {
        ctx.beginPath();
        const yBase = (h * (i + 1)) / 5;
        ctx.moveTo(0, yBase);
        ctx.bezierCurveTo(
          w * 0.35, yBase - h * 0.25,
          w * 0.65, yBase + h * 0.25,
          w, yBase - h * 0.1
        );
        ctx.lineTo(w, h);
        ctx.lineTo(0, h);
        ctx.closePath();
        ctx.fillStyle = rgba(colors[i % colors.length], 0.25 + i * 0.12);
        ctx.fill();
      }
      break;
    }

    case 'aurora':
    case 'spotlight': {
      // Multi-stop radiating spotlights
      const rad1 = ctx.createRadialGradient(w * 0.3, h * 0.3, 10, w * 0.3, h * 0.3, w * 0.7);
      rad1.addColorStop(0, rgba(colors[1] || '#7b2ff7', 0.8));
      rad1.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = rad1;
      ctx.fillRect(0, 0, w, h);

      const rad2 = ctx.createRadialGradient(w * 0.75, h * 0.65, 20, w * 0.75, h * 0.65, w * 0.6);
      rad2.addColorStop(0, rgba(colors[2] || colors[0], 0.7));
      rad2.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = rad2;
      ctx.fillRect(0, 0, w, h);
      break;
    }

    case 'ripple': {
      // Concentric circles
      const cx = w * 0.5;
      const cy = h * 0.5;
      for (let r = w * 0.1; r < w * 0.9; r += w * 0.08) {
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.strokeStyle = rgba(colors[1] || '#ffffff', 0.2);
        ctx.lineWidth = 14;
        ctx.stroke();
      }
      break;
    }

    case 'blobs': {
      // Soft organic blurred circles
      const blobs = [
        { x: w * 0.25, y: h * 0.3, r: w * 0.3, c: colors[1] || colors[0] },
        { x: w * 0.75, y: h * 0.4, r: w * 0.25, c: colors[2] || colors[0] },
        { x: w * 0.5, y: h * 0.8, r: w * 0.35, c: colors[0] },
      ];
      for (const b of blobs) {
        const grad = ctx.createRadialGradient(b.x, b.y, b.r * 0.1, b.x, b.y, b.r);
        grad.addColorStop(0, rgba(b.c, 0.7));
        grad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }

    default: {
      // Elegant mesh diagonal bands
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.moveTo(0, h * 0.2 * i);
        ctx.lineTo(w, h * (0.3 + 0.2 * i));
        ctx.lineTo(w, h);
        ctx.lineTo(0, h);
        ctx.closePath();
        ctx.fillStyle = rgba(colors[(i + 1) % colors.length], 0.2);
        ctx.fill();
      }
    }
  }

  ctx.restore();
}
