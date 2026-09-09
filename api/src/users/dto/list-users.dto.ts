import { IsOptional, IsPositive, IsInt, IsString, IsIn } from "class-validator";
import { Type } from 'class-transformer';

export class ListUsersDto {
    @IsOptional() @Type(() => Number) @IsInt() @IsPositive()
    page: number;

    @IsOptional() @Type(() => Number) @IsInt() @IsPositive()
    limit: number;

    @IsOptional() @IsString() @IsIn(['agent', 'moderator'])
    role?: 'agent' | 'moderator';
}