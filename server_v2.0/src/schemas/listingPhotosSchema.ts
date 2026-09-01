import { z } from "zod";

export const createPhotoSchema = z.object({
  url: z.url(),
  position: z.coerce.number().int().nonnegative().optional(),
});

export const updatePhotoSchema = z.object({
  position: z.coerce.number().int().nonnegative().optional(),
});

export type CreatePhotoBody = z.infer<typeof createPhotoSchema>;
export type UpdatePhotoBody = z.infer<typeof updatePhotoSchema>;