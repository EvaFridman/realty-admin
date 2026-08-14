const { z } = require('zod');

const createFavoriteSchema = z.object({
    listingId: z.coerce.number().int().positive(),
    note: z.string().optional(),
});

const updateFavoriteSchema = z.object({
    note: z.string().optional(),
});

module.exports = { createFavoriteSchema, updateFavoriteSchema };