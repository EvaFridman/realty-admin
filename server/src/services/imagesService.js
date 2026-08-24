const fs = require('fs').promises;
const path = require('path');
const defaultLogger = require('../../logger');

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

const deletePhysicalFile = async (fileName, subfolder = 'photos', log = defaultLogger) => {
    if (!fileName) return;
    const filePath = path.join(__dirname, '..', 'uploads', subfolder, fileName);

    try {
        await fs.access(filePath);
        await fs.unlink(filePath);
        log.info({ fileName, subfolder }, 'File deleted successfully');
    } catch (error) {
        log.warn({ fileName, subfolder, code: error.code }, 'Orphan file cleanup failed');
    }
};

module.exports = { toPhotoDto, deletePhysicalFile, buildImageUrl };