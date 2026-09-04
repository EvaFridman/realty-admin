import { useState, useEffect, type ReactNode } from 'react';
import { useLocation, matchPath } from 'react-router';

import { TitleContext } from '@/shared/context/TitleContext';

type TitleProviderProps = { children: ReactNode };

type DynamicTitle = { path: string; title: (params: Record<string, string | undefined>) => string };

const staticTitles: Record<string, string> = {
    '/': 'Очередь модерации',
    '/listings': 'Все объявления',
    '/viewings': 'Заявки на просмотр',
    '/districts': 'Районы',
    '/select-moderator': 'Выбор модератора',
    '/users': 'Список пользователей',
    '/users/new': 'Создание агента',
    '/profile': 'Личный профиль',
};

const dynamicTitles: DynamicTitle[] = [
    { path: '/listings/:id', title: (params) => `Объявление #${params.id}` },
    { path: '/users/:id', title: (params) => `Пользователь #${params.id}` },
];

export function TitleProvider({ children }: TitleProviderProps) {
    const location = useLocation();
    const [title, setTitle] = useState('Админ-панель');

    useEffect(() => {
        const staticTitle = staticTitles[location.pathname];

        if (staticTitle) {
            setTitle(staticTitle);
            return;
        }

        for (const route of dynamicTitles) {
            const match = matchPath(route.path, location.pathname);
            if (match) {
                setTitle(route.title(match.params));
                return;
            }
        }

        setTitle('Админ-панель');
    }, [location.pathname]);

    useEffect(() => {
        document.title = title ? `${title} - Админ-панель` : 'Админ-панель';
    }, [title]);

    const value = { title, setTitle };

    return <TitleContext.Provider value={value}>{children}</TitleContext.Provider>;
}