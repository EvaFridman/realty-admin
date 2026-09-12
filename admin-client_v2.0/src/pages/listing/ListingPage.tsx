import { useEffect, useOptimistic, useState, startTransition, type ReactNode } from 'react';
import { Link, useLocation, useParams } from 'react-router';

import { PresenceBar } from '@/widgets/presence';

import { PublishRequirementsList , RejectionForm , StatusTransitionButtons } from '@/features/listing-moderation';
import { ListingPhotoManagement } from '@/features/listing-photo-management';
import { CursorLayer, useCursorBroadcast, useRoomPresence } from '@/features/presence';

import { ListingsTransport, listingStatusLabels, type ListingType } from '@/entities/listing';

import { useAlert, useTitle } from '@/shared/context';
import useFetch from '@/shared/hooks/useFetch';
import { useSocket } from '@/shared/hooks/useSocket';
import ErrorView from '@/shared/ui/ErrorView/ErrorView';
import StatusMessage from '@/shared/ui/StatusMessage/StatusMessage';

import { ListingViewingsContainer } from '@/widgets';

import styles from './ListingPage.module.css';

const listingsTransport = new ListingsTransport();

type ListingWithPendingType = ListingType & {
    _pending?: boolean;
};

type LocationStateType = {
    from?: string;
};

export default function ListingPage(): ReactNode {
    const location = useLocation();
    const locationState = location.state as LocationStateType | null;
    const backLink = locationState?.from ?? '/listings';

    const { id } = useParams<{ id: string }>();

    const [publishErrors, setPublishErrors] = useState<string[]>([]);
    const [pendingRejectStatus, setPendingRejectStatus] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);

    const { showAlert } = useAlert();
    const { setTitle } = useTitle();

    const { socket, isConnected } = useSocket();
    const roomMembers = useRoomPresence();

    const listingId = id ? Number(id) : NaN;

    const {
        data: listing,
        isLoading,
        error,
        errorStatus,
        hasResponse,
    } = useFetch<ListingType>(
        (signal) => listingsTransport.getById<ListingType>(id ?? '', '', { signal }),
        [id, refreshKey],
    );

    const [confirmedListing, setConfirmedListing] = useState<ListingWithPendingType | null>(null);
    const [prevId, setPrevId] = useState(id);
    if (id !== prevId) {
        setPrevId(id);
        setConfirmedListing(null);
    }

    const sourceListing: ListingWithPendingType | null =
        confirmedListing ?? listing;

    const [optimisticListing, setOptimisticStatus] = useOptimistic<
        ListingWithPendingType | null,
        ListingType['status']
    >(
        sourceListing,
        (current, newStatus) => {
            if (!current) {
                return current;
            }

            return {
                ...current,
                status: newStatus,
                _pending: true,
            };
        },
    );

    useCursorBroadcast(`listing:${id ?? ''}`);

    useEffect(() => {
        if (!isConnected || !socket || !id) {
            return;
        }

        socket.emit('room:join', `listing:${id}`);

        return () => {
            socket.emit('room:leave');
        };
    }, [socket, isConnected, id]);

    useEffect(() => {
        if (listing?.title) {
            document.title = listing.title;
            setTitle(listing.title); 
        }
    }, [listing?.title, setTitle]); 

    async function applyTransition(
        newStatus: ListingType['status'],
        rejectionReason: string | null,
    ): Promise<void> {
        setPublishErrors([]);

        startTransition(() => {
            setOptimisticStatus(newStatus);
        });

        try {
            const body: {
                status: ListingType['status'];
                rejectionReason?: string;
            } = {
                status: newStatus,
            };

            if (newStatus === 'rejected' && rejectionReason) {
                body.rejectionReason = rejectionReason;
            }

            const response = await listingsTransport.patchSubresource<ListingType>(
                id ?? '',
                '/status',
                body,
            );

            if (response.data) {
                setConfirmedListing(response.data);
            }
        } catch (err: unknown) {
            if (
                typeof err === 'object' &&
                err !== null &&
                'response' in err
            ) {
                const response = err.response;

                if (
                    typeof response === 'object' &&
                    response !== null &&
                    'status' in response &&
                    response.status === 403
                ) {
                    showAlert('Недостаточно прав для изменения статуса');
                    return;
                }
            }

            if (
                typeof err === 'object' &&
                err !== null &&
                'details' in err
            ) {
                const details = err.details;

                const detailsArray = Array.isArray(details)
                    ? details.map(String)
                    : [String(details)];

                setPublishErrors(detailsArray);
                return;
            }

            const message = err instanceof Error
                ? err.message
                : 'Неизвестная ошибка';

            showAlert(`Не удалось изменить статус: ${message}`);
        }
    }

    function handleTransitionClick(
        status: ListingType['status'],
    ): void {
        if (status === 'rejected') {
            setPendingRejectStatus(true);
            return;
        }

        void applyTransition(status, null);
    }

    function handleRejectSubmit(reason: string): void {
        setPendingRejectStatus(false);
        void applyTransition('rejected', reason);
    }

    if (isLoading && !optimisticListing) {
        return <StatusMessage>Загрузка…</StatusMessage>;
    }

    if (error) {
        let errorMessage = 'Ошибка загрузки объявления';
    
        if (errorStatus === 404) {
            errorMessage = 'Объявление не найдено';
        } else if (errorStatus === 403) {
            errorMessage = 'Недостаточно прав для просмотра этого объявления';
        } else if (!hasResponse) {
            errorMessage = 'Сервер недоступен';
        }
    
        return (
            <ErrorView
                message={errorMessage}
                {...(!hasResponse && {
                    onRetry: () => {
                        setRefreshKey((prev) => prev + 1);
                    },
                })}
            >
                <Link to={backLink} className={styles.backBtn}>
                    к списку объявлений
                </Link>
            </ErrorView>
        );
    }

    if (!optimisticListing || !Number.isFinite(listingId)) {
        return null;
    }

    return (
        <div
            className={
                optimisticListing._pending
                    ? styles.listingDetailPending
                    : styles.listingDetail
            }
        >
            <CursorLayer />

            <PresenceBar members={roomMembers} />

            <p className={styles.listingTitle}>
                {optimisticListing.title}
            </p>

            <Link className={styles.backBtn} to={backLink}>
                к списку объявлений
            </Link>

            <p className={styles.listingMeta}>
                {optimisticListing.address},{' '}
                {optimisticListing.district?.title}
            </p>

            <p className={styles.listingMeta}>
                агент: {optimisticListing.agent?.name}
            </p>

            <p className={styles.listingMeta}>
                Статус: <strong>{listingStatusLabels[optimisticListing.status.toLowerCase() as keyof typeof listingStatusLabels] || optimisticListing.status}</strong>
            </p>

            <ListingPhotoManagement
                listingId={listingId}
                listingAgentId={
                    optimisticListing.agent?.id ??
                    optimisticListing.agentId
                }
                photos={optimisticListing.photos ?? []}
                onChange={() => {
                    setRefreshKey((prev) => prev + 1);
                }}
            />

            {pendingRejectStatus ? (
                <RejectionForm
                    onSubmit={handleRejectSubmit}
                    onCancel={() => {
                        setPendingRejectStatus(false);
                    }}
                />
            ) : (
                <StatusTransitionButtons
                    allowedTransitions={optimisticListing.allowedTransitions}
                    onTransition={handleTransitionClick}
                />
            )}

            <PublishRequirementsList requirements={publishErrors} />

            <ListingViewingsContainer listingId={listingId} />
        </div>
    );
}