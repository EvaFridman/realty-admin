'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Favorites', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
        onDelete: 'CASCADE',
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
      note: {
        type: Sequelize.TEXT
      },
      addedAt: {
        type: Sequelize.DATE,
        allowNull: false
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

    await queryInterface.addIndex('Favorites', ['userId', 'listingId'], {
      unique: true,
      name: 'favorites_userId_listingId_unique_idx'
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Favorites');
    await queryInterface.removeIndex('Favorites', 'favorites_userId_listingId_unique_idx');

  }
};