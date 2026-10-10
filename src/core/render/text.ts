import { TextOverlayState, BackgroundState } from '../store/types';
import { isDark } from './colors';
import { getFontFamily } from './fonts';

export function drawTextOverlay(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  textState: TextOverlayState,
  bgState: BackgroundState
): void {
  if (!textState.title && !textState.subtitle) return;

  ctx.save();

  // Determine ink color
  let ink = '#111827';
  if (textState.color === 'custom') {
    ink = textState.customColor || '#6d5efc';
  } else {
    // Auto contrast based on background
    const bgBaseColor = bgState.type === 'solid' ? bgState.solid : (bgState.colors?.[0] || '#ffffff');
    ink = isDark(bgBaseColor) ? '#f9fafb' : '#111827';
  }

  const mutedInk = isDark(ink) ? 'rgba(0, 0, 0, 0.65)' : 'rgba(255, 255, 255, 0.75)';

  const fontFam = getFontFamily(textState.font || 'sans');
  const sizeMultiplier = textState.size === 's' ? 0.75 : textState.size === 'l' ? 1.35 : 1.0;
  const titleSize = Math.round(32 * sizeMultiplier);
  const subtitleSize = Math.round(18 * sizeMultiplier);

  ctx.textAlign = textState.align || 'center';
  const x = textState.align === 'left' ? 60 : textState.align === 'right' ? w - 60 : w / 2;
  const isTop = (textState.position || 'top') === 'top';
  let y = isTop ? 60 : h - 70;

  if (textState.title) {
    ctx.font = `${textState.weight === 'bold' ? '700' : '500'} ${titleSize}px ${fontFam}`;
    ctx.fillStyle = ink;
    ctx.fillText(textState.title, x, y);
    y += titleSize + 10;
  }

  if (textState.subtitle) {
    ctx.font = `400 ${subtitleSize}px ${fontFam}`;
    ctx.fillStyle = mutedInk;
    ctx.fillText(textState.subtitle, x, y);
  }

  ctx.restore();
}
