import client from 'prom-client';

const metricsEnabled = (process.env.METRICS_ENABLED || 'true') === 'true';

export const register = new client.Registry();
client.collectDefaultMetrics({ register });

const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'code'],
  buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2, 5]
});
register.registerMetric(httpRequestDuration);

export function metricsMiddleware(req, res, next) {
  if (!metricsEnabled) return next();
  const end = httpRequestDuration.startTimer({ method: req.method, route: req.route?.path || req.path });
  res.on('finish', () => {
    end({ code: res.statusCode });
  });
  next();
}

export async function metricsHandler(req, res) {
  if (!metricsEnabled) return res.status(404).end();
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
}