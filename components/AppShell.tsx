"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { useAppSelector } from "@/store/hooks";
import { resolveLocale } from "@/lib/i18n";
import LocalizedTree from "./LocalizedTree";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import type { Role } from "@/store/slices/types";

type AppShellProps = {
  role: Role;
  children: ReactNode;
};

export default function AppShell({ role, children }: AppShellProps) {
  const [desktopSidebarVisible, setDesktopSidebarVisible] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const settings = useAppSelector((state) => state.admin.settings);
  const locale = resolveLocale(settings.language);

  const toggleSidebar = () => {
    if (window.matchMedia("(min-width: 1024px)").matches) {
      setDesktopSidebarVisible((s) => !s);
      return;
    }
    setMobileSidebarOpen((s) => !s);
  };

  return (
    <div
      className={`min-h-screen ${
        settings.theme === "dark"
          ? "bg-[radial-gradient(circle_at_top,#1e293b_0%,#020617_58%)] text-slate-100"
          : "bg-[radial-gradient(circle_at_top,#e7f1ff_0%,#f3f8ff_58%,#f8fbff_100%)] text-slate-900"
      }`}
      data-theme={settings.theme}
    >
      <Navbar
        onToggleSidebar={toggleSidebar}
        isSidebarOpen={desktopSidebarVisible || mobileSidebarOpen}
        appName={settings.appName}
        language={settings.language}
        theme={settings.theme}
      />
      <div className="mx-auto flex max-w-screen-2xl">
        <Sidebar
          role={role}
          desktopVisible={desktopSidebarVisible}
          mobileOpen={mobileSidebarOpen}
          onCloseMobile={() => setMobileSidebarOpen(false)}
        />
        <main className="w-full p-4 md:p-6">
          <LocalizedTree locale={locale}>{children}</LocalizedTree>
        </main>
      </div>
    </div>
  );
}
