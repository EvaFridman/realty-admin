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

async function findUserWithEmail(email) {
    return User.findOne({where: { email } });
}

async function findByEmailWithPassword(email) {
    return User.unscoped().findOne({
        where: { email },
        attributes: ['id', 'email', 'role', 'passwordHash', 'name', 'phone'],
    });
}

async function findById(id) {
    return User.findByPk(id);
}

async function findAndCountAllUsers({ role, limit, offset }) {
    const where = {};
    if (role) where.role = role;    
    return User.findAndCountAll({  where, limit, offset, order: [['createdAt', 'DESC']] });
}

module.exports = { findAllUsers, findUserById, createUser, updateUser, findUserWithEmail, findByEmailWithPassword, findById, findAndCountAllUsers };