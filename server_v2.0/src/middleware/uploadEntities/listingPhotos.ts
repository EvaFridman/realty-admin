import type { RequestHandler } from "express";
import { createImageUpload } from "../upload";

export const listingPhotosUpload: RequestHandler = createImageUpload({ folder: "photos", maxFileSizeMb: 5, maxFiles: 5 }).array('photos');