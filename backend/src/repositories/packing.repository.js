const { PackingItem, PackingCategory } = require('../models');

class PackingRepository {
  async create(data) { 
    return await PackingItem.create(data); 
  }
  
  async getByTrip(tripId) { 
    return await PackingItem.findAll({ 
      where: { tripId: tripId },
      include: [{ model: PackingCategory }]
    }); 
  }
  
  async update(id, data) { 
    return await PackingItem.update(data, { where: { id: id } }); 
  }
  
  async delete(id) { 
    return await PackingItem.destroy({ where: { id: id } }); 
  }
  
  async resetByTrip(tripId) {
    return await PackingItem.update({ isPacked: false }, { where: { tripId: tripId } });
  }
}
module.exports = new PackingRepository();
