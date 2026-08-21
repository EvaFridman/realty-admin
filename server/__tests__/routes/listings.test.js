jest.mock('../../database/models', () => {
    const mockModel = {
        findAll: jest.fn().mockResolvedValue([]),
        findOne: jest.fn().mockResolvedValue(null),
        findByPk: jest.fn().mockResolvedValue(null),
        create: jest.fn().mockResolvedValue({}),
        update: jest.fn().mockResolvedValue([1]),
        destroy: jest.fn().mockResolvedValue(1),
    };
    return {
        sequelize: {
            transaction: jest.fn((cb) => cb()),
        },
        Listing: mockModel,
        ListingPhoto: mockModel,
        User: mockModel,
    };
});


require('../helpers/auth');
const request = require('supertest');
const app = require('../../src/app');
const listingsRepo = require('../../src/repositories/listingsRepository');
const { authHeader } = require('../helpers/auth');

jest.mock('../../src/repositories/listingsRepository');
jest.mock('../../src/services/mailService', () => ({
    sendNewViewingNotice: jest.fn().mockResolvedValue(undefined),
    sendViewingConfirmation: jest.fn().mockResolvedValue(undefined),
}));
jest.mock('../../src/services/imagesService', () => ({
    deletePhysicalFile: jest.fn().mockResolvedValue(undefined),
    buildImageUrl: jest.fn().mockReturnValue('http://test.local')
}));

const agent = { id: 1, role: 'agent' };
const moderator = { id: 2, role: 'moderator' };
const otherAgent = { id: 99, role: 'agent' };

