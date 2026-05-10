const noteRepo = require('../repositories/note.repository');
const tripService = require('./trip.service');

class NoteService {
  async addNote(tripId, userId, data) {
    await tripService.getTrip(tripId, userId);
    return await noteRepo.create({ ...data, TripId: tripId, UserId: userId });
  }
  async getNotes(tripId, userId) {
    await tripService.getTrip(tripId, userId);
    return await noteRepo.getByTrip(tripId);
  }
}
module.exports = new NoteService();
