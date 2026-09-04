export type ViewingStatus = 'created' | 'pending approval' | 'approved' | 'rejected' | 'closed';

export type Viewing = {
    id: number;
    listingId: number;
    clientName: string;
    clientPhone: string;
    clientEmail: string;
    preferredAt: string;
    comment: string | null;
    status: ViewingStatus;
    notifiedAt: string | null;
    createdAt: string;
    updatedAt: string;
};