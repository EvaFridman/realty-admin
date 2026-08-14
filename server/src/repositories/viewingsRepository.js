const { Viewing, Listing, User } = require('../../database/models');

async function findAndCountViewings(filters) {
    const { page, limit, sortOrder, status } = filters;
    const where = status ? { status } : {};

    return Viewing.findAndCountAll({
        where,
        include: [{ model: Listing, as: 'listing' }],
        order: [['createdAt', sortOrder]],
        limit,
        offset: (page - 1) * limit,
    });
}

async function findViewingsByListingId(listingId) {
    return Viewing.findAll({ where: { listingId }, order: [['createdAt', 'DESC']] });
}

async function findViewingById(id) {
    return Viewing.findByPk(id, {
        include: [{ model: Listing, as: 'listing', include: [{ model: User, as: 'agent', attributes: ['id', 'name', 'email'] }] }]
    });
}

async function createViewing(listingId, data) {
    return Viewing.create({ ...data, listingId, status: 'created' });
}

async function updateViewingStatus(id, status) {
    await Viewing.update({ status }, { where: { id } });
    return findViewingById(id);
}

async function markNotified(id) {
    await Viewing.update({ notifiedAt: new Date() }, { where: { id } });
}

module.exports = { findViewingsByListingId, findViewingById, createViewing, updateViewingStatus, markNotified, findAndCountViewings };