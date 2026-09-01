import { z } from "zod";

export const DEAL_TYPES = ['sale', 'rent'] as const;
export const PROPERTY_TYPES = ['flat', 'house', 'room', 'commercial'] as const;
export const STATUSES = ['draft', 'moderation', 'published', 'rejected', 'unpublished'] as const;
export const SORT_FIELDS = ['price', 'area', 'publishedAt', 'createdAt'] as const;

export const createListingSchema = z.object({
    districtId: z.coerce.number().int().positive(),
    title: z.string().min(1, 'Title is required'),
    description: z.string().optional(),
    dealType: z.enum(DEAL_TYPES),
    propertyType: z.enum(PROPERTY_TYPES),
    price: z.coerce.number().positive(),
    area: z.coerce.number().positive(),
    rooms: z.coerce.number().int().positive().optional(),
    floor: z.coerce.number().int().positive().optional(),
    totalFloors: z.coerce.number().int().positive().optional(),
    address: z.string().min(1, 'Address is required'),
    lat: z.coerce.number().min(-90).max(90),
    lng: z.coerce.number().min(-180).max(180),
});

export const updateListingSchema = createListingSchema.partial();

export const changeListingStatusSchema = z
    .object({
        status: z.enum(STATUSES),
        rejectionReason: z.string().min(1).optional(),
    })
    .refine((data) => data.status !== 'rejected' || !!data.rejectionReason, {
        message: 'Rejection reason is required',
        path: ['rejectionReason'],
    });

export const listingsListQuerySchema = z.object({
    dealType: z.enum(DEAL_TYPES).optional(),
    propertyType: z.enum(PROPERTY_TYPES).optional(),
    districtId: z.coerce.number().int().positive().optional(),
    status: z.enum(STATUSES).optional(),
    priceMin: z.coerce.number().nonnegative().optional(),
    priceMax: z.coerce.number().positive().optional(),
    areaMin: z.coerce.number().nonnegative().optional(),
    areaMax: z.coerce.number().positive().optional(),
    rooms: z
        .string()
        .transform((s) => s.split(',').map(Number))
        .optional(),
    search: z.string().optional(),
    latMin: z.coerce.number().min(-90).max(90).optional(),
    latMax: z.coerce.number().min(-90).max(90).optional(),
    lngMin: z.coerce.number().min(-180).max(180).optional(),
    lngMax: z.coerce.number().min(-180).max(180).optional(),
    sortBy: z.enum(SORT_FIELDS).optional().default('createdAt'),
    sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
    page: z.coerce.number().int().positive().optional().default(1),
    limit: z.coerce.number().int().positive().max(2000).optional().default(20),
});

export type CreateListingBody = z.infer<typeof createListingSchema>;
export type UpdateListingBody = z.infer<typeof updateListingSchema>;
export type ChangeListingStatusBody = z.infer<typeof changeListingStatusSchema>;
export type ListingsListQuery = z.infer<typeof listingsListQuerySchema>;