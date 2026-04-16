"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BookOpen, ClipboardList, FileCheck2, FileText, Home, Info, LogOut, Settings, Shield, Users, X } from "lucide-react";
import { logout } from "@/store/slices/authSlice";
import { useAppDispatch } from "@/store/hooks";
import type { Role } from "@/store/slices/types";

type SidebarProps = {
  role: Role;
  desktopVisible: boolean;
  mobileOpen: boolean;
  onCloseMobile: () => void;
};

const navMap: Record<Role, { href: string; label: string; icon: React.ComponentType<{ className?: string }> }[]> = {
  admin: [
    { href: "/admin", label: "Dashboard", icon: Home },
    { href: "/admin/users", label: "Users", icon: Users },
    { href: "/admin/approvals", label: "Approvals", icon: FileCheck2 },
    { href: "/admin/audit", label: "Audit Logs", icon: ClipboardList },
    { href: "/admin/settings", label: "Settings", icon: Settings },
    { href: "/glossary", label: "Abbreviations", icon: Info },
  ],
  officer: [
    { href: "/officer", label: "Dashboard", icon: Home },
    { href: "/officer/cases", label: "Cases", icon: Shield },
    { href: "/officer/aars", label: "After-Action Reviews", icon: FileText },
    { href: "/officer/sops", label: "Standard Operating Procedures", icon: FileCheck2 },
    { href: "/officer/knowledge", label: "Knowledge Options", icon: BookOpen },
    { href: "/officer/experts", label: "Experts", icon: Users },
    { href: "/officer/repository", label: "Repository", icon: BookOpen },
    { href: "/glossary", label: "Abbreviations", icon: Info },
  ],
  viewer: [
    { href: "/viewer", label: "Dashboard", icon: Home },
    { href: "/viewer/repository", label: "Repository", icon: BookOpen },
    { href: "/viewer/cases", label: "Cases", icon: Shield },
    { href: "/viewer/aars", label: "After-Action Reviews", icon: FileText },
    { href: "/viewer/sops", label: "Standard Operating Procedures", icon: FileCheck2 },
    { href: "/viewer/experts", label: "Experts", icon: Users },
    { href: "/glossary", label: "Abbreviations", icon: Info },
  ],
};

export default function Sidebar({ role, desktopVisible, mobileOpen, onCloseMobile }: SidebarProps) {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const router = useRouter();

  const navItems = navMap[role];

  const navContent = (
    <>
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between border-b border-blue-300 px-5 py-4">
          <div>
            <p className="text-[11px] uppercase tracking-wide text-blue-100">Ethiopian Federal Police Commission</p>
            <p className="mt-1 text-sm font-semibold text-white">{role.toUpperCase()} Panel</p>
          </div>
          <button className="rounded-md p-1 text-blue-100 hover:bg-[#5a83b6] lg:hidden" onClick={onCloseMobile}>
            <X className="h-4 w-4" />
          </button>
        </div>
        <nav className="space-y-1 p-3">
          {navItems.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onCloseMobile}
                className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm transition ${
                  active
                    ? "bg-[#2f5f98] text-white"
                    : "text-blue-50 hover:bg-[#5a83b6]"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto border-t border-blue-300 p-3">
          <button
            onClick={() => {
              dispatch(logout());
              onCloseMobile();
              router.push("/login");
            }}
            className="flex w-full items-center justify-center gap-2 rounded-md border border-[#c8daf0] bg-[#e6f0fb] px-3 py-2 text-sm text-[#2a4c73] transition hover:bg-[#d7e8fa]"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </div>
    </>
  );

  return (
    <>
      <aside className={`${desktopVisible ? "lg:block" : "lg:hidden"} hidden w-64 shrink-0 border-r border-[#aac0da] bg-[#6f95c3] text-slate-100`}>
        <div className="sticky top-[57px] min-h-[calc(100vh-57px)]">
          {navContent}
        </div>
      </aside>

      {mobileOpen ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button className="absolute inset-0 bg-slate-900/50" onClick={onCloseMobile} />
          <aside className="relative h-full w-72 border-r border-[#aac0da] bg-[#6f95c3] text-slate-100 shadow-2xl">
            {navContent}
          </aside>
        </div>
      ) : null}
    </>
  );
}
