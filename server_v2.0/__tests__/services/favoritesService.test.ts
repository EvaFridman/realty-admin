import * as favoritesService from "../../src/services/favoritesService";
import * as favoritesRepo from "../../src/repositories/favoritesRepository";
import * as usersRepo from "../../src/repositories/usersRepository";
import * as listingsRepo from "../../src/repositories/listingsRepository";
import { NotFoundError, ConflictError, ForbiddenError } from "../../src/errors/AppError";
import { USER_ROLES, type AuthUser } from "../../database/models/user";
import { Favorite } from "../../database/models/favorite";
import { User } from "../../database/models/user";
import { Listing } from "../../database/models/listing";

jest.mock("../../src/repositories/favoritesRepository");
jest.mock("../../src/repositories/usersRepository");
jest.mock("../../src/repositories/listingsRepository");

const mockedFavoritesRepo = jest.mocked(favoritesRepo);
const mockedUsersRepo = jest.mocked(usersRepo);
const mockedListingsRepo = jest.mocked(listingsRepo);

const owner: AuthUser = {
    id: 1,
    role: USER_ROLES.AGENT,
};

const other: AuthUser = {
    id: 99,
    role: USER_ROLES.AGENT,
};

const moderator: AuthUser = {
    id: 2,
    role: USER_ROLES.MODERATOR,
};

describe("favoritesService", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("listFavorites", () => {
        it("should return favorites if user is owner", async () => {
            mockedUsersRepo.findUserById.mockResolvedValue(
                { id: 1 } as User
            );
            mockedFavoritesRepo.findFavoritesByUserId.mockResolvedValue([
                { id: 1 } as Favorite,
            ]);

            const result = await favoritesService.listFavorites(owner, 1);

            expect(result).toEqual([{ id: 1 }]);
        });

        it("should allow moderator to view any favorites", async () => {
            mockedUsersRepo.findUserById.mockResolvedValue(
                { id: 1 } as User
            );
            mockedFavoritesRepo.findFavoritesByUserId.mockResolvedValue([]);

            await favoritesService.listFavorites(moderator, 1);

            expect(
                mockedFavoritesRepo.findFavoritesByUserId
            ).toHaveBeenCalledWith(1);
        });

        it("should throw ForbiddenError if not owner and not moderator", async () => {
            await expect(
                favoritesService.listFavorites(other, 1)
            ).rejects.toThrow(ForbiddenError);
        });

        it("should throw NotFoundError if user not found", async () => {
            mockedUsersRepo.findUserById.mockResolvedValue(null);

            await expect(
                favoritesService.listFavorites(owner, 1)
            ).rejects.toThrow(NotFoundError);
        });
    });

    describe("addFavorite", () => {
        it("should add favorite if user and listing exist and not already favorite", async () => {
            mockedUsersRepo.findUserById.mockResolvedValue(
                { id: 1 } as User
            );
            mockedListingsRepo.findListingById.mockResolvedValue(
                { id: 2 } as Listing
            );
            mockedFavoritesRepo.findFavorite.mockResolvedValue(null);
            mockedFavoritesRepo.createFavorite.mockResolvedValue({
                userId: 1,
                listingId: 2,
            } as Favorite);

            const result = await favoritesService.addFavorite(
                owner,
                1,
                2,
                "note"
            );

            expect(result).toEqual({
                userId: 1,
                listingId: 2,
            });
        });

        it("should throw ForbiddenError for foreign user", async () => {
            await expect(
                favoritesService.addFavorite(other, 1, 2, "note")
            ).rejects.toThrow(ForbiddenError);
        });

        it("should throw NotFoundError if user not found", async () => {
            mockedUsersRepo.findUserById.mockResolvedValue(null);

            await expect(
                favoritesService.addFavorite(owner, 1, 2, "note")
            ).rejects.toThrow(NotFoundError);
        });

        it("should throw NotFoundError if listing not found", async () => {
            mockedUsersRepo.findUserById.mockResolvedValue(
                { id: 1 } as User
            );
            mockedListingsRepo.findListingById.mockResolvedValue(null);

            await expect(
                favoritesService.addFavorite(owner, 1, 2, "note")
            ).rejects.toThrow(NotFoundError);
        });

        it("should throw ConflictError if favorite already exists", async () => {
            mockedUsersRepo.findUserById.mockResolvedValue(
                { id: 1 } as User
            );
            mockedListingsRepo.findListingById.mockResolvedValue(
                { id: 2 } as Listing
            );
            mockedFavoritesRepo.findFavorite.mockResolvedValue(
                { id: 1 } as Favorite
            );

            await expect(
                favoritesService.addFavorite(owner, 1, 2, "note")
            ).rejects.toThrow(ConflictError);
        });
    });

    describe("updateFavorite", () => {
        it("should update note if favorite exists", async () => {
            mockedFavoritesRepo.findFavorite.mockResolvedValue({
                userId: 1,
                listingId: 2,
            } as Favorite);

            mockedFavoritesRepo.updateFavoriteNote.mockResolvedValue({
                note: "New",
            } as Favorite);

            const result = await favoritesService.updateFavorite(
                owner,
                1,
                2,
                "New"
            );

            expect(result).toEqual({ note: "New" });
        });

        it("should throw ForbiddenError for foreign user", async () => {
            await expect(
                favoritesService.updateFavorite(other, 1, 2, "New")
            ).rejects.toThrow(ForbiddenError);
        });

        it("should throw NotFoundError if favorite not found", async () => {
            mockedFavoritesRepo.findFavorite.mockResolvedValue(null);

            await expect(
                favoritesService.updateFavorite(owner, 1, 2, "New")
            ).rejects.toThrow(NotFoundError);
        });
    });

    describe("removeFavorite", () => {
        it("should delete if favorite exists", async () => {
            mockedFavoritesRepo.findFavorite.mockResolvedValue({
                userId: 1,
                listingId: 2,
            } as Favorite);

            await favoritesService.removeFavorite(owner, 1, 2);

            expect(
                mockedFavoritesRepo.deleteFavorite
            ).toHaveBeenCalledWith(1, 2);
        });

        it("should throw ForbiddenError for foreign user", async () => {
            await expect(
                favoritesService.removeFavorite(other, 1, 2)
            ).rejects.toThrow(ForbiddenError);
        });

        it("should throw NotFoundError if favorite not found", async () => {
            mockedFavoritesRepo.findFavorite.mockResolvedValue(null);

            await expect(
                favoritesService.removeFavorite(owner, 1, 2)
            ).rejects.toThrow(NotFoundError);
        });
    });
});