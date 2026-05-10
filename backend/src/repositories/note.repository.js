const { Note, Trip, TripStop, City } = require('../models');
const { Op } = require('sequelize');

class NoteRepository {
  async create(data) {
    return await Note.create(data);
  }

  async findByUserId(userId, search = '') {
    const where = { userId };
    if (search) {
      where.content = { [Op.like]: `%${search}%` };
    }
    return await Note.findAll({
      where,
      include: [
        {
          model: Trip,
          attributes: ['TripId', 'Title']
        },
        {
          model: TripStop,
          as: 'TripStop',
          attributes: ['TripStopId'],
          include: [{ model: City, attributes: ['Name'] }]
        }
      ],
      order: [['UpdatedAt', 'DESC']]
    });
  }

  async findByTripId(tripId) {
    return await Note.findAll({
      where: { tripId },
      include: [
        {
          model: TripStop,
          as: 'TripStop',
          attributes: ['TripStopId'],
          include: [{ model: City, attributes: ['Name'] }]
        }
      ],
      order: [['UpdatedAt', 'DESC']]
    });
  }

  async findById(id) {
    return await Note.findByPk(id);
  }

  async update(id, data) {
    return await Note.update(data, { where: { id } });
  }

  async delete(id) {
    return await Note.destroy({ where: { id } });
  }
}

module.exports = new NoteRepository();
