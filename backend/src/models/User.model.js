const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    UserId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    FullName: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    Email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    PasswordHash: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    ProfileImageUrl: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    Bio: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    IsActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    }
  }, {
    tableName: 'Users',
    timestamps: true,
    createdAt: 'CreatedAt',
    updatedAt: 'UpdatedAt',
  });

  return User;
};
