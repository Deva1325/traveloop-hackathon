const expenseRepository = require('../repositories/expense.repository');
const tripRepository = require('../repositories/trip.repository');
const { ApiError } = require('../middlewares/error.middleware');

class ExpenseService {
  async addExpense(userId, data) {
    const trip = await tripRepository.findById(data.tripId);
    if (!trip) throw new ApiError(404, 'Trip not found');
    if (trip.userId !== userId) throw new ApiError(403, 'Access denied');

    return await expenseRepository.create(data);
  }

  async getTripExpenses(userId, tripId) {
    const trip = await tripRepository.findById(tripId);
    if (!trip) throw new ApiError(404, 'Trip not found');
    if (trip.userId !== userId && !trip.isPublic) throw new ApiError(403, 'Access denied');

    return await expenseRepository.findByTripId(tripId);
  }

  async updateExpense(userId, id, data) {
    const expense = await expenseRepository.findById(id);
    if (!expense) throw new ApiError(404, 'Expense not found');
    
    const trip = await tripRepository.findById(expense.tripId);
    if (trip.userId !== userId) throw new ApiError(403, 'Access denied');

    await expenseRepository.update(id, data);
    return await expenseRepository.findById(id);
  }

  async deleteExpense(userId, id) {
    const expense = await expenseRepository.findById(id);
    if (!expense) throw new ApiError(404, 'Expense not found');

    const trip = await tripRepository.findById(expense.tripId);
    if (trip.userId !== userId) throw new ApiError(403, 'Access denied');

    return await expenseRepository.delete(id);
  }

  async getCategories() {
    return await expenseRepository.getCategories();
  }

  async getTripBudgetSummary(userId, tripId) {
    const trip = await tripRepository.findById(tripId);
    if (!trip) throw new ApiError(404, 'Trip not found');
    
    const expenses = await expenseRepository.findByTripId(tripId);
    const totalSpent = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
    
    // Calculate daily average
    const start = new Date(trip.startDate);
    const end = new Date(trip.endDate);
    const days = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1);
    
    // Category breakdown
    const categoryBreakdown = expenses.reduce((acc, exp) => {
      const catName = exp.ExpenseCategory?.CategoryName || 'Uncategorized';
      acc[catName] = (acc[catName] || 0) + parseFloat(exp.amount);
      return acc;
    }, {});

    return {
      plannedBudget: parseFloat(trip.budget),
      totalSpent,
      remainingBalance: parseFloat(trip.budget) - totalSpent,
      utilization: (totalSpent / parseFloat(trip.budget)) * 100,
      dailyAverage: totalSpent / days,
      days,
      categoryBreakdown
    };
  }

  async getGlobalBudgetSummary(userId) {
    const trips = await tripRepository.findAllByUserId(userId);
    const expenses = await expenseRepository.findAllByUserId(userId);

    const totalPlanned = trips.reduce((sum, trip) => sum + parseFloat(trip.budget), 0);
    const totalSpent = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);

    const categoryBreakdown = expenses.reduce((acc, exp) => {
      const catName = exp.ExpenseCategory?.CategoryName || 'Uncategorized';
      acc[catName] = (acc[catName] || 0) + parseFloat(exp.amount);
      return acc;
    }, {});

    const tripComparison = trips.map(trip => {
      const tripExpenses = expenses.filter(e => e.tripId === trip.id);
      const spent = tripExpenses.reduce((sum, e) => sum + parseFloat(e.amount), 0);
      return {
        tripId: trip.id,
        title: trip.title,
        planned: parseFloat(trip.budget),
        spent
      };
    });

    return {
      totalPlanned,
      totalSpent,
      remainingBalance: totalPlanned - totalSpent,
      utilization: totalPlanned > 0 ? (totalSpent / totalPlanned) * 100 : 0,
      categoryBreakdown,
      tripComparison,
      tripCount: trips.length,
      recentExpenses: expenses.slice(0, 5)
    };
  }
}

module.exports = new ExpenseService();
