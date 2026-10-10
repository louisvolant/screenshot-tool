export interface ShotItem {
  id: string;
  canvas: HTMLCanvasElement;
}

export function composeCompare(
  shot1: HTMLCanvasElement,
  shot2: HTMLCanvasElement,
  mode: 'side' | 'stacked' | 'split' | 'overlay',
  options: {
    split?: number;
    labels?: boolean;
    before?: string;
    after?: string;
  } = {}
): HTMLCanvasElement {
  const w1 = shot1.width;
  const h1 = shot1.height;
  const w2 = shot2.width;
  const h2 = shot2.height;

  const out = document.createElement('canvas');
  const ctx = out.getContext('2d')!;

  switch (mode) {
    case 'side': {
      // Side-by-side
      const maxH = Math.max(h1, h2);
      const gap = 20;
      out.width = w1 + w2 + gap;
      out.height = maxH;
      ctx.drawImage(shot1, 0, (maxH - h1) / 2);
      ctx.drawImage(shot2, w1 + gap, (maxH - h2) / 2);
      break;
    }

    case 'stacked': {
      // Top and bottom
      const maxW = Math.max(w1, w2);
      const gap = 20;
      out.width = maxW;
      out.height = h1 + h2 + gap;
      ctx.drawImage(shot1, (maxW - w1) / 2, 0);
      ctx.drawImage(shot2, (maxW - w2) / 2, h1 + gap);
      break;
    }

    case 'split': {
      // Split divider
      out.width = w1;
      out.height = h1;
      const splitPct = (options.split ?? 50) / 100;
      const splitX = Math.round(w1 * splitPct);

      // Left part: shot 1
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, splitX, h1);
      ctx.clip();
      ctx.drawImage(shot1, 0, 0);
      ctx.restore();

      // Right part: shot 2
      ctx.save();
      ctx.beginPath();
      ctx.rect(splitX, 0, w1 - splitX, h1);
      ctx.clip();
      ctx.drawImage(shot2, 0, 0, w1, h1);
      ctx.restore();

      // Divider line
      ctx.save();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;
      ctx.shadowColor = 'rgba(0,0,0,0.5)';
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.moveTo(splitX, 0);
      ctx.lineTo(splitX, h1);
      ctx.stroke();

      // Circular grab handle
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(splitX, h1 / 2, 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#111827';
      ctx.font = '600 12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('◂▸', splitX, h1 / 2 + 4);
      ctx.restore();
      break;
    }

    case 'overlay': {
      // Shot 2 floats over bottom-right of Shot 1
      out.width = w1;
      out.height = h1;
      ctx.drawImage(shot1, 0, 0);

      const overlayW = Math.round(w1 * 0.55);
      const overlayH = Math.round(h2 * (overlayW / w2));
      const offX = w1 - overlayW - 30;
      const offY = h1 - overlayH - 30;

      ctx.save();
      ctx.shadowColor = 'rgba(0,0,0,0.45)';
      ctx.shadowBlur = 25;
      ctx.shadowOffsetY = 10;
      ctx.drawImage(shot2, offX, offY, overlayW, overlayH);
      ctx.restore();
      break;
    }
  }

  // Draw Before / After Badges
  if (options.labels) {
    drawBadge(ctx, 20, 20, options.before || 'Before');
    const afterX = mode === 'side' ? w1 + 40 : 20;
    const afterY = mode === 'stacked' ? h1 + 40 : 20;
    drawBadge(ctx, afterX, afterY, options.after || 'After');
  }

  return out;
}

function drawBadge(ctx: CanvasRenderingContext2D, x: number, y: number, text: string): void {
  ctx.save();
  ctx.font = '600 13px -apple-system, sans-serif';
  const textW = ctx.measureText(text).width;
  const padX = 12;
  const padY = 6;
  const w = textW + padX * 2;
  const h = 26;

  ctx.fillStyle = 'rgba(17, 24, 39, 0.85)';
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, 6);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'left';
  ctx.fillText(text, x + padX, y + 17);
  ctx.restore();
}

export function composeMontage(
  shots: HTMLCanvasElement[],
  layout: 'cascade' | 'row' | 'fan' | 'grid',
  spread = 35
): HTMLCanvasElement {
  if (shots.length === 0) {
    const c = document.createElement('canvas');
    c.width = 400;
    c.height = 300;
    return c;
  }
  if (shots.length === 1) return shots[0];

  const s = Math.max(0, Math.min(100, spread)) / 100;
  const n = shots.length;
  const w0 = shots[0].width;
  const h0 = shots[0].height;

  const out = document.createElement('canvas');
  const ctx = out.getContext('2d')!;

  switch (layout) {
    case 'row': {
      const gap = Math.round(w0 * (0.05 + 0.15 * s));
      out.width = w0 * n + gap * (n - 1);
      out.height = h0;
      shots.forEach((shot, i) => {
        ctx.drawImage(shot, i * (w0 + gap), 0, w0, h0);
      });
      break;
    }

    case 'cascade': {
      const ox = Math.round(w0 * (0.08 + 0.25 * s));
      const oy = Math.round(h0 * (0.08 + 0.2 * s));
      out.width = w0 + (n - 1) * ox;
      out.height = h0 + (n - 1) * oy;

      shots.forEach((shot, i) => {
        ctx.save();
        ctx.shadowColor = 'rgba(0,0,0,0.3)';
        ctx.shadowBlur = 18;
        ctx.shadowOffsetY = 8;
        ctx.drawImage(shot, i * ox, i * oy, w0, h0);
        ctx.restore();
      });
      break;
    }

    case 'fan': {
      const stepAngle = ((6 + 14 * s) * Math.PI) / 180;
      const mid = (n - 1) / 2;
      out.width = Math.round(w0 * (1.2 + n * 0.3 * s));
      out.height = Math.round(h0 * 1.3);

      const cx = out.width / 2;
      const cy = out.height * 0.65;

      shots.forEach((shot, i) => {
        const d = i - mid;
        ctx.save();
        ctx.translate(cx + d * w0 * (0.28 + 0.2 * s), cy + Math.abs(d) * h0 * 0.05);
        ctx.rotate(d * stepAngle);
        ctx.shadowColor = 'rgba(0,0,0,0.35)';
        ctx.shadowBlur = 20;
        ctx.drawImage(shot, -w0 / 2, -h0 / 2, w0, h0);
        ctx.restore();
      });
      break;
    }

    case 'grid': {
      const cols = n <= 2 ? 2 : 3;
      const rows = Math.ceil(n / cols);
      const gap = Math.round(w0 * (0.05 + 0.1 * s));
      out.width = cols * w0 + (cols - 1) * gap;
      out.height = rows * h0 + (rows - 1) * gap;

      shots.forEach((shot, i) => {
        const col = i % cols;
        const row = Math.floor(i / cols);
        ctx.drawImage(shot, col * (w0 + gap), row * (h0 + gap), w0, h0);
      });
      break;
    }
  }

  return out;
}
