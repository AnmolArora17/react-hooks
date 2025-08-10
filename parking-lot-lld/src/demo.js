const { VehicleType, SpotType } = require('./constants');
const { Vehicle } = require('./core/Vehicle');
const { ParkingSpot } = require('./core/ParkingSpot');
const { ParkingFloor } = require('./lot/ParkingFloor');
const { ParkingLot } = require('./lot/ParkingLot');
const { ParkingManager } = require('./managers/ParkingManager');
const { EntryGate, ExitGate } = require('./core/Gate');

function buildLot() {
  const lot = new ParkingLot('Downtown Plaza');

  const floor1 = new ParkingFloor(1);
  const floor2 = new ParkingFloor(2);

  let id = 1;
  const addSpots = (floor, spec) => {
    for (const [type, count] of spec) {
      for (let i = 0; i < count; i += 1) {
        floor.addSpot(new ParkingSpot({ id: `F${floor.floorNumber}-S${id++}`, floorNumber: floor.floorNumber, type }));
      }
    }
  };

  addSpots(floor1, [
    [SpotType.MOTORCYCLE, 2],
    [SpotType.COMPACT, 3],
    [SpotType.LARGE, 1],
    [SpotType.ELECTRIC, 1],
  ]);

  addSpots(floor2, [
    [SpotType.MOTORCYCLE, 1],
    [SpotType.COMPACT, 2],
    [SpotType.LARGE, 2],
    [SpotType.ELECTRIC, 1],
  ]);

  lot.addFloor(floor1);
  lot.addFloor(floor2);

  return lot;
}

function logAvailability(lot, label) {
  console.log(`\nAvailability Snapshot - ${label}`);
  for (const f of lot.getAvailabilitySnapshot()) {
    console.log(`Floor ${f.floorNumber}:`, f.available);
  }
}

function simulate() {
  const lot = buildLot();
  const manager = new ParkingManager({ parkingLot: lot });
  const entryGate = new EntryGate({ id: 'E1', manager });
  const exitGate = new ExitGate({ id: 'X1', manager });

  logAvailability(lot, 'initial');

  const car = Vehicle.create({ licensePlate: 'KA-01-AB-1234', type: VehicleType.CAR });
  const ev = Vehicle.create({ licensePlate: 'KA-02-EV-5678', type: VehicleType.ELECTRIC_CAR });
  const bike = Vehicle.create({ licensePlate: 'KA-03-MC-7777', type: VehicleType.MOTORCYCLE });
  const truck = Vehicle.create({ licensePlate: 'KA-04-TR-9999', type: VehicleType.TRUCK });

  const t1 = entryGate.admit(car);
  const t2 = entryGate.admit(ev);
  const t3 = entryGate.admit(bike);
  const t4 = entryGate.admit(truck);

  console.log('\nIssued Tickets:');
  console.log(t1);
  console.log(t2);
  console.log(t3);
  console.log(t4);

  logAvailability(lot, 'after entries');

  t1.entryTime = new Date(Date.now() - 1000 * 60 * 60 * 3 - 1000 * 60 * 10); // ~3h10m
  t4.entryTime = new Date(Date.now() - 1000 * 60 * 60 * 1 - 1000 * 60 * 5); // ~1h5m

  const r1 = exitGate.settle(t1.id);
  const r4 = exitGate.settle(t4.id);

  console.log('\nExit Results:');
  console.log(r1);
  console.log(r4);

  logAvailability(lot, 'after exits');
}

simulate();