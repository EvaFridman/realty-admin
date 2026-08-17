import './index.css'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import App from './app/App.jsx'
import { ModeratorProvider } from "./features/moderator/ModeratorProvider.jsx";
import { AlertProvider } from "./components/common/AlertProvider.jsx";

createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        <AlertProvider>
            <ModeratorProvider>
                <App />
            </ModeratorProvider>
        </AlertProvider>
    </BrowserRouter>
);