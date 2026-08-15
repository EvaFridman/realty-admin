import styles from './ListingDetailPanel.module.css';
import { useOptimistic, useState, useRef, useEffect, startTransition } from 'react';
import { listingsApi } from '../../../api/resources.js';
import { useAlert } from '../../../components/common/AlertProvider.jsx';
import ListingPhotos from './ListingPhotos';
import StatusTransitionButtons from './StatusTransitionButtons';
import RejectionForm from './RejectionForm';
import PublishRequirementsList from './PublishRequirementsList';
import ListingViewingsList from './ListingViewingsList';
import StatusMessage from '../../../components/common/StatusMessage';
import useFetch from '../../../hooks/useFetch';

export default function ListingDetailPanel({ listingId }) {
    const [publishErrors, setPublishErrors] = useState([]);
    const [pendingRejectStatus, setPendingRejectStatus] = useState(false);
    const { showAlert } = useAlert();
    const { data, isLoading, error } = useFetch(
        (signal) => listingsApi.getById(listingId, '', { signal }),
        [listingId]
    );
    const listing = data?.data ?? null;

    const [listingState, setListingState] = useState(null);

    useEffect(() => {
        if (listing) {
            setListingState(listing);
        }
    }, [listing]);

    const [optimisticListing, setOptimisticStatus] = useOptimistic(
        listingState,
        (current, newStatus) => ({ ...current, status: newStatus, _pending: true })
    );

    useEffect(() => {
        if (listingState) {
            startTransition(() => {
                setOptimisticStatus({ ...listingState, _pending: false });
            });
        }
    }, [listingState]);

    const previousListingRef = useRef(null);

    async function applyTransition(newStatus, rejectionReason) {
        setPublishErrors([]);
        previousListingRef.current = optimisticListing;
        startTransition(() => {
            setOptimisticStatus(newStatus);
        });
    
        try {
            const body = { status: newStatus };
            if (newStatus === 'rejected' && rejectionReason) {
                body.rejectionReason = rejectionReason;
            }
            const json = await listingsApi.patchSubresource(listingId, '/status', body);
            setListingState({ ...json.data, _pending: false });
        } catch (err) {
            startTransition(() => {
                setOptimisticStatus(previousListingRef.current);
            });
            if (err.details) {
                const detailsArray = Array.isArray(err.details) ? err.details : [String(err.details)];
                setPublishErrors(detailsArray);
            } else {
                showAlert(`Не удалось изменить статус: ${err.message}`);
            }
        }
    }
    function handleTransitionClick(status) {
        if (status === 'rejected') {
            setPendingRejectStatus(true);
            return;
        }
        applyTransition(status, null);
    }

    function handleRejectSubmit(reason) {
        setPendingRejectStatus(false);
        applyTransition('rejected', reason);
    }

    if (isLoading && !optimisticListing) return <StatusMessage>Загрузка…</StatusMessage>;
    if (error) return <StatusMessage>Ошибка: {error}</StatusMessage>;
    if (!optimisticListing) return null;

    return (
        <div className={optimisticListing._pending ? styles.listingDetailPanelPending : styles.listingDetailPanel}>
            <p className={styles.listingTitle}>{optimisticListing.title}</p>
            <p className={styles.listingMeta}>{optimisticListing.address}, {optimisticListing.district?.title}</p>
            <p className={styles.listingMeta}>агент: {optimisticListing.agent?.name}</p>

            <ListingPhotos photos={optimisticListing.photos} />

            {pendingRejectStatus ? (
                <RejectionForm onSubmit={handleRejectSubmit} onCancel={() => setPendingRejectStatus(false)} />
            ) : (
                <StatusTransitionButtons
                    allowedTransitions={optimisticListing.allowedTransitions}
                    onTransition={handleTransitionClick}
                />
            )}

            <PublishRequirementsList requirements={publishErrors} />

            <ListingViewingsList listingId={listingId} />
        </div>
    );
}