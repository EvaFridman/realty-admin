import type { Logger } from "pino";
import type { AuthUser } from "../../database/models/user";
import type { Listing } from "../../database/models/listing";
import type { Viewing } from "../../database/models/viewing";

import * as viewingsService from "../../src/services/viewingsService";
import * as viewingsRepo from "../../src/repositories/viewingsRepository";
import * as listingsRepo from "../../src/repositories/listingsRepository";
import * as mailService from "../../src/services/mailService";

import {
    NotFoundError,
    ConflictError,
} from "../../src/errors/AppError";

jest.mock("../../src/repositories/viewingsRepository");
jest.mock("../../src/repositories/listingsRepository");
jest.mock("../../src/services/mailService");

const mockedViewingsRepo = jest.mocked(viewingsRepo);
const mockedListingsRepo = jest.mocked(listingsRepo);
const mockedMailService = jest.mocked(mailService);

const agent: AuthUser = {
    id: 1,
    role: "agent",
};

const moderator: AuthUser = {
    id: 2,
    role: "moderator",
};

const createLogger = (): Logger =>
    ({
        info: jest.fn(),
        warn: jest.fn(),
        error: jest.fn(),
    }) as unknown as Logger;

describe("viewingsService", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("listAllViewings", () => {
        it("считает totalPages и добавляет allowedTransitions к каждой заявке", async () => {
            const viewing = {
                id: 1,
                status: "created",
                toJSON: () => ({
                    id: 1,
                    status: "created",
                }),
            };

            mockedViewingsRepo.findAndCountViewings.mockResolvedValue({
                rows: [viewing as Viewing],
                count: 25,
            });

            const result = await viewingsService.listAllViewings({
                page: 1,
                limit: 20,
                status: undefined,
                sortOrder: "desc",
            });

            expect(result.meta.totalPages).toBe(2);
            expect(result.data[0]?.allowedTransitions).toBeDefined();
        });

        it("передаёт фильтр по статусу в репозиторий", async () => {
            mockedViewingsRepo.findAndCountViewings.mockResolvedValue({
                rows: [],
                count: 0,
            });

            await viewingsService.listAllViewings({
                page: 1,
                limit: 20,
                status: "created",
                sortOrder: "desc",
            });

            expect(
                mockedViewingsRepo.findAndCountViewings
            ).toHaveBeenCalledWith(
                expect.objectContaining({
                    status: "created",
                })
            );
        });
    });

    describe("listViewings", () => {
        it("should return viewings for listing if listing exists", async () => {
            const listing = {
                id: 1,
                agentId: 1,
            } as Listing;

            const viewing = {
                id: 1,
                toJSON: () => ({
                    id: 1,
                }),
            } as Viewing;

            mockedListingsRepo.findListingById.mockResolvedValue(listing);

            mockedViewingsRepo.findViewingsByListingId.mockResolvedValue([
                viewing,
            ]);

            const result = await viewingsService.listViewings(
                moderator,
                1
            );

            expect(result).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        id: 1,
                    }),
                ])
            );

            expect(
                mockedListingsRepo.findListingById
            ).toHaveBeenCalledWith(1);

            expect(
                mockedViewingsRepo.findViewingsByListingId
            ).toHaveBeenCalledWith(1);
        });

        it("should throw NotFoundError if listing does not exist", async () => {
            mockedListingsRepo.findListingById.mockResolvedValue(null);

            await expect(
                viewingsService.listViewings(agent, 1)
            ).rejects.toThrow(NotFoundError);
        });
    });

    describe("createViewing", () => {
        const listing = {
            id: 1,
            status: "published",
            agent: {
                email: "agent@test.com",
            },
        } as Listing;

        const data = {
            clientName: "John",
            clientEmail: "john@test.com",
            clientPhone: "+1234567890",
            preferredAt: new Date(),
        };

        const viewing = {
            id: 1,
            ...data,
        } as Viewing;

        it("should create viewing if listing is published", async () => {
            mockedListingsRepo.findListingById.mockResolvedValue(listing);

            mockedViewingsRepo.createViewing.mockResolvedValue(viewing);

            mockedViewingsRepo.markNotified.mockResolvedValue(
                undefined
            );

            const result = await viewingsService.createViewing(
                1,
                data,
                createLogger()
            );

            expect(result).toEqual(viewing);

            expect(
                mockedViewingsRepo.createViewing
            ).toHaveBeenCalledWith(1, data);

            expect(
                mockedMailService.sendNewViewingNotice
            ).toHaveBeenCalledWith(listing, viewing);

            expect(
                mockedViewingsRepo.markNotified
            ).toHaveBeenCalledWith(viewing.id);
        });

        it("should throw NotFoundError if listing not found", async () => {
            mockedListingsRepo.findListingById.mockResolvedValue(null);

            await expect(
                viewingsService.createViewing(
                    1,
                    data,
                    createLogger()
                )
            ).rejects.toThrow(NotFoundError);
        });

        it("should throw ConflictError if listing is not published", async () => {
            const draftListing = {
                ...listing,
                status: "draft",
            } as Listing;

            mockedListingsRepo.findListingById.mockResolvedValue(
                draftListing
            );

            await expect(
                viewingsService.createViewing(
                    1,
                    data,
                    createLogger()
                )
            ).rejects.toThrow(ConflictError);
        });

        it("should log error but not throw if mail service fails", async () => {
            mockedListingsRepo.findListingById.mockResolvedValue(listing);

            mockedViewingsRepo.createViewing.mockResolvedValue(viewing);

            mockedMailService.sendNewViewingNotice.mockRejectedValue(
                new Error("Mail error")
            );

            const log = createLogger();

            const result = await viewingsService.createViewing(
                1,
                data,
                log
            );

            expect(result).toEqual(viewing);
            expect(log.error).toHaveBeenCalled();

            expect(
                mockedViewingsRepo.markNotified
            ).not.toHaveBeenCalled();
        });
    });

    describe("changeStatus", () => {
        const viewing = {
            id: 1,
            status: "pending approval",
            listing: {
                id: 1,
                title: "Test",
            },
            clientEmail: "client@test.com",
            preferredAt: new Date(),
        } as Viewing;

        const updated = {
            ...viewing,
            status: "approved",
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

        it("should throw NotFoundError if viewing not found", async () => {
            mockedViewingsRepo.findViewingById.mockResolvedValue(null);

            await expect(
                viewingsService.changeStatus(
                    1,
                    "approved",
                    createLogger()
                )
            ).rejects.toThrow(NotFoundError);
        });

        it("should throw ConflictError on a forbidden transition and log a warning", async () => {
            const closedViewing = {
                ...viewing,
                status: "closed",
            } as Viewing;

            mockedViewingsRepo.findViewingById.mockResolvedValue(
                closedViewing
            );

            const log = createLogger();

            await expect(
                viewingsService.changeStatus(
                    1,
                    "approved",
                    log
                )
            ).rejects.toThrow(ConflictError);

            expect(
                mockedViewingsRepo.updateViewingStatus
            ).not.toHaveBeenCalled();

            expect(log.warn).toHaveBeenCalled();
        });

        it("should update status and send confirmation if status is approved", async () => {
            mockedViewingsRepo.findViewingById.mockResolvedValue(viewing);

            mockedViewingsRepo.updateViewingStatus.mockResolvedValue(
                updated
            );

            const result = await viewingsService.changeStatus(
                1,
                "approved",
                createLogger()
            );

            expect(result).toEqual(
                expect.objectContaining({
                    ...updated.toJSON(),
                    allowedTransitions: expect.any(Array),
                })
            );

            expect(
                mockedViewingsRepo.updateViewingStatus
            ).toHaveBeenCalledWith(1, {
                status: "approved",
            });

            expect(
                mockedMailService.sendViewingConfirmation
            ).toHaveBeenCalledWith(
                viewing.listing,
                updated
            );
        });

        it("should update status without sending confirmation if status not approved", async () => {
            mockedViewingsRepo.findViewingById.mockResolvedValue(viewing);

            mockedViewingsRepo.updateViewingStatus.mockResolvedValue({
                ...updated,
                status: "rejected",
            } as Viewing);

            const result = await viewingsService.changeStatus(
                1,
                "rejected",
                createLogger()
            );

            expect(result).toEqual(
                expect.objectContaining({
                    status: "rejected",
                    allowedTransitions: expect.any(Array),
                })
            );

            expect(
                mockedMailService.sendViewingConfirmation
            ).not.toHaveBeenCalled();
        });

        it("should log error but not throw if confirmation mail fails", async () => {
            mockedViewingsRepo.findViewingById.mockResolvedValue(viewing);

            mockedViewingsRepo.updateViewingStatus.mockResolvedValue(
                updated
            );

            mockedMailService.sendViewingConfirmation.mockRejectedValue(
                new Error("Mail error")
            );

            const log = createLogger();

            const result = await viewingsService.changeStatus(
                1,
                "approved",
                log
            );

            expect(result).toEqual(
                expect.objectContaining({
                    ...updated.toJSON(),
                    allowedTransitions: expect.any(Array),
                })
            );

            expect(log.error).toHaveBeenCalled();
        });
    });
});