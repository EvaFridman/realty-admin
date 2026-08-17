import { createContext } from 'react';
import { useContext } from 'react';

export const ModeratorContext = createContext(null);

export function useModerator() {
    return useContext(ModeratorContext);
}