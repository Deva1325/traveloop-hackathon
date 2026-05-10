const expenseService = require('../services/expense.service');
const { sendSuccess } = require('../helpers/response.helper');

class ExpenseController {
  async addExpense(req, res) {
    const expense = await expenseService.addExpense(req.user.id, req.body);
    sendSuccess(res, 'Expense added successfully', expense, {}, 201);
  }

  async getTripExpenses(req, res) {
    const expenses = await expenseService.getTripExpenses(req.user.id, req.params.tripId);
    sendSuccess(res, 'Expenses retrieved successfully', expenses);
  }

  async updateExpense(req, res) {
    const expense = await expenseService.updateExpense(req.user.id, req.params.id, req.body);
    sendSuccess(res, 'Expense updated successfully', expense);
  }

  async deleteExpense(req, res) {
    await expenseService.deleteExpense(req.user.id, req.params.id);
    sendSuccess(res, 'Expense deleted successfully');
  }

  async getCategories(req, res) {
    const categories = await expenseService.getCategories();
    sendSuccess(res, 'Categories retrieved successfully', categories);
  }

  async getTripSummary(req, res) {
    const summary = await expenseService.getTripBudgetSummary(req.user.id, req.params.tripId);
    sendSuccess(res, 'Trip budget summary retrieved', summary);
  }

  async getGlobalSummary(req, res) {
    const summary = await expenseService.getGlobalBudgetSummary(req.user.id);
    sendSuccess(res, 'Global budget summary retrieved', summary);
  }
}

module.exports = new ExpenseController();
