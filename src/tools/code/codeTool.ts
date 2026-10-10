import { Store } from '../../core/store/store';
import { detectLanguage, tokenizeLine, LANGUAGES } from './languages';
import { getTheme, CODE_THEMES } from './themes';
import { getFontFamily } from '../../core/render/fonts';

export function parseLineHighlights(spec: string): Set<number> {
  const lines = new Set<number>();
  for (const part of String(spec).split(/[,;\s]+/)) {
    const m = part.match(/^(\d+)(?:-(\d+))?$/);
    if (!m) continue;
    const a = Number(m[1]);
    const b = Number(m[2] ?? m[1]);
    for (let n = Math.min(a, b); n <= Math.max(a, b); n++) {
      if (n > 0) lines.add(n);
    }
  }
  return lines;
}

export class CodeTool {
  private store: Store;

  constructor(store: Store) {
    this.store = store;
  }

  public renderContent(): HTMLCanvasElement {
    const s = this.store.state;
    const isTerminal = s.code.mode === 'terminal';

    return isTerminal ? this.renderTerminal() : this.renderCode();
  }

  private renderCode(): HTMLCanvasElement {
    const s = this.store.state;
    const theme = getTheme(s.code.theme || 'violine');
    const rawText = s.code.text || '';
    const lines: string[] = rawText.split('\n');

    const detectedLang = s.code.language === 'auto' ? detectLanguage(rawText) : s.code.language;
    const fontFam = getFontFamily(s.code.font || 'jetbrains');
    const fontSize = s.code.fontSize || 15;
    const lineHeight = Math.round(fontSize * 1.6);
    const gutterW = s.code.lineNumbers ? Math.max(40, String(lines.length).length * 10 + 20) : 0;
    const pad = 24;

    // Estimate width based on longest line
    const measureCanvas = document.createElement('canvas');
    const mctx = measureCanvas.getContext('2d')!;
    mctx.font = `400 ${fontSize}px ${fontFam}`;
    let maxLineW = 320;
    lines.forEach((l) => {
      const w = mctx.measureText(l).width;
      if (w > maxLineW) maxLineW = w;
    });

    const windowW = Math.min(1200, Math.max(520, Math.round(maxLineW + gutterW + pad * 2 + 40)));
    const barH = 38;
    const windowH = barH + lines.length * lineHeight + pad * 2;

    const canvas = document.createElement('canvas');
    canvas.width = windowW;
    canvas.height = windowH;
    const ctx = canvas.getContext('2d')!;

    // Window Body
    ctx.fillStyle = theme.bg;
    ctx.beginPath();
    ctx.roundRect(0, 0, windowW, windowH, 12);
    ctx.fill();

    // Window Bar
    ctx.fillStyle = theme.bar;
    ctx.beginPath();
    ctx.roundRect(0, 0, windowW, barH, [12, 12, 0, 0]);
    ctx.fill();

    // Traffic Lights
    const dots = ['#ff5f57', '#febc2e', '#28c840'];
    dots.forEach((dot, idx) => {
      ctx.beginPath();
      ctx.arc(18 + idx * 18, barH / 2, 5.5, 0, Math.PI * 2);
      ctx.fillStyle = dot;
      ctx.fill();
    });

    // Window Title / Filename
    if (s.code.filename) {
      ctx.font = `500 12px -apple-system, sans-serif`;
      ctx.fillStyle = theme.gutter;
      ctx.textAlign = 'center';
      ctx.fillText(s.code.filename, windowW / 2, barH / 2 + 4);
    }

    // Active Highlight Lines Set
    const highlights = parseLineHighlights(s.code.highlight || '');
    const hasHighlights = highlights.size > 0;

    // Draw Code Lines
    lines.forEach((line, idx) => {
      const lineNum = idx + 1;
      const isHighlighted = highlights.has(lineNum);
      const y = barH + pad + idx * lineHeight;

      // Line Highlight Backdrop
      if (isHighlighted) {
        ctx.fillStyle = theme.highlight;
        ctx.fillRect(0, y - 4, windowW, lineHeight);

        // Accent indicator bar on gutter edge
        ctx.fillStyle = theme.accent;
        ctx.fillRect(0, y - 4, 3, lineHeight);
      }

      // Dim non-highlighted lines if highlights are active
      ctx.save();
      if (hasHighlights && !isHighlighted) {
        ctx.globalAlpha = 0.45;
      }

      // Line Number
      if (s.code.lineNumbers) {
        ctx.font = `400 ${Math.round(fontSize * 0.9)}px ${fontFam}`;
        ctx.fillStyle = isHighlighted ? theme.accent : theme.gutter;
        ctx.textAlign = 'right';
        ctx.fillText(String(lineNum), gutterW - 14, y + fontSize - 2);
      }

      // Tokenize and render line code
      let x = gutterW + pad;
      ctx.font = `400 ${fontSize}px ${fontFam}`;
      ctx.textAlign = 'left';

      const tokens = tokenizeLine(line, detectedLang);
      tokens.forEach((token) => {
        ctx.fillStyle = theme.tokens[token.type] || theme.fg;
        ctx.fillText(token.text, x, y + fontSize - 2);
        x += ctx.measureText(token.text).width;
      });

      ctx.restore();
    });

    return canvas;
  }

