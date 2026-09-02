import type { RequestHandler } from "express";
import * as photosService from "../services/listingPhotosService";
import { sendResponse } from "../utils/response";
import type { CreatePhotoBody, UpdatePhotoBody } from "../schemas/listingPhotosSchema";

export const list: RequestHandler<{ id: string }> = async (req, res) => {
        const photos = await photosService.listPhotos(req.user!, Number(req.params.id));
        sendResponse(res, 200, photos, null, null);
}

export const create: RequestHandler<{ id: string }, unknown, CreatePhotoBody> = async (req, res) => {
        const photos = await photosService.addPhoto(req.user!, Number(req.params.id), req.files, req.log);
        sendResponse(res, 201, photos, null, null);
}

export const update: RequestHandler<{ id: string; photoId: string }, unknown, UpdatePhotoBody> = async (req, res) => {
        const photo = await photosService.updatePhoto(req.user!, Number(req.params.id), Number(req.params.photoId), req.body);
        sendResponse(res, 200, photo, null, null);
}

export const remove: RequestHandler<{ id: string; photoId: string }> = async (req, res) => {
        await photosService.deletePhoto(req.user!, Number(req.params.id), Number(req.params.photoId), req.log);
        res.status(204).send();
}

export const setCover: RequestHandler<{ id: string; photoId: string }> = async (req, res) => {
        const photo = await photosService.setCover(req.user!, Number(req.params.id), Number(req.params.photoId));
        sendResponse(res, 200, photo, null, null);
}