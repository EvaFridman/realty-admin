import { Module } from '@nestjs/common';
import { ViewingsController } from './viewings.controller.js';
import { ViewingsService } from './viewings.service.js';
import { ViewingsRepository } from './viewings.repository.js';
import { VIEWINGS_SEED } from './viewings.seed.js';

@Module({
  controllers: [ViewingsController],
  providers: [ViewingsService, ViewingsRepository, { provide: "VIEWINGS_SEED", useValue: VIEWINGS_SEED }],
  exports: [ViewingsService]
})
export class ViewingsModule {}