import { Injectable, Inject } from "@nestjs/common";
import type { District } from './districts.types.js'

@Injectable()
export class DistrictsRepository {
    constructor(@Inject("DISTRICTS_SEED") private readonly districts: District[]) {}

    //TODO: при появлении DB-слоя переделать
    findAll(): District[] {
        return this.districts;
    }

    findDistrictById(id: number): District | null {
        const district = this.districts.find(d => d.id === id);
        return district ?? null;
    }

    count(): number {
        return this.districts.length;
    }
};