import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router';

import { AuthContext } from '@/entities/user/AuthContext';
import type { AuthUserData } from '@/entities/user/types';
import { api, refreshClient, setAuthFailureHandler } from '@/shared/api/client';
import { setAccessToken } from '@/shared/api/tokenStore';
import type { ApiResponse } from '@/shared/api/types';

type AuthProviderProps = { children: ReactNode };

type AuthResponse = { accessToken: string; user: AuthUserData };

export default function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<AuthUserData | null>(null);
    const [isBootstrapping, setIsBootstrapping] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        setAuthFailureHandler(() => {
            setAccessToken(null);
            setUser(null);
        });

        return () => setAuthFailureHandler(null);
    }, []);

    useEffect(() => {
        const restore = async () => {
            try {
                const response = await refreshClient.post<ApiResponse<AuthResponse>>('/auth/refresh');
                const data = response.data.data;
                if (!data) throw new Error('Refresh response is empty');
                setAccessToken(data.accessToken);
                setUser(data.user);
            } catch {
                setAccessToken(null);
                setUser(null);
            } finally {
                setIsBootstrapping(false);
            }
        };

        restore();
    }, []);

    useEffect(() => {
        if (!isBootstrapping && !user && location.pathname !== '/login') {
            navigate('/login', { state: { from: location }, replace: true });
        }
    }, [user, isBootstrapping, location, navigate]);

    const login = async (email: string, password: string): Promise<void> => {
        const response = await api<ApiResponse<AuthResponse>>({
            url: '/auth/login',
            method: 'POST',
            data: { email, password },
        });

        if (!response.data) throw new Error('Login response is empty');

        const { accessToken, user } = response.data;

        setAccessToken(accessToken);
        setUser(user);
    };

    const logout = async (): Promise<void> => {
        try {
            await api<ApiResponse<null>>({
                url: '/auth/logout',
                method: 'POST',
            });
        } finally {
            setAccessToken(null);
            setUser(null);
        }
    };

    const value = useMemo(
        () => ({ user, setUser, isBootstrapping, login, logout }),
        [user, isBootstrapping]
    );

    return <AuthContext value={value}>{children}</AuthContext>;
}