import { Module } from '@nestjs/common';
import { HealthController } from './health.controller.js';
import { DistrictsModule } from '../districts/districts.module.js'
import { UsersModule } from '../users/users.module.js'

@Module({
  controllers: [HealthController],
  imports: [DistrictsModule, UsersModule]
})
export class HealthModule {}