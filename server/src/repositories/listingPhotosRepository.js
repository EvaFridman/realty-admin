const { ListingPhoto, sequelize } = require('../../database/models');

async function findPhotosByListingId(listingId) {
    return ListingPhoto.findAll({ where: { listingId }, order: [['position', 'ASC']] });
}

async function findPhotoById(id) {
    return ListingPhoto.findByPk(id);
}

async function createPhoto(listingId, fileData, options = {}) {
    return ListingPhoto.create({listingId, fileName: fileData.fileName, sizeBytes: fileData.sizeBytes, isCover: false, externalUrl: null }, options);
}

async function updatePhoto(id, data) {
    await ListingPhoto.update(data, { where: { id } });
    return findPhotoById(id);
}

async function deletePhoto(id) {
    return ListingPhoto.destroy({ where: { id } });
}

async function setCoverPhoto(listingId, photoId) {
    return sequelize.transaction(async (t) => {
        await ListingPhoto.update({ isCover: false }, { where: { listingId }, transaction: t });
        await ListingPhoto.update({ isCover: true }, { where: { id: photoId }, transaction: t });
        return ListingPhoto.findByPk(photoId, { transaction: t });
    });
}

module.exports = { findPhotosByListingId, findPhotoById, createPhoto, updatePhoto, deletePhoto, setCoverPhoto };