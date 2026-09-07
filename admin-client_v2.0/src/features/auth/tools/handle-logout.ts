import { setAccessToken, logoutRequest } from '../index';

export async function handleLogout(): Promise<void> {
    try {
        await logoutRequest();
    } finally {
        setAccessToken(null);
    }
}