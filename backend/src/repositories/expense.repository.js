const { Expense, ExpenseCategory } = require('../models');

class ExpenseRepository {
  async create(data) {
    return await Expense.create(data);
  }

  async findByTripId(tripId) {
    return await Expense.findAll({
      where: { tripId },
      include: [ExpenseCategory],
      order: [['expenseDate', 'DESC']]
    });
  }

  async findById(id) {
    return await Expense.findByPk(id, { include: [ExpenseCategory] });
  }

  async update(id, data) {
    return await Expense.update(data, { where: { id } });
  }

  async delete(id) {
    return await Expense.destroy({ where: { id } });
  }

  async findAllByUserId(userId) {
    const { Trip } = require('../models');
    return await Expense.findAll({
      include: [
        {
          model: Trip,
          where: { userId },
          attributes: []
        },
        ExpenseCategory
      ]
    });
  }

  async getCategories() {
    return await ExpenseCategory.findAll();
  }
}

module.exports = new ExpenseRepository();
