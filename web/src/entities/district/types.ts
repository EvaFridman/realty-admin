export type PublicDistrictType = {
    id: number;
    title: string;
    city: string;
    publishedListingsCount: number;
};

export type PublicDistrictsResponse = {
    items: PublicDistrictType[];
    meta: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
};