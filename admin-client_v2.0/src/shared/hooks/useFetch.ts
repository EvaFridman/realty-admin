import axios from 'axios';
import { useEffect, useRef, useState, type DependencyList } from 'react';

import type { ApiResponseType } from '../api/types';

type RequestType<T, TMeta> = (
    signal: AbortSignal,
) => Promise<ApiResponseType<T, TMeta>>;

type UseFetchResultType<T, TMeta> = {
    data: T | null;
    meta: TMeta | null;
    isLoading: boolean;
    error: string | null;
    errorStatus: number | null;
    hasResponse: boolean;
};

export default function useFetch<T, TMeta = unknown>(
    request: RequestType<T, TMeta>,
    dependencies: DependencyList = [],
): UseFetchResultType<T, TMeta> {
    const requestRef = useRef(request);
    const [data, setData] = useState<T | null>(null);
    const [meta, setMeta] = useState<TMeta | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [errorStatus, setErrorStatus] = useState<number | null>(null);
    const [hasResponse, setHasResponse] = useState(false);

    useEffect(() => {
        requestRef.current = request;
    }, [request]);

    useEffect(() => {
        const controller = new AbortController();

        async function load(): Promise<void> {
            setIsLoading(true);
            setError(null);
            setErrorStatus(null);
            setHasResponse(false);
            setData(null);
            setMeta(null);

            try {
                const result = await requestRef.current(controller.signal);
                setData(result.data);
                setMeta(result.meta);
            } catch (err: unknown) {
                if (axios.isCancel(err)) {
                    return;
                }

                if (axios.isAxiosError<ApiResponseType>(err)) {
                    setErrorStatus(err.response?.status ?? null);
                    setHasResponse(err.response !== undefined);

                    const errorMessage = err.response?.data.error?.message ?? err.message;

                    setError(errorMessage);
                } else if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError('Unknown Error');
                }
            } finally {
                if (!controller.signal.aborted) {
                    setIsLoading(false);
                }
            }
        }

        void load();

        return () => { controller.abort() };

        // dependencies intentionally come from the hook's public API
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, dependencies);

    return { data, meta, isLoading, error, errorStatus, hasResponse };
}