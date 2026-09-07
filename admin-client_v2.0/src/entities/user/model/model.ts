export type UserRoleType = 'agent' | 'moderator';

export type AuthUserType = {
    id: number;
    role: UserRoleType;
};

export type AuthUserDataType = {
    id: number;
    email: string;
    role: UserRoleType;
    avatarUrl: string | null;
};

export type UserType = {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    role: UserRoleType;
    avatarUrl: string | null;
    createdAt: string;
    updatedAt: string;
};