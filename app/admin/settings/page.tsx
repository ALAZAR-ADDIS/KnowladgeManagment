"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import FormField from "@/components/FormField";
import PageHeader from "@/components/PageHeader";
import RoleGuard from "@/components/RoleGuard";
import { updateSettings } from "@/store/slices/adminSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

const languageOptions = ["English (ET)", "Amharic", "Afan Oromo"];

export default function AdminSettingsPage() {
  const settings = useAppSelector((state) => state.admin.settings);
  const dispatch = useAppDispatch();
  const [form, setForm] = useState(settings);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setForm(settings);
  }, [settings]);

  return (
    <RoleGuard allowedRoles={["admin"]}>
      <AppShell role="admin">
        <PageHeader title="Settings" subtitle="Manage application identity and preferences" />
        <div className="max-w-2xl rounded-xl border border-slate-200 bg-white/95 p-5 shadow-sm backdrop-blur">
          <div className="space-y-3">
            <FormField label="App Name" value={form.appName} onChange={(value) => setForm((f) => ({ ...f, appName: value }))} />
            <label className="block text-sm">
              <span className="font-medium text-slate-700">Theme</span>
              <select
                value={form.theme}
                onChange={(e) => setForm((f) => ({ ...f, theme: e.target.value as "light" | "dark" }))}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
              >
                <option value="light">Light Theme</option>
                <option value="dark">Dark Theme</option>
              </select>
            </label>
            <label className="block text-sm">
              <span className="font-medium text-slate-700">Language Label</span>
              <select
                value={form.language}
                onChange={(e) => setForm((f) => ({ ...f, language: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
              >
                {languageOptions.map((lang) => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={form.notifications}
                onChange={(e) => setForm((f) => ({ ...f, notifications: e.target.checked }))}
              />
              Enable notifications
            </label>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => {
                  dispatch(updateSettings(form));
                  setSaved(true);
                  setTimeout(() => setSaved(false), 1800);
                }}
                className="rounded-md bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800"
              >
                Save Settings
              </button>
              <button
                onClick={() => setForm(settings)}
                className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                Reset Changes
              </button>
              {saved ? <p className="text-sm font-medium text-emerald-700">Settings saved successfully.</p> : null}
            </div>
          </div>
        </div>
      </AppShell>
    </RoleGuard>
  );
}
