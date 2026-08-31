export type UserRole = 'agent' | 'moderator';

export type AuthUser = {
    id: number;
    role: UserRole;
};

export type User = {
    id: number;
    name: string;
    email: string;
    phone?: string | null;
    role: UserRole;
    avatarUrl?: string | null;
};