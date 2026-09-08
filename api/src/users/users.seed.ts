import { User } from './users.types.js';

export const USERS_SEED: User[] = [
    { id: 1, name: "Анна Волкова", email: "anna@realty.local", phone: "+79990000001", role: "agent", passwordHash: "hash-1", avatarFileName: null },
    { id: 2, name: "Игорь Седов", email: "igor@realty.local", phone: "+79990000002", role: "agent", passwordHash: "hash-2", avatarFileName: "igor.webp" },
    { id: 3, name: "Мария Титова", email: "maria@realty.local", phone: "+79990000003", role: "moderator", passwordHash: "hash-3", avatarFileName: null }
]