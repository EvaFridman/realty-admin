'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Listing extends Model {
    static associate(models) {
      this.belongsTo(models.User, {
        foreignKey: 'agentId', as: 'agent'
      });
      this.belongsTo(models.District, {
        foreignKey: 'districtId', as: 'district'
      });
      this.hasMany(models.ListingPhoto, {
        foreignKey: 'listingId', as: 'photos'
      });
      this.hasMany(models.Viewing, {
        foreignKey: 'listingId', as: 'viewings'
      });
      this.belongsToMany(models.User, {
        through: models.Favorite,
        foreignKey: "listingId",
        otherKey: "userId",
        as: "favoredBy"
      });
    }
  }
  Listing.init({
    agentId: { type: DataTypes.INTEGER, allowNull: false },
    districtId: { type: DataTypes.INTEGER, allowNull: false },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
    dealType: { type: DataTypes.ENUM('sale', 'rent'), allowNull: false },
    propertyType: { type: DataTypes.ENUM('flat', 'house', 'room', 'commercial'), allowNull: false },
    price: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
    area: { type: DataTypes.DECIMAL(6, 2), allowNull: false },
    rooms: { type: DataTypes.INTEGER },
    floor: { type: DataTypes.INTEGER },
    totalFloors: { type: DataTypes.INTEGER },
    address: { type: DataTypes.TEXT, allowNull: false },
    lat: { type: DataTypes.DECIMAL(9, 6), allowNull: false },
    lng: { type: DataTypes.DECIMAL(9, 6), allowNull: false },
    status: { type: DataTypes.ENUM('draft', 'moderation', 'published', 'rejected', 'unpublished'), allowNull: false },
    rejectionReason: { type: DataTypes.TEXT, allowNull: true },
    publishedAt:{ type: DataTypes.DATE, allowNull: true }
  }, {
    sequelize,
    modelName: 'Listing',
  });
  return Listing;
};