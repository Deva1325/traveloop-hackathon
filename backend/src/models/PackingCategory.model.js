const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  return sequelize.define('PackingCategory', {
    PackingCategoryId: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    CategoryName: { type: DataTypes.STRING(100), allowNull: false, unique: true }
  }, { tableName: 'PackingCategories', timestamps: false });
};
