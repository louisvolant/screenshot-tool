import { AppState } from '../store/types';

export interface StylePreset {
  id: string;
  name: string;
  category: 'Modern' | 'Dark' | 'Pastel' | 'Vibrant' | 'Minimal' | 'Editorial' | 'Cyber';
  background: {
    type: 'gradient' | 'mesh' | 'solid' | 'split' | 'spotlight' | 'wallpaper';
    colors: string[];
    angle?: number;
    wallpaper?: string;
    noise?: number;
    pattern?: 'none' | 'dots' | 'grid' | 'stripes';
  };
  layout?: {
    radius?: number;
    shadow?: number;
    shadowStyle?: 'soft' | 'hard';
    shadowColor?: string;
    padding?: number;
  };
  effect?: {
    rotateX?: number;
    rotateY?: number;
    rotateZ?: number;
    perspective?: number;
  };
}

export const PRESETS: StylePreset[] = [
  // Modern & Glass
  {
    id: 'nordic-sky',
    name: 'Nordic Sky',
    category: 'Modern',
    background: { type: 'gradient', colors: ['#2193b0', '#6dd5ed'], angle: 135, noise: 0 },
    layout: { radius: 18, shadow: 40, shadowStyle: 'soft', shadowColor: '#0b1b2b' },
  },
  {
    id: 'sunset-vibes',
    name: 'Sunset Vibes',
    category: 'Modern',
    background: { type: 'gradient', colors: ['#ee0979', '#ff6a00'], angle: 120, noise: 5 },
    layout: { radius: 16, shadow: 45, shadowStyle: 'soft' },
  },
  {
    id: 'hyper-violet',
    name: 'Hyper Violet',
    category: 'Modern',
    background: { type: 'gradient', colors: ['#7f00ff', '#e100ff'], angle: 145 },
    layout: { radius: 20, shadow: 50, shadowColor: '#1a0033' },
  },
  {
    id: 'emerald-flow',
    name: 'Emerald Flow',
    category: 'Modern',
    background: { type: 'gradient', colors: ['#0ba360', '#3cba92'], angle: 160 },
    layout: { radius: 16, shadow: 35, shadowColor: '#042b19' },
  },
  {
    id: 'deep-ocean',
    name: 'Deep Ocean',
    category: 'Modern',
    background: { type: 'gradient', colors: ['#0f2027', '#203a43', '#2c5364'], angle: 135 },
    layout: { radius: 16, shadow: 45 },
  },
  {
    id: 'neon-horizon',
    name: 'Neon Horizon',
    category: 'Modern',
    background: { type: 'mesh', colors: ['#f72585', '#7209b7', '#3a0ca3', '#4361ee', '#4cc9f0'] },
    layout: { radius: 18, shadow: 50 },
  },
  {
    id: 'electric-peach',
    name: 'Electric Peach',
    category: 'Modern',
    background: { type: 'gradient', colors: ['#f857a6', '#ff5858'], angle: 135 },
    layout: { radius: 16, shadow: 40 },
  },
  {
    id: 'cool-blues',
    name: 'Cool Blues',
    category: 'Modern',
    background: { type: 'gradient', colors: ['#2193b0', '#6dd5ed'], angle: 90 },
    layout: { radius: 14, shadow: 35 },
  },

  // Dark & Cyber
  {
    id: 'cyber-abyss',
    name: 'Cyber Abyss',
    category: 'Cyber',
    background: { type: 'wallpaper', wallpaper: 'aurora', colors: ['#0f0c29', '#302b63', '#24243e'] },
    layout: { radius: 16, shadow: 60, shadowColor: '#000000' },
    effect: { rotateX: 10, rotateY: -15, rotateZ: 0, perspective: 3.5 },
  },
  {
    id: 'matrix-noir',
    name: 'Matrix Noir',
    category: 'Cyber',
    background: { type: 'spotlight', colors: ['#00ff87', '#60efff'], angle: 180, noise: 12 },
    layout: { radius: 12, shadow: 55, shadowStyle: 'hard' },
  },
  {
    id: 'tokyo-drift',
    name: 'Tokyo Drift',
    category: 'Cyber',
    background: { type: 'gradient', colors: ['#ff007f', '#7928ca', '#00dfd8'], angle: 135 },
    layout: { radius: 18, shadow: 55 },
    effect: { rotateX: 14, rotateY: -18, rotateZ: 3 },
  },
  {
    id: 'synthwave-84',
    name: 'Synthwave 84',
    category: 'Cyber',
    background: { type: 'mesh', colors: ['#2b1055', '#7597de', '#ff7a59', '#b83b5e'] },
    layout: { radius: 16, shadow: 60 },
  },
  {
    id: 'obsidian-glow',
    name: 'Obsidian Glow',
    category: 'Dark',
    background: { type: 'solid', colors: ['#09090b'] },
    layout: { radius: 16, shadow: 50, shadowColor: '#000000' },
  },
  {
    id: 'midnight-slate',
    name: 'Midnight Slate',
    category: 'Dark',
    background: { type: 'gradient', colors: ['#0f172a', '#1e293b'], angle: 180 },
    layout: { radius: 16, shadow: 45, shadowColor: '#020617' },
  },
  {
    id: 'dark-ember',
    name: 'Dark Ember',
    category: 'Dark',
    background: { type: 'wallpaper', wallpaper: 'ember', colors: ['#140806', '#ff6a00', '#ffc46b'] },
    layout: { radius: 16, shadow: 50 },
  },
  {
    id: 'carbon-mesh',
    name: 'Carbon Mesh',
    category: 'Dark',
    background: { type: 'gradient', colors: ['#18181b', '#27272a'], angle: 135, noise: 15 },
    layout: { radius: 14, shadow: 40 },
  },

  // Pastel & Soft
  {
    id: 'lavender-mist',
    name: 'Lavender Mist',
    category: 'Pastel',
    background: { type: 'gradient', colors: ['#e0c3fc', '#8ec5fc'], angle: 120 },
    layout: { radius: 18, shadow: 30, shadowColor: '#4a4063' },
  },
  {
    id: 'cotton-candy',
    name: 'Cotton Candy',
    category: 'Pastel',
    background: { type: 'gradient', colors: ['#ffc3a0', '#ffafbd'], angle: 135 },
    layout: { radius: 18, shadow: 25 },
  },
  {
    id: 'mint-sorbet',
    name: 'Mint Sorbet',
    category: 'Pastel',
    background: { type: 'gradient', colors: ['#d4fc79', '#96e6a1'], angle: 135 },
    layout: { radius: 16, shadow: 28 },
  },
  {
    id: 'baby-blue',
    name: 'Baby Blue',
    category: 'Pastel',
    background: { type: 'gradient', colors: ['#e0f2fe', '#bae6fd', '#7dd3fc'], angle: 140 },
    layout: { radius: 16, shadow: 25 },
  },
  {
    id: 'lemon-cream',
    name: 'Lemon Cream',
    category: 'Pastel',
    background: { type: 'gradient', colors: ['#fef9c3', '#fef08a'], angle: 120 },
    layout: { radius: 14, shadow: 20 },
  },
  {
    id: 'matcha-latte',
    name: 'Matcha Latte',
    category: 'Pastel',
    background: { type: 'wallpaper', wallpaper: 'mist', colors: ['#e6eee4', '#7f9c80', '#2d4632'] },
    layout: { radius: 16, shadow: 30 },
  },
  {
    id: 'rose-quartz',
    name: 'Rose Quartz',
    category: 'Pastel',
    background: { type: 'wallpaper', wallpaper: 'blobs', colors: ['#fff1f6', '#ff8fab', '#ffd84d'] },
    layout: { radius: 18, shadow: 30 },
  },
  {
    id: 'seafoam-breeze',
    name: 'Seafoam Breeze',
    category: 'Pastel',
    background: { type: 'wallpaper', wallpaper: 'ripple', colors: ['#d9fff3', '#8ee3c8', '#b8c6ff'] },
    layout: { radius: 16, shadow: 28 },
  },

  // Vibrant & Punchy
  {
    id: 'tropicana',
    name: 'Tropicana',
    category: 'Vibrant',
    background: { type: 'gradient', colors: ['#f12711', '#f5af19'], angle: 120 },
    layout: { radius: 18, shadow: 45 },
  },
  {
    id: 'berry-blast',
    name: 'Berry Blast',
    category: 'Vibrant',
    background: { type: 'gradient', colors: ['#8a2387', '#e94057', '#f27121'], angle: 135 },
    layout: { radius: 18, shadow: 50 },
  },
  {
    id: 'miami-vice',
    name: 'Miami Vice',
    category: 'Vibrant',
    background: { type: 'split', colors: ['#00f2fe', '#4facfe'], angle: 90 },
    layout: { radius: 16, shadow: 45 },
  },
  {
    id: 'solar-flare',
    name: 'Solar Flare',
    category: 'Vibrant',
    background: { type: 'gradient', colors: ['#ff416c', '#ff4b2b'], angle: 135 },
    layout: { radius: 16, shadow: 45 },
  },
  {
    id: 'lime-punch',
    name: 'Lime Punch',
    category: 'Vibrant',
    background: { type: 'gradient', colors: ['#11998e', '#38ef7d'], angle: 140 },
    layout: { radius: 16, shadow: 40 },
  },
  {
    id: 'aurora-borealis',
    name: 'Aurora Borealis',
    category: 'Vibrant',
    background: { type: 'wallpaper', wallpaper: 'aurora', colors: ['#10002b', '#7b2ff7', '#f107a3'] },
    layout: { radius: 18, shadow: 55 },
  },
  {
    id: 'chrome-metallic',
    name: 'Chrome Metallic',
    category: 'Vibrant',
    background: { type: 'wallpaper', wallpaper: 'chrome', colors: ['#f3e7ff', '#9ee7ff', '#ffc2e2'] },
    layout: { radius: 20, shadow: 45 },
  },
  {
    id: 'blue-lagoon',
    name: 'Blue Lagoon',
    category: 'Vibrant',
    background: { type: 'wallpaper', wallpaper: 'waves', colors: ['#0b2a6f', '#1fa2ff', '#a6ffcb'] },
    layout: { radius: 16, shadow: 45 },
  },

  // Minimal & Clean
  {
    id: 'pure-paper',
    name: 'Pure Paper',
    category: 'Minimal',
    background: { type: 'solid', colors: ['#f8fafc'] },
    layout: { radius: 12, shadow: 25, shadowStyle: 'soft', shadowColor: '#94a3b8' },
  },
  {
    id: 'warm-studio',
    name: 'Warm Studio',
    category: 'Minimal',
    background: { type: 'gradient', colors: ['#fafaf9', '#f5f5f4'], angle: 180 },
    layout: { radius: 14, shadow: 28, shadowColor: '#a8a29e' },
  },
  {
    id: 'dots-grid-gray',
    name: 'Dots Pattern',
    category: 'Minimal',
    background: { type: 'solid', colors: ['#f1f5f9'], pattern: 'dots' },
    layout: { radius: 12, shadow: 30 },
  },
  {
    id: 'subtle-grid',
    name: 'Architect Grid',
    category: 'Minimal',
    background: { type: 'solid', colors: ['#ffffff'], pattern: 'grid' },
    layout: { radius: 10, shadow: 35, shadowStyle: 'hard' },
  },
  {
    id: 'sandstone',
    name: 'Sandstone',
    category: 'Minimal',
    background: { type: 'wallpaper', wallpaper: 'dunes', colors: ['#ffe3c4', '#f4a582', '#b8604d'] },
    layout: { radius: 14, shadow: 35 },
  },
  {
    id: 'satin-blush',
    name: 'Satin Blush',
    category: 'Minimal',
    background: { type: 'wallpaper', wallpaper: 'satin', colors: ['#ff5a6e', '#ff9a8b', '#ffd3c4'] },
    layout: { radius: 16, shadow: 30 },
  },
  {
    id: 'clouds-day',
    name: 'Clouds Day',
    category: 'Minimal',
    background: { type: 'wallpaper', wallpaper: 'clouds', colors: ['#3d9bff', '#ffffff', '#a9cdf5'] },
    layout: { radius: 16, shadow: 35 },
  },
  {
    id: 'glass-reflection',
    name: 'Glass Spectrum',
    category: 'Minimal',
    background: { type: 'wallpaper', wallpaper: 'glass', colors: ['#6d5efc', '#ec5fb0', '#ffd166'] },
    layout: { radius: 18, shadow: 40 },
  },

  // Editorial & High-End
  {
    id: 'monochrome-lux',
    name: 'Monochrome Lux',
    category: 'Editorial',
    background: { type: 'gradient', colors: ['#1c1917', '#44403c'], angle: 135 },
    layout: { radius: 8, shadow: 50, shadowStyle: 'hard' },
  },
  {
    id: 'bordeaux-vintage',
    name: 'Bordeaux Vintage',
    category: 'Editorial',
    background: { type: 'gradient', colors: ['#4a0e17', '#7b1122'], angle: 145 },
    layout: { radius: 14, shadow: 45, shadowColor: '#2b0007' },
  },
  {
    id: 'champagne-gold',
    name: 'Champagne Gold',
    category: 'Editorial',
    background: { type: 'gradient', colors: ['#f5e6d3', '#d4af37'], angle: 120 },
    layout: { radius: 16, shadow: 35, shadowColor: '#8c6d17' },
  },
  {
    id: 'deep-emerald-lux',
    name: 'Deep Emerald Lux',
    category: 'Editorial',
    background: { type: 'gradient', colors: ['#062c21', '#0d4a38'], angle: 160 },
    layout: { radius: 14, shadow: 50, shadowColor: '#02140f' },
  },
  {
    id: 'terracotta-clay',
    name: 'Terracotta Clay',
    category: 'Editorial',
    background: { type: 'gradient', colors: ['#c86446', '#e08365'], angle: 135 },
    layout: { radius: 16, shadow: 40 },
  },
  {
    id: 'sunset-twilight',
    name: 'Sunset Twilight',
    category: 'Editorial',
    background: { type: 'wallpaper', wallpaper: 'sunset', colors: ['#2b1055', '#ff7a59', '#140a2e'] },
    layout: { radius: 16, shadow: 50 },
    effect: { rotateX: 12, rotateY: -14, rotateZ: 2 },
  },
  {
    id: 'hero-isometric',
    name: 'Hero Isometric',
    category: 'Editorial',
    background: { type: 'mesh', colors: ['#6366f1', '#ec4899', '#8b5cf6', '#3b82f6'] },
    layout: { radius: 20, shadow: 60 },
    effect: { rotateX: 50, rotateY: 0, rotateZ: -38 },
  },
  {
    id: 'hero-marketing',
    name: 'Marketing Hero 3D',
    category: 'Editorial',
    background: { type: 'gradient', colors: ['#4f46e5', '#7c3aed'], angle: 135 },
    layout: { radius: 18, shadow: 55 },
    effect: { rotateX: 14, rotateY: -18, rotateZ: 3 },
  },
  {
    id: 'slanted-keyboard',
    name: 'Slanted Keyboard',
    category: 'Modern',
    background: { type: 'gradient', colors: ['#3b82f6', '#1d4ed8'], angle: 150 },
    layout: { radius: 16, shadow: 45 },
    effect: { rotateX: 32, rotateY: 0, rotateZ: 0 },
  },
  {
    id: 'left-perspective',
    name: 'Left Angle Tilt',
    category: 'Modern',
    background: { type: 'mesh', colors: ['#10b981', '#06b6d4', '#3b82f6'] },
    layout: { radius: 16, shadow: 45 },
    effect: { rotateX: 4, rotateY: 24, rotateZ: 0 },
  },
  {
    id: 'right-perspective',
    name: 'Right Angle Tilt',
    category: 'Modern',
    background: { type: 'mesh', colors: ['#f43f5e', '#fb923c', '#eab308'] },
    layout: { radius: 16, shadow: 45 },
    effect: { rotateX: 4, rotateY: -24, rotateZ: 0 },
  },
  {
    id: 'clean-flat',
    name: 'Clean Orthogonal',
    category: 'Minimal',
    background: { type: 'gradient', colors: ['#e2e8f0', '#cbd5e1'], angle: 135 },
    layout: { radius: 16, shadow: 35 },
    effect: { rotateX: 0, rotateY: 0, rotateZ: 0 },
  },
  {
    id: 'split-spotlight',
    name: 'Spotlight Focus',
    category: 'Modern',
    background: { type: 'spotlight', colors: ['#a855f7', '#6366f1'], angle: 120 },
    layout: { radius: 18, shadow: 45 },
  },
  {
    id: 'split-duo',
    name: 'Split Duo Contrast',
    category: 'Modern',
    background: { type: 'split', colors: ['#ec4899', '#8b5cf6'], angle: 90 },
    layout: { radius: 16, shadow: 40 },
  },
  {
    id: 'mesh-candy',
    name: 'Mesh Candy Pop',
    category: 'Vibrant',
    background: { type: 'mesh', colors: ['#ff758c', '#ff7eb3', '#7afcff', '#5b86e5'] },
    layout: { radius: 18, shadow: 50 },
  },
  {
    id: 'striped-studio',
    name: 'Striped Studio',
    category: 'Minimal',
    background: { type: 'solid', colors: ['#f8fafc'], pattern: 'stripes' },
    layout: { radius: 14, shadow: 35 },
  },
];

