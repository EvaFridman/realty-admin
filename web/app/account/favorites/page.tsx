import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";

import { FavoritesList } from "@/entities/favorites/FavoritesList";
import { getSession } from "@/shared/session";
import { Loader } from "@/shared/ui";

export const metadata: Metadata = { title: "Избранное" };

async function AccountFavoritesContent() {
    const session = await getSession();

    if (!session) redirect("/login?returnUrl=/account/favorites");

    return (
        <Suspense fallback={<Loader />}>
            <FavoritesList />
        </Suspense>
    );
}

export default function AccountFavoritesPage() {
    return (
        <Suspense fallback={<Loader />}>
            <AccountFavoritesContent />
        </Suspense>
    );
}