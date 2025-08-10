// Proxy: Wrap a repository to add caching without changing its interface

function createCachedRepository(repository, cacheClient, { ttlSeconds = 5 } = {}) {
  return {
    async findById(id) {
      const cacheKey = `user:${id}`;
      const cached = await cacheClient.get(cacheKey);
      if (cached) {
        return { ...cached, _cache: 'hit' };
      }
      const result = await repository.findById(id);
      await cacheClient.set(cacheKey, result, ttlSeconds);
      return { ...result, _cache: 'miss' };
    },
  };
}

module.exports = { createCachedRepository };