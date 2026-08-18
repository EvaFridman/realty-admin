'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Listings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      agentId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      districtId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Districts',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT
      },
      dealType: {
        type: Sequelize.ENUM('sale', 'rent'),
        allowNull: false
      },
      propertyType: {
        type: Sequelize.ENUM('flat', 'house', 'room', 'commercial'),
        allowNull: false
      },
      price: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false
      },
      area: {
        type: Sequelize.DECIMAL(6, 2),
        allowNull: false
      },
      rooms: {
        type: Sequelize.INTEGER
      },
      floor: {
        type: Sequelize.INTEGER
      },
      totalFloors: {
        type: Sequelize.INTEGER
      },
      address: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      lat: {
        type: Sequelize.DECIMAL(9, 6),
        allowNull: false
      },
      lng: {
        type: Sequelize.DECIMAL(9, 6),
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('draft', 'moderation', 'published', 'rejected', 'unpublished'),
        allowNull: false
      },
      rejectionReason: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      publishedAt: {
        type: Sequelize.DATE,
        allowNull: true
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

    await queryInterface.addIndex('Listings', ['dealType', 'propertyType', 'price'], {
      name: 'listings_filter_idx'
    });

    await queryInterface.addIndex('Listings', ['status'], {
      name: 'listings_published_partial_idx',
      where: {
        status: 'published'
      }
    });

    await queryInterface.addIndex('Listings', ['lat', 'lng'], {
      name: 'listings_lat_lng_idx'
    });

    await queryInterface.addIndex('Listings', ['agentId'], {
      name: 'listings_agent_id_idx'
    });

    await queryInterface.addIndex('Listings', ['districtId'], {
      name: 'listings_district_id_idx'
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('Listings', 'listings_filter_idx');
    await queryInterface.removeIndex('Listings', 'listings_published_partial_idx');
    await queryInterface.removeIndex('Listings', 'listings_lat_lng_idx');
    await queryInterface.removeIndex('Listings', 'listings_agent_id_idx');
    await queryInterface.removeIndex('Listings', 'listings_district_id_idx');
    await queryInterface.dropTable('Listings');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_Listings_dealType";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_Listings_propertyType";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_Listings_status";');
  }
};