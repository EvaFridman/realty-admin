import { useEffect, type Dispatch, type SetStateAction } from 'react';

import type { AuthUserDataType } from '@/entities/user';

import { setAccessToken, setAuthFailureHandler } from '../index';

export function useAuthFailureHandler(setUser: Dispatch<SetStateAction<AuthUserDataType | null>>): void {
    useEffect(() => {
        setAuthFailureHandler((): void => {
            setAccessToken(null);
            setUser(null);
        });

        return (): void => {
            setAuthFailureHandler(null);
        };
    }, [setUser]);
}