const noteService = require('../services/note.service');
const { sendSuccess } = require('../helpers/response.helper');

class NoteController {
  async addNote(req, res) {
    const note = await noteService.addNote(req.params.tripId, req.user.id, req.body);
    sendSuccess(res, 'Note added', note, {}, 201);
  }
  async getNotes(req, res) {
    const notes = await noteService.getNotes(req.params.tripId, req.user.id);
    sendSuccess(res, 'Notes retrieved', notes);
  }
}
module.exports = new NoteController();
