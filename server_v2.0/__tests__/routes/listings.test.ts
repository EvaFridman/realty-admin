import request from "supertest";
import app from "../../src/app";
import * as listingsRepo from "../../src/repositories/listingsRepository";
import * as listingsPhotoRepo from "../../src/repositories/listingPhotosRepository";
import { authHeader } from "../helpers/auth";
import type { AuthUser } from "../../database/models/user";
import type { Listing } from "../../database/models/listing";

jest.mock("../../src/repositories/listingsRepository");
jest.mock("../../src/repositories/listingPhotosRepository");

jest.mock("../../src/services/mailService", () => ({
    sendNewViewingNotice: jest.fn(),
    sendViewingConfirmation: jest.fn(),
}));

jest.mock("../../src/services/imagesService", () => ({
    deletePhysicalFile: jest.fn(),
    buildImageUrl: jest.fn().mockReturnValue("http://test.local"),
}));

const mockedListingsRepo = jest.mocked(listingsRepo);
const mockedListingsPhotoRepo = jest.mocked(listingsPhotoRepo);

const agent: AuthUser = {
    id: 1,
    role: "agent",
} as AuthUser;

const moderator: AuthUser = {
    id: 2,
    role: "moderator",
} as AuthUser;

const otherAgent: AuthUser = {
    id: 99,
    role: "agent",
} as AuthUser;

