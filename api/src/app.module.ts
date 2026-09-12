import { Module } from '@nestjs/common';
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
import { MailService } from './mail/mail.service.js';
import { PdfService } from './pdf/pdf.service.js';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ThrottlerModule, ThrottlerGuard } from "@nestjs/throttler";
import { FilesModule } from './files/files.module.js';
import { ServeStaticModule } from '@nestjs/serve-static';
import path from 'path';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    // Distributed tracing, auto-correlated logs, request/job metrics, error
    // telemetry, alarms, and more — out of the box. Sign up at https://observe.nestjs.com
    // ObserveModule.forRoot({
    //   appKey: 'YOUR_APP_KEY',
    //   appSecret: 'YOUR_APP_SECRET',
    //   serviceId: 'api',
    // }),
    ServeStaticModule.forRoot({
      rootPath: path.resolve('./public'),
      serveRoot: '/static',
    }),
    ThrottlerModule.forRoot({
      throttlers: [
        { name: "api", ttl: 15 * 60_000, limit: 300 },
        { name: "login", ttl: 15 * 60_000, limit: 10 },
        { name: "register", ttl: 60 * 60_000, limit: 5 },
        { name: "upload", ttl: 15 * 60_000, limit: 30 },
        { name: "viewing", ttl: 60 * 60_000, limit: 20 },
        { name: "csp", ttl: 15 * 60_000, limit: 100 },
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
  ],
  controllers: [AppController],
  providers: [AppService,
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
    PrismaService,
    MailService,
    PdfService
  ],
})
export class AppModule { }