  private renderTerminal(): HTMLCanvasElement {
    const s = this.store.state;
    const theme = getTheme('charbon'); // Terminal aesthetic
    const rawText = s.code.terminal || '$ npm run build\nSuccess!';
    const lines: string[] = rawText.split('\n');
    const fontFam = getFontFamily('jetbrains');
    const fontSize = s.code.fontSize || 14;
    const lineHeight = Math.round(fontSize * 1.6);
    const pad = 24;
    const barH = 38;

    const windowW = 600;
    const windowH = barH + lines.length * lineHeight + pad * 2;

    const canvas = document.createElement('canvas');
    canvas.width = windowW;
    canvas.height = windowH;
    const ctx = canvas.getContext('2d')!;

    // Terminal Body
    ctx.fillStyle = '#0f1117';
    ctx.beginPath();
    ctx.roundRect(0, 0, windowW, windowH, 12);
    ctx.fill();

    // Terminal Bar
    ctx.fillStyle = '#161922';
    ctx.beginPath();
    ctx.roundRect(0, 0, windowW, barH, [12, 12, 0, 0]);
    ctx.fill();

    // Traffic Lights
    const dots = ['#ff5f57', '#febc2e', '#28c840'];
    dots.forEach((dot, idx) => {
      ctx.beginPath();
      ctx.arc(18 + idx * 18, barH / 2, 5.5, 0, Math.PI * 2);
      ctx.fillStyle = dot;
      ctx.fill();
    });

    // Terminal Title
    ctx.font = `500 12px -apple-system, sans-serif`;
    ctx.fillStyle = '#64748b';
    ctx.textAlign = 'center';
    ctx.fillText('bash — 80×24', windowW / 2, barH / 2 + 4);

    // Terminal Lines
    lines.forEach((line, idx) => {
      const y = barH + pad + idx * lineHeight;
      const isCmd = line.trim().startsWith('$');

      ctx.font = `400 ${fontSize}px ${fontFam}`;
      ctx.textAlign = 'left';

      if (isCmd) {
        ctx.fillStyle = '#38bdf8'; // Command prompt color
        ctx.fillText('$', pad, y + fontSize - 2);

        ctx.fillStyle = '#f8fafc';
        ctx.fillText(line.replace(/^\$\s*/, ''), pad + 18, y + fontSize - 2);
      } else {
        ctx.fillStyle = '#94a3b8';
        ctx.fillText(line, pad, y + fontSize - 2);
      }

      // Cursor block on last line
      if (idx === lines.length - 1 && s.code.cursor) {
        const lineLen = ctx.measureText(line).width;
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(pad + lineLen + 6, y, 8, fontSize + 2);
      }
    });

    return canvas;
  }

