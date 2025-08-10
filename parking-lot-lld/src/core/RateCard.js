const { SpotType } = require('../constants');

class RateCard {
  constructor(overrides = {}) {
    this.ratePerHourBySpotType = Object.assign(
      {
        [SpotType.MOTORCYCLE]: 10,
        [SpotType.COMPACT]: 20,
        [SpotType.LARGE]: 30,
        [SpotType.ELECTRIC]: 25,
      },
      overrides
    );
  }

  calculateAmount({ entryTime, exitTime, spotType }) {
    const start = entryTime instanceof Date ? entryTime : new Date(entryTime);
    const end = exitTime instanceof Date ? exitTime : new Date(exitTime);
    const ms = Math.max(0, end - start);
    const hoursFloat = ms / (1000 * 60 * 60);
    const hours = Math.max(1, Math.ceil(hoursFloat));
    const rate = this.ratePerHourBySpotType[spotType] || 0;
    return hours * rate;
  }
}

module.exports = { RateCard };