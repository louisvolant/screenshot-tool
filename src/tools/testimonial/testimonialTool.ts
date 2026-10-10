import { Store } from '../../core/store/store';
import { getFontFamily } from '../../core/render/fonts';
import { isDark, rgba } from '../../core/render/colors';

export interface TestimonialStyle {
  id: string;
  name: string;
  card: string;
  accent: string;
  background: {
    colors: string[];
    angle: number;
  };
}

export const TESTIMONIAL_STYLES: TestimonialStyle[] = [
  { id: 'sorbet', name: 'Sorbet', card: '#ffffff', accent: '#e0245e', background: { colors: ['#ff9eb5', '#ffc7a8', '#ffc7a8'], angle: 135 } },
  { id: 'creme', name: 'Crème', card: '#fffaf2', accent: '#ea6a1f', background: { colors: ['#ffd9b0', '#ffb199', '#ffb199'], angle: 150 } },
  { id: 'menthe', name: 'Menthe', card: '#ffffff', accent: '#0f9f6e', background: { colors: ['#a5f0d4', '#5fcfa9', '#5fcfa9'], angle: 140 } },
  { id: 'bonbon', name: 'Bonbon', card: '#fff5fb', accent: '#d6409f', background: { colors: ['#fbc2eb', '#c4b5fd', '#fde2f3'], angle: 135 } },
  { id: 'brand', name: 'Studio', card: '#ffffff', accent: '#6d5efc', background: { colors: ['#6d5efc', '#ec5fb0', '#ec5fb0'], angle: 135 } },
  { id: 'ocean', name: 'Ocean', card: '#ffffff', accent: '#2563eb', background: { colors: ['#8fd3ff', '#5b7cfa', '#5b7cfa'], angle: 150 } },
  { id: 'minuit', name: 'Minuit', card: '#1b1836', accent: '#a78bfa', background: { colors: ['#1a1440', '#5b3df5', '#2a1a6e'], angle: 135 } },
  { id: 'reglisse', name: 'Réglisse', card: '#18181c', accent: '#f59e0b', background: { colors: ['#0e0e12', '#26262c', '#26262c'], angle: 135 } },
];

export class TestimonialTool {
  private store: Store;
  private avatarImg: HTMLImageElement | null = null;
  private logoImg: HTMLImageElement | null = null;

  constructor(store: Store) {
    this.store = store;
  }

