import { useEffect, useState, type Dispatch, type SetStateAction } from 'react';

import type { AuthUserDataType } from '@/entities/user';

import { refreshRequest } from '../api';
import { setAccessToken } from '../index';

type UseGetCurrentUserResultType = {
    user: AuthUserDataType | null;
    setUser: Dispatch<SetStateAction<AuthUserDataType | null>>;
    isBootstrapping: boolean;
};

export function useGetCurrentUser(): UseGetCurrentUserResultType {
    const [user, setUser] = useState<AuthUserDataType | null>(null);
    const [isBootstrapping, setIsBootstrapping] = useState(true);

    useEffect(() => {
        const restore = async (): Promise<void> => {
            try {
                const response = await refreshRequest();
                if (!response.data) throw new Error('Refresh response is empty');
                setAccessToken(response.data.accessToken);
                setUser(response.data.user);
            } catch {
                setAccessToken(null);
                setUser(null);
            } finally {
                setIsBootstrapping(false);
            }
        };

        void restore();
    }, []);

    return { user, setUser, isBootstrapping };
}