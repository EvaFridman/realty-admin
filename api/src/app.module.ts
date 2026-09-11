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
import { ListingsController } from './listings/listings.controller.js';
import { FavoritesModule } from './favorites/favorites.module.js';
import { RealtimeModule } from './realtime/realtime.module.js';
import { MailService } from './mail/mail.service.js';
import { EventEmitterModule } from '@nestjs/event-emitter';

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
  ],
  controllers: [AppController],
  providers: [AppService, { provide: APP_GUARD, useClass: JwtAuthGuard }, { provide: APP_GUARD, useClass: RolesGuard }, PrismaService, MailService],
})
export class AppModule {}
