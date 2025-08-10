// Observer: Simple event bus to decouple publishers and subscribers

class EventBus {
  constructor() { this.listeners = new Map(); }
  on(event, listener) { if (!this.listeners.has(event)) this.listeners.set(event, new Set()); this.listeners.get(event).add(listener); return () => this.off(event, listener); }
  off(event, listener) { this.listeners.get(event)?.delete(listener); }
  emit(event, payload) { this.listeners.get(event)?.forEach((l) => { try { l(payload); } catch (e) { /* ignore */ } }); }
}

const globalEventBus = new EventBus();

module.exports = { EventBus, globalEventBus };