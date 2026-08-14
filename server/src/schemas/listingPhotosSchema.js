const { z } = require('zod');

const createPhotoSchema = z.object({
  url: z.string().url(),
  position: z.coerce.number().int().nonnegative().optional(),
});

const updatePhotoSchema = z.object({
  position: z.coerce.number().int().nonnegative().optional(),
});

module.exports = { createPhotoSchema, updatePhotoSchema };