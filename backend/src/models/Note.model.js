const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  return sequelize.define('Note', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true, field: 'NoteId' },
    tripId: { type: DataTypes.UUID, allowNull: true, field: 'TripId' },
    tripStopId: { type: DataTypes.UUID, allowNull: true, field: 'TripStopId' },
    userId: { type: DataTypes.UUID, allowNull: false, field: 'UserId' },
    content: { type: DataTypes.TEXT, allowNull: false, field: 'Content' },
    color: { type: DataTypes.STRING(20), defaultValue: 'yellow', field: 'Color' }
  }, { tableName: 'Notes', timestamps: true, createdAt: 'CreatedAt', updatedAt: 'UpdatedAt' });
};
