const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Trip = sequelize.define('Trip', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      field: 'TripId'
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'UserId'
    },
    title: {
      type: DataTypes.STRING(150),
      allowNull: false,
      field: 'Title'
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'Description'
    },
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: 'StartDate'
    },
    endDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: 'EndDate'
    },
    status: {
      type: DataTypes.STRING(50),
      defaultValue: 'Draft',
      field: 'Status'
    },
    budget: {
      type: DataTypes.DECIMAL(12,2),
      defaultValue: 0,
      field: 'Budget'
    },
    coverImage: {
      type: DataTypes.STRING(500),
      allowNull: true,
      field: 'CoverImage'
    }
  }, {
    tableName: 'Trips',
    timestamps: true,
    createdAt: 'CreatedAt',
    updatedAt: 'UpdatedAt',
  });

  return Trip;
};
