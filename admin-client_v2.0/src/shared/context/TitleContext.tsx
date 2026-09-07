import { createContext, useContext, type Dispatch, type SetStateAction } from 'react';

type TitleContextValueType = { title: string; setTitle: Dispatch<SetStateAction<string>> };

export const TitleContext = createContext<TitleContextValueType | null>(null);

export function useTitle(): TitleContextValueType {
    const context = useContext(TitleContext);
    if (!context) throw new Error('useTitle must be used within a TitleProvider');
    return context;
}