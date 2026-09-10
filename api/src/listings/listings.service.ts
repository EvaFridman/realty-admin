import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service.js';
import { ListListingsDto } from './dto/list-listings.dto.js';
import { buildListingsWhere } from './listings.where.js';
import { UserRole } from '../generated/prisma/index.js';

@Injectable()
export class ListingsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService
  ) {}

  async findAll(dto: ListListingsDto, user: { id: number; role: string }) {
    const pageSizeDefault = Number(this.configService.get<number>('PAGE_SIZE_DEFAULT') ?? 20);
    const pageSizeMax = Number(this.configService.get<number>('PAGE_SIZE_MAX') ?? 100);

    const finalPage = (!dto.page || dto.page < 1) ? 1 : dto.page;
    let finalLimit = (!dto.limit || dto.limit < 1) ? pageSizeDefault : dto.limit;
    if (finalLimit > pageSizeMax) finalLimit = pageSizeMax;

    const isAgent = user.role === UserRole.agent;
    const whereCondition = buildListingsWhere(dto, user.id, isAgent);

    const sortField = dto.sortBy ?? 'createdAt';
    const sortOrder = dto.sortOrder ?? 'desc';
    const orderByCondition = { [sortField]: sortOrder };

    const [items, total] = await Promise.all([
      this.prisma.listings.findMany({
        where: whereCondition,
        orderBy: orderByCondition,
        skip: (finalPage - 1) * finalLimit,
        take: finalLimit,
        include: {
          agent: { select: { id: true, name: true, email: true } },
          district: true,
          photos: { orderBy: { position: 'asc' } }
        }
      }),
      this.prisma.listings.count({ where: whereCondition })
    ]);

    const totalPages = total > 0 ? Math.ceil(total / finalLimit) : 0;

    return { items, meta: { page: finalPage, limit: finalLimit, total, totalPages } };
  }
}
