import { Injectable, Inject } from "@nestjs/common";
import type { District } from './districts.types.js'
import { CreateDistrictDto } from './dto/create-district.dto.js'
import { UpdateDistrictDto } from './dto/update-district.dto.js'

@Injectable()
export class DistrictsRepository {
    constructor(@Inject("DISTRICTS_SEED") private readonly districts: District[]) {}

    //TODO: при появлении DB-слоя переделать
    findAll(): District[] {
        return this.districts;
    }

    findAllPaginated(page: number, limit: number, city?: string): { items: District[], total: number } {
        const filteredDistricts = city ? this.districts.filter(d => d.city === city) : this.districts;
        const total = filteredDistricts.length;

        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;

        const items = filteredDistricts.slice(startIndex, endIndex);

        return { items, total };
    }

    findDistrictById(id: number): District | null {
        const district = this.districts.find(d => d.id === id);
        return district ?? null;
    }

    count(): number {
        return this.districts.length;
    }

    create(data: CreateDistrictDto): District {
        const newDistrictId: number = this.districts.length > 0 ? Math.max(...this.districts.map(d => d.id)) + 1 : 1;
        const newDistrict: District = { id: newDistrictId, ...data, createdAt: new Date(), updatedAt: new Date() };
        this.districts.push(newDistrict);
        return newDistrict;
    }

    update(id: number, data: UpdateDistrictDto): District | null {
        const district = this.districts.find(d => d.id === id);
        if (!district) return null;
        Object.assign(district, data);
        district.updatedAt = new Date();
        return district;
    }
};