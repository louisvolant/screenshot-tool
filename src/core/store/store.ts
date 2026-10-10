import { AppState, StateListener } from './types';
import { DEFAULTS } from './defaults';

const STORAGE_KEY = 'graphic_studio_state_v1';
const HISTORY_LIMIT = 100;
const COALESCE_MS = 800;

export const clone = <T>(val: T): T => structuredClone(val);

export function getPath(obj: any, path: string): any {
  return path.split('.').reduce((acc, key) => (acc == null ? undefined : acc[key]), obj);
}

export function setPathMut(obj: any, path: string, value: any): void {
  const keys = path.split('.');
  const last = keys.pop()!;
  const target = keys.reduce((acc, key) => {
    if (acc[key] == null || typeof acc[key] !== 'object') {
      acc[key] = {};
    }
    return acc[key];
  }, obj);
  target[last] = value;
}

export function deepMerge(base: any, patch: any): any {
  if (patch == null || typeof patch !== 'object' || Array.isArray(patch)) {
    return clone(base);
  }
  const out: any = {};
  for (const key of Object.keys(base)) {
    const b = base[key];
    const p = patch[key];
    if (p === undefined) {
      out[key] = clone(b);
    } else if (b && typeof b === 'object' && !Array.isArray(b) && !Array.isArray(p)) {
      out[key] = deepMerge(b, p);
    } else if (Array.isArray(b)) {
      out[key] = Array.isArray(p) ? clone(p) : clone(b);
    } else {
      out[key] = typeof p === typeof b ? p : clone(b);
    }
  }
  for (const key of Object.keys(patch)) {
    if (out[key] === undefined) {
      out[key] = clone(patch[key]);
    }
  }
  return out;
}

export class Store {
  public state: AppState;
  private listeners = new Set<StateListener>();
  private past: string[] = [];
  private future: string[] = [];
  private lastKey: string | null = null;
  private lastTime = 0;
  private saveTimer: any = null;

  constructor(initialState?: Partial<AppState>) {
    const loaded = this.loadLocal();
    this.state = deepMerge(DEFAULTS, loaded ? deepMerge(loaded, initialState || {}) : (initialState || {}));
  }

  public get(path: string): any {
    return getPath(this.state, path);
  }

  public set(path: string, value: any, options: { history?: boolean; key?: string } = {}): void {
    const { history = !path.startsWith('export.'), key = path } = options;
    const current = this.get(path);
    if (current === value) return;

    if (history) {
      this.recordHistory(key);
    }

    setPathMut(this.state, path, value);
    this.notify([path]);
    this.scheduleSave();
  }

  public patch(patchObj: Record<string, any>, options: { history?: boolean; key?: string } = {}): void {
    const { history = true, key = 'patch' } = options;
    if (history) {
      this.recordHistory(key);
    }

    const changedPaths: string[] = [];
    const applyRecursive = (target: any, patch: any, prefix = '') => {
      for (const k of Object.keys(patch)) {
        const full = prefix ? `${prefix}.${k}` : k;
        const v = patch[k];
        if (v !== null && typeof v === 'object' && !Array.isArray(v)) {
          if (!target[k]) target[k] = {};
          applyRecursive(target[k], v, full);
        } else {
          target[k] = clone(v);
          changedPaths.push(full);
        }
      }
    };

    applyRecursive(this.state, patchObj);
    this.notify(changedPaths);
    this.scheduleSave();
  }

  public subscribe(listener: StateListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  public get canUndo(): boolean {
    return this.past.length > 0;
  }

  public get canRedo(): boolean {
    return this.future.length > 0;
  }

  public undo(): boolean {
    if (!this.canUndo) return false;
    const prevJson = this.past.pop()!;
    this.future.push(JSON.stringify(this.state));
    this.state = JSON.parse(prevJson);
    this.lastKey = null;
    this.notify(['*']);
    this.scheduleSave();
    return true;
  }

  public redo(): boolean {
    if (!this.canRedo) return false;
    const nextJson = this.future.pop()!;
    this.past.push(JSON.stringify(this.state));
    this.state = JSON.parse(nextJson);
    this.lastKey = null;
    this.notify(['*']);
    this.scheduleSave();
    return true;
  }

  public reset(section?: keyof AppState): void {
    this.recordHistory(`reset:${section || 'all'}`);
    if (section && DEFAULTS[section] !== undefined) {
      (this.state as any)[section] = clone(DEFAULTS[section]);
      this.notify([section]);
    } else {
      this.state = clone(DEFAULTS);
      this.notify(['*']);
    }
    this.scheduleSave();
  }

  public exportJSON(): string {
    return JSON.stringify(this.state, null, 2);
  }

  public importJSON(jsonStr: string): boolean {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed && typeof parsed === 'object') {
        this.recordHistory('import');
        this.state = deepMerge(DEFAULTS, parsed);
        this.notify(['*']);
        this.scheduleSave();
        return true;
      }
    } catch {
      // invalid json
    }
    return false;
  }

  private recordHistory(key: string): void {
    const now = Date.now();
    if (this.lastKey === key && now - this.lastTime < COALESCE_MS) {
      // Coalesce rapid slider scrubber adjustments
      return;
    }
    this.past.push(JSON.stringify(this.state));
    if (this.past.length > HISTORY_LIMIT) {
      this.past.shift();
    }
    this.future = [];
    this.lastKey = key;
    this.lastTime = now;
  }

  private notify(changedPaths: string[]): void {
    for (const listener of this.listeners) {
      listener(this.state, changedPaths);
    }
  }

  private scheduleSave(): void {
    clearTimeout(this.saveTimer);
    this.saveTimer = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      } catch {
        // quota exceeded or disabled
      }
    }, 500);
  }

  private loadLocal(): AppState | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch {
      // ignore
    }
    return null;
  }
}
