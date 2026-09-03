import request from "supertest";
import app from "../../src/app";
import * as listingsRepo from "../../src/repositories/listingsRepository";
import * as viewingsRepo from "../../src/repositories/viewingsRepository";
import { authHeader } from "../helpers/auth";
import type { AuthUser } from "../../database/models/user";
import type { Listing } from "../../database/models/listing";
import type { Viewing } from "../../database/models/viewing";

jest.mock("../../src/services/mailService", () => ({
    sendNewViewingNotice: jest.fn(),
    sendViewingConfirmation: jest.fn(),
}));

jest.mock("../../src/repositories/listingsRepository");
jest.mock("../../src/repositories/viewingsRepository");

const mockedListingsRepo = jest.mocked(listingsRepo);
const mockedViewingsRepo = jest.mocked(viewingsRepo);

const moderator: AuthUser = {
    id: 2,
    role: "moderator",
} as AuthUser;

const agent: AuthUser = {
    id: 1,
    role: "agent",
} as AuthUser;

describe("Viewings API (with mocked repos)", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("POST /listings/:listingId/viewings (open)", () => {
        const validPayload = {
            clientName: "John",
            clientPhone: "+1234567890",
            clientEmail: "john@test.com",
            preferredAt: new Date().toISOString(),
        };

        it("should create viewing for published listing", async () => {
            const listing = {
                id: 1,
                status: "published",
                title: "Flat",
                agent: {
                    email: "agent@test.com",
                },
            } as Listing;

            const viewing = {
                id: 1,
                ...validPayload,
            } as unknown as Viewing;

            mockedListingsRepo.findListingById.mockResolvedValue(listing);
            mockedViewingsRepo.createViewing.mockResolvedValue(viewing);
            mockedViewingsRepo.markNotified.mockResolvedValue(
                undefined as never
            );

            const res = await request(app)
                .post("/listings/1/viewings")
                .send(validPayload)
                .expect(201);

            expect(res.body.data.id).toBe(1);

            expect(
                mockedViewingsRepo.createViewing
            ).toHaveBeenCalledWith(
                1,
                expect.objectContaining({
                    clientName: "John",
                    clientPhone: "+1234567890",
                    clientEmail: "john@test.com",
                    preferredAt: expect.any(Date),
                })
            );
        });

        it("should return 409 if listing is not published", async () => {
            mockedListingsRepo.findListingById.mockResolvedValue({
                id: 1,
                status: "draft",
            } as Listing);

            const res = await request(app)
                .post("/listings/1/viewings")
                .send(validPayload)
                .expect(409);

            expect(res.body.error).toBeDefined();
            expect(
                mockedViewingsRepo.createViewing
            ).not.toHaveBeenCalled();
        });

        it("should return 422 for invalid body and not call service", async () => {
            await request(app)
                .post("/listings/1/viewings")
                .send({ clientName: "" })
                .expect(422);

            expect(
                mockedViewingsRepo.createViewing
            ).not.toHaveBeenCalled();
        });
    });

    describe("PATCH /viewings/:id/status", () => {
        it("returns 401 without token", async () => {
            await request(app)
                .patch("/viewings/1/status")
                .send({ status: "approved" })
                .expect(401);
        });

        it("returns 403 for agent", async () => {
            await request(app)
                .patch("/viewings/1/status")
                .set(authHeader(agent))
                .send({ status: "approved" })
                .expect(403);
        });

        it("should change status as moderator", async () => {
            const viewing = {
                id: 1,
                status: "pending approval",
                clientEmail: "john@test.com",
                preferredAt: new Date(),
                listing: {
                    title: "Flat",
                },
            } as unknown as Viewing;

            const updated = {
                ...viewing,
                status: 'approved',
                toJSON() {
                    return {
                        id: this.id,
                        status: this.status,
                        clientEmail: this.clientEmail,
                        preferredAt: this.preferredAt,
                        listing: this.listing,
                    };
                },
            } as Viewing;

            mockedViewingsRepo.findViewingById.mockResolvedValue(viewing);
            mockedViewingsRepo.updateViewingStatus.mockResolvedValue(updated);

            const res = await request(app)
                .patch("/viewings/1/status")
                .set(authHeader(moderator))
                .send({ status: "approved" })
                .expect(200);

            expect(res.body.data.status).toBe("approved");

            expect(
                mockedViewingsRepo.updateViewingStatus
            ).toHaveBeenCalledWith(1, { status: "approved" });
        });

        it("should return 409 on a forbidden status transition", async () => {
            mockedViewingsRepo.findViewingById.mockResolvedValue({
                id: 1,
                status: "created",
            } as Viewing);

            const res = await request(app)
                .patch("/viewings/1/status")
                .set(authHeader(moderator))
                .send({ status: "approved" })
                .expect(409);

            expect(res.body.data).toBeNull();
            expect(res.body.error).not.toBeNull();

            expect(
                mockedViewingsRepo.updateViewingStatus
            ).not.toHaveBeenCalled();
        });

        it("should return 422 for invalid status and not call service", async () => {
            await request(app)
                .patch("/viewings/1/status")
                .set(authHeader(moderator))
                .send({ status: "invalid" })
                .expect(422);

            expect(
                mockedViewingsRepo.updateViewingStatus
            ).not.toHaveBeenCalled();
        });
    });
});