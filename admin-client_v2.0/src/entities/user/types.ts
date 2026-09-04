import type { Dispatch, SetStateAction } from 'react';

export type UserRole = 'agent' | 'moderator';

export type AuthUser = {
    id: number;
    role: UserRole;
};

export type AuthUserData = {
    id: number;
    email: string;
    role: UserRole;
    avatarUrl: string | null;
};

export type User = {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    role: UserRole;
    avatarUrl: string | null;
    createdAt: string;
    updatedAt: string;
};

export type AuthContextValue = {
    user: AuthUserData | null;
    setUser: Dispatch<SetStateAction<AuthUserData | null>>;
    isBootstrapping: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
};