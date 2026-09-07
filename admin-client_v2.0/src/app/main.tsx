// import './styles/index.css';

// import { createRoot } from 'react-dom/client';
// import { BrowserRouter } from 'react-router';

// // import App from './routes/App';
// import { AlertProvider } from './providers/AlertProvider';
// import AuthProvider from '@/features/auth/provider/AuthProvider';
// // import SocketProvider from '@/realtime/SocketProvider';

// import { getAccessToken, setAccessToken } from '@/shared/api';
// import { refreshTokens } from '@/shared/api';

// const root = document.getElementById('root');

// if (!root) throw new Error('Root element not found');

// if ('serviceWorker' in navigator) {
//     const registerSW = (): void => {
//         void navigator.serviceWorker.register(
//             `/sw.js?apiBase=${encodeURIComponent(import.meta.env.VITE_API_BASE_URL)}`
//         );
//     };

//     if (document.readyState === 'complete') {
//         registerSW();
//     } else {
//         window.addEventListener('load', registerSW);
//     }

//     navigator.serviceWorker.addEventListener('message', async (event: MessageEvent): Promise<void> => {
//         if (!event.ports || !event.ports[0]) return;

//         if (event.data?.type === 'GET_TOKEN') {
//             event.ports[0].postMessage(getAccessToken());
//         }

//         if (event.data?.type === 'REFRESH_TOKENS') {
//             try {
//                 const envelope = await refreshTokens();
//                 const newToken = envelope?.data?.accessToken;

//                 setAccessToken(newToken);
//                 event.ports[0].postMessage(newToken);
//             } catch {
//                 event.ports[0].postMessage(null);
//             }
//         }
//     });
// }

// createRoot(root).render(
//     <BrowserRouter>
//         <AlertProvider>
//             <AuthProvider>
//                 {/* <SocketProvider>
//                     <App />
//                 </SocketProvider> */}
//             </AuthProvider>
//         </AlertProvider>
//     </BrowserRouter>
// );