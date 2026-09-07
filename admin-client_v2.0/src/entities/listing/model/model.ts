import type { DistrictType } from '../../district/index';
import type { ListingPhotoType } from '../../listing-photo/index';
import type { UserType } from '../../user/index';

export type ListingStatusType = 'draft' | 'moderation' | 'published' | 'rejected' | 'unpublished';

export type ListingDealType = 'sale' | 'rent';

export type ListingPropertyType = 'flat' | 'house' | 'room' | 'commercial';

export type ListingType = {
    id: number;
    agentId: number;
    districtId: number;
    title: string;
    description: string | null;
    dealType: ListingDealType;
    propertyType: ListingPropertyType;
    price: string | number;
    area: string | number;
    rooms: number | null;
    floor: number | null;
    totalFloors: number | null;
    address: string;
    lat: string | number;
    lng: string | number;
    status: ListingStatusType;
    rejectionReason: string | null;
    publishedAt: string | null;
    createdAt: string;
    updatedAt: string;
    photos?: ListingPhotoType[];
    agent?: UserType;
    district?: DistrictType;
};