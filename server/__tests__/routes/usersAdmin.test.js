const request = require('supertest');
const app = require('../../src/app');
const usersRepo = require('../../src/repositories/usersRepository');
const { authHeader } = require('../helpers/auth'); 

jest.mock('../../src/repositories/usersRepository');

describe('Users Administration & Password API (Release 2)', () => {
    
    const mockModerator = { id: 1, role: 'moderator', email: 'mod@test.com' };
    const mockAgent = { id: 2, role: 'agent', email: 'agent@test.com' };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /users', () => {
        test('should return 409 Conflict when creating a user with an already occupied email', async () => {
            const newUserPayload = {
                email: 'occupied@test.com',
                password: 'password123',
                name: 'New Agent',
                phone: '+79991112233',
                role: 'agent'
            };

            usersRepo.findUserWithEmail.mockResolvedValue({ id: 99, email: 'occupied@test.com' });

            const response = await request(app)
                .post('/users')
                .set(authHeader(mockModerator))
                .send(newUserPayload);

            expect(response.status).toBe(409);
            expect(response.body.error.message).toContain('already exists');
            expect(usersRepo.createUser).not.toHaveBeenCalled();
        });
    });

    describe('PATCH /auth/password', () => {
        test('should return 422 Unprocessable Entity when changing password with an invalid current password', async () => {
            const passwordPayload = {
                currentPassword: 'WRONG_current_password', 
                newPassword: 'newSuperPassword123'
            };

            usersRepo.findByEmailWithPassword.mockResolvedValue({
                id: mockAgent.id,
                email: mockAgent.email,
                passwordHash: '$2a$12$someFakeHashFromBcryptThatWillNotMatch'
            });

            const response = await request(app)
                .patch('/auth/password')
                .set(authHeader(mockAgent))
                .send(passwordPayload);

            expect(response.status).toBe(422);
            expect(response.body.error.message).toContain('Invalid current password');
            expect(usersRepo.updateUser).not.toHaveBeenCalled();
        });
    });

    describe('GET /users (Access Control)', () => {
        test('should return 403 Forbidden when an agent tries to fetch the users list', async () => {
            
            const response = await request(app)
                .get('/users')
                .set(authHeader(mockAgent))
                .send();

            expect(response.status).toBe(403);
            expect(usersRepo.findAndCountAllUsers).not.toHaveBeenCalled();
        });
    });
});
