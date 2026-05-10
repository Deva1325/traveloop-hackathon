const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  return sequelize.define('City', {
    CityId: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    CityName: { type: DataTypes.STRING(100), allowNull: false },
    CountryName: { type: DataTypes.STRING(100), allowNull: false },
    CountryCode: { type: DataTypes.STRING(10), allowNull: true },
    Latitude: { type: DataTypes.DECIMAL(9,6), allowNull: true },
    Longitude: { type: DataTypes.DECIMAL(9,6), allowNull: true },
    CostIndex: { type: DataTypes.DECIMAL(8,2), defaultValue: 0 },
    PopularityScore: { type: DataTypes.DECIMAL(8,2), defaultValue: 0 },
    Description: { type: DataTypes.TEXT, allowNull: true },
    HeroImageUrl: { type: DataTypes.STRING(500), allowNull: true }
  }, { tableName: 'Cities', timestamps: true, createdAt: 'CreatedAt', updatedAt: false });
};
