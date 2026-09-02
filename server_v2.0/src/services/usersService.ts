import bcrypt from "bcryptjs";
import * as usersRepo from "../repositories/usersRepository";
import type { User, UserRole } from "../../database/models/user";
import type { CreateUserBody, UpdateUserBody } from "../schemas/usersSchema";
import type { ChangePassword } from "../schemas/authSchema";
import { NotFoundError, ConflictError, UnprocessableEntityError } from "../errors/AppError";

export async function listUsers({ role, page = 1, limit = 20 }: { role?: UserRole, page?: number, limit?: number }): Promise<
{ users: User[]; meta: { total: number; page: number; limit: number; totalPages: number } }
> {
    const pageNum = Number(page);
    const limitNum = Number(limit);
    const offset = (pageNum - 1) * limitNum;
    const { rows: users, count } = await usersRepo.findAndCountAllUsers({ role, limit: limitNum, offset });

    return { users, meta: { total: count, page: pageNum, limit: limitNum, totalPages: Math.ceil(count / limitNum) } };
}

export async function getUserById(id: number): Promise<User> {
    const user = await usersRepo.findUserById(id);
    if (!user) throw new NotFoundError('User not found');
    return user;
}

export async function createUser(data: CreateUserBody): Promise<User> {
    const { email, password, name, phone, role } = data;
    const existingUser = await usersRepo.findUserWithEmail(email);
    if (existingUser) throw new ConflictError('User with this email already exists');
    const passwordHash = await bcrypt.hash(password, 12);

    return usersRepo.createUser({ email, passwordHash, name, phone, role: role || 'agent' });
}

export async function updateUser(id: number, data: UpdateUserBody): Promise<User> {
    const user = await usersRepo.findUserById(id);
    if (!user) throw new NotFoundError('User not found');

    if (data.email && data.email !== user.email) {
        const emailExists = await usersRepo.findUserWithEmail(data.email);
        if (emailExists) throw new ConflictError('User with this email already exists');
    }

    if (data.password) {
        const passwordHash = await bcrypt.hash(data.password, 12);
        delete data.password;

        const updatedUser = await usersRepo.updateUser(id, {...data, passwordHash });
        if (!updatedUser) throw new NotFoundError("User not found");
        return updatedUser;
    }

    const updatedUser = await usersRepo.updateUser(id, data);
    if (!updatedUser) throw new NotFoundError("User not found");
    return updatedUser;
}

export async function changeUserPassword(userEmail: string, { currentPassword, newPassword }: ChangePassword): Promise<{ message: string }> {
    if (!currentPassword || !newPassword) throw new UnprocessableEntityError('Current and new passwords are required');
    const user = await usersRepo.findByEmailWithPassword(userEmail);
    if (!user) throw new UnprocessableEntityError('User not found');
    const passwordMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!passwordMatch) throw new UnprocessableEntityError('Invalid current password');
    const newPasswordHash = await bcrypt.hash(newPassword, 12);
    await usersRepo.updateUser(user.id, { passwordHash: newPasswordHash });

    return { message: 'Password updated successfully' };
}