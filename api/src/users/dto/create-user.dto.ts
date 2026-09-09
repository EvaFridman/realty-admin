import { IsString, Matches, MinLength, MaxLength, IsIn, IsEmail, IsOptional } from "class-validator";

export class CreateUserDto {
    @IsString() @MinLength(2) @MaxLength(50)
    name: string;

    @IsEmail()
    email: string;

    @IsOptional() @IsString() @Matches(/^\+[1-9]\d{1,14}$/)
    phone: string | null;

    @IsIn(['agent', 'moderator'])
    role: 'agent' | 'moderator';

    @IsOptional() @IsString() @MinLength(3)
    avatarFileName: string | null;
}