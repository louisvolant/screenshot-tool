import { Store } from '../../core/store/store';
import { renderFramedContent } from '../../core/frames/frames';

export type NotifPlatformId = 'ios' | 'android' | 'macos' | 'toast';
export type ToastType = 'success' | 'info' | 'warning' | 'error';

const TOAST_COLORS: Record<ToastType, string> = {
  success: '#16a34a',
  info: '#2563eb',
  warning: '#f59e0b',
  error: '#dc2626',
};

const TOAST_ICONS: Record<ToastType, string> = {
  success: '✓',
  info: 'ℹ',
  warning: '⚠',
  error: '✕',
};

export class NotificationTool {
  private store: Store;

  constructor(store: Store) {
    this.store = store;
  }

  public renderContent(): HTMLCanvasElement {
    const s = this.store.state;
    const isDevice = Boolean(s.notif.device);

    const notifCard = this.renderNotifCard();

    if (!isDevice) {
      return notifCard;
    }

    // Embed in device screen
    const platform = s.notif.platform as NotifPlatformId;
    let screenW = 390;
    let screenH = 844;
    let frameType: any = 'phone';
    let camera: any = 'island';

    if (platform === 'android') {
      screenW = 412;
      screenH = 892;
      frameType = 'phone';
      camera = 'hole';
    } else if (platform === 'macos') {
      screenW = 800;
      screenH = 500;
      frameType = 'laptop';
      camera = 'island';
    } else if (platform === 'toast') {
      screenW = 800;
      screenH = 500;
      frameType = 'browser';
      camera = 'island';
    }

    const screenCanvas = document.createElement('canvas');
    screenCanvas.width = screenW;
    screenCanvas.height = screenH;
    const sctx = screenCanvas.getContext('2d')!;

    // Lock screen wallpaper
    const bgGrad = sctx.createLinearGradient(0, 0, screenW, screenH);
    bgGrad.addColorStop(0, '#1e1b4b');
    bgGrad.addColorStop(1, '#6366f1');
    sctx.fillStyle = bgGrad;
    sctx.fillRect(0, 0, screenW, screenH);

    // Lockscreen Clock & Date
    if (platform === 'ios' || platform === 'android') {
      sctx.fillStyle = '#ffffff';
      sctx.textAlign = 'center';

      sctx.font = '500 16px -apple-system, sans-serif';
      sctx.fillText(s.notif.date || 'Saturday, October 10', screenW / 2, 120);

      sctx.font = '700 72px -apple-system, sans-serif';
      sctx.fillText(s.notif.clock || '09:41', screenW / 2, 195);

      // Draw notification card in center of screen
      const notifY = 240;
      const notifX = (screenW - notifCard.width) / 2;
      sctx.drawImage(notifCard, notifX, notifY);
    } else if (platform === 'macos') {
      // Top-right banner on desktop
      const notifX = screenW - notifCard.width - 20;
      const notifY = 20;
      sctx.drawImage(notifCard, notifX, notifY);
    } else {
      // Toast top-center in browser
      const notifX = (screenW - notifCard.width) / 2;
      const notifY = 30;
      sctx.drawImage(notifCard, notifX, notifY);
    }

    return renderFramedContent(screenCanvas, {
      type: frameType,
      theme: s.notif.appearance === 'dark' ? 'dark' : 'light',
      color: 'auto',
      url: 'https://app.studio/dashboard',
      title: 'Dashboard',
      camera,
    }, 16);
  }

  private renderNotifCard(): HTMLCanvasElement {
    const s = this.store.state;
    const platform = (s.notif.platform || 'ios') as NotifPlatformId;
    const isDark = s.notif.appearance === 'dark';

    switch (platform) {
      case 'toast':
        return this.renderToastCard();
      case 'macos':
        return this.renderMacOSCard();
      case 'android':
        return this.renderAndroidCard();
      case 'ios':
      default:
        return this.renderIOSCard();
    }
  }