  public renderSettingsUI(container: HTMLElement, onUpdate: () => void): void {
    const s = this.store.state;

    container.innerHTML = `
      <!-- Code Mode Selector -->
      <div class="field">
        <label class="field-label">Mode</label>
        <div class="segmented" id="code-mode-seg">
          <button class="seg-btn ${s.code.mode === 'code' ? 'active' : ''}" data-val="code">Code Editor</button>
          <button class="seg-btn ${s.code.mode === 'terminal' ? 'active' : ''}" data-val="terminal">Terminal / CLI</button>
        </div>
      </div>

      <!-- Code Editor Text Inputs -->
      <div id="code-editor-fields" style="${s.code.mode === 'code' ? '' : 'display: none;'}">
        <div class="field">
          <label class="field-label">Filename</label>
          <input type="text" id="code-filename" value="${s.code.filename || ''}" placeholder="index.ts" />
        </div>
        <div class="field">
          <label class="field-label">Code Snippet (Tab to indent)</label>
          <textarea id="code-text" rows="7" style="font-family: var(--font-mono); font-size: 12px;">${s.code.text || ''}</textarea>
        </div>
        <div class="field">
          <label class="field-label">Line Highlights (e.g. 2, 5-7)</label>
          <input type="text" id="code-highlight" value="${s.code.highlight || ''}" placeholder="2, 5-7" />
        </div>
        <div class="field">
          <label class="field-label">Syntax Theme</label>
          <select id="code-theme">
            ${CODE_THEMES.map((t) => `<option value="${t.id}" ${s.code.theme === t.id ? 'selected' : ''}>${t.name}</option>`).join('')}
          </select>
        </div>
        <!-- AI Code Generator Prompt -->
        <div class="field">
          <label class="field-label">✨ AI Code Generator</label>
          <div style="display: flex; gap: 6px;">
            <input type="text" id="ai-prompt" placeholder="e.g. TypeScript debounce function" />
            <button class="btn-primary" id="btn-ai-generate" style="padding: 0 10px;">Generate</button>
          </div>
        </div>
      </div>

      <!-- Terminal Text Inputs -->
      <div id="terminal-fields" style="${s.code.mode === 'terminal' ? '' : 'display: none;'}">
        <div class="field">
          <label class="field-label">Terminal Commands & Output</label>
          <textarea id="terminal-text" rows="7" style="font-family: var(--font-mono); font-size: 12px;">${s.code.terminal || ''}</textarea>
        </div>
      </div>

      <!-- Common Code Font Controls -->
      <div class="field">
        <div class="field-label">
          <span>Font Size</span>
          <span class="field-value" id="code-size-val">${s.code.fontSize || 15}px</span>
        </div>
        <input type="range" id="code-size" min="12" max="24" value="${s.code.fontSize || 15}" />
      </div>
    `;

    // Event listeners
    container.querySelector('#code-mode-seg')?.addEventListener('click', (e) => {
      const btn = (e.target as HTMLElement).closest('.seg-btn') as HTMLElement;
      if (!btn) return;
      container.querySelectorAll('#code-mode-seg .seg-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const mode = btn.dataset.val!;
      this.store.set('code.mode', mode);

      const codeFields = container.querySelector('#code-editor-fields') as HTMLElement;
      const termFields = container.querySelector('#terminal-fields') as HTMLElement;
      if (codeFields) codeFields.style.display = mode === 'code' ? '' : 'none';
      if (termFields) termFields.style.display = mode === 'terminal' ? '' : 'none';
      onUpdate();
    });

    container.querySelector('#code-filename')?.addEventListener('input', (e) => {
      this.store.set('code.filename', (e.target as HTMLInputElement).value);
      onUpdate();
    });

    // Indentation support in textarea
    const codeTextarea = container.querySelector('#code-text') as HTMLTextAreaElement;
    codeTextarea?.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        const start = codeTextarea.selectionStart;
        const end = codeTextarea.selectionEnd;
        const val = codeTextarea.value;
        codeTextarea.value = val.substring(0, start) + '  ' + val.substring(end);
        codeTextarea.selectionStart = codeTextarea.selectionEnd = start + 2;
        this.store.set('code.text', codeTextarea.value);
        onUpdate();
      }
    });

    codeTextarea?.addEventListener('input', (e) => {
      this.store.set('code.text', (e.target as HTMLTextAreaElement).value);
      onUpdate();
    });

    container.querySelector('#code-highlight')?.addEventListener('input', (e) => {
      this.store.set('code.highlight', (e.target as HTMLInputElement).value);
      onUpdate();
    });

    container.querySelector('#code-theme')?.addEventListener('change', (e) => {
      const themeId = (e.target as HTMLSelectElement).value;
      const theme = getTheme(themeId);
      this.store.patch({
        code: { theme: themeId },
        background: {
          colors: theme.defaultBackground.colors,
          angle: theme.defaultBackground.angle,
        },
      });
      onUpdate();
    });

    container.querySelector('#terminal-text')?.addEventListener('input', (e) => {
      this.store.set('code.terminal', (e.target as HTMLTextAreaElement).value);
      onUpdate();
    });

    container.querySelector('#code-size')?.addEventListener('input', (e) => {
      const val = Number((e.target as HTMLInputElement).value);
      this.store.set('code.fontSize', val);
      const valEl = container.querySelector('#code-size-val');
      if (valEl) valEl.textContent = `${val}%`;
      onUpdate();
    });

    // AI Code generator simulation
    container.querySelector('#btn-ai-generate')?.addEventListener('click', () => {
      const promptInput = container.querySelector('#ai-prompt') as HTMLInputElement;
      const prompt = promptInput?.value.trim() || 'utility function';

      const sampleSnippet = `// Generated for: "${prompt}"\nexport function debounce<T extends (...args: any[]) => any>(\n  fn: T,\n  delay = 300\n): (...args: Parameters<T>) => void {\n  let timer: ReturnType<typeof setTimeout>;\n  return (...args: Parameters<T>) => {\n    clearTimeout(timer);\n    timer = setTimeout(() => fn(...args), delay);\n  };\n}`;

      this.store.patch({
        code: {
          text: sampleSnippet,
          filename: 'debounce.ts',
          highlight: '5-9',
        },
      });
      if (codeTextarea) codeTextarea.value = sampleSnippet;
      onUpdate();
    });
  }
}
