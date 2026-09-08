import { Module } from '@nestjs/common';
import { DistrictsService } from './districts.service.js';
import { DistrictsController } from './districts.controller.js';
import { DistrictsRepository } from './districts.repository.js';
import { DISTRICTS_SEED } from './districts.seed.js'

@Module({
  controllers: [DistrictsController],
  providers: [DistrictsService, DistrictsRepository, { provide: "DISTRICTS_SEED", useValue: DISTRICTS_SEED } ],
  exports: [DistrictsService]
})
export class DistrictsModule {}