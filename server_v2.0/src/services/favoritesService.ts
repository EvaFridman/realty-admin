import type { AuthUser } from "../../types/index";
import * as favoritesRepo from "../repositories/favoritesRepository";
import * as usersRepo from "../repositories/usersRepository";
import * as listingsRepo from "../repositories/listingsRepository";
import { NotFoundError, ConflictError, ForbiddenError } from "../errors/AppError";
import { Favorite } from "../../database/models/favorite";

export async function listFavorites(user: AuthUser, agentId: number): Promise<Favorite[]> {
    if (user.id !== agentId && user.role !== 'moderator') throw new ForbiddenError("Not enough rights to view this user's favorites");
    const userExists = await usersRepo.findUserById(agentId);
    if (!userExists) throw new NotFoundError('User not found');
    return favoritesRepo.findFavoritesByUserId(agentId);
}

export async function addFavorite(user: AuthUser, agentId: number, listingId: number, note: string | null): Promise<Favorite> {
    if (user.id !== agentId && user.role !== 'moderator') throw new ForbiddenError('Not enough rights to add favorite for this user');
    const userExists = await usersRepo.findUserById(agentId);
    if (!userExists) throw new NotFoundError('User not found');

    const listing = await listingsRepo.findListingById(listingId);
    if (!listing) throw new NotFoundError('Listing not found');

    const existing = await favoritesRepo.findFavorite(agentId, listingId);
    if (existing) throw new ConflictError('Listing is already in favorites');

    return favoritesRepo.createFavorite(agentId, listingId, note);
}

export async function updateFavorite(user: AuthUser, agentId: number, listingId: number, note: string | null): Promise<Favorite> {
    if (user.id !== agentId && user.role !== 'moderator') throw new ForbiddenError('Not enough rights to update this favorite');
    const existing = await favoritesRepo.findFavorite(agentId, listingId);
    if (!existing) throw new NotFoundError('Favorite not found');
    const updatedFavorite = await favoritesRepo.updateFavoriteNote(agentId, listingId, note);
    if (!updatedFavorite) throw new NotFoundError("Favorite not found");
    return updatedFavorite;
}

export async function removeFavorite(user: AuthUser, agentId: number, listingId: number): Promise<void> {
    if (user.id !== agentId && user.role !== 'moderator') throw new ForbiddenError('Not enough rights to delete this favorite');
    const existing = await favoritesRepo.findFavorite(agentId, listingId);
    if (!existing) throw new NotFoundError('Favorite not found');
    await favoritesRepo.deleteFavorite(agentId, listingId);
}