  private renderIOSCard(): HTMLCanvasElement {
    const s = this.store.state;
    const isDark = s.notif.appearance === 'dark';
    const cardW = 360;
    const pad = 16;
    const cardH = 90;

    const canvas = document.createElement('canvas');
    canvas.width = cardW;
    canvas.height = cardH;
    const ctx = canvas.getContext('2d')!;

    // Translucent blur card effect
    ctx.fillStyle = isDark ? 'rgba(35, 35, 38, 0.92)' : 'rgba(255, 255, 255, 0.92)';
    ctx.beginPath();
    ctx.roundRect(0, 0, cardW, cardH, 20);
    ctx.fill();

    // App Icon
    const iconSize = 36;
    const iconGrad = ctx.createLinearGradient(pad, pad, pad + iconSize, pad + iconSize);
    iconGrad.addColorStop(0, '#6366f1');
    iconGrad.addColorStop(1, '#ec4899');
    ctx.fillStyle = iconGrad;
    ctx.beginPath();
    ctx.roundRect(pad, pad, iconSize, iconSize, 9);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = '700 16px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('✦', pad + iconSize / 2, pad + iconSize / 2);

    // Title & Time
    const textX = pad + iconSize + 12;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';

    ctx.font = '700 14px -apple-system, sans-serif';
    ctx.fillStyle = isDark ? '#ffffff' : '#000000';
    ctx.fillText(s.notif.title || 'Notification Title', textX, pad + 15);

    ctx.font = '400 12px -apple-system, sans-serif';
    ctx.fillStyle = isDark ? '#8e8e93' : '#6b7280';
    ctx.textAlign = 'right';
    ctx.fillText(s.notif.time || 'now', cardW - pad, pad + 15);

    // Message Body
    ctx.textAlign = 'left';
    ctx.font = '400 13px -apple-system, sans-serif';
    ctx.fillStyle = isDark ? '#d1d5db' : '#374151';
    const message = s.notif.message || 'Notification description text goes here.';
    ctx.fillText(message, textX, pad + 38);

    return canvas;
  }

