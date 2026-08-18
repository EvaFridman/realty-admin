const { z } = require('zod');

const DEAL_TYPES = ['sale', 'rent'];
const PROPERTY_TYPES = ['flat', 'house', 'room', 'commercial'];
const STATUSES = ['draft', 'moderation', 'published', 'rejected', 'unpublished'];
const SORT_FIELDS = ['price', 'area', 'publishedAt', 'createdAt'];

const createListingSchema = z.object({
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

const updateListingSchema = createListingSchema.partial();

const changeListingStatusSchema = z
    .object({
        status: z.enum(STATUSES),
        rejectionReason: z.string().min(1).optional(),
    })
    .refine((data) => data.status !== 'rejected' || !!data.rejectionReason, {
        message: 'Rejection reason is required',
        path: ['rejectionReason'],
    });

const listingsListQuerySchema = z.object({
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

module.exports = {
    createListingSchema,
    updateListingSchema,
    changeListingStatusSchema,
    listingsListQuerySchema,
    DEAL_TYPES,
    PROPERTY_TYPES,
    STATUSES,
};