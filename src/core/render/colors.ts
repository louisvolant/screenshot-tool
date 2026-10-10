export function hexToRgb(hex: string): [number, number, number] {
  let c = hex.replace('#', '').trim();
  if (c.length === 3) {
    c = c.split('').map((x) => x + x).join('');
  }
  const num = parseInt(c, 16);
  if (isNaN(num)) return [0, 0, 0];
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

export function rgbToHex(r: number, g: number, b: number): string {
  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
  return '#' + [clamp(r), clamp(g), clamp(b)].map((x) => x.toString(16).padStart(2, '0')).join('');
}

export function rgba(hex: string, alpha: number): string {
  const [r, g, b] = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${Math.max(0, Math.min(1, alpha))})`;
}

export function luminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex).map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function isDark(hex: string): boolean {
  return luminance(hex) < 0.45;
}

export function mix(hex1: string, hex2: string, weight = 0.5): string {
  const [r1, g1, b1] = hexToRgb(hex1);
  const [r2, g2, b2] = hexToRgb(hex2);
  const w = Math.max(0, Math.min(1, weight));
  return rgbToHex(
    r1 * (1 - w) + r2 * w,
    g1 * (1 - w) + g2 * w,
    b1 * (1 - w) + b2 * w
  );
}

export function adjust(hex: string, { light = 0 }: { light?: number }): string {
  const [r, g, b] = hexToRgb(hex);
  const delta = light * 255;
  return rgbToHex(r + delta, g + delta, b + delta);
}

/**
 * Extracts 5 dominant colors from an image using simple color histogram bucket quantization
 */
export function extractPalette(img: HTMLImageElement | HTMLCanvasElement): string[] {
  const canvas = document.createElement('canvas');
  const size = 64;
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return ['#6d5efc', '#ff8a65', '#4fc3f7', '#81c784', '#f06292'];

  ctx.drawImage(img, 0, 0, size, size);
  const data = ctx.getImageData(0, 0, size, size).data;
  const buckets = new Map<string, { count: number; r: number; g: number; b: number }>();

  for (let i = 0; i < data.length; i += 16) { // sample every 4th pixel
    const a = data[i + 3];
    if (a < 128) continue;
    const r = Math.round(data[i] / 32) * 32;
    const g = Math.round(data[i + 1] / 32) * 32;
    const b = Math.round(data[i + 2] / 32) * 32;
    const key = `${r},${g},${b}`;
    const curr = buckets.get(key) || { count: 0, r: 0, g: 0, b: 0 };
    curr.count++;
    curr.r += data[i];
    curr.g += data[i + 1];
    curr.b += data[i + 2];
    buckets.set(key, curr);
  }

  const sorted = Array.from(buckets.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  if (sorted.length === 0) {
    return ['#6d5efc', '#ff8a65', '#4fc3f7', '#81c784', '#f06292'];
  }

  return sorted.map((item) => {
    return rgbToHex(item.r / item.count, item.g / item.count, item.b / item.count);
  });
}

/**
 * Generates automated gradient color options from palette
 */
export function paletteBackgrounds(palette: string[]): Array<{ type: 'gradient'; colors: string[]; angle: number }> {
  const p = palette.length >= 2 ? palette : ['#6d5efc', '#ec5fb0', '#ffd166'];
  return [
    { type: 'gradient', colors: [p[0], mix(p[0], '#ffffff', 0.25), p[1] || p[0]], angle: 135 },
    { type: 'gradient', colors: [p[1] || p[0], p[2] || p[0], p[0]], angle: 150 },
    { type: 'gradient', colors: [p[0], p[1] || '#ffffff'], angle: 120 },
    { type: 'gradient', colors: [mix(p[0], '#000000', 0.6), mix(p[1] || p[0], '#000000', 0.4)], angle: 135 },
  ];
}
