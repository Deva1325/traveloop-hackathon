const { Trip, TripStop, City } = require('../models');

class TripRepository {
  async create(tripData) { return await Trip.create(tripData); }
  async findById(id) { return await Trip.findByPk(id, { include: [ { model: TripStop, include: [City] } ] }); }
  async findAllByUserId(userId) { return await Trip.findAll({ where: { userId } }); }
  async update(id, userId, data) { return await Trip.update(data, { where: { id, userId } }); }
  async delete(id, userId) { return await Trip.destroy({ where: { id, userId } }); }
}
module.exports = new TripRepository();
