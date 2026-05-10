const activityRepo = require('../repositories/activity.repository');

class ActivityService {
  async getCityActivities(cityId) { return await activityRepo.getByCity(cityId); }
}
module.exports = new ActivityService();
