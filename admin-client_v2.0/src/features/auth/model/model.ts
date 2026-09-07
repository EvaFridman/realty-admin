import type { Dispatch, SetStateAction } from 'react';

import { type AuthUserDataType } from '@/entities/user';

export type AuthResponseType = { accessToken: string; user: AuthUserDataType };

export type AuthContextValueType = {
    user: AuthUserDataType | null;
    setUser: Dispatch<SetStateAction<AuthUserDataType | null>>;
    isBootstrapping: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
};