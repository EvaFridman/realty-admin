import { IsIn } from 'class-validator';
import { ViewingStatus } from '../../generated/prisma/index.js';

export class UpdateStatusDto {
    @IsIn(['created', 'pending_approval', 'approved', 'rejected', 'closed'])
    status: ViewingStatus;
}