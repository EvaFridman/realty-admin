'use strict';

const { faker } = require('@faker-js/faker/locale/ru');

module.exports = {
  async up (queryInterface, Sequelize) {
    faker.seed(2026);
    const now = new Date();

    const listings = await queryInterface.sequelize.query(
      `SELECT id FROM "Listings";`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (!listings || listings.length === 0) {
      throw new Error("Seed relation error: Please seed Listings before seeding ListingPhotos");
    }

    const photos = [];

    const listingsWithPhotos = listings.filter(() => faker.datatype.boolean({ probability: 0.75 }));

    listingsWithPhotos.forEach((listing) => {
      const photoCount = faker.number.int({ min: 1, max: 5 });

      for (let position = 1; position <= photoCount; position++) {
        photos.push({
          listingId: listing.id,
          externalUrl: faker.image.urlLoremFlickr({ width: 800, height: 600, category: 'buildings' }),
          position: position,
          isCover: position === 1,
          createdAt: now,
          updatedAt: now
        });
      }
    });

    if (photos.length > 0) {
      await queryInterface.bulkInsert('ListingPhotos', photos, {});
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('ListingPhotos', null, {});
  }
};