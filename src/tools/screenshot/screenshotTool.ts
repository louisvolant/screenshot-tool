import { Store } from '../../core/store/store';
import { FrameType, DeviceColor, CameraType } from '../../core/store/types';
import { renderFramedContent, DEVICE_FINISHES } from '../../core/frames/frames';
import { composeCompare, composeMontage } from './montage';
import { extractPalette, paletteBackgrounds } from '../../core/render/colors';

export class ScreenshotTool {
  private store: Store;
  private shots: HTMLCanvasElement[] = [];

  constructor(store: Store) {
    this.store = store;
    this.shots = [this.createSampleShot(1)];
  }

  public getShots(): HTMLCanvasElement[] {
    return this.shots;
  }

  public addShot(canvas: HTMLCanvasElement): void {
    this.shots.push(canvas);
    if (this.shots.length > 6) this.shots = this.shots.slice(-6);
    this.autoExtractPalette(canvas);
  }

  public setPrimaryShot(canvas: HTMLCanvasElement): void {
    this.shots[0] = canvas;
    this.autoExtractPalette(canvas);
  }

  public createSampleShot(index = 1): HTMLCanvasElement {
    const c = document.createElement('canvas');
    c.width = 800;
    c.height = 500;
    const ctx = c.getContext('2d')!;

    // Clean gradient content representing web app UI
    const grad = ctx.createLinearGradient(0, 0, c.width, c.height);
    if (index === 1) {
      grad.addColorStop(0, '#1a1b26');
      grad.addColorStop(1, '#24283b');
    } else {
      grad.addColorStop(0, '#1e1e2e');
      grad.addColorStop(1, '#313244');
    }
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, c.width, c.height);

    // Sidebar mockup
    ctx.fillStyle = index === 1 ? '#13141c' : '#181825';
    ctx.fillRect(0, 0, 160, c.height);

    // Sidebar items
    for (let i = 0; i < 5; i++) {
      ctx.fillStyle = i === 1 ? '#6d5efc' : 'rgba(255,255,255,0.12)';
      ctx.beginPath();
      ctx.roundRect(20, 40 + i * 44, 120, 24, 6);
      ctx.fill();
    }

    // Header bar
    ctx.fillStyle = 'rgba(255,255,255,0.06)';
    ctx.fillRect(160, 0, c.width - 160, 60);

    // Main dashboard cards
    const cards = [
      { x: 190, y: 90, w: 270, h: 140, c: '#2ac3de' },
      { x: 490, y: 90, w: 270, h: 140, c: '#bb9af7' },
      { x: 190, y: 260, w: 570, h: 200, c: '#7aa2f7' },
    ];

    cards.forEach((card) => {
      ctx.fillStyle = 'rgba(255,255,255,0.05)';
      ctx.beginPath();
      ctx.roundRect(card.x, card.y, card.w, card.h, 10);
      ctx.fill();

      ctx.fillStyle = card.c;
      ctx.beginPath();
      ctx.arc(card.x + 30, card.y + 35, 12, 0, Math.PI * 2);
      ctx.fill();
    });

