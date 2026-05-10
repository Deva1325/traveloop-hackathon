const { Trip, TripStop, City, Expense, PackingItem } = require('../models');

class TripRepository {
  async create(tripData) { return await Trip.create(tripData); }
  async findById(id) { return await Trip.findByPk(id, { include: [ { model: TripStop, include: [City] } ] }); }
  async findAllByUserId(userId) { return await Trip.findAll({ where: { UserId: userId } }); }
  async update(id, userId, data) { return await Trip.update(data, { where: { TripId: id, UserId: userId } }); }
  async delete(id, userId) { return await Trip.destroy({ where: { TripId: id, UserId: userId } }); }
}
module.exports = new TripRepository();
