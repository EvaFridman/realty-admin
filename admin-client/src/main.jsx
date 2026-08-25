import './index.css';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import App from './app/App.jsx';
import { AlertProvider } from './components/common/AlertProvider.jsx';
import AuthProvider from './api/auth/AuthProvider.jsx';
import SocketProvider from './realtime/SocketProvider.jsx';

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