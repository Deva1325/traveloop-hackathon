const { Trip, SharedTripView, TripStop, City } = require('../models');

class PublicRepository {
  async getBySlug(slug) { 
    return await Trip.findOne({ 
      where: { ShareSlug: slug, IsPublic: true },
      include: [ { model: TripStop, include: [City] } ]
    }); 
  }
  async logView(tripId, ip) { return await SharedTripView.create({ TripId: tripId, ViewerIp: ip }); }
}
module.exports = new PublicRepository();
