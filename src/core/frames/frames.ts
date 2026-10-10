import { FrameState, DeviceColor } from '../store/types';
import { adjust, mix, rgba } from '../render/colors';

const TRAFFIC_LIGHTS = ['#ff5f57', '#febc2e', '#28c840'];

export const DEVICE_FINISHES: Record<string, string> = {
  midnight: '#262c40',
  gold: '#e3cba4',
  rose: '#efc1c4',
  blue: '#9fbce0',
  green: '#a9cdb6',
  purple: '#c3b6e6',
  red: '#c8343a',
};

export interface FrameGeometry {
  totalW: number;
  totalH: number;
  contentX: number;
  contentY: number;
  radius: number;
}

export function computeFrameGeometry(
  imgW: number,
  imgH: number,
  frame: FrameState,
  baseRadius = 16
): FrameGeometry {
  const u = Math.max(0.5, Math.sqrt(imgW * imgH) / 1000);

  switch (frame.type) {
    case 'desktop': {
      const barH = Math.round(36 * u);
      return {
        totalW: imgW,
        totalH: imgH + barH,
        contentX: 0,
        contentY: barH,
        radius: baseRadius,
      };
    }

    case 'windows': {
      const barH = Math.round(34 * u);
      return {
        totalW: imgW,
        totalH: imgH + barH,
        contentX: 0,
        contentY: barH,
        radius: Math.min(8, baseRadius),
      };
    }

    case 'browser': {
      const barH = Math.round(48 * u);
      return {
        totalW: imgW,
        totalH: imgH + barH,
        contentX: 0,
        contentY: barH,
        radius: baseRadius,
      };
    }

    case 'phone': {
      const bezel = Math.round(18 * u);
      return {
        totalW: imgW + bezel * 2,
        totalH: imgH + bezel * 2,
        contentX: bezel,
        contentY: bezel,
        radius: Math.max(38 * u, baseRadius * 2),
      };
    }

    case 'tablet': {
      const bezel = Math.round(24 * u);
      return {
        totalW: imgW + bezel * 2,
        totalH: imgH + bezel * 2,
        contentX: bezel,
        contentY: bezel,
        radius: Math.max(28 * u, baseRadius * 1.5),
      };
    }

    case 'laptop': {
      const bezel = Math.round(16 * u);
      const bottomBar = Math.round(22 * u);
      return {
        totalW: imgW + bezel * 2,
        totalH: imgH + bezel * 2 + bottomBar,
        contentX: bezel,
        contentY: bezel,
        radius: Math.max(16 * u, baseRadius),
      };
    }

    case 'watch': {
      const bezel = Math.round(26 * u);
      const strapH = Math.round(imgH * 0.28);
      return {
        totalW: imgW + bezel * 2 + 12 * u, // crown on right
        totalH: imgH + bezel * 2 + strapH * 2,
        contentX: bezel,
        contentY: bezel + strapH,
        radius: Math.max(45 * u, baseRadius * 2.5),
      };
    }

    case 'none':
    default:
      return {
        totalW: imgW,
        totalH: imgH,
        contentX: 0,
        contentY: 0,
        radius: baseRadius,
      };
  }
}

/**
 * Renders the content wrapped in the chosen hardware or window frame
 */
