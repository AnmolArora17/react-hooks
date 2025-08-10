const { IdGenerator } = require('../utils/IdGenerator');
const { TicketStatus } = require('../constants');

const ticketIdGen = new IdGenerator('T');

class Ticket {
  constructor({ vehicle, spotId, entryTime = new Date() }) {
    this.id = ticketIdGen.next();
    this.vehicleNumber = vehicle.licensePlate;
    this.vehicleType = vehicle.type;
    this.spotId = spotId;
    this.entryTime = entryTime;
    this.exitTime = null;
    this.amount = 0;
    this.status = TicketStatus.ACTIVE;
  }

  close({ exitTime, amount }) {
    this.exitTime = exitTime || new Date();
    this.amount = amount;
    this.status = TicketStatus.PAID;
  }
}

module.exports = { Ticket };