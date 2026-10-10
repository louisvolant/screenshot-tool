import { Store } from './core/store/store';
import { AppState, ToolId, AspectRatio } from './core/store/types';
import { renderStudioComposition, createOffscreenComposition } from './core/render/renderer';
import { copyCanvasToClipboard, downloadCanvas, batchExportZip } from './core/export/raster';

export const store = new Store();

// Cache canvas elements
const canvas = document.getElementById('preview-canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;

// Active tool content canvas provider
let currentContentCanvas: HTMLCanvasElement = document.createElement('canvas');

/**
 * Updates the base content canvas (placeholder for Feature 1)
 */
export function setContentCanvas(newCanvas: HTMLCanvasElement): void {
  currentContentCanvas = newCanvas;
  render();
}

/**
 * Creates an initial placeholder graphic for Feature 1 testing
 */
function createInitialContent(): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.width = 640;
  c.height = 420;
  const cctx = c.getContext('2d')!;

  // Background
  cctx.fillStyle = '#1e1f2b';
  cctx.fillRect(0, 0, c.width, c.height);

  // Decorative app UI representation
  cctx.fillStyle = '#2a2d3e';
  cctx.fillRect(20, 20, c.width - 40, 48);

  // Circles for window traffic lights
  const dots = ['#ff5f57', '#febc2e', '#28c840'];
  dots.forEach((dot, idx) => {
    cctx.beginPath();
    cctx.arc(42 + idx * 22, 44, 6, 0, Math.PI * 2);
    cctx.fillStyle = dot;
    cctx.fill();
  });

  // App body box
  cctx.fillStyle = '#161722';
  cctx.fillRect(20, 80, c.width - 40, c.height - 100);

  cctx.font = '600 24px "Plus Jakarta Sans", sans-serif';
  cctx.fillStyle = '#ffffff';
  cctx.textAlign = 'center';
  cctx.fillText('Visual Mockup Studio', c.width / 2, 180);

  cctx.font = '400 15px "Plus Jakarta Sans", sans-serif';
  cctx.fillStyle = '#9ca3af';
  cctx.fillText('High-performance client-side graphic engine ready', c.width / 2, 220);

  return c;
}

currentContentCanvas = createInitialContent();

/**
 * Primary rendering loop
 */
export function render(): void {
  renderStudioComposition(ctx, {
    state: store.state,
    contentCanvas: currentContentCanvas,
  });
  updateUI();
}

function updateUI(): void {
  const s = store.state;

  // History buttons
  const btnUndo = document.getElementById('btn-undo') as HTMLButtonElement;
  const btnRedo = document.getElementById('btn-redo') as HTMLButtonElement;
  if (btnUndo) btnUndo.disabled = !store.canUndo;
  if (btnRedo) btnRedo.disabled = !store.canRedo;

  // Background fields
  const angleVal = document.getElementById('bg-angle-val');
  if (angleVal) angleVal.textContent = `${s.background.angle}°`;
  const noiseVal = document.getElementById('bg-noise-val');
  if (noiseVal) noiseVal.textContent = `${s.background.noise}%`;

  // Layout fields
  const paddingVal = document.getElementById('layout-padding-val');
  if (paddingVal) paddingVal.textContent = `${s.layout.padding}px`;
  const radiusVal = document.getElementById('layout-radius-val');
  if (radiusVal) radiusVal.textContent = `${s.layout.radius}px`;
  const shadowVal = document.getElementById('layout-shadow-val');
  if (shadowVal) shadowVal.textContent = `${s.layout.shadow}`;

  // 3D effect fields
  const rotxVal = document.getElementById('effect-rotx-val');
  if (rotxVal) rotxVal.textContent = `${s.effect.rotateX}°`;
  const rotyVal = document.getElementById('effect-roty-val');
  if (rotyVal) rotyVal.textContent = `${s.effect.rotateY}°`;
  const rotzVal = document.getElementById('effect-rotz-val');
  if (rotzVal) rotzVal.textContent = `${s.effect.rotateZ}°`;
  const reflVal = document.getElementById('effect-refl-val');
  if (reflVal) reflVal.textContent = `${s.effect.reflection}%`;
}

// Subscribe to state updates
store.subscribe(() => {
  render();
});

