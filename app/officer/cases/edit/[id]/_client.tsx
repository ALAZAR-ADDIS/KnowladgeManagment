"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import EmptyState from "@/components/EmptyState";
import FormField from "@/components/FormField";
import PageHeader from "@/components/PageHeader";
import RoleGuard from "@/components/RoleGuard";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { editCase } from "@/store/slices/officerSlice";

export default function EditCasePage() {
  const params = useParams<{ id: string }>();
  const id = decodeURIComponent(params.id);
  const caseItem = useAppSelector((state) => state.officer.cases.find((c) => c.id === id));
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [form, setForm] = useState(caseItem);

  useEffect(() => { setForm(caseItem); }, [caseItem]);

  if (!form) {
    return (
      <RoleGuard allowedRoles={["officer", "admin"]}>
        <AppShell role="officer"><EmptyState title="Case Not Found" description="No editable case was found for this ID." /></AppShell>
      </RoleGuard>
    );
  }

  return (
    <RoleGuard allowedRoles={["officer", "admin"]}>
      <AppShell role="officer">
        <PageHeader title="Edit Case" subtitle={`Update ${form.id}`} />
        <div className="max-w-2xl rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="grid gap-3 md:grid-cols-2">
            <FormField label="Case ID" value={form.id} onChange={(v) => setForm((f) => (f ? { ...f, id: v } : f))} />
            <FormField label="Case Name" value={form.name} onChange={(v) => setForm((f) => (f ? { ...f, name: v } : f))} />
            <FormField label="Crime Type" value={form.crimeType} onChange={(v) => setForm((f) => (f ? { ...f, crimeType: v } : f))} />
            <FormField label="Date of Crime" type="date" value={form.date} onChange={(v) => setForm((f) => (f ? { ...f, date: v } : f))} />
            <FormField label="Location" value={form.location} onChange={(v) => setForm((f) => (f ? { ...f, location: v } : f))} />
            <label className="block text-sm">
              <span className="font-medium text-slate-700">Status</span>
              <select className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" value={form.status} onChange={(e) => setForm((f) => (f ? { ...f, status: e.target.value as "Open" | "In Review" | "Closed" } : f))}>
                <option value="Open">Open</option>
                <option value="In Review">In Review</option>
                <option value="Closed">Closed</option>
              </select>
            </label>
            <div className="md:col-span-2">
              <FormField label="Description" as="textarea" value={form.description} onChange={(v) => setForm((f) => (f ? { ...f, description: v } : f))} />
            </div>
          </div>
          <button
            onClick={() => { dispatch(editCase(form)); router.push(`/officer/cases/${encodeURIComponent(form.id)}`); }}
            className="mt-4 rounded-md bg-blue-700 px-4 py-2 text-sm font-medium text-white"
          >Update Case</button>
        </div>
      </AppShell>
    </RoleGuard>
  );
}
