const { User } = require('../../database/models');

async function findAllUsers() {
    return User.findAll();
}

async function findUserById(id) {
    return User.findByPk(id);
}

async function createUser(data) {
    return User.create(data);
}

async function updateUser(id, data) {
    await User.update(data, { where: { id } });
    return findUserById(id);
}

module.exports = { findAllUsers, findUserById, createUser, updateUser };