/**
 * Apply a preset to the state store
 */
export function applyPreset(state: AppState, preset: StylePreset): void {
  // Background
  state.background.type = preset.background.type;
  state.background.colors = [...preset.background.colors];
  if (preset.background.angle !== undefined) state.background.angle = preset.background.angle;
  if (preset.background.wallpaper) state.background.wallpaper = preset.background.wallpaper;
  if (preset.background.noise !== undefined) state.background.noise = preset.background.noise;
  if (preset.background.pattern) state.background.pattern = preset.background.pattern;

  // Layout
  if (preset.layout) {
    if (preset.layout.radius !== undefined) state.layout.radius = preset.layout.radius;
    if (preset.layout.shadow !== undefined) state.layout.shadow = preset.layout.shadow;
    if (preset.layout.shadowStyle !== undefined) state.layout.shadowStyle = preset.layout.shadowStyle;
    if (preset.layout.shadowColor !== undefined) state.layout.shadowColor = preset.layout.shadowColor;
    if (preset.layout.padding !== undefined) state.layout.padding = preset.layout.padding;
  }

  // 3D Effect
  if (preset.effect) {
    if (preset.effect.rotateX !== undefined) state.effect.rotateX = preset.effect.rotateX;
    if (preset.effect.rotateY !== undefined) state.effect.rotateY = preset.effect.rotateY;
    if (preset.effect.rotateZ !== undefined) state.effect.rotateZ = preset.effect.rotateZ;
    if (preset.effect.perspective !== undefined) state.effect.perspective = preset.effect.perspective;
  }
}

/**
 * Pick a random preset
 */
export function getRandomPreset(excludeId?: string): StylePreset {
  const pool = excludeId ? PRESETS.filter((p) => p.id !== excludeId) : PRESETS;
  const idx = Math.floor(Math.random() * pool.length);
  return pool[idx];
}
