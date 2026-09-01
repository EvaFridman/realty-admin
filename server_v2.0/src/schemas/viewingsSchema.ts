import { z } from "zod";

export const VIEWING_STATUSES = ['created', 'pending approval', 'approved', 'rejected', 'closed'] as const;

export const createViewingSchema = z.object({
    clientName: z.string().min(2).max(50),
    clientPhone: z.string().min(5),
    clientEmail: z.email(),
    preferredAt: z.coerce.date(),
    comment: z.string().optional(),
});

export const changeViewingStatusSchema = z.object({
    status: z.enum(VIEWING_STATUSES),
});

export const viewingsListQuerySchema = z.object({
    status: z.enum(VIEWING_STATUSES).optional(),
    sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
    page: z.coerce.number().int().positive().optional().default(1),
    limit: z.coerce.number().int().positive().max(100).optional().default(20),
});

export type CreateViewingBody = z.infer<typeof createViewingSchema>;
export type ChangeViewingStatusBody = z.infer<typeof changeViewingStatusSchema>;
export type ViewingsListQuery = z.infer<typeof viewingsListQuerySchema>;