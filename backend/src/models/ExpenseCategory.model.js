const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  return sequelize.define('ExpenseCategory', {
    ExpenseCategoryId: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    CategoryName: { type: DataTypes.STRING(100), allowNull: false, unique: true }
  }, { tableName: 'ExpenseCategories', timestamps: false });
};
