import { Injectable, Inject } from '@nestjs/common';
import type { Viewing } from './viewings.types.js'
import type { ViewingStatus } from '../common/viewingStatusTransitions.service.js'

@Injectable()
export class ViewingsRepository {
    constructor(@Inject("VIEWINGS_SEED") private readonly viewings: Viewing[]) { }

    findAllPaginated(page: number, limit: number, status?: ViewingStatus): { items: Viewing[], total: number } {
        const filteredViewings = status ? this.viewings.filter(v => v.status === status) : this.viewings;
        const total = filteredViewings.length;

        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;

        const items = filteredViewings.slice(startIndex, endIndex);

        return { items, total };
    }

    findViewingById(id: number): Viewing | null {
        const viewing = this.viewings.find(v => v.id === id);
        return viewing ?? null;
    }
}
