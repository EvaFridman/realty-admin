import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ViewingsRepository } from './viewings.repository.js'
import { NotFoundError } from '../errors/app.exception.js';
import { getAllowedTransitions, type ViewingStatus } from '../common/viewingStatusTransitions.service.js'

@Injectable()
export class ViewingsService {
    constructor(private readonly repo: ViewingsRepository, private readonly configService: ConfigService) {}

    findAll(page?: number, limit?: number, status?: ViewingStatus) {
        const pageSizeDefault = Number(this.configService.get<number>('PAGE_SIZE_DEFAULT') ?? 20);
        const pageSizeMax = Number(this.configService.get<number>('PAGE_SIZE_MAX') ?? 100);
    
        const finalPage = (!page || page < 1) ? 1 : page;
        let finalLimit = (!limit || limit < 1) ? pageSizeDefault : limit;
        if (finalLimit > pageSizeMax) finalLimit = pageSizeMax;
    
        const { items, total } = this.repo.findAllPaginated(finalPage, finalLimit, status);
    
        const totalPages = total > 0 ? Math.ceil(total / finalLimit) : 0;
    
        return { items, meta: { page: finalPage, limit: finalLimit, total, totalPages } };
    }

    findOne(id: number) {
        const viewing = this.repo.findViewingById(id);
        if (!viewing) throw new NotFoundError('Viewing not found')
        return { ...viewing, allowedTransitions: getAllowedTransitions(viewing.status) };
    }
}