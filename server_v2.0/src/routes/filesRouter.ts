import { Router } from "express";
import { verifyAccessToken } from "../middleware/auth";
import { checkListingAccess } from "../middleware/checkListingAccess";
import { loadPhotoListing, loadAvatarFile } from "../middleware/filesMiddleware";
import { sendFile } from "../controllers/filesController";

const filesRouter = Router();

filesRouter.get('/photos/:fileName', verifyAccessToken, loadPhotoListing, checkListingAccess, sendFile('photos'));
filesRouter.get('/avatars/:fileName', verifyAccessToken, loadAvatarFile, sendFile('avatars'));

export default filesRouter;