const itineraryService = require('../services/itinerary.service');
const { sendSuccess } = require('../helpers/response.helper');

class ItineraryController {
  async addStop(req, res) {
    const stop = await itineraryService.addStop(req.params.tripId, req.user.id, req.body);
    sendSuccess(res, 'Stop added', stop, {}, 201);
  }

  async updateStop(req, res) {
    const stop = await itineraryService.updateStop(req.params.tripId, req.params.id, req.user.id, req.body);
    sendSuccess(res, 'Stop updated', stop);
  }

  async deleteStop(req, res) {
    await itineraryService.deleteStop(req.params.tripId, req.params.id, req.user.id);
    sendSuccess(res, 'Stop deleted');
  }

  async reorderStops(req, res) {
    const stops = await itineraryService.reorderStops(req.params.tripId, req.user.id, req.body.stops);
    sendSuccess(res, 'Stops reordered', stops);
  }
}
module.exports = new ItineraryController();
