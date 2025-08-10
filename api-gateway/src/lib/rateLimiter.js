import { getRedis } from './redisClient.js';

const windowSec = Number(process.env.RATE_LIMIT_WINDOW_SECONDS || 60);
const maxReq = Number(process.env.RATE_LIMIT_MAX_REQUESTS || 120);

export function rateLimitBy(keyFn) {
  return async (req, res, next) => {
    const client = getRedis();
    const key = `ratelimit:${keyFn(req)}`;
    const ttl = windowSec;

    const pipeline = client.multi();
    pipeline.incr(key);
    pipeline.expire(key, ttl);
    const [count] = await pipeline.exec();
    const hits = Number(count?.[1] ?? 0);

    res.setHeader('X-RateLimit-Limit', String(maxReq));
    res.setHeader('X-RateLimit-Remaining', String(Math.max(0, maxReq - hits)));

    if (hits > maxReq) {
      res.setHeader('Retry-After', String(ttl));
      return res.status(429).json({ error: { message: 'Too Many Requests' } });
    }
    next();
  };
}

export const rateLimitPerIp = rateLimitBy((req) => `ip:${req.ip}`);
export const rateLimitPerApiKey = rateLimitBy((req) => `apikey:${req.headers['x-api-key'] || 'anon'}`);