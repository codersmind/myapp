"use client";

type SectionRecord = {
  element: HTMLElement;
  progress: number;
  listeners: Set<(progress: number) => void>;
};

class ScrollProgressManager {
  private sections = new Map<string, SectionRecord>();
  private rafId: number | null = null;
  private listening = false;

  register(id: string, element: HTMLElement, listener: (progress: number) => void) {
    let record = this.sections.get(id);
    if (!record) {
      record = { element, progress: 0, listeners: new Set() };
      this.sections.set(id, record);
    }
    record.element = element;
    record.listeners.add(listener);
    this.ensureListening();
    this.updateSection(id);
    return () => {
      record?.listeners.delete(listener);
      if (record && record.listeners.size === 0) {
        this.sections.delete(id);
      }
      if (this.sections.size === 0) {
        this.stopListening();
      }
    };
  }

  getProgress(id: string) {
    return this.sections.get(id)?.progress ?? 0;
  }

  private updateSection(id: string) {
    const record = this.sections.get(id);
    if (!record) return;

    const scrollable = record.element.offsetHeight - window.innerHeight;
    const next =
      scrollable <= 0
        ? 0
        : Math.min(1, Math.max(0, -record.element.getBoundingClientRect().top / scrollable));

    if (Math.abs(next - record.progress) < 0.0015) return;

    record.progress = next;
    record.listeners.forEach((listener) => listener(next));
  }

  private onScroll = () => {
    if (this.rafId !== null) return;
    this.rafId = requestAnimationFrame(() => {
      this.sections.forEach((_, id) => this.updateSection(id));
      this.rafId = null;
    });
  };

  private ensureListening() {
    if (this.listening) return;
    this.listening = true;
    window.addEventListener("scroll", this.onScroll, { passive: true });
    window.addEventListener("resize", this.onScroll, { passive: true });
    window.addEventListener("touchmove", this.onScroll, { passive: true });
  }

  private stopListening() {
    if (!this.listening) return;
    this.listening = false;
    window.removeEventListener("scroll", this.onScroll);
    window.removeEventListener("resize", this.onScroll);
    window.removeEventListener("touchmove", this.onScroll);
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }
}

export const scrollProgressManager = new ScrollProgressManager();
