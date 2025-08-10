import './lib/env.js';
import { connectToMongo } from './lib/mongoose.js';
import { connectToRedis } from './lib/redisClient.js';
import { createApp } from './server.js';
import { logger } from './lib/logger.js';

const port = process.env.PORT || 8080;

(async () => {
  try {
    await connectToMongo();
    await connectToRedis();

    const app = await createApp();
    app.listen(port, () => {
      logger.info({ port }, 'API Gateway listening');
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to start server', error);
    process.exit(1);
  }
})();