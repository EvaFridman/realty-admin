const { z } = require('zod');

const loginSchema = z.object({
    email: z.email(),
    password: z.string().min(8).max(72),
});

const registerSchema = loginSchema.extend({
    role: z.enum(['agent', 'moderator']).default('agent'),
});

module.exports = { loginSchema, registerSchema };