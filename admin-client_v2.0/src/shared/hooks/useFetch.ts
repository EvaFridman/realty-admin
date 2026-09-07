import axios from 'axios';
import { useEffect, useRef, useState, type DependencyList } from 'react';

import type { ApiResponseType } from '../api/types';

type RequestType<T> = (signal: AbortSignal) => Promise<ApiResponseType<T>>;

type UseFetchResultType<T> = {
    data: T | null;
    isLoading: boolean;
    error: string | null;
};

export default function useFetch<T>(request: RequestType<T>, dependencies: DependencyList = []): UseFetchResultType<T> {
    const requestRef = useRef(request);
    const [data, seT] = useState<T | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        requestRef.current = request;
    }, [request]);

     
    useEffect(() => {
        const controller = new AbortController();

        async function load(): Promise<void> {
            setIsLoading(true);
            setError(null);
            seT(null);

            try {
                const result = await requestRef.current(controller.signal);
                seT(result.data);
            } catch (err: unknown) {
                if (axios.isCancel(err)) {
                    return;
                }

                if (axios.isAxiosError<ApiResponseType>(err)) {
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

    return { data, isLoading, error };
}