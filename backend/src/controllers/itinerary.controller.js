const itineraryService = require('../services/itinerary.service');
const { sendSuccess } = require('../helpers/response.helper');

class ItineraryController {
  async addStop(req, res) {
    const stop = await itineraryService.addStop(req.params.tripId, req.user.id, req.body);
    sendSuccess(res, 'Stop added', stop, {}, 201);
  }

  async reorderStops(req, res) {
    const stops = await itineraryService.reorderStops(req.params.tripId, req.user.id, req.body.stops);
    sendSuccess(res, 'Stops reordered', stops);
  }
}
module.exports = new ItineraryController();
