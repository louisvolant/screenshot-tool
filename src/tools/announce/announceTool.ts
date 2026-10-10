import { Store } from '../../core/store/store';

export type AnnounceKind = 'stat' | 'release';
export type TrendDirection = 'up' | 'down';
export type ChangelogTag = 'new' | 'improved' | 'fixed';

export interface ChangelogItem {
  tag: ChangelogTag;
  text: string;
}

export class AnnounceTool {
  private store: Store;

  constructor(store: Store) {
    this.store = store;
  }

  public renderContent(): HTMLCanvasElement {
    const s = this.store.state;
    const kind = (s.announce.kind || 'stat') as AnnounceKind;

    if (kind === 'stat') {
      return this.renderStatCard();
    } else {
      return this.renderReleaseCard();
    }
  }

  /**
   * Render KPI / Metric Stat Card
   */
  private renderStatCard(): HTMLCanvasElement {
    const s = this.store.state;
    const cardW = 520;
    const hasChart = Boolean(s.announce.chart);
    const cardH = hasChart ? 320 : 230;
    const pad = 36;

    const canvas = document.createElement('canvas');
    canvas.width = cardW;
    canvas.height = cardH;
    const ctx = canvas.getContext('2d')!;

    // Surface background: clean modern dark/glass card
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.roundRect(0, 0, cardW, cardH, 20);
    ctx.fill();

    // Subtle outline border
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.stroke();

    // Brand Header
    ctx.fillStyle = '#6366f1';
    ctx.beginPath();
    ctx.arc(pad + 10, pad + 10, 10, 0, Math.PI * 2);
    ctx.fill();

    ctx.font = '600 13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText(s.announce.brand || 'Acme Metrics', pad + 30, pad + 15);

    // Delta / Trend pill (top right)
    const trend = (s.announce.trend || 'up') as TrendDirection;
    const isUp = trend === 'up';
    const trendText = `${isUp ? '↑ ' : '↓ '}${s.announce.change || '+0%'}`;
    ctx.font = '600 13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    const pillW = ctx.measureText(trendText).width + 18;
    const pillH = 24;
    const pillX = cardW - pad - pillW;
    const pillY = pad;

    ctx.fillStyle = isUp ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)';
    ctx.beginPath();
    ctx.roundRect(pillX, pillY, pillW, pillH, 12);
    ctx.fill();

    ctx.fillStyle = isUp ? '#4ade80' : '#f87171';
    ctx.fillText(trendText, pillX + 9, pillY + 16);

    // Hero Metric Value
    ctx.font = '800 52px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(s.announce.value || '0', pad, pad + 82);

    // Metric Label & Period
    ctx.font = '500 15px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillStyle = '#cbd5e1';
    const label = s.announce.label || 'Active metric';
    ctx.fillText(label, pad, pad + 114);

    if (s.announce.period) {
      ctx.font = '400 13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillStyle = '#64748b';
      const labelW = ctx.measureText(label).width;
      ctx.fillText(`· ${s.announce.period}`, pad + labelW + 8, pad + 114);
    }

    // Sparkline Chart (if enabled)
    if (hasChart) {
      this.drawSparkline(ctx, pad, cardH - pad - 60, cardW - pad * 2, 60, s.announce.points || '');
    }

