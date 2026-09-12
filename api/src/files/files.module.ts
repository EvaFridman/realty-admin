import { Module } from '@nestjs/common';
import { FilesController } from './files.controller.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { AuthModule } from '../auth/auth.module.js';  

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [FilesController]
})
export class FilesModule {}
