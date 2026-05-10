const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  return sequelize.define('Note', {
    NoteId: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    TripId: { type: DataTypes.UUID, allowNull: false },
    TripStopId: { type: DataTypes.UUID, allowNull: true },
    UserId: { type: DataTypes.UUID, allowNull: false },
    Title: { type: DataTypes.STRING(150), allowNull: true },
    Content: { type: DataTypes.TEXT, allowNull: false },
    NoteDate: { type: DataTypes.DATEONLY, allowNull: true }
  }, { tableName: 'Notes', timestamps: true, createdAt: 'CreatedAt', updatedAt: 'UpdatedAt' });
};
