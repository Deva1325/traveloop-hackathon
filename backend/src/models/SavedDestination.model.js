const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  return sequelize.define('SavedDestination', {
    SavedDestinationId: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    UserId: { type: DataTypes.UUID, allowNull: false },
    CityId: { type: DataTypes.UUID, allowNull: false }
  }, { tableName: 'SavedDestinations', timestamps: true, createdAt: 'SavedAt', updatedAt: false });
};
