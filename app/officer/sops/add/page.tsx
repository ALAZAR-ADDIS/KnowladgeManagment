"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import AppShell from "@/components/AppShell";
import FormField from "@/components/FormField";
import PageHeader from "@/components/PageHeader";
import RoleGuard from "@/components/RoleGuard";
import { useAppDispatch } from "@/store/hooks";
import { addSop } from "@/store/slices/officerSlice";

export default function AddSopPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [form, setForm] = useState({ id: "", title: "", category: "Investigation", version: "1.0", content: "", lastUpdated: "", status: "Draft" as "Draft" | "Pending" | "Approved" });

  return (
    <RoleGuard allowedRoles={["officer", "admin"]}>
      <AppShell role="officer">
        <PageHeader title="Add SOP" subtitle="Create a new SOP draft" />
        <div className="max-w-2xl rounded-xl border border-slate-200 bg-white p-4 shadow-sm space-y-3">
          <FormField label="SOP ID" value={form.id} onChange={(v) => setForm((f) => ({ ...f, id: v }))} />
          <FormField label="Title" value={form.title} onChange={(v) => setForm((f) => ({ ...f, title: v }))} />
          <FormField label="Category" value={form.category} onChange={(v) => setForm((f) => ({ ...f, category: v }))} />
          <FormField label="Version" value={form.version} onChange={(v) => setForm((f) => ({ ...f, version: v }))} />
          <FormField label="Content" as="textarea" value={form.content} onChange={(v) => setForm((f) => ({ ...f, content: v }))} />
          <FormField label="Date" type="date" value={form.lastUpdated} onChange={(v) => setForm((f) => ({ ...f, lastUpdated: v }))} />
          <label className="block text-sm">
            <span className="font-medium text-slate-700">Status</span>
            <select className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as "Draft" | "Pending" | "Approved" }))}>
              <option value="Draft">Draft</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
            </select>
          </label>
          <button onClick={() => { if (!form.id || !form.title) return; dispatch(addSop(form)); router.push("/officer/sops"); }} className="rounded-md bg-blue-700 px-4 py-2 text-sm font-medium text-white">Save SOP</button>
        </div>
      </AppShell>
    </RoleGuard>
  );
}
