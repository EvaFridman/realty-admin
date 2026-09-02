import type { RequestHandler } from "express";
import * as viewingsService from "../services/viewingsService";
import { sendResponse } from "../utils/response";
import type { CreateViewingBody, ChangeViewingStatusBody, ViewingsListQuery } from "../schemas/viewingsSchema";

export const list: RequestHandler<{ id: string }> = async (req, res) => {
        const viewings = await viewingsService.listViewings(req.user!, Number(req.params.id));
        sendResponse(res, 200, viewings, null, null);
}

export const listAll: RequestHandler = async (req, res) => {
    const query = req.validatedQuery as ViewingsListQuery;
        const { data, meta } = await viewingsService.listAllViewings(query);
        sendResponse(res, 200, data, null, meta);
}

export const create: RequestHandler<{ id: string }, unknown, CreateViewingBody> = async (req, res) => {
        const viewing = await viewingsService.createViewing(Number(req.params.id), req.body, req.log);
        sendResponse(res, 201, viewing, null, null);
}

export const changeStatus: RequestHandler<{ id: string }, unknown, ChangeViewingStatusBody> = async (req, res) => {
        const viewing = await viewingsService.changeStatus(Number(req.params.id), req.body.status, req.log);
        sendResponse(res, 200, viewing, null, null);
}