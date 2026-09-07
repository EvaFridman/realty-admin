// import { lazy, Suspense } from 'react';
// import { Routes, Route } from 'react-router';

// import { AuthProvider } from '@/features/auth';

// import { TitleProvider } from '@/app/providers/TitleProvider';
// import Layout from './routes/Layout';
// import PageLoader from '@/shared/ui/PageLoader';
// import LoginPage from '@/pages/LoginPage';
// import NotFoundPage from '@/pages/NotFoundPage';
// import RequireAuthGuard from '@/app/guards/RequireAuthGuard';
// import RequireRoleGuard from '@/app/guards/RequireRoleGuard';

// const QueuePage = lazy(() => import('@/pages/QueuePage'));
// const ListingsPage = lazy(() => import('@/pages/ListingsPage'));
// const ListingPage = lazy(() => import('@/pages/ListingPage'));
// const ViewingsPage = lazy(() => import('@/pages/ViewingsPage'));
// const DistrictsPage = lazy(() => import('@/pages/DistrictsPage'));
// const UsersListPage = lazy(() => import('@/pages/UsersListPage'));
// const UserDetailPage = lazy(() => import('@/pages/UserDetailPage'));
// const UserCreatePage = lazy(() => import('@/pages/UserCreatePage'));
// const ProfilePage = lazy(() => import('@/pages/ProfilePage'));

// function App() {
//     return (
//         <TitleProvider>
//             <Suspense fallback={<PageLoader />}>
//                 <Routes>
//                     <Route path="/login" element={<LoginPage />} />

//                     <Route
//                         path="/"
//                         element={
//                             <RequireAuthGuard>
//                                 <RequireRoleGuard roles={['moderator']}>
//                                     <Layout />
//                                 </RequireRoleGuard>
//                             </RequireAuthGuard>
//                         }
//                     >
//                         <Route index element={<QueuePage />} />
//                         <Route path="listings" element={<ListingsPage />} />
//                         <Route path="listings/:id" element={<ListingPage />} />
//                         <Route path="viewings" element={<ViewingsPage />} />
//                         <Route path="districts" element={<DistrictsPage />} />
//                         <Route path="users" element={<UsersListPage />} />
//                         <Route path="users/new" element={<UserCreatePage />} />
//                         <Route path="users/:id" element={<UserDetailPage />} />
//                         <Route path="profile" element={<ProfilePage />} />
//                     </Route>

//                     <Route path="*" element={<NotFoundPage />} />
//                 </Routes>
//             </Suspense>
//         </TitleProvider>
//     );
// }

// export default App;