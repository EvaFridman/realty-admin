import { apiFetch } from "@/shared/api/api-fetch";

import type { PublicViewingType, ViewingStatus } from "../types";

type GetMyViewingsParams = {
    page?: number;
    limit?: number;
    status?: ViewingStatus;
};

export async function getMyViewings(params: GetMyViewingsParams = {}) {
    const searchParams = new URLSearchParams();

    if (params.page) searchParams.set("page", String(params.page));
    if (params.limit) searchParams.set("limit", String(params.limit));
    if (params.status) searchParams.set("status", params.status);

    const query = searchParams.toString();

    return await apiFetch<PublicViewingType[]>(
        `/public/viewings/my${query ? `?${query}` : ""}`,
    );
}