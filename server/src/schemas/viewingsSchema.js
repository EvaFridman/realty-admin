const { z } = require('zod');

const VIEWING_STATUSES = ['created', 'pending approval', 'approved', 'rejected', 'closed'];

const createViewingSchema = z.object({
    clientName: z.string().min(2).max(50),
    clientPhone: z.string().min(5),
    clientEmail: z.string().email(),
    preferredAt: z.coerce.date(),
    comment: z.string().optional(),
});

const changeViewingStatusSchema = z.object({
    status: z.enum(VIEWING_STATUSES),
});

module.exports = { createViewingSchema, changeViewingStatusSchema, VIEWING_STATUSES };