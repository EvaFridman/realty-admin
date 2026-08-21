const usersRepo = require('../repositories/usersRepository');
const bcrypt = require('bcryptjs');
const { NotFoundError, ConflictError, UnprocessableEntityError } = require('../errors/AppError');

async function listUsers({ role, page = 1, limit = 20 }) {
    const pageNum = Number(page);
    const limitNum = Number(limit);
    const offset = (pageNum - 1) * limitNum;
    const { rows: users, count } = await usersRepo.findAndCountAllUsers({ role, limit: limitNum, offset });

    return { users, meta: { total: count, page: pageNum, limit: limitNum, totalPages: Math.ceil(count / limitNum) } };
}

async function getUserById(id) {
    const user = await usersRepo.findUserById(id);
    if (!user) throw new NotFoundError('User not found');
    return user;
}

async function createUser(data) {
    const { email, password, name, phone, role } = data;
    const existingUser = await usersRepo.findUserWithEmail(email);
    if (existingUser) throw new ConflictError('User with this email already exists');
    const passwordHash = await bcrypt.hash(password, 12);

    return usersRepo.createUser({ email, passwordHash, name, phone, role: role || 'agent' });
}

async function updateUser(id, data) {
    const user = await usersRepo.findUserById(id);
    if (!user) throw new NotFoundError('User not found');

    if (data.email && data.email !== user.email) {
        const emailExists = await usersRepo.findUserWithEmail(data.email);
        if (emailExists) throw new ConflictError('User with this email already exists');
    }

    if (data.password) {
        data.passwordHash = await bcrypt.hash(data.password, 12);
        delete data.password;
    }

    return usersRepo.updateUser(id, data);
}

async function changeUserPassword(userEmail, currentPassword, newPassword) {
    if (!currentPassword || !newPassword) throw new Error('Current and new passwords are required');
    const user = await usersRepo.findByEmailWithPassword(userEmail);
    if (!user) throw new UnprocessableEntityError('User not found');
    const passwordMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!passwordMatch) throw new UnprocessableEntityError('Invalid current password');
    const newPasswordHash = await bcrypt.hash(newPassword, 12);
    await usersRepo.updateUser(user.id, { passwordHash: newPasswordHash });

    return { message: 'Password updated successfully' };
}

module.exports = { listUsers, getUserById, createUser, updateUser, changeUserPassword };