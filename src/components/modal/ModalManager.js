/**
 * ModalManager
 *
 * A plain JavaScript singleton (NOT a React component) that powers the
 * Portal pattern for CustomModal. It has two independent jobs:
 *
 * 1. Portal registry — holds the actual JSX node that each open
 *    <CustomModal /> instance wants rendered, keyed by a unique id, and
 *    notifies subscribers (ModalProvider) whenever the registry changes.
 *    This is what lets a modal declared deep inside, say, ProfileScreen,
 *    actually paint above the entire app: ModalProvider is mounted once at
 *    the root and is the only thing that ever renders these nodes.
 *
 * 2. Stacking + queueing — assigns incrementing z-index values so the
 *    most-recently-opened modal renders on top, and provides a tiny FIFO
 *    queue so modals that opt into `queue="some-key"` take turns instead
 *    of overlapping.
 *
 * Being a singleton outside React means CustomModal instances never need a
 * Context provider to talk to each other or to the portal host — they all
 * import the same object.
 */

let zIndexCounter = 1000;

class ModalManagerClass {
  constructor() {
    // id -> { id, zIndex, render }
    this.portals = new Map();
    this.listeners = new Set();

    // queueKey -> id of the modal currently allowed to be open
    this.queueHolders = new Map();
    // queueKey -> array of pending { id, run } waiting their turn
    this.queues = new Map();
  }

  /** Subscribe to registry changes. Returns an unsubscribe function. */
  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    const snapshot = this.getSnapshot();
    this.listeners.forEach(listener => listener(snapshot));
  }

  /** Ordered (by stacking position) array of currently mounted portal nodes. */
  getSnapshot() {
    return Array.from(this.portals.values()).sort((a, b) => a.zIndex - b.zIndex);
  }

  /**
   * Mount or replace the node a given modal id renders into the portal.
   * `meta` carries presentation hints (e.g. status bar tint) that the
   * portal host needs without having to inspect the rendered node itself.
   */
  mount(id, render, meta) {
    const existing = this.portals.get(id);
    const zIndex = existing ? existing.zIndex : zIndexCounter++;
    this.portals.set(id, { id, zIndex, render, meta });
    this.notify();
  }

  /** Remove a modal's node from the portal entirely (after exit animation). */
  unmount(id) {
    if (!this.portals.has(id)) return;
    this.portals.delete(id);
    this.notify();
  }

  /** Move an already-mounted modal to the top of the visual stack. */
  bringToFront(id) {
    const entry = this.portals.get(id);
    if (!entry) return;
    entry.zIndex = zIndexCounter++;
    this.notify();
  }

  // --- Queue support -------------------------------------------------
  // A queue lets several CustomModal instances share a "slot" (queueKey)
  // so only one of them is ever open at a time; the rest wait their turn.

  /**
   * Ask permission to open a modal that participates in queue `queueKey`.
   * If the slot is free, `run` executes immediately. Otherwise it is
   * stored and executed automatically once the current holder releases.
   */
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
      // Already holds the slot (e.g. re-entrant open call).
      run();
      return;
    }

    const pending = this.queues.get(queueKey) ?? [];
    // A given modal id should only ever have one pending request queued.
    const deduped = pending.filter(item => item.id !== id);
    deduped.push({ id, run });
    this.queues.set(queueKey, deduped);
  }

  /** Release a queue slot, letting the next waiting modal (if any) open. */
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

  /** Drop a pending queue request, e.g. when its owning component unmounts. */
  cancelQueueRequest(queueKey, id) {
    if (!queueKey) return;
    const pending = this.queues.get(queueKey);
    if (!pending) return;
    this.queues.set(queueKey, pending.filter(item => item.id !== id));
  }
}

// Single shared instance used by every CustomModal / ModalProvider.
export const ModalManager = new ModalManagerClass();

let idCounter = 0;
/** Generates a stable, unique id for each CustomModal instance. */
export function generateModalId() {
  idCounter += 1;
  return `custom-modal-${idCounter}-${Date.now()}`;
}
