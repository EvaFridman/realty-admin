import { IsIn, IsString } from 'class-validator';
import { ListingStatus } from '../../generated/prisma/index.js';

export class UpdateStatusDto {
    @IsString() @IsIn(['draft', 'moderation', 'published', 'rejected', 'unpublished'])
    status: ListingStatus;
}