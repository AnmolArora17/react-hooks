// Factory Method: Construct a fully-wired PaymentGateway instance
// Mixes patterns: Adapter (SDK normalization), Strategy (Retry policy), Decorator (logging+retry)

const { StripeSdk } = require('./gateways/stripeSdk');
const { PayPalSdk } = require('./gateways/paypalSdk');
const { StripePaymentAdapter } = require('./adapters/stripeAdapter');
const { PayPalPaymentAdapter } = require('./adapters/paypalAdapter');
const { ExponentialBackoffRetryPolicy } = require('./strategies/retryPolicy');
const { LoggingAndRetryPaymentGateway } = require('./decorators/loggingDecorator');

function createPaymentGateway({ provider, credentials = {}, logging = true, retry = {} }) {
  let rawClient;
  let adapter;

  switch (provider) {
    case 'stripe': {
      rawClient = new StripeSdk({ apiKey: credentials.apiKey || 'sk_test_fake' });
      adapter = new StripePaymentAdapter(rawClient);
      break;
    }
    case 'paypal': {
      rawClient = new PayPalSdk({ clientId: credentials.clientId || 'client', clientSecret: credentials.clientSecret || 'secret' });
      adapter = new PayPalPaymentAdapter(rawClient);
      break;
    }
    default:
      throw new Error(`Unsupported payment provider: ${provider}`);
  }

  const retryPolicy = new ExponentialBackoffRetryPolicy({
    maxAttempts: retry.maxAttempts ?? 3,
    baseDelayMs: retry.baseDelayMs ?? 100,
    maxDelayMs: retry.maxDelayMs ?? 1000,
    jitter: retry.jitter ?? true,
  });

  if (!logging) return adapter; // return bare adapter if logging disabled

  return new LoggingAndRetryPaymentGateway({ gateway: adapter, retryPolicy, logger: console });
}

module.exports = { createPaymentGateway };