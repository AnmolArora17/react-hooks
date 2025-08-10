// Strategy: Retry policy with exponential backoff and jitter
// Purpose: Encapsulate retry behavior so it can be swapped without changing client code

class ExponentialBackoffRetryPolicy {
  constructor({ maxAttempts = 3, baseDelayMs = 100, maxDelayMs = 1500, jitter = true } = {}) {
    this.maxAttempts = maxAttempts;
    this.baseDelayMs = baseDelayMs;
    this.maxDelayMs = maxDelayMs;
    this.jitter = jitter;
  }

  async execute(operationFn) {
    let attempt = 0;
    let lastError;
    while (attempt < this.maxAttempts) {
      try {
        return await operationFn();
      } catch (error) {
        lastError = error;
        attempt += 1;
        if (attempt >= this.maxAttempts) break;
        const delay = this.#computeDelay(attempt);
        await this.#sleep(delay);
      }
    }
    throw lastError;
  }

  #computeDelay(attempt) {
    const exp = Math.min(this.baseDelayMs * 2 ** (attempt - 1), this.maxDelayMs);
    if (!this.jitter) return exp;
    const jitterAmount = Math.random() * exp * 0.5; // up to 50% jitter
    return Math.min(this.maxDelayMs, Math.floor(exp / 2 + jitterAmount));
  }

  #sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

module.exports = { ExponentialBackoffRetryPolicy };