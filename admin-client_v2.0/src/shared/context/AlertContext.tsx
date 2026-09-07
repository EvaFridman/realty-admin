import { createContext, useContext } from 'react';

export type AlertContextValueType = { showAlert: (message: string) => void };

export const AlertContext = createContext<AlertContextValueType | null>(null);

export function useAlert(): AlertContextValueType {
    const value = useContext(AlertContext);
    if (!value) throw new Error('useAlert must be used inside AlertProvider');
    return value;
}