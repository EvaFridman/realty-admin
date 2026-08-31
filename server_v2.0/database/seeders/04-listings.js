'use strict';

const { faker } = require('@faker-js/faker/locale/ru');

module.exports = {
  async up(queryInterface, Sequelize) {
    faker.seed(2026);
    const now = new Date();

    const agents = await queryInterface.sequelize.query(
      `SELECT id FROM "Users" WHERE role = 'agent';`,
      { type: Sequelize.QueryTypes.SELECT }
    );
    
    const districts = await queryInterface.sequelize.query(
      `SELECT id, city FROM "Districts";`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (agents.length === 0 || districts.length === 0) {
      throw new Error("Seed relation error: Please seed Users (agents) and Districts before seeding Listings");
    }

    const uniqueCitiesInDb = [...new Set(districts.map(d => d.city))];

    const cityBounds = {};
    
    const defaultBounds = [
      { latMin: 55.550000, latMax: 55.950000, lngMin: 37.350000, lngMax: 37.850000 },
      { latMin: 59.750000, latMax: 60.150000, lngMin: 29.900000, lngMax: 30.600000 },
      { latMin: 56.150000, latMax: 56.400000, lngMin: 43.700000, lngMax: 44.100000 },
    ];

    uniqueCitiesInDb.forEach((cityName, index) => {
      cityBounds[cityName] = defaultBounds[index] || defaultBounds[0];
    });

    const listings = [];
    const totalListings = 6000;

    const megaAgentId = agents[0].id;
    const activeAgents = agents.slice(1).filter(() => faker.datatype.boolean({ probability: 0.7 }));

    for (let i = 1; i <= totalListings; i++) {
      let agentId;
      if (i <= 50) {
        agentId = megaAgentId;
      } else {
        agentId = faker.helpers.arrayElement(activeAgents.length ? activeAgents : agents).id;
      }

      const randomDistrict = faker.helpers.arrayElement(districts);
      const districtId = randomDistrict.id;
      
      const bounds = cityBounds[randomDistrict.city];

      const dealType = faker.helpers.arrayElement(['sale', 'rent']);
      const propertyType = faker.helpers.arrayElement(['flat', 'house', 'room', 'commercial']);
      
      const totalFloors = propertyType === 'house' ? faker.number.int({ min: 1, max: 3 }) : faker.number.int({ min: 5, max: 25 });
      const floor = propertyType === 'house' ? faker.number.int({ min: 1, max: totalFloors }) : faker.number.int({ min: 1, max: totalFloors });

      const status = faker.helpers.arrayElement(['draft', 'moderation', 'published', 'rejected', 'unpublished']);
      const isRejected = status === 'rejected';
      const isPublished = status === 'published';

      listings.push({
        agentId,
        districtId,
        title: `${dealType === 'sale' ? 'Продажа' : 'Аренда'} ${faker.number.int({ min: 20, max: 150 })}м²`,
        description: faker.lorem.paragraph(),
        dealType,
        propertyType,
        price: dealType === 'sale' ? faker.number.float({ min: 3000000, max: 25000000, multipleOf: 10000 }) : faker.number.float({ min: 20000, max: 150000, multipleOf: 1000 }),
        area: faker.number.float({ min: 15, max: 200, multipleOf: 0.1 }),
        rooms: propertyType === 'commercial' ? null : faker.number.int({ min: 1, max: 5 }),
        floor: propertyType === 'commercial' ? null : floor,
        totalFloors,
        address: faker.location.streetAddress(),
        lat: faker.number.float({ min: bounds.latMin, max: bounds.latMax, multipleOf: 0.000001 }),
        lng: faker.number.float({ min: bounds.lngMin, max: bounds.lngMax, multipleOf: 0.000001 }),
        status,
        rejectionReason: isRejected ? faker.helpers.arrayElement(['Некорректное фото', 'Цена занижена', 'Дубликат']) : null,
        publishedAt: isPublished ? faker.date.past({ years: 1 }) : null,
        createdAt: now,
        updatedAt: now
      });
    }

    await queryInterface.bulkInsert('Listings', listings, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Listings', null, {});
  }
};