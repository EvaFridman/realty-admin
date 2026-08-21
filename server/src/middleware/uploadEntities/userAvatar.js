const createImageUpload = require('../upload');

const avatarUpload = createImageUpload({ folder: "avatars", maxFileSizeMb: 3, maxFiles: 1 }).single('avatar');

module.exports = avatarUpload;