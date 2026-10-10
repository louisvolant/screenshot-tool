import { Store } from '../../core/store/store';

export type SocialPlatformId =
  | 'x'
  | 'instagram'
  | 'linkedin'
  | 'facebook'
  | 'tiktok'
  | 'threads'
  | 'bluesky'
  | 'mastodon';

export interface PlatformTheme {
  bg: string;
  text: string;
  muted: string;
  line: string;
  accent: string;
  verified: string;
}

export const PLATFORMS_CONFIG: Record<SocialPlatformId, { name: string; light: PlatformTheme; dark: PlatformTheme }> = {
  x: {
    name: 'X (Twitter)',
    light: { bg: '#ffffff', text: '#0f1419', muted: '#536471', line: '#eff3f4', accent: '#1d9bf0', verified: '#1d9bf0' },
    dark: { bg: '#000000', text: '#e7e9ea', muted: '#71767b', line: '#2f3336', accent: '#1d9bf0', verified: '#1d9bf0' },
  },
  instagram: {
    name: 'Instagram',
    light: { bg: '#ffffff', text: '#000000', muted: '#737373', line: '#efefef', accent: '#00376b', verified: '#0095f6' },
    dark: { bg: '#000000', text: '#f5f5f5', muted: '#a8a8a8', line: '#262626', accent: '#e0f1ff', verified: '#0095f6' },
  },
  linkedin: {
    name: 'LinkedIn',
    light: { bg: '#ffffff', text: '#191919', muted: '#666666', line: '#e8e8e8', accent: '#0a66c2', verified: '#0a66c2' },
    dark: { bg: '#1b1f23', text: '#e9e9e9', muted: '#a8a8a8', line: '#38434f', accent: '#71b7fb', verified: '#71b7fb' },
  },
  facebook: {
    name: 'Facebook',
    light: { bg: '#ffffff', text: '#050505', muted: '#65676b', line: '#ced0d4', accent: '#0064d1', verified: '#1877f2' },
    dark: { bg: '#242526', text: '#e4e6eb', muted: '#b0b3b8', line: '#3e4042', accent: '#4599ff', verified: '#1877f2' },
  },
  tiktok: {
    name: 'TikTok',
    light: { bg: '#ffffff', text: '#161823', muted: '#8a8b91', line: '#ececed', accent: '#161823', verified: '#20d5ec' },
    dark: { bg: '#121212', text: '#ffffff', muted: '#a1a2a7', line: '#2f2f2f', accent: '#ffffff', verified: '#20d5ec' },
  },
  threads: {
    name: 'Threads',
    light: { bg: '#ffffff', text: '#000000', muted: '#999999', line: '#e5e5e5', accent: '#0095f6', verified: '#0095f6' },
    dark: { bg: '#101010', text: '#f3f5f7', muted: '#777777', line: '#2d2d2d', accent: '#0095f6', verified: '#0095f6' },
  },
  bluesky: {
    name: 'Bluesky',
    light: { bg: '#ffffff', text: '#0b0f14', muted: '#42576c', line: '#d4dbe2', accent: '#1083fe', verified: '#1083fe' },
    dark: { bg: '#161e27', text: '#f1f3f5', muted: '#aebbc9', line: '#2e4052', accent: '#208bfe', verified: '#208bfe' },
  },
  mastodon: {
    name: 'Mastodon',
    light: { bg: '#ffffff', text: '#000000', muted: '#45455f', line: '#d9d9e8', accent: '#6364ff', verified: '#6364ff' },
    dark: { bg: '#181821', text: '#ffffff', muted: '#9b9bb5', line: '#2c2c3d', accent: '#8c8dff', verified: '#8c8dff' },
  },
};

export class SocialTool {
  private store: Store;
  private avatarImg: HTMLImageElement | null = null;
  private postImg: HTMLImageElement | null = null;

  constructor(store: Store) {
    this.store = store;
  }

