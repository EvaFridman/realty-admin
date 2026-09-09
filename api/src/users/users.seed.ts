import { User } from './users.types.js';
import bcrypt from 'bcryptjs'

const defaultHash = await bcrypt.hash('Password123', 10);

export const USERS_SEED: User[] = [
    { id: 1, name: "Анна Волкова", email: "anna@realty.local", phone: "+79990000001", role: "agent", passwordHash: defaultHash, avatarFileName: null },
    { id: 2, name: "Игорь Седов", email: "igor@realty.local", phone: "+79990000002", role: "agent", passwordHash: defaultHash, avatarFileName: "igor.webp" },
    { id: 3, name: "Мария Титова", email: "maria@realty.local", phone: "+79990000003", role: "moderator", passwordHash: defaultHash, avatarFileName: null }
]