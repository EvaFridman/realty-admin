import request from "supertest";
import app from "../../src/app";
import * as usersRepo from "../../src/repositories/usersRepository";
import { authHeader } from "../helpers/auth";
import type { AuthUser } from "../../database/models/user";

jest.mock("../../src/repositories/usersRepository");

const mockedUsersRepo = jest.mocked(usersRepo);

describe("Users Administration & Password API (Release 2)", () => {
    const mockModerator: AuthUser = {
        id: 1,
        role: "moderator",
        email: "mod@test.com",
    } as AuthUser;

    const mockAgent: AuthUser = {
        id: 2,
        role: "agent",
        email: "agent@test.com",
    } as AuthUser;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("POST /users", () => {
        test("should return 409 Conflict when creating a user with an already occupied email", async () => {
            const newUserPayload = {
                email: "occupied@test.com",
                password: "password123",
                name: "New Agent",
                phone: "+79991112233",
                role: "agent" as const,
            };

            mockedUsersRepo.findUserWithEmail.mockResolvedValue({
                id: 99,
                email: "occupied@test.com",
            } as never);

            const response = await request(app)
                .post("/users")
                .set(authHeader(mockModerator))
                .send(newUserPayload);

            expect(response.status).toBe(409);
            expect(response.body.error.message).toContain("already exists");
            expect(mockedUsersRepo.createUser).not.toHaveBeenCalled();
        });
    });

    describe("PATCH /auth/password", () => {
        test("should return 422 Unprocessable Entity when changing password with an invalid current password", async () => {
            const passwordPayload = {
                currentPassword: "WRONG_current_password",
                newPassword: "newSuperPassword123",
            };

            mockedUsersRepo.findUserById.mockResolvedValue(
                mockAgent as never
            );

            mockedUsersRepo.findByEmailWithPassword.mockResolvedValue({
                id: mockAgent.id,
                email: "agent@test.com",
                passwordHash:
                    "$2a$12$someFakeHashFromBcryptThatWillNotMatch",
            } as never);

            const response = await request(app)
                .patch("/auth/password")
                .set(authHeader(mockAgent))
                .send(passwordPayload);

            expect(response.status).toBe(422);
            expect(response.body.error.message).toContain(
                "Invalid current password"
            );
            expect(mockedUsersRepo.updateUser).not.toHaveBeenCalled();
        });
    });

    describe("GET /users (Access Control)", () => {
        test("should return 403 Forbidden when an agent tries to fetch the users list", async () => {
            const response = await request(app)
                .get("/users")
                .set(authHeader(mockAgent))
                .send();

            expect(response.status).toBe(403);
            expect(
                mockedUsersRepo.findAndCountAllUsers
            ).not.toHaveBeenCalled();
        });
    });
});