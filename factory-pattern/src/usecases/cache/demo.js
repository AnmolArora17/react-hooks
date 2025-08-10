const { createCacheClient } = require('./cacheFactory');
const { UserRepository } = require('./repository');
const { createCachedRepository } = require('./proxy');

async function runCacheDemo() {
  const cache = createCacheClient({ type: 'memory' });
  const repo = new UserRepository();
  const cachedRepo = createCachedRepository(repo, cache, { ttlSeconds: 2 });

  try {
    console.log('First load (expect miss):', await cachedRepo.findById('u1'));
    console.log('Second load (expect hit):', await cachedRepo.findById('u1'));
    // After TTL expiry
    await new Promise((r) => setTimeout(r, 2100));
    console.log('After TTL (expect miss):', await cachedRepo.findById('u1'));
  } catch (e) {
    console.log('Cache demo error:', e.message);
  }
}

module.exports = { runCacheDemo };

if (require.main === module) {
  runCacheDemo();
}