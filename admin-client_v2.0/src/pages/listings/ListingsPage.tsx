import { useCallback, useState, type ReactNode } from 'react';
import { useSearchParams } from 'react-router';

import { ListingFilterPanel } from '@/features/listing-filters';

import type { DistrictType } from '@/entities/district';
import { ListingListItem, type ListingType } from '@/entities/listing';

import { Transport } from '@/shared/api';
import type { PaginationMetaType } from '@/shared/api/types';
import useFetch from '@/shared/hooks/useFetch';
import PageLoader from '@/shared/ui/PageLoader/PageLoader';
import Pagination from '@/shared/ui/Pagination/Pagination';
import StatusMessage from '@/shared/ui/StatusMessage/StatusMessage';
import { parseListingSearchParams } from '@/shared/utils/parseListingSearchParams';

import styles from './ListingsPage.module.css';

const listingsTransport = new Transport('listings');
const districtsTransport = new Transport('districts');

type Props = {
    statusFilter: string | null;
};

export default function ListingsPage({ statusFilter }: Props): ReactNode {
    const [searchParams, setSearchParams] = useSearchParams();
    const [refreshKey, setRefreshKey] = useState(0);
    const filters = parseListingSearchParams(searchParams);

    const { data: districtsData } = useFetch<DistrictType[]>(
        (signal) => districtsTransport.list<DistrictType[]>(undefined, { signal }),
        []
    );
    const districts = districtsData ?? [];

    const { data, meta, isLoading, error, errorStatus, hasResponse } = useFetch<ListingType[], PaginationMetaType>(
        (signal) => {
            const query = {
                ...Object.fromEntries(Object.entries(filters).filter(([, value]) => Array.isArray(value) ? value.length > 0 : value !== '')),
            };

            if (filters.rooms.length) query.rooms = filters.rooms.join(',');
            if (statusFilter) query.status = statusFilter;

            return listingsTransport.list<ListingType[], PaginationMetaType>(query, { signal });
        },
        [searchParams.toString(), statusFilter, refreshKey]
    );

    const listings = data ?? [];
    const page = filters.page;

    const handleSearchParamChange = useCallback((value: string): void => {
        setSearchParams((params) => {
            if (value) {
                params.set('search', value);
            } else {
                params.delete('search');
            }

            params.set('page', '1');

            return params;
        }, { replace: true });
    }, [setSearchParams]);

    function handleFieldChange(name: string, value: string): void {
        setSearchParams((params) => {
            if (value) {
                params.set(name, value);
            } else {
                params.delete(name);
            }
            params.set('page', '1');
            return params;
        });
    }

    function handleRoomsToggle(room: number): void {
        setSearchParams((params) => {
            const newParams = new URLSearchParams(params);
            const rooms = newParams.getAll('rooms');
            const roomValue = String(room);

            newParams.delete('rooms');
            const newRooms = rooms.includes(roomValue) ? rooms.filter((value) => value !== roomValue) : [...rooms, roomValue];
            newRooms.forEach((value) => { newParams.append('rooms', value); });
            newParams.set('page', '1');

            return newParams;
        });
    }

    function handlePageChange(page: number): void {
        const newParams = new URLSearchParams(searchParams);
        newParams.set('page', String(page));
        setSearchParams(newParams);
    }

    function renderList(): ReactNode {
        if (isLoading) return <StatusMessage><PageLoader /></StatusMessage>;

        if (error) {
            let errorMessage = 'Ошибка загрузки объявлений';

            if (errorStatus === 403) {
                errorMessage = 'Недостаточно прав для просмотра этого раздела';
            } else if (!hasResponse) {
                errorMessage = 'Сервер недоступен';
            }

            return (
                <div>
                    <StatusMessage>{errorMessage}</StatusMessage>
                    {!hasResponse && (
                        <button type="button" onClick={() => { setRefreshKey((value) => value + 1); }}>Повторить</button>
                    )}
                </div>
            );
        }

        if (listings.length === 0) return <StatusMessage>Ничего не найдено</StatusMessage>;

        return (
            <div className={styles.list}>
                {listings.map((listing) => (<ListingListItem key={listing.id} listing={listing} />))}
            </div>
        );
    }

    return (
        <div className={styles.layout}>
            <ListingFilterPanel filters={filters} districts={districts} onSearchChange={handleSearchParamChange} onFieldChange={handleFieldChange} onRoomsToggle={handleRoomsToggle} />
            {renderList()}
            {meta && <Pagination page={page} totalPages={meta.totalPages} onPageChange={handlePageChange} />}
        </div>
    );
}