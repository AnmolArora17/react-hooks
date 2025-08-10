import axios from 'axios';
import { ServiceModel } from '../models/Service.js';

let cache = new Map();
let pointer = new Map();

function getWeightedList(services) {
  const list = [];
  for (const s of services) {
    for (let i = 0; i < (s.weight || 1); i++) list.push(s);
  }
  return list;
}

export async function listServicesByName(name) {
  const now = Date.now();
  const cached = cache.get(name);
  if (cached && now - cached.loadedAt < 5000) return cached.list; // 5s cache

  const services = await ServiceModel.find({ name, enabled: true }).lean();
  const healthy = services.filter((s) => s.lastStatus !== 'down');
  const list = getWeightedList(healthy.length ? healthy : services);
  cache.set(name, { list, loadedAt: now });
  return list;
}

export async function pickService(name) {
  const list = await listServicesByName(name);
  if (!list.length) return null;
  const idx = pointer.get(name) || 0;
  const service = list[idx % list.length];
  pointer.set(name, (idx + 1) % list.length);
  return service;
}

export async function healthCheckAll() {
  const services = await ServiceModel.find({}).lean();
  await Promise.all(
    services.map(async (s) => {
      try {
        await axios.get(new URL(s.healthPath || '/health', s.baseUrl).toString(), { timeout: 2000 });
        await ServiceModel.findByIdAndUpdate(s._id, { lastStatus: 'up', lastCheckedAt: new Date() });
      } catch {
        await ServiceModel.findByIdAndUpdate(s._id, { lastStatus: 'down', lastCheckedAt: new Date() });
      }
    })
  );
  cache.clear();
}

export function startHealthChecker() {
  const intervalMs = 10000; // 10s
  setInterval(() => {
    healthCheckAll().catch(() => {});
  }, intervalMs).unref();
}