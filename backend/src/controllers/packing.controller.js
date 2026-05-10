const packingService = require('../services/packing.service');
const { sendSuccess } = require('../helpers/response.helper');

class PackingController {
  async addItem(req, res) {
    const item = await packingService.addItem(req.params.tripId, req.user.id, req.body);
    sendSuccess(res, 'Packing item added', item, {}, 201);
  }
  async getItems(req, res) {
    const items = await packingService.getItems(req.params.tripId, req.user.id);
    sendSuccess(res, 'Packing items retrieved', items);
  }
  async togglePacked(req, res) {
    await packingService.togglePacked(req.params.tripId, req.params.itemId, req.user.id, req.body.isPacked);
    sendSuccess(res, 'Packing status updated');
  }
  async resetChecklist(req, res) {
    await packingService.resetChecklist(req.params.tripId, req.user.id);
    sendSuccess(res, 'Checklist reset');
  }
  async deleteItem(req, res) {
    await packingService.deleteItem(req.params.tripId, req.params.itemId, req.user.id);
    sendSuccess(res, 'Packing item deleted');
  }
}
module.exports = new PackingController();
