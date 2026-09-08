import { Viewing } from './viewings.types.js';

export const VIEWINGS_SEED: Viewing[] = [
    { id: 1, listingId: 1, clientName: "Анна Волкова", clientPhone: "+79990000001", clientEmail: "anna@realty.local", preferredAt: "2026-10-14T11:00:00.000Z", comment: "like", status: 'created', notifiedAt: null },
    { id: 2, listingId: 2, clientName: "Анна Волкова", clientPhone: "+79990000001", clientEmail: "anna@realty.local", preferredAt: "2026-11-14T11:00:00.000Z", comment: "like", status: 'pending approval', notifiedAt: null },
    { id: 3, listingId: 1, clientName: "Игорь Седов", clientPhone: "+79990000002", clientEmail: "igor@realty.local", preferredAt: "2026-12-14T11:00:00.000Z", comment: "like", status: 'approved', notifiedAt: "2026-09-07T11:00:00.000Z" },
    { id: 4, listingId: 2, clientName: "Игорь Седов", clientPhone: "+79990000002", clientEmail: "igor@realty.local", preferredAt: "2026-12-13T11:00:00.000Z", comment: "like", status: 'rejected', notifiedAt: "2026-09-06T11:00:00.000Z" },
    { id: 5, listingId: 3, clientName: "Мария Титова", clientPhone: "+79990000003", clientEmail: "maria@realty.local", preferredAt: "2026-09-14T11:00:00.000Z", comment: "like", status: 'closed', notifiedAt: "2026-09-05T11:00:00.000Z" },
]