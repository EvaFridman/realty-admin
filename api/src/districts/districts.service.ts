import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDistrictDto } from './dto/create-district.dto.js';
import { UpdateDistrictDto } from './dto/update-district.dto.js';
import { DistrictsRepository } from './districts.repository.js'
import type { District } from './districts.types.js'

@Injectable()
export class DistrictsService {
  constructor(private readonly repo: DistrictsRepository) {}

  // TODO: при появлении DB-слоя переделать

  create(data: CreateDistrictDto): District {
    const newDistrict = this.repo.create(data);
    return newDistrict;
  }

  findAll(): District[] {
    const districts = this.repo.findAll();
    return districts;
  }

  findOne(id: number): District {
    const district = this.repo.findDistrictById(id);
    if (!district) throw new NotFoundException('District not found')
    return district;
  }

  count(): number {
    const districtsLength = this.repo.count();
    return districtsLength;
}

  update(id: number, data: UpdateDistrictDto): District {
    const district = this.repo.update(id, data);
    if (!district) throw new NotFoundException('District not found')
    return district;
  }

  // remove(id: number) {
  //   return `This action removes a #${id} district`;
  // }
}