describe('Listings API (with mocked repo)', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('auth guards', () => {
        it('GET /listings without token → 401', async () => {
            await request(app).get('/listings').expect(401);
        });

        it('POST /listings without token → 401', async () => {
            await request(app).post('/listings').send({}).expect(401);
        });

        it('PATCH /listings/:id/status as agent → 403', async () => {
            await request(app)
                .patch('/listings/1/status')
                .set(authHeader(agent))
                .send({ status: 'published' })
                .expect(403);
        });
    });

    describe('POST /listings', () => {
        const validPayload = {
            districtId: 1,
            title: 'Test Listing',
            dealType: 'sale',
            propertyType: 'flat',
            price: 100000,
            area: 50,
            address: 'Test St',
            lat: 55.75,
            lng: 37.62,
        };

        it('should create listing and return 201 with data', async () => {
            const created = { id: 1, agentId: agent.id, ...validPayload };
            listingsRepo.createListing.mockResolvedValue(created);

            const res = await request(app)
                .post('/listings')
                .set(authHeader(agent))
                .send(validPayload)
                .expect(201);

            expect(res.body).toHaveProperty('data');
            expect(res.body.data.id).toBe(1);
            expect(listingsRepo.createListing).toHaveBeenCalledWith(
                expect.objectContaining({ ...validPayload, agentId: agent.id })
            );
        });

        it('should return 422 for invalid body and not call service', async () => {
            const res = await request(app)
                .post('/listings')
                .set(authHeader(agent))
                .send({ title: '' })
                .expect(422);

            expect(res.body.error).toBeDefined();
            expect(listingsRepo.createListing).not.toHaveBeenCalled();
        });
    });

    describe('GET /listings/:id', () => {
        it('should return listing if owner', async () => {
            const listing = {
                id: 1,
                title: 'Test',
                agentId: agent.id,
                toJSON() { return this; },
            };
            listingsRepo.findListingById.mockResolvedValue(listing);

            const res = await request(app)
                .get('/listings/1')
                .set(authHeader(agent))
                .expect(200);

            expect(res.body.data.id).toBe(1);
            expect(listingsRepo.findListingById).toHaveBeenCalledWith(1);
        });

        it('should return 403 if not owner and not moderator', async () => {
            const listing = {
                id: 1,
                title: 'Test',
                agentId: otherAgent.id,
                toJSON() { return this; },
            };
            listingsRepo.findListingById.mockResolvedValue(listing);

            await request(app)
                .get('/listings/1')
                .set(authHeader(agent))
                .expect(403);
        });

        it('should return 404 if not found', async () => {
            listingsRepo.findListingById.mockResolvedValue(null);

            const res = await request(app)
                .get('/listings/999')
                .set(authHeader(agent))
                .expect(404);

            expect(res.body.error).toBeDefined();
            expect(listingsRepo.findListingById).toHaveBeenCalledWith(999);
        });
    });

    describe('PUT /listings/:id', () => {
        it('should update own listing and return 200', async () => {
            const existing = { id: 1, title: 'Old', agentId: agent.id };
            const updated = { ...existing, title: 'New' };
            listingsRepo.findListingById.mockResolvedValue(existing);
            listingsRepo.updateListing.mockResolvedValue(updated);

            const res = await request(app)
                .put('/listings/1')
                .set(authHeader(agent))
                .send({ title: 'New' })
                .expect(200);

            expect(res.body.data.title).toBe('New');
            expect(listingsRepo.updateListing).toHaveBeenCalledWith(1, { title: 'New' });
        });

        it('should return 403 when agent tries to update foreign listing', async () => {
            const existing = { id: 1, title: 'Old', agentId: otherAgent.id };
            listingsRepo.findListingById.mockResolvedValue(existing);

            await request(app)
                .put('/listings/1')
                .set(authHeader(agent))
                .send({ title: 'New' })
                .expect(403);
        });

        it('should return 404 for non-existent before ownership check', async () => {
            listingsRepo.findListingById.mockResolvedValue(null);

            await request(app)
                .put('/listings/999')
                .set(authHeader(agent))
                .send({ title: 'New' })
                .expect(404);
        });

        it('should return 422 for invalid update data and not call service', async () => {
            const res = await request(app)
                .put('/listings/1')
                .set(authHeader(agent))
                .send({ price: -100 })
                .expect(422);

            expect(listingsRepo.updateListing).not.toHaveBeenCalled();
        });
    });

    describe('PATCH /listings/:id/status', () => {
        it('should change status as moderator and return 200', async () => {
            const listing = {
                id: 1,
                status: 'moderation',
                photos: [{ isCover: true }],
                price: 1000,
                districtId: 1,
                lat: 55,
                lng: 37,
            };
            const updated = { ...listing, status: 'published' };
            listingsRepo.findListingById.mockResolvedValue(listing);
            listingsRepo.updateListingStatus.mockResolvedValue(updated);

            const res = await request(app)
                .patch('/listings/1/status')
                .set(authHeader(moderator))
                .send({ status: 'published' })
                .expect(200);

            expect(res.body.data.status).toBe('published');
            expect(listingsRepo.updateListingStatus).toHaveBeenCalledWith(1, 'published', null);
        });

        it('should return 422 for invalid status and not call service', async () => {
            const res = await request(app)
                .patch('/listings/1/status')
                .set(authHeader(moderator))
                .send({ status: 'invalid' })
                .expect(422);

            expect(listingsRepo.updateListingStatus).not.toHaveBeenCalled();
        });
    });

    describe('DELETE /listings/:id', () => {
        it('should delete own listing and return 204', async () => {
            listingsRepo.findListingById.mockResolvedValue({ id: 1, agentId: agent.id });
            listingsRepo.deleteListing.mockResolvedValue();

            await request(app)
                .delete('/listings/1')
                .set(authHeader(agent))
                .expect(204);

            expect(listingsRepo.deleteListing).toHaveBeenCalledWith(1);
        });

        it('should return 403 when agent tries to delete foreign listing', async () => {
            listingsRepo.findListingById.mockResolvedValue({ id: 1, agentId: otherAgent.id });

            await request(app)
                .delete('/listings/1')
                .set(authHeader(agent))
                .expect(403);
        });

        it('should return 404 if not found', async () => {
            listingsRepo.findListingById.mockResolvedValue(null);

            await request(app)
                .delete('/listings/999')
                .set(authHeader(agent))
                .expect(404);

            expect(listingsRepo.deleteListing).not.toHaveBeenCalled();
        });
    });
});