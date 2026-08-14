const { z } = require('zod');

const createDistrictSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  city: z.string().min(1),
});

const updateDistrictSchema = createDistrictSchema.partial();

module.exports = { createDistrictSchema, updateDistrictSchema };