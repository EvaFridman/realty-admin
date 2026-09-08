import { Test, TestingModule } from '@nestjs/testing';
import { ViewingsService } from './viewings.service.js';

describe('ViewingsService', () => {
  let service: ViewingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ViewingsService],
    }).compile();

    service = module.get<ViewingsService>(ViewingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
