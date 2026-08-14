'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Favorite extends Model {
    static associate(models) {
      this.belongsTo(models.User, { foreignKey: "userId", as: 'user' });
      this.belongsTo(models.Listing, { foreignKey: "listingId", as: 'listing' });
    }
  }
  Favorite.init({
    userId: { type: DataTypes.INTEGER, allowNull: false },
    listingId: { type: DataTypes.INTEGER, allowNull: false },
    note: { type: DataTypes.TEXT },
    addedAt: { type: DataTypes.DATE, allowNull: false }
  }, {
    sequelize,
    modelName: 'Favorite',
  });
  return Favorite;
};