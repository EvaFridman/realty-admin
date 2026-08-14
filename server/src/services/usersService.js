const usersRepo = require('../repositories/usersRepository');
const { NotFoundError } = require('../errors/AppError');

async function listUsers() {
    return usersRepo.findAllUsers();
}

async function getUserById(id) {
    const user = await usersRepo.findUserById(id);
    if (!user) throw new NotFoundError('User not found');
    return user;
}

async function createUser(data) {
    return usersRepo.createUser(data);
}

async function updateUser(id, data) {
    const user = await usersRepo.findUserById(id);
    if (!user) throw new NotFoundError('User not found');
    return usersRepo.updateUser(id, data);
}

module.exports = { listUsers, getUserById, createUser, updateUser };