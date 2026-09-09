import { Injectable, Inject } from "@nestjs/common";
import type { User, PublicUser } from './users.types.js'
import { CreateUserDto } from './dto/create-user.dto.js'
import { UpdateUserDto } from './dto/update-user.dto.js'

@Injectable()
export class UsersRepository {
    constructor(@Inject("USERS_SEED") private readonly users: User[]) { }

    //TODO: при появлении DB-слоя переделать
    findAll(): PublicUser[] {
        return this.users.map(user => {
            const { passwordHash, ...publicUser } = user;
            return publicUser;
        });
    }

    findAllPaginated(page: number, limit: number, role?: 'agent' | 'moderator'): { items: PublicUser[], total: number } {
        const filteredUsers = role ? this.users.filter(u => u.role === role) : this.users;
        
        const publicUsers = filteredUsers.map(user => {
            const { passwordHash, ...publicUser } = user;
            return publicUser;
        });
        const total = publicUsers.length;

        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;

        const items = publicUsers.slice(startIndex, endIndex);

        return { items, total };
    }

    findUserById(id: number): PublicUser | null {
        const user = this.users.find(u => u.id === id);
        if (!user) return null;
        const { passwordHash, ...publicUser } = user;
        return publicUser;
    }

    count(): number {
        return this.users.length;
    }

    create(data: CreateUserDto): PublicUser {
        const newUserId: number = this.users.length > 0 ? Math.max(...this.users.map(d => d.id)) + 1 : 1;
        const newUser: User = { id: newUserId, ...data, createdAt: new Date(), passwordHash: 'temporary-hash', updatedAt: new Date() };
        this.users.push(newUser);
        const { passwordHash, ...publicUser } = newUser;
        return publicUser;
    }

    update(id: number, data: UpdateUserDto): PublicUser | null {
        const user = this.users.find(u => u.id === id);
        if (!user) return null;
        Object.assign(user, data);
        user.updatedAt = new Date();
        const { passwordHash, ...publicUser } = user;
        return publicUser;
    }
};