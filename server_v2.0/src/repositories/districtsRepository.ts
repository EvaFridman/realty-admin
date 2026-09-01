import { db } from "../../database/models";
import type { District } from "../../database/models/district";
import type { CreateDistrictBody, UpdateDistrictBody } from "../schemas/districtsSchema";

export async function findAllDistricts(): Promise<District[]> {
    return db.District.findAll();
}

export async function findDistrictById(id: number): Promise<District | null> {
    return db.District.findByPk(id);
}

export async function createDistrict(data: CreateDistrictBody): Promise<District> {
    return db.District.create(data);
}

export async function updateDistrict(id: number, data: UpdateDistrictBody): Promise<District | null> {
    await db.District.update(data, { where: { id } });
    return findDistrictById(id);
}