import styles from './ViewingsSection.module.css';
import { useSearchParams } from 'react-router';
import { useState, useOptimistic, startTransition, useRef } from 'react';
import { viewingsApi } from '../../api/resources';
import { useAlert } from '../../components/common/AlertContext';
import { parseViewingSearchParams } from '../../shared/utils/parseViewingSearchParams';
import ViewingFilterPanel from './ViewingFilterPanel';
import ViewingListItem from './ViewingListItem';
import StatusMessage from '../../components/common/StatusMessage';
import Pagination from '../../components/common/Pagination';
import useFetch from '../../hooks/useFetch';

export default function ViewingsSection() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [refreshKey, setRefreshKey] = useState(0);
    const filters = parseViewingSearchParams(searchParams);
    const { data, isLoading, error, refetch } = useFetch(
        (signal) => {
            const query = {
                ...(filters.status ? { status: filters.status } : {}),
                sortOrder: filters.sortOrder,
                page: filters.page,
                limit: filters.limit,
            };

            return viewingsApi.list(query, { signal });
        },
        [searchParams.toString(), refreshKey]
    );
    const [viewingsState, setViewingsState] = useOptimistic(
        data?.data ?? [],
        (current, { viewingId, status }) => current.map((viewing) => viewing.id === viewingId ? { ...viewing, status, _pending: true } : viewing)
    );
    const meta = data?.meta ?? null;
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
        startTransition(() => { setViewingsState({ viewingId, status: newStatus }) });
        try {
            await viewingsApi.patchSubresource(viewingId, '/status', { status: newStatus });
            setRefreshKey((value) => value + 1);
        } catch (err) {
            startTransition(() => { setViewingsState({ viewingId, status: previousViewingsRef.current.find((viewing) => viewing.id === viewingId)?.status }); });
            if (err.response?.status === 403) {
                showAlert('Недостаточно прав для изменения статуса заявки');
            } else {
                showAlert(`Не удалось изменить статус заявки: ${err.message}`);
            }
        }
    }

    return (
        <div className={styles.viewingsContainer}>
            <ViewingFilterPanel filters={filters} onFieldChange={handleFieldChange} />

            {isLoading && <StatusMessage>Загрузка…</StatusMessage>}
            {!isLoading && error && (
                <div>
                    <StatusMessage>{!error.response ? 'Сервер недоступен' : `Ошибка: ${error.message}`}</StatusMessage>
                    {!error.response && <button onClick={refetch}>Повторить</button>}
                </div>
            )}
            {!isLoading && !error && viewingsState.length === 0 && <StatusMessage>Заявок не найдено</StatusMessage>}

            {!isLoading && !error && viewingsState.length > 0 && (
                <div className={styles.viewingsList}>
                    {viewingsState.map((viewing) => (<ViewingListItem key={viewing.id} viewing={viewing} onTransition={handleTransition} />))}
                </div>
            )}

            {meta && <Pagination page={meta.page} totalPages={meta.totalPages} onPageChange={handlePageChange} />}
        </div>
    );
}