const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  return sequelize.define('PackingItem', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true, field: 'PackingItemId' },
    tripId: { type: DataTypes.UUID, allowNull: false, field: 'TripId' },
    packingCategoryId: { type: DataTypes.UUID, allowNull: false, field: 'PackingCategoryId' },
    name: { type: DataTypes.STRING(150), allowNull: false, field: 'Name' },
    isPacked: { type: DataTypes.BOOLEAN, defaultValue: false, field: 'IsPacked' }
  }, { tableName: 'PackingItems', timestamps: true, createdAt: 'CreatedAt', updatedAt: 'UpdatedAt' });
};