  public renderContent(): HTMLCanvasElement {
    const s = this.store.state;
    const platform = (s.social.platform || 'x') as SocialPlatformId;
    const appearance = s.social.appearance === 'dark' ? 'dark' : 'light';
    const cfg = PLATFORMS_CONFIG[platform] || PLATFORMS_CONFIG.x;
    const theme = cfg[appearance];

    const cardW = 540;
    const pad = 24;

    // Temporary measure canvas to calculate height
    const measureCanvas = document.createElement('canvas');
    const mctx = measureCanvas.getContext('2d')!;
    mctx.font = '400 15px -apple-system, sans-serif';

    const textLines = this.wrapText(mctx, s.social.text || '', cardW - pad * 2);
    const lineHeight = 22;
    const textHeight = textLines.length * lineHeight;

    const hasImage = Boolean(this.postImg);
    const imgHeight = hasImage ? 240 : 0;
    const metricsH = 40;
    const headerH = platform === 'linkedin' && s.social.headline ? 72 : 56;

    const cardH = pad + headerH + 12 + textHeight + (hasImage ? imgHeight + 16 : 0) + 16 + metricsH + pad;

    const canvas = document.createElement('canvas');
    canvas.width = cardW;
    canvas.height = cardH;
    const ctx = canvas.getContext('2d')!;

    // Card Surface
    ctx.fillStyle = theme.bg;
    ctx.beginPath();
    ctx.roundRect(0, 0, cardW, cardH, 20);
    ctx.fill();

    // Subtle border
    ctx.strokeStyle = theme.line;
    ctx.lineWidth = 1;
    ctx.stroke();

    // 1. Author Header
    const avatarR = 22;
    const avatarX = pad + avatarR;
    const avatarY = pad + avatarR;

    ctx.save();
    ctx.beginPath();
    ctx.arc(avatarX, avatarY, avatarR, 0, Math.PI * 2);
    ctx.clip();
    if (this.avatarImg) {
      ctx.drawImage(this.avatarImg, pad, pad, avatarR * 2, avatarR * 2);
    } else {
      // Gradient avatar placeholder
      const avGrad = ctx.createLinearGradient(pad, pad, pad + avatarR * 2, pad + avatarR * 2);
      avGrad.addColorStop(0, '#6366f1');
      avGrad.addColorStop(1, '#ec4899');
      ctx.fillStyle = avGrad;
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = '600 18px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const initials = (s.social.name || 'U').charAt(0);
      ctx.fillText(initials, avatarX, avatarY);
    }
    ctx.restore();

    // Author Name & Badge
    let infoX = pad + avatarR * 2 + 12;
    let nameY = pad + 16;

    ctx.font = '700 15px -apple-system, sans-serif';
    ctx.fillStyle = theme.text;
    ctx.textAlign = 'left';
    ctx.fillText(s.social.name || 'User', infoX, nameY);

    if (s.social.verified) {
      const nameW = ctx.measureText(s.social.name || 'User').width;
      const badgeX = infoX + nameW + 6;
      ctx.fillStyle = theme.verified;
      ctx.beginPath();
      ctx.arc(badgeX + 6, nameY - 4, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = '700 9px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('✓', badgeX + 6, nameY - 1);
    }

    // Handle & Date
    ctx.font = '400 13px -apple-system, sans-serif';
    ctx.fillStyle = theme.muted;
    ctx.textAlign = 'left';
    const handleStr = `@${(s.social.handle || 'user').replace('@', '')}`;
    ctx.fillText(handleStr, infoX, nameY + 18);

    if (platform === 'linkedin' && s.social.headline) {
      ctx.fillText(s.social.headline, infoX, nameY + 34);
    }

    // Platform Logo on top-right if enabled
    if (s.social.logo) {
      ctx.fillStyle = theme.accent;
      ctx.font = '600 13px sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(cfg.name.split(' ')[0], cardW - pad, pad + 16);
    }

    // 2. Post Body Text
    let bodyY = pad + headerH + 16;
    ctx.font = '400 15px -apple-system, sans-serif';
    ctx.fillStyle = theme.text;
    ctx.textAlign = 'left';

    textLines.forEach((line) => {
      ctx.fillText(line, pad, bodyY);
      bodyY += lineHeight;
    });

    // 3. Optional Post Image
    if (this.postImg) {
      const imgY = bodyY + 6;
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(pad, imgY, cardW - pad * 2, imgHeight, 12);
      ctx.clip();
      ctx.drawImage(this.postImg, pad, imgY, cardW - pad * 2, imgHeight);
      ctx.restore();
      bodyY += imgHeight + 16;
    }

    // 4. Timestamp & Line
    bodyY += 8;
    ctx.font = '400 12px -apple-system, sans-serif';
    ctx.fillStyle = theme.muted;
    ctx.fillText(s.social.date || '10:42 AM · Oct 10, 2026', pad, bodyY);

    bodyY += 12;
    ctx.strokeStyle = theme.line;
    ctx.beginPath();
    ctx.moveTo(pad, bodyY);
    ctx.lineTo(cardW - pad, bodyY);
    ctx.stroke();

    // 5. Engagement Metrics Row
    const metricY = bodyY + 22;
    const metrics = [
      { icon: '💬', val: s.social.comments },
      { icon: '🔁', val: s.social.reposts },
      { icon: '❤️', val: s.social.likes },
      { icon: '📊', val: s.social.views },
    ];

    const colW = (cardW - pad * 2) / 4;
    ctx.font = '500 13px -apple-system, sans-serif';
    metrics.forEach((m, i) => {
      if (!m.val) return;
      const x = pad + i * colW;
      ctx.fillStyle = theme.muted;
      ctx.fillText(`${m.icon} ${m.val}`, x, metricY);
    });

    return canvas;
  }

  private wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
    const lines: string[] = [];
    for (const paragraph of text.split('\n')) {
      let current = '';
      for (const word of paragraph.split(' ')) {
        const test = current ? `${current} ${word}` : word;
        if (ctx.measureText(test).width > maxWidth && current) {
          lines.push(current);
          current = word;
        } else {
          current = test;
        }
      }
      if (current) lines.push(current);
    }
    return lines;
  }

