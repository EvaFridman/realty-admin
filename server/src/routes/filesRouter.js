const filesRouter = require('express').Router();
const { verifyAccessToken } = require('../middleware/auth');
const checkListingAccess = require('../middleware/checkListingAccess');
const { loadPhotoListing, loadAvatarFile } = require('../middleware/filesMiddleware');
const { sendFile } = require('../controllers/filesController');

filesRouter.get('/photos/:fileName', verifyAccessToken, loadPhotoListing, checkListingAccess, sendFile('photos'));
filesRouter.get('/avatars/:fileName', verifyAccessToken, loadAvatarFile, sendFile('avatars'));

module.exports = filesRouter;