import { parseListingFilters } from "../../src/utils/parseListingFilters";
import type { ListingsListQuery } from "../../src/schemas/listingsSchema";

describe("parseListingFilters", () => {
    it("returns filters and trims search", () => {
        const query: ListingsListQuery = {
            dealType: "sale",
            propertyType: "flat",
            districtId: 5,
            status: "published",
            priceMin: 1000,
            priceMax: 5000,
            areaMin: 30,
            areaMax: 100,
            rooms: [1, 2, 3],
            search: "  квартира  ",
            latMin: 55,
            latMax: 56,
            lngMin: 37,
            lngMax: 38,
            sortBy: "price",
            sortOrder: "asc",
            page: 2,
            limit: 10,
        };

        const result = parseListingFilters(query);

        expect(result).toEqual({
            ...query,
            search: "квартира",
        });
    });

    it("keeps search undefined when it is missing", () => {
        const query: ListingsListQuery = {
            sortBy: "createdAt",
            sortOrder: "desc",
            page: 1,
            limit: 20,
        };
    
        const result = parseListingFilters(query);
    
        expect(result.search).toBeUndefined();
    });
});