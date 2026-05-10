const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Trip = sequelize.define('Trip', {
    TripId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    UserId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    Title: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    Description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    StartDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    EndDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    Status: {
      type: DataTypes.STRING(50),
      defaultValue: 'Draft',
    }
  }, {
    tableName: 'Trips',
    timestamps: true,
    createdAt: 'CreatedAt',
    updatedAt: 'UpdatedAt',
  });

  return Trip;
};
