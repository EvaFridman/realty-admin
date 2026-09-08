import './styles/index.css';

import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';

import { getAccessToken, setAccessToken, refreshTokens, AuthProvider } from '@/features/auth';

import SocketProvider from './presence/SocketProvider';
import { AlertProvider } from './providers/AlertProvider';
import App from './routes/App';

type ServiceWorkerMessageType = { type: 'GET_TOKEN' } | { type: 'REFRESH_TOKENS' };

function isServiceWorkerMessage(data: unknown, ): data is ServiceWorkerMessageType {
    if (typeof data !== 'object' || data === null) return false;
    const value = data as { type?: unknown };
    return value.type === 'GET_TOKEN' || value.type === 'REFRESH_TOKENS';
}

async function handleTokenRefresh(port: MessagePort): Promise<void> {
    try {
        const envelope = await refreshTokens();
        const newToken = envelope.data?.accessToken ?? null;
        setAccessToken(newToken);
        port.postMessage(newToken);
    } catch {
        port.postMessage(null);
    }
}

if ('serviceWorker' in navigator) {
    const registerSW = (): void => {
        void navigator.serviceWorker.register(
            `/sw.js?apiBase=${encodeURIComponent(import.meta.env.VITE_API_BASE_URL)}`,
        );
    };

    if (document.readyState === 'complete') {
        registerSW();
    } else {
        window.addEventListener('load', registerSW);
    }

    navigator.serviceWorker.addEventListener(
        'message',
        (event: MessageEvent) => {
            const port = event.ports[0];

            if (!port || !isServiceWorkerMessage(event.data)) return;

            if (event.data.type === 'GET_TOKEN') {
                port.postMessage(getAccessToken());
                return;
            }

            void handleTokenRefresh(port);
        },
    );
}

const rootElement = document.getElementById('root');

if (!rootElement) {
    throw new Error('Root element not found');
}

createRoot(rootElement).render(
    <BrowserRouter>
        <AlertProvider>
            <AuthProvider>
                <SocketProvider>
                    <App />
                </SocketProvider>
            </AuthProvider>
        </AlertProvider>
    </BrowserRouter>,
);