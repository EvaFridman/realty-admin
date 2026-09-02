import * as districtsRepo from "../repositories/districtsRepository";
import { NotFoundError } from "../errors/AppError";
import { District } from "../../database/models/district";
import type { CreateDistrictBody, UpdateDistrictBody } from "../schemas/districtsSchema";

export async function listDistricts(): Promise<District[]> {
    return districtsRepo.findAllDistricts();
}

export async function getDistrictById(id: number): Promise<District> {
    const district = await districtsRepo.findDistrictById(id);
    if (!district) throw new NotFoundError('District not found');
    return district;
}

export async function createDistrict(data: CreateDistrictBody): Promise<District> {
    return districtsRepo.createDistrict(data);
}

export async function updateDistrict(id: number, data: UpdateDistrictBody): Promise<District> {
    const district = await districtsRepo.findDistrictById(id);
    if (!district) throw new NotFoundError('District not found');
    const updatedDistrict = await districtsRepo.updateDistrict(id, data);
    if (!updatedDistrict) throw new NotFoundError("District not found");
    return updatedDistrict;
}