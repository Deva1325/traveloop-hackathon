const itineraryRepo = require('../repositories/itinerary.repository');
const tripService = require('./trip.service');
const { City, TripStop } = require('../models');

class ItineraryService {
  async addStop(tripId, userId, data) {
    const trip = await tripService.getTrip(tripId, userId);
    
    let [city] = await City.findOrCreate({
      where: { name: data.cityName, country: data.country },
      defaults: { 
        imageUrl: `https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=400&auto=format&fit=crop`
      }
    });

    const stopData = {
      tripId: tripId,
      cityId: city.id,
      arrivalDate: trip.startDate,
      departureDate: trip.endDate,
      stopOrder: data.orderIndex || 0,
      nights: data.nights || 1,
      activities: JSON.stringify([])
    };

    return await itineraryRepo.createStop(stopData);
  }

  async updateStop(tripId, stopId, userId, data) {
    await tripService.getTrip(tripId, userId);
    
    const updateData = { ...data };
    if (data.activities && typeof data.activities !== 'string') {
      updateData.activities = JSON.stringify(data.activities);
    }

    await TripStop.update(updateData, { where: { id: stopId, tripId: tripId } });
    return await TripStop.findByPk(stopId);
  }

  async deleteStop(tripId, stopId, userId) {
    await tripService.getTrip(tripId, userId);
    return await TripStop.destroy({ where: { id: stopId, tripId: tripId } });
  }

  async reorderStops(tripId, userId, stops) {
    await tripService.getTrip(tripId, userId);
    await itineraryRepo.reorderStops(stops);
    return await itineraryRepo.getStopsByTrip(tripId);
  }
}
module.exports = new ItineraryService();
