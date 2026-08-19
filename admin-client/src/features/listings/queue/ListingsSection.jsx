import styles from './ListingsSection.module.css';
import { useCallback } from 'react';
import { useSearchParams } from 'react-router';
import { listingsApi, districtsApi } from "../../../api/resources.js";
import { parseListingSearchParams } from '../../../shared/utils/parseListingSearchParams';
import ListingFilterPanel from './ListingFilterPanel';
import ListingListItem from './ListingListItem';
import StatusMessage from "../../../components/common/StatusMessage.jsx";
import Pagination from "../../../components/common/Pagination.jsx";
import useFetch from '../../../hooks/useFetch';
import Loader from '../../../widgets/Loader.jsx'

export default function ListingsSection({ statusFilter }) {
    const [searchParams, setSearchParams] = useSearchParams();
    const filters = parseListingSearchParams(searchParams);

    const { data: districtsData } = useFetch((signal) => districtsApi.list(undefined, { signal }), []);
    const districts = districtsData?.data ?? [];

    const { data, isLoading, error, refetch } = useFetch(
        (signal) => {
            const query = { ...Object.fromEntries(Object.entries(filters).filter(([, v]) => Array.isArray(v) ? v.length > 0 : v !== '' && v != null)) };
            if (filters.rooms?.length) query.rooms = filters.rooms.join(',');
            if (statusFilter) query.status = statusFilter;
            return listingsApi.list(query, { signal });
        },
        [searchParams.toString(), statusFilter]
    );

    const listings = data?.data ?? [];
    const meta = data?.meta ?? null;
    const page = filters.page;

    const handleSearchParamChange = useCallback((value) => {
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

    function handleFieldChange(name, value) {
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

    function handleRoomsToggle(room) {
        setSearchParams((params) => {
            const newParams = new URLSearchParams(params);
            const rooms = newParams.getAll('rooms');
            const roomValue = String(room);

            newParams.delete('rooms');
            const newRooms = rooms.includes(roomValue) ? rooms.filter((value) => value !== roomValue) : [...rooms, roomValue];
            newRooms.forEach((value) => newParams.append('rooms', value));
            newParams.set('page', '1');

            return newParams;
        });
    }

    function handlePageChange(page) {
        const newParams = new URLSearchParams(searchParams);
        newParams.set('page', String(page));
        setSearchParams(newParams);
    }

    function renderList() {
        if (isLoading) return <StatusMessage><Loader /></StatusMessage>;
        if (error) {
            let errorMessage = 'Ошибка загрузки объявлений';
            if (error.response?.status === 403) errorMessage = 'Недостаточно прав для просмотра этого раздела';
            else if (!error.response) errorMessage = 'Сервер недоступен';
            const showRetry = !error.response;
            return (
                <div>
                    <StatusMessage>{errorMessage}</StatusMessage>
                    {showRetry && <button onClick={refetch}>Повторить</button>}
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
            {meta && <Pagination page={page} totalPages={meta?.totalPages ?? 1} onPageChange={handlePageChange} />}
        </div>
    );
}