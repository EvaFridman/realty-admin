import type { ReactElement } from 'react';

import type { PresenceUserType } from '@/features/presence';

import styles from './PresenceBar.module.css';


type Props = { members: PresenceUserType[] };

export default function PresenceBar({ members }: Props): ReactElement | null {
    if (members.length === 0) return null;

    return (
        <div className={styles.bar}>
            {members.map((m) => (
                <span key={m.id} className={styles.badge}>{m.name}</span>
            ))}
        </div>
    );
}