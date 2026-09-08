import 'axios';

declare module 'axios' {
    interface InternalAxiosRequestConfig {
        _retry?: boolean;
    }
}

export type ApiErrorType = {
    message: string;
    details?: unknown;
    code?: string | null;
};

export type ApiResponseType<TData = unknown, TMeta = unknown> = {
    data: TData | null;
    error: ApiErrorType | null;
    meta: TMeta | null;
};

export type PaginationMetaType = {
    page: number;
    totalPages: number;
};