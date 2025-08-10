import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { errors as celebrateErrors } from 'celebrate';
import swaggerUi from 'swagger-ui-express';

import { logger, httpLogger } from './lib/logger.js';
import { requestIdMiddleware } from './middlewares/requestId.js';
import { metricsMiddleware, metricsHandler } from './lib/metrics.js';
import { errorHandler } from './lib/errorHandler.js';
import { createGatewayRouter } from './routes/gateway.routes.js';
import { adminRouter } from './routes/admin.routes.js';
import { loadSwaggerSpec } from './docs/swagger.js';

export async function createApp() {
  const app = express();

  const trustProxy = (process.env.PROXY_TRUST || 'true') === 'true';
  if (trustProxy) app.set('trust proxy', 1);

  const requestBodyLimit = process.env.REQUEST_BODY_LIMIT || '1mb';

  app.use(cors());
  app.use(helmet());
  app.use(compression());
  app.use(express.json({ limit: requestBodyLimit }));
  app.use(express.urlencoded({ extended: true }));
  app.use(requestIdMiddleware);
  app.use(httpLogger);
  app.use(metricsMiddleware);

  // Health endpoint
  app.get('/health', (req, res) => res.json({ status: 'ok' }));

  // Metrics endpoint
  app.get('/metrics', metricsHandler);

  // Admin endpoints
  app.use('/admin', adminRouter);

  // Docs
  const swaggerSpec = loadSwaggerSpec();
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // Gateway proxy routes
  app.use('/', await createGatewayRouter());

  // Celebrate validation errors
  app.use(celebrateErrors());

  // Error handler
  app.use(errorHandler);

  logger.info('Express app initialized');
  return app;
}