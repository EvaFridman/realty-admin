import { z } from "zod";

export const pathIdSchema = z.object({
    id: z.coerce.number().int().positive(),
});

export const listingPhotoParamsSchema = z.object({
    id: z.coerce.number().int().positive(),
    photoId: z.coerce.number().int().positive(),
});

export const userFavoriteParamsSchema = z.object({
    id: z.coerce.number().int().positive(),
    listingId: z.coerce.number().int().positive(),
});

export type PathId = z.infer<typeof pathIdSchema>;
export type ListingPhotoParams = z.infer<typeof listingPhotoParamsSchema>;
export type UserFavoriteParams = z.infer<typeof userFavoriteParamsSchema>;