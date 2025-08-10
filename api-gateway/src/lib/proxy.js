import { createProxyMiddleware } from 'http-proxy-middleware';
import { pickService } from './serviceRegistry.js';

export function createServiceProxy(serviceName) {
  return createProxyMiddleware({
    target: 'http://localhost', // placeholder, will be overridden by router
    changeOrigin: true,
    ws: true,
    pathRewrite: (path, req) => {
      // Strip the /svc/:name prefix
      const prefix = `/svc/${serviceName}`;
      return path.startsWith(prefix) ? path.slice(prefix.length) || '/' : path;
    },
    router: async (req) => {
      const service = await pickService(serviceName);
      if (!service) throw new Error(`No service found for ${serviceName}`);
      return service.baseUrl;
    },
    onError(err, req, res) {
      if (!res.headersSent) res.writeHead(502, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: { message: 'Bad Gateway', details: err.message } }));
    },
    onProxyReq(proxyReq, req, res) {
      if (req.id) proxyReq.setHeader('x-request-id', req.id);
      const userId = req.user?.sub || req.user?.id;
      if (userId) proxyReq.setHeader('x-user-id', userId);
    }
  });
}