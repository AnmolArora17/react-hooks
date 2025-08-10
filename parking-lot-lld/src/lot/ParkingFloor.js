class ParkingFloor {
  constructor(floorNumber) {
    this.floorNumber = floorNumber;
    this.spots = [];
  }

  addSpot(spot) {
    if (spot.floorNumber !== this.floorNumber) {
      throw new Error('Spot floor mismatch');
    }
    this.spots.push(spot);
  }

  getAvailableSpotsByType() {
    const counts = {};
    for (const spot of this.spots) {
      const key = spot.type;
      if (!counts[key]) counts[key] = 0;
      if (spot.isAvailable()) counts[key] += 1;
    }
    return counts;
  }

  findFirstAvailableSpotForVehicle(vehicle, preferredTypes) {
    for (const type of preferredTypes) {
      for (const spot of this.spots) {
        if (spot.type === type && spot.isAvailable() && spot.canFit(vehicle)) {
          return spot;
        }
      }
    }
    return null;
  }
}

module.exports = { ParkingFloor };