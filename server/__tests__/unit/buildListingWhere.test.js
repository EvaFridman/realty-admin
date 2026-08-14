const buildListingWhere = require('../../src/services/pure/buildListingWhere');
const { Op } = require('sequelize');

describe('buildListingWhere', () => {
    it('builds where clause from filters', () => {
        const filters = {
            dealType: 'sale',
            propertyType: 'flat',
            districtId: 5,
            status: 'published',
            priceMin: 1000,
            priceMax: 5000,
            areaMin: 30,
            areaMax: 100,
            rooms: [1, 2, 3],
            search: 'квартира',
            latMin: 55.0,
            latMax: 56.0,
            lngMin: 37.0,
            lngMax: 38.0,
        };
        const where = buildListingWhere(filters);
        expect(where).toEqual({
            dealType: 'sale',
            propertyType: 'flat',
            districtId: 5,
            status: 'published',
            price: {
                [Op.gte]: 1000,
                [Op.lte]: 5000
            },
            area: {
                [Op.gte]: 30,
                [Op.lte]: 100
            },
            rooms: { [Op.in]: [1, 2, 3] },
            [Op.or]: [
                { title: { [Op.iLike]: '%квартира%' } },
                { address: { [Op.iLike]: '%квартира%' } },
            ],
            lat: { [Op.between]: [55.0, 56.0] },
            lng: { [Op.between]: [37.0, 38.0] },
        });
    });

    it('handles partial filters', () => {
        const filters = { priceMin: 1000, status: 'draft' };
        const where = buildListingWhere(filters);
        expect(where).toEqual({
            status: 'draft',
            price: { [Op.gte]: 1000 },
        });
    });

    it('returns empty object if no filters', () => {
        expect(buildListingWhere({})).toEqual({});
    });
});