    return c;
  }

  private autoExtractPalette(canvas: HTMLCanvasElement): void {
    const palette = extractPalette(canvas);
    const bgOpts = paletteBackgrounds(palette);
    if (bgOpts.length > 0) {
      this.store.patch({
        background: {
          colors: bgOpts[0].colors,
          angle: bgOpts[0].angle,
        },
      });
    }
  }

  /**
   * Renders the complete screenshot composite (framed or unframed)
   */
  public renderContent(): HTMLCanvasElement {
    const s = this.store.state;
    const mode = s.shot.mode || 'single';

    let composedCanvas: HTMLCanvasElement;

    if (mode === 'compare' && this.shots.length >= 2) {
      // Compare 2 shots
      const framed1 = renderFramedContent(this.shots[0], s.frame, s.layout.radius);
      const framed2 = renderFramedContent(this.shots[1], s.frame, s.layout.radius);
      composedCanvas = composeCompare(framed1, framed2, s.shot.compare, {
        split: s.shot.split,
        labels: s.shot.labels,
        before: s.shot.before,
        after: s.shot.after,
      });
    } else if (mode === 'montage' && this.shots.length >= 2) {
      // Montage multiple shots
      const framedList = this.shots.map((shot) =>
        renderFramedContent(shot, s.frame, s.layout.radius)
      );
      composedCanvas = composeMontage(framedList, s.shot.montage, s.shot.spread);
    } else {
      // Single shot
      const primary = this.shots[0] || this.createSampleShot(1);
      composedCanvas = renderFramedContent(primary, s.frame, s.layout.radius);
    }

    return composedCanvas;
  }

  /**
   * Injects the Screenshot settings UI into the sidebar
   */
  public renderSettingsUI(container: HTMLElement, onUpdate: () => void): void {
    const s = this.store.state;

    container.innerHTML = `
      <!-- Shot Mode Selector -->
      <div class="field">
        <label class="field-label">Mode</label>
        <div class="segmented" id="shot-mode-seg">
          <button class="seg-btn ${s.shot.mode === 'single' ? 'active' : ''}" data-val="single">Single</button>
          <button class="seg-btn ${s.shot.mode === 'compare' ? 'active' : ''}" data-val="compare">Before/After</button>
          <button class="seg-btn ${s.shot.mode === 'montage' ? 'active' : ''}" data-val="montage">Montage (${this.shots.length})</button>
        </div>
      </div>

      <!-- Upload & Sample Actions -->
      <div class="field" style="display: flex; flex-direction: row; gap: 8px;">
        <label class="btn-primary" style="flex: 1; justify-content: center; cursor: pointer;">
          <span>Upload Image</span>
          <input type="file" id="shot-file-input" accept="image/*" style="display: none;" />
        </label>
        <button class="btn-secondary" id="btn-add-sample">Add Sample</button>
      </div>

      <!-- Hardware Frame Selector -->
      <div class="field">
        <label class="field-label">Device Frame</label>
        <div class="icon-grid" id="frame-type-grid">
          ${[
            ['desktop', 'Window'],
            ['browser', 'Browser'],
            ['windows', 'Windows'],
            ['phone', 'Phone'],
            ['tablet', 'Tablet'],
            ['laptop', 'Laptop'],
            ['watch', 'Watch'],
            ['none', 'None'],
          ].map(([val, label]) => `
            <button class="grid-btn ${s.frame.type === val ? 'active' : ''}" data-frame="${val}">
              <span>${label}</span>
            </button>
          `).join('')}
        </div>
      </div>

      <!-- Frame Finish & Color -->
      <div class="field">
        <label class="field-label">Frame Theme & Finish</label>
        <div class="segmented" id="frame-theme-seg">
          <button class="seg-btn ${s.frame.theme === 'light' ? 'active' : ''}" data-theme="light">Light</button>
          <button class="seg-btn ${s.frame.theme === 'dark' ? 'active' : ''}" data-theme="dark">Dark</button>
        </div>
      </div>

      <!-- Compare Controls (Visible if mode is compare) -->
      <div class="field" id="compare-controls" style="${s.shot.mode === 'compare' ? '' : 'display: none;'}">
        <label class="field-label">Compare Layout</label>
        <div class="segmented" id="compare-layout-seg">
          <button class="seg-btn ${s.shot.compare === 'side' ? 'active' : ''}" data-val="side">Side</button>
          <button class="seg-btn ${s.shot.compare === 'stacked' ? 'active' : ''}" data-val="stacked">Stacked</button>
          <button class="seg-btn ${s.shot.compare === 'split' ? 'active' : ''}" data-val="split">Split</button>
          <button class="seg-btn ${s.shot.compare === 'overlay' ? 'active' : ''}" data-val="overlay">Overlay</button>
        </div>
      </div>

      <!-- Montage Controls (Visible if mode is montage) -->
      <div class="field" id="montage-controls" style="${s.shot.mode === 'montage' ? '' : 'display: none;'}">
        <label class="field-label">Montage Layout</label>
        <div class="segmented" id="montage-layout-seg">
          <button class="seg-btn ${s.shot.montage === 'cascade' ? 'active' : ''}" data-val="cascade">Cascade</button>
          <button class="seg-btn ${s.shot.montage === 'row' ? 'active' : ''}" data-val="row">Row</button>
          <button class="seg-btn ${s.shot.montage === 'fan' ? 'active' : ''}" data-val="fan">Fan</button>
          <button class="seg-btn ${s.shot.montage === 'grid' ? 'active' : ''}" data-val="grid">Grid</button>
        </div>
        <div class="field" style="margin-top: 8px;">
          <div class="field-label">
            <span>Spread Offset</span>
            <span class="field-value" id="montage-spread-val">${s.shot.spread}%</span>
          </div>
          <input type="range" id="montage-spread" min="0" max="100" value="${s.shot.spread}" />
        </div>
      </div>
    `;

    // Event listeners
    container.querySelector('#shot-mode-seg')?.addEventListener('click', (e) => {
      const btn = (e.target as HTMLElement).closest('.seg-btn') as HTMLElement;
      if (!btn) return;
      container.querySelectorAll('#shot-mode-seg .seg-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const mode = btn.dataset.val!;
      this.store.set('shot.mode', mode);

      // Auto ensure at least 2 shots for compare/montage
      if ((mode === 'compare' || mode === 'montage') && this.shots.length < 2) {
        this.addShot(this.createSampleShot(2));
      }

      const compCtrl = container.querySelector('#compare-controls') as HTMLElement;
      const montCtrl = container.querySelector('#montage-controls') as HTMLElement;
      if (compCtrl) compCtrl.style.display = mode === 'compare' ? '' : 'none';
      if (montCtrl) montCtrl.style.display = mode === 'montage' ? '' : 'none';
      onUpdate();
    });

    // File input
    const fileInput = container.querySelector('#shot-file-input') as HTMLInputElement;
    fileInput?.addEventListener('change', (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const img = new Image();
      img.onload = () => {
        const c = document.createElement('canvas');
        c.width = img.naturalWidth || img.width;
        c.height = img.naturalHeight || img.height;
        c.getContext('2d')!.drawImage(img, 0, 0);
        this.setPrimaryShot(c);
        onUpdate();
      };
      img.src = URL.createObjectURL(file);
    });

    // Add Sample button
    container.querySelector('#btn-add-sample')?.addEventListener('click', () => {
      const idx = this.shots.length + 1;
      this.addShot(this.createSampleShot(idx));
      onUpdate();
    });

    // Frame type selection
    container.querySelector('#frame-type-grid')?.addEventListener('click', (e) => {
      const btn = (e.target as HTMLElement).closest('.grid-btn') as HTMLElement;
      if (!btn) return;
      container.querySelectorAll('#frame-type-grid .grid-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      this.store.set('frame.type', btn.dataset.frame as FrameType);
      onUpdate();
    });

    // Frame theme selection
    container.querySelector('#frame-theme-seg')?.addEventListener('click', (e) => {
      const btn = (e.target as HTMLElement).closest('.seg-btn') as HTMLElement;
      if (!btn) return;
      container.querySelectorAll('#frame-theme-seg .seg-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      this.store.set('frame.theme', btn.dataset.theme);
      onUpdate();
    });

    // Compare layout
    container.querySelector('#compare-layout-seg')?.addEventListener('click', (e) => {
      const btn = (e.target as HTMLElement).closest('.seg-btn') as HTMLElement;
      if (!btn) return;
      container.querySelectorAll('#compare-layout-seg .seg-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      this.store.set('shot.compare', btn.dataset.val);
      onUpdate();
    });

    // Montage layout
    container.querySelector('#montage-layout-seg')?.addEventListener('click', (e) => {
      const btn = (e.target as HTMLElement).closest('.seg-btn') as HTMLElement;
      if (!btn) return;
      container.querySelectorAll('#montage-layout-seg .seg-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      this.store.set('shot.montage', btn.dataset.val);
      onUpdate();
    });

    container.querySelector('#montage-spread')?.addEventListener('input', (e) => {
      const val = Number((e.target as HTMLInputElement).value);
      this.store.set('shot.spread', val);
      const valEl = container.querySelector('#montage-spread-val');
      if (valEl) valEl.textContent = `${val}%`;
      onUpdate();
    });
  }
}
