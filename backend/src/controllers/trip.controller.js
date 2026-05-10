const tripService = require('../services/trip.service');
const { sendSuccess } = require('../helpers/response.helper');

class TripController {
  async create(req, res) {
    const trip = await tripService.createTrip(req.user.id, req.body);
    sendSuccess(res, 'Trip created', trip, {}, 201);
  }

  async getAll(req, res) {
    const trips = await tripService.getUserTrips(req.user.id);
    sendSuccess(res, 'User trips retrieved', trips);
  }

  async getOne(req, res) {
    const trip = await tripService.getTrip(req.params.id, req.user.id);
    sendSuccess(res, 'Trip details retrieved', trip);
  }

  async update(req, res) {
    const trip = await tripService.updateTrip(req.params.id, req.user.id, req.body);
    sendSuccess(res, 'Trip updated', trip);
  }

  async delete(req, res) {
    await tripService.deleteTrip(req.params.id, req.user.id);
    sendSuccess(res, 'Trip deleted');
  }
}
module.exports = new TripController();
