// Types and constants used across the system

const VehicleType = Object.freeze({
  MOTORCYCLE: 'MOTORCYCLE',
  CAR: 'CAR',
  TRUCK: 'TRUCK',
  ELECTRIC_CAR: 'ELECTRIC_CAR',
});

const SpotType = Object.freeze({
  MOTORCYCLE: 'MOTORCYCLE',
  COMPACT: 'COMPACT',
  LARGE: 'LARGE',
  ELECTRIC: 'ELECTRIC',
});

const TicketStatus = Object.freeze({
  ACTIVE: 'ACTIVE',
  PAID: 'PAID',
  LOST: 'LOST',
});

const PaymentStatus = Object.freeze({
  PENDING: 'PENDING',
  SUCCESS: 'SUCCESS',
  FAILED: 'FAILED',
});

function getPreferredSpotTypesForVehicle(vehicleType) {
  switch (vehicleType) {
    case VehicleType.MOTORCYCLE:
      return [SpotType.MOTORCYCLE, SpotType.COMPACT, SpotType.LARGE];
    case VehicleType.CAR:
      return [SpotType.COMPACT, SpotType.LARGE];
    case VehicleType.TRUCK:
      return [SpotType.LARGE];
    case VehicleType.ELECTRIC_CAR:
      return [SpotType.ELECTRIC, SpotType.COMPACT, SpotType.LARGE];
    default:
      return [SpotType.LARGE];
  }
}

function canVehicleFitInSpot(vehicleType, spotType) {
  return getPreferredSpotTypesForVehicle(vehicleType).includes(spotType);
}

module.exports = {
  VehicleType,
  SpotType,
  TicketStatus,
  PaymentStatus,
  getPreferredSpotTypesForVehicle,
  canVehicleFitInSpot,
};