import { useEffect, useState } from 'react';

export default function useFetch(fetchFn) {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const controller = new AbortController();

        async function load() {
            setIsLoading(true);
            setError(null);

            try {
                const result = await fetchFn(controller.signal);
                setData(result);
            } catch (err) {
                if (err.name !== 'AbortError') setError(err.message);
            } finally {
                setIsLoading(false);
            }
        }
        load();
        return () => controller.abort();
    }, [fetchFn]);

    return { data, isLoading, error };
}