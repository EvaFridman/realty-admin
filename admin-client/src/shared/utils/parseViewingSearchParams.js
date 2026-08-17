export function parseViewingSearchParams(params) {
    return {
        status: params.get('status') ?? '',
        sortOrder: params.get('sortOrder') ?? 'desc',
        page: Number(params.get('page')) || 1,
        limit: Number(params.get('limit')) || 20,
    };
}