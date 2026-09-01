import { db } from "../../database/models";
import type { Viewing } from "../../database/models/viewing";
import type { CreateViewingBody, ChangeViewingStatusBody, ViewingsListQuery } from "../schemas/viewingsSchema";

export async function findAndCountViewings(filters: ViewingsListQuery): Promise<{ rows: Viewing[]; count: number }> {
    const { page, limit, sortOrder, status } = filters;
    const where = status ? { status } : {};

    return db.Viewing.findAndCountAll({
        where,
        include: [{ model: db.Listing, as: 'listing' }],
        order: [['createdAt', sortOrder]],
        limit,
        offset: (page - 1) * limit,
    });
}

export async function findViewingsByListingId(listingId: number): Promise<Viewing[]>  {
    return db.Viewing.findAll({ where: { listingId }, order: [['createdAt', 'DESC']] });
}

export async function findViewingById(id: number): Promise<Viewing | null>  {
    return db.Viewing.findByPk(id, {
        include: [{ model: db.Listing, as: 'listing', include: [{ model: db.User, as: 'agent', attributes: ['id', 'name', 'email'] }] }]
    });
}

export async function createViewing(listingId: number, data: CreateViewingBody): Promise<Viewing>  {
    return db.Viewing.create({ ...data, listingId, status: 'created' });
}

export async function updateViewingStatus(id: number, { status }: ChangeViewingStatusBody): Promise<Viewing | null>  {
    await db.Viewing.update({ status }, { where: { id } });
    return findViewingById(id);
}

export async function markNotified(id: number): Promise<void> {
    await db.Viewing.update({ notifiedAt: new Date() }, { where: { id } });
}