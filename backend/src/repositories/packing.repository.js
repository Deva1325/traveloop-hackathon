const { PackingItem } = require('../models');

class PackingRepository {
  async create(data) { return await PackingItem.create(data); }
  async getByTrip(tripId) { return await PackingItem.findAll({ where: { TripId: tripId } }); }
  async update(id, data) { return await PackingItem.update(data, { where: { PackingItemId: id } }); }
  async delete(id) { return await PackingItem.destroy({ where: { PackingItemId: id } }); }
}
module.exports = new PackingRepository();
