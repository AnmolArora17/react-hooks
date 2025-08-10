import { logger } from './logger.js';

export function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  const details = err.details || undefined;

  logger.error({ err, reqId: req.id }, 'Unhandled error');
  res.status(status).json({ error: { message, details } });
}