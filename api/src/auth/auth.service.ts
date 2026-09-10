import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service.js';
import { UnauthorizedError, ConflictError } from '../errors/app.exception.js';
import { RegisterDto } from './dto/register.dto.js';
import { UserRole } from '../generated/prisma/index.js';

@Injectable()
export class AuthService {
    constructor(private readonly usersService: UsersService, private readonly jwtService: JwtService, private readonly configService: ConfigService) {}

    async login(email: string, password: string) {
        const user = await this.usersService.findByEmail(email);
        if (!user || !(await bcrypt.compare(password, user.passwordHash))) throw new UnauthorizedError("Invalid credentials");

        const tokens = await this.issuePair(user);
        
        const { passwordHash, ...publicUser } = user;

        return { ...tokens, user: publicUser };
    }

    async issuePair(user: { id: number; role: string }) {

        const accessSecret = this.configService.get<string>('JWT_ACCESS_SECRET');
        const accessExpires = this.configService.get<string>('ACCESS_TTL');
    
        const refreshSecret = this.configService.get<string>('JWT_REFRESH_SECRET');
        const refreshExpires = this.configService.get<string>('REFRESH_TTL');

        const accessToken = await this.jwtService.signAsync(
            { sub: user.id, role: user.role },
            { secret: accessSecret, expiresIn: accessExpires as any },
        );
      
        const refreshToken = await this.jwtService.signAsync(
            { sub: user.id },
            { secret: refreshSecret, expiresIn: refreshExpires as any },
        );


        return { accessToken, refreshToken };
    }

    async refresh(token: string) {
        if (!token) throw new UnauthorizedError('Refresh token missing');
    
        try {
          const refreshSecret = this.configService.get<string>('JWT_REFRESH_SECRET');
          const payload = await this.jwtService.verifyAsync(token, { secret: refreshSecret });
          
          const user = await this.usersService.findOne(payload.sub);
          if (!user) throw new UnauthorizedError('User not found');
    
          const tokens = await this.issuePair(user);
    
          return { ...tokens, user };
        } catch (error) {
          throw new UnauthorizedError('Invalid or expired refresh token');
        }
      }

      async register(registerDto: RegisterDto) {
        const { email, name, password } = registerDto;
        const existingUser = await this.usersService.findByEmail(email);
        if (existingUser) throw new ConflictError('User with such an email already exists');
    
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);
    
        const newUser = await this.usersService.create({
          email,
          name,
          passwordHash,
          role: UserRole.agent,
          phone: null,
          avatarFileName: null
      });
    
        const tokens = await this.issuePair(newUser);
    
        return { ...tokens, user: newUser };
      }
}
