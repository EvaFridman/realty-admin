const favoritesService = require('../../src/services/favoritesService');
const favoritesRepo = require('../../src/repositories/favoritesRepository');
const usersRepo = require('../../src/repositories/usersRepository');
const listingsRepo = require('../../src/repositories/listingsRepository');
const { NotFoundError, ConflictError, ForbiddenError } = require('../../src/errors/AppError');

jest.mock('../../src/repositories/favoritesRepository');
jest.mock('../../src/repositories/usersRepository');
jest.mock('../../src/repositories/listingsRepository');

const owner = { id: 1, role: 'agent' };
const other = { id: 99, role: 'agent' };
const moderator = { id: 2, role: 'moderator' };

describe('favoritesService', () => {
    beforeEach(() => jest.clearAllMocks());

    describe('listFavorites', () => {
        it('should return favorites if user is owner', async () => {
            usersRepo.findUserById.mockResolvedValue({ id: 1 });
            favoritesRepo.findFavoritesByUserId.mockResolvedValue([{ id: 1 }]);

            const result = await favoritesService.listFavorites(owner, 1);
            expect(result).toEqual([{ id: 1 }]);
        });

        it('should allow moderator to view any favorites', async () => {
            usersRepo.findUserById.mockResolvedValue({ id: 1 });
            favoritesRepo.findFavoritesByUserId.mockResolvedValue([]);
            await favoritesService.listFavorites(moderator, 1);
            expect(favoritesRepo.findFavoritesByUserId).toHaveBeenCalledWith(1);
        });

        it('should throw ForbiddenError if not owner and not moderator', async () => {
            await expect(favoritesService.listFavorites(other, 1)).rejects.toThrow(ForbiddenError);
        });

        it('should throw NotFoundError if user not found', async () => {
            usersRepo.findUserById.mockResolvedValue(null);
            await expect(favoritesService.listFavorites(owner, 1)).rejects.toThrow(NotFoundError);
        });
    });

    describe('addFavorite', () => {
        it('should add favorite if user and listing exist and not already favorite', async () => {
            usersRepo.findUserById.mockResolvedValue({ id: 1 });
            listingsRepo.findListingById.mockResolvedValue({ id: 2 });
            favoritesRepo.findFavorite.mockResolvedValue(null);
            favoritesRepo.createFavorite.mockResolvedValue({ userId: 1, listingId: 2 });

            const result = await favoritesService.addFavorite(owner, 1, 2, 'note');
            expect(result).toEqual({ userId: 1, listingId: 2 });
        });

        it('should throw ForbiddenError for foreign user', async () => {
            await expect(favoritesService.addFavorite(other, 1, 2)).rejects.toThrow(ForbiddenError);
        });

        it('should throw NotFoundError if user not found', async () => {
            usersRepo.findUserById.mockResolvedValue(null);
            await expect(favoritesService.addFavorite(owner, 1, 2)).rejects.toThrow(NotFoundError);
        });

        it('should throw NotFoundError if listing not found', async () => {
            usersRepo.findUserById.mockResolvedValue({ id: 1 });
            listingsRepo.findListingById.mockResolvedValue(null);
            await expect(favoritesService.addFavorite(owner, 1, 2)).rejects.toThrow(NotFoundError);
        });

        it('should throw ConflictError if favorite already exists', async () => {
            usersRepo.findUserById.mockResolvedValue({ id: 1 });
            listingsRepo.findListingById.mockResolvedValue({ id: 2 });
            favoritesRepo.findFavorite.mockResolvedValue({ id: 1 });
            await expect(favoritesService.addFavorite(owner, 1, 2)).rejects.toThrow(ConflictError);
        });
    });

    describe('updateFavorite', () => {
        it('should update note if favorite exists', async () => {
            favoritesRepo.findFavorite.mockResolvedValue({ userId: 1, listingId: 2 });
            favoritesRepo.updateFavoriteNote.mockResolvedValue({ note: 'New' });

            const result = await favoritesService.updateFavorite(owner, 1, 2, 'New');
            expect(result).toEqual({ note: 'New' });
        });

        it('should throw ForbiddenError for foreign user', async () => {
            await expect(favoritesService.updateFavorite(other, 1, 2, 'New')).rejects.toThrow(
                ForbiddenError
            );
        });

        it('should throw NotFoundError if favorite not found', async () => {
            favoritesRepo.findFavorite.mockResolvedValue(null);
            await expect(favoritesService.updateFavorite(owner, 1, 2, 'New')).rejects.toThrow(
                NotFoundError
            );
        });
    });

    describe('removeFavorite', () => {
        it('should delete if favorite exists', async () => {
            favoritesRepo.findFavorite.mockResolvedValue({ userId: 1, listingId: 2 });
            favoritesRepo.deleteFavorite.mockResolvedValue();

            await favoritesService.removeFavorite(owner, 1, 2);
            expect(favoritesRepo.deleteFavorite).toHaveBeenCalledWith(1, 2);
        });

        it('should throw ForbiddenError for foreign user', async () => {
            await expect(favoritesService.removeFavorite(other, 1, 2)).rejects.toThrow(
                ForbiddenError
            );
        });

        it('should throw NotFoundError if favorite not found', async () => {
            favoritesRepo.findFavorite.mockResolvedValue(null);
            await expect(favoritesService.removeFavorite(owner, 1, 2)).rejects.toThrow(
                NotFoundError
            );
        });
    });
});