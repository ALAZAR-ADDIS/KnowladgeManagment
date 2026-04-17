"use client";
export const dynamic = "force-dynamic";

import { useRouter } from "next/navigation";
import { useState } from "react";
import AppShell from "@/components/AppShell";
import FormField from "@/components/FormField";
import PageHeader from "@/components/PageHeader";
import RoleGuard from "@/components/RoleGuard";
import { useAppDispatch } from "@/store/hooks";
import { addCase } from "@/store/slices/officerSlice";

export default function AddCasePage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [form, setForm] = useState({
    id: "",
    name: "",
    crimeType: "",
    date: "",
    location: "",
    status: "Open" as "Open" | "In Review" | "Closed",
    description: "",
  });

  return (
    <RoleGuard allowedRoles={["officer", "admin"]}>
      <AppShell role="officer">
        <PageHeader title="Add New Case" subtitle="Submit a new case record" />
        <div className="max-w-2xl rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="grid gap-3 md:grid-cols-2">
            <FormField label="Case ID" value={form.id} onChange={(v) => setForm((f) => ({ ...f, id: v }))} />
            <FormField label="Case Name" value={form.name} onChange={(v) => setForm((f) => ({ ...f, name: v }))} />
            <FormField label="Crime Type" value={form.crimeType} onChange={(v) => setForm((f) => ({ ...f, crimeType: v }))} />
            <FormField label="Date of Crime" type="date" value={form.date} onChange={(v) => setForm((f) => ({ ...f, date: v }))} />
            <FormField label="Location" value={form.location} onChange={(v) => setForm((f) => ({ ...f, location: v }))} />
            <label className="block text-sm">
              <span className="font-medium text-slate-700">Status</span>
              <select className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as "Open" | "In Review" | "Closed" }))}>
                <option value="Open">Open</option>
                <option value="In Review">In Review</option>
                <option value="Closed">Closed</option>
              </select>
            </label>
            <div className="md:col-span-2">
              <FormField label="Description" as="textarea" value={form.description} onChange={(v) => setForm((f) => ({ ...f, description: v }))} />
            </div>
          </div>
          <button
            onClick={() => {
              if (!form.id || !form.name) return;
              dispatch(addCase({ ...form, createdBy: "Officer Hana" }));
              router.push("/officer/cases");
            }}
            className="mt-4 rounded-md bg-blue-700 px-4 py-2 text-sm font-medium text-white"
          >
            Save Case
          </button>
        </div>
      </AppShell>
    </RoleGuard>
  );
}
