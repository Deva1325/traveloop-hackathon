const noteService = require('../services/note.service');
const { sendSuccess } = require('../helpers/response.helper');

class NoteController {
  async addNote(req, res) {
    const note = await noteService.addNote(req.user.id, req.body);
    sendSuccess(res, 'Note added successfully', note, {}, 201);
  }

  async getUserNotes(req, res) {
    const { search } = req.query;
    const notes = await noteService.getUserNotes(req.user.id, search);
    sendSuccess(res, 'Notes retrieved successfully', notes);
  }

  async getTripNotes(req, res) {
    const notes = await noteService.getTripNotes(req.params.tripId);
    sendSuccess(res, 'Trip notes retrieved successfully', notes);
  }

  async updateNote(req, res) {
    const note = await noteService.updateNote(req.user.id, req.params.id, req.body);
    sendSuccess(res, 'Note updated successfully', note);
  }

  async deleteNote(req, res) {
    await noteService.deleteNote(req.user.id, req.params.id);
    sendSuccess(res, 'Note deleted successfully');
  }
}

module.exports = new NoteController();
