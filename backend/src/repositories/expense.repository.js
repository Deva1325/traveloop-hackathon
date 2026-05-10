const { Expense, ExpenseCategory } = require('../models');

class ExpenseRepository {
  async create(data) { return await Expense.create(data); }
  async getByTrip(tripId) { return await Expense.findAll({ where: { TripId: tripId } }); }
}
module.exports = new ExpenseRepository();
