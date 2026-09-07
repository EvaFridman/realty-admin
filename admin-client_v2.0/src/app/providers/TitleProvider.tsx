import { useEffect, useState, type ReactNode } from 'react';
import { matchPath, useLocation } from 'react-router';

import { TitleContext } from '@/shared/context';

type Props = { children: ReactNode };

type DynamicTitleType = { path: string; title: (params: Record<string, string | undefined>) => string };

type CustomTitleType = { pathname: string; title: string };

const STATIC_TITLES: Record<string, string> = {
    '/': 'Очередь модерации',
    '/listings': 'Все объявления',
    '/viewings': 'Заявки на просмотр',
    '/districts': 'Районы',
    '/select-moderator': 'Выбор модератора',
    '/users': 'Список пользователей',
    '/users/new': 'Создание агента',
    '/profile': 'Личный профиль',
};

const dynamicTitles: DynamicTitleType[] = [
    { path: '/listings/:id', title: (params) => `Объявление #${params.id ?? ''}` },
    { path: '/users/:id', title: (params) => `Пользователь #${params.id ?? ''}` },
];

function getDefaultTitle(pathname: string): string {
    const staticTitle = STATIC_TITLES[pathname];

    if (staticTitle) return staticTitle;

    for (const route of dynamicTitles) {
        const match = matchPath(route.path, pathname);
        if (match)  return route.title(match.params);
    }

    return 'Админ-панель';
}

export function TitleProvider({ children }: Props): ReactNode {
    const location = useLocation();
    const [customTitle, setCustomTitle] = useState<CustomTitleType | null>(null);

    const defaultTitle = getDefaultTitle(location.pathname);

    const title = customTitle?.pathname === location.pathname ? customTitle.title : defaultTitle;

    const setTitle = (value: string | ((previous: string) => string)) => {
        setCustomTitle((current) => {
            const currentTitle = current?.pathname === location.pathname ? current.title : defaultTitle;
            const nextTitle = typeof value === 'function' ? value(currentTitle) : value;

            return { pathname: location.pathname, title: nextTitle };
        });
    };

    useEffect(() => { document.title = `${title} - Админ-панель` }, [title]);

    const value = { title, setTitle };

    return <TitleContext.Provider value={value}>{children}</TitleContext.Provider>;
}