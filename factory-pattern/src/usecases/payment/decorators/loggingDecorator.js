// Decorator: Wrap a PaymentGateway with logging, timing and retry policy
// The underlying gateway only needs to implement charge(); we add cross-cutting concerns here.

class LoggingAndRetryPaymentGateway {
  constructor({ gateway, retryPolicy, logger = console }) {
    this.gateway = gateway;
    this.retryPolicy = retryPolicy;
    this.logger = logger;
  }

  async charge(amount, currency, metadata = {}) {
    const start = Date.now();
    const context = { amount, currency, metadata };
    this.logger.info('[Payment] charge start', context);
    try {
      const result = await this.retryPolicy.execute(() => this.gateway.charge(amount, currency, metadata));
      const ms = Date.now() - start;
      this.logger.info('[Payment] charge success', { id: result.id, provider: result.provider, ms });
      return result;
    } catch (error) {
      const ms = Date.now() - start;
      this.logger.error('[Payment] charge failed', { error: error.message, ms });
      throw error;
    }
  }
}

module.exports = { LoggingAndRetryPaymentGateway };