import type { ReactElement, ReactNode } from 'react';


import { useAuth } from '@/features/auth';

import type { UserRoleType } from '@/entities/user';

import { ForbiddenPage } from '@/pages';

type Props = {
    roles: UserRoleType[];
    children: ReactNode;
};

export default function RequireRoleGuard({ roles, children }: Props): ReactElement {
    const { user } = useAuth();
    if (!user || !roles.includes(user.role)) return <ForbiddenPage />;
    return <>{children}</>;
}