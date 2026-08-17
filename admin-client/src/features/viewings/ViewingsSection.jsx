import styles from './ViewingsSection.module.css';
import { useSearchParams } from 'react-router';
import { useEffect, useState, useRef } from 'react';
import { viewingsApi } from '../../api/resources';
import { useAlert } from '../../components/common/AlertProvider';
import { parseViewingSearchParams } from '../../shared/utils/parseViewingSearchParams';
import ViewingFilterPanel from './ViewingFilterPanel';
import ViewingListItem from './ViewingListItem';
import StatusMessage from '../../components/common/StatusMessage';
import Pagination from '../../components/common/Pagination';
import useFetch from '../../hooks/useFetch';

export default function ViewingsSection() {
    const [searchParams, setSearchParams] = useSearchParams();
    const filters = parseViewingSearchParams(searchParams);
    const { data, isLoading, error } = useFetch(
        (signal) => {
            const query = new URLSearchParams();

            if (filters.status) query.set('status', filters.status);
            query.set('sortOrder', filters.sortOrder);
            query.set('page', String(filters.page));
            query.set('limit', String(filters.limit));

            return viewingsApi.list(query, { signal });
        },
        [searchParams.toString()]
    );
    const [viewingsState, setViewingsState] = useState([]);
    const meta = data?.meta ?? null;
    useEffect(() => {
        if (data?.data) setViewingsState(data.data);
    }, [data]);
    const previousViewingsRef = useRef([]);
    const { showAlert } = useAlert();

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

    function handlePageChange(page) {
        const newParams = new URLSearchParams(searchParams);
        newParams.set('page', String(page));
        setSearchParams(newParams);
    }

    async function handleTransition(viewingId, newStatus) {
        previousViewingsRef.current = viewingsState;
        setViewingsState((prev) => prev.map((v) => v.id === viewingId ? { ...v, status: newStatus, _pending: true } : v));
        try {
            const json = await viewingsApi.patchSubresource(viewingId, '/status', { status: newStatus });
            setViewingsState((prev) => prev.map((v) => v.id === viewingId ? { ...json.data, _pending: false } : v));
        } catch (err) {
            setViewingsState(previousViewingsRef.current);
            showAlert(`Не удалось изменить статус заявки: ${err.message}`);
        }
    }

    return (
        <div className={styles.viewingsContainer}>
            <ViewingFilterPanel filters={filters} onFieldChange={handleFieldChange} />

            {isLoading && <StatusMessage>Загрузка…</StatusMessage>}
            {!isLoading && error && <StatusMessage>Ошибка: {error}</StatusMessage>}
            {!isLoading && !error && viewingsState.length === 0 && <StatusMessage>Заявок не найдено</StatusMessage>}

            {!isLoading && !error && viewingsState.length > 0 && (
                <div className={styles.viewingsList}>
                    {viewingsState.map((v) => (<ViewingListItem key={v.id} viewing={v} onTransition={handleTransition} />))}
                </div>
            )}

            {meta && <Pagination page={meta.page} totalPages={meta.totalPages} onPageChange={handlePageChange} />}
        </div>
    );
}