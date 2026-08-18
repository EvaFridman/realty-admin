'use strict';
const bcrypt = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const hash = await bcrypt.hash('Password123', 12);
    await queryInterface.bulkUpdate('Users', { passwordHash: hash }, {});

    await queryInterface.bulkInsert('Users', [{
      name: 'Moderator',
      email: 'moderator@realty.local',
      phone: '+79091112233',
      role: 'moderator',
      passwordHash: hash,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', { email: 'moderator@realty.local' }, {});
    await queryInterface.bulkUpdate('Users', { passwordHash: '' }, {});
  }
};
