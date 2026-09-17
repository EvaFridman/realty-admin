import { ReactNode, Suspense } from "react";
import type { Metadata } from "next";

import "./globals.css";

import { Header, Footer } from "@/widgets";
import { ThemeInit } from "@/features/theme/ThemeInit";
import { Loader } from "@/shared/ui";

export const metadata: Metadata = {
    title: "Витрина недвижимости",
    description: "Витрина объявлений об аренде и продаже недвижимости",
};

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="ru" suppressHydrationWarning>
            <head>
                <ThemeInit />
            </head>
            <body>
            <Suspense fallback={<Loader />}>
                <Header />
            </Suspense>
            <main>{children}</main>
                <Footer />
            </body>
        </html>
    );
}