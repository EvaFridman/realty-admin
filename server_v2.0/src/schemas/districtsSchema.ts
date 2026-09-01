import { z } from "zod";

export const createDistrictSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  city: z.string().min(1),
});

export const updateDistrictSchema = createDistrictSchema.partial();

export type CreateDistrictBody = z.infer<typeof createDistrictSchema>;
export type UpdateDistrictBody = z.infer<typeof updateDistrictSchema>;