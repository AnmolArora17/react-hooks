// Fake Stripe SDK that uses a different method name and shape than our app expects
// This forces us to use an Adapter to normalize the interface.

class StripeSdk {
  constructor({ apiKey }) {
    this.apiKey = apiKey;
  }

  // Third-party method signature: makeCharge({ amount, currency, description })
  async makeCharge({ amount, currency, description }) {
    // Simulate network latency
    await new Promise((r) => setTimeout(r, 50));

    // Simulate intermittent failure
    if (Math.random() < 0.3) {
      const error = new Error('Stripe: transient network error');
      error.code = 'ETRANSIENT';
      throw error;
    }

    return {
      id: 'ch_' + Math.random().toString(36).slice(2),
      amount,
      currency,
      description,
      provider: 'stripe',
      createdAt: new Date().toISOString(),
    };
  }
}

module.exports = { StripeSdk };