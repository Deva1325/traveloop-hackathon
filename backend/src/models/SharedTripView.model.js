const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  return sequelize.define('SharedTripView', {
    SharedTripViewId: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    TripId: { type: DataTypes.UUID, allowNull: false },
    ViewerIp: { type: DataTypes.STRING(100), allowNull: true }
  }, { tableName: 'SharedTripViews', timestamps: true, createdAt: 'ViewedAt', updatedAt: false });
};
