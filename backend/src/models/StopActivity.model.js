const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  return sequelize.define('StopActivity', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true, field: 'StopActivityId' },
    tripStopId: { type: DataTypes.UUID, allowNull: false, field: 'TripStopId' },
    activityId: { type: DataTypes.UUID, allowNull: false, field: 'ActivityId' },
    activityDate: { type: DataTypes.DATEONLY, allowNull: true, field: 'ActivityDate' },
    status: { type: DataTypes.STRING(50), defaultValue: 'planned', field: 'Status' }
  }, { tableName: 'StopActivities', timestamps: true, createdAt: 'CreatedAt', updatedAt: 'UpdatedAt' });
};
