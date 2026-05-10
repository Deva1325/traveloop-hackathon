const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const UserSession = sequelize.define('UserSession', {
    SessionId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    UserId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    RefreshToken: {
      type: DataTypes.STRING(1000),
      allowNull: false,
    },
    DeviceInfo: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    IpAddress: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    ExpiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
    }
  }, {
    tableName: 'UserSessions',
    timestamps: true,
    createdAt: 'CreatedAt',
    updatedAt: false,
  });

  return UserSession;
};
