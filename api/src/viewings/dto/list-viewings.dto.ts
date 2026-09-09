import { IsOptional, IsPositive, IsInt, IsString, IsIn } from "class-validator";
import { Type } from 'class-transformer';
import { VIEWING_STATUSES, type ViewingStatus } from '../../common/viewingStatusTransitions.service.js';


export class ListViewingsDto {
    @IsOptional() @Type(() => Number) @IsInt() @IsPositive()
    page: number;

    @IsOptional() @Type(() => Number) @IsInt() @IsPositive()
    limit: number;

    @IsOptional() @IsString() @IsIn(VIEWING_STATUSES)
    status?: ViewingStatus;
}