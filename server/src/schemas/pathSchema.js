const { z } = require('zod');

const pathIdSchema = z.object({
    id: z.coerce.number({ invalid_type_error: 'id has to be a number' }).int().positive(),
});

const listingPhotoParamsSchema = z.object({
    id: z.coerce.number().int().positive(),
    photoId: z.coerce.number().int().positive(),
});

const userFavoriteParamsSchema = z.object({
    id: z.coerce.number().int().positive(),
    listingId: z.coerce.number().int().positive(),
});

module.exports = { pathIdSchema, listingPhotoParamsSchema, userFavoriteParamsSchema };