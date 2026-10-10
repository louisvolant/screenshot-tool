import { AppState, AspectRatio } from '../store/types';
import { drawBackground } from '../backgrounds/backgrounds';
import { computeLayout, drawContentBorder, drawContentShadow, roundedRectPath } from './layout';
import { renderPerspective } from './perspective';
import { drawTextOverlay } from './text';

export interface RenderContext {
  state: AppState;
  contentCanvas: HTMLCanvasElement;
  customBgImage?: HTMLImageElement | null;
  aspectOverride?: AspectRatio;
}

export function renderStudioComposition(ctx: CanvasRenderingContext2D, context: RenderContext): void {
  const { state, contentCanvas, customBgImage, aspectOverride } = context;

  // 1. Calculate 3D perspective projection on the center content canvas
  const { canvas: projectedContent, projection } = renderPerspective(contentCanvas, state.effect);

  // 2. Compute Layout & Canvas Dimensions
  const layout = aspectOverride ? { ...state.layout, aspect: aspectOverride } : state.layout;
  const computed = computeLayout(projectedContent.width, projectedContent.height, layout);

  const canvas = ctx.canvas;
  canvas.width = computed.canvasW;
  canvas.height = computed.canvasH;

  // 3. Render Background Layer
  drawBackground(ctx, computed.canvasW, computed.canvasH, state.background, customBgImage);

  // 4. Render Realistic Shadow & Glow
  drawContentShadow(
    ctx,
    computed.contentX,
    computed.contentY,
    computed.contentW,
    computed.contentH,
    layout
  );

  // 5. Draw Content Object (Clipping with corner radius if orthogonal)
  ctx.save();
  if (Math.abs(state.effect.rotateX) < 0.01 && Math.abs(state.effect.rotateY) < 0.01) {
    roundedRectPath(
      ctx,
      computed.contentX,
      computed.contentY,
      computed.contentW,
      computed.contentH,
      layout.radius
    );
    ctx.clip();
  }

  ctx.drawImage(
    projectedContent,
    computed.contentX,
    computed.contentY,
    computed.contentW,
    computed.contentH
  );
  ctx.restore();

  // 6. Draw Content Border
  drawContentBorder(
    ctx,
    computed.contentX,
    computed.contentY,
    computed.contentW,
    computed.contentH,
    layout
  );

  // 7. Ground Plane Reflection
  if (state.effect.reflection > 0) {
    ctx.save();
    const reflH = Math.round(computed.contentH * (state.effect.reflection / 100));
    const reflY = computed.contentY + computed.contentH + 4;

    ctx.save();
    ctx.translate(0, reflY + reflH);
    ctx.scale(1, -1);
    ctx.globalAlpha = 0.25 * (state.effect.reflection / 100);
    ctx.drawImage(
      projectedContent,
      computed.contentX,
      0,
      computed.contentW,
      reflH
    );
    ctx.restore();

    // Fade gradient mask over reflection
    const fadeGrad = ctx.createLinearGradient(0, reflY, 0, reflY + reflH);
    fadeGrad.addColorStop(0, 'rgba(0,0,0,0)');
    fadeGrad.addColorStop(1, 'rgba(0,0,0,0.85)');
    ctx.fillStyle = fadeGrad;
    ctx.fillRect(computed.contentX, reflY, computed.contentW, reflH);
    ctx.restore();
  }

  // 8. Render Headline / Text Overlay
  drawTextOverlay(ctx, computed.canvasW, computed.canvasH, state.text, state.background);
}

/**
 * Creates an offscreen raster canvas of the current composition
 */
export function createOffscreenComposition(context: RenderContext): HTMLCanvasElement {
  const offscreen = document.createElement('canvas');
  const ctx = offscreen.getContext('2d')!;
  renderStudioComposition(ctx, context);
  return offscreen;
}
