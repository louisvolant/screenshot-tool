export type ToolId =
  | 'screenshot'
  | 'code'
  | 'social'
  | 'testimonial'
  | 'chat'
  | 'notification'
  | 'announce';

export type FrameType =
  | 'none'
  | 'desktop'
  | 'windows'
  | 'browser'
  | 'phone'
  | 'tablet'
  | 'laptop'
  | 'watch';

export type DeviceColor =
  | 'auto'
  | 'gold'
  | 'rose'
  | 'blue'
  | 'green'
  | 'purple'
  | 'red'
  | 'midnight';

export type CameraType = 'island' | 'notch' | 'hole';

export type BackgroundType =
  | 'gradient'
  | 'mesh'
  | 'solid'
  | 'split'
  | 'spotlight'
  | 'wallpaper'
  | 'image';

export type PatternType = 'none' | 'dots' | 'grid' | 'stripes';

export type AspectRatio =
  | 'auto'
  | '16:9'
  | '4:3'
  | '3:2'
  | '1:1'
  | '4:5'
  | '9:16'
  | '1200:630'
  | '1500:500';

export type Alignment =
  | 'tl' | 'tc' | 'tr'
  | 'ml' | 'mc' | 'mr'
  | 'bl' | 'bc' | 'br';

export type ShadowStyle = 'soft' | 'hard';

export type ExportFormat = 'png' | 'jpeg' | 'webp';
export type ExportScale = 1 | 2 | 3 | 4;

export interface FrameState {
  type: FrameType;
  theme: 'light' | 'dark';
  color: DeviceColor;
  url: string;
  title: string;
  camera: CameraType;
}

export interface BackgroundState {
  type: BackgroundType;
  colors: string[];
  angle: number;
  solid: string;
  wallpaper: string;
  blur: number;
  noise: number;
  pattern: PatternType;
  patternOpacity: number;
  imageSrc?: string;
}

export interface LayoutState {
  aspect: AspectRatio;
  padding: number;
  scale: number;
  radius: number;
  shadow: number;
  shadowStyle: ShadowStyle;
  shadowColor: string;
  shadowAngle: number;
  border: {
    width: number;
    color: string;
    opacity: number;
  };
  halo: number;
  stack: 'none' | 'stack';
  align: Alignment;
  offsetX: number;
  offsetY: number;
}

export interface EffectState {
  rotateX: number;
  rotateY: number;
  rotateZ: number;
  perspective: number;
  reflection: number;
  decor: 'none' | 'selection';
}

export interface TextOverlayState {
  title: string;
  subtitle: string;
  size: 's' | 'm' | 'l';
  align: 'left' | 'center' | 'right';
  position: 'top' | 'bottom';
  font: 'sans' | 'display' | 'mono';
  weight: 'bold' | 'regular';
  color: 'auto' | 'custom';
  customColor: string;
}

export interface ExportState {
  format: ExportFormat;
  scale: ExportScale;
  watermark: boolean;
  prefix: string;
}

export interface AnnotationItem {
  id: string;
  type: 'text' | 'arrow' | 'box' | 'blur' | 'sticker' | 'loupe';
  attached: boolean;
  x: number;
  y: number;
  w?: number;
  h?: number;
  x1?: number;
  y1?: number;
  x2?: number;
  y2?: number;
  text?: string;
  size?: number;
  color?: string;
  font?: 'sans' | 'display' | 'mono';
  align?: 'left' | 'center' | 'right';
  pill?: boolean;
  pillColor?: string;
  width?: number;
  curve?: number;
  head?: string;
  dash?: 'solid' | 'dashed';
  style?: 'outline' | 'filled';
  radius?: number;
  mode?: 'blur' | 'pixelate';
  strength?: number;
  emoji?: string;
  r?: number;
  zoom?: number;
}

export interface AppState {
  activeTool: ToolId;
  frame: FrameState;
  background: BackgroundState;
  layout: LayoutState;
  effect: EffectState;
  text: TextOverlayState;
  export: ExportState;
  annotations: AnnotationItem[];
  // Tool specific configurations will be plugged here as we implement them
  shot: Record<string, any>;
  code: Record<string, any>;
  social: Record<string, any>;
  testimonial: Record<string, any>;
  chat: Record<string, any>;
  notif: Record<string, any>;
  announce: Record<string, any>;
}

export type StateListener = (state: AppState, changedPaths: string[]) => void;
