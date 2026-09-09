import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateDistrictDto } from './dto/create-district.dto.js';
import { UpdateDistrictDto } from './dto/update-district.dto.js';
import { DistrictsRepository } from './districts.repository.js';
import { NotFoundError } from '../errors/app.exception.js';
import type { District } from './districts.types.js';

@Injectable()
export class DistrictsService {
  constructor(private readonly repo: DistrictsRepository, private readonly configService: ConfigService) {}

  // TODO: при появлении DB-слоя переделать

  create(data: CreateDistrictDto): District {
    return this.repo.create(data);
  }

  findAll(page?: number, limit?: number, city?: string) {
    const pageSizeDefault = Number(this.configService.get<number>('PAGE_SIZE_DEFAULT') ?? 20);
    const pageSizeMax = Number(this.configService.get<number>('PAGE_SIZE_MAX') ?? 100);

    const finalPage = (!page || page < 1) ? 1 : page;
    let finalLimit = (!limit || limit < 1) ? pageSizeDefault : limit;
    if (finalLimit > pageSizeMax) finalLimit = pageSizeMax;

    const finalCity = (city && city.trim() !== '') ? city.trim() : undefined;

    const { items, total } = this.repo.findAllPaginated(finalPage, finalLimit, finalCity);

    const totalPages = total > 0 ? Math.ceil(total / finalLimit) : 0;

    return { items, meta: { page: finalPage, limit: finalLimit, total, totalPages } };
  }

  findOne(id: number): District {
    const district = this.repo.findDistrictById(id);
    if (!district) throw new NotFoundError('District not found')
    return district;
  }

  count(): number {
    return this.repo.count();
  }

  update(id: number, data: UpdateDistrictDto): District {
    const district = this.repo.update(id, data);
    if (!district) throw new NotFoundError('District not found')
    return district;
  }

  // remove(id: number) {
  //   return `This action removes a #${id} district`;
  // }
}
