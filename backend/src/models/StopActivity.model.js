const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  return sequelize.define('StopActivity', {
    StopActivityId: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    TripStopId: { type: DataTypes.UUID, allowNull: false },
    ActivityId: { type: DataTypes.UUID, allowNull: false },
    ActivityDate: { type: DataTypes.DATEONLY, allowNull: false },
    StartTime: { type: DataTypes.TIME, allowNull: true },
    EndTime: { type: DataTypes.TIME, allowNull: true },
    CustomNotes: { type: DataTypes.TEXT, allowNull: true },
    CustomCost: { type: DataTypes.DECIMAL(12,2), allowNull: true }
  }, { tableName: 'StopActivities', timestamps: true, createdAt: 'CreatedAt', updatedAt: false });
};
