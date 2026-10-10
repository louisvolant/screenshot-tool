import { Store } from './core/store/store';
import { AppState, ToolId, AspectRatio } from './core/store/types';
import { renderStudioComposition, createOffscreenComposition } from './core/render/renderer';
import { copyCanvasToClipboard, downloadCanvas, batchExportZip } from './core/export/raster';

import { ScreenshotTool } from './tools/screenshot/screenshotTool';
import { Annotator, AnnotationToolType } from './core/annotations/annotate';
import { CodeTool } from './tools/code/codeTool';
import { SocialTool } from './tools/social/socialTool';
import { TestimonialTool } from './tools/testimonial/testimonialTool';
import { ChatTool } from './tools/chat/chatTool';
import { NotificationTool } from './tools/notification/notificationTool';
import { AnnounceTool } from './tools/announce/announceTool';
import { PRESETS, applyPreset, getRandomPreset, StylePreset } from './core/presets/presets';

export const store = new Store();

// Cache canvas elements
const canvas = document.getElementById('preview-canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;

// Tool instances
export const screenshotTool = new ScreenshotTool(store);
export const annotator = new Annotator(store);
export const codeTool = new CodeTool(store);
export const socialTool = new SocialTool(store);
export const testimonialTool = new TestimonialTool(store);
export const chatTool = new ChatTool(store);
export const notificationTool = new NotificationTool(store);
export const announceTool = new AnnounceTool(store);

// Active tool content canvas provider
let currentContentCanvas: HTMLCanvasElement = document.createElement('canvas');

/**
 * Updates the base content canvas
 */
export function setContentCanvas(newCanvas: HTMLCanvasElement): void {
  currentContentCanvas = newCanvas;
  render();
}

/**
 * Primary rendering loop
 */
export function render(): void {
  const activeTool = store.state.activeTool;
  if (activeTool === 'screenshot') {
    currentContentCanvas = screenshotTool.renderContent();
  } else if (activeTool === 'code') {
    currentContentCanvas = codeTool.renderContent();
  } else if (activeTool === 'social') {
    currentContentCanvas = socialTool.renderContent();
  } else if (activeTool === 'testimonial') {
    currentContentCanvas = testimonialTool.renderContent();
  } else if (activeTool === 'chat') {
    currentContentCanvas = chatTool.renderContent();
  } else if (activeTool === 'notification') {
    currentContentCanvas = notificationTool.renderContent();
  } else if (activeTool === 'announce') {
    currentContentCanvas = announceTool.renderContent();
  }

  renderStudioComposition(ctx, {
    state: store.state,
    contentCanvas: currentContentCanvas,
  });
  updateUI();
}

let lastActiveTool: ToolId | null = null;
export function syncToolPanel(): void {
  const activeTool = store.state.activeTool;
  if (lastActiveTool === activeTool) return;
  lastActiveTool = activeTool;

  const titleEl = document.getElementById('panel-tool-title');
  const bodyEl = document.getElementById('panel-tool-body');
  if (!bodyEl || !titleEl) return;

  if (activeTool === 'screenshot') {
    titleEl.textContent = 'Screenshot & Framing';
    screenshotTool.renderSettingsUI(bodyEl, () => render());
  } else if (activeTool === 'code') {
    titleEl.textContent = 'Code & Terminal Settings';
    codeTool.renderSettingsUI(bodyEl, () => render());
  } else if (activeTool === 'social') {
    titleEl.textContent = 'Social Post Settings';
    socialTool.renderSettingsUI(bodyEl, () => render());
  } else if (activeTool === 'testimonial') {
    titleEl.textContent = 'Review & Testimonial Settings';
    testimonialTool.renderSettingsUI(bodyEl, () => render());
  } else if (activeTool === 'chat') {
    titleEl.textContent = 'Chat Conversation Settings';
    chatTool.renderSettingsUI(bodyEl, () => render());
  } else if (activeTool === 'notification') {
    titleEl.textContent = 'Notification & Toast Settings';
    notificationTool.renderSettingsUI(bodyEl, () => render());
  } else if (activeTool === 'announce') {
    titleEl.textContent = 'Key Metrics & Release Settings';
    announceTool.renderSettingsUI(bodyEl, () => render());
  } else {
    const fallbackName = String(activeTool);
    titleEl.textContent = `${fallbackName.charAt(0).toUpperCase() + fallbackName.slice(1)} Settings`;
    bodyEl.innerHTML = `<p style="font-size: 13px; color: var(--text-muted);">Settings for ${fallbackName} will appear here.</p>`;
  }
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
  syncToolPanel();
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

  // Shuffle Preset (S)
  const handleShuffle = () => {
    const randomPreset = getRandomPreset();
    applyPreset(store.state, randomPreset);
    store.patch({}); // triggers render and history
  };
  document.getElementById('btn-shuffle')?.addEventListener('click', handleShuffle);

  // Presets Modal (G)
  const presetsModal = document.getElementById('presets-modal') as HTMLElement;
  const openPresetsModal = () => {
    if (!presetsModal) return;
    renderPresetsModalContent();
    presetsModal.style.display = 'flex';
  };
  const closePresetsModal = () => {
    if (presetsModal) presetsModal.style.display = 'none';
  };
  document.getElementById('btn-presets')?.addEventListener('click', openPresetsModal);
  document.getElementById('btn-close-presets')?.addEventListener('click', closePresetsModal);
  presetsModal?.addEventListener('click', (e) => {
    if (e.target === presetsModal) closePresetsModal();
  });

  // State JSON Export
  document.getElementById('btn-json-export')?.addEventListener('click', () => {
    const jsonStr = store.exportJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `studio-preset-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  });

  // State JSON Import
  const fileInput = document.getElementById('json-file-input') as HTMLInputElement;
  document.getElementById('btn-json-import')?.addEventListener('click', () => {
    fileInput?.click();
  });
  fileInput?.addEventListener('change', () => {
    const file = fileInput.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (content) {
        store.importJSON(content);
      }
    };
    reader.readAsText(file);
    fileInput.value = '';
  });

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

  // Annotation toolbar bindings
  document.querySelectorAll('#annot-toolbar .annot-btn[data-tool]').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#annot-toolbar .annot-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const tool = (btn as HTMLElement).dataset.tool as AnnotationToolType;
      annotator.setTool(tool);
    });
  });

  document.getElementById('btn-annot-delete')?.addEventListener('click', () => {
    annotator.deleteSelected();
  });

  // Canvas interaction for placing annotations
  canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const clickX = (e.clientX - rect.left) * scaleX;
    const clickY = (e.clientY - rect.top) * scaleY;

    // Approximate center content coordinates
    annotator.handleCanvasClick(clickX, clickY);

    // Sync toolbar active button state
    document.querySelectorAll('#annot-toolbar .annot-btn').forEach((b) => b.classList.remove('active'));
    document.querySelector(`#annot-toolbar .annot-btn[data-tool="${annotator.activeTool}"]`)?.classList.add('active');
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
    } else if ((e.key === 'Delete' || e.key === 'Backspace') && !inInput) {
      if (annotator.deleteSelected()) {
        e.preventDefault();
      }
    } else if (!isCtrl && !inInput) {
      // Annotation tool shortcuts
      const toolMap: Record<string, AnnotationToolType> = {
        v: 'select',
        t: 'text',
        a: 'arrow',
        r: 'box',
        e: 'sticker',
        l: 'loupe',
        b: 'blur',
      };
      if (toolMap[key]) {
        annotator.setTool(toolMap[key]);
        document.querySelectorAll('#annot-toolbar .annot-btn').forEach((b) => b.classList.remove('active'));
        document.querySelector(`#annot-toolbar .annot-btn[data-tool="${toolMap[key]}"]`)?.classList.add('active');
      } else if (key === 's') {
        handleShuffle();
      } else if (key === 'g') {
        const modal = document.getElementById('presets-modal');
        if (modal?.style.display === 'flex') closePresetsModal();
        else openPresetsModal();
      } else if (key === 'escape') {
        closePresetsModal();
      }
    }
  });

  // Global Clipboard Paste (Ctrl+V / Cmd+V)
  window.addEventListener('paste', (e: ClipboardEvent) => {
    const inInput = e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement;
    if (inInput) return; // Allow natural text pasting inside input fields

    const items = e.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.indexOf('image') !== -1) {
        const file = item.getAsFile();
        if (file) {
          e.preventDefault();
          // Switch to screenshot tool if on another tool
          if (store.state.activeTool !== 'screenshot') {
            document.querySelectorAll('.tool-btn').forEach((b) => b.classList.remove('active'));
            document.querySelector('.tool-btn[data-tool="screenshot"]')?.classList.add('active');
            store.set('activeTool', 'screenshot');
            syncToolPanel();
          }
          screenshotTool.loadImageFile(file, () => {
            render();
          });
          break;
        }
      }
    }
  });

  // Drag and Drop Image Support
  const dropZone = document.querySelector('.stage') as HTMLElement || canvas;
  dropZone.addEventListener('dragover', (e: DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer) e.dataTransfer.dropEffect = 'copy';
  });

  dropZone.addEventListener('drop', (e: DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer?.files;
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type.startsWith('image/')) {
        if (store.state.activeTool !== 'screenshot') {
          document.querySelectorAll('.tool-btn').forEach((b) => b.classList.remove('active'));
          document.querySelector('.tool-btn[data-tool="screenshot"]')?.classList.add('active');
          store.set('activeTool', 'screenshot');
          syncToolPanel();
        }
        screenshotTool.loadImageFile(file, () => {
          render();
        });
        break;
      }
    }
  });
}

