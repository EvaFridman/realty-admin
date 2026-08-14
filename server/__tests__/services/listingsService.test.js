const listingsService = require('../../src/services/listingsService');
const listingsRepo = require('../../src/repositories/listingsRepository');
const { NotFoundError, ConflictError } = require('../../src/errors/AppError');
const { canTransition } = require('../../src/services/pure/listingStatusTransitions');

jest.mock('../../src/repositories/listingsRepository');
jest.mock('../../src/services/pure/listingStatusTransitions');

describe('listingsService', () => {
    beforeEach(() => jest.clearAllMocks());

    describe('listListings', () => {
        it('should return paginated listings with meta', async () => {
            const rawQuery = { page: 2, limit: 10, sortBy: 'price', sortOrder: 'asc' };
            const rows = [{ id: 1 }, { id: 2 }];
            const count = 2;
            listingsRepo.findAndCountListings.mockResolvedValue({ rows, count });

            const result = await listingsService.listListings(rawQuery);

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
        });
    });

    describe('getListingById', () => {
        it('should return listing if found', async () => {
            const listing = { id: 1, title: 'Test' };
            listingsRepo.findListingById.mockResolvedValue(listing);

            const result = await listingsService.getListingById(1);
            expect(result).toEqual(listing);
            expect(listingsRepo.findListingById).toHaveBeenCalledWith(1);
        });

        it('should throw NotFoundError if not found', async () => {
            listingsRepo.findListingById.mockResolvedValue(null);
            await expect(listingsService.getListingById(999)).rejects.toThrow(NotFoundError);
        });
    });

    describe('createListing', () => {
        it('should call repo.createListing with data', async () => {
            const data = { title: 'New' };
            const created = { id: 1, ...data };
            listingsRepo.createListing.mockResolvedValue(created);

            const result = await listingsService.createListing(data);
            expect(result).toEqual(created);
            expect(listingsRepo.createListing).toHaveBeenCalledWith(data);
        });
    });

    describe('updateListing', () => {
        it('should update if exists', async () => {
            const existing = { id: 1, title: 'Old' };
            const updateData = { title: 'New' };
            const updated = { ...existing, ...updateData };
            listingsRepo.findListingById.mockResolvedValue(existing);
            listingsRepo.updateListing.mockResolvedValue(updated);

            const result = await listingsService.updateListing(1, updateData);
            expect(result).toEqual(updated);
            expect(listingsRepo.updateListing).toHaveBeenCalledWith(1, updateData);
        });

        it('should throw NotFoundError if listing does not exist', async () => {
            listingsRepo.findListingById.mockResolvedValue(null);
            await expect(listingsService.updateListing(1, {})).rejects.toThrow(NotFoundError);
        });
    });

    describe('deleteListing', () => {
        it('should delete if exists', async () => {
            const existing = { id: 1 };
            listingsRepo.findListingById.mockResolvedValue(existing);
            listingsRepo.deleteListing.mockResolvedValue();

            await listingsService.deleteListing(1);
            expect(listingsRepo.deleteListing).toHaveBeenCalledWith(1);
        });

        it('should throw NotFoundError if not exists', async () => {
            listingsRepo.findListingById.mockResolvedValue(null);
            await expect(listingsService.deleteListing(1)).rejects.toThrow(NotFoundError);
        });
    });

    describe('changeStatus', () => {
        const listing = {
            id: 1,
            status: 'draft',
            photos: [{ isCover: true }],
            price: 1000,
            districtId: 1,
            lat: 55,
            lng: 37,
        };

        it('should throw NotFoundError if listing not found', async () => {
            listingsRepo.findListingById.mockResolvedValue(null);
            await expect(listingsService.changeStatus(1, 'published')).rejects.toThrow(NotFoundError);
        });

        it('should throw ConflictError if transition not allowed', async () => {
            listingsRepo.findListingById.mockResolvedValue(listing);
            canTransition.mockReturnValue(false);

            await expect(listingsService.changeStatus(1, 'published')).rejects.toThrow(ConflictError);
            expect(canTransition).toHaveBeenCalledWith('draft', 'published');
        });

        it('should throw ConflictError if rejectionReason missing for rejected status', async () => {
            listingsRepo.findListingById.mockResolvedValue(listing);
            canTransition.mockReturnValue(true);

            await expect(listingsService.changeStatus(1, 'rejected')).rejects.toThrow(ConflictError);
        });

        it('should throw ConflictError if publish requirements not met', async () => {
            const incomplete = { ...listing, photos: [] };
            listingsRepo.findListingById.mockResolvedValue(incomplete);
            canTransition.mockReturnValue(true);

            await expect(listingsService.changeStatus(1, 'published')).rejects.toThrow(ConflictError);
        });

        it('should successfully publish listing', async () => {
            const complete = { ...listing, photos: [{ isCover: true }] };
            listingsRepo.findListingById.mockResolvedValue(complete);
            canTransition.mockReturnValue(true);
            listingsRepo.updateListingStatus.mockResolvedValue({ ...complete, status: 'published' });

            const result = await listingsService.changeStatus(1, 'published');
            expect(result.status).toBe('published');
            expect(listingsRepo.updateListingStatus).toHaveBeenCalledWith(1, 'published', null);
        });

        it('should reject listing with reason', async () => {
            listingsRepo.findListingById.mockResolvedValue(listing);
            canTransition.mockReturnValue(true);
            listingsRepo.updateListingStatus.mockResolvedValue({ ...listing, status: 'rejected', rejectionReason: 'Bad' });

            const result = await listingsService.changeStatus(1, 'rejected', 'Bad');
            expect(result.status).toBe('rejected');
            expect(listingsRepo.updateListingStatus).toHaveBeenCalledWith(1, 'rejected', 'Bad');
        });
    });

    describe('getListingsByIds', () => {
        it('should call repo.findListingsByIds', async () => {
            const ids = [1, 2];
            const listings = [{ id: 1 }, { id: 2 }];
            listingsRepo.findListingsByIds.mockResolvedValue(listings);

            const result = await listingsService.getListingsByIds(ids);
            expect(result).toEqual(listings);
            expect(listingsRepo.findListingsByIds).toHaveBeenCalledWith(ids);
        });
    });

    describe('checkPublishRequirements', () => {
        it('should return empty array if all requirements met', () => {
            const listing = {
                photos: [{ isCover: true }],
                price: 1000,
                districtId: 1,
                lat: 55,
                lng: 37,
            };
            const missing = listingsService.checkPublishRequirements(listing);
            expect(missing).toEqual([]);
        });

        it('should return missing fields', () => {
            const listing = { photos: [] };
            const missing = listingsService.checkPublishRequirements(listing);
            expect(missing).toContain('At least one photo is required');
            expect(missing).toContain('A cover photo is required');
            expect(missing).toContain('Price must be greater than zero');
            expect(missing).toContain('District is required');
            expect(missing).toContain('Coordinates are required');
        });
    });
});