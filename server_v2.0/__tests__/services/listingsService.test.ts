import { jest } from "@jest/globals";
import type { AuthUser } from "../../src/../database/models/user";
import type { Listing } from "../../src/../database/models/listing";
import type { ListingsListQuery } from "../../src/schemas/listingsSchema";

import * as listingsService from "../../src/services/listingsService";
import * as listingsRepo from "../../src/repositories/listingsRepository";
import * as listingsPhotoRepo from "../../src/repositories/listingPhotosRepository";
import * as listingStatusTransitions from "../../src/utils/listingStatusTransitions";

import {
    NotFoundError,
    ForbiddenError,
} from "../../src/errors/AppError";

jest.mock("../../src/repositories/listingsRepository");
jest.mock("../../src/repositories/listingPhotosRepository");
jest.mock("../../src/utils/listingStatusTransitions");

jest.mock("../../src/services/imagesService", () => ({
    deletePhysicalFile: jest
        .fn<() => Promise<void>>()
        .mockResolvedValue(undefined),
}));

const mockedListingsRepo = jest.mocked(listingsRepo);
const mockedListingsPhotoRepo = jest.mocked(listingsPhotoRepo);
const mockedStatusTransitions = jest.mocked(listingStatusTransitions);

const agent: AuthUser = {
    id: 1,
    role: "agent",
};

const moderator: AuthUser = {
    id: 2,
    role: "moderator",
};

