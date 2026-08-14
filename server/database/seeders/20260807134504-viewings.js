'use strict';

const { faker } = require('@faker-js/faker/locale/ru');

module.exports = {
  async up(queryInterface, Sequelize) {
    faker.seed(2026);

    const listings = await queryInterface.sequelize.query(
      `SELECT id, status FROM "Listings";`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (listings.length === 0) {
      throw new Error("Seed relation error: Please seed Listings before seeding Viewings!");
    }

    const viewings = [];

    const activeListings = listings.filter(l => l.status === 'published');
    const targetListings = activeListings.length > 0 ? activeListings : listings;

    for (let i = 0; i < 3000; i++) {
      const listing = faker.helpers.arrayElement(targetListings);
      
      const isListingDeletedInHistory = faker.datatype.boolean({ probability: 0.1 });
      const currentListingId = isListingDeletedInHistory ? null : listing.id;

      const status = currentListingId === null ? 'closed' : faker.helpers.arrayElement(['created', 'pending approval', 'approved', 'rejected', 'closed']);

      const addedAt = faker.date.recent({ days: 30 });
      const preferredAt = faker.date.soon({ days: 14, refDate: addedAt });

      const hasBeenNotified = ['approved', 'rejected', 'closed'].includes(status);
      const notifiedAt = hasBeenNotified ? faker.date.between({ from: addedAt, to: preferredAt }) : null;

      const safePhone = `+79${faker.string.numeric(9)}`;

      viewings.push({
        listingId: currentListingId,
        clientName: faker.person.fullName().slice(0, 50),
        clientPhone: safePhone,
        clientEmail: faker.internet.email().toLowerCase(),
        preferredAt,
        comment: faker.datatype.boolean({ probability: 0.6 }) ? faker.lorem.sentence() : null,
        status,
        notifiedAt,
        createdAt: addedAt,
        updatedAt: hasBeenNotified ? notifiedAt : addedAt
      });
    }

    if (viewings.length > 0) {
      await queryInterface.bulkInsert('Viewings', viewings, {});
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Viewings', null, {});
  }
};
