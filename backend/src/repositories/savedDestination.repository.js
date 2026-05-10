const { SavedDestination, City } = require('../models');

class SavedDestinationRepository {
  async create(data) { return await SavedDestination.create(data); }
  
  async findByUser(userId) {
    return await SavedDestination.findAll({
      where: { UserId: userId },
      include: [City]
    });
  }

  async delete(userId, cityId) {
    return await SavedDestination.destroy({
      where: { UserId: userId, CityId: cityId }
    });
  }
}

module.exports = new SavedDestinationRepository();
