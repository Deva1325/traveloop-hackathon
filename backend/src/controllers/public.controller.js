const publicService = require('../services/public.service');
const { sendSuccess } = require('../helpers/response.helper');

class PublicController {
  async getSharedTrip(req, res) {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const trip = await publicService.getSharedTrip(req.params.slug, ip);
    sendSuccess(res, 'Public trip retrieved', trip);
  }
}
module.exports = new PublicController();
