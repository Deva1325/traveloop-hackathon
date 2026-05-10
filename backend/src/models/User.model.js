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
    Location: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },
    Language: {
      type: DataTypes.STRING(50),
      defaultValue: 'English',
    },
    IsActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    }
  }, {
    tableName: 'Users',
    timestamps: true,
    paranoid: true, // Enables soft delete (deletedAt)
    createdAt: 'CreatedAt',
    updatedAt: 'UpdatedAt',
    deletedAt: 'DeletedAt',
  });

  return User;
};
