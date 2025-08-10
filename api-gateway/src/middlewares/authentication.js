import jwt from 'jsonwebtoken';
import { ApiKeyModel } from '../models/ApiKey.js';

export async function apiKeyAuth(req, res, next) {
  const raw = req.headers['x-api-key'];
  if (!raw) return res.status(401).json({ error: { message: 'API key required' } });
  const result = await ApiKeyModel.verifyKey(raw);
  if (!result.valid) return res.status(401).json({ error: { message: 'Invalid API key' } });
  req.auth = { type: 'apiKey', roles: result.roles };
  next();
}

export function jwtAuth(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) return res.status(401).json({ error: { message: 'JWT required' } });

  try {
    const publicKey = process.env.JWT_PUBLIC_KEY?.replace(/\\n/g, '\n');
    const algorithm = process.env.JWT_ALGORITHM || 'RS256';
    const payload = jwt.verify(token, publicKey, { algorithms: [algorithm] });
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: { message: 'Invalid JWT' } });
  }
}

export function requireAdminApiKey(req, res, next) {
  const adminKeys = (process.env.ADMIN_API_KEYS || '').split(',').map((s) => s.trim()).filter(Boolean);
  const raw = req.headers['x-admin-key'];
  if (!raw || !adminKeys.includes(raw)) return res.status(401).json({ error: { message: 'Admin key required' } });
  next();
}