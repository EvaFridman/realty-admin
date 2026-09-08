import { Test, TestingModule } from '@nestjs/testing';
import { DistrictsController } from './districts.controller.js';
import { DistrictsService } from './districts.service.js';

describe('DistrictsController', () => {
  let controller: DistrictsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DistrictsController],
      providers: [DistrictsService],
    }).compile();

    controller = module.get<DistrictsController>(DistrictsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
