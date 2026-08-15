import styles from './ViewingFilterPanel.module.css';
import { viewingStatusLabels } from '../../constants/adminData';

export default function ViewingFilterPanel({ filters, onFieldChange }) {
    function handleChange(e) {
        onFieldChange(e.target.name, e.target.value);
    }

    return (
        <div className={styles.viewingsFilterPanel}>
            <select name="status" value={filters.status} onChange={handleChange}>
                <option value="">Статус: любой</option>
                {Object.entries(viewingStatusLabels).map(([value, label]) => (<option key={value} value={value}>{label}</option>))}
            </select>

            <select name="sortOrder" value={filters.sortOrder} onChange={handleChange}>
                <option value="desc">Сначала новые</option>
                <option value="asc">Сначала старые</option>
            </select>
        </div>
    );
}