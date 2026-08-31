export type HTTPErrorType = {
    message: string;
    details?: unknown;
    code?: string | null;
};

export type HTTPResponseType<TData = unknown, TMeta = unknown> = {
    data: TData | null;
    error: HTTPErrorType | null;
    meta: TMeta | null;
};