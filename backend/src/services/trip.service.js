const tripRepository = require('../repositories/trip.repository');
const { ApiError } = require('../middlewares/error.middleware');

class TripService {
  async createTrip(userId, data) {
    if (new Date(data.startDate) >= new Date(data.endDate)) {
      throw new ApiError(400, 'Start date must be before end date');
    }
    return await tripRepository.create({ ...data, userId });
  }

  async getTrip(id, userId) {
    const trip = await tripRepository.findById(id);
    if (!trip) throw new ApiError(404, 'Trip not found');
    if (trip.userId !== userId && !trip.isPublic) throw new ApiError(403, 'Access denied');
    return trip;
  }

  async getUserTrips(userId) {
    return await tripRepository.findAllByUserId(userId);
  }

  async updateTrip(id, userId, data) {
    await this.getTrip(id, userId); // verify existence and ownership
    await tripRepository.update(id, userId, data);
    return await tripRepository.findById(id);
  }
  
  async deleteTrip(id, userId) {
    await tripRepository.delete(id, userId);
    return true;
  }
}
module.exports = new TripService();
