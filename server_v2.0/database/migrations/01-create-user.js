'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      phone: {
        type: Sequelize.STRING(20),
        unique: true
      },
      role: {
        type: Sequelize.ENUM('agent', 'moderator'),
        allowNull: false,
        defaultValue: 'agent'
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

    await queryInterface.addIndex('Users', ['role'], {
      name: 'users_role_idx'
    });
    
    await queryInterface.addConstraint('Users', {
      fields: ['name'],
      type: 'check',
      name: 'users_name_length_check',
      where: Sequelize.literal('LENGTH(name) BETWEEN 2 AND 50')
    });

    await queryInterface.addIndex('Users', ['email'], {
      unique: true,
      name: 'users_email_unique_idx'
    });

    await queryInterface.addConstraint('Users', {
      fields: ['email'],
      type: 'check',
      name: 'users_email_check',
      where: Sequelize.literal("email ~* '^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,6}$'")
    });

    await queryInterface.addConstraint('Users', {
      fields: ['phone'],
      type: 'check',
      name: 'users_phone_check',
      where: Sequelize.literal("phone ~* '^\\+[1-9]\\d{1,14}$'")
    });

  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('Users', 'users_email_unique_idx');
    await queryInterface.removeIndex('Users', 'users_role_idx');
    await queryInterface.dropTable('Users');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_Users_role";');  }
};