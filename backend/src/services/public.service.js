const publicRepo = require('../repositories/public.repository');
const { ApiError } = require('../middlewares/error.middleware');

class PublicService {
  async getSharedTrip(slug, ip) {
    const trip = await publicRepo.getBySlug(slug);
    if (!trip) throw new ApiError(404, 'Public trip not found or inactive');
    await publicRepo.logView(trip.TripId, ip);
    return trip;
  }
}
module.exports = new PublicService();
