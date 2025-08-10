import { getRedis } from './redisClient.js';

const defaultTtlSeconds = Number(process.env.CACHE_TTL_SECONDS || 60);

export async function cacheGet(key) {
  const client = getRedis();
  const val = await client.get(key);
  if (!val) return null;
  try { return JSON.parse(val); } catch { return null; }
}

export async function cacheSet(key, value, ttlSeconds = defaultTtlSeconds) {
  const client = getRedis();
  await client.set(key, JSON.stringify(value), { EX: ttlSeconds });
}

export function cacheMiddleware(ttlSeconds = defaultTtlSeconds) {
  return async (req, res, next) => {
    if (req.method !== 'GET') return next();
    const apiKey = req.headers['x-api-key'] || 'anon';
    const key = `cache:${apiKey}:${req.originalUrl}`;
    const hit = await cacheGet(key);
    if (hit) return res.set(hit.headers || {}).status(hit.status || 200).send(hit.body);

    const send = res.send.bind(res);
    res.send = async (body) => {
      try {
        await cacheSet(key, { status: res.statusCode, headers: res.getHeaders(), body }, ttlSeconds);
      } catch {}
      return send(body);
    };
    next();
  };
}