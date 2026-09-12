import { IsString, MinLength } from 'class-validator';
import { LoginDto } from './login.dto.js'

export class RegisterDto extends LoginDto {
  @IsString() @MinLength(2)
  name: string;
}
