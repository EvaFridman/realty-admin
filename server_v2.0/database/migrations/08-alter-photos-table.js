'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.renameColumn('ListingPhotos', 'url', 'externalUrl');

    await queryInterface.changeColumn('ListingPhotos', 'externalUrl', {
      type: Sequelize.STRING,
      allowNull: true
    });

    await queryInterface.addColumn('ListingPhotos', 'fileName', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('ListingPhotos', 'sizeBytes', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('ListingPhotos', 'sizeBytes');
    await queryInterface.removeColumn('ListingPhotos', 'fileName');
    await queryInterface.changeColumn('ListingPhotos', 'externalUrl', {
      type: Sequelize.STRING,
      allowNull: false
    });
    await queryInterface.renameColumn('ListingPhotos', 'externalUrl', 'url');
  }
};
