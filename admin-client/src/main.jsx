import './index.css'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { ModeratorProvider } from './moderator/ModeratorProvider';

createRoot(document.getElementById('root')).render(
    <ModeratorProvider>
        <App />
    </ModeratorProvider>
);