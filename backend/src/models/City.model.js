const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  return sequelize.define('City', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true, field: 'CityId' },
    name: { type: DataTypes.STRING(150), allowNull: false, field: 'Name' },
    country: { type: DataTypes.STRING(100), allowNull: false, field: 'Country' },
    imageUrl: { type: DataTypes.STRING(500), allowNull: true, field: 'ImageUrl' }
  }, { tableName: 'Cities', timestamps: false });
};
