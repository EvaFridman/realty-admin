'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Viewing extends Model {
    static associate(models) {
      this.belongsTo(models.Listing, {
        foreignKey: 'listingId', as: 'listing'
      });
    }
  }
  Viewing.init({
    listingId: { type: DataTypes.INTEGER, allowNull: true },
    clientName: { type: DataTypes.STRING, allowNull: false, validate: { len: [2, 50] } },
    clientPhone: { type: DataTypes.STRING(20), allowNull: false, validate: { is: /^\+[1-9]\d{1,14}$/ } },
    clientEmail: { type: DataTypes.STRING, allowNull: false, validate: { isEmail: true } },
    preferredAt: { type: DataTypes.DATE, allowNull: false },
    comment: { type: DataTypes.TEXT },
    status: { type: DataTypes.ENUM('created', 'pending approval', 'approved', 'rejected', 'closed'), allowNull: false },
    notifiedAt: { type: DataTypes.DATE }
  }, {
    sequelize,
    modelName: 'Viewing',
  });
  return Viewing;
};