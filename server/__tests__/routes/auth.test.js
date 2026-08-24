require('../helpers/auth');
const request = require('supertest');
const bcrypt = require('bcryptjs');
const app = require('../../src/app');
const usersRepo = require('../../src/repositories/usersRepository');
const { authHeader, signTestRefreshToken } = require('../helpers/auth');

jest.mock('../../src/repositories/usersRepository');

const agentUser = {
    id: 1,
    email: 'agent@test.local',
    role: 'agent',
    name: 'Agent',
    passwordHash: bcrypt.hashSync('Password123', 4),
};

describe('Auth API', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /auth/login', () => {
        it('returns 200 and tokens for valid credentials', async () => {
            usersRepo.findByEmailWithPassword.mockResolvedValue(agentUser);

            const res = await request(app)
                .post('/auth/login')
                .send({ email: 'agent@test.local', password: 'Password123' })
                .expect(200);

            expect(res.body.data).toHaveProperty('accessToken');
            expect(res.body.data.user).toMatchObject({ id: 1, email: 'agent@test.local', role: 'agent' });
            expect(res.headers['set-cookie']).toBeDefined();
            const cookie = res.headers['set-cookie'].find((c) => c.startsWith('refreshToken='));
            expect(cookie).toMatch(/HttpOnly/i);
        });

        it('returns 422 with same message for wrong password', async () => {
            usersRepo.findByEmailWithPassword.mockResolvedValue(agentUser);

            const res = await request(app)
                .post('/auth/login')
                .send({ email: 'agent@test.local', password: 'WrongPass1' })
                .expect(422);

            expect(res.body.error.message).toBe('Invalid email or password');
        });

        it('returns 422 with same message for unknown email', async () => {
            usersRepo.findByEmailWithPassword.mockResolvedValue(null);

            const res = await request(app)
                .post('/auth/login')
                .send({ email: 'nobody@test.local', password: 'Password123' })
                .expect(422);

            expect(res.body.error.message).toBe('Invalid email or password');
        });
    });

    describe('GET /auth/me', () => {
        it('returns 401 without token', async () => {
            await request(app).get('/auth/me').expect(401);
        });

        it('returns 401 for garbage token', async () => {
            const res = await request(app)
                .get('/auth/me')
                .set({ Authorization: 'Bearer not.a.jwt' })
                .expect(401);

            expect(res.body.error.message).toMatch(/invalid|token/i);
        });

        it('returns current user with valid token', async () => {
            usersRepo.findUserById.mockResolvedValue({
                id: 1,
                email: 'agent@test.local',
                role: 'agent',
                name: 'Agent',
            });

            const res = await request(app)
                .get('/auth/me')
                .set(authHeader(agentUser))
                .expect(200);

            expect(res.body.data).toMatchObject({ id: 1, email: 'agent@test.local' });
        });
    });

    describe('POST /auth/refresh', () => {
        it('returns 401 without cookie', async () => {
            await request(app).post('/auth/refresh').expect(401);
        });

        it('returns new pair when cookie is valid', async () => {
            usersRepo.findById.mockResolvedValue(agentUser);
            const refresh = signTestRefreshToken(agentUser);

            const res = await request(app)
                .post('/auth/refresh')
                .set('Cookie', [`refreshToken=${refresh}`])
                .expect(200);

            expect(res.body.data).toHaveProperty('accessToken');
            expect(res.headers['set-cookie']).toBeDefined();
        });
    });

    describe('POST /auth/register', () => {
        it('returns 201 and tokens for new user', async () => {
            usersRepo.findUserWithEmail.mockResolvedValue(null);
            usersRepo.createUser.mockResolvedValue({
                id: 10,
                email: 'new@test.local',
                role: 'agent',
            });

            const res = await request(app)
                .post('/auth/register')
                .send({ email: 'new@test.local', password: 'Password123', name: 'New User' })
                .expect(201);

            expect(res.body.data).toHaveProperty('accessToken');
            expect(usersRepo.createUser).toHaveBeenCalledWith(
                expect.objectContaining({ email: 'new@test.local', role: 'agent' })
            );
        });

        it('returns 409 for existing email', async () => {
            usersRepo.findUserWithEmail.mockResolvedValue({ id: 1 });

            await request(app)
                .post('/auth/register')
                .send({ email: 'agent@test.local', password: 'Password123', name: 'Agent User' })
                .expect(409);
        });
    });

    describe('POST /auth/logout', () => {
        it('returns 204 and clears cookie', async () => {
            const res = await request(app).post('/auth/logout').expect(204);
            const setCookie = res.headers['set-cookie'] || [];
            const cleared = setCookie.find((c) => c.startsWith('refreshToken='));
            expect(cleared).toBeDefined();
        });
    });
});
