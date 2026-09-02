import type { RequestHandler } from "express";
import * as favoritesService from "../services/favoritesService";
import { sendResponse } from "../utils/response";
import type { CreateFavoriteBody, UpdateFavoriteBody } from "../schemas/favoritesSchema";

export const list: RequestHandler<{ id: string }> = async (req, res) =>  {
        const favorites = await favoritesService.listFavorites(req.user!, Number(req.params.id));
        sendResponse(res, 200, favorites, null, null);
}

export const create: RequestHandler<{ id: string }, unknown, CreateFavoriteBody> = async (req, res) => {
        const favorite = await favoritesService.addFavorite(req.user!, Number(req.params.id), req.body.listingId, req.body.note ?? null);
        sendResponse(res, 201, favorite, null, null);
}

export const update: RequestHandler<{ id: string; listingId: string }, unknown, UpdateFavoriteBody> = async (req, res) => {
        const favorite = await favoritesService.updateFavorite(req.user!, Number(req.params.id), Number(req.params.listingId), req.body.note ?? null);
        sendResponse(res, 200, favorite, null, null);
}

export const remove: RequestHandler<{ id: string; listingId: string }> = async (req, res) => {
        await favoritesService.removeFavorite(req.user!, Number(req.params.id), Number(req.params.listingId));
        res.status(204).send();
}