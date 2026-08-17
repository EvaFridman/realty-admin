import { useEffect, useRef, useState } from 'react';

export default function useFetch(request, dependencies = []) {
    const requestRef = useRef(request);
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

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
                setData(result);
            } catch (err) {
                if (err.name !== 'AbortError') {
                    setError(err.message);
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