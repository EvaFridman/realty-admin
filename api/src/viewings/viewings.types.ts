export type Viewing = {
    id: number;
    listingId: number;
    clientName: string;
    clientPhone: string;
    clientEmail: string;
    preferredAt: string;
    comment: string | null;
    status: 'created' | 'pending approval' | 'approved' | 'rejected' | 'closed';
    notifiedAt: string | null;

    createdAt?: Date;
    updatedAt?: Date;
}