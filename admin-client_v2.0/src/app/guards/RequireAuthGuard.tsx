import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router';

import { useAuth } from '@/features/auth';

import PageLoader from '@/shared/ui/PageLoader/PageLoader';

type Props = {
    children: ReactNode;
};

export default function RequireAuthGuard({ children }: Props): ReactNode {
    const { user, isBootstrapping } = useAuth();
    const location = useLocation();

    if (isBootstrapping) return <PageLoader />;

    if (!user) return <Navigate to="/login" state={{ from: location }} replace />;

    return children;
}