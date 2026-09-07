// import type { ReactElement, ReactNode } from 'react';

// import { useAuth } from '@/features/auth';
// import ForbiddenPage from '@/pages/ForbiddenPage';
// import type { UserRoleType } from '@/entities/user';

// type Props = { roles: UserRoleType[]; children: ReactNode };

// export default function RequireRoleGuard({ roles, children }: Props): ReactElement {
//     const { user } = useAuth();
//     if(!roles.includes(user.role)) return <ForbiddenPage />;
//     return children;
// }