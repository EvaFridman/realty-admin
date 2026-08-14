'use strict';

const { faker } = require('@faker-js/faker/locale/ru');

module.exports = {
  async up(queryInterface, Sequelize) {
    faker.seed(2026);
    const now = new Date();

    const usedEmails = new Set();

    const users = Array.from({ length: 200 }, (_, index) => {
      let email;
      do { 
        email = faker.internet.email().toLowerCase(); 
      } while (usedEmails.has(email));
      usedEmails.add(email);

      const phone = `+7999${String(index).padStart(7, '0')}`;

      return {
        name: faker.person.fullName().slice(0, 50),
        email: email,
        phone: phone,
        role: faker.helpers.arrayElement(['agent', 'moderator']),
        createdAt: now,
        updatedAt: now,
      };
    });

    await queryInterface.bulkInsert('Users', users, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  },
};
