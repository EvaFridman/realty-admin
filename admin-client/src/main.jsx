import './index.css';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import App from './app/App.jsx';
import { AlertProvider } from './components/common/AlertProvider.jsx';
import AuthProvider from './api/auth/AuthProvider.jsx';
import SocketProvider from './realtime/SocketProvider.jsx';
import { getAccessToken, setAccessToken } from './api/tokenStore.js';
import { refreshTokens } from './api/client.js';

if ("serviceWorker" in navigator) {
    const registerSW = () =>
        navigator.serviceWorker.register(`/sw.js?apiBase=${encodeURIComponent(import.meta.env.VITE_API_BASE_URL)}`);

    if (document.readyState === "complete") {
        registerSW();
    } else {
        window.addEventListener("load", registerSW);
    }

    navigator.serviceWorker.addEventListener("message", async (event) => {
        if (!event.ports || !event.ports[0]) return;

        if (event.data?.type === "GET_TOKEN") {
            event.ports[0].postMessage(getAccessToken());
        }

        if (event.data?.type === "REFRESH_TOKENS") {
            try {
                const envelope = await refreshTokens();
                const newToken = envelope?.data?.accessToken;
                setAccessToken(newToken);
                event.ports[0].postMessage(newToken);
            } catch (err) {
                event.ports[0].postMessage(null);
            }
        }
    });
}

createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        <AlertProvider>
            <AuthProvider>
                <SocketProvider>
                    <App />
                </SocketProvider>
            </AuthProvider>
        </AlertProvider>
    </BrowserRouter>
);