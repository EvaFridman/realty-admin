import { USER_ROLES, type AuthUser } from "../../database/models/user";
import * as favoritesRepo from "../repositories/favoritesRepository";
import * as usersRepo from "../repositories/usersRepository";
import * as listingsRepo from "../repositories/listingsRepository";
import { NotFoundError, ConflictError, ForbiddenError } from "../errors/AppError";
import { Favorite } from "../../database/models/favorite";

const FAVORITE_ERRORS = {
    USER_NOT_FOUND: 'User not found',
    LISTING_NOT_FOUND: 'Listing not found',
    FAVORITE_NOT_FOUND: 'Favorite not found',
    ALREADY_EXISTS: 'Listing is already in favorites',
    FORBIDDEN_LIST: "Not enough rights to view this user's favorites",
    FORBIDDEN_ADD: 'Not enough rights to add favorite for this user',
    FORBIDDEN_UPDATE: 'Not enough rights to update this favorite',
    FORBIDDEN_DELETE: 'Not enough rights to delete this favorite',
} as const;

export async function listFavorites(user: AuthUser, agentId: number): Promise<Favorite[]> {
    if (user.id !== agentId && user.role !== USER_ROLES.MODERATOR) throw new ForbiddenError(FAVORITE_ERRORS.FORBIDDEN_LIST);
    const userExists = await usersRepo.findUserById(agentId);
    if (!userExists) throw new NotFoundError(FAVORITE_ERRORS.USER_NOT_FOUND);
    return favoritesRepo.findFavoritesByUserId(agentId);
}

export async function addFavorite(user: AuthUser, agentId: number, listingId: number, note: string | null): Promise<Favorite> {
    if (user.id !== agentId && user.role !== USER_ROLES.MODERATOR) throw new ForbiddenError(FAVORITE_ERRORS.FORBIDDEN_ADD);
    const userExists = await usersRepo.findUserById(agentId);
    if (!userExists) throw new NotFoundError(FAVORITE_ERRORS.USER_NOT_FOUND);

    const listing = await listingsRepo.findListingById(listingId);
    if (!listing) throw new NotFoundError(FAVORITE_ERRORS.LISTING_NOT_FOUND);

    const existing = await favoritesRepo.findFavorite(agentId, listingId);
    if (existing) throw new ConflictError(FAVORITE_ERRORS.ALREADY_EXISTS);

    return favoritesRepo.createFavorite(agentId, listingId, note);
}

export async function updateFavorite(user: AuthUser, agentId: number, listingId: number, note: string | null): Promise<Favorite> {
    if (user.id !== agentId && user.role !== USER_ROLES.MODERATOR) throw new ForbiddenError(FAVORITE_ERRORS.FORBIDDEN_UPDATE);
    const existing = await favoritesRepo.findFavorite(agentId, listingId);
    if (!existing) throw new NotFoundError(FAVORITE_ERRORS.FAVORITE_NOT_FOUND);
    const updatedFavorite = await favoritesRepo.updateFavoriteNote(agentId, listingId, note);
    if (!updatedFavorite) throw new NotFoundError(FAVORITE_ERRORS.FAVORITE_NOT_FOUND);
    return updatedFavorite;
}

export async function removeFavorite(user: AuthUser, agentId: number, listingId: number): Promise<void> {
    if (user.id !== agentId && user.role !== USER_ROLES.MODERATOR) throw new ForbiddenError(FAVORITE_ERRORS.FORBIDDEN_DELETE);
    const existing = await favoritesRepo.findFavorite(agentId, listingId);
    if (!existing) throw new NotFoundError(FAVORITE_ERRORS.FAVORITE_NOT_FOUND);
    await favoritesRepo.deleteFavorite(agentId, listingId);
}