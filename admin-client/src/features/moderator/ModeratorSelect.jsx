import styles from './ModeratorSelect.module.css';
import { useModerator } from "./ModeratorProvider.jsx";

export default function ModeratorSelect({ onSelect }) {
    const { moderators, currentModeratorId, setCurrentModeratorId } = useModerator();

    function handleChange(e) {
        const id = Number(e.target.value);
        setCurrentModeratorId(id);
        onSelect?.(id);
    }

    return (
        <select className={styles.moderatorsSelect} value={currentModeratorId ?? ''} onChange={handleChange}>
            <option value="">Выберите модератора</option>
            {moderators.map((moderator) => (<option key={moderator.id} value={moderator.id}>{moderator.name}</option>))}
        </select>
    )
}