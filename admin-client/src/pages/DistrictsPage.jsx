import DistrictsSection from '../features/districts/DistrictsSection';
import { usePageTitle } from '../hooks/usePageTitle';

export default function DistrictsPage() {
    usePageTitle('Районы');
    return <DistrictsSection />;
}