// Setup DOM bindings
function setupBindings(): void {
  // Tool switching
  const toolNav = document.getElementById('tool-nav');
  toolNav?.addEventListener('click', (e) => {
    const target = (e.target as HTMLElement).closest('.tool-btn') as HTMLElement;
    if (!target) return;
    const tool = target.dataset.tool as ToolId;
    if (!tool) return;
    document.querySelectorAll('.tool-btn').forEach((b) => b.classList.remove('active'));
    target.classList.add('active');
    store.set('activeTool', tool);
  });

  // Undo / Redo / Reset
  document.getElementById('btn-undo')?.addEventListener('click', () => store.undo());
  document.getElementById('btn-redo')?.addEventListener('click', () => store.redo());
  document.getElementById('btn-reset')?.addEventListener('click', () => store.reset());

  // Dark / Light Theme
  document.getElementById('btn-theme')?.addEventListener('click', () => {
    const doc = document.documentElement;
    const current = doc.getAttribute('data-theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    doc.setAttribute('data-theme', next);
  });

  // Copy Canvas
  document.getElementById('btn-copy')?.addEventListener('click', async () => {
    const success = await copyCanvasToClipboard(canvas);
    if (success) {
      alert('Copied to clipboard!');
    }
  });

  // Download Image
  document.getElementById('btn-download')?.addEventListener('click', () => {
    downloadCanvas(canvas, {
      format: store.state.export.format,
      scale: store.state.export.scale,
      watermark: store.state.export.watermark,
      prefix: store.state.export.prefix,
    });
  });

  // Batch Export ZIP
  document.getElementById('btn-batch-export')?.addEventListener('click', async () => {
    await batchExportZip(
      (aspect: AspectRatio) => {
        return createOffscreenComposition({
          state: store.state,
          contentCanvas: currentContentCanvas,
          aspectOverride: aspect,
        });
      },
      ['16:9', '4:3', '1:1', '4:5', '9:16', '1200:630'],
      {
        format: store.state.export.format,
        scale: store.state.export.scale,
        prefix: 'social-pack',
      }
    );
  });

  // Collapsible panels
  document.querySelectorAll('.panel-head').forEach((head) => {
    head.addEventListener('click', () => {
      const panel = head.closest('.panel');
      panel?.classList.toggle('collapsed');
    });
  });

  // Background type segmented control
  document.querySelectorAll('#bg-type-seg .seg-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#bg-type-seg .seg-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const val = (btn as HTMLElement).dataset.val;
      store.set('background.type', val);
    });
  });

  // Background range inputs
  document.getElementById('bg-angle')?.addEventListener('input', (e) => {
    const val = Number((e.target as HTMLInputElement).value);
    store.set('background.angle', val);
  });
  document.getElementById('bg-noise')?.addEventListener('input', (e) => {
    const val = Number((e.target as HTMLInputElement).value);
    store.set('background.noise', val);
  });
  document.getElementById('bg-pattern')?.addEventListener('change', (e) => {
    const val = (e.target as HTMLSelectElement).value;
    store.set('background.pattern', val);
  });

  // Layout inputs
  document.getElementById('layout-aspect')?.addEventListener('change', (e) => {
    const val = (e.target as HTMLSelectElement).value as AspectRatio;
    store.set('layout.aspect', val);
  });
  document.getElementById('layout-padding')?.addEventListener('input', (e) => {
    store.set('layout.padding', Number((e.target as HTMLInputElement).value));
  });
  document.getElementById('layout-radius')?.addEventListener('input', (e) => {
    store.set('layout.radius', Number((e.target as HTMLInputElement).value));
  });
  document.getElementById('layout-shadow')?.addEventListener('input', (e) => {
    store.set('layout.shadow', Number((e.target as HTMLInputElement).value));
  });
  document.querySelectorAll('#shadow-style-seg .seg-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#shadow-style-seg .seg-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      store.set('layout.shadowStyle', (btn as HTMLElement).dataset.val);
    });
  });

  // 3D Effect inputs
  document.getElementById('effect-rotx')?.addEventListener('input', (e) => {
    store.set('effect.rotateX', Number((e.target as HTMLInputElement).value));
  });
  document.getElementById('effect-roty')?.addEventListener('input', (e) => {
    store.set('effect.rotateY', Number((e.target as HTMLInputElement).value));
  });
  document.getElementById('effect-rotz')?.addEventListener('input', (e) => {
    store.set('effect.rotateZ', Number((e.target as HTMLInputElement).value));
  });
  document.getElementById('effect-refl')?.addEventListener('input', (e) => {
    store.set('effect.reflection', Number((e.target as HTMLInputElement).value));
  });

  // Quick 3D tilt presets
  document.querySelectorAll('#tilt-presets .grid-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#tilt-presets .grid-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const tilt = (btn as HTMLElement).dataset.tilt;
      switch (tilt) {
        case 'left':
          store.patch({ effect: { rotateX: 4, rotateY: 24, rotateZ: 0 } });
          break;
        case 'right':
          store.patch({ effect: { rotateX: 4, rotateY: -24, rotateZ: 0 } });
          break;
        case 'hero':
          store.patch({ effect: { rotateX: 14, rotateY: -18, rotateZ: 3 } });
          break;
        case 'flat':
        default:
          store.patch({ effect: { rotateX: 0, rotateY: 0, rotateZ: 0 } });
          break;
      }
    });
  });

  // Headline text inputs
  document.getElementById('text-title')?.addEventListener('input', (e) => {
    store.set('text.title', (e.target as HTMLInputElement).value);
  });
  document.getElementById('text-subtitle')?.addEventListener('input', (e) => {
    store.set('text.subtitle', (e.target as HTMLInputElement).value);
  });
  document.getElementById('text-font')?.addEventListener('change', (e) => {
    store.set('text.font', (e.target as HTMLSelectElement).value);
  });

  // Export settings
  document.querySelectorAll('#export-format-seg .seg-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#export-format-seg .seg-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      store.set('export.format', (btn as HTMLElement).dataset.val);
    });
  });
  document.querySelectorAll('#export-scale-seg .seg-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#export-scale-seg .seg-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      store.set('export.scale', Number((btn as HTMLElement).dataset.val));
    });
  });

  // Global Keyboard Shortcuts
  window.addEventListener('keydown', (e) => {
    const isCtrl = e.ctrlKey || e.metaKey;
    const key = e.key.toLowerCase();
    const inInput = e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement;

    if (isCtrl && key === 'z' && !inInput) {
      e.preventDefault();
      if (e.shiftKey) store.redo();
      else store.undo();
    } else if (isCtrl && key === 'y' && !inInput) {
      e.preventDefault();
      store.redo();
    } else if (isCtrl && key === 's') {
      e.preventDefault();
      downloadCanvas(canvas, {
        format: store.state.export.format,
        scale: store.state.export.scale,
        prefix: store.state.export.prefix,
      });
    } else if (isCtrl && key === 'c' && !inInput && !window.getSelection()?.toString()) {
      e.preventDefault();
      copyCanvasToClipboard(canvas);
    }
  });
}

// Bootstrap
setupBindings();
render();
