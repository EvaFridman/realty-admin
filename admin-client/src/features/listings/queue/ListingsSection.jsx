import styles from './ListingsSection.module.css';
import { useState } from 'react';
import { listingsApi, districtsApi } from "../../../api/resources.js";
import { emptyListingFilters } from "../../../constants/adminData.js";
import ListingFilterPanel from './ListingFilterPanel';
import ListingListItem from './ListingListItem';
import StatusMessage from "../../../components/common/StatusMessage.jsx";
import Pagination from "../../../components/common/Pagination.jsx";
import ListingDetailPanel from "../components/ListingDetailPanel.jsx";
import useFetch from '../../../hooks/useFetch';

export default function ListingsSection({ statusFilter }) {
    const [filters, setFilters] = useState(emptyListingFilters);
    const [selectedId, setSelectedId] = useState(null);

    const { data: districtsData } = useFetch((signal) => districtsApi.list(undefined, { signal }), []);
    const districts = districtsData?.data ?? [];

    const { data, isLoading, error } = useFetch(
        (signal) => {
            const query = { ...Object.fromEntries(Object.entries(filters).filter(([, v]) => Array.isArray(v) ? v.length > 0 : v !== '' && v != null)) };
            if (filters.rooms?.length) query.rooms = filters.rooms.join(',');
            if (statusFilter) query.status = statusFilter;
            return listingsApi.list(query, { signal });
        },
        [filters, statusFilter]
    );

    const listings = data?.data ?? [];
    const meta = data?.meta ?? null;

    function handleFieldChange(name, value) {
        setFilters((prev) => ({ ...prev, [name]: value, page: 1 }));
    }

    function handleRoomsToggle(room) {
        setFilters((prev) => {
            const rooms = prev.rooms.includes(room) ? prev.rooms.filter((r) => r !== room) : [...prev.rooms, room];
            return { ...prev, rooms, page: 1 };
        });
    }

    function handlePageChange(page) {
        setFilters((prev) => ({ ...prev, page }));
    }

    return (
        <div className={styles.layout}>
            <div className={styles.listColumn}>
                <ListingFilterPanel filters={filters} districts={districts} onFieldChange={handleFieldChange} onRoomsToggle={handleRoomsToggle} />

                {isLoading && <StatusMessage>Загрузка…</StatusMessage>}
                {!isLoading && error && <StatusMessage>Ошибка: {error}</StatusMessage>}
                {!isLoading && !error && listings.length === 0 && <StatusMessage>Ничего не найдено</StatusMessage>}
                {!isLoading && !error && listings.length > 0 && (
                    <div className={styles.list}>
                        {listings.map((listing) => (<ListingListItem key={listing.id} listing={listing} isActive={listing.id === selectedId} onSelect={setSelectedId} />))}
                    </div>
                )}

                {meta && <Pagination page={meta.page} totalPages={meta.totalPages} onPageChange={handlePageChange} />}
            </div>

            <div className={styles.detailColumn}>
                {selectedId ? (
                    <ListingDetailPanel listingId={selectedId} />
                ) : (
                    <StatusMessage>Выберите объявление</StatusMessage>
                )}
            </div>
        </div>
    );
}