const savedDestinationRepository = require('../repositories/savedDestination.repository');
const { sendSuccess } = require('../helpers/response.helper');

class UserController {
  async getSavedDestinations(req, res) {
    const destinations = await savedDestinationRepository.findByUser(req.user.id);
    sendSuccess(res, 'Saved destinations retrieved', destinations);
  }

  async saveDestination(req, res) {
    const { cityId } = req.body;
    const saved = await savedDestinationRepository.create({
      UserId: req.user.id,
      CityId: cityId
    });
    sendSuccess(res, 'Destination saved successfully', saved, {}, 201);
  }

  async removeSavedDestination(req, res) {
    const { cityId } = req.params;
    await savedDestinationRepository.delete(req.user.id, cityId);
    sendSuccess(res, 'Destination removed from saved list');
  }
}

module.exports = new UserController();
