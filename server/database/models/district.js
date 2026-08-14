'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class District extends Model {
    static associate(models) {
      this.hasMany(models.Listing, {
        foreignKey: 'districtId', as: 'listings'
      });
    }
  }
  District.init({
    title: { type: DataTypes.STRING, allowNull: false },
    slug: { type: DataTypes.STRING, allowNull: false, unique: true },
    city: { type: DataTypes.STRING, allowNull: false },
  }, {
    sequelize,
    modelName: 'District',
  });
  return District;
};