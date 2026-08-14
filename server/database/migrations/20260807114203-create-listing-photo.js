'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ListingPhotos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      listingId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Listings',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      url: {
        type: Sequelize.STRING,
        allowNull: false
      },
      position: {
        type: Sequelize.INTEGER
      },
      isCover: {
        type: Sequelize.BOOLEAN
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    await queryInterface.addIndex('ListingPhotos', ['listingId'], {
      name: 'listingPhotos_listingId_idx'
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('ListingPhotos');
    await queryInterface.removeIndex('ListingPhotos', 'listingPhotos_listingId_idx');
  }
};