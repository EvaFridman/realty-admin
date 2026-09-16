import { Body, Controller, Post, Req, Res, UseGuards } from "@nestjs/common";
import type { Request, Response } from "express";
import { ConfigService } from "@nestjs/config";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Throttle } from "@nestjs/throttler";
import ms, { StringValue } from "ms";
import { Public } from "./decorators/public.decorator.js";
import { AuthService } from "./auth.service.js";
import { LoginDto } from "./dto/login.dto.js";
import { LoginThrottlerGuard } from "./guards/login-throttler.guard.js";

@ApiTags("Сессия")
@Controller("session")
export class SessionController {
    constructor(private readonly authService: AuthService, private readonly configService: ConfigService) {}

    @ApiOperation({ summary: "Аутентификация пользователя для Next.js" })
    @ApiResponse({ status: 200, description: "Успешный вход" })
    @ApiResponse({ status: 401, description: "Неверные учетные данные" })
    @ApiResponse({ status: 429, description: "Превышен лимит попыток входа" })
    @UseGuards(LoginThrottlerGuard)
    @Throttle({ login: { ttl: 15 * 60_000, limit: 10 } })
    @Post("login")
    @Public()
    async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) response: Response) {
        const { accessToken, refreshToken, user } = await this.authService.login(loginDto.email, loginDto.password);
        this.setRefreshCookie(response, refreshToken);
        return { accessToken, user };
    }

    @ApiOperation({ summary: "Обновление пары токенов для Next.js" })
    @ApiResponse({ status: 200, description: "Пара токенов успешно обновлена" })
    @ApiResponse({ status: 401, description: "Refresh token отсутствует или невалиден" })
    @Post("refresh")
    @Public()
    async refresh(@Req() request: Request, @Res({ passthrough: true }) response: Response) {
        const refreshToken = request.cookies?.["refreshToken"];
        const result = await this.authService.refresh(refreshToken);
        this.setRefreshCookie(response, result.refreshToken);
        return { accessToken: result.accessToken, user: result.user };
    }

    private setRefreshCookie(response: Response, refreshToken: string) {
        const isProduction = (this.configService.get<string>("NODE_ENV") ?? process.env.NODE_ENV) === "production";
        const refreshTtl = this.configService.get<StringValue>("REFRESH_TTL") ?? "30d";

        response.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            sameSite: "lax",
            secure: isProduction,
            path: "/session",
            maxAge: ms(refreshTtl) as number,
        });
    }
}