    return canvas;
  }

  /**
   * Render Bezier Sparkline Chart
   */
  private drawSparkline(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    pointsStr: string
  ): void {
    const raw = pointsStr
      .trim()
      .split(/[\s,;]+/)
      .map((n) => parseFloat(n))
      .filter((n) => !isNaN(n));

    const vals = raw.length >= 2 ? raw : [10, 15, 12, 20, 25, 22, 30, 38];
    const min = Math.min(...vals);
    const max = Math.max(...vals);
    const range = max - min || 1;

    const coords: Array<{ cx: number; cy: number }> = vals.map((v, i) => {
      const cx = x + (i / (vals.length - 1)) * w;
      const cy = y + h - ((v - min) / range) * h;
      return { cx, cy };
    });

    // Draw area fill
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(coords[0].cx, y + h);
    ctx.lineTo(coords[0].cx, coords[0].cy);

    for (let i = 0; i < coords.length - 1; i++) {
      const p0 = coords[i];
      const p1 = coords[i + 1];
      const cpX = (p0.cx + p1.cx) / 2;
      ctx.bezierCurveTo(cpX, p0.cy, cpX, p1.cy, p1.cx, p1.cy);
    }

    ctx.lineTo(coords[coords.length - 1].cx, y + h);
    ctx.closePath();

    const grad = ctx.createLinearGradient(0, y, 0, y + h);
    grad.addColorStop(0, 'rgba(99, 102, 241, 0.4)');
    grad.addColorStop(1, 'rgba(99, 102, 241, 0.0)');
    ctx.fillStyle = grad;
    ctx.fill();

    // Draw stroke line
    ctx.beginPath();
    ctx.moveTo(coords[0].cx, coords[0].cy);
    for (let i = 0; i < coords.length - 1; i++) {
      const p0 = coords[i];
      const p1 = coords[i + 1];
      const cpX = (p0.cx + p1.cx) / 2;
      ctx.bezierCurveTo(cpX, p0.cy, cpX, p1.cy, p1.cx, p1.cy);
    }
    ctx.strokeStyle = '#6366f1';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Draw final point dot
    const last = coords[coords.length - 1];
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(last.cx, last.cy, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#6366f1';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(last.cx, last.cy, 5, 0, Math.PI * 2);
    ctx.stroke();

    ctx.restore();
  }

  /**
   * Render Product Release / Changelog Card
   */
  private renderReleaseCard(): HTMLCanvasElement {
    const s = this.store.state;
    const cardW = 540;
    const items: ChangelogItem[] = Array.isArray(s.announce.items) ? s.announce.items.slice(0, 6) : [];
    const pad = 36;
    const itemH = 38;
    const cardH = 140 + items.length * itemH;

    const canvas = document.createElement('canvas');
    canvas.width = cardW;
    canvas.height = cardH;
    const ctx = canvas.getContext('2d')!;

    // Card background
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.roundRect(0, 0, cardW, cardH, 20);
    ctx.fill();

    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.stroke();

    // Header Title
    ctx.font = '700 22px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(s.announce.title || 'Product Update', pad, pad + 10);

    // Version pill badge
    const version = s.announce.version || 'v1.0.0';
    ctx.font = '700 13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    const vWidth = ctx.measureText(version).width + 16;
    const vPillX = pad;
    const vPillY = pad + 24;

    ctx.fillStyle = 'rgba(99, 102, 241, 0.2)';
    ctx.beginPath();
    ctx.roundRect(vPillX, vPillY, vWidth, 22, 11);
    ctx.fill();

    ctx.fillStyle = '#818cf8';
    ctx.fillText(version, vPillX + 8, vPillY + 15);

    // Date
    if (s.announce.date) {
      ctx.font = '400 13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText(s.announce.date, vPillX + vWidth + 12, vPillY + 15);
    }

    // Divider line
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(pad, pad + 64);
    ctx.lineTo(cardW - pad, pad + 64);
    ctx.stroke();

    // Changelog rows
    let curY = pad + 82;
    for (const item of items) {
      const tag = item.tag || 'new';
      let tagBg = 'rgba(34, 197, 94, 0.15)';
      let tagColor = '#4ade80';
      let tagLabel = 'New';

      if (tag === 'improved') {
        tagBg = 'rgba(59, 130, 246, 0.15)';
        tagColor = '#60a5fa';
        tagLabel = 'Improved';
      } else if (tag === 'fixed') {
        tagBg = 'rgba(249, 115, 22, 0.15)';
        tagColor = '#fb923c';
        tagLabel = 'Fixed';
      }

      // Tag pill
      ctx.font = '700 11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      const tWidth = ctx.measureText(tagLabel).width + 12;
      ctx.fillStyle = tagBg;
      ctx.beginPath();
      ctx.roundRect(pad, curY, tWidth, 20, 6);
      ctx.fill();

      ctx.fillStyle = tagColor;
      ctx.fillText(tagLabel, pad + 6, curY + 14);

      // Item text
      ctx.font = '500 14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillStyle = '#e2e8f0';
      ctx.fillText(item.text, pad + tWidth + 12, curY + 15);

      curY += itemH;
    }

    return canvas;
  }

  /**
   * Render Sidebar UI Settings
   */
  public renderSettingsUI(container: HTMLElement, onUpdate: () => void): void {
    const s = this.store.state;
    const kind = s.announce.kind || 'stat';

    container.innerHTML = `
      <!-- Announce Kind Selector -->
      <div class="field">
        <label class="field-label">Announcement Type</label>
        <div class="segmented" id="announce-kind-seg">
          <button class="seg-btn ${kind === 'stat' ? 'active' : ''}" data-val="stat">KPI / Metric</button>
          <button class="seg-btn ${kind === 'release' ? 'active' : ''}" data-val="release">Changelog</button>
        </div>
      </div>

      <!-- Stat Settings (Visible when kind === 'stat') -->
      <div id="announce-stat-fields" style="${kind === 'stat' ? '' : 'display: none;'}">
        <div class="field">
          <label class="field-label">Brand / Product</label>
          <input type="text" id="stat-brand" value="${s.announce.brand || ''}" placeholder="Acme Metrics" />
        </div>
        <div class="field">
          <label class="field-label">Metric Value</label>
          <input type="text" id="stat-value" value="${s.announce.value || ''}" placeholder="42,850" />
        </div>
        <div class="field">
          <label class="field-label">Descriptor Label</label>
          <input type="text" id="stat-label" value="${s.announce.label || ''}" placeholder="Active developers" />
        </div>
        <div class="grid-2">
          <div class="field">
            <label class="field-label">Trend</label>
            <div class="segmented" id="stat-trend-seg">
              <button class="seg-btn ${s.announce.trend === 'up' ? 'active' : ''}" data-val="up">↑ Up</button>
              <button class="seg-btn ${s.announce.trend === 'down' ? 'active' : ''}" data-val="down">↓ Down</button>
            </div>
          </div>
          <div class="field">
            <label class="field-label">Delta Change</label>
            <input type="text" id="stat-change" value="${s.announce.change || ''}" placeholder="+38%" />
          </div>
        </div>
        <div class="field">
          <label class="field-label">Benchmark Period</label>
          <input type="text" id="stat-period" value="${s.announce.period || ''}" placeholder="vs last month" />
        </div>
        <div class="field" style="display: flex; flex-direction: row; align-items: center; justify-content: space-between;">
          <label class="field-label" style="margin: 0;">Sparkline Mini-Chart</label>
          <input type="checkbox" id="stat-chart" ${s.announce.chart ? 'checked' : ''} />
        </div>
        <div class="field" id="stat-points-field" style="${s.announce.chart ? '' : 'display: none;'}">
          <label class="field-label">Data Points (space-separated)</label>
          <input type="text" id="stat-points" value="${s.announce.points || ''}" placeholder="10 15 20 28 35 42" />
        </div>
      </div>

      <!-- Release Settings (Visible when kind === 'release') -->
      <div id="announce-release-fields" style="${kind === 'release' ? '' : 'display: none;'}">
        <div class="field">
          <label class="field-label">Release Title</label>
          <input type="text" id="rel-title" value="${s.announce.title || ''}" placeholder="Product Update" />
        </div>
        <div class="grid-2">
          <div class="field">
            <label class="field-label">Version Tag</label>
            <input type="text" id="rel-version" value="${s.announce.version || ''}" placeholder="v2.4.0" />
          </div>
          <div class="field">
            <label class="field-label">Release Date</label>
            <input type="text" id="rel-date" value="${s.announce.date || ''}" placeholder="October 2026" />
          </div>
        </div>
        <div class="field">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
            <label class="field-label" style="margin: 0;">Changelog Items (max 6)</label>
            <button id="btn-add-changelog" class="btn" style="padding: 2px 8px; font-size: 11px;">+ Add Item</button>
          </div>
          <div id="changelog-items-container" style="display: flex; flex-direction: column; gap: 8px;"></div>
        </div>
      </div>
    `;

    // Render changelog rows
    const renderChangelogRows = () => {
      const listContainer = container.querySelector('#changelog-items-container');
      if (!listContainer) return;
      const items: ChangelogItem[] = this.store.state.announce.items || [];
      listContainer.innerHTML = '';

      items.forEach((item, idx) => {
        const row = document.createElement('div');
        row.style.cssText = 'display: flex; gap: 6px; align-items: center;';
        row.innerHTML = `
          <select class="item-tag-select" data-idx="${idx}" style="width: 86px; padding: 4px; font-size: 12px; background: var(--bg-hover); border: 1px solid var(--border-color); color: var(--text-color); border-radius: 4px;">
            <option value="new" ${item.tag === 'new' ? 'selected' : ''}>New</option>
            <option value="improved" ${item.tag === 'improved' ? 'selected' : ''}>Improved</option>
            <option value="fixed" ${item.tag === 'fixed' ? 'selected' : ''}>Fixed</option>
          </select>
          <input type="text" class="item-text-input" data-idx="${idx}" value="${item.text}" style="flex: 1; padding: 4px 8px; font-size: 12px;" />
          <button class="btn-del-item" data-idx="${idx}" style="background: transparent; border: none; color: #ef4444; cursor: pointer; padding: 4px; font-weight: bold;">✕</button>
        `;
        listContainer.appendChild(row);
      });

      // Hook events on rows
      listContainer.querySelectorAll('.item-tag-select').forEach((sel) => {
        sel.addEventListener('change', (e) => {
          const target = e.target as HTMLSelectElement;
          const idx = parseInt(target.dataset.idx!, 10);
          const cur = [...(this.store.state.announce.items || [])];
          if (cur[idx]) {
            cur[idx] = { ...cur[idx], tag: target.value as ChangelogTag };
            this.store.set('announce.items', cur);
            onUpdate();
          }
        });
      });

      listContainer.querySelectorAll('.item-text-input').forEach((inp) => {
        inp.addEventListener('input', (e) => {
          const target = e.target as HTMLInputElement;
          const idx = parseInt(target.dataset.idx!, 10);
          const cur = [...(this.store.state.announce.items || [])];
          if (cur[idx]) {
            cur[idx] = { ...cur[idx], text: target.value };
            this.store.set('announce.items', cur);
            onUpdate();
          }
        });
      });

      listContainer.querySelectorAll('.btn-del-item').forEach((btn) => {
        btn.addEventListener('click', (e) => {
          const target = (e.target as HTMLElement).closest('.btn-del-item') as HTMLElement;
          const idx = parseInt(target.dataset.idx!, 10);
          const cur = [...(this.store.state.announce.items || [])];
          cur.splice(idx, 1);
          this.store.set('announce.items', cur);
          renderChangelogRows();
          onUpdate();
        });
      });
    };

    renderChangelogRows();

    // Event Listeners
    container.querySelector('#announce-kind-seg')?.addEventListener('click', (e) => {
      const btn = (e.target as HTMLElement).closest('.seg-btn') as HTMLElement;
      if (!btn) return;
      container.querySelectorAll('#announce-kind-seg .seg-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const val = btn.dataset.val!;
      this.store.set('announce.kind', val);

      const statDiv = container.querySelector('#announce-stat-fields') as HTMLElement;
      const relDiv = container.querySelector('#announce-release-fields') as HTMLElement;
      if (statDiv) statDiv.style.display = val === 'stat' ? '' : 'none';
      if (relDiv) relDiv.style.display = val === 'release' ? '' : 'none';
      onUpdate();
    });

    // Stat inputs
    container.querySelector('#stat-brand')?.addEventListener('input', (e) => {
      this.store.set('announce.brand', (e.target as HTMLInputElement).value);
      onUpdate();
    });
    container.querySelector('#stat-value')?.addEventListener('input', (e) => {
      this.store.set('announce.value', (e.target as HTMLInputElement).value);
      onUpdate();
    });
    container.querySelector('#stat-label')?.addEventListener('input', (e) => {
      this.store.set('announce.label', (e.target as HTMLInputElement).value);
      onUpdate();
    });

    container.querySelector('#stat-trend-seg')?.addEventListener('click', (e) => {
      const btn = (e.target as HTMLElement).closest('.seg-btn') as HTMLElement;
      if (!btn) return;
      container.querySelectorAll('#stat-trend-seg .seg-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      this.store.set('announce.trend', btn.dataset.val);
      onUpdate();
    });

    container.querySelector('#stat-change')?.addEventListener('input', (e) => {
      this.store.set('announce.change', (e.target as HTMLInputElement).value);
      onUpdate();
    });
    container.querySelector('#stat-period')?.addEventListener('input', (e) => {
      this.store.set('announce.period', (e.target as HTMLInputElement).value);
      onUpdate();
    });

    container.querySelector('#stat-chart')?.addEventListener('change', (e) => {
      const chk = (e.target as HTMLInputElement).checked;
      this.store.set('announce.chart', chk);
      const pointsField = container.querySelector('#stat-points-field') as HTMLElement;
      if (pointsField) pointsField.style.display = chk ? '' : 'none';
      onUpdate();
    });

    container.querySelector('#stat-points')?.addEventListener('input', (e) => {
      this.store.set('announce.points', (e.target as HTMLInputElement).value);
      onUpdate();
    });

    // Release inputs
    container.querySelector('#rel-title')?.addEventListener('input', (e) => {
      this.store.set('announce.title', (e.target as HTMLInputElement).value);
      onUpdate();
    });
    container.querySelector('#rel-version')?.addEventListener('input', (e) => {
      this.store.set('announce.version', (e.target as HTMLInputElement).value);
      onUpdate();
    });
    container.querySelector('#rel-date')?.addEventListener('input', (e) => {
      this.store.set('announce.date', (e.target as HTMLInputElement).value);
      onUpdate();
    });

    container.querySelector('#btn-add-changelog')?.addEventListener('click', () => {
      const cur = [...(this.store.state.announce.items || [])];
      if (cur.length < 6) {
        cur.push({ tag: 'new', text: 'New feature addition' });
        this.store.set('announce.items', cur);
        renderChangelogRows();
        onUpdate();
      }
    });
  }
}
