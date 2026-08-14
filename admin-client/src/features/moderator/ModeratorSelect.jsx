import styles from './ModeratorSelect.module.css';
import { useModerator } from "./ModeratorProvider.jsx";

export default function ModeratorSelect() {
    const { moderators, currentModeratorId, setCurrentModeratorId } = useModerator();
    return (
        <select className={styles.moderatorsSelect} value={currentModeratorId ?? ''} onChange={(e) => setCurrentModeratorId(Number(e.target.value))}>
            <option value="">Выберите модератора</option>
            {moderators.map((moderator) => (<option key={moderator.id} value={moderator.id}>{moderator.name}</option>))}
        </select>
    )
}