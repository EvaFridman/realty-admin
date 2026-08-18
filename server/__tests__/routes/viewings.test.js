require('../helpers/auth');

const request = require('supertest');

jest.mock('../../src/services/mailService', () => ({
    sendNewViewingNotice: jest.fn().mockResolvedValue(undefined),
    sendViewingConfirmation: jest.fn().mockResolvedValue(undefined),
}));

const app = require('../../src/app');
const listingsRepo = require('../../src/repositories/listingsRepository');
const viewingsRepo = require('../../src/repositories/viewingsRepository');
const { authHeader } = require('../helpers/auth');

jest.mock('../../src/repositories/listingsRepository');
jest.mock('../../src/repositories/viewingsRepository');

const moderator = { id: 2, role: 'moderator' };
const agent = { id: 1, role: 'agent' };

describe('Viewings API (with mocked repos)', () => {
    beforeEach(() => jest.clearAllMocks());

    describe('POST /listings/:listingId/viewings (open)', () => {
        const validPayload = {
            clientName: 'John',
            clientPhone: '+1234567890',
            clientEmail: 'john@test.com',
            preferredAt: new Date().toISOString(),
        };

        it('should create viewing for published listing', async () => {
            const listing = {
                id: 1,
                status: 'published',
                title: 'Flat',
                agent: { email: 'agent@test.com' },
            };
            const viewing = { id: 1, ...validPayload };
            listingsRepo.findListingById.mockResolvedValue(listing);
            viewingsRepo.createViewing.mockResolvedValue(viewing);
            viewingsRepo.markNotified.mockResolvedValue();

            const res = await request(app)
                .post('/listings/1/viewings')
                .send(validPayload)
                .expect(201);

            expect(res.body.data.id).toBe(1);
            expect(viewingsRepo.createViewing).toHaveBeenCalledWith(
                1,
                expect.objectContaining({
                    clientName: 'John',
                    clientPhone: '+1234567890',
                    clientEmail: 'john@test.com',
                    preferredAt: expect.any(Date),
                })
            );
        });

        it('should return 409 if listing is not published', async () => {
            listingsRepo.findListingById.mockResolvedValue({ id: 1, status: 'draft' });

            const res = await request(app)
                .post('/listings/1/viewings')
                .send(validPayload)
                .expect(409);

            expect(res.body.error).toBeDefined();
            expect(viewingsRepo.createViewing).not.toHaveBeenCalled();
        });

        it('should return 422 for invalid body and not call service', async () => {
            await request(app)
                .post('/listings/1/viewings')
                .send({ clientName: '' })
                .expect(422);

            expect(viewingsRepo.createViewing).not.toHaveBeenCalled();
        });
    });

    describe('PATCH /viewings/:id/status', () => {
        it('returns 401 without token', async () => {
            await request(app)
                .patch('/viewings/1/status')
                .send({ status: 'approved' })
                .expect(401);
        });

        it('returns 403 for agent', async () => {
            await request(app)
                .patch('/viewings/1/status')
                .set(authHeader(agent))
                .send({ status: 'approved' })
                .expect(403);
        });

        it('should change status as moderator', async () => {
            const viewing = {
                id: 1,
                status: 'pending approval',
                clientEmail: 'john@test.com',
                preferredAt: new Date(),
                listing: { title: 'Flat' },
            };
            const updated = { ...viewing, status: 'approved' };
            viewingsRepo.findViewingById.mockResolvedValue(viewing);
            viewingsRepo.updateViewingStatus.mockResolvedValue(updated);

            const res = await request(app)
                .patch('/viewings/1/status')
                .set(authHeader(moderator))
                .send({ status: 'approved' })
                .expect(200);

            expect(res.body.data.status).toBe('approved');
            expect(viewingsRepo.updateViewingStatus).toHaveBeenCalledWith(1, 'approved');
        });

        it('should return 409 on a forbidden status transition', async () => {
            viewingsRepo.findViewingById.mockResolvedValue({ id: 1, status: 'created' });

            const res = await request(app)
                .patch('/viewings/1/status')
                .set(authHeader(moderator))
                .send({ status: 'approved' })
                .expect(409);

            expect(res.body.data).toBeNull();
            expect(res.body.error).not.toBeNull();
            expect(viewingsRepo.updateViewingStatus).not.toHaveBeenCalled();
        });

        it('should return 422 for invalid status and not call service', async () => {
            await request(app)
                .patch('/viewings/1/status')
                .set(authHeader(moderator))
                .send({ status: 'invalid' })
                .expect(422);

            expect(viewingsRepo.updateViewingStatus).not.toHaveBeenCalled();
        });
    });
});