const activityService = require('../services/activity.service');
const { sendSuccess } = require('../helpers/response.helper');

class ActivityController {
  async getCityActivities(req, res) {
    const activities = await activityService.getCityActivities(req.params.cityId);
    sendSuccess(res, 'Activities retrieved', activities);
  }
}
module.exports = new ActivityController();
