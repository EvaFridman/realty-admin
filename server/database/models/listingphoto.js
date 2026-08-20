'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ListingPhoto extends Model {
    static associate(models) {
      this.belongsTo(models.Listing, {
        foreignKey: 'listingId', as: 'listing'
      });
    }
  }
  ListingPhoto.init({
    listingId: { type: DataTypes.INTEGER, allowNull: false },
    externalUrl: { type: DataTypes.STRING, allowNull: true },
    position: { type: DataTypes.INTEGER },
    isCover: { type: DataTypes.BOOLEAN },
    fileName: { type: DataTypes.STRING, allowNull: true },
    sizeBytes: { type: DataTypes.INTEGER, allowNull: true },
  }, {
    sequelize,
    modelName: 'ListingPhoto',
    tableName: 'ListingPhotos',
    validate: {
      hasExactlyOneSource() {
        const hasExternal = !!this.externalUrl;
        const hasFile = !!this.fileName;
        if ((hasExternal && hasFile) || (!hasExternal && !hasFile)) {
          throw new Error('Exactly one of two fields must be filled in: either ExternalURL or fileName');
        }
      }
    }
  });
  return ListingPhoto;
};