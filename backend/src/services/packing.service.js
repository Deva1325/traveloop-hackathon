const packingRepo = require('../repositories/packing.repository');
const tripService = require('./trip.service');
const { PackingCategory } = require('../models');

class PackingService {
  async addItem(tripId, userId, data) {
    await tripService.getTrip(tripId, userId);
    
    // 1. Find or create the category
    const [category] = await PackingCategory.findOrCreate({
      where: { CategoryName: data.category || 'clothing' }
    });

    // 2. Prepare item data
    const itemData = {
      tripId: tripId,
      packingCategoryId: category.PackingCategoryId,
      name: data.name,
      isPacked: false
    };

    return await packingRepo.create(itemData);
  }

  async getItems(tripId, userId) {
    await tripService.getTrip(tripId, userId);
    // Include category info in the returned items
    const items = await packingRepo.getByTrip(tripId);
    return items.map(item => ({
        id: item.id,
        name: item.name,
        isPacked: item.isPacked,
        category: item.PackingCategory?.CategoryName || 'clothing'
    }));
  }

  async togglePacked(tripId, itemId, userId, isPacked) {
    await tripService.getTrip(tripId, userId);
    await packingRepo.update(itemId, { isPacked });
    return true;
  }

  async deleteItem(tripId, itemId, userId) {
    await tripService.getTrip(tripId, userId);
    return await packingRepo.delete(itemId);
  }

  async resetChecklist(tripId, userId) {
    await tripService.getTrip(tripId, userId);
    return await packingRepo.resetByTrip(tripId);
  }
}
module.exports = new PackingService();