describe("Listings API (with mocked repo)", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("auth guards", () => {
        it("GET /listings without token → 401", async () => {
            await request(app)
                .get("/listings")
                .expect(401);
        });

        it("POST /listings without token → 401", async () => {
            await request(app)
                .post("/listings")
                .send({})
                .expect(401);
        });

        it("PATCH /listings/:id/status as agent → 403", async () => {
            await request(app)
                .patch("/listings/1/status")
                .set(authHeader(agent))
                .send({ status: "published" })
                .expect(403);
        });
    });

    describe("POST /listings", () => {
        const validPayload = {
            districtId: 1,
            title: "Test Listing",
            dealType: "sale" as const,
            propertyType: "flat" as const,
            price: 100000,
            area: 50,
            address: "Test St",
            lat: 55.75,
            lng: 37.62,
        };

        it("should create listing and return 201 with data", async () => {
            const created = {
                id: 1,
                agentId: agent.id,
                ...validPayload,
            } as Listing;

            mockedListingsRepo.createListing.mockResolvedValue(created);

            const res = await request(app)
                .post("/listings")
                .set(authHeader(agent))
                .send(validPayload)
                .expect(201);

            expect(res.body).toHaveProperty("data");
            expect(res.body.data.id).toBe(1);

            expect(mockedListingsRepo.createListing).toHaveBeenCalledWith(
                expect.objectContaining({
                    ...validPayload,
                    agentId: agent.id,
                })
            );
        });

        it("should return 422 for invalid body and not call service", async () => {
            const res = await request(app)
                .post("/listings")
                .set(authHeader(agent))
                .send({ title: "" })
                .expect(422);

            expect(res.body.error).toBeDefined();
            expect(mockedListingsRepo.createListing).not.toHaveBeenCalled();
        });
    });

    describe("GET /listings/:id", () => {
        it("should return listing if owner", async () => {
            const listing = {
                id: 1,
                title: "Test",
                agentId: agent.id,
                toJSON() {
                    return this;
                },
            } as Listing;

            mockedListingsRepo.findListingById.mockResolvedValue(listing);

            const res = await request(app)
                .get("/listings/1")
                .set(authHeader(agent))
                .expect(200);

            expect(res.body.data.id).toBe(1);

            expect(
                mockedListingsRepo.findListingById
            ).toHaveBeenCalledWith(1);
        });

        it("should return 403 if not owner and not moderator", async () => {
            const listing = {
                id: 1,
                title: "Test",
                agentId: otherAgent.id,
                toJSON() {
                    return this;
                },
            } as Listing;

            mockedListingsRepo.findListingById.mockResolvedValue(listing);

            await request(app)
                .get("/listings/1")
                .set(authHeader(agent))
                .expect(403);
        });

        it("should return 404 if not found", async () => {
            mockedListingsRepo.findListingById.mockResolvedValue(null);

            const res = await request(app)
                .get("/listings/999")
                .set(authHeader(agent))
                .expect(404);

            expect(res.body.error).toBeDefined();

            expect(
                mockedListingsRepo.findListingById
            ).toHaveBeenCalledWith(999);
        });
    });

    describe("PUT /listings/:id", () => {
        it("should update own listing and return 200", async () => {
            const existing = {
                id: 1,
                title: "Old",
                agentId: agent.id,
            } as Listing;

            const updated = {
                ...existing,
                title: "New",
            } as Listing;

            mockedListingsRepo.findListingById.mockResolvedValue(existing);
            mockedListingsRepo.updateListing.mockResolvedValue(updated);

            const res = await request(app)
                .put("/listings/1")
                .set(authHeader(agent))
                .send({ title: "New" })
                .expect(200);

            expect(res.body.data.title).toBe("New");

            expect(
                mockedListingsRepo.updateListing
            ).toHaveBeenCalledWith(1, {
                title: "New",
            });
        });

        it("should return 403 when agent tries to update foreign listing", async () => {
            const existing = {
                id: 1,
                title: "Old",
                agentId: otherAgent.id,
            } as Listing;

            mockedListingsRepo.findListingById.mockResolvedValue(existing);

            await request(app)
                .put("/listings/1")
                .set(authHeader(agent))
                .send({ title: "New" })
                .expect(403);
        });

        it("should return 404 for non-existent before ownership check", async () => {
            mockedListingsRepo.findListingById.mockResolvedValue(null);

            await request(app)
                .put("/listings/999")
                .set(authHeader(agent))
                .send({ title: "New" })
                .expect(404);
        });

        it("should return 422 for invalid update data and not call service", async () => {
            const res = await request(app)
                .put("/listings/1")
                .set(authHeader(agent))
                .send({ price: -100 })
                .expect(422);

            expect(res.body.error).toBeDefined();
            expect(
                mockedListingsRepo.updateListing
            ).not.toHaveBeenCalled();
        });
    });

    describe("PATCH /listings/:id/status", () => {
        it("should change status as moderator and return 200", async () => {
            const listing = {
                id: 1,
                status: "moderation",
                photos: [{ isCover: true }],
                price: 1000,
                districtId: 1,
                lat: 55,
                lng: 37,
            } as Listing;

            const updated = {
                ...listing,
                status: "published",
            } as Listing;

            mockedListingsRepo.findListingById.mockResolvedValue(listing);
            mockedListingsRepo.updateListingStatus.mockResolvedValue(updated);

            const res = await request(app)
                .patch("/listings/1/status")
                .set(authHeader(moderator))
                .send({ status: "published" })
                .expect(200);

            expect(res.body.data.status).toBe("published");

            expect(
                mockedListingsRepo.updateListingStatus
            ).toHaveBeenCalledWith(
                1,
                "published",
                null
            );
        });

        it("should return 422 for invalid status and not call service", async () => {
            const res = await request(app)
                .patch("/listings/1/status")
                .set(authHeader(moderator))
                .send({ status: "invalid" })
                .expect(422);

            expect(res.body.error).toBeDefined();

            expect(
                mockedListingsRepo.updateListingStatus
            ).not.toHaveBeenCalled();
        });
    });

    describe("DELETE /listings/:id", () => {
        it("should delete own listing and return 204", async () => {
            mockedListingsRepo.findListingById.mockResolvedValue({
                id: 1,
                agentId: agent.id,
            } as Listing);
        
            mockedListingsPhotoRepo.findPhotosByListingId.mockResolvedValue([]);
        
            mockedListingsRepo.deleteListing.mockResolvedValue(1);
        
            await request(app)
                .delete("/listings/1")
                .set(authHeader(agent))
                .expect(204);
        
            expect(
                mockedListingsRepo.deleteListing
            ).toHaveBeenCalledWith(1);
        });

        it("should return 403 when agent tries to delete foreign listing", async () => {
            mockedListingsRepo.findListingById.mockResolvedValue({
                id: 1,
                agentId: otherAgent.id,
            } as Listing);

            await request(app)
                .delete("/listings/1")
                .set(authHeader(agent))
                .expect(403);
        });

        it("should return 404 if not found", async () => {
            mockedListingsRepo.findListingById.mockResolvedValue(null);

            await request(app)
                .delete("/listings/999")
                .set(authHeader(agent))
                .expect(404);

            expect(
                mockedListingsRepo.deleteListing
            ).not.toHaveBeenCalled();
        });
    });
});