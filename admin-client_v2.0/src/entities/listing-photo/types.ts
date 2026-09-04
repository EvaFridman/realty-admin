export type ListingPhoto = {
    id: number;
    listingId: number;
    externalUrl: string | null;
    position: number | null;
    isCover: boolean | null;
    fileName: string | null;
    sizeBytes: number | null;
    createdAt: string;
    updatedAt: string;
};