  public renderSettingsUI(container: HTMLElement, onUpdate: () => void): void {
    const s = this.store.state;

    container.innerHTML = `
      <!-- Platform Selector -->
      <div class="field">
        <label class="field-label">Platform</label>
        <select id="social-platform">
          ${Object.entries(PLATFORMS_CONFIG).map(([id, p]) => `
            <option value="${id}" ${s.social.platform === id ? 'selected' : ''}>${p.name}</option>
          `).join('')}
        </select>
      </div>

      <!-- Theme Appearance -->
      <div class="field">
        <label class="field-label">Appearance</label>
        <div class="segmented" id="social-appearance-seg">
          <button class="seg-btn ${s.social.appearance === 'light' ? 'active' : ''}" data-val="light">Light</button>
          <button class="seg-btn ${s.social.appearance === 'dark' ? 'active' : ''}" data-val="dark">Dark</button>
        </div>
      </div>

      <!-- Author Credentials -->
      <div class="field">
        <label class="field-label">Author Name</label>
        <input type="text" id="social-name" value="${s.social.name || ''}" placeholder="Sarah Connor" />
      </div>
      <div class="field">
        <label class="field-label">Username / Handle</label>
        <input type="text" id="social-handle" value="${s.social.handle || ''}" placeholder="sarah_c" />
      </div>
      <div class="field">
        <label class="field-label">Author Headline (LinkedIn)</label>
        <input type="text" id="social-headline" value="${s.social.headline || ''}" placeholder="Senior Product Designer" />
      </div>
      <div class="field" style="display: flex; flex-direction: row; align-items: center; justify-content: space-between;">
        <label class="field-label" style="margin: 0;">Verified Badge</label>
        <input type="checkbox" id="social-verified" ${s.social.verified ? 'checked' : ''} />
      </div>

      <!-- Post Body Text -->
      <div class="field">
        <div class="field-label">
          <span>Post Text</span>
          <span class="field-value" id="social-char-count">${(s.social.text || '').length} chars</span>
        </div>
        <textarea id="social-text" rows="4">${s.social.text || ''}</textarea>
      </div>

      <!-- Engagement Metrics -->
      <div class="field">
        <label class="field-label">Metrics (Likes, Comments, Reposts, Views)</label>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
          <input type="text" id="social-likes" value="${s.social.likes || ''}" placeholder="Likes (e.g. 1.4k)" />
          <input type="text" id="social-comments" value="${s.social.comments || ''}" placeholder="Comments (e.g. 24)" />
          <input type="text" id="social-reposts" value="${s.social.reposts || ''}" placeholder="Reposts (e.g. 118)" />
          <input type="text" id="social-views" value="${s.social.views || ''}" placeholder="Views (e.g. 32k)" />
        </div>
      </div>
    `;

    // Event Listeners
    container.querySelector('#social-platform')?.addEventListener('change', (e) => {
      this.store.set('social.platform', (e.target as HTMLSelectElement).value);
      onUpdate();
    });

    container.querySelector('#social-appearance-seg')?.addEventListener('click', (e) => {
      const btn = (e.target as HTMLElement).closest('.seg-btn') as HTMLElement;
      if (!btn) return;
      container.querySelectorAll('#social-appearance-seg .seg-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      this.store.set('social.appearance', btn.dataset.val);
      onUpdate();
    });

    container.querySelector('#social-name')?.addEventListener('input', (e) => {
      this.store.set('social.name', (e.target as HTMLInputElement).value);
      onUpdate();
    });

    container.querySelector('#social-handle')?.addEventListener('input', (e) => {
      this.store.set('social.handle', (e.target as HTMLInputElement).value);
      onUpdate();
    });

    container.querySelector('#social-headline')?.addEventListener('input', (e) => {
      this.store.set('social.headline', (e.target as HTMLInputElement).value);
      onUpdate();
    });

    container.querySelector('#social-verified')?.addEventListener('change', (e) => {
      this.store.set('social.verified', (e.target as HTMLInputElement).checked);
      onUpdate();
    });

    const textArea = container.querySelector('#social-text') as HTMLTextAreaElement;
    textArea?.addEventListener('input', (e) => {
      const val = (e.target as HTMLTextAreaElement).value;
      this.store.set('social.text', val);
      const countEl = container.querySelector('#social-char-count');
      if (countEl) countEl.textContent = `${val.length} chars`;
      onUpdate();
    });

    container.querySelector('#social-likes')?.addEventListener('input', (e) => {
      this.store.set('social.likes', (e.target as HTMLInputElement).value);
      onUpdate();
    });
    container.querySelector('#social-comments')?.addEventListener('input', (e) => {
      this.store.set('social.comments', (e.target as HTMLInputElement).value);
      onUpdate();
    });
    container.querySelector('#social-reposts')?.addEventListener('input', (e) => {
      this.store.set('social.reposts', (e.target as HTMLInputElement).value);
      onUpdate();
    });
    container.querySelector('#social-views')?.addEventListener('input', (e) => {
      this.store.set('social.views', (e.target as HTMLInputElement).value);
      onUpdate();
    });
  }
}
