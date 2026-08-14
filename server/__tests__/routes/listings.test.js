const request = require('supertest');
const app = require('../../src/app');
const listingsRepo = require('../../src/repositories/listingsRepository');

jest.mock('../../src/repositories/listingsRepository');

describe('Listings API (with mocked repo)', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /listings', () => {
        const validPayload = {
            agentId: 1,
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
            const created = { id: 1, ...validPayload };
            listingsRepo.createListing.mockResolvedValue(created);

            const res = await request(app)
                .post('/listings')
                .send(validPayload)
                .expect(201);

            expect(res.body).toHaveProperty('data');
            expect(res.body.data.id).toBe(1);
            expect(listingsRepo.createListing).toHaveBeenCalledWith(expect.objectContaining(validPayload));
        });

        it('should return 422 for invalid body and not call service', async () => {
            const res = await request(app)
                .post('/listings')
                .send({ title: '' })
                .expect(422);

            expect(res.body.error).toBeDefined();
            expect(listingsRepo.createListing).not.toHaveBeenCalled();
        });
    });

    describe('GET /listings/:id', () => {
        it('should return listing if found', async () => {
            const listing = { id: 1, title: 'Test' };
            listingsRepo.findListingById.mockResolvedValue(listing);

            const res = await request(app)
                .get('/listings/1')
                .expect(200);

            expect(res.body.data.id).toBe(1);
            expect(listingsRepo.findListingById).toHaveBeenCalledWith(1);
        });

        it('should return 404 if not found', async () => {
            listingsRepo.findListingById.mockResolvedValue(null);

            const res = await request(app)
                .get('/listings/999')
                .expect(404);

            expect(res.body.error).toBeDefined();
            expect(listingsRepo.findListingById).toHaveBeenCalledWith(999);
        });
    });

    describe('PUT /listings/:id', () => {
        it('should update and return 200', async () => {
            const existing = { id: 1, title: 'Old' };
            const updated = { ...existing, title: 'New' };
            listingsRepo.findListingById.mockResolvedValue(existing);
            listingsRepo.updateListing.mockResolvedValue(updated);

            const res = await request(app)
                .put('/listings/1')
                .send({ title: 'New' })
                .expect(200);

            expect(res.body.data.title).toBe('New');
            expect(listingsRepo.updateListing).toHaveBeenCalledWith(1, { title: 'New' });
        });

        it('should return 422 for invalid update data and not call service', async () => {
            const res = await request(app)
                .put('/listings/1')
                .send({ price: -100 })
                .expect(422);

            expect(listingsRepo.updateListing).not.toHaveBeenCalled();
        });
    });

    describe('PATCH /listings/:id/status', () => {
        it('should change status and return 200', async () => {
            const listing = { id: 1, status: 'moderation', photos: [{ isCover: true }], price: 1000, districtId: 1, lat: 55, lng: 37 };
            const updated = { ...listing, status: 'published' };
            listingsRepo.findListingById.mockResolvedValue(listing);
            listingsRepo.updateListingStatus.mockResolvedValue(updated);

            const res = await request(app)
                .patch('/listings/1/status')
                .send({ status: 'published' })
                .expect(200);

            expect(res.body.data.status).toBe('published');
            expect(listingsRepo.updateListingStatus).toHaveBeenCalledWith(1, 'published', null);
        });

        it('should return 422 for invalid status and not call service', async () => {
            const res = await request(app)
                .patch('/listings/1/status')
                .send({ status: 'invalid' })
                .expect(422);

            expect(listingsRepo.updateListingStatus).not.toHaveBeenCalled();
        });
    });

    describe('DELETE /listings/:id', () => {
        it('should delete and return 204', async () => {
            listingsRepo.findListingById.mockResolvedValue({ id: 1 });
            listingsRepo.deleteListing.mockResolvedValue();

            await request(app)
                .delete('/listings/1')
                .expect(204);

            expect(listingsRepo.deleteListing).toHaveBeenCalledWith(1);
        });

        it('should return 404 if not found', async () => {
            listingsRepo.findListingById.mockResolvedValue(null);

            await request(app)
                .delete('/listings/999')
                .expect(404);

            expect(listingsRepo.deleteListing).not.toHaveBeenCalled();
        });
    });
});