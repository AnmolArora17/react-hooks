class EntryGate {
  constructor({ id, manager }) {
    this.id = id;
    this.manager = manager;
  }

  admit(vehicle) {
    return this.manager.issueTicket(vehicle);
  }
}

class ExitGate {
  constructor({ id, manager }) {
    this.id = id;
    this.manager = manager;
  }

  settle(ticketId) {
    return this.manager.processExit(ticketId);
  }
}

module.exports = { EntryGate, ExitGate };