const fs = require('fs').promises;
const path = require('path');

const UPLOADS_DIR = path.join(__dirname, '..', 'uploads', 'photos');

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

const deletePhysicalFile = async (fileName) => {
    if (!fileName) return;
    const filePath = path.join(UPLOADS_DIR, fileName);

    try {
        await fs.access(filePath);
        await fs.unlink(filePath);
        console.log(`File ${fileName} deleted successfully.`);
    } catch (error) {
        console.error("orphan file", fileName, error.code);
    }
};

module.exports = { toPhotoDto, deletePhysicalFile };