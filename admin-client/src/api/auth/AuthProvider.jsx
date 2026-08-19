import { useState, useEffect, useMemo } from 'react';
import { setAccessToken } from '../tokenStore';
import { AuthContext } from './AuthContext';
import { setAuthFailureHandler, refreshClient, api } from '../client';

export default function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isBootstrapping, setIsBootstrapping] = useState(true);

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
                const response = await refreshClient.post('/auth/refresh');

                setAccessToken(response.data?.data?.accessToken);
                setUser(response.data?.data?.user);
            } catch {
                setAccessToken(null);
                setUser(null);
            } finally {
                setIsBootstrapping(false);
            }
        };

        restore();
    }, []);

    const login = async (email, password) => {
        const response = await api.post('/auth/login', {
            email,
            password,
        });

        setAccessToken(response.data?.accessToken);
        setUser(response.data?.user);
    };

    const logout = async () => {
        try {
            await api.post('/auth/logout');
        } finally {
            setAccessToken(null);
            setUser(null);
        }
    };

    const value = useMemo(() => ({ user, isBootstrapping, login, logout }), [user, isBootstrapping]);

    return <AuthContext value={value}>{children}</AuthContext>
}