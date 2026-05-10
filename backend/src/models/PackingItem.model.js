const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  return sequelize.define('PackingItem', {
    PackingItemId: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    TripId: { type: DataTypes.UUID, allowNull: false },
    PackingCategoryId: { type: DataTypes.UUID, allowNull: true },
    ItemName: { type: DataTypes.STRING(150), allowNull: false },
    Quantity: { type: DataTypes.INTEGER, defaultValue: 1 },
    IsPacked: { type: DataTypes.BOOLEAN, defaultValue: false }
  }, { tableName: 'PackingItems', timestamps: true, createdAt: 'CreatedAt', updatedAt: false });
};
