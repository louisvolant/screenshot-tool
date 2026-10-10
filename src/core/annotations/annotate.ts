import { Store } from '../store/store';
import { AnnotationItem } from '../store/types';
import { createDefaultAnnotation } from './annotations';

export type AnnotationToolType = 'select' | 'text' | 'arrow' | 'box' | 'sticker' | 'loupe' | 'blur';

export class Annotator {
  private store: Store;
  public activeTool: AnnotationToolType = 'select';
  public selectedId: string | null = null;
  private isDragging = false;
  private dragStartX = 0;
  private dragStartY = 0;

  constructor(store: Store) {
    this.store = store;
  }

  public get annotations(): AnnotationItem[] {
    return this.store.state.annotations || [];
  }

  public setTool(tool: AnnotationToolType): void {
    this.activeTool = tool;
  }

  public addAnnotation(type: AnnotationItem['type'], x: number, y: number): AnnotationItem {
    const annot = createDefaultAnnotation(type, { x, y });
    const nextList = [...this.annotations, annot];
    this.store.set('annotations', nextList);
    this.selectedId = annot.id;
    return annot;
  }

  public updateAnnotation(id: string, props: Partial<AnnotationItem>): void {
    const nextList = this.annotations.map((a) => (a.id === id ? { ...a, ...props } : a));
    this.store.set('annotations', nextList);
  }

  public deleteSelected(): boolean {
    if (!this.selectedId) return false;
    const nextList = this.annotations.filter((a) => a.id !== this.selectedId);
    this.store.set('annotations', nextList);
    this.selectedId = null;
    return true;
  }

  public clearAll(): void {
    this.store.set('annotations', []);
    this.selectedId = null;
  }

  public select(id: string | null): void {
    this.selectedId = id;
  }

  public handleCanvasClick(relX: number, relY: number): void {
    if (this.activeTool !== 'select') {
      this.addAnnotation(this.activeTool as AnnotationItem['type'], relX, relY);
      this.activeTool = 'select';
      return;
    }

    // Hit test annotations
    const hit = this.annotations.find((a) => {
      const dist = Math.hypot(a.x - relX, a.y - relY);
      return dist < 45;
    });

    this.selectedId = hit ? hit.id : null;
  }
}
