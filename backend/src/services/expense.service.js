const expenseRepo = require('../repositories/expense.repository');
const tripService = require('./trip.service');

class ExpenseService {
  async addExpense(tripId, userId, data) {
    await tripService.getTrip(tripId, userId);
    return await expenseRepo.create({ ...data, TripId: tripId });
  }

  async getExpenses(tripId, userId) {
    await tripService.getTrip(tripId, userId);
    return await expenseRepo.getByTrip(tripId);
  }
}
module.exports = new ExpenseService();