/**
 * Render Presets modal categories and interactive cards
 */
let activeCategory = 'All';
function renderPresetsModalContent(): void {
  const catContainer = document.getElementById('presets-categories');
  const gridContainer = document.getElementById('presets-grid');
  if (!catContainer || !gridContainer) return;

  const categories = ['All', 'Modern', 'Dark', 'Pastel', 'Vibrant', 'Minimal', 'Editorial', 'Cyber'];
  catContainer.innerHTML = '';
  categories.forEach((cat) => {
    const btn = document.createElement('button');
    btn.className = `seg-btn ${activeCategory === cat ? 'active' : ''}`;
    btn.style.cssText = 'padding: 4px 12px; font-size: 12px; border-radius: 999px; white-space: nowrap;';
    btn.textContent = cat;
    btn.addEventListener('click', () => {
      activeCategory = cat;
      renderPresetsModalContent();
    });
    catContainer.appendChild(btn);
  });

  const filtered = activeCategory === 'All' ? PRESETS : PRESETS.filter((p) => p.category === activeCategory);
  gridContainer.innerHTML = '';

  filtered.forEach((preset) => {
    const card = document.createElement('div');
    card.className = 'preset-card';
    card.style.cssText = `
      background: var(--bg-hover);
      border: 1px solid var(--border-color);
      border-radius: 10px;
      padding: 10px;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      gap: 8px;
      transition: transform 0.15s ease, border-color 0.15s ease;
    `;
    card.addEventListener('mouseenter', () => {
      card.style.borderColor = '#6366f1';
      card.style.transform = 'translateY(-2px)';
    });
    card.addEventListener('mouseleave', () => {
      card.style.borderColor = 'var(--border-color)';
      card.style.transform = 'none';
    });

    // Color thumbnail preview
    const thumb = document.createElement('div');
    thumb.style.cssText = `
      height: 64px;
      border-radius: 6px;
      box-shadow: inset 0 0 0 1px rgba(255,255,255,0.1);
    `;
    const colors = preset.background.colors;
    if (preset.background.type === 'solid') {
      thumb.style.background = colors[0];
    } else {
      thumb.style.background = `linear-gradient(${preset.background.angle || 135}deg, ${colors.join(', ')})`;
    }

    const title = document.createElement('div');
    title.style.cssText = 'font-size: 13px; font-weight: 600; color: var(--text-color);';
    title.textContent = preset.name;

    const catLabel = document.createElement('div');
    catLabel.style.cssText = 'font-size: 11px; color: var(--text-muted);';
    catLabel.textContent = preset.category;

    card.appendChild(thumb);
    card.appendChild(title);
    card.appendChild(catLabel);

    card.addEventListener('click', () => {
      applyPreset(store.state, preset);
      store.patch({});
      const modal = document.getElementById('presets-modal');
      if (modal) modal.style.display = 'none';
    });

    gridContainer.appendChild(card);
  });
}

// Bootstrap
setupBindings();
syncToolPanel();
render();
