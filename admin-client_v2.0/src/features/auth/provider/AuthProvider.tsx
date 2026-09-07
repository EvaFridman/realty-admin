import { useMemo, type ReactElement, type ReactNode } from 'react';

import { useAuthFailureHandler } from '../hooks/useAuthFailureHandler';
import { useGetCurrentUser } from '../hooks/useGetCurrentUser';
import { useLogin } from '../hooks/useLogin';
import { useLogout } from '../hooks/useLogout';
import { AuthContext } from '../model/AuthContext';

type Props = { children: ReactNode };

export default function AuthProvider({ children }: Props): ReactElement {
    const { user, setUser, isBootstrapping } = useGetCurrentUser();

    useAuthFailureHandler(setUser);

    const login = useLogin(setUser);
    const logout = useLogout();

    const value = useMemo(
        () => ({ user, setUser, isBootstrapping, login, logout }),
        [user, setUser, isBootstrapping, login, logout]
    );

    return <AuthContext value={value}>{children}</AuthContext>;
}