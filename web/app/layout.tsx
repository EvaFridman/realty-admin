import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Витрина недвижимости",
  description: "Витрина объявлений об аренде и продаже недвижимости",
};

export default function RootLayout({ children}: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>
        {children}
      </body>
    </html>
  );
}
