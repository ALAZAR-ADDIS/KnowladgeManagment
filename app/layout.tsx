export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "EFPC Knowledge Management System",
  description: "Frontend-only role-based knowledge platform for EFPC school MVP",
  icons: {
    icon: "/efpc-icon.svg",
    shortcut: "/efpc-icon.svg",
    apple: "/efpc-icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <Providers>
          <Suspense>{children}</Suspense>
        </Providers>
      </body>
    </html>
  );
}
