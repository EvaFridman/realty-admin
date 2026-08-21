const fs = require('fs').promises;
const path = require('path');

const buildImageUrl = (folder, fileName) => {
    return `/uploads/${folder}/${fileName}`.replace('//', '/');
};

const toPhotoDto = (photo) => {
    if (!photo) return null;
    const rawPhotoData = photo.get ? photo.get({ plain: true }) : photo;
    const clientUrl = rawPhotoData.externalUrl || buildImageUrl('photos', rawPhotoData.fileName);

    return {
        id: rawPhotoData.id,
        url: clientUrl,
        sizeBytes: rawPhotoData.sizeBytes,
    };
};

const deletePhysicalFile = async (fileName, subfolder = 'photos') => {
    if (!fileName) return;
    const filePath = path.join(__dirname, '..', 'uploads', subfolder, fileName);

    try {
        await fs.access(filePath);
        await fs.unlink(filePath);
        console.log(`File ${fileName} deleted successfully.`);
    } catch (error) {
        console.error("orphan file", fileName, error.code);
    }
};

module.exports = { toPhotoDto, deletePhysicalFile, buildImageUrl };