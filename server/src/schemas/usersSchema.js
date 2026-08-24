const { z } = require('zod');
const { loginSchema, registerSchema } = require('./authSchema');

const createUserSchema = z.object({
  name: registerSchema.shape.name,
  email: loginSchema.shape.email,
  password: loginSchema.shape.password,
  phone: z.string().min(5, 'Телефон слишком короткий'),
  role: z.enum(['agent', 'moderator']).optional().default('agent'),
});

const updateUserSchema = createUserSchema.omit({ role: true }).partial();

module.exports = { createUserSchema, updateUserSchema };