import { IsString, Length, IsEmail } from "class-validator";

export class LoginDto {
    @IsEmail()
    email: string;

    @IsString() @Length(8, 72)
    password: string;
}