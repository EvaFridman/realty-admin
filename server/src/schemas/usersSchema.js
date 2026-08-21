const { z } = require('zod');

const createUserSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  password: z.string().min(6),
  phone: z.string().min(5),
  role: z.enum(['agent', 'moderator']).optional().default('agent'),
});

const updateUserSchema = createUserSchema.partial();

module.exports = { createUserSchema, updateUserSchema };