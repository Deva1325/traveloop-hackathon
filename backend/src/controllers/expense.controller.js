const expenseService = require('../services/expense.service');
const { sendSuccess } = require('../helpers/response.helper');

class ExpenseController {
  async addExpense(req, res) {
    const expense = await expenseService.addExpense(req.params.tripId, req.user.id, req.body);
    sendSuccess(res, 'Expense added', expense, {}, 201);
  }

  async getExpenses(req, res) {
    const expenses = await expenseService.getExpenses(req.params.tripId, req.user.id);
    sendSuccess(res, 'Expenses retrieved', expenses);
  }
}
module.exports = new ExpenseController();
