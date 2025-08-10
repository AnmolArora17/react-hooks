const { VehicleType } = require('../constants');

class Vehicle {
  constructor(licensePlate, type) {
    this.licensePlate = licensePlate;
    this.type = type;
  }

  static create({ licensePlate, type }) {
    if (!Object.values(VehicleType).includes(type)) {
      throw new Error(`Invalid vehicle type: ${type}`);
    }
    return new Vehicle(licensePlate, type);
  }
}

module.exports = { Vehicle };