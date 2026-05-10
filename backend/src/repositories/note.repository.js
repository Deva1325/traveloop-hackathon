const { Note } = require('../models');

class NoteRepository {
  async create(data) { return await Note.create(data); }
  async getByTrip(tripId) { return await Note.findAll({ where: { TripId: tripId } }); }
  async update(id, data) { return await Note.update(data, { where: { NoteId: id } }); }
  async delete(id) { return await Note.destroy({ where: { NoteId: id } }); }
}
module.exports = new NoteRepository();
