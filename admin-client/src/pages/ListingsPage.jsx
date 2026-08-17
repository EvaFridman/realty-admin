import ListingsSection from '../features/listings/queue/ListingsSection';
import { usePageTitle } from '../hooks/usePageTitle';

export default function ListingsPage() {
    usePageTitle('Все объявления');
    return <ListingsSection statusFilter={null} />;
}