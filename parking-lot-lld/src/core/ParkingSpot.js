const { SpotType, canVehicleFitInSpot } = require('../constants');

class ParkingSpot {
  constructor({ id, floorNumber, type }) {
    if (!Object.values(SpotType).includes(type)) {
      throw new Error(`Invalid spot type: ${type}`);
    }
    this.id = id;
    this.floorNumber = floorNumber;
    this.type = type;
    this.occupied = false;
    this.currentVehicle = null;
    this.reserved = false;
  }

  isAvailable() {
    return !this.occupied && !this.reserved;
  }

  canFit(vehicle) {
    return canVehicleFitInSpot(vehicle.type, this.type);
  }

  park(vehicle) {
    if (!this.isAvailable()) {
      throw new Error(`Spot ${this.id} is not available`);
    }
    if (!this.canFit(vehicle)) {
      throw new Error(`Vehicle ${vehicle.licensePlate} cannot fit in spot type ${this.type}`);
    }
    this.occupied = true;
    this.currentVehicle = vehicle;
    return true;
  }

  unpark() {
    if (!this.occupied) {
      return null;
    }
    const vehicle = this.currentVehicle;
    this.occupied = false;
    this.currentVehicle = null;
    this.reserved = false;
    return vehicle;
  }
}

module.exports = { ParkingSpot };