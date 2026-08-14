const parseListingFilters = require('../../src/services/pure/parseListingFilters');

describe('parseListingFilters', () => {
    it('parses all filters correctly', () => {
        const raw = {
            dealType: 'sale',
            propertyType: 'flat',
            districtId: '5',
            status: 'published',
            priceMin: '1000',
            priceMax: '5000',
            areaMin: '30',
            areaMax: '100',
            rooms: '1,2,3',
            search: 'квартира',
            latMin: '55.0',
            latMax: '56.0',
            lngMin: '37.0',
            lngMax: '38.0',
            sortBy: 'price',
            sortOrder: 'asc',
            page: '2',
            limit: '10',
        };
        const result = parseListingFilters(raw);
        expect(result).toEqual({
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
            sortBy: 'price',
            sortOrder: 'asc',
            page: 2,
            limit: 10,
        });
    });

    it('defaults missing fields', () => {
        const result = parseListingFilters({});
        expect(result).toEqual({
            sortBy: 'createdAt',
            sortOrder: 'desc',
            page: 1,
            limit: 20,
        });
    });

    it('ignores invalid values', () => {
        const raw = {
            districtId: 'invalid',
            priceMin: 'abc',
            rooms: 'not-numbers',
            page: '-1',
            limit: '200',
        };
        const result = parseListingFilters(raw);
        expect(result.districtId).toBeNaN();
        expect(result.priceMin).toBeNaN();
        expect(result.rooms).toEqual([NaN]);
        expect(result.page).toBe(1);
        expect(result.limit).toBe(100);
    });
});