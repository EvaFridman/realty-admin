export function parseListingSearchParams(params: URLSearchParams) {
    return {
        dealType: params.get('dealType') ?? '',
        propertyType: params.get('propertyType') ?? '',
        districtId: params.get('districtId') ?? '',
        priceMin: params.get('priceMin') ?? '',
        priceMax: params.get('priceMax') ?? '',
        rooms: params.getAll('rooms').map(Number),
        search: params.get('search') ?? '',
        sortBy: params.get('sortBy') ?? 'createdAt',
        sortOrder: params.get('sortOrder') ?? 'desc',
        page: Number(params.get('page')) || 1,
        limit: Number(params.get('limit')) || 20,
    };
}