// Fake PayPal SDK that uses different naming and payload than our app expects
// This enforces an Adapter to unify the interface.

class PayPalSdk {
  constructor({ clientId, clientSecret }) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
  }

  // Third-party method signature: createPayment({ value, currency_code, note })
  async createPayment({ value, currency_code, note }) {
    await new Promise((r) => setTimeout(r, 40));

    if (Math.random() < 0.2) {
      const error = new Error('PayPal: rate limit exceeded');
      error.code = 'ERATELIMIT';
      throw error;
    }

    return {
      paymentId: 'pp_' + Math.random().toString(36).slice(2),
      value,
      currency_code,
      note,
      provider: 'paypal',
      createdAt: new Date().toISOString(),
    };
  }
}

module.exports = { PayPalSdk };