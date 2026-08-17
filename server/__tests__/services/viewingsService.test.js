const viewingsService = require('../../src/services/viewingsService');
const viewingsRepo = require('../../src/repositories/viewingsRepository');
const listingsRepo = require('../../src/repositories/listingsRepository');
const mailService = require('../../src/services/mailService');
const { NotFoundError, ConflictError } = require('../../src/errors/AppError');

jest.mock('../../src/repositories/viewingsRepository');
jest.mock('../../src/repositories/listingsRepository');
jest.mock('../../src/services/mailService');

describe('viewingsService', () => {
    beforeEach(() => jest.clearAllMocks());

    describe('listAllViewings', () => {
        test('считает totalPages и добавляет allowedTransitions к каждой заявке', async () => {
            viewingsRepo.findAndCountViewings.mockResolvedValue({
                rows: [{ toJSON: () => ({ id: 1, status: 'created' }) }],
                count: 25,
            });

            const result = await viewingsService.listAllViewings({ page: 1, limit: 20, status: undefined, sortOrder: 'desc' });

            expect(result.meta.totalPages).toBe(2);
            expect(result.data[0].allowedTransitions).toBeDefined();
        });

        test('передаёт фильтр по статусу в репозиторий', async () => {
            viewingsRepo.findAndCountViewings.mockResolvedValue({ rows: [], count: 0 });

            await viewingsService.listAllViewings({ page: 1, limit: 20, status: 'created', sortOrder: 'desc' });

            expect(viewingsRepo.findAndCountViewings).toHaveBeenCalledWith(
                expect.objectContaining({ status: 'created' })
            );
        });
    });

    describe('listViewings', () => {
        it('should return viewings for listing if listing exists', async () => {
            const listing = { id: 1 };
            const viewings = [{ id: 1 }];
            listingsRepo.findListingById.mockResolvedValue(listing);
            viewingsRepo.findViewingsByListingId.mockResolvedValue(viewings);

            const result = await viewingsService.listViewings(1);
            expect(result).toEqual(viewings);
            expect(listingsRepo.findListingById).toHaveBeenCalledWith(1);
            expect(viewingsRepo.findViewingsByListingId).toHaveBeenCalledWith(1);
        });

        it('should throw NotFoundError if listing does not exist', async () => {
            listingsRepo.findListingById.mockResolvedValue(null);
            await expect(viewingsService.listViewings(1)).rejects.toThrow(NotFoundError);
        });
    });

    describe('createViewing', () => {
        const listing = { id: 1, status: 'published', agent: { email: 'agent@test.com' } };
        const data = { clientName: 'John', clientEmail: 'john@test.com', clientPhone: '+1234567890', preferredAt: new Date() };
        const viewing = { id: 1, ...data };

        it('should create viewing if listing is published', async () => {
            listingsRepo.findListingById.mockResolvedValue(listing);
            viewingsRepo.createViewing.mockResolvedValue(viewing);
            viewingsRepo.markNotified.mockResolvedValue();
            mailService.sendNewViewingNotice.mockResolvedValue();

            const result = await viewingsService.createViewing(1, data, { info: jest.fn(), error: jest.fn() });
            expect(result).toEqual(viewing);
            expect(viewingsRepo.createViewing).toHaveBeenCalledWith(1, data);
            expect(mailService.sendNewViewingNotice).toHaveBeenCalledWith(listing, viewing);
            expect(viewingsRepo.markNotified).toHaveBeenCalledWith(viewing.id);
        });

        it('should throw NotFoundError if listing not found', async () => {
            listingsRepo.findListingById.mockResolvedValue(null);
            await expect(viewingsService.createViewing(1, data, { info: jest.fn(), error: jest.fn() }))
                .rejects.toThrow(NotFoundError);
        });

        it('should throw ConflictError if listing is not published', async () => {
            const draftListing = { ...listing, status: 'draft' };
            listingsRepo.findListingById.mockResolvedValue(draftListing);
            await expect(viewingsService.createViewing(1, data, { info: jest.fn(), error: jest.fn() }))
                .rejects.toThrow(ConflictError);
        });

        it('should log error but not throw if mail service fails', async () => {
            listingsRepo.findListingById.mockResolvedValue(listing);
            viewingsRepo.createViewing.mockResolvedValue(viewing);
            mailService.sendNewViewingNotice.mockRejectedValue(new Error('Mail error'));
            const log = { info: jest.fn(), error: jest.fn() };

            const result = await viewingsService.createViewing(1, data, log);
            expect(result).toEqual(viewing);
            expect(log.error).toHaveBeenCalled();
            expect(viewingsRepo.markNotified).not.toHaveBeenCalled();
        });
    });

    describe('changeStatus', () => {
        const viewing = {
            id: 1,
            status: 'pending approval',
            listing: { id: 1, title: 'Test' },
            clientEmail: 'client@test.com',
            preferredAt: new Date(),
        };
        const updated = { ...viewing, status: 'approved' };

        it('should throw NotFoundError if viewing not found', async () => {
            viewingsRepo.findViewingById.mockResolvedValue(null);
            await expect(viewingsService.changeStatus(1, 'approved', { info: jest.fn(), warn: jest.fn(), error: jest.fn() }))
                .rejects.toThrow(NotFoundError);
        });

        it('should throw ConflictError on a forbidden transition and log a warning', async () => {
            const closedViewing = { ...viewing, status: 'closed' };
            viewingsRepo.findViewingById.mockResolvedValue(closedViewing);
            const log = { info: jest.fn(), warn: jest.fn(), error: jest.fn() };

            await expect(viewingsService.changeStatus(1, 'approved', log))
                .rejects.toThrow(ConflictError);
            expect(viewingsRepo.updateViewingStatus).not.toHaveBeenCalled();
            expect(log.warn).toHaveBeenCalled();
        });

        it('should update status and send confirmation if status is approved', async () => {
            viewingsRepo.findViewingById.mockResolvedValue(viewing);
            viewingsRepo.updateViewingStatus.mockResolvedValue(updated);
            mailService.sendViewingConfirmation.mockResolvedValue();

            const result = await viewingsService.changeStatus(1, 'approved', { info: jest.fn(), warn: jest.fn(), error: jest.fn() });
            expect(result).toEqual(updated);
            expect(viewingsRepo.updateViewingStatus).toHaveBeenCalledWith(1, 'approved');
            expect(mailService.sendViewingConfirmation).toHaveBeenCalledWith(viewing.listing, updated);
        });

        it('should update status without sending confirmation if status not approved', async () => {
            viewingsRepo.findViewingById.mockResolvedValue(viewing);
            viewingsRepo.updateViewingStatus.mockResolvedValue({ ...updated, status: 'rejected' });
            mailService.sendViewingConfirmation.mockResolvedValue();

            const result = await viewingsService.changeStatus(1, 'rejected', { info: jest.fn(), warn: jest.fn(), error: jest.fn() });
            expect(result.status).toBe('rejected');
            expect(mailService.sendViewingConfirmation).not.toHaveBeenCalled();
        });

        it('should log error but not throw if confirmation mail fails', async () => {
            viewingsRepo.findViewingById.mockResolvedValue(viewing);
            viewingsRepo.updateViewingStatus.mockResolvedValue(updated);
            mailService.sendViewingConfirmation.mockRejectedValue(new Error('Mail error'));
            const log = { info: jest.fn(), warn: jest.fn(), error: jest.fn() };

            const result = await viewingsService.changeStatus(1, 'approved', log);
            expect(result).toEqual(updated);
            expect(log.error).toHaveBeenCalled();
        });
    });
});