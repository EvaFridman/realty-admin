import { Test, TestingModule } from '@nestjs/testing';
import { DistrictsService } from './districts.service.js';
import { DistrictsRepository } from './districts.repository.js';
import { ConfigService } from '@nestjs/config';
import { NotFoundException } from '@nestjs/common';
import { jest, describe, beforeEach, it, expect } from '@jest/globals';

describe('DistrictsService', () => {
  let service: DistrictsService;
  let repository: DistrictsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DistrictsService,
        { provide: DistrictsRepository, useValue: { findDistrictById: jest.fn(), count: jest.fn() } },
        { provide: ConfigService, useValue: { get: jest.fn() } },
      ],
    }).compile();

    service = module.get<DistrictsService>(DistrictsService);
    repository = module.get<DistrictsRepository>(DistrictsRepository);
  });

  it('should return a district if found', () => {
    const mockDistrict = { id: 1, title: 'Северный район 1', slug: 'severnyy-rayon-1', city: 'Казань' };
    
    jest.spyOn(repository, 'findDistrictById').mockReturnValue(mockDistrict);

    const result = service.findOne(1);
    
    expect(result).toEqual(mockDistrict);
    expect(repository.findDistrictById).toHaveBeenCalledWith(1);
  });

  it('should throw NotFoundException if district not found', () => {
    jest.spyOn(repository, 'findDistrictById').mockReturnValue(null);

    expect(() => service.findOne(1)).toThrow(NotFoundException);
    expect(repository.findDistrictById).toHaveBeenCalledWith(1);
  });

  it('should return correct count of districts', () => {
    jest.spyOn(repository, 'count').mockReturnValue(7);

    const result = service.count();

    expect(result).toBe(7);
    expect(repository.count).toHaveBeenCalled();
  });
});