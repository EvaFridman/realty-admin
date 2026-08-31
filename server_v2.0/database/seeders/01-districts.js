'use strict';

const { faker } = require('@faker-js/faker/locale/ru');

module.exports = {
  async up(queryInterface, Sequelize) {
    faker.seed(2026);
    const now = new Date();

    const districts = [];
    const usedSlugs = new Set();

    const randomCities = Array.from({ length: 3 }, () => faker.location.city());

    for (let i = 1; i <= 60; i++) {
      const city = faker.helpers.arrayElement(randomCities);

      let title;
      let slug;

      do {
        const areaType = faker.helpers.arrayElement(['район', 'округ', 'микрорайон']);
        const areaName = faker.location.direction({ abbreviated: false });

        title = `${areaName} ${areaType} ${i}`;

        slug = faker.helpers.slugify(title).toLowerCase();
      } while (usedSlugs.has(slug));

      usedSlugs.add(slug);

      districts.push({
        title: title,
        slug: slug,
        city: city,
        createdAt: now,
        updatedAt: now
      });
    }
    await queryInterface.bulkInsert('Districts', districts, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Districts', null, {});
  },
};