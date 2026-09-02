import type { RequestHandler } from "express";
import * as districtsService from "../services/districtsService";
import { sendResponse } from "../utils/response";
import type { CreateDistrictBody, UpdateDistrictBody } from "../schemas/districtsSchema";

export const list: RequestHandler = async (req, res) => {
    const districts = await districtsService.listDistricts();
    sendResponse(res, 200, districts, null, null);
}

export const getById: RequestHandler<{ id: string }> = async (req, res) => {
    const district = await districtsService.getDistrictById(Number(req.params.id));
    sendResponse(res, 200, district, null, null);
}

export const create: RequestHandler<Record<string, never>, unknown, CreateDistrictBody> = async (req, res) => {
    const district = await districtsService.createDistrict(req.body);
    sendResponse(res, 201, district, null, null);
}

export const update: RequestHandler<{ id: string }, unknown, UpdateDistrictBody> = async (req, res) => {
    const district = await districtsService.updateDistrict(Number(req.params.id), req.body);
    sendResponse(res, 200, district, null, null);
}