import { ReactNode } from "react";
import type { Metadata } from "next";
import Script from "next/script";

import "./globals.css";

import { Header, Footer } from "@/widgets";

export const metadata: Metadata = {
    title: "Витрина недвижимости",
    description: "Витрина объявлений об аренде и продаже недвижимости",
};

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="ru" suppressHydrationWarning>
            <head>
                <Script id="theme-init" strategy="beforeInteractive">
                    {`
                        const savedTheme = localStorage.getItem("theme");
                        const theme = savedTheme === "light" || savedTheme === "dark" ? savedTheme : window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
                        document.documentElement.classList.add(theme);
                    `}
                </Script>
            </head>
            <body>
                <Header />
                <main>{children}</main>
                <Footer />
            </body>
        </html>
    );
}