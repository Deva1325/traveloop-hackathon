const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  return sequelize.define('Expense', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true, field: 'ExpenseId' },
    tripId: { type: DataTypes.UUID, allowNull: false, field: 'TripId' },
    expenseCategoryId: { type: DataTypes.UUID, allowNull: false, field: 'ExpenseCategoryId' },
    title: { type: DataTypes.STRING(150), allowNull: false, field: 'Title' },
    amount: { type: DataTypes.DECIMAL(12,2), allowNull: false, field: 'Amount' },
    expenseDate: { type: DataTypes.DATEONLY, allowNull: false, field: 'ExpenseDate' },
    notes: { type: DataTypes.TEXT, allowNull: true, field: 'Notes' }
  }, { tableName: 'Expenses', timestamps: true, createdAt: 'CreatedAt', updatedAt: false });
};