describe("listingsService", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("listListings", () => {
        it("should return paginated listings with meta for moderator", async () => {
            const rawQuery: ListingsListQuery = {
                page: 2,
                limit: 10,
                sortBy: "price",
                sortOrder: "asc",
            };

            const rows = [
                { id: 1 },
                { id: 2 },
            ] as Listing[];

            mockedListingsRepo.findAndCountListings.mockResolvedValue({
                rows,
                count: 2,
            });

            const result = await listingsService.listListings(
                moderator,
                rawQuery
            );

            expect(result.data).toEqual(rows);

            expect(result.meta).toEqual({
                page: 2,
                limit: 10,
                total: 2,
                totalPages: 1,
            });

            expect(
                mockedListingsRepo.findAndCountListings
            ).toHaveBeenCalledWith(
                expect.objectContaining({
                    page: 2,
                    limit: 10,
                    sortBy: "price",
                    sortOrder: "asc",
                })
            );

            expect(
                mockedListingsRepo.findAndCountListings.mock.calls[0]?.[0]
                    .agentId
            ).toBeUndefined();
        });

        it("should filter by agentId for agent role", async () => {
            const rawQuery: ListingsListQuery = {
                page: 1,
                limit: 20,
                sortBy: "createdAt",
                sortOrder: "desc",
            };

            mockedListingsRepo.findAndCountListings.mockResolvedValue({
                rows: [],
                count: 0,
            });

            await listingsService.listListings(agent, rawQuery);

            expect(
                mockedListingsRepo.findAndCountListings
            ).toHaveBeenCalledWith(
                expect.objectContaining({
                    agentId: agent.id,
                })
            );
        });
    });

    describe("getListingById", () => {
        it("should return listing if owner", async () => {
            const listing = {
                id: 1,
                title: "Test",
                agentId: agent.id,
                status: "draft",
                toJSON() {
                    return {
                        id: this.id,
                        title: this.title,
                        agentId: this.agentId,
                        status: this.status,
                    };
                },
            } as Listing;

            mockedListingsRepo.findListingById.mockResolvedValue(listing);

            mockedStatusTransitions.getAllowedTransitions.mockReturnValue([
                "moderation",
            ]);

            const result = await listingsService.getListingById(agent, 1);

            expect(result).toEqual({
                id: 1,
                title: "Test",
                agentId: agent.id,
                status: "draft",
                allowedTransitions: ["moderation"],
            });

            expect(
                mockedListingsRepo.findListingById
            ).toHaveBeenCalledWith(1);

            expect(
                mockedStatusTransitions.getAllowedTransitions
            ).toHaveBeenCalledWith("draft");
        });

        it("should throw ForbiddenError if not owner and not moderator", async () => {
            const listing = {
                id: 1,
                agentId: 99,
                status: "draft",
                toJSON() {
                    return this;
                },
            } as Listing;

            mockedListingsRepo.findListingById.mockResolvedValue(listing);

            await expect(
                listingsService.getListingById(agent, 1)
            ).rejects.toThrow(ForbiddenError);
        });

        it("should throw NotFoundError if not found", async () => {
            mockedListingsRepo.findListingById.mockResolvedValue(null);

            await expect(
                listingsService.getListingById(agent, 999)
            ).rejects.toThrow(NotFoundError);
        });
    });

    describe("createListing", () => {
        it("should call repo.createListing with agentId from user", async () => {
            const data = {
                title: "New",
                districtId: 1,
            } as Parameters<
                typeof listingsService.createListing
            >[1];

            const created = {
                id: 1,
                ...data,
                agentId: agent.id,
            } as Listing;

            mockedListingsRepo.createListing.mockResolvedValue(created);

            const result = await listingsService.createListing(agent, data);

            expect(result).toEqual(created);

            expect(
                mockedListingsRepo.createListing
            ).toHaveBeenCalledWith({
                ...data,
                agentId: agent.id,
            });
        });
    });

    describe("updateListing", () => {
        it("should update if owner", async () => {
            const existing = {
                id: 1,
                title: "Old",
                agentId: agent.id,
            } as Listing;

            const updateData = {
                title: "New",
            } as Parameters<
                typeof listingsService.updateListing
            >[2];

            const updated = {
                ...existing,
                ...updateData,
            } as Listing;

            mockedListingsRepo.findListingById.mockResolvedValue(existing);

            mockedListingsRepo.updateListing.mockResolvedValue(updated);

            const result = await listingsService.updateListing(
                agent,
                1,
                updateData
            );

            expect(result).toEqual(updated);

            expect(
                mockedListingsRepo.updateListing
            ).toHaveBeenCalledWith(1, updateData);
        });

        it("should throw ForbiddenError for foreign listing", async () => {
            const existing = {
                id: 1,
                agentId: 99,
            } as Listing;

            mockedListingsRepo.findListingById.mockResolvedValue(existing);

            await expect(
                listingsService.updateListing(agent, 1, {})
            ).rejects.toThrow(ForbiddenError);
        });

        it("should throw NotFoundError if listing does not exist", async () => {
            mockedListingsRepo.findListingById.mockResolvedValue(null);

            await expect(
                listingsService.updateListing(agent, 1, {})
            ).rejects.toThrow(NotFoundError);
        });
    });

    describe("deleteListing", () => {
        it("should delete if owner", async () => {
            const existing = {
                id: 1,
                agentId: agent.id,
            } as Listing;

            mockedListingsRepo.findListingById.mockResolvedValue(existing);

            mockedListingsPhotoRepo.findPhotosByListingId.mockResolvedValue(
                []
            );

            mockedListingsRepo.deleteListing.mockResolvedValue(1);

            await listingsService.deleteListing(agent, 1);

            expect(
                mockedListingsPhotoRepo.findPhotosByListingId
            ).toHaveBeenCalledWith(1);

            expect(
                mockedListingsRepo.deleteListing
            ).toHaveBeenCalledWith(1);
        });

        it("should throw ForbiddenError for foreign listing", async () => {
            mockedListingsRepo.findListingById.mockResolvedValue({
                id: 1,
                agentId: 99,
            } as Listing);

            await expect(
                listingsService.deleteListing(agent, 1)
            ).rejects.toThrow(ForbiddenError);
        });

        it("should throw NotFoundError if not exists", async () => {
            mockedListingsRepo.findListingById.mockResolvedValue(null);

            await expect(
                listingsService.deleteListing(agent, 1)
            ).rejects.toThrow(NotFoundError);
        });
    });
});