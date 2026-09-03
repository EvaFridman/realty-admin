import request from "supertest";
import bcrypt from "bcryptjs";
import app from "../../src/app";
import * as usersRepo from "../../src/repositories/usersRepository";
import { authHeader, signTestRefreshToken } from "../helpers/auth";
import type { User } from "../../database/models/user";

jest.mock("../../src/repositories/usersRepository");

const mockedUsersRepo = jest.mocked(usersRepo);

const agentUser = {
    id: 1,
    email: "agent@test.local",
    role: "agent" as const,
    name: "Agent",
    passwordHash: bcrypt.hashSync("Password123", 4),
} as User;

describe("Auth API", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("POST /auth/login", () => {
        it("returns 200 and tokens for valid credentials", async () => {
            mockedUsersRepo.findByEmailWithPassword.mockResolvedValue(agentUser);

            const res = await request(app)
                .post("/auth/login")
                .send({
                    email: "agent@test.local",
                    password: "Password123",
                })
                .expect(200);

            expect(res.body.data).toHaveProperty("accessToken");
            expect(res.body.data.user).toMatchObject({
                id: 1,
                email: "agent@test.local",
                role: "agent",
            });

            expect(res.headers["set-cookie"]).toBeDefined();

            const cookies = res.headers["set-cookie"] ?? [];
            const cookieList = Array.isArray(cookies) ? cookies : [cookies];

            const cookie = cookieList.find((c: string) =>
                c.startsWith("refreshToken=")
            );

            expect(cookie).toMatch(/HttpOnly/i);
        });

        it("returns 422 with same message for wrong password", async () => {
            mockedUsersRepo.findByEmailWithPassword.mockResolvedValue(agentUser);

            const res = await request(app)
                .post("/auth/login")
                .send({
                    email: "agent@test.local",
                    password: "WrongPass1",
                })
                .expect(422);

            expect(res.body.error.message).toBe(
                "Invalid email or password"
            );
        });

        it("returns 422 with same message for unknown email", async () => {
            mockedUsersRepo.findByEmailWithPassword.mockResolvedValue(null);

            const res = await request(app)
                .post("/auth/login")
                .send({
                    email: "nobody@test.local",
                    password: "Password123",
                })
                .expect(422);

            expect(res.body.error.message).toBe(
                "Invalid email or password"
            );
        });
    });

    describe("GET /auth/me", () => {
        it("returns 401 without token", async () => {
            await request(app)
                .get("/auth/me")
                .expect(401);
        });

        it("returns 401 for garbage token", async () => {
            const res = await request(app)
                .get("/auth/me")
                .set({
                    Authorization: "Bearer not.a.jwt",
                })
                .expect(401);

            expect(res.body.error.message).toMatch(/invalid|token/i);
        });

        it("returns current user with valid token", async () => {
            mockedUsersRepo.findUserById.mockResolvedValue({
                id: 1,
                email: "agent@test.local",
                role: "agent",
                name: "Agent",
            } as User);

            const res = await request(app)
                .get("/auth/me")
                .set(authHeader(agentUser))
                .expect(200);

            expect(res.body.data).toMatchObject({
                id: 1,
                email: "agent@test.local",
            });
        });
    });

    describe("POST /auth/refresh", () => {
        it("returns 401 without cookie", async () => {
            await request(app)
                .post("/auth/refresh")
                .expect(401);
        });

        it("returns new pair when cookie is valid", async () => {
            mockedUsersRepo.findById.mockResolvedValue(agentUser);

            const refresh = signTestRefreshToken(agentUser);

            const res = await request(app)
                .post("/auth/refresh")
                .set("Cookie", [`refreshToken=${refresh}`])
                .expect(200);

            expect(res.body.data).toHaveProperty("accessToken");
            expect(res.headers["set-cookie"]).toBeDefined();
        });
    });

    describe("POST /auth/register", () => {
        it("returns 201 and tokens for new user", async () => {
            mockedUsersRepo.findUserWithEmail.mockResolvedValue(null);

            mockedUsersRepo.createUser.mockResolvedValue({
                id: 10,
                email: "new@test.local",
                role: "agent",
            } as User);

            const res = await request(app)
                .post("/auth/register")
                .send({
                    email: "new@test.local",
                    password: "Password123",
                    name: "New User",
                })
                .expect(201);

            expect(res.body.data).toHaveProperty("accessToken");

            expect(mockedUsersRepo.createUser).toHaveBeenCalledWith(
                expect.objectContaining({
                    email: "new@test.local",
                    role: "agent",
                })
            );
        });

        it("returns 409 for existing email", async () => {
            mockedUsersRepo.findUserWithEmail.mockResolvedValue({
                id: 1,
            } as User);

            await request(app)
                .post("/auth/register")
                .send({
                    email: "agent@test.local",
                    password: "Password123",
                    name: "Agent User",
                })
                .expect(409);
        });
    });

    describe("POST /auth/logout", () => {
        it("returns 204 and clears cookie", async () => {
            const res = await request(app)
                .post("/auth/logout")
                .expect(204);

            const setCookie = res.headers["set-cookie"] ?? [];
            const cookieList = Array.isArray(setCookie)
                ? setCookie
                : [setCookie];

            const cleared = cookieList.find((c: string) =>
                c.startsWith("refreshToken=")
            );

            expect(cleared).toBeDefined();
        });
    });
});