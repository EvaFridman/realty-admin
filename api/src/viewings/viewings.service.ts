import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateViewingDto } from './dto/create-viewing.dto.js';
import { ListViewingsDto } from './dto/list-viewings.dto.js';
import { UpdateStatusDto } from './dto/update-status.dto.js';
import { canTransition, getAllowedTransitions } from '../common/viewingStatusTransitions.service.js';
import { NotFoundError, ConflictError, ForbiddenError } from '../errors/app.exception.js';
import { UserRole, ViewingStatus, Prisma } from '../generated/prisma/index.js';

@Injectable()
export class ViewingsService {
    constructor(private readonly prisma: PrismaService, private readonly configService: ConfigService) { }

    private handlePrismaError(error: any) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2025') {
                throw new NotFoundError('Viewing not found');
            }
        }
        throw error;
    }

    async create(listingId: number, dto: CreateViewingDto) {
        const listing = await this.prisma.listings.findUnique({ where: { id: listingId } });
        if (!listing) throw new NotFoundError('Listing not found');

        return await this.prisma.viewings.create({
            data: {
                listingId,
                ...dto,
                status: ViewingStatus.CREATED,
                createdAt: new Date(),
                updatedAt: new Date(),
            }
        });
    }

    async findAll(dto: ListViewingsDto, user: { id: number; role: string }) {
        const pageSizeDefault = Number(this.configService.get<number>('PAGE_SIZE_DEFAULT') ?? 20);
        const pageSizeMax = Number(this.configService.get<number>('PAGE_SIZE_MAX') ?? 100);

        const finalPage = (!dto.page || dto.page < 1) ? 1 : dto.page;
        let finalLimit = (!dto.limit || dto.limit < 1) ? pageSizeDefault : dto.limit;
        if (finalLimit > pageSizeMax) finalLimit = pageSizeMax;

        const whereCondition: any = {};
        if (dto.status) whereCondition.status = dto.status;
        if (dto.listingId) whereCondition.listingId = dto.listingId;

        if (user.role === UserRole.agent) whereCondition.listing = { agentId: user.id };

        const [items, total] = await Promise.all([
            this.prisma.viewings.findMany({
                where: whereCondition,
                skip: (finalPage - 1) * finalLimit,
                take: finalLimit,
                include: { listing: true },
                orderBy: { createdAt: 'desc' }
            }),
            this.prisma.viewings.count({ where: whereCondition })
        ]);

        const totalPages = total > 0 ? Math.ceil(total / finalLimit) : 0;

        return { items, meta: { page: finalPage, limit: finalLimit, total, totalPages } };
    }

    async findOne(id: number, user: { id: number; role: string }) {
        const viewing = await this.prisma.viewings.findUnique({ where: { id }, include: { listing: true } });
        if (!viewing) throw new NotFoundError('Viewing not found');
        if (user.role === UserRole.agent && viewing.listing?.agentId !== user.id) throw new ForbiddenError('You do not have access to this viewing');

        return { ...viewing, allowedTransitions: getAllowedTransitions(viewing.status) };
    }

    async updateStatus(id: number, dto: UpdateStatusDto, user: { id: number; role: string }) {
        try {
            return await this.prisma.$transaction(async (tx) => {
                const viewing = await tx.viewings.findUnique({ where: { id }, include: { listing: true } });
                if (!viewing) throw new NotFoundError('Viewing not found');
                if (user.role === UserRole.agent && viewing.listing?.agentId !== user.id) throw new ForbiddenError('You do not have access to this viewing');
                if (!canTransition(viewing.status, dto.status)) {
                    const allowed = getAllowedTransitions(viewing.status).join(', ');
                    throw new ConflictError(`Transition from ${viewing.status} to ${dto.status} is not allowed`, allowed as any);
                }

                const updateData: any = { status: dto.status, updatedAt: new Date() };
                const triggerStatuses: ViewingStatus[] = [ViewingStatus.APPROVED, ViewingStatus.REJECTED, ViewingStatus.CLOSED];
                if (triggerStatuses.includes(dto.status)) updateData.notifiedAt = new Date();

                return await tx.viewings.update({ where: { id }, data: updateData, include: { listing: true } });
            });
        } catch (error) {
            this.handlePrismaError(error);
        }
    }
}
