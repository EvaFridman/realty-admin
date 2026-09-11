import { Controller, Post, Get, Body, Req, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service.js';
import { LoginDto } from './dto/login.dto.js';
import ms, { StringValue } from 'ms';
import { RegisterDto } from './dto/register.dto.js';
import { Public } from './decorators/public.decorator.js';
import { Throttle } from "@nestjs/throttler";
import { LoginThrottlerGuard } from './guards/login-throttler.guard.js';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService, 
        private readonly configService: ConfigService
    ) {}

    @UseGuards(LoginThrottlerGuard)
    @Throttle({ login: { ttl: 15 * 60_000, limit: 10 } })
    @Post('login')
    @Public()
    async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) response: Response) {
        const { accessToken, refreshToken, user } = await this.authService.login(loginDto.email, loginDto.password);

        const isProduction = (this.configService.get<string>('NODE_ENV') ?? process.env.NODE_ENV) === 'production';
        const refreshTtl = this.configService.get<StringValue>('REFRESH_TTL')  ?? '30d';

        response.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            sameSite: 'lax',
            secure: isProduction,
            path: '/auth',
            maxAge: ms(refreshTtl) as number,
        });
      
        return { accessToken, user }; 
    }

    @Post('refresh')
    @Public()
    async refresh(@Req() request: Request, @Res({ passthrough: true }) response: Response) {
        const token = request.cookies?.['refreshToken'];
        const { accessToken, refreshToken, user } = await this.authService.refresh(token);
        
        const isProduction = (this.configService.get<string>('NODE_ENV') ?? process.env.NODE_ENV) === 'production';
        const refreshTtl = this.configService.get<StringValue>('REFRESH_TTL')  ?? '30d';

        response.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            sameSite: 'lax',
            secure: isProduction,
            path: '/auth',
            maxAge: ms(refreshTtl) as number,
        });
    
        return { accessToken, user };
    }

    @Post('logout')
    async logout(@Res({ passthrough: true }) response: Response) {
        response.clearCookie('refreshToken', { path: '/auth' });
        return { message: 'Logged out' };
    }

    @Get('me')
    async me(@Req() request: Request) {
        return request.user;
    }

    @UseGuards(LoginThrottlerGuard)
    @Throttle({ register: { ttl: 60 * 60_000, limit: 5 } })
    @Post('register')
    @Public()
    async register(@Body() registerDto: RegisterDto, @Res({ passthrough: true }) response: Response) {
        const { accessToken, refreshToken, user } = await this.authService.register(registerDto);

        const isProduction = (this.configService.get<string>('NODE_ENV') ?? process.env.NODE_ENV) === 'production';
        const refreshTtl = this.configService.get<StringValue>('REFRESH_TTL') ?? '30d';

        response.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            sameSite: 'lax',
            secure: isProduction,
            path: '/auth',
            maxAge: ms(refreshTtl) as number,
        });

        return { accessToken, user };
    }
}
