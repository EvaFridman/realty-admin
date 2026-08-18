'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      this.hasMany(models.Listing, {
        foreignKey: 'agentId', as: 'listings'
      });
      this.belongsToMany(models.Listing, {
        through: models.Favorite,
        foreignKey: "userId",
        otherKey: "listingId",
        as: "favorites"
      });
    }
  }
  User.init({
    name: { type: DataTypes.STRING, allowNull: false, validate: { len: [2, 50] } },
    email: { type: DataTypes.STRING, allowNull: false, unique: true, validate: { isEmail: true } },
    phone: { type: DataTypes.STRING(20), unique: true, validate: { is: /^\+[1-9]\d{1,14}$/ } },
    role: { type: DataTypes.ENUM('agent', 'moderator'), allowNull: false, defaultValue: 'agent' },
    passwordHash: { type: DataTypes.STRING(60), allowNull: false, defaultValue: '' }
  }, {
    sequelize,
    modelName: 'User',
    defaultScope: { attributes: { exclude: ['passwordHash'] } },
  });
  return User;
};