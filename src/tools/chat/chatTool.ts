import { Store } from '../../core/store/store';

export type ChatPlatformId =
  | 'imessage'
  | 'whatsapp'
  | 'messenger'
  | 'instagram'
  | 'telegram'
  | 'signal'
  | 'snapchat'
  | 'teams'
  | 'slack'
  | 'discord'
  | 'twitch';

export interface ChatTheme {
  bg: string;
  header: string;
  text: string;
  muted: string;
  meBubble: string;
  meText: string;
  themBubble: string;
  themText: string;
  ticks: string;
}

export const CHAT_CONFIG: Record<ChatPlatformId, { name: string; light: ChatTheme; dark: ChatTheme }> = {
  imessage: {
    name: 'iMessage',
    light: { bg: '#ffffff', header: '#f6f6f6', text: '#000000', muted: '#8e8e93', meBubble: '#007aff', meText: '#ffffff', themBubble: '#e9e9eb', themText: '#000000', ticks: '#007aff' },
    dark: { bg: '#000000', header: '#1c1c1e', text: '#ffffff', muted: '#8e8e93', meBubble: '#0a84ff', meText: '#ffffff', themBubble: '#26252a', themText: '#ffffff', ticks: '#0a84ff' },
  },
  whatsapp: {
    name: 'WhatsApp',
    light: { bg: '#efeae2', header: '#ffffff', text: '#111b21', muted: '#667781', meBubble: '#d9fdd3', meText: '#111b21', themBubble: '#ffffff', themText: '#111b21', ticks: '#53bdeb' },
    dark: { bg: '#0b141a', header: '#1f2c34', text: '#e9edef', muted: '#8696a0', meBubble: '#005c4b', meText: '#e9edef', themBubble: '#202c33', themText: '#e9edef', ticks: '#53bdeb' },
  },
  messenger: {
    name: 'Messenger',
    light: { bg: '#ffffff', header: '#ffffff', text: '#050505', muted: '#65676b', meBubble: '#0a7cff', meText: '#ffffff', themBubble: '#f0f0f0', themText: '#050505', ticks: '#0a7cff' },
    dark: { bg: '#000000', header: '#000000', text: '#e4e6eb', muted: '#b0b3b8', meBubble: '#0a7cff', meText: '#ffffff', themBubble: '#303030', themText: '#e4e6eb', ticks: '#0a7cff' },
  },
  instagram: {
    name: 'Instagram DM',
    light: { bg: '#ffffff', header: '#ffffff', text: '#000000', muted: '#737373', meBubble: '#7e22ce', meText: '#ffffff', themBubble: '#efefef', themText: '#000000', ticks: '#7e22ce' },
    dark: { bg: '#000000', header: '#000000', text: '#f5f5f5', muted: '#a8a8a8', meBubble: '#9333ea', meText: '#ffffff', themBubble: '#262626', themText: '#f5f5f5', ticks: '#9333ea' },
  },
  telegram: {
    name: 'Telegram',
    light: { bg: '#9dcb9c', header: '#ffffff', text: '#000000', muted: '#707579', meBubble: '#eeffde', meText: '#000000', themBubble: '#ffffff', themText: '#000000', ticks: '#4fae4e' },
    dark: { bg: '#0e1621', header: '#17212b', text: '#ffffff', muted: '#6d7f8f', meBubble: '#2b5278', meText: '#ffffff', themBubble: '#182533', themText: '#ffffff', ticks: '#64b5ef' },
  },
  signal: {
    name: 'Signal',
    light: { bg: '#ffffff', header: '#ffffff', text: '#1b1b1b', muted: '#5e5e5e', meBubble: '#2c6bed', meText: '#ffffff', themBubble: '#e9e9e9', themText: '#1b1b1b', ticks: '#2c6bed' },
    dark: { bg: '#1b1b1b', header: '#1b1b1b', text: '#e9e9e9', muted: '#b9b9b9', meBubble: '#2c6bed', meText: '#ffffff', themBubble: '#3b3b3b', themText: '#e9e9e9', ticks: '#2c6bed' },
  },
  snapchat: {
    name: 'Snapchat',
    light: { bg: '#ffffff', header: '#ffffff', text: '#16191c', muted: '#8a9099', meBubble: '#f23c57', meText: '#ffffff', themBubble: '#0eadff', themText: '#ffffff', ticks: '#f23c57' },
    dark: { bg: '#121212', header: '#121212', text: '#ffffff', muted: '#9a9fa6', meBubble: '#f23c57', meText: '#ffffff', themBubble: '#0eadff', themText: '#ffffff', ticks: '#f23c57' },
  },
  teams: {
    name: 'Microsoft Teams',
    light: { bg: '#f5f5f5', header: '#ffffff', text: '#242424', muted: '#616161', meBubble: '#e8ebfa', meText: '#242424', themBubble: '#ffffff', themText: '#242424', ticks: '#4f52b2' },
    dark: { bg: '#1f1f1f', header: '#292929', text: '#ffffff', muted: '#adadad', meBubble: '#2f2f4a', meText: '#ffffff', themBubble: '#292929', themText: '#ffffff', ticks: '#7b83eb' },
  },
  slack: {
    name: 'Slack',
    light: { bg: '#ffffff', header: '#ffffff', text: '#1d1c1d', muted: '#616061', meBubble: '#f8f8f8', meText: '#1d1c1d', themBubble: '#f8f8f8', themText: '#1d1c1d', ticks: '#007a5a' },
    dark: { bg: '#1a1d21', header: '#1a1d21', text: '#d1d2d3', muted: '#ababad', meBubble: '#222529', meText: '#d1d2d3', themBubble: '#222529', themText: '#d1d2d3', ticks: '#007a5a' },
  },
  discord: {
    name: 'Discord',
    light: { bg: '#ffffff', header: '#ffffff', text: '#313338', muted: '#5c5e66', meBubble: '#f2f3f5', meText: '#313338', themBubble: '#f2f3f5', themText: '#313338', ticks: '#5865f2' },
    dark: { bg: '#313338', header: '#2b2d31', text: '#dbdee1', muted: '#949ba4', meBubble: '#383a40', meText: '#dbdee1', themBubble: '#383a40', themText: '#dbdee1', ticks: '#5865f2' },
  },
  twitch: {
    name: 'Twitch Chat',
    light: { bg: '#f7f7f8', header: '#ffffff', text: '#0e0e10', muted: '#53535f', meBubble: '#ffffff', meText: '#0e0e10', themBubble: '#ffffff', themText: '#0e0e10', ticks: '#9146ff' },
    dark: { bg: '#18181b', header: '#0e0e10', text: '#dedee3', muted: '#adadb8', meBubble: '#1f1f23', meText: '#dedee3', themBubble: '#1f1f23', themText: '#dedee3', ticks: '#a970ff' },
  },
};

