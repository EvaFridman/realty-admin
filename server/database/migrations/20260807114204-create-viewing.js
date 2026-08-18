'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Viewings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      listingId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Listings',
          key: 'id',
        },
        onDelete: 'SET NULL',
      },
      clientName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      clientPhone: {
        type: Sequelize.STRING(20),
        allowNull: false
      },
      clientEmail: {
        type: Sequelize.STRING,
        allowNull: false
      },
      preferredAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      comment: {
        type: Sequelize.TEXT
      },
      status: {
        type: Sequelize.ENUM('created', 'pending approval', 'approved', 'rejected', 'closed'),
        allowNull: false
      },
      notifiedAt: {
        type: Sequelize.DATE
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

    await queryInterface.addConstraint('Viewings', {
      fields: ['clientName'],
      type: 'check',
      name: 'viewings_name_length_check',
      where: Sequelize.literal('LENGTH("clientName") BETWEEN 2 AND 50')
    });

    await queryInterface.addConstraint('Viewings', {
      fields: ['clientEmail'],
      type: 'check',
      name: 'viewings_email_check',
      where: Sequelize.literal('"clientEmail" ~* \'^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,4}$\'')
    });

    await queryInterface.addConstraint('Viewings', {
      fields: ['clientPhone'],
      type: 'check',
      name: 'viewings_phone_check',
      where: Sequelize.literal('"clientPhone" ~* \'^[+][1-9]\\d{1,14}$\'')
    });

    await queryInterface.addIndex('Viewings', ['listingId'], {
      name: 'viewings_listingId_idx'
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('Viewings', 'viewings_listingId_idx');
    await queryInterface.dropTable('Viewings');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_Viewings_status";');
  }
};