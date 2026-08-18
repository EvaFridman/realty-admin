const listingsService = require('../../src/services/listingsService');
const listingsRepo = require('../../src/repositories/listingsRepository');
const { NotFoundError, ForbiddenError, ConflictError } = require('../../src/errors/AppError');
const { canTransition, getAllowedTransitions } = require('../../src/services/pure/listingStatusTransitions');

jest.mock('../../src/repositories/listingsRepository');
jest.mock('../../src/services/pure/listingStatusTransitions');

const agent = { id: 1, role: 'agent' };
const moderator = { id: 2, role: 'moderator' };

describe('listingsService', () => {
    beforeEach(() => jest.clearAllMocks());

    describe('listListings', () => {
        it('should return paginated listings with meta for moderator (no agent filter)', async () => {
            const rawQuery = { page: 2, limit: 10, sortBy: 'price', sortOrder: 'asc' };
            const rows = [{ id: 1 }, { id: 2 }];
            const count = 2;
            listingsRepo.findAndCountListings.mockResolvedValue({ rows, count });

            const result = await listingsService.listListings(moderator, rawQuery);

            expect(result.data).toEqual(rows);
            expect(result.meta).toEqual({
                page: 2,
                limit: 10,
                total: 2,
                totalPages: 1,
            });
            expect(listingsRepo.findAndCountListings).toHaveBeenCalledWith(
                expect.objectContaining({
                    page: 2,
                    limit: 10,
                    sortBy: 'price',
                    sortOrder: 'asc',
                })
            );
            expect(listingsRepo.findAndCountListings.mock.calls[0][0].agentId).toBeUndefined();
        });

        it('should filter by agentId for agent role', async () => {
            listingsRepo.findAndCountListings.mockResolvedValue({ rows: [], count: 0 });
            await listingsService.listListings(agent, { page: 1, limit: 20 });
            expect(listingsRepo.findAndCountListings).toHaveBeenCalledWith(
                expect.objectContaining({ agentId: agent.id })
            );
        });
    });

    describe('getListingById', () => {
        it('should return listing if owner', async () => {
            const listing = {
                id: 1,
                title: 'Test',
                agentId: agent.id,
                status: 'draft',
                toJSON() { return { id: this.id, title: this.title, agentId: this.agentId, status: this.status }; },
            };
            listingsRepo.findListingById.mockResolvedValue(listing);
            getAllowedTransitions.mockReturnValue(['moderation']);

            const result = await listingsService.getListingById(agent, 1);
            expect(result.id).toBe(1);
            expect(listingsRepo.findListingById).toHaveBeenCalledWith(1);
        });

        it('should throw ForbiddenError if not owner and not moderator', async () => {
            const listing = {
                id: 1,
                agentId: 99,
                toJSON() { return this; },
            };
            listingsRepo.findListingById.mockResolvedValue(listing);
            await expect(listingsService.getListingById(agent, 1)).rejects.toThrow(ForbiddenError);
        });

        it('should throw NotFoundError if not found', async () => {
            listingsRepo.findListingById.mockResolvedValue(null);
            await expect(listingsService.getListingById(agent, 999)).rejects.toThrow(NotFoundError);
        });
    });

    describe('createListing', () => {
        it('should call repo.createListing with agentId from user', async () => {
            const data = { title: 'New', districtId: 1 };
            const created = { id: 1, ...data, agentId: agent.id };
            listingsRepo.createListing.mockResolvedValue(created);

            const result = await listingsService.createListing(agent, data);
            expect(result).toEqual(created);
            expect(listingsRepo.createListing).toHaveBeenCalledWith({ ...data, agentId: agent.id });
        });
    });

    describe('updateListing', () => {
        it('should update if owner', async () => {
            const existing = { id: 1, title: 'Old', agentId: agent.id };
            const updateData = { title: 'New' };
            const updated = { ...existing, ...updateData };
            listingsRepo.findListingById.mockResolvedValue(existing);
            listingsRepo.updateListing.mockResolvedValue(updated);

            const result = await listingsService.updateListing(agent, 1, updateData);
            expect(result).toEqual(updated);
            expect(listingsRepo.updateListing).toHaveBeenCalledWith(1, updateData);
        });

        it('should throw ForbiddenError for foreign listing', async () => {
            const existing = { id: 1, agentId: 99 };
            listingsRepo.findListingById.mockResolvedValue(existing);
            await expect(listingsService.updateListing(agent, 1, {})).rejects.toThrow(ForbiddenError);
        });

        it('should throw NotFoundError if listing does not exist', async () => {
            listingsRepo.findListingById.mockResolvedValue(null);
            await expect(listingsService.updateListing(agent, 1, {})).rejects.toThrow(NotFoundError);
        });
    });

    describe('deleteListing', () => {
        it('should delete if owner', async () => {
            const existing = { id: 1, agentId: agent.id };
            listingsRepo.findListingById.mockResolvedValue(existing);
            listingsRepo.deleteListing.mockResolvedValue();

            await listingsService.deleteListing(agent, 1);
            expect(listingsRepo.deleteListing).toHaveBeenCalledWith(1);
        });

        it('should throw ForbiddenError for foreign listing', async () => {
            listingsRepo.findListingById.mockResolvedValue({ id: 1, agentId: 99 });
            await expect(listingsService.deleteListing(agent, 1)).rejects.toThrow(ForbiddenError);
        });

        it('should throw NotFoundError if not exists', async () => {
            listingsRepo.findListingById.mockResolvedValue(null);
            await expect(listingsService.deleteListing(agent, 1)).rejects.toThrow(NotFoundError);
        });
    });
});