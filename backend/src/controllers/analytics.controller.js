const analyticsService = require('../services/analytics.service');
const { sendSuccess } = require('../helpers/response.helper');

class AnalyticsController {
  async getDashboardStats(req, res) {
    const stats = await analyticsService.getDashboardStats(req.user.id);
    sendSuccess(res, 'Dashboard stats retrieved', stats);
  }
}
module.exports = new AnalyticsController();
