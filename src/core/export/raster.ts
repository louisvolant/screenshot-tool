import { ExportFormat, ExportScale, AspectRatio, AppState } from '../store/types';
import { createZip, ZipFileEntry } from './zip';

export interface ExportOptions {
  format?: ExportFormat;
  scale?: ExportScale;
  watermark?: boolean;
  prefix?: string;
}

export function exportScaledCanvas(
  sourceCanvas: HTMLCanvasElement,
  scale: ExportScale = 1,
  watermark = false
): HTMLCanvasElement {
  const targetW = Math.round(sourceCanvas.width * scale);
  const targetH = Math.round(sourceCanvas.height * scale);

  const out = document.createElement('canvas');
  out.width = targetW;
  out.height = targetH;
  const ctx = out.getContext('2d')!;

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(sourceCanvas, 0, 0, targetW, targetH);

  if (watermark) {
    ctx.save();
    ctx.font = `600 ${Math.round(14 * scale)}px sans-serif`;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 4 * scale;
    ctx.textAlign = 'right';
    ctx.fillText('Made with Graphic Studio', targetW - 20 * scale, targetH - 20 * scale);
    ctx.restore();
  }

  return out;
}

export async function canvasToBlob(
  canvas: HTMLCanvasElement,
  format: ExportFormat = 'png'
): Promise<Blob> {
  const mimeMap: Record<ExportFormat, string> = {
    png: 'image/png',
    jpeg: 'image/jpeg',
    webp: 'image/webp',
  };
  const mime = mimeMap[format] || 'image/png';
  const quality = format === 'png' ? undefined : 0.92;

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Canvas blob generation failed'));
      },
      mime,
      quality
    );
  });
}

export async function downloadCanvas(
  canvas: HTMLCanvasElement,
  options: ExportOptions = {}
): Promise<void> {
  const { format = 'png', scale = 2, watermark = false, prefix = 'mockup' } = options;
  const scaled = exportScaledCanvas(canvas, scale, watermark);
  const blob = await canvasToBlob(scaled, format);
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  a.download = `${prefix}-${timestamp}.${format}`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function copyCanvasToClipboard(canvas: HTMLCanvasElement): Promise<boolean> {
  try {
    const scaled = exportScaledCanvas(canvas, 2, false);
    const blob = await canvasToBlob(scaled, 'png');
    if (navigator.clipboard && (window as any).ClipboardItem) {
      const item = new (window as any).ClipboardItem({ 'image/png': blob });
      await navigator.clipboard.write([item]);
      return true;
    }
  } catch (err) {
    console.warn('Clipboard copy failed:', err);
  }
  return false;
}

export async function shareCanvas(canvas: HTMLCanvasElement, title = 'Visual Asset'): Promise<boolean> {
  try {
    if (navigator.share && navigator.canShare) {
      const blob = await canvasToBlob(canvas, 'png');
      const file = new File([blob], 'graphic-asset.png', { type: 'image/png' });
      if (navigator.canShare({ files: [file] })) {
        await navigator.share({
          title,
          files: [file],
        });
        return true;
      }
    }
  } catch (err) {
    console.warn('Share API failed:', err);
  }
  return false;
}

export async function batchExportZip(
  renderFn: (aspect: AspectRatio) => HTMLCanvasElement,
  aspects: AspectRatio[] = ['16:9', '4:3', '1:1', '4:5', '9:16', '1200:630'],
  options: ExportOptions = {}
): Promise<void> {
  const files: ZipFileEntry[] = [];
  const { format = 'png', scale = 2, prefix = 'asset' } = options;

  for (const aspect of aspects) {
    const canvas = renderFn(aspect);
    const scaled = exportScaledCanvas(canvas, scale, options.watermark);
    const blob = await canvasToBlob(scaled, format);
    const arrayBuffer = await blob.arrayBuffer();
    const cleanAspect = aspect.replace(':', 'x');
    files.push({
      name: `${prefix}-${cleanAspect}.${format}`,
      data: new Uint8Array(arrayBuffer),
    });
  }

  const zipBlob = createZip(files);
  const url = URL.createObjectURL(zipBlob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${prefix}-social-pack.zip`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
