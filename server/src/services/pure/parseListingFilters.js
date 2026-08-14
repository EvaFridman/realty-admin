function parseListingFilters(query = {}) {
    const filters = {};

    if (query.dealType) filters.dealType = query.dealType;
    if (query.propertyType) filters.propertyType = query.propertyType;
    if (query.districtId) filters.districtId = Number(query.districtId);
    if (query.status) filters.status = query.status;
    if (query.priceMin) filters.priceMin = Number(query.priceMin);
    if (query.priceMax) filters.priceMax = Number(query.priceMax);
    if (query.areaMin) filters.areaMin = Number(query.areaMin);
    if (query.areaMax) filters.areaMax = Number(query.areaMax);
    if (query.rooms) { filters.rooms = Array.isArray(query.rooms) ? query.rooms.map(Number) : String(query.rooms).split(',').map(Number) }
    if (query.search) filters.search = String(query.search).trim();
    if (query.latMin) filters.latMin = Number(query.latMin);
    if (query.latMax) filters.latMax = Number(query.latMax);
    if (query.lngMin) filters.lngMin = Number(query.lngMin);
    if (query.lngMax) filters.lngMax = Number(query.lngMax);

    filters.sortBy = query.sortBy || 'createdAt';
    filters.sortOrder = query.sortOrder === 'asc' ? 'asc' : 'desc';
    filters.page = Number(query.page) > 0 ? Number(query.page) : 1;
    filters.limit = Number(query.limit) > 0 ? Math.min(Number(query.limit), 2000) : 20;

    return filters;
}

module.exports = parseListingFilters;