import { useCallback, type Dispatch, type SetStateAction } from 'react';

import type { AuthUserDataType } from '@/entities/user';

import { handleLogin } from '../tools/handle-login';

export function useLogin(setUser: Dispatch<SetStateAction<AuthUserDataType | null>>): (email: string, password: string) => Promise<void> {
    return useCallback(async (email: string, password: string): Promise<void> => {
        const data = await handleLogin(email, password);
        setUser(data.user);
    }, [setUser]);
}