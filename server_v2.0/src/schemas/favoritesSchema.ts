import { z } from "zod";

export const createFavoriteSchema = z.object({
    listingId: z.coerce.number().int().positive(),
    note: z.string().optional(),
});

export const updateFavoriteSchema = z.object({
    note: z.string().optional(),
});

export type CreateFavoriteBody = z.infer<typeof createFavoriteSchema>;
export type UpdateFavoriteBody = z.infer<typeof updateFavoriteSchema>;