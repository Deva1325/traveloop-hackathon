const { Trip, City, Expense } = require('../models');

class AnalyticsRepository {
  async getDashboardStats(userId) {
    const tripCount = await Trip.count({ where: { UserId: userId } });
    return { totalTrips: tripCount };
  }
}
module.exports = new AnalyticsRepository();
