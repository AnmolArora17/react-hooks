// Adapter: Normalize Stripe SDK to a common PaymentGateway interface
// Target interface: charge(amount, currency, metadata) -> Promise<{id, amount, currency, provider}>

class StripePaymentAdapter {
  constructor(stripeSdk) {
    this.stripeSdk = stripeSdk;
  }

  async charge(amount, currency, metadata = {}) {
    const description = metadata.description || 'No description';
    const res = await this.stripeSdk.makeCharge({ amount, currency, description });
    return {
      id: res.id,
      amount: res.amount,
      currency: res.currency,
      provider: 'stripe',
      raw: res,
    };
  }
}

module.exports = { StripePaymentAdapter };