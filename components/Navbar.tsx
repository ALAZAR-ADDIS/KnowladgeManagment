"use client";

import { LogOut, PanelLeft, ShieldCheck } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { logout } from "@/store/slices/authSlice";
import { updateSettings } from "@/store/slices/adminSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { localeToLanguageLabel, resolveLocale, t, translateLoose, type Locale } from "@/lib/i18n";

type NavbarProps = {
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
  appName: string;
  language: string;
  theme: "light" | "dark";
};

export default function Navbar({ onToggleSidebar, isSidebarOpen, appName, language, theme }: NavbarProps) {
  const { currentUser, currentRole } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const locale = resolveLocale(language);

  if (pathname === "/login") return null;

  const onLogout = () => {
    dispatch(logout());
    router.push("/login");
  };

  const onSwitchLanguage = (nextLocale: Locale) => {
    dispatch(updateSettings({ language: localeToLanguageLabel(nextLocale) }));
  };

  return (
    <header
      className={`sticky top-0 z-30 border-b backdrop-blur ${
        theme === "dark"
          ? "border-slate-700 bg-slate-900/88"
          : "border-blue-100 bg-[#f7fbff]/92 shadow-sm shadow-blue-100/60"
      }`}
    >
      <div className="mx-auto flex max-w-screen-2xl items-center justify-between px-4 py-3 md:px-6">
        <div>
          <p className={`text-xs uppercase tracking-wide ${theme === "dark" ? "text-slate-400" : "text-slate-500"}`}>{t(locale, "navbar.organization")}</p>
          <p className={`text-sm font-semibold ${theme === "dark" ? "text-slate-100" : "text-slate-800"}`}>{translateLoose(locale, appName)}</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className={`inline-flex items-center gap-1 rounded-md border px-2.5 py-1.5 text-xs ${
              theme === "dark"
                ? "border-slate-600 text-slate-200 hover:bg-slate-700"
                : "border-blue-200 bg-blue-50/60 text-slate-700 hover:bg-blue-100"
            }`}
          >
            <PanelLeft className="h-3.5 w-3.5" />
            {isSidebarOpen ? t(locale, "navbar.hideMenu") : t(locale, "navbar.showMenu")}
          </button>
          <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${theme === "dark" ? "bg-slate-700 text-slate-200" : "bg-blue-50 text-blue-900"}`}>
            {t(locale, "language.badge")}: {locale === "am" ? t(locale, "language.amharic") : t(locale, "language.english")}
          </span>
          <div className="inline-flex overflow-hidden rounded-md border border-blue-200 bg-blue-50/60 text-xs">
            <button
              onClick={() => onSwitchLanguage("en")}
              className={`px-2 py-1 font-medium ${locale === "en" ? "bg-blue-600 text-white" : "text-slate-700 hover:bg-blue-100"}`}
            >
              EN
            </button>
            <button
              onClick={() => onSwitchLanguage("am")}
              className={`px-2 py-1 font-medium ${locale === "am" ? "bg-blue-600 text-white" : "text-slate-700 hover:bg-blue-100"}`}
            >
              አማ
            </button>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-linear-to-r from-blue-100 to-sky-100 px-3 py-1 text-xs font-medium text-blue-900">
            <ShieldCheck className="h-3.5 w-3.5" />
            {translateLoose(locale, currentRole ?? "guest")}
          </span>
          <div className="text-right text-sm">
            <p className={`font-medium ${theme === "dark" ? "text-slate-100" : "text-slate-800"}`}>{currentUser?.name ?? t(locale, "common.guest")}</p>
          </div>
          {currentUser ? (
            <button
              onClick={onLogout}
              className={`inline-flex items-center gap-1 rounded-md border px-2.5 py-1.5 text-xs ${
                theme === "dark"
                  ? "border-slate-600 text-slate-200 hover:bg-slate-700"
                  : "border-blue-200 bg-blue-50/60 text-slate-700 hover:bg-blue-100"
              }`}
            >
              <LogOut className="h-3.5 w-3.5" /> {t(locale, "navbar.logout")}
            </button>
          ) : null}
        </div>
      </div>
    </header>
  );
}
