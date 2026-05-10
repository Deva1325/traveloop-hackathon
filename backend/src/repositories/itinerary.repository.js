const { TripStop, StopActivity, sequelize } = require('../models');

class ItineraryRepository {
  async createStop(data) { return await TripStop.create(data); }
  async getStopsByTrip(tripId) { return await TripStop.findAll({ where: { TripId: tripId }, order: [['StopOrder', 'ASC']] }); }
  async reorderStops(stopsData) {
    const transaction = await sequelize.transaction();
    try {
      for (const stop of stopsData) {
        await TripStop.update({ StopOrder: stop.orderIndex }, { where: { TripStopId: stop.id }, transaction });
      }
      await transaction.commit();
      return true;
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }
}
module.exports = new ItineraryRepository();
