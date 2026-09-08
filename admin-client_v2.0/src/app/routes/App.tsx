import { lazy, Suspense, type ReactElement } from 'react';
import { Route, Routes } from 'react-router';

import { TitleProvider } from '@/app/providers/TitleProvider';
import Layout from '@/app/routes/Layout';

import PageLoader from '@/shared/ui/PageLoader/PageLoader';

import { LoginPage, NotFoundPage, QueuePage } from '@/pages';


import { RequireAuthGuard, RequireRoleGuard } from '../guards';

const ListingsPage = lazy(() => import('@/pages/listings/ListingsPage'));
const ListingPage = lazy(() => import('@/pages/listing/ListingPage'));
const ViewingsPage = lazy(() => import('@/pages/viewings/ViewingsPage'));
const DistrictsPage = lazy(() => import('@/pages/districts/DistrictsPage'));

const UsersListPage = lazy(() => import('@/pages/users/UsersListPage'));
const UserDetailPage = lazy(() => import('@/pages/userDetail/UserDetailPage'));
const UserCreatePage = lazy(() => import('@/pages/userCreate/UserCreatePage'));
const ProfilePage = lazy(() => import('@/pages/profile/ProfilePage'));

function App(): ReactElement {
    return (
        <TitleProvider>
            <Suspense fallback={<PageLoader />}>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />

                    <Route
                        path="/"
                        element={
                            <RequireAuthGuard>
                                <RequireRoleGuard roles={['moderator']}>
                                    <Layout />
                                </RequireRoleGuard>
                            </RequireAuthGuard>
                        }
                    >
                        <Route index element={<QueuePage />} />
                        <Route path="listings" element={<ListingsPage statusFilter={null} />} />
                        <Route path="listings/:id" element={<ListingPage />} />
                        <Route path="viewings" element={<ViewingsPage />} />
                        <Route path="districts" element={<DistrictsPage />} />
                        <Route path="users" element={<UsersListPage />} />
                        <Route path="users/new" element={<UserCreatePage />} />
                        <Route path="users/:id" element={<UserDetailPage />} />
                        <Route path="profile" element={<ProfilePage />} />
                    </Route>

                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </Suspense>
        </TitleProvider>
    );
}

export default App;