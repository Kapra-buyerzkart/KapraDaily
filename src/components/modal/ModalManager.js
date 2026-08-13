let zIndexCounter = 1000;

class ModalManagerClass {
  constructor() {
    this.portals = new Map();
    this.listeners = new Set();

    this.queueHolders = new Map();
    this.queues = new Map();
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    const snapshot = this.getSnapshot();
    this.listeners.forEach(listener => listener(snapshot));
  }

  getSnapshot() {
    return Array.from(this.portals.values()).sort((a, b) => a.zIndex - b.zIndex);
  }

  mount(id, render, meta) {
    const existing = this.portals.get(id);
    const zIndex = existing ? existing.zIndex : zIndexCounter++;
    this.portals.set(id, { id, zIndex, render, meta });
    this.notify();
  }

  unmount(id) {
    if (!this.portals.has(id)) return;
    this.portals.delete(id);
    this.notify();
  }

  bringToFront(id) {
    const entry = this.portals.get(id);
    if (!entry) return;
    entry.zIndex = zIndexCounter++;
    this.notify();
  }

  requestOpen(queueKey, id, run) {
    if (!queueKey) {
      run();
      return;
    }

    const holder = this.queueHolders.get(queueKey);
    if (!holder) {
      this.queueHolders.set(queueKey, id);
      run();
      return;
    }

    if (holder === id) {
      run();
      return;
    }

    const pending = this.queues.get(queueKey) ?? [];
    const deduped = pending.filter(item => item.id !== id);
    deduped.push({ id, run });
    this.queues.set(queueKey, deduped);
  }

  releaseQueue(queueKey, id) {
    if (!queueKey) return;
    if (this.queueHolders.get(queueKey) !== id) return;

    this.queueHolders.delete(queueKey);
    const pending = this.queues.get(queueKey);
    if (pending && pending.length > 0) {
      const [next, ...rest] = pending;
      this.queues.set(queueKey, rest);
      this.queueHolders.set(queueKey, next.id);
      next.run();
    }
  }

  cancelQueueRequest(queueKey, id) {
    if (!queueKey) return;
    const pending = this.queues.get(queueKey);
    if (!pending) return;
    this.queues.set(queueKey, pending.filter(item => item.id !== id));
  }
}

export const ModalManager = new ModalManagerClass();

let idCounter = 0;
export function generateModalId() {
  idCounter += 1;
  return `custom-modal-${idCounter}-${Date.now()}`;
}
