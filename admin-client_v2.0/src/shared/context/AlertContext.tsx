import { createContext, useContext } from 'react';

export type AlertContextValue = { showAlert: (message: string) => void };

export const AlertContext = createContext<AlertContextValue | null>(null);

export function useAlert() {
    const value = useContext(AlertContext);
    if (!value) throw new Error('useAlert must be used inside AlertProvider');
    return value;
}