import type { RequestHandler } from "express";
import * as listingsService from "../services/listingsService";
import { sendResponse } from "../utils/response";
import type { CreateListingBody, UpdateListingBody, ChangeListingStatusBody, ListingsListQuery } from "../schemas/listingsSchema";

export const list: RequestHandler = async (req, res) => {
    const query = req.validatedQuery as ListingsListQuery;
    const { data, meta } = await listingsService.listListings(req.user!, query);
    sendResponse(res, 200, data, null, meta);
}

export const getById: RequestHandler<{ id: string }> = async (req, res) => {
    const listing = await listingsService.getListingById(req.user!, Number(req.params.id));
    sendResponse(res, 200, listing, null, null);
}

export const create: RequestHandler<Record<string, never>, unknown, CreateListingBody> = async (req, res) => {
    const listing = await listingsService.createListing(req.user!, req.body);
    sendResponse(res, 201, listing, null, null);
}

export const update: RequestHandler<{ id: string }, unknown, UpdateListingBody> = async (req, res) => {
    const listing = await listingsService.updateListing(req.user!, Number(req.params.id), req.body);
    sendResponse(res, 200, listing, null, null);
}

export const changeStatus: RequestHandler<{ id: string }, unknown, ChangeListingStatusBody> = async (req, res) => {
    const { status, rejectionReason } = req.body;
    const listing = await listingsService.changeStatus(Number(req.params.id), status, rejectionReason, req.log);
    sendResponse(res, 200, listing, null, null);
}

export const remove: RequestHandler<{ id: string }> = async (req, res) => {
    await listingsService.deleteListing(req.user!, Number(req.params.id), req.log);
    res.status(204).send();
}