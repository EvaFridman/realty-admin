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

const viewingsListQuerySchema = z.object({
    status: z.enum(VIEWING_STATUSES).optional(),
    sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
    page: z.coerce.number().int().positive().optional().default(1),
    limit: z.coerce.number().int().positive().max(100).optional().default(20),
});

module.exports = { createViewingSchema, changeViewingStatusSchema, viewingsListQuerySchema, VIEWING_STATUSES };