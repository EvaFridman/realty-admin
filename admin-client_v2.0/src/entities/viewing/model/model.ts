export type ViewingStatusType = 'created' | 'pending approval' | 'approved' | 'rejected' | 'closed';

export type ViewingType = {
    id: number;
    listingId: number;
    clientName: string;
    clientPhone: string;
    clientEmail: string;
    preferredAt: string;
    comment: string | null;
    status: ViewingStatusType;
    notifiedAt: string | null;
    createdAt: string;
    updatedAt: string;
};