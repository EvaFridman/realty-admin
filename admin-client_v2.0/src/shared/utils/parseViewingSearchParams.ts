export function parseViewingSearchParams(params: URLSearchParams) {
    return {
        status: params.get('status') ?? '',
        sortOrder: params.get('sortOrder') ?? 'desc',
        page: Number(params.get('page')) || 1,
        limit: Number(params.get('limit')) || 20,
    };
}