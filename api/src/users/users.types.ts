export type User = {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    role: 'agent' | 'moderator';
    passwordHash: string;
    avatarFileName: string | null;

    createdAt?: Date;
    updatedAt?: Date;
}

export type PublicUser = Omit<User, 'passwordHash'>;