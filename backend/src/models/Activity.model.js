const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  return sequelize.define('Activity', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true, field: 'ActivityId' },
    cityId: { type: DataTypes.UUID, allowNull: false, field: 'CityId' },
    activityCategoryId: { type: DataTypes.UUID, allowNull: false, field: 'ActivityCategoryId' },
    name: { type: DataTypes.STRING(200), allowNull: false, field: 'Name' },
    description: { type: DataTypes.TEXT, allowNull: true, field: 'Description' },
    estimatedCost: { type: DataTypes.DECIMAL(10,2), defaultValue: 0, field: 'EstimatedCost' },
    imageUrl: { type: DataTypes.STRING(500), allowNull: true, field: 'ImageUrl' }
  }, { tableName: 'Activities', timestamps: true, createdAt: 'CreatedAt', updatedAt: 'UpdatedAt' });
};
