const noteRepository = require('../repositories/note.repository');
const { ApiError } = require('../middlewares/error.middleware');

class NoteService {
  async addNote(userId, data) {
    // Sanitize empty strings to null
    const sanitizedData = {
      ...data,
      userId,
      tripId: data.tripId === '' ? null : data.tripId,
      tripStopId: data.tripStopId === '' ? null : data.tripStopId
    };
    return await noteRepository.create(sanitizedData);
  }

  async getUserNotes(userId, search = '') {
    return await noteRepository.findByUserId(userId, search);
  }

  async getTripNotes(tripId) {
    return await noteRepository.findByTripId(tripId);
  }

  async updateNote(userId, id, data) {
    const note = await noteRepository.findById(id);
    if (!note) throw new ApiError(404, 'Note not found');
    if (note.userId !== userId) throw new ApiError(403, 'Access denied');

    // Sanitize empty strings to null
    const sanitizedData = {
      ...data,
      tripId: data.tripId === '' ? null : data.tripId,
      tripStopId: data.tripStopId === '' ? null : data.tripStopId
    };

    await noteRepository.update(id, sanitizedData);
    return await noteRepository.findById(id);
  }

  async deleteNote(userId, id) {
    const note = await noteRepository.findById(id);
    if (!note) throw new ApiError(404, 'Note not found');
    if (note.userId !== userId) throw new ApiError(403, 'Access denied');

    return await noteRepository.delete(id);
  }
}

module.exports = new NoteService();
