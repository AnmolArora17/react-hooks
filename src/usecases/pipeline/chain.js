// Chain of Responsibility: Each handler can process or delegate to the next handler

class Handler {
  setNext(next) { this.next = next; return next; }
  async handle(records) { if (this.next) return this.next.handle(records); return records; }
}

class SchemaValidator extends Handler {
  constructor({ requiredFields }) { super(); this.requiredFields = requiredFields; }
  async handle(records) {
    const invalid = records.filter((r) => this.requiredFields.some((f) => r[f] == null));
    if (invalid.length > 0) {
      throw new Error(`Schema validation failed for ${invalid.length} record(s)`);
    }
    return super.handle(records);
  }
}

class Deduplicator extends Handler {
  constructor({ key }) { super(); this.key = key; }
  async handle(records) {
    const seen = new Set();
    const deduped = [];
    for (const r of records) {
      const k = r[this.key];
      if (!seen.has(k)) { seen.add(k); deduped.push(r); }
    }
    return super.handle(deduped);
  }
}

class Enricher extends Handler {
  constructor({ enrichFn }) { super(); this.enrichFn = enrichFn; }
  async handle(records) {
    const enriched = records.map((r) => ({ ...r, ...this.enrichFn(r) }));
    return super.handle(enriched);
  }
}

module.exports = { Handler, SchemaValidator, Deduplicator, Enricher };