  private renderAndroidCard(): HTMLCanvasElement {
    const s = this.store.state;
    const isDark = s.notif.appearance === 'dark';
    const cardW = 380;
    const pad = 16;
    const cardH = 92;

    const canvas = document.createElement('canvas');
    canvas.width = cardW;
    canvas.height = cardH;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = isDark ? '#2b2930' : '#ffffff';
    ctx.beginPath();
    ctx.roundRect(0, 0, cardW, cardH, 16);
    ctx.fill();

    // Small circle icon
    ctx.fillStyle = '#6750a4';
    ctx.beginPath();
    ctx.arc(pad + 12, pad + 12, 12, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = isDark ? '#cac4d0' : '#49454f';
    ctx.font = '500 12px Roboto, sans-serif';
    ctx.fillText(s.notif.app || 'App', pad + 32, pad + 16);

    ctx.fillStyle = isDark ? '#938f99' : '#79747e';
    ctx.fillText(`· ${s.notif.time || 'now'}`, pad + 32 + ctx.measureText(s.notif.app || 'App').width + 8, pad + 16);

    // Title & Text
    ctx.font = '600 14px Roboto, sans-serif';
    ctx.fillStyle = isDark ? '#e6e1e5' : '#1d1b20';
    ctx.fillText(s.notif.title || 'Alert', pad + 8, pad + 42);

    ctx.font = '400 13px Roboto, sans-serif';
    ctx.fillStyle = isDark ? '#cac4d0' : '#49454f';
    ctx.fillText(s.notif.message || 'Details text', pad + 8, pad + 62);

    return canvas;
  }

  private renderMacOSCard(): HTMLCanvasElement {
    const s = this.store.state;
    const isDark = s.notif.appearance === 'dark';
    const cardW = 340;
    const pad = 14;
    const cardH = 82;

    const canvas = document.createElement('canvas');
    canvas.width = cardW;
    canvas.height = cardH;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = isDark ? 'rgba(40, 40, 44, 0.95)' : 'rgba(240, 240, 244, 0.95)';
    ctx.beginPath();
    ctx.roundRect(0, 0, cardW, cardH, 14);
    ctx.fill();

    // App Icon
    ctx.fillStyle = '#2563eb';
    ctx.beginPath();
    ctx.roundRect(pad, pad, 32, 32, 8);
    ctx.fill();

    const textX = pad + 44;
    ctx.font = '700 13px -apple-system, sans-serif';
    ctx.fillStyle = isDark ? '#f4f4f5' : '#18181b';
    ctx.fillText(s.notif.title || 'macOS Push Alert', textX, pad + 14);

    ctx.font = '400 11px -apple-system, sans-serif';
    ctx.fillStyle = isDark ? '#a1a1aa' : '#71717a';
    ctx.fillText(s.notif.time || 'now', cardW - pad - 24, pad + 14);

    ctx.font = '400 12px -apple-system, sans-serif';
    ctx.fillStyle = isDark ? '#d4d4d8' : '#3f3f46';
    ctx.fillText(s.notif.message || 'Notification body content', textX, pad + 34);

    return canvas;
  }

  private renderToastCard(): HTMLCanvasElement {
    const s = this.store.state;
    const type = (s.notif.type || 'success') as ToastType;
    const isDark = s.notif.appearance === 'dark';
    const color = TOAST_COLORS[type] || TOAST_COLORS.success;
    const iconChar = TOAST_ICONS[type] || '✓';

    const cardW = 380;
    const pad = 16;
    const cardH = 68;

    const canvas = document.createElement('canvas');
    canvas.width = cardW;
    canvas.height = cardH;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = isDark ? '#1f2937' : '#ffffff';
    ctx.beginPath();
    ctx.roundRect(0, 0, cardW, cardH, 12);
    ctx.fill();

    // Accent line on left border
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.roundRect(0, 0, 5, cardH, [12, 0, 0, 12]);
    ctx.fill();

    // Icon circle
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(pad + 14, cardH / 2, 14, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = '700 14px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(iconChar, pad + 14, cardH / 2);

    // Title & Text
    const textX = pad + 38;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';

    ctx.font = '600 13px -apple-system, sans-serif';
    ctx.fillStyle = isDark ? '#f9fafb' : '#111827';
    ctx.fillText(s.notif.title || 'Action Successful', textX, 28);

    ctx.font = '400 12px -apple-system, sans-serif';
    ctx.fillStyle = isDark ? '#9ca3af' : '#6b7280';
    ctx.fillText(s.notif.message || 'Your changes were saved successfully.', textX, 48);

    return canvas;
  }

  public renderSettingsUI(container: HTMLElement, onUpdate: () => void): void {
    const s = this.store.state;

    container.innerHTML = `
      <!-- Platform Selector -->
      <div class="field">
        <label class="field-label">Environment Style</label>
        <div class="segmented" id="notif-platform-seg">
          <button class="seg-btn ${s.notif.platform === 'ios' ? 'active' : ''}" data-val="ios">iOS</button>
          <button class="seg-btn ${s.notif.platform === 'android' ? 'active' : ''}" data-val="android">Android</button>
          <button class="seg-btn ${s.notif.platform === 'macos' ? 'active' : ''}" data-val="macos">macOS</button>
          <button class="seg-btn ${s.notif.platform === 'toast' ? 'active' : ''}" data-val="toast">Toast</button>
        </div>
      </div>

      <!-- Toast Variant (Visible only for Toast) -->
      <div class="field" id="toast-type-field" style="${s.notif.platform === 'toast' ? '' : 'display: none;'}">
        <label class="field-label">Toast Alert Type</label>
        <div class="segmented" id="toast-type-seg">
          <button class="seg-btn ${s.notif.type === 'success' ? 'active' : ''}" data-val="success">Success</button>
          <button class="seg-btn ${s.notif.type === 'info' ? 'active' : ''}" data-val="info">Info</button>
          <button class="seg-btn ${s.notif.type === 'warning' ? 'active' : ''}" data-val="warning">Warning</button>
          <button class="seg-btn ${s.notif.type === 'error' ? 'active' : ''}" data-val="error">Error</button>
        </div>
      </div>

      <!-- Theme Appearance -->
      <div class="field">
        <label class="field-label">Appearance</label>
        <div class="segmented" id="notif-appearance-seg">
          <button class="seg-btn ${s.notif.appearance === 'light' ? 'active' : ''}" data-val="light">Light</button>
          <button class="seg-btn ${s.notif.appearance === 'dark' ? 'active' : ''}" data-val="dark">Dark</button>
        </div>
      </div>

      <!-- Device Embed Toggle -->
      <div class="field" style="display: flex; flex-direction: row; align-items: center; justify-content: space-between;">
        <label class="field-label" style="margin: 0;">Embed in Device Screen</label>
        <input type="checkbox" id="notif-device" ${s.notif.device ? 'checked' : ''} />
      </div>

      <!-- Notification Content -->
      <div class="field">
        <label class="field-label">Notification Title</label>
        <input type="text" id="notif-title" value="${s.notif.title || ''}" placeholder="New Milestone" />
      </div>
      <div class="field">
        <label class="field-label">Notification Message</label>
        <input type="text" id="notif-message" value="${s.notif.message || ''}" placeholder="Description" />
      </div>
      <div class="field">
        <label class="field-label">Time String</label>
        <input type="text" id="notif-time" value="${s.notif.time || 'now'}" placeholder="now / 2m ago" />
      </div>
    `;

    // Event listeners
    container.querySelector('#notif-platform-seg')?.addEventListener('click', (e) => {
      const btn = (e.target as HTMLElement).closest('.seg-btn') as HTMLElement;
      if (!btn) return;
      container.querySelectorAll('#notif-platform-seg .seg-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const p = btn.dataset.val!;
      this.store.set('notif.platform', p);

      const toastField = container.querySelector('#toast-type-field') as HTMLElement;
      if (toastField) toastField.style.display = p === 'toast' ? '' : 'none';
      onUpdate();
    });

    container.querySelector('#toast-type-seg')?.addEventListener('click', (e) => {
      const btn = (e.target as HTMLElement).closest('.seg-btn') as HTMLElement;
      if (!btn) return;
      container.querySelectorAll('#toast-type-seg .seg-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      this.store.set('notif.type', btn.dataset.val);
      onUpdate();
    });

    container.querySelector('#notif-appearance-seg')?.addEventListener('click', (e) => {
      const btn = (e.target as HTMLElement).closest('.seg-btn') as HTMLElement;
      if (!btn) return;
      container.querySelectorAll('#notif-appearance-seg .seg-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      this.store.set('notif.appearance', btn.dataset.val);
      onUpdate();
    });

    container.querySelector('#notif-device')?.addEventListener('change', (e) => {
      this.store.set('notif.device', (e.target as HTMLInputElement).checked);
      onUpdate();
    });

    container.querySelector('#notif-title')?.addEventListener('input', (e) => {
      this.store.set('notif.title', (e.target as HTMLInputElement).value);
      onUpdate();
    });

    container.querySelector('#notif-message')?.addEventListener('input', (e) => {
      this.store.set('notif.message', (e.target as HTMLInputElement).value);
      onUpdate();
    });

    container.querySelector('#notif-time')?.addEventListener('input', (e) => {
      this.store.set('notif.time', (e.target as HTMLInputElement).value);
      onUpdate();
    });
  }
}
