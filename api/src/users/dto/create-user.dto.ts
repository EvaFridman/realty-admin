export class CreateUserDto {
    name: string;
    email: string;
    phone: string | null;
    role: 'agent' | 'moderator';
    avatarFileName: string | null;
}
