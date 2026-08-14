import styles from './ListingDetailPanel.module.css';
import { useOptimistic, useState, useEffect } from 'react';
import { listingsApi } from '../../../api/resources.js';
import { useAlert } from '../../../components/common/AlertProvider.jsx';
import ListingPhotos from './ListingPhotos';
import StatusTransitionButtons from './StatusTransitionButtons';
import RejectionForm from './RejectionForm';
import PublishRequirementsList from './PublishRequirementsList';
import ListingViewingsList from './ListingViewingsList';
import StatusMessage from '../../../components/common/StatusMessage';

export default function ListingDetailPanel({ listingId }) {
    const [listing, setListing] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [publishErrors, setPublishErrors] = useState([]);
    const [pendingRejectStatus, setPendingRejectStatus] = useState(false);
    const { showAlert } = useAlert();

    useEffect(() => {
        const controller = new AbortController();
        async function load() {
            setIsLoading(true);
            setError(null);
            try {
                const json = await listingsApi.getById(listingId, { signal: controller.signal });
                setListing(json.data);
            } catch (err) {
                if (err.name === 'AbortError') return;
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        }
        load();
        return () => controller.abort();
    }, [listingId]);

    const [optimisticListing, setOptimisticStatus] = useOptimistic(listing, (current, newStatus) => ({ ...current, status: newStatus, _pending: true })
    );

    async function applyTransition(newStatus, rejectionReason) {
        setPublishErrors([]);
        setOptimisticStatus(newStatus);
        try {
            const json = await listingsApi.patchSubresource(listingId, '/status', { status: newStatus, rejectionReason });
            setListing(json.data);
        } catch (err) {
            if (err.details) {
                setPublishErrors(err.details);
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

    if (isLoading && !listing) return <StatusMessage>Загрузка…</StatusMessage>;
    if (error) return <StatusMessage>Ошибка: {error}</StatusMessage>;
    if (!optimisticListing) return null;

    return (
        <div className={optimisticListing._pending ? styles.listingDetailPanelPending : styles.listingDetailPanel}>
            <p className={styles.listingTitle}>{optimisticListing.title}</p>
            <p className={styles.listingMeta}>{optimisticListing.address} · {optimisticListing.district?.title}</p>
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