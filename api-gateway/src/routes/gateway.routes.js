import express from 'express';
import { apiKeyAuth, jwtAuth } from '../middlewares/authentication.js';
import { requireRolesForService } from '../middlewares/authorization.js';
import { rateLimitPerApiKey, rateLimitPerIp } from '../lib/rateLimiter.js';
import { cacheMiddleware } from '../lib/cache.js';
import { createServiceProxy } from '../lib/proxy.js';
import { startHealthChecker } from '../lib/serviceRegistry.js';

export async function createGatewayRouter() {
  const router = express.Router();

  router.use(rateLimitPerIp);
  router.use(rateLimitPerApiKey);

  // Require API key for gateway traffic
  router.use('/svc', apiKeyAuth);

  // Optional global GET cache
  router.use(cacheMiddleware());

  // JWT (user) auth available for sub-routes if needed
  router.use('/secure', jwtAuth);

  // Route: /svc/:service/* -> proxied to service with ACL
  router.use('/svc/:service', requireRolesForService(), (req, res, next) => {
    const name = req.params.service;
    return createServiceProxy(name)(req, res, next);
  });

  startHealthChecker();
  return router;
}