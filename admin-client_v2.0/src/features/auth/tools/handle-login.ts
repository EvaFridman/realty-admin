import { setAccessToken, loginRequest } from '../index';
import type { AuthResponseType } from '../model/model';

export async function handleLogin(email: string, password: string): Promise<AuthResponseType> {
    const response = await loginRequest(email, password);

    if (!response.data) throw new Error('Login response is empty');

    setAccessToken(response.data.accessToken);

    return response.data;
}