export type ApiError = {
    message: string;
    details?: unknown;
    code?: string | null;
};

export type ApiResponse<TData = unknown, TMeta = unknown> = {
    data: TData | null;
    error: ApiError | null;
    meta: TMeta | null;
};