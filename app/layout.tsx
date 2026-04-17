export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EFPC Knowledge Management System",
  description: "Frontend-only role-based knowledge platform for EFPC school MVP",
  icons: {
    icon: "/efpc-icon.svg",
    shortcut: "/efpc-icon.svg",
    apple: "/efpc-icon.svg",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
