// Entry point that runs all demos sequentially so you can see output side-by-side
// Run: npm run demo:all

const { runPaymentDemo } = require('./usecases/payment/demo');
const { runNotificationDemo } = require('./usecases/notification/demo');
const { runPipelineDemo } = require('./usecases/pipeline/demo');
const { runCacheDemo } = require('./usecases/cache/demo');
const { runPluginsDemo } = require('./usecases/plugins/demo');

(async () => {
  console.log('\n================ FACTORY PATTERN USE CASES ================');

  console.log('\n--- 1) Payment Gateway Factory (Factory + Adapter + Decorator + Strategy) ---');
  await runPaymentDemo();

  console.log('\n--- 2) Notification Abstract Factory (Abstract Factory + Builder) ---');
  await runNotificationDemo();

  console.log('\n--- 3) Data Ingestion Pipeline (Factory + Chain of Responsibility) ---');
  await runPipelineDemo();

  console.log('\n--- 4) Repository with Cache (Factory + Proxy + Template Method) ---');
  await runCacheDemo();

  console.log('\n--- 5) Plugin Commands (Factory + Command + Singleton + Observer) ---');
  await runPluginsDemo();

  console.log('\n=========================== DONE ===========================\n');
})();