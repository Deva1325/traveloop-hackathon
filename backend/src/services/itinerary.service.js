const itineraryRepo = require('../repositories/itinerary.repository');
const tripService = require('./trip.service');

class ItineraryService {
  async addStop(tripId, userId, data) {
    await tripService.getTrip(tripId, userId); // verify ownership
    return await itineraryRepo.createStop({ ...data, TripId: tripId, StopOrder: data.orderIndex });
  }

  async reorderStops(tripId, userId, stops) {
    await tripService.getTrip(tripId, userId);
    await itineraryRepo.reorderStops(stops);
    return await itineraryRepo.getStopsByTrip(tripId);
  }
}
module.exports = new ItineraryService();
