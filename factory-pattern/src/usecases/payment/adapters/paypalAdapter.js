// Adapter: Normalize PayPal SDK to a common PaymentGateway interface
// Target interface: charge(amount, currency, metadata) -> Promise<{id, amount, currency, provider}>

class PayPalPaymentAdapter {
  constructor(paypalSdk) {
    this.paypalSdk = paypalSdk;
  }

  async charge(amount, currency, metadata = {}) {
    const note = metadata.note || metadata.description || 'No note';
    const res = await this.paypalSdk.createPayment({ value: amount, currency_code: currency, note });
    return {
      id: res.paymentId,
      amount: res.value,
      currency: res.currency_code,
      provider: 'paypal',
      raw: res,
    };
  }
}

module.exports = { PayPalPaymentAdapter };