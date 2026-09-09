export type UserRole = 'agent' | 'moderator';

export type User = {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    role: UserRole;
    passwordHash: string;
    avatarFileName: string | null;

    createdAt?: Date;
    updatedAt?: Date;
}

export type PublicUser = Omit<User, 'passwordHash'>;