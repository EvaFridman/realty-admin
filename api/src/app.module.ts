import { Module, Injectable, ExecutionContext } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ConfigModule } from '@nestjs/config';
import { DistrictsModule } from './districts/districts.module.js';
import { UsersModule } from './users/users.module.js';
import { HealthModule } from './health/health.module.js';
import { ViewingsModule } from './viewings/viewings.module.js';
import { AuthModule } from './auth/auth.module.js';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard.js';
import { RolesGuard } from './auth/guards/roles.guard.js';
import { APP_GUARD } from '@nestjs/core';
import { PrismaModule } from './prisma/prisma.module.js';
import { PrismaService } from './prisma/prisma.service.js';
import { ListingsModule } from './listings/listings.module.js';
import { FavoritesModule } from './favorites/favorites.module.js';
import { RealtimeModule } from './realtime/realtime.module.js';
import { PublicModule } from './public/public.module.js';
import { MailService } from './mail/mail.service.js';
import { PdfService } from './pdf/pdf.service.js';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ThrottlerModule, ThrottlerGuard, ThrottlerException } from "@nestjs/throttler";
import { FilesModule } from './files/files.module.js';
import { ServeStaticModule } from '@nestjs/serve-static';
import path from 'path';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Injectable()
export class GlobalThrottlerGuard extends ThrottlerGuard {
  protected async handleRequest(
    options: {
      context: ExecutionContext;
      limit: number;
      ttl: number;
      throttler: any;
      blockDuration: number;
    }
  ): Promise<boolean> {
    const { context, limit, ttl, throttler, blockDuration } = options;

    if (context.getType() === 'ws') return true;

    const req = context.switchToHttp().getRequest();
    const url = req.url || '';
    const path = req.path || '';

    if (url.includes('/socket.io')) return true;

    const buildSecret = process.env.NEXT_BUILD_SECRET;
    const buildRequest = req.headers["x-build-request"];

    if (req.method === "GET" && buildSecret && buildRequest === buildSecret) return true;

    if (throttler.name === 'login' || throttler.name === 'register') return true;
    if (throttler.name === 'viewing' && !url.includes('/viewings')) return true;
    if (throttler.name === 'viewingPublic' && !/^\/public\/listings\/\d+\/viewings$/.test(path)) return true;
    if (throttler.name === 'upload' && !url.includes('/photos') && !url.includes('/avatar')) return true;

    const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
    const key = `throttler:${throttler.name}:${ip}`;

    const { totalHits } = await this.storageService.increment(
      key,
      ttl,
      limit,
      blockDuration,
      throttler.name
    );

    if (totalHits > limit) throw new ThrottlerException();

    return true;
  }
}

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: path.resolve('./public'),
      serveRoot: '/static',
    }),
    ThrottlerModule.forRoot({
      throttlers: [
        { name: "api", ttl: 15 * 60_000, limit: 500 },
        { name: "login", ttl: 15 * 60_000, limit: 10 },
        { name: "register", ttl: 60 * 60_000, limit: 5 },
        { name: "upload", ttl: 15 * 60_000, limit: 30 },
        { name: "viewing", ttl: 60 * 60_000, limit: 20 },
        { name: "viewingPublic", ttl: 15 * 60_000, limit: 5 },
        { name: "ws", ttl: 1000, limit: 100 },
      ],
    }),
    EventEmitterModule.forRoot(),
    ConfigModule.forRoot({ isGlobal: true }),
    DistrictsModule,
    UsersModule,
    HealthModule,
    ViewingsModule,
    AuthModule,
    PrismaModule,
    ListingsModule,
    FavoritesModule,
    RealtimeModule,
    FilesModule,
    PublicModule,
  ],
  controllers: [AppController],
  providers: [AppService,
    { provide: APP_GUARD, useClass: GlobalThrottlerGuard },
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
    PrismaService,
    MailService,
    PdfService
  ],
})
export class AppModule { }