export function renderFramedContent(
  contentCanvas: HTMLCanvasElement,
  frame: FrameState,
  baseRadius = 16
): HTMLCanvasElement {
  const imgW = contentCanvas.width;
  const imgH = contentCanvas.height;
  const geo = computeFrameGeometry(imgW, imgH, frame, baseRadius);

  const out = document.createElement('canvas');
  out.width = geo.totalW;
  out.height = geo.totalH;
  const ctx = out.getContext('2d')!;

  const isDark = frame.theme === 'dark';
  const u = Math.max(0.5, Math.sqrt(imgW * imgH) / 1000);

  // Chassis finish color
  const finishHex = frame.color !== 'auto' && DEVICE_FINISHES[frame.color]
    ? DEVICE_FINISHES[frame.color]
    : isDark ? '#1e1f25' : '#e5e7eb';

  ctx.save();

  switch (frame.type) {
    case 'desktop': {
      const barH = geo.contentY;
      // Window header bar
      ctx.fillStyle = isDark ? '#22232a' : '#f1f1f4';
      ctx.beginPath();
      ctx.roundRect(0, 0, geo.totalW, geo.totalH, geo.radius);
      ctx.fill();

      // Traffic lights
      const r = 5.5 * u;
      TRAFFIC_LIGHTS.forEach((c, idx) => {
        ctx.beginPath();
        ctx.arc(18 * u + idx * 18 * u, barH / 2, r, 0, Math.PI * 2);
        ctx.fillStyle = c;
        ctx.fill();
      });

      // Window title
      if (frame.title) {
        ctx.font = `500 ${Math.round(13 * u)}px -apple-system, sans-serif`;
        ctx.fillStyle = isDark ? '#a1a1aa' : '#52525b';
        ctx.textAlign = 'center';
        ctx.fillText(frame.title, geo.totalW / 2, barH / 2 + 4 * u);
      }
      break;
    }

    case 'windows': {
      const barH = geo.contentY;
      ctx.fillStyle = isDark ? '#202020' : '#f3f3f3';
      ctx.beginPath();
      ctx.roundRect(0, 0, geo.totalW, geo.totalH, geo.radius);
      ctx.fill();

      // Title
      ctx.font = `500 ${Math.round(12 * u)}px "Segoe UI", sans-serif`;
      ctx.fillStyle = isDark ? '#d4d4d8' : '#3f3f46';
      ctx.textAlign = 'left';
      ctx.fillText(frame.title || 'Application', 16 * u, barH / 2 + 4 * u);

      // Windows window controls (minimize, maximize, close)
      const ctrlW = 36 * u;
      const xClose = geo.totalW - ctrlW / 2;
      ctx.textAlign = 'center';
      ctx.font = `400 ${Math.round(11 * u)}px "Segoe UI", sans-serif`;
      ctx.fillStyle = isDark ? '#a1a1aa' : '#71717a';
      ctx.fillText('—', geo.totalW - ctrlW * 2.5, barH / 2 + 2 * u);
      ctx.fillText('□', geo.totalW - ctrlW * 1.5, barH / 2 + 3 * u);
      ctx.fillText('✕', xClose, barH / 2 + 4 * u);
      break;
    }

    case 'browser': {
      const barH = geo.contentY;
      ctx.fillStyle = isDark ? '#18181b' : '#f4f4f5';
      ctx.beginPath();
      ctx.roundRect(0, 0, geo.totalW, geo.totalH, geo.radius);
      ctx.fill();

      // Traffic lights
      const r = 5.5 * u;
      TRAFFIC_LIGHTS.forEach((c, idx) => {
        ctx.beginPath();
        ctx.arc(18 * u + idx * 18 * u, barH / 2, r, 0, Math.PI * 2);
        ctx.fillStyle = c;
        ctx.fill();
      });

      // Navigation chevrons (back/forward)
      ctx.font = `600 ${Math.round(14 * u)}px -apple-system, sans-serif`;
      ctx.fillStyle = isDark ? '#71717a' : '#a1a1aa';
      ctx.textAlign = 'center';
      ctx.fillText('‹', 85 * u, barH / 2 + 3 * u);
      ctx.fillText('›', 105 * u, barH / 2 + 3 * u);

      // URL Pill Box
      const pillW = Math.min(geo.totalW * 0.55, 480 * u);
      const pillH = 26 * u;
      const pillX = (geo.totalW - pillW) / 2;
      const pillY = (barH - pillH) / 2;

      ctx.fillStyle = isDark ? '#27272a' : '#e4e4e7';
      ctx.beginPath();
      ctx.roundRect(pillX, pillY, pillW, pillH, pillH / 2);
      ctx.fill();

      // SSL Lock and URL text
      ctx.font = `500 ${Math.round(11 * u)}px -apple-system, sans-serif`;
      ctx.fillStyle = isDark ? '#d4d4d8' : '#3f3f46';
      ctx.textAlign = 'center';
      ctx.fillText(`🔒 ${frame.url || 'https://studio.app'}`, geo.totalW / 2, barH / 2 + 4 * u);
      break;
    }

    case 'phone': {
      // Outer device body / chassis
      ctx.fillStyle = finishHex;
      ctx.beginPath();
      ctx.roundRect(0, 0, geo.totalW, geo.totalH, geo.radius);
      ctx.fill();

      // Antenna band lines / rim
      ctx.lineWidth = 1.5 * u;
      ctx.strokeStyle = rgba('#ffffff', isDark ? 0.15 : 0.4);
      ctx.stroke();

      // Camera: Dynamic Island or Hole
      const topBarY = geo.contentY;
      const islandW = 110 * u;
      const islandH = 28 * u;
      const islandX = (geo.totalW - islandW) / 2;
      const islandY = topBarY + 8 * u;

      ctx.fillStyle = '#000000';
      if (frame.camera === 'hole') {
        ctx.beginPath();
        ctx.arc(geo.totalW / 2, topBarY + 16 * u, 7 * u, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Dynamic Island
        ctx.beginPath();
        ctx.roundRect(islandX, islandY, islandW, islandH, islandH / 2);
        ctx.fill();
      }
      break;
    }

    case 'tablet': {
      ctx.fillStyle = finishHex;
      ctx.beginPath();
      ctx.roundRect(0, 0, geo.totalW, geo.totalH, geo.radius);
      ctx.fill();

      // Front selfie camera dot
      ctx.fillStyle = '#111111';
      ctx.beginPath();
      ctx.arc(geo.totalW / 2, geo.contentY / 2, 4 * u, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    case 'laptop': {
      // Laptop top screen housing
      ctx.fillStyle = finishHex;
      ctx.beginPath();
      ctx.roundRect(0, 0, geo.totalW, geo.totalH, geo.radius);
      ctx.fill();

      // Camera notch
      ctx.fillStyle = '#0a0a0a';
      const notchW = 40 * u;
      const notchH = 10 * u;
      ctx.beginPath();
      ctx.roundRect((geo.totalW - notchW) / 2, geo.contentY - 2 * u, notchW, notchH, [0, 0, 4 * u, 4 * u]);
      ctx.fill();

      // Bottom laptop deck notch
      const bottomY = geo.totalH - 22 * u;
      ctx.fillStyle = adjust(finishHex, { light: -0.08 });
      ctx.fillRect(0, bottomY, geo.totalW, 22 * u);

      // Thumb notch opening
      const thumbW = 70 * u;
      ctx.fillStyle = adjust(finishHex, { light: 0.1 });
      ctx.beginPath();
      ctx.roundRect((geo.totalW - thumbW) / 2, bottomY, thumbW, 6 * u, [0, 0, 4 * u, 4 * u]);
      ctx.fill();
      break;
    }

    case 'watch': {
      const strapH = Math.round(imgH * 0.28);
      const strapW = geo.totalW * 0.65;
      const strapX = (geo.totalW - 12 * u - strapW) / 2;

      // Top and bottom silicone straps
      ctx.fillStyle = adjust(finishHex, { light: -0.15 });
      ctx.beginPath();
      ctx.roundRect(strapX, 0, strapW, strapH + 10 * u, [12 * u, 12 * u, 0, 0]);
      ctx.fill();

      ctx.beginPath();
      ctx.roundRect(strapX, geo.totalH - strapH - 10 * u, strapW, strapH + 10 * u, [0, 0, 12 * u, 12 * u]);
      ctx.fill();

      // Watch chassis body
      const bodyW = geo.totalW - 12 * u;
      ctx.fillStyle = finishHex;
      ctx.beginPath();
      ctx.roundRect(0, strapH, bodyW, geo.totalH - strapH * 2, geo.radius);
      ctx.fill();

      // Digital Crown button on right
      ctx.fillStyle = adjust(finishHex, { light: -0.2 });
      ctx.beginPath();
      ctx.roundRect(bodyW, strapH + (geo.totalH - strapH * 2) * 0.25, 10 * u, 32 * u, [0, 4 * u, 4 * u, 0]);
      ctx.fill();
      break;
    }
  }

  // Draw content screen inside frame
  ctx.save();
  ctx.beginPath();
  const innerRadius = frame.type === 'phone' || frame.type === 'tablet' || frame.type === 'watch'
    ? Math.max(12 * u, geo.radius - 8 * u)
    : frame.type === 'none' ? geo.radius : 0;

  ctx.roundRect(geo.contentX, geo.contentY, imgW, imgH, innerRadius);
  ctx.clip();
  ctx.drawImage(contentCanvas, geo.contentX, geo.contentY);
  ctx.restore();

  ctx.restore();
  return out;
}
