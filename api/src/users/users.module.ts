import { Module } from '@nestjs/common';
import { UsersService } from './users.service.js';
import { UsersController } from './users.controller.js';
import { UsersRepository } from './users.repository.js'
import { USERS_SEED } from './users.seed.js'

@Module({
  controllers: [UsersController],
  providers: [UsersService, UsersRepository, { provide: "USERS_SEED", useValue: USERS_SEED }],
  exports: [UsersService]
})
export class UsersModule {}
