import type { ReactNode } from 'react';
import { Outlet } from 'react-router';

import { Header } from '@/widgets';

export default function Layout(): ReactNode {
    return (
        <>
            <Header />
            <main>
                <Outlet />
            </main>
        </>
    );
}