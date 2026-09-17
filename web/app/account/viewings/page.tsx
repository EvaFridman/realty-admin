import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";

import { getMyViewings } from "@/entities/viewing/api";
import { getSession } from "@/shared/session";
import { Loader } from "@/shared/ui";

import { ViewingsList } from "@/_pages/viewings/ViewingsList";

export const metadata: Metadata = { title: "Заявки на просмотр" };

async function AccountViewingsContent() {
    const session = await getSession();

    if (!session) redirect("/login?returnUrl=/account/viewings");

    const viewings = await getMyViewings();

    return <ViewingsList viewings={viewings}/>;
}

export default function AccountViewingsPage() {
    return (
        <Suspense fallback={<Loader />}>
            <AccountViewingsContent />
        </Suspense>
    );
}