const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  return sequelize.define('Activity', {
    ActivityId: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    CityId: { type: DataTypes.UUID, allowNull: false },
    ActivityCategoryId: { type: DataTypes.UUID, allowNull: true },
    Title: { type: DataTypes.STRING(150), allowNull: false },
    Description: { type: DataTypes.TEXT, allowNull: true },
    DurationHours: { type: DataTypes.DECIMAL(5,2), defaultValue: 0 },
    EstimatedCost: { type: DataTypes.DECIMAL(12,2), defaultValue: 0 },
    Rating: { type: DataTypes.DECIMAL(3,2), defaultValue: 0 },
    ActivityImageUrl: { type: DataTypes.STRING(500), allowNull: true },
    IsPopular: { type: DataTypes.BOOLEAN, defaultValue: false }
  }, { tableName: 'Activities', timestamps: true, createdAt: 'CreatedAt', updatedAt: false });
};
