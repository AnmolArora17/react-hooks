const { NearestSpotStrategy } = require('../allocators/SpotAllocationStrategy');
const { Ticket } = require('../core/Ticket');
const { RateCard } = require('../core/RateCard');
const { Payment, PaymentProcessor } = require('../core/Payment');

class ParkingManager {
  constructor({ parkingLot, allocationStrategy, rateCard, paymentProcessor } = {}) {
    this.parkingLot = parkingLot;
    this.allocationStrategy = allocationStrategy || new NearestSpotStrategy();
    this.rateCard = rateCard || new RateCard();
    this.paymentProcessor = paymentProcessor || new PaymentProcessor();
    this.activeTickets = new Map(); // ticketId -> { ticket, spot }
    this.spotIdToSpot = new Map();

    for (const floor of parkingLot.floors) {
      for (const spot of floor.spots) {
        this.spotIdToSpot.set(spot.id, spot);
      }
    }
  }

  issueTicket(vehicle) {
    const spot = this.allocationStrategy.findSpot(this.parkingLot, vehicle);
    if (!spot) {
      throw new Error('No available spot for this vehicle');
    }
    spot.park(vehicle);
    const ticket = new Ticket({ vehicle, spotId: spot.id, entryTime: new Date() });
    this.activeTickets.set(ticket.id, { ticket, spot });
    return ticket;
  }

  processExit(ticketId) {
    const entry = this.activeTickets.get(ticketId);
    if (!entry) {
      throw new Error(`Ticket not found: ${ticketId}`);
    }
    const { ticket, spot } = entry;
    const exitTime = new Date();
    const amount = this.rateCard.calculateAmount({
      entryTime: ticket.entryTime,
      exitTime,
      spotType: spot.type,
    });

    const payment = new Payment({ ticketId: ticket.id, amount });
    this.paymentProcessor.charge(payment);

    spot.unpark();
    ticket.close({ exitTime, amount });

    this.activeTickets.delete(ticket.id);

    return { ticket, payment };
  }
}

module.exports = { ParkingManager };