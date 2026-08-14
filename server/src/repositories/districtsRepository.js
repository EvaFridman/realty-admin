const { District } = require('../../database/models');

async function findAllDistricts() {
    return District.findAll();
}

async function findDistrictById(id) {
    return District.findByPk(id);
}

async function createDistrict(data) {
    return District.create(data);
}

async function updateDistrict(id, data) {
    await District.update(data, { where: { id } });
    return findDistrictById(id);
}

module.exports = { findAllDistricts, findDistrictById, createDistrict, updateDistrict };