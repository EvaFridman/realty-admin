import { db } from "../../database/models";
import type { Favorite } from "../../database/models/favorite";

export async function findFavoritesByUserId(userId: number): Promise<Favorite[]> {
    return db.Favorite.findAll({ where: { userId }, include: [{ model: db.Listing, as: 'listing' }] });
}

export async function findFavorite(userId: number, listingId: number): Promise<Favorite | null> {
    return db.Favorite.findOne({ where: { userId, listingId } });
}

export async function createFavorite(userId: number, listingId: number, note: string | null): Promise<Favorite> {
    return db.Favorite.create({ userId, listingId, note, addedAt: new Date() });
}

export async function updateFavoriteNote(userId: number, listingId: number, note: string | null): Promise<Favorite | null> {
    await db.Favorite.update({ note }, { where: { userId, listingId } });
    return findFavorite(userId, listingId);
}

export async function deleteFavorite(userId: number, listingId: number): Promise<number> {
    return db.Favorite.destroy({ where: { userId, listingId } });
}