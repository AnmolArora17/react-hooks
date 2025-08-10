class IdGenerator {
  constructor(prefix = '') {
    this.prefix = prefix;
    this.counter = 0;
  }

  next() {
    this.counter += 1;
    return this.prefix ? `${this.prefix}-${this.counter}` : String(this.counter);
  }
}

module.exports = { IdGenerator };