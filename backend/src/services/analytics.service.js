const analyticsRepo = require('../repositories/analytics.repository');

class AnalyticsService {
  async getDashboardStats(userId) { return await analyticsRepo.getDashboardStats(userId); }
}
module.exports = new AnalyticsService();
