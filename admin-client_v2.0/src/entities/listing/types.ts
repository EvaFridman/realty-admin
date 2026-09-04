import type { District } from '@/entities/district/types';
import type { ListingPhoto } from '@/entities/listing-photo/types';
import type { User } from '@/entities/user/types';

export type ListingStatus = 'draft' | 'moderation' | 'published' | 'rejected' | 'unpublished';

export type ListingDealType = 'sale' | 'rent';

export type ListingPropertyType = 'flat' | 'house' | 'room' | 'commercial';

export type Listing = {
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
    status: ListingStatus;
    rejectionReason: string | null;
    publishedAt: string | null;
    createdAt: string;
    updatedAt: string;
    photos?: ListingPhoto[];
    agent?: User;
    district?: District;
};