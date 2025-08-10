const { getPreferredSpotTypesForVehicle } = require('../constants');

class SpotAllocationStrategy {
  findSpot(parkingLot, vehicle) {
    throw new Error('findSpot must be implemented by subclasses');
  }
}

class NearestSpotStrategy extends SpotAllocationStrategy {
  findSpot(parkingLot, vehicle) {
    const preferredTypes = getPreferredSpotTypesForVehicle(vehicle.type);
    for (const floor of parkingLot.floors.sort((a, b) => a.floorNumber - b.floorNumber)) {
      const spot = floor.findFirstAvailableSpotForVehicle(vehicle, preferredTypes);
      if (spot) return spot;
    }
    return null;
  }
}

module.exports = { SpotAllocationStrategy, NearestSpotStrategy };