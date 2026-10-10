import { AnnotationItem } from '../store/types';
import { getFontFamily } from '../render/fonts';
import { rgba } from '../render/colors';

export function createDefaultAnnotation(
  type: AnnotationItem['type'],
  props: Partial<AnnotationItem> = {}
): AnnotationItem {
  const id = `annot_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
  const base: AnnotationItem = {
    id,
    type,
    attached: true,
    x: 100,
    y: 100,
  };

  switch (type) {
    case 'text':
      return {
        ...base,
        text: 'Key feature',
        size: 20,
        color: '#ffffff',
        pill: true,
        pillColor: '#6d5efc',
        font: 'sans',
        align: 'center',
        ...props,
      };
    case 'arrow':
      return {
        ...base,
        x1: 80,
        y1: 140,
        x2: 240,
        y2: 70,
        color: '#ff4d7e',
        width: 5,
        curve: 0.35,
        dash: 'solid',
        ...props,
      };
    case 'box':
      return {
        ...base,
        w: 220,
        h: 120,
        color: '#6d5efc',
        width: 3,
        style: 'outline',
        radius: 12,
        ...props,
      };
    case 'blur':
      return {
        ...base,
        w: 180,
        h: 60,
        mode: 'blur',
        strength: 15,
        ...props,
      };
    case 'sticker':
      return {
        ...base,
        emoji: '🚀',
        size: 54,
        ...props,
      };
    case 'loupe':
      return {
        ...base,
        r: 60,
        zoom: 2,
        color: '#ffffff',
        ...props,
      };
  }
}

/**
 * Draws all annotations onto a 2D canvas context
 */
export function drawAnnotations(
  ctx: CanvasRenderingContext2D,
  annotations: AnnotationItem[],
  baseContentCanvas?: HTMLCanvasElement
): void {
  for (const a of annotations) {
    ctx.save();
    switch (a.type) {
      case 'text':
        drawTextPill(ctx, a);
        break;
      case 'arrow':
        drawCurvedArrow(ctx, a);
        break;
      case 'box':
        drawBoundingBox(ctx, a);
        break;
      case 'blur':
        drawPrivacyBlur(ctx, a, baseContentCanvas);
        break;
      case 'sticker':
        drawEmojiSticker(ctx, a);
        break;
      case 'loupe':
        drawMagnifyingLoupe(ctx, a, baseContentCanvas);
        break;
    }
    ctx.restore();
  }
}

function drawTextPill(ctx: CanvasRenderingContext2D, a: AnnotationItem): void {
  const text = a.text || 'Annotation';
  const size = a.size || 20;
  const fontFam = getFontFamily(a.font || 'sans');
  ctx.font = `600 ${size}px ${fontFam}`;
  const textW = ctx.measureText(text).width;
  const padX = size * 0.7;
  const padY = size * 0.4;
  const pillW = textW + padX * 2;
  const pillH = size + padY * 2;

  const x = a.x;
  const y = a.y;

  if (a.pill) {
    ctx.shadowColor = 'rgba(0,0,0,0.35)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetY = 4;
    ctx.fillStyle = a.pillColor || '#6d5efc';
    ctx.beginPath();
    ctx.roundRect(x - pillW / 2, y - pillH / 2, pillW, pillH, pillH / 2);
    ctx.fill();
  }

  ctx.shadowColor = 'transparent';
  ctx.fillStyle = a.color || '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, x, y);
}

function drawCurvedArrow(ctx: CanvasRenderingContext2D, a: AnnotationItem): void {
  const x1 = a.x1 ?? a.x;
  const y1 = a.y1 ?? a.y;
  const x2 = a.x2 ?? a.x + 120;
  const y2 = a.y2 ?? a.y - 60;
  const curve = a.curve ?? 0.35;
  const col = a.color || '#ff4d7e';
  const width = a.width || 5;

  // Compute quadratic control point
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const normalX = -dy * curve;
  const normalY = dx * curve;
  const cx = mx + normalX;
  const cy = my + normalY;

  ctx.strokeStyle = col;
  ctx.lineWidth = width;
  ctx.lineCap = 'round';
  if (a.dash === 'dashed') {
    ctx.setLineDash([10, 8]);
  }

  ctx.shadowColor = 'rgba(0,0,0,0.35)';
  ctx.shadowBlur = 8;
  ctx.shadowOffsetY = 3;

  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.quadraticCurveTo(cx, cy, x2, y2);
  ctx.stroke();

  // Arrowhead at (x2, y2)
  const angle = Math.atan2(y2 - cy, x2 - cx);
  const headLen = width * 3.5;
  ctx.fillStyle = col;
  ctx.beginPath();
  ctx.moveTo(x2, y2);
  ctx.lineTo(x2 - headLen * Math.cos(angle - Math.PI / 6), y2 - headLen * Math.sin(angle - Math.PI / 6));
  ctx.lineTo(x2 - headLen * Math.cos(angle + Math.PI / 6), y2 - headLen * Math.sin(angle + Math.PI / 6));
  ctx.closePath();
  ctx.fill();
}

function drawBoundingBox(ctx: CanvasRenderingContext2D, a: AnnotationItem): void {
  const w = a.w || 150;
  const h = a.h || 80;
  const col = a.color || '#6d5efc';
  const rad = a.radius || 12;

  ctx.shadowColor = 'rgba(0,0,0,0.3)';
  ctx.shadowBlur = 8;
  ctx.shadowOffsetY = 2;

  if (a.style === 'filled') {
    ctx.fillStyle = rgba(col, 0.25);
    ctx.beginPath();
    ctx.roundRect(a.x, a.y, w, h, rad);
    ctx.fill();
  }

  ctx.strokeStyle = col;
  ctx.lineWidth = a.width || 3;
  ctx.beginPath();
  ctx.roundRect(a.x, a.y, w, h, rad);
  ctx.stroke();
}

function drawPrivacyBlur(
  ctx: CanvasRenderingContext2D,
  a: AnnotationItem,
  baseContentCanvas?: HTMLCanvasElement
): void {
  const w = a.w || 160;
  const h = a.h || 50;

  if (baseContentCanvas) {
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(a.x, a.y, w, h, 8);
    ctx.clip();
    ctx.filter = `blur(${a.strength || 15}px)`;
    ctx.drawImage(baseContentCanvas, 0, 0);
    ctx.restore();
  } else {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.beginPath();
    ctx.roundRect(a.x, a.y, w, h, 8);
    ctx.fill();
  }

  // Border outline
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(a.x, a.y, w, h, 8);
  ctx.stroke();
}

function drawEmojiSticker(ctx: CanvasRenderingContext2D, a: AnnotationItem): void {
  const size = a.size || 54;
  ctx.font = `${size}px "Apple Color Emoji", "Segoe UI Emoji", sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = 'rgba(0,0,0,0.3)';
  ctx.shadowBlur = 10;
  ctx.shadowOffsetY = 4;
  ctx.fillText(a.emoji || '✨', a.x, a.y);
}

function drawMagnifyingLoupe(
  ctx: CanvasRenderingContext2D,
  a: AnnotationItem,
  baseContentCanvas?: HTMLCanvasElement
): void {
  const r = a.r || 60;
  const zoom = a.zoom || 2;

  ctx.save();
  // Clip circular lens
  ctx.beginPath();
  ctx.arc(a.x, a.y, r, 0, Math.PI * 2);
  ctx.clip();

  if (baseContentCanvas) {
    ctx.save();
    ctx.translate(a.x, a.y);
    ctx.scale(zoom, zoom);
    ctx.translate(-a.x, -a.y);
    ctx.drawImage(baseContentCanvas, 0, 0);
    ctx.restore();
  } else {
    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    ctx.fill();
  }
  ctx.restore();

  // Glass rim & shadow
  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,0.45)';
  ctx.shadowBlur = 16;
  ctx.shadowOffsetY = 6;
  ctx.strokeStyle = a.color || '#ffffff';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(a.x, a.y, r, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}
