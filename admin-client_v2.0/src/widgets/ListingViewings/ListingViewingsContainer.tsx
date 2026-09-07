import type { ReactNode } from 'react';

import { ListingViewingsList } from '@/entities/listing';
import type { ViewingType } from '@/entities/viewing';

import { Transport } from '@/shared/api/transport';
import useFetch from '@/shared/hooks/useFetch';
import StatusMessage from '@/shared/ui/StatusMessage/StatusMessage';


const listingsTransport = new Transport('/listings');

type Props = { listingId: number };

export default function ListingViewingsContainer({ listingId }: Props): ReactNode {
    const { data, isLoading, error } = useFetch<ViewingType[]>((signal) => listingsTransport.getSubresource<ViewingType[]>(listingId, '/viewings', { signal }), [listingId]);
    if (isLoading) return <StatusMessage>Загрузка…</StatusMessage>;
    if (error) return <StatusMessage>{`Ошибка: ${error}`}</StatusMessage>;

    return <ListingViewingsList viewings={data ?? []} />;
}