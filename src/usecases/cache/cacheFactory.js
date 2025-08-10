// Factory: Provide a cache client based on type

class MemoryCacheClient {
  constructor() { this.store = new Map(); }
  async get(key) { return this.store.get(key); }
  async set(key, value, ttlSeconds = 60) {
    this.store.set(key, value);
    if (ttlSeconds > 0) {
      setTimeout(() => this.store.delete(key), ttlSeconds * 1000).unref?.();
    }
  }
}

class RedisLikeCacheClient {
  constructor() { this.store = new Map(); }
  async get(key) { return this.store.get(key); }
  async set(key, value, ttlSeconds = 60) {
    this.store.set(key, value);
    if (ttlSeconds > 0) {
      setTimeout(() => this.store.delete(key), ttlSeconds * 1000).unref?.();
    }
  }
}

function createCacheClient({ type = 'memory' } = {}) {
  switch (type) {
    case 'memory': return new MemoryCacheClient();
    case 'redis': return new RedisLikeCacheClient();
    default: throw new Error(`Unsupported cache type: ${type}`);
  }
}

module.exports = { createCacheClient, MemoryCacheClient, RedisLikeCacheClient };