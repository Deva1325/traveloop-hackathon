const packingRepo = require('../repositories/packing.repository');
const tripService = require('./trip.service');

class PackingService {
  async addItem(tripId, userId, data) {
    await tripService.getTrip(tripId, userId);
    return await packingRepo.create({ ...data, TripId: tripId });
  }
  async getItems(tripId, userId) {
    await tripService.getTrip(tripId, userId);
    return await packingRepo.getByTrip(tripId);
  }
  async togglePacked(tripId, itemId, userId, isPacked) {
    await tripService.getTrip(tripId, userId);
    await packingRepo.update(itemId, { IsPacked: isPacked });
    return true;
  }
}
module.exports = new PackingService();
