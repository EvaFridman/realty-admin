const createImageUpload = require('../upload');

const listingPhotosUpload = createImageUpload({ folder: "photos", maxFileSizeMb: 5, maxFiles: 5 }).array('photos');

module.exports = listingPhotosUpload;