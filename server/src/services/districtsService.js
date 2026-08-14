const districtsRepo = require('../repositories/districtsRepository');
const { NotFoundError } = require('../errors/AppError');

async function listDistricts() {
    return districtsRepo.findAllDistricts();
}

async function getDistrictById(id) {
    const district = await districtsRepo.findDistrictById(id);
    if (!district) throw new NotFoundError('District not found');
    return district;
}

async function createDistrict(data) {
    return districtsRepo.createDistrict(data);
}

async function updateDistrict(id, data) {
    const district = await districtsRepo.findDistrictById(id);
    if (!district) throw new NotFoundError('District not found');
    return districtsRepo.updateDistrict(id, data);
}

module.exports = { listDistricts, getDistrictById, createDistrict, updateDistrict };