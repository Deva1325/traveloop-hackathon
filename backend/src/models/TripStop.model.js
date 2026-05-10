const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  return sequelize.define('TripStop', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true, field: 'TripStopId' },
    tripId: { type: DataTypes.UUID, allowNull: false, field: 'TripId' },
    cityId: { type: DataTypes.UUID, allowNull: false, field: 'CityId' },
    arrivalDate: { type: DataTypes.DATEONLY, allowNull: false, field: 'ArrivalDate' },
    departureDate: { type: DataTypes.DATEONLY, allowNull: false, field: 'DepartureDate' },
    stopOrder: { type: DataTypes.INTEGER, allowNull: false, field: 'StopOrder' },
    stayBudget: { type: DataTypes.DECIMAL(12,2), defaultValue: 0, field: 'StayBudget' },
    notes: { type: DataTypes.TEXT, allowNull: true, field: 'Notes' }
  }, { tableName: 'TripStops', timestamps: true, createdAt: 'CreatedAt', updatedAt: 'UpdatedAt' });
};
