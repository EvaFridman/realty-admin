import styles from './ListingPage.module.css';
import { useParams, Link, useLocation } from 'react-router';
import { useOptimistic, useState, startTransition, useEffect } from 'react';
import { listingsApi } from '../api/resources.js';
import { useAlert } from '../components/common/AlertContext.jsx';
import { useTitle } from '../components/common/TitleContext';
import PhotoGallery from '../features/listings/components/PhotoGallery'; 
import StatusTransitionButtons from '../features/listings/components/StatusTransitionButtons';
import RejectionForm from '../features/listings/components/RejectionForm';
import PublishRequirementsList from '../features/listings/components/PublishRequirementsList';
import ListingViewingsList from '../features/listings/components/ListingViewingsList';
import StatusMessage from '../components/common/StatusMessage';
import ErrorView from '../shared/ui/ErrorView.jsx';
import useFetch from '../hooks/useFetch';

export default function ListingPage() {
    const location = useLocation();
    const backLink = location.state?.from || '/listings';

    const { id } = useParams();
    const [publishErrors, setPublishErrors] = useState([]);
    const [pendingRejectStatus, setPendingRejectStatus] = useState(false);
    const { showAlert } = useAlert();
    const { setTitle } = useTitle();
    const [refreshKey, setRefreshKey] = useState(0);

    const { data, isLoading, error, refetch } = useFetch(
        (signal) => listingsApi.getById(id, '', { signal }),
        [id, refreshKey]
    );
    const listing = data?.data ?? null;

    const [prevId, setPrevId] = useState(id);
    const [confirmedListing, setConfirmedListing] = useState(null);
    if (id !== prevId) {
        setPrevId(id);
        setConfirmedListing(null);
    }

    const sourceListing = confirmedListing ?? listing;

    const [optimisticListing, setOptimisticStatus] = useOptimistic(
        sourceListing,
        (current, newStatus) => ({ ...current, status: newStatus, _pending: true })
    );

    useEffect(() => {
        if (optimisticListing?.title) {
            setTitle(optimisticListing.title);
        }
    }, [optimisticListing, setTitle]);

    async function applyTransition(newStatus, rejectionReason) {
        setPublishErrors([]);
        startTransition(() => {
            setOptimisticStatus(newStatus);
        });

        try {
            const body = { status: newStatus };
            if (newStatus === 'rejected' && rejectionReason) {
                body.rejectionReason = rejectionReason;
            }
            const { data: updatedListing } = await listingsApi.patchSubresource(id, '/status', body);
            setConfirmedListing(updatedListing);
        } catch (err) {
            if (err.response?.status === 403) {
                showAlert('Недостаточно прав для изменения статуса');
            } else if (err.details) {
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

    if (error) {
        let errorMessage = 'Ошибка загрузки объявления';
        if (error.response?.status === 404) errorMessage = 'Объявление не найдено';
        else if (error.response?.status === 403) errorMessage = 'Недостаточно прав для просмотра этого объявления';
        else if (!error.response) errorMessage = 'Сервер недоступен';
        const showRetry = !error.response;

        return (
            <ErrorView error={error} onRetry={showRetry ? refetch : undefined}>
                <p>{errorMessage}</p>
                <Link to={backLink} className={styles.backBtn}>к списку объявлений</Link>
            </ErrorView>
        );
    }

    if (!optimisticListing) return null;

    return (
        <div className={optimisticListing._pending ? styles.listingDetailPending : styles.listingDetail}>
            <p className={styles.listingTitle}>{optimisticListing.title}</p>
            <Link className={styles.backBtn} to={backLink}>к списку объявлений</Link>
            <p className={styles.listingMeta}>{optimisticListing.address}, {optimisticListing.district?.title}</p>
            <p className={styles.listingMeta}>агент: {optimisticListing.agent?.name}</p>

            <PhotoGallery
                photos={optimisticListing.photos || []}
                listingId={id}
                listingAgentId={optimisticListing.agent?.id || optimisticListing.agentId}
                onChange={() => {
                    setRefreshKey(prev => prev + 1);
                }}
            />


            {pendingRejectStatus ? (
                <RejectionForm onSubmit={handleRejectSubmit} onCancel={() => setPendingRejectStatus(false)} />
            ) : (
                <StatusTransitionButtons
                    allowedTransitions={optimisticListing.allowedTransitions}
                    onTransition={handleTransitionClick}
                />
            )}

            <PublishRequirementsList requirements={publishErrors} />

            <ListingViewingsList listingId={id} />
        </div>
    );
}