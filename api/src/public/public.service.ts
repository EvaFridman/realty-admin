import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service.js';
import { PublicListingsDto } from './dto/public-listings.dto.js';
import { buildPublicListingsWhere } from './public.where.js';
import { ListingStatus, UserRole } from '../generated/prisma/index.js';
import { NotFoundError } from '../errors/app.exception.js';

@Injectable()
export class PublicService {
    constructor(private readonly prisma: PrismaService, private readonly configService: ConfigService) {}

    async findAllListings(dto: PublicListingsDto) {
        const pageSizeDefault = Number(this.configService.get<number>('PAGE_SIZE_DEFAULT') ?? 20);
        const pageSizeMax = Number(this.configService.get<number>('PAGE_SIZE_MAX') ?? 100);

        const finalPage = (!dto.page || dto.page < 1) ? 1 : dto.page;
        let finalLimit = (!dto.limit || dto.limit < 1) ? pageSizeDefault : dto.limit;
        if (finalLimit > pageSizeMax) finalLimit = pageSizeMax;

        const whereCondition = buildPublicListingsWhere(dto);

        const sortField = dto.sortBy ?? 'publishedAt';
        const sortOrder = dto.sortOrder ?? 'desc';
        const orderByCondition = { [sortField]: sortOrder };

        const [items, total] = await Promise.all([
        this.prisma.listings.findMany({
            where: whereCondition,
            orderBy: orderByCondition,
            skip: (finalPage - 1) * finalLimit,
            take: finalLimit,
            select: {
                id: true,
                title: true,
                price: true,
                area: true,
                rooms: true,
                floor: true,
                totalFloors: true,
                dealType: true,
                propertyType: true,
                address: true,
                publishedAt: true,
                district: { select: { id: true, title: true } },
                photos: {
                  select: { id: true, fileName: true, externalUrl: true, position: true, isCover: true },
                  orderBy: { position: 'asc' },
                },
            },
        }),
        this.prisma.listings.count({ where: whereCondition })
        ]);

        const totalPages = total > 0 ? Math.ceil(total / finalLimit) : 0;

        return { items, meta: { page: finalPage, limit: finalLimit, total, totalPages } };
    }

    async findOneListing(id: number) {
        const listing = await this.prisma.listings.findUnique({
            where: { id },
            select: {
                title: true,
                description: true,
                agent: { select: { id: true, name: true, avatarFileName: true } },
                id: true,
                price: true,
                area: true,
                rooms: true,
                floor: true,
                totalFloors: true,
                dealType: true,
                propertyType: true,
                address: true,
                publishedAt: true,
                status: true,
                district: { select: { id: true, title: true } },
                photos: {
                  select: { id: true, fileName: true, externalUrl: true, position: true, isCover: true },
                  orderBy: { position: 'asc' },
                },
            },
        });

        if (!listing || listing.status !== ListingStatus.PUBLISHED) throw new NotFoundError('Listing not found');

        const publicListing = { ...listing };
        delete (publicListing as any).status; 
        
        return publicListing;
    }

    async findAllDistricts(page?: number, limit?: number, city?: string) {
        const pageSizeDefault = Number(this.configService.get<number>('PAGE_SIZE_DEFAULT') ?? 20);
        const pageSizeMax = Number(this.configService.get<number>('PAGE_SIZE_MAX') ?? 100);
    
        const finalPage = (!page || page < 1) ? 1 : page;
        let finalLimit = (!limit || limit < 1) ? pageSizeDefault : limit;
        if (finalLimit > pageSizeMax) finalLimit = pageSizeMax;
    
        const finalCity = (city && city.trim() !== '') ? city.trim() : undefined;
        const whereCondition = finalCity ? { city: finalCity } : {};
    
        const [items, total] = await Promise.all([
            this.prisma.districts.findMany({
              where: whereCondition,
              skip: (finalPage - 1) * finalLimit,
              take: finalLimit,
              select: {
                id: true,
                title: true,
                city: true,
                _count: {
                  select: {
                    listings: { where: { status: ListingStatus.PUBLISHED } },
                  },
                },
              },
              orderBy: { title: 'asc' },
            }),
            this.prisma.districts.count({ where: whereCondition })
        ]);
    
        const totalPages = total > 0 ? Math.ceil(total / finalLimit) : 0;

        const formattedItems = items.map((d) => ({
            id: d.id,
            title: d.title,
            city: d.city,
            publishedListingsCount: d._count.listings,
        }));
    
        return { items: formattedItems, meta: { page: finalPage, limit: finalLimit, total, totalPages } };
    }

    async findAgentPhone(id: number) {
      const agent = await this.prisma.users.findFirst({
          where: { id, role: UserRole.agent },
          select: { phone: true },
      });
      if (!agent) throw new NotFoundError('Agent not found');
      return { phone: agent.phone }
    }
}