import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router';
import { TitleProvider } from '../components/common/TitleProvider';
import Layout from './routes/Layout.jsx';
import LoginPage from '../pages/LoginPage.jsx';
import NotFoundPage from '../pages/NotFoundPage.jsx';

const QueuePage = lazy(() => import('../pages/QueuePage.jsx'));
const ListingsPage = lazy(() => import('../pages/ListingsPage.jsx'));
const ListingPage = lazy(() => import('../pages/ListingPage.jsx'));
const ViewingsPage = lazy(() => import('../pages/ViewingsPage.jsx'));
const DistrictsPage = lazy(() => import('../pages/DistrictsPage.jsx'));

function App() {
    return (
        <TitleProvider>
            <Suspense fallback={<div>Загрузка раздела…</div>}>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/" element={<Layout />}>
                        <Route index element={<QueuePage />} />
                        <Route path="listings" element={<ListingsPage />} />
                        <Route path="listings/:id" element={<ListingPage />} />
                        <Route path="viewings" element={<ViewingsPage />} />
                        <Route path="districts" element={<DistrictsPage />} />
                    </Route>
                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </Suspense>
        </TitleProvider>
    );
}

export default App;