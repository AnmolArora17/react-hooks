const { createPaymentGateway } = require('./factory');

async function runPaymentDemo() {
  const stripe = createPaymentGateway({ provider: 'stripe', logging: true, retry: { maxAttempts: 4, baseDelayMs: 50 } });
  const paypal = createPaymentGateway({ provider: 'paypal', logging: true, retry: { maxAttempts: 3, baseDelayMs: 60 } });

  try {
    const s = await stripe.charge(1999, 'USD', { description: 'Pro plan – Stripe' });
    console.log('Stripe charge result:', s);
  } catch (e) {
    console.log('Stripe charge failed after retries:', e.message);
  }

  try {
    const p = await paypal.charge(499, 'USD', { note: 'One-time purchase – PayPal' });
    console.log('PayPal charge result:', p);
  } catch (e) {
    console.log('PayPal charge failed after retries:', e.message);
  }
}

module.exports = { runPaymentDemo };

if (require.main === module) {
  runPaymentDemo();
}