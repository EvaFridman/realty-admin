import ListingsSection from '../features/listings/queue/ListingsSection';
import { usePageTitle } from '../hooks/usePageTitle';

export default function QueuePage() {
    usePageTitle('Очередь модерации');
    return <ListingsSection statusFilter="moderation" />;
}