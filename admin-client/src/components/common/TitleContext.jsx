import { createContext, useContext } from 'react';

export const TitleContext = createContext();

export function useTitle() {
    const context = useContext(TitleContext);
    if (!context) {
        throw new Error('useTitle must be used within a TitleProvider');
    }
    return context;
}