const { PaymentStatus } = require('../constants');

class Payment {
  constructor({ ticketId, amount }) {
    this.ticketId = ticketId;
    this.amount = amount;
    this.status = PaymentStatus.PENDING;
    this.transactionId = null;
  }
}

class PaymentProcessor {
  charge(payment) {
    payment.status = PaymentStatus.SUCCESS;
    payment.transactionId = `TXN-${Math.random().toString(36).slice(2, 10)}`;
    return payment;
  }
}

module.exports = { Payment, PaymentProcessor };