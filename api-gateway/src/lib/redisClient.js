import { createClient } from 'redis';
import { logger } from './logger.js';

let client;

export async function connectToRedis() {
  const url = process.env.REDIS_URL || 'redis://localhost:6379';
  client = createClient({ url });

  client.on('error', (err) => logger.error({ err }, 'Redis Client Error'));
  client.on('connect', () => logger.info('Redis connecting...'));
  client.on('ready', () => logger.info('Redis connected'));

  await client.connect();
}

export function getRedis() {
  if (!client) throw new Error('Redis not connected');
  return client;
}