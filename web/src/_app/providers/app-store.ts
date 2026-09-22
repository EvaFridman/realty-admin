import { createStore } from "zustand/vanilla";

export type CatalogViewType = "grid" | "list";

export type AppState = {
    catalogView: CatalogViewType;
    recentlyViewedIds: string[];
    searchQuery: string;
}

export type AppActions = {
    setCatalogView: (view: CatalogViewType) => void;
    setRecentlyViewedIds: (ids: string[]) => void;
    addRecentlyViewedId: (id: string) => void;
    setSearchQuery: (query: string) => void;
}

export type AppStore = AppState & AppActions;

export const createInitialAppStore = () => {
    return createStore<AppStore>((set) => ({
        catalogView: "grid",
        recentlyViewedIds: [],
        searchQuery: "",

        setCatalogView: (view) => set({ catalogView: view }),
        
        setRecentlyViewedIds: (ids) => set({ recentlyViewedIds: ids }),
        
        addRecentlyViewedId: (id) => set((state) => {
            const filtered = state.recentlyViewedIds.filter((item) => item !== id);
            return { recentlyViewedIds: [id, ...filtered].slice(0, 5) };
        }),

        setSearchQuery: (query) => set({ searchQuery: query }),
    }));
};
