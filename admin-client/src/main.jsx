import './index.css';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import App from './app/App.jsx';
import { AlertProvider } from './components/common/AlertProvider.jsx';
import AuthProvider from './api/auth/AuthProvider.jsx';

createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        <AlertProvider>
            <AuthProvider>
                    <App />
            </AuthProvider>
        </AlertProvider>
    </BrowserRouter>
);