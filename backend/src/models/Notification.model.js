const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  return sequelize.define('Notification', {
    NotificationId: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    UserId: { type: DataTypes.UUID, allowNull: false },
    Title: { type: DataTypes.STRING(150), allowNull: false },
    Message: { type: DataTypes.TEXT, allowNull: false },
    IsRead: { type: DataTypes.BOOLEAN, defaultValue: false }
  }, { tableName: 'Notifications', timestamps: true, createdAt: 'CreatedAt', updatedAt: false });
};
