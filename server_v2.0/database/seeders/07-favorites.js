'use strict';

const { faker } = require('@faker-js/faker/locale/ru');

module.exports = {
  async up(queryInterface, Sequelize) {
    faker.seed(2026);

    const users = await queryInterface.sequelize.query(
      `SELECT id FROM "Users";`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    const listings = await queryInterface.sequelize.query(
      `SELECT id FROM "Listings";`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (users.length === 0) {
      throw new Error("Seed relation error: Please seed Users before seeding Favorites!");
    }

    if (listings.length === 0) {
      throw new Error("Seed relation error: Please seed Listings before seeding Favorites!");
    }

    const favorites = [];
    const usedPairs = new Set();
    const totalFavorites = 4000;

    const maxPossiblePairs = users.length * listings.length;
    const finalCount = Math.min(totalFavorites, maxPossiblePairs);

    for (let i = 0; i < finalCount; i++) {
      let currentUserId;
      let currentListingId;
      let pairKey;

      do {
        currentUserId = faker.helpers.arrayElement(users).id;
        currentListingId = faker.helpers.arrayElement(listings).id;
        pairKey = `${currentUserId}-${currentListingId}`;
      } while (usedPairs.has(pairKey));

      usedPairs.add(pairKey);

      const addedAt = faker.date.recent({ days: 60 });

      favorites.push({
        userId: currentUserId,
        listingId: currentListingId,
        note: faker.datatype.boolean({ probability: 0.6 }) ? faker.lorem.sentence() : null,
        addedAt: addedAt,
        createdAt: addedAt,
        updatedAt: addedAt
      });
    }

    if (favorites.length > 0) {
      await queryInterface.bulkInsert('Favorites', favorites, {});
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Favorites', null, {});
  }
};