export type ListingStatus = "draft" | "moderation" | "published" | "rejected" | "unpublished";

export type ListingDealType = "sale" | "rent";

export type ListingPropertyType = "flat" | "house" | "room" | "commercial";

export type Listing = {
    id: number;
    agentId: number;
    districtId: number;
    title: string;
    description?: string | null;
    status: ListingStatus;
    dealType: ListingDealType;
    propertyType: ListingPropertyType;
    price: number | string;
    area: number | string;
    rooms: number | null;
    floor: number | null;
    totalFloors: number | null;
    address: string;
    lat: number;
    lng: number;
    rejectionReason: string | null;
    publishedAt: Date | null;
};

export type ListingWithTransitions = Listing & {
    allowedTransitions: ListingStatus[];
  };