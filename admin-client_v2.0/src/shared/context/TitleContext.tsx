import { createContext, useContext, type Dispatch, type SetStateAction } from 'react';

type TitleContextValue = { title: string; setTitle: Dispatch<SetStateAction<string>> };

export const TitleContext = createContext<TitleContextValue | null>(null);

export function useTitle() {
    const context = useContext(TitleContext);
    if (!context) throw new Error('useTitle must be used within a TitleProvider');
    return context;
}