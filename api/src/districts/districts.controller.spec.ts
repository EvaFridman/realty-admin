import { Test, TestingModule } from '@nestjs/testing';
import { DistrictsController } from './districts.controller.js';
import { DistrictsService } from './districts.service.js';
import { DistrictsRepository } from './districts.repository.js';
import { ConfigService } from '@nestjs/config';
import { describe, beforeEach, it, expect, jest } from '@jest/globals';

describe('DistrictsController', () => {
  let controller: DistrictsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DistrictsController],
      providers: [
        DistrictsService,
        { provide: DistrictsRepository, useValue: {} },
        { provide: ConfigService, useValue: {} },
      ],
    }).compile();

    controller = module.get<DistrictsController>(DistrictsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
