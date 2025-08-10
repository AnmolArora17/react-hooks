import '../lib/env.js';
import { connectToMongo } from '../lib/mongoose.js';
import { ServiceModel } from '../models/Service.js';
import { ApiKeyModel } from '../models/ApiKey.js';

async function main() {
  await connectToMongo();

  await ServiceModel.deleteMany({});
  await ApiKeyModel.deleteMany({});

  const services = [
    { name: 'products', baseUrl: 'http://localhost:3001', weight: 2 },
    { name: 'pricing', baseUrl: 'http://localhost:3002', weight: 1 },
    { name: 'inventory', baseUrl: 'http://localhost:3003', weight: 1 },
    { name: 'orders', baseUrl: 'http://localhost:3004', weight: 1 },
    { name: 'payments', baseUrl: 'http://localhost:3005', weight: 1 }
  ];
  await ServiceModel.insertMany(services);

  const { rawKey } = await ApiKeyModel.createKey('default-client', ['read', 'write']);
  // eslint-disable-next-line no-console
  console.log('Seed complete. Example API key:', rawKey);

  process.exit(0);
}

main().catch((e) => {
  // eslint-disable-next-line no-console
  console.error(e);
  process.exit(1);
});