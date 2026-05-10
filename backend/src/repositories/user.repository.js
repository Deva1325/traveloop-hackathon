const { User } = require('../models');

class UserRepository {
  async create(userData) { return await User.create(userData); }
  async findByEmail(email) { return await User.findOne({ where: { Email: email } }); }
  async findById(id) { return await User.findByPk(id); }
  async update(id, data) { return await User.update(data, { where: { UserId: id }, returning: true }); }
}
module.exports = new UserRepository();
