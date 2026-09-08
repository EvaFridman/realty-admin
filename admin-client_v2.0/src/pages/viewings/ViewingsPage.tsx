import axios from 'axios';
import { startTransition, useOptimistic, useRef, useState, type ReactNode } from 'react';
import { useSearchParams } from 'react-router';

import { ViewingFilterPanel } from '@/features/viewing-filters';

import { type ViewingStatusType, type ViewingListItemType } from '@/entities/viewing';
import { ViewingListItem } from '@/entities/viewing';

import { Transport } from '@/shared/api';
import type { PaginationMetaType } from '@/shared/api/types';
import { useAlert } from '@/shared/context/AlertContext';
import useFetch from '@/shared/hooks/useFetch';
import Pagination from '@/shared/ui/Pagination/Pagination';
import StatusMessage from '@/shared/ui/StatusMessage/StatusMessage';
import { parseViewingSearchParams } from '@/shared/utils/parseViewingSearchParams';

import styles from './ViewingsPage.module.css';

const viewingsTransport = new Transport('viewings');

type OptimisticActionType = {
    viewingId: number;
    status: ViewingStatusType;
};

export default function ViewingsPage(): ReactNode {
    const [searchParams, setSearchParams] = useSearchParams();
    const [refreshKey, setRefreshKey] = useState(0);
    const filters = parseViewingSearchParams(searchParams);
    const { showAlert } = useAlert();
    const { data, meta, isLoading, error } = useFetch<ViewingListItemType[], PaginationMetaType>(
        (signal) => {
            const query = {
                ...(filters.status ? { status: filters.status } : {}),
                sortOrder: filters.sortOrder,
                page: filters.page,
                limit: filters.limit,
            };

            return viewingsTransport.list<ViewingListItemType[], PaginationMetaType>(query, { signal });
        },
        [searchParams.toString(), refreshKey]
    );
    const [viewingsState, setViewingsState] = useOptimistic(
        data ?? [],
        (current, { viewingId, status }: OptimisticActionType) => current.map((viewing) => viewing.id === viewingId ? { ...viewing, status, _pending: true } : viewing)
    );
    const previousViewingsRef = useRef<ViewingListItemType[]>([]);

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

    function handlePageChange(page: number): void {
        const newParams = new URLSearchParams(searchParams);
        newParams.set('page', String(page));
        setSearchParams(newParams);
    }

    async function handleTransition(viewingId: number, newStatus: ViewingStatusType): Promise<void> {
        previousViewingsRef.current = viewingsState;
        startTransition(() => { setViewingsState({ viewingId, status: newStatus }) });
        try {
            await viewingsTransport.patchSubresource(viewingId, '/status', { status: newStatus });
            setRefreshKey((value) => value + 1);
        } catch (err: unknown) {
            const previousStatus = previousViewingsRef.current.find((viewing) => viewing.id === viewingId)?.status;

            if (previousStatus !== undefined) {
                startTransition(() => { setViewingsState({ viewingId, status: previousStatus }) });
            }

            if (axios.isAxiosError(err) && err.response?.status === 403) {
                showAlert('Недостаточно прав для изменения статуса заявки');
            } else if (err instanceof Error) {
                showAlert(`Не удалось изменить статус заявки: ${err.message}`);
            } else {
                showAlert('Не удалось изменить статус заявки');
            }
        }
    }

    return (
        <div className={styles.viewingsContainer}>
            <ViewingFilterPanel filters={filters} onFieldChange={handleFieldChange} />

            {isLoading && <StatusMessage>Загрузка…</StatusMessage>}
            {!isLoading && error && (
                <div>
                    <StatusMessage>{error}</StatusMessage>
                    <button type="button" onClick={() => { setRefreshKey((value) => value + 1); }}>Повторить</button>
                </div>
            )}
            {!isLoading && !error && viewingsState.length === 0 && <StatusMessage>Заявок не найдено</StatusMessage>}

            {!isLoading && !error && viewingsState.length > 0 && (
                <div className={styles.viewingsList}>
                    {viewingsState.map((viewing) => (<ViewingListItem key={viewing.id} viewing={viewing} onTransition={(viewingId: number, status: ViewingStatusType) => { void handleTransition(viewingId, status); }} />))}
                </div>
            )}

            {meta && <Pagination page={meta.page} totalPages={meta.totalPages} onPageChange={handlePageChange} />}
        </div>
    );
}