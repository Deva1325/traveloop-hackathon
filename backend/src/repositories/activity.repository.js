const { Activity, City } = require('../models');

class ActivityRepository {
  async getByCity(cityId) { return await Activity.findAll({ where: { CityId: cityId } }); }
}
module.exports = new ActivityRepository();