export interface ChatMessage {
  from: 'me' | 'them';
  text: string;
}

export class ChatTool {
  private store: Store;

  constructor(store: Store) {
    this.store = store;
  }

  public renderContent(): HTMLCanvasElement {
    const s = this.store.state;
    const platform = (s.chat.platform || 'imessage') as ChatPlatformId;
    const appearance = s.chat.appearance === 'dark' ? 'dark' : 'light';
    const cfg = CHAT_CONFIG[platform] || CHAT_CONFIG.imessage;
    const theme = cfg[appearance];

    const cardW = 460;
    const headerH = 64;
    const pad = 20;

    const messages: ChatMessage[] = s.chat.messages || [];

    // Measure message bubbles
    const measureCanvas = document.createElement('canvas');
    const mctx = measureCanvas.getContext('2d')!;
    mctx.font = '400 15px -apple-system, sans-serif';

    const maxBubbleW = Math.round(cardW * 0.72);
    const measuredMessages = messages.map((msg) => {
      const lines = this.wrapText(mctx, msg.text, maxBubbleW - 24);
      const bubbleW = Math.min(
        maxBubbleW,
        Math.max(60, Math.max(...lines.map((l) => mctx.measureText(l).width)) + 24)
      );
      const bubbleH = lines.length * 20 + 16;
      return { msg, lines, bubbleW, bubbleH };
    });

    const totalMessagesH = measuredMessages.reduce((sum, item) => sum + item.bubbleH + 12, 0);
    const dateChipH = s.chat.day ? 36 : 0;
    const cardH = headerH + dateChipH + totalMessagesH + pad * 2;

    const canvas = document.createElement('canvas');
    canvas.width = cardW;
    canvas.height = cardH;
    const ctx = canvas.getContext('2d')!;

    // Card Background
    ctx.fillStyle = theme.bg;
    ctx.beginPath();
    ctx.roundRect(0, 0, cardW, cardH, 20);
    ctx.fill();

    // 1. Header Bar
    ctx.fillStyle = theme.header;
    ctx.beginPath();
    ctx.roundRect(0, 0, cardW, headerH, [20, 20, 0, 0]);
    ctx.fill();

    // Contact Avatar
    const avR = 18;
    const avX = pad + avR;
    const avY = headerH / 2;

    const avGrad = ctx.createLinearGradient(pad, avY - avR, pad + avR * 2, avY + avR);
    avGrad.addColorStop(0, '#3b82f6');
    avGrad.addColorStop(1, '#8b5cf6');
    ctx.fillStyle = avGrad;
    ctx.beginPath();
    ctx.arc(avX, avY, avR, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = '700 15px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText((s.chat.contact || 'A').charAt(0), avX, avY);

    // Contact Name & Status
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    ctx.font = '700 15px -apple-system, sans-serif';
    ctx.fillStyle = theme.text;
    ctx.fillText(s.chat.contact || 'Alex', pad + avR * 2 + 12, avY - 2);

    ctx.font = '400 12px -apple-system, sans-serif';
    ctx.fillStyle = theme.muted;
    ctx.fillText(s.chat.status || 'Online', pad + avR * 2 + 12, avY + 14);

    let curY = headerH + 14;

    // 2. Date Chip ("Today")
    if (s.chat.day) {
      ctx.font = '600 11px -apple-system, sans-serif';
      const dayText = s.chat.day;
      const chipW = ctx.measureText(dayText).width + 16;
      const chipH = 20;
      const chipX = (cardW - chipW) / 2;

      ctx.fillStyle = appearance === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)';
      ctx.beginPath();
      ctx.roundRect(chipX, curY, chipW, chipH, chipH / 2);
      ctx.fill();

      ctx.fillStyle = theme.muted;
      ctx.textAlign = 'center';
      ctx.fillText(dayText, cardW / 2, curY + 14);

      curY += dateChipH;
    }

    // 3. Render Message Bubbles
    measuredMessages.forEach(({ msg, lines, bubbleW, bubbleH }, idx) => {
      const isMe = msg.from === 'me';
      const bubbleX = isMe ? cardW - pad - bubbleW : pad;

      ctx.fillStyle = isMe ? theme.meBubble : theme.themBubble;
      ctx.beginPath();
      ctx.roundRect(bubbleX, curY, bubbleW, bubbleH, 16);
      ctx.fill();

      // Render Text Lines inside Bubble
      ctx.font = '400 14px -apple-system, sans-serif';
      ctx.fillStyle = isMe ? theme.meText : theme.themText;
      ctx.textAlign = 'left';

      lines.forEach((line, lIdx) => {
        ctx.fillText(line, bubbleX + 12, curY + 16 + lIdx * 20);
      });

      // Ticks for last 'me' message
      if (isMe && idx === measuredMessages.length - 1 && s.chat.ticks) {
        ctx.fillStyle = theme.ticks;
        ctx.font = '700 11px sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText('✓✓', cardW - pad + 1, curY + bubbleH + 12);
      }

      curY += bubbleH + 10;
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
    const messages: ChatMessage[] = s.chat.messages || [];

    container.innerHTML = `
      <!-- Platform Selector -->
      <div class="field">
        <label class="field-label">Messenger Platform</label>
        <select id="chat-platform">
          ${Object.entries(CHAT_CONFIG).map(([id, p]) => `
            <option value="${id}" ${s.chat.platform === id ? 'selected' : ''}>${p.name}</option>
          `).join('')}
        </select>
      </div>

      <!-- Appearance Mode -->
      <div class="field">
        <label class="field-label">Appearance</label>
        <div class="segmented" id="chat-appearance-seg">
          <button class="seg-btn ${s.chat.appearance === 'light' ? 'active' : ''}" data-val="light">Light</button>
          <button class="seg-btn ${s.chat.appearance === 'dark' ? 'active' : ''}" data-val="dark">Dark</button>
        </div>
      </div>

      <!-- Contact Details -->
      <div class="field">
        <label class="field-label">Contact Name</label>
        <input type="text" id="chat-contact" value="${s.chat.contact || ''}" placeholder="Alex" />
      </div>
      <div class="field">
        <label class="field-label">Status Label</label>
        <input type="text" id="chat-status" value="${s.chat.status || ''}" placeholder="Online" />
      </div>

      <!-- Messages Manager -->
      <div class="field">
        <div class="field-label">
          <span>Conversation Messages (${messages.length})</span>
          <button class="btn-primary" id="btn-add-message" style="height: 24px; padding: 0 8px; font-size: 11px;">+ Add</button>
        </div>
        <div id="chat-message-list" style="display: flex; flex-direction: column; gap: 8px; max-height: 220px; overflow-y: auto;">
          ${messages.map((m, idx) => `
            <div style="display: flex; gap: 6px; align-items: center; background: var(--bg-input); padding: 6px; border-radius: var(--radius-sm);">
              <button class="btn-secondary chat-toggle-sender" data-idx="${idx}" style="height: 28px; padding: 0 6px; font-size: 11px; font-weight: 600;">
                ${m.from === 'me' ? 'Me' : 'Them'}
              </button>
              <input type="text" class="chat-msg-text" data-idx="${idx}" value="${m.text}" style="flex: 1; height: 28px; padding: 4px 8px; font-size: 12px;" />
              <button class="btn-icon chat-delete-msg" data-idx="${idx}" style="width: 28px; height: 28px; color: #ef4444;">✕</button>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    // Event listeners
    container.querySelector('#chat-platform')?.addEventListener('change', (e) => {
      this.store.set('chat.platform', (e.target as HTMLSelectElement).value);
      onUpdate();
    });

    container.querySelector('#chat-appearance-seg')?.addEventListener('click', (e) => {
      const btn = (e.target as HTMLElement).closest('.seg-btn') as HTMLElement;
      if (!btn) return;
      container.querySelectorAll('#chat-appearance-seg .seg-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      this.store.set('chat.appearance', btn.dataset.val);
      onUpdate();
    });

    container.querySelector('#chat-contact')?.addEventListener('input', (e) => {
      this.store.set('chat.contact', (e.target as HTMLInputElement).value);
      onUpdate();
    });

    container.querySelector('#chat-status')?.addEventListener('input', (e) => {
      this.store.set('chat.status', (e.target as HTMLInputElement).value);
      onUpdate();
    });

    // Add message
    container.querySelector('#btn-add-message')?.addEventListener('click', () => {
      const curr = [...(this.store.state.chat.messages || [])];
      curr.push({ from: curr.length % 2 === 0 ? 'them' : 'me', text: 'New message' });
      this.store.set('chat.messages', curr);
      this.renderSettingsUI(container, onUpdate);
      onUpdate();
    });

    // Message list actions
    container.querySelector('#chat-message-list')?.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      if (target.classList.contains('chat-toggle-sender')) {
        const idx = Number(target.dataset.idx);
        const curr = [...(this.store.state.chat.messages || [])];
        curr[idx].from = curr[idx].from === 'me' ? 'them' : 'me';
        this.store.set('chat.messages', curr);
        this.renderSettingsUI(container, onUpdate);
        onUpdate();
      } else if (target.classList.contains('chat-delete-msg')) {
        const idx = Number(target.dataset.idx);
        const curr = [...(this.store.state.chat.messages || [])];
        curr.splice(idx, 1);
        this.store.set('chat.messages', curr);
        this.renderSettingsUI(container, onUpdate);
        onUpdate();
      }
    });

    container.querySelector('#chat-message-list')?.addEventListener('input', (e) => {
      const target = e.target as HTMLInputElement;
      if (target.classList.contains('chat-msg-text')) {
        const idx = Number(target.dataset.idx);
        const curr = [...(this.store.state.chat.messages || [])];
        curr[idx].text = target.value;
        this.store.set('chat.messages', curr);
        onUpdate();
      }
    });
  }
}
