import { BackgroundState } from '../store/types';
import { hexToRgb, isDark, rgba } from '../render/colors';
import { renderWallpaper } from './wallpapers';

let noiseCanvas: HTMLCanvasElement | null = null;

function getNoiseTile(): HTMLCanvasElement {
  if (noiseCanvas) return noiseCanvas;
  const size = 128;
  noiseCanvas = document.createElement('canvas');
  noiseCanvas.width = size;
  noiseCanvas.height = size;
  const ctx = noiseCanvas.getContext('2d')!;
  const imgData = ctx.createImageData(size, size);
  for (let i = 0; i < imgData.data.length; i += 4) {
    const val = Math.floor(Math.random() * 255);
    imgData.data[i] = val;
    imgData.data[i + 1] = val;
    imgData.data[i + 2] = val;
    imgData.data[i + 3] = 255;
  }
  ctx.putImageData(imgData, 0, 0);
  return noiseCanvas;
}

export function drawBackground(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  bg: BackgroundState,
  customImage?: HTMLImageElement | null
): void {
  ctx.save();

  // 1. Base Fill based on Background Type
  switch (bg.type) {
    case 'solid': {
      ctx.fillStyle = bg.solid || '#f4f4f5';
      ctx.fillRect(0, 0, w, h);
      break;
    }

    case 'gradient': {
      const angleRad = ((bg.angle || 135) * Math.PI) / 180;
      const cx = w / 2;
      const cy = h / 2;
      const len = Math.hypot(w, h) / 2;
      const x0 = cx - Math.cos(angleRad) * len;
      const y0 = cy - Math.sin(angleRad) * len;
      const x1 = cx + Math.cos(angleRad) * len;
      const y1 = cy + Math.sin(angleRad) * len;

      const grad = ctx.createLinearGradient(x0, y0, x1, y1);
      const cols = bg.colors && bg.colors.length > 0 ? bg.colors : ['#6d5efc', '#a18cd1'];
      cols.forEach((col, idx) => {
        grad.addColorStop(idx / (cols.length - 1 || 1), col);
      });
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
      break;
    }

    case 'mesh': {
      const cols = bg.colors && bg.colors.length >= 3 ? bg.colors : ['#ffd1dc', '#a18cd1', '#fbc2eb'];
      // Fill base
      ctx.fillStyle = cols[0];
      ctx.fillRect(0, 0, w, h);

      // Diagonal radiant patches
      const g1 = ctx.createRadialGradient(0, 0, w * 0.1, 0, 0, w * 0.9);
      g1.addColorStop(0, cols[1]);
      g1.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g1;
      ctx.fillRect(0, 0, w, h);

      const g2 = ctx.createRadialGradient(w, h, w * 0.1, w, h, w * 0.9);
      g2.addColorStop(0, cols[2]);
      g2.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g2;
      ctx.fillRect(0, 0, w, h);
      break;
    }

    case 'split': {
      const cols = bg.colors && bg.colors.length >= 2 ? bg.colors : ['#111827', '#f3f4f6'];
      const angleRad = ((bg.angle || 60) * Math.PI) / 180;
      ctx.fillStyle = cols[0];
      ctx.fillRect(0, 0, w, h);

      ctx.beginPath();
      ctx.moveTo(0, 0);
      const shiftX = Math.tan(angleRad) * h;
      ctx.lineTo(w * 0.5 + shiftX, 0);
      ctx.lineTo(w * 0.5 - shiftX, h);
      ctx.lineTo(0, h);
      ctx.closePath();
      ctx.fillStyle = cols[1];
      ctx.fill();
      break;
    }

    case 'spotlight': {
      const cols = bg.colors && bg.colors.length >= 2 ? bg.colors : ['#0d0a1f', '#6d3cff', '#ff4fd8'];
      ctx.fillStyle = cols[0];
      ctx.fillRect(0, 0, w, h);

      const rad = ctx.createRadialGradient(w * 0.5, h * 0.3, 10, w * 0.5, h * 0.4, w * 0.65);
      rad.addColorStop(0, rgba(cols[1], 0.85));
      rad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = rad;
      ctx.fillRect(0, 0, w, h);
      break;
    }

    case 'wallpaper': {
      renderWallpaper(ctx, bg.wallpaper || 'satin', w, h, bg.colors);
      break;
    }

    case 'image': {
      if (customImage && customImage.complete) {
        ctx.save();
        if (bg.blur > 0) {
          ctx.filter = `blur(${bg.blur}px)`;
        }
        // Draw cover
        const iw = customImage.naturalWidth || customImage.width;
        const ih = customImage.naturalHeight || customImage.height;
        const scale = Math.max(w / iw, h / ih);
        const nw = iw * scale;
        const nh = ih * scale;
        ctx.drawImage(customImage, (w - nw) / 2, (h - nh) / 2, nw, nh);
        ctx.restore();
      } else {
        ctx.fillStyle = '#1e1b2e';
        ctx.fillRect(0, 0, w, h);
      }
      break;
    }
  }

  // 2. Pattern Overlay
  if (bg.pattern && bg.pattern !== 'none') {
    const opacity = (bg.patternOpacity ?? 30) / 100;
    const strokeColor = `rgba(255, 255, 255, ${opacity * 0.4})`;
    const step = 32;

    ctx.save();
    if (bg.pattern === 'dots') {
      ctx.fillStyle = strokeColor;
      for (let x = step / 2; x < w; x += step) {
        for (let y = step / 2; y < h; y += step) {
          ctx.beginPath();
          ctx.arc(x, y, 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    } else if (bg.pattern === 'grid') {
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = 0; x < w; x += step) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
      }
      for (let y = 0; y < h; y += step) {
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
      }
      ctx.stroke();
    } else if (bg.pattern === 'stripes') {
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 3;
      ctx.beginPath();
      for (let x = -h; x < w + h; x += step) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x + h, h);
      }
      ctx.stroke();
    }
    ctx.restore();
  }

  // 3. Noise Overlay
  if (bg.noise && bg.noise > 0) {
    const noise = getNoiseTile();
    ctx.save();
    ctx.globalAlpha = Math.min(1, bg.noise / 100) * 0.25;
    ctx.globalCompositeOperation = 'overlay';
    const pattern = ctx.createPattern(noise, 'repeat');
    if (pattern) {
      ctx.fillStyle = pattern;
      ctx.fillRect(0, 0, w, h);
    }
    ctx.restore();
  }

  ctx.restore();
}
