const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  return sequelize.define('ActivityCategory', {
    ActivityCategoryId: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    CategoryName: { type: DataTypes.STRING(100), allowNull: false, unique: true },
    Description: { type: DataTypes.STRING(500), allowNull: true }
  }, { tableName: 'ActivityCategories', timestamps: false });
};
