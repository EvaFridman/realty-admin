import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import { SessionController } from './session.controller.js';
import { UsersModule } from '../users/users.module.js';

@Module({
  imports: [ConfigModule, UsersModule, JwtModule.register({})],
  controllers: [AuthController, SessionController],
  providers: [AuthService],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
