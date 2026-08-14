const favoritesService = require('../../src/services/favoritesService');
const favoritesRepo = require('../../src/repositories/favoritesRepository');
const usersRepo = require('../../src/repositories/usersRepository');
const listingsRepo = require('../../src/repositories/listingsRepository');
const { NotFoundError, ConflictError } = require('../../src/errors/AppError');

jest.mock('../../src/repositories/favoritesRepository');
jest.mock('../../src/repositories/usersRepository');
jest.mock('../../src/repositories/listingsRepository');

describe('favoritesService', () => {
    beforeEach(() => jest.clearAllMocks());

    describe('listFavorites', () => {
        it('should return favorites if user exists', async () => {
            const user = { id: 1 };
            const favorites = [{ id: 1 }];
            usersRepo.findUserById.mockResolvedValue(user);
            favoritesRepo.findFavoritesByUserId.mockResolvedValue(favorites);

            const result = await favoritesService.listFavorites(1);
            expect(result).toEqual(favorites);
            expect(usersRepo.findUserById).toHaveBeenCalledWith(1);
            expect(favoritesRepo.findFavoritesByUserId).toHaveBeenCalledWith(1);
        });

        it('should throw NotFoundError if user not found', async () => {
            usersRepo.findUserById.mockResolvedValue(null);
            await expect(favoritesService.listFavorites(1)).rejects.toThrow(NotFoundError);
        });
    });

    describe('addFavorite', () => {
        const user = { id: 1 };
        const listing = { id: 2 };
        const favorite = { userId: 1, listingId: 2, note: 'Great' };

        it('should add favorite if user and listing exist and not already favorite', async () => {
            usersRepo.findUserById.mockResolvedValue(user);
            listingsRepo.findListingById.mockResolvedValue(listing);
            favoritesRepo.findFavorite.mockResolvedValue(null);
            favoritesRepo.createFavorite.mockResolvedValue(favorite);

            const result = await favoritesService.addFavorite(1, 2, 'Great');
            expect(result).toEqual(favorite);
            expect(favoritesRepo.createFavorite).toHaveBeenCalledWith(1, 2, 'Great');
        });

        it('should throw NotFoundError if user not found', async () => {
            usersRepo.findUserById.mockResolvedValue(null);
            await expect(favoritesService.addFavorite(1, 2)).rejects.toThrow(NotFoundError);
        });

        it('should throw NotFoundError if listing not found', async () => {
            usersRepo.findUserById.mockResolvedValue(user);
            listingsRepo.findListingById.mockResolvedValue(null);
            await expect(favoritesService.addFavorite(1, 2)).rejects.toThrow(NotFoundError);
        });

        it('should throw ConflictError if favorite already exists', async () => {
            usersRepo.findUserById.mockResolvedValue(user);
            listingsRepo.findListingById.mockResolvedValue(listing);
            favoritesRepo.findFavorite.mockResolvedValue({ id: 1 });
            await expect(favoritesService.addFavorite(1, 2)).rejects.toThrow(ConflictError);
        });
    });

    describe('updateFavorite', () => {
        it('should update note if favorite exists', async () => {
            const existing = { userId: 1, listingId: 2, note: 'Old' };
            const updated = { ...existing, note: 'New' };
            favoritesRepo.findFavorite.mockResolvedValue(existing);
            favoritesRepo.updateFavoriteNote.mockResolvedValue(updated);

            const result = await favoritesService.updateFavorite(1, 2, 'New');
            expect(result).toEqual(updated);
            expect(favoritesRepo.updateFavoriteNote).toHaveBeenCalledWith(1, 2, 'New');
        });

        it('should throw NotFoundError if favorite not found', async () => {
            favoritesRepo.findFavorite.mockResolvedValue(null);
            await expect(favoritesService.updateFavorite(1, 2, 'New')).rejects.toThrow(NotFoundError);
        });
    });

    describe('removeFavorite', () => {
        it('should delete if favorite exists', async () => {
            const existing = { userId: 1, listingId: 2 };
            favoritesRepo.findFavorite.mockResolvedValue(existing);
            favoritesRepo.deleteFavorite.mockResolvedValue();

            await favoritesService.removeFavorite(1, 2);
            expect(favoritesRepo.deleteFavorite).toHaveBeenCalledWith(1, 2);
        });

        it('should throw NotFoundError if favorite not found', async () => {
            favoritesRepo.findFavorite.mockResolvedValue(null);
            await expect(favoritesService.removeFavorite(1, 2)).rejects.toThrow(NotFoundError);
        });
    });
});