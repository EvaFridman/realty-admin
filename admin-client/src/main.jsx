import './index.css'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { ModeratorProvider } from "./features/moderator/ModeratorProvider.jsx";
import { AlertProvider } from "./components/common/AlertProvider.jsx";

createRoot(document.getElementById('root')).render(
    <AlertProvider>
        <ModeratorProvider>
            <App />
        </ModeratorProvider>
    </AlertProvider>
);