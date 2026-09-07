import { useEffect, useState } from 'react';

export function useServiceWorkerImageReload(): number {
    const [imageReloadKey, setImageReloadKey] = useState(0);

    useEffect(() => {
        if (!('serviceWorker' in navigator)) return;
        function handleControllerChange(): void { setImageReloadKey((prev) => prev + 1) }
        navigator.serviceWorker.addEventListener('controllerchange', handleControllerChange);

        return () => { navigator.serviceWorker.removeEventListener('controllerchange', handleControllerChange) };
    }, []);

    return imageReloadKey;
}