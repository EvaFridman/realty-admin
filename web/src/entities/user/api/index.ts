import { apiFetch } from "@/shared/api/api-fetch";
import type { AuthUser } from "../types";

export const userApi = {
    getMe() {
        return apiFetch<AuthUser>("/auth/me");
    },
};