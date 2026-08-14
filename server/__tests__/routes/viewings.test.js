const request = require('supertest');
const app = require('../../src/app');
const listingsRepo = require('../../src/repositories/listingsRepository');
const viewingsRepo = require('../../src/repositories/viewingsRepository');

jest.mock('../../src/repositories/listingsRepository');
jest.mock('../../src/repositories/viewingsRepository');

describe('Viewings API (with mocked repos)', () => {
    beforeEach(() => jest.clearAllMocks());

    describe('POST /listings/:listingId/viewings', () => {
        const validPayload = {
            clientName: 'John',
            clientPhone: '+1234567890',
            clientEmail: 'john@test.com',
            preferredAt: new Date().toISOString(),
        };

        it('should create viewing for published listing', async () => {
            const listing = { id: 1, status: 'published' };
            const viewing = { id: 1, ...validPayload };
            listingsRepo.findListingById.mockResolvedValue(listing);
            viewingsRepo.createViewing.mockResolvedValue(viewing);
            viewingsRepo.markNotified.mockResolvedValue();

            const res = await request(app)
                .post('/listings/1/viewings')
                .send(validPayload)
                .expect(201);

            expect(res.body.data.id).toBe(1);
            expect(viewingsRepo.createViewing).toHaveBeenCalledWith(1, expect.objectContaining({ ...validPayload, preferredAt: expect.any(Date) }));
        });

        it('should return 409 if listing is not published', async () => {
            const listing = { id: 1, status: 'draft' };
            listingsRepo.findListingById.mockResolvedValue(listing);

            const res = await request(app)
                .post('/listings/1/viewings')
                .send(validPayload)
                .expect(409);

            expect(res.body.error).toBeDefined();
            expect(viewingsRepo.createViewing).not.toHaveBeenCalled();
        });

        it('should return 422 for invalid body and not call service', async () => {
            const res = await request(app)
                .post('/listings/1/viewings')
                .send({ clientName: '' })
                .expect(422);

            expect(viewingsRepo.createViewing).not.toHaveBeenCalled();
        });
    });

    describe('PATCH /viewings/:id/status', () => {
        it('should change status', async () => {
            const viewing = { id: 1, status: 'pending approval' };
            const updated = { ...viewing, status: 'approved' };
            viewingsRepo.findViewingById.mockResolvedValue(viewing);
            viewingsRepo.updateViewingStatus.mockResolvedValue(updated);

            const res = await request(app)
                .patch('/viewings/1/status')
                .send({ status: 'approved' })
                .expect(200);

            expect(res.body.data.status).toBe('approved');
            expect(viewingsRepo.updateViewingStatus).toHaveBeenCalledWith(1, 'approved');
        });

        it('should return 409 on a forbidden status transition', async () => {
            const viewing = { id: 1, status: 'created' };
            viewingsRepo.findViewingById.mockResolvedValue(viewing);

            const res = await request(app)
                .patch('/viewings/1/status')
                .send({ status: 'approved' })
                .expect(409);

            expect(res.body.data).toBeNull();
            expect(res.body.error).not.toBeNull();
            expect(viewingsRepo.updateViewingStatus).not.toHaveBeenCalled();
        });

        it('should return 422 for invalid status and not call service', async () => {
            const res = await request(app)
                .patch('/viewings/1/status')
                .send({ status: 'invalid' })
                .expect(422);

            expect(viewingsRepo.updateViewingStatus).not.toHaveBeenCalled();
        });
    });
});