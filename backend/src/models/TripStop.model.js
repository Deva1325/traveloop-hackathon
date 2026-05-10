const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  return sequelize.define('TripStop', {
    TripStopId: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    TripId: { type: DataTypes.UUID, allowNull: false },
    CityId: { type: DataTypes.UUID, allowNull: false },
    ArrivalDate: { type: DataTypes.DATEONLY, allowNull: false },
    DepartureDate: { type: DataTypes.DATEONLY, allowNull: false },
    StopOrder: { type: DataTypes.INTEGER, allowNull: false },
    StayBudget: { type: DataTypes.DECIMAL(12,2), defaultValue: 0 },
    Notes: { type: DataTypes.TEXT, allowNull: true }
  }, { tableName: 'TripStops', timestamps: true, createdAt: 'CreatedAt', updatedAt: 'UpdatedAt' });
};
