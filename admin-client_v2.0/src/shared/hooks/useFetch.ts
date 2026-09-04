import axios from 'axios';
import { useEffect, useRef, useState, type DependencyList } from 'react';

import type { ApiResponse } from '../api/types';

type Request<TData> = (signal: AbortSignal) => Promise<ApiResponse<TData>>;

export default function useFetch<TData>(request: Request<TData>, dependencies: DependencyList = []) {
    const requestRef = useRef(request);
    const [data, setData] = useState<TData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        requestRef.current = request;
    }, [request]);

    useEffect(() => {
        const controller = new AbortController();

        async function load() {
            setIsLoading(true);
            setError(null);
            setData(null);

            try {
                const result = await requestRef.current(controller.signal);
                setData(result.data);
            } catch (err: unknown) {
                if (axios.isCancel(err)) {
                    return;
                }

                if (axios.isAxiosError(err)) {
                    const errorMessage = err.response?.data?.error?.message ?? err.message ?? 'Unknown Error';
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

        load();
        return () => controller.abort();
    }, dependencies);

    return { data, isLoading, error };
}