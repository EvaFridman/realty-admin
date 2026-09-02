import { db } from "../../database/models";
import type { User, UserRole } from "../../database/models/user";
import type { CreateUserBody, UpdateUserBody } from "../schemas/usersSchema";

type CreateUserData = Omit<CreateUserBody, "password"> & { passwordHash: string };

type UpdateUserData = Omit<UpdateUserBody, "password"> & { passwordHash?: string };

export async function findAllUsers(): Promise<User[]> {
    return db.User.findAll();
}

export async function findUserById(id: number): Promise<User | null> {
    return db.User.findByPk(id);
}

export async function createUser(data: CreateUserData): Promise<User> {
    return db.User.create(data);
}

export async function updateUser(id: number, data: UpdateUserData): Promise<User | null> {
    await db.User.update(data, { where: { id } });
    return findUserById(id);
}

export async function findUserWithEmail(email: string): Promise<User | null> {
    return db.User.findOne({ where: { email } });
}

export async function findByEmailWithPassword(email: string): Promise<User | null> {
    return db.User.unscoped().findOne({
        where: { email },
        attributes: ['id', 'email', 'role', 'passwordHash', 'name', 'phone'],
    });
}

export async function findById(id: number): Promise<User | null> {
    return db.User.findByPk(id);
}

export async function findAndCountAllUsers({ role, limit, offset, }: { role?: UserRole; limit: number; offset: number }): Promise<{ rows: User[]; count: number }> {
    const where: { role?: UserRole } = {};

    if (role) where.role = role;

    return db.User.findAndCountAll({ where, limit, offset, order: [['createdAt', 'DESC']] });
}