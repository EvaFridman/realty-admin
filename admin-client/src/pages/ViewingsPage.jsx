import ViewingsSection from '../features/viewings/ViewingsSection';
import { usePageTitle } from '../hooks/usePageTitle';

export default function ViewingsPage() {
    usePageTitle('Заявки на просмотр');
    return <ViewingsSection />;
}