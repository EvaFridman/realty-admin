import { useState, useEffect, useContext } from 'react';
import { ModeratorContext } from './ModeratorContext';
import { usersApi } from '../api/resources';

export function ModeratorProvider({ children }) {
    const [moderators, setModerators] = useState([]);
    const [currentModeratorId, setCurrentModeratorId] = useState(null);

    useEffect(() => {
        async function loadModerators() {
            try {
                const json = await usersApi.list();
                const onlyModerators = (json.data ?? []).filter((u) => u.role === 'moderator');                setModerators(onlyModerators);
                if (onlyModerators.length > 0) setCurrentModeratorId(onlyModerators[0].id);
            } catch (error) {
                console.error('Failed to load moderators:', error);
            }
        }
        loadModerators();
    }, []);

    return (
        <ModeratorContext value={{ moderators, currentModeratorId, setCurrentModeratorId }}>
            {children}
        </ModeratorContext>
    );
}
export function useModerator() {
    return useContext(ModeratorContext);
}
