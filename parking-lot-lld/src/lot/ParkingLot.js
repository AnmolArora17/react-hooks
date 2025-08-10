class ParkingLot {
  constructor(name) {
    this.name = name;
    this.floors = [];
  }

  addFloor(floor) {
    this.floors.push(floor);
  }

  getFloor(floorNumber) {
    return this.floors.find((f) => f.floorNumber === floorNumber) || null;
  }

  getAvailabilitySnapshot() {
    return this.floors.map((floor) => ({
      floorNumber: floor.floorNumber,
      available: floor.getAvailableSpotsByType(),
    }));
  }
}

module.exports = { ParkingLot };