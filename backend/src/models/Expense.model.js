const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  return sequelize.define('Expense', {
    ExpenseId: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    TripId: { type: DataTypes.UUID, allowNull: false },
    ExpenseCategoryId: { type: DataTypes.UUID, allowNull: false },
    Title: { type: DataTypes.STRING(150), allowNull: false },
    Amount: { type: DataTypes.DECIMAL(12,2), allowNull: false },
    ExpenseDate: { type: DataTypes.DATEONLY, allowNull: false },
    Notes: { type: DataTypes.TEXT, allowNull: true }
  }, { tableName: 'Expenses', timestamps: true, createdAt: 'CreatedAt', updatedAt: false });
};
