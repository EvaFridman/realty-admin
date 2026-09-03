import { Op } from "sequelize";
import type { ListingFilters } from "../../src/utils/parseListingFilters";
import { buildListingFilter } from "../../src/utils/buildListingFilter";

type Filter = Omit<ListingFilters, "sortBy" | "sortOrder" | "page" | "limit">;

describe("buildListingFilter", () => {
    it("builds where clause from filters", () => {
        const filters: Filter = {
            dealType: "sale",
            propertyType: "flat",
            districtId: 5,
            status: "published",
            priceMin: 1000,
            priceMax: 5000,
            areaMin: 30,
            areaMax: 100,
            rooms: [1, 2, 3],
            search: "квартира",
            latMin: 55.0,
            latMax: 56.0,
            lngMin: 37.0,
            lngMax: 38.0,
        };

        const where = buildListingFilter(filters);

        expect(where).toEqual({
            dealType: "sale",
            propertyType: "flat",
            districtId: 5,
            status: "published",
            price: {
                [Op.gte]: 1000,
                [Op.lte]: 5000,
            },
            area: {
                [Op.gte]: 30,
                [Op.lte]: 100,
            },
            rooms: { [Op.in]: [1, 2, 3] },
            [Op.or]: [
                { title: { [Op.iLike]: "%квартира%" } },
                { address: { [Op.iLike]: "%квартира%" } },
            ],
            lat: { [Op.between]: [55.0, 56.0] },
            lng: { [Op.between]: [37.0, 38.0] },
        });
    });

    it("handles partial filters", () => {
        const filters: Filter = {
            priceMin: 1000,
            status: "draft",
        };

        const where = buildListingFilter(filters);

        expect(where).toEqual({
            status: "draft",
            price: { [Op.gte]: 1000 },
        });
    });

    it("returns empty object if no filters", () => {
        const filters: Filter = {};
        expect(buildListingFilter(filters)).toEqual({});
    });
});