import { Outlet } from 'react-router';
import Header from '../../widgets/Header';

export default function Layout() {
    return (
        <>
            <Header />
            <main>
                <Outlet />
            </main>
        </>
    )
}