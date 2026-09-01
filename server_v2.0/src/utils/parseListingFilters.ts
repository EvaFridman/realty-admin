import type { ListingsListQuery } from '../schemas/listingsSchema'

export type ListingFilters = ListingsListQuery & { agentId?: number };

export function parseListingFilters(query: ListingsListQuery): ListingFilters {
    return { ...query, search: query.search?.trim() };
}