  public renderContent(): HTMLCanvasElement {
    const s = this.store.state;
    const cardW = 600;
    const pad = 36;
    const isDarkCard = isDark(s.testimonial.cardColor || '#ffffff');
    const textInk = isDarkCard ? '#f8fafc' : '#0f172a';
    const mutedInk = isDarkCard ? '#94a3b8' : '#64748b';
    const accentCol = s.testimonial.accentColor || '#6d5efc';

    const fontFam = getFontFamily(s.testimonial.font || 'sans');
    const quoteText = s.testimonial.text || 'Outstanding service and quality.';

    // Measure quote text height
    const measureCanvas = document.createElement('canvas');
    const mctx = measureCanvas.getContext('2d')!;
    mctx.font = `600 20px ${fontFam}`;
    const quoteLines = this.wrapText(mctx, `“${quoteText}”`, cardW - pad * 2);
    const lineHeight = 30;
    const quoteHeight = quoteLines.length * lineHeight;

    const starsH = s.testimonial.rating > 0 ? 32 : 0;
    const authorH = 56;
    const cardH = pad + (s.testimonial.mark ? 30 : 0) + quoteHeight + 20 + starsH + 16 + authorH + pad;

    const canvas = document.createElement('canvas');
    canvas.width = cardW;
    canvas.height = cardH;
    const ctx = canvas.getContext('2d')!;

    // Card Surface
    ctx.fillStyle = s.testimonial.cardColor || '#ffffff';
    ctx.beginPath();
    ctx.roundRect(0, 0, cardW, cardH, 24);
    ctx.fill();

    // Decorative Quotation Mark Watermark
    if (s.testimonial.mark) {
      ctx.save();
      ctx.font = '700 80px "Fraunces", serif';
      ctx.fillStyle = rgba(accentCol, 0.12);
      ctx.fillText('“', pad, pad + 40);
      ctx.restore();
    }

    let curY = pad + (s.testimonial.mark ? 28 : 10);

    // 1. Customer Quote
    ctx.font = `600 20px ${fontFam}`;
    ctx.fillStyle = textInk;
    ctx.textAlign = (s.testimonial.align || 'left') as CanvasTextAlign;
    const quoteX = s.testimonial.align === 'center' ? cardW / 2 : pad;

    quoteLines.forEach((line) => {
      ctx.fillText(line, quoteX, curY);
      curY += lineHeight;
    });

    curY += 16;

    // 2. Star Rating (0 to 5)
    if (s.testimonial.rating > 0) {
      const rating = Math.min(5, Math.max(1, s.testimonial.rating));
      const starSize = 20;
      let starX = s.testimonial.align === 'center' ? (cardW - rating * 26) / 2 : pad;

      ctx.fillStyle = '#fbb224'; // Gold stars
      for (let i = 0; i < rating; i++) {
        ctx.font = '700 20px sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('★', starX + i * 26, curY + 16);
      }

      // Review source badge (e.g. Trustpilot, Google, G2)
      if (s.testimonial.source && s.testimonial.source !== 'none') {
        ctx.font = '600 12px -apple-system, sans-serif';
        ctx.fillStyle = mutedInk;
        const sourceLabel = s.testimonial.source.charAt(0).toUpperCase() + s.testimonial.source.slice(1);
        ctx.fillText(`via ${sourceLabel}`, starX + rating * 26 + 14, curY + 15);
      }

      curY += 32;
    }

    curY += 8;

    // 3. Author Section
    const avatarR = 24;
    const avatarX = s.testimonial.align === 'center' ? cardW / 2 - 80 : pad + avatarR;
    const avatarY = curY + avatarR;

    // Avatar image or initials
    ctx.save();
    ctx.beginPath();
    ctx.arc(avatarX, avatarY, avatarR, 0, Math.PI * 2);
    ctx.clip();
    if (this.avatarImg) {
      ctx.drawImage(this.avatarImg, avatarX - avatarR, avatarY - avatarR, avatarR * 2, avatarR * 2);
    } else {
      const avGrad = ctx.createLinearGradient(avatarX - avatarR, avatarY - avatarR, avatarX + avatarR, avatarY + avatarR);
      avGrad.addColorStop(0, accentCol);
      avGrad.addColorStop(1, '#ec4899');
      ctx.fillStyle = avGrad;
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = '700 18px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText((s.testimonial.name || 'U').charAt(0), avatarX, avatarY);
    }
    ctx.restore();

    // Author Name & Role
    const infoX = avatarX + avatarR + 14;
    ctx.font = '700 16px -apple-system, sans-serif';
    ctx.fillStyle = textInk;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText(s.testimonial.name || 'Customer Name', infoX, avatarY - 4);

    ctx.font = '400 13px -apple-system, sans-serif';
    ctx.fillStyle = mutedInk;
    ctx.fillText(s.testimonial.role || 'Verified Buyer', infoX, avatarY + 14);

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
      <!-- Curated Review Themes -->
      <div class="field">
        <label class="field-label">Review Card Theme</label>
        <div class="icon-grid" id="testim-style-grid">
          ${TESTIMONIAL_STYLES.map((t) => `
            <button class="grid-btn" data-theme="${t.id}" style="height: 48px; border-left: 4px solid ${t.accent};">
              <span>${t.name}</span>
            </button>
          `).join('')}
        </div>
      </div>

      <!-- Quote Content -->
      <div class="field">
        <label class="field-label">Customer Quote</label>
        <textarea id="testim-text" rows="4">${s.testimonial.text || ''}</textarea>
      </div>

      <!-- Author Information -->
      <div class="field">
        <label class="field-label">Customer Name</label>
        <input type="text" id="testim-name" value="${s.testimonial.name || ''}" placeholder="David Miller" />
      </div>
      <div class="field">
        <label class="field-label">Role & Company</label>
        <input type="text" id="testim-role" value="${s.testimonial.role || ''}" placeholder="Head of Growth, Acme Corp" />
      </div>

      <!-- Rating & Source -->
      <div class="field">
        <label class="field-label">Star Rating (0 - 5)</label>
        <div class="segmented" id="testim-rating-seg">
          ${[0, 1, 2, 3, 4, 5].map((r) => `
            <button class="seg-btn ${s.testimonial.rating === r ? 'active' : ''}" data-val="${r}">
              ${r === 0 ? 'Off' : `${r}★`}
            </button>
          `).join('')}
        </div>
      </div>

      <div class="field">
        <label class="field-label">Review Platform Source</label>
        <select id="testim-source">
          <option value="none" ${s.testimonial.source === 'none' ? 'selected' : ''}>None</option>
          <option value="google" ${s.testimonial.source === 'google' ? 'selected' : ''}>Google Reviews</option>
          <option value="trustpilot" ${s.testimonial.source === 'trustpilot' ? 'selected' : ''}>Trustpilot</option>
          <option value="g2" ${s.testimonial.source === 'g2' ? 'selected' : ''}>G2 Crowd</option>
          <option value="tripadvisor" ${s.testimonial.source === 'tripadvisor' ? 'selected' : ''}>Tripadvisor</option>
          <option value="facebook" ${s.testimonial.source === 'facebook' ? 'selected' : ''}>Facebook</option>
        </select>
      </div>

      <!-- Typography Style -->
      <div class="field">
        <label class="field-label">Quote Typography</label>
        <select id="testim-font">
          <option value="sans" ${s.testimonial.font === 'sans' ? 'selected' : ''}>Modern Sans (Plus Jakarta)</option>
          <option value="fraunces" ${s.testimonial.font === 'fraunces' ? 'selected' : ''}>Editorial Serif (Fraunces)</option>
          <option value="bricolage" ${s.testimonial.font === 'bricolage' ? 'selected' : ''}>Contemporary Grotesque</option>
          <option value="caveat" ${s.testimonial.font === 'caveat' ? 'selected' : ''}>Handwritten Script (Caveat)</option>
        </select>
      </div>
    `;

    // Event Listeners
    container.querySelector('#testim-style-grid')?.addEventListener('click', (e) => {
      const btn = (e.target as HTMLElement).closest('.grid-btn') as HTMLElement;
      if (!btn) return;
      const themeId = btn.dataset.theme;
      const theme = TESTIMONIAL_STYLES.find((t) => t.id === themeId);
      if (theme) {
        this.store.patch({
          testimonial: {
            cardColor: theme.card,
            accentColor: theme.accent,
          },
          background: {
            colors: theme.background.colors,
            angle: theme.background.angle,
          },
        });
        onUpdate();
      }
    });

    container.querySelector('#testim-text')?.addEventListener('input', (e) => {
      this.store.set('testimonial.text', (e.target as HTMLTextAreaElement).value);
      onUpdate();
    });

    container.querySelector('#testim-name')?.addEventListener('input', (e) => {
      this.store.set('testimonial.name', (e.target as HTMLInputElement).value);
      onUpdate();
    });

    container.querySelector('#testim-role')?.addEventListener('input', (e) => {
      this.store.set('testimonial.role', (e.target as HTMLInputElement).value);
      onUpdate();
    });

    container.querySelector('#testim-rating-seg')?.addEventListener('click', (e) => {
      const btn = (e.target as HTMLElement).closest('.seg-btn') as HTMLElement;
      if (!btn) return;
      container.querySelectorAll('#testim-rating-seg .seg-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      this.store.set('testimonial.rating', Number(btn.dataset.val));
      onUpdate();
    });

    container.querySelector('#testim-source')?.addEventListener('change', (e) => {
      this.store.set('testimonial.source', (e.target as HTMLSelectElement).value);
      onUpdate();
    });

    container.querySelector('#testim-font')?.addEventListener('change', (e) => {
      this.store.set('testimonial.font', (e.target as HTMLSelectElement).value);
      onUpdate();
    });
  }
}
