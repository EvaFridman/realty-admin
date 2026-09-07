import { api } from '@/shared/api';
import type { ApiResponseType } from '@/shared/api';

import type { AuthResponseType } from '../model/model';

import { refreshClient } from './index';

const AUTH_ROUTES = {
    login: '/auth/login',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
} as const;

export function loginRequest(
    email: string,
    password: string,
): Promise<ApiResponseType<AuthResponseType>> {
    return api<ApiResponseType<AuthResponseType>>({
        url: AUTH_ROUTES.login,
        method: 'POST',
        data: { email, password },
    });
}

export function logoutRequest(): Promise<ApiResponseType<null>> {
    return api<ApiResponseType<null>>({
        url: AUTH_ROUTES.logout,
        method: 'POST',
    });
}

export function refreshRequest(): Promise<ApiResponseType<AuthResponseType>> {
    return refreshClient.post<ApiResponseType<AuthResponseType>>(
        AUTH_ROUTES.refresh,
    ).then((response) => response.data);
}