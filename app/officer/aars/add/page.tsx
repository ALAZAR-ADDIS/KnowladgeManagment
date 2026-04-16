"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import AppShell from "@/components/AppShell";
import FormField from "@/components/FormField";
import PageHeader from "@/components/PageHeader";
import RoleGuard from "@/components/RoleGuard";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addAar } from "@/store/slices/officerSlice";

export default function AddAarPage() {
  const cases = useAppSelector((state) => state.officer.cases);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [form, setForm] = useState({
    id: "",
    caseId: cases[0]?.id ?? "",
    whatWorked: "",
    whatFailed: "",
    recommendation: "",
    createdBy: "Officer Hana",
    date: "",
  });

  return (
    <RoleGuard allowedRoles={["officer", "admin"]}>
      <AppShell role="officer">
        <PageHeader title="Add AAR" subtitle="Submit an after-action review" />
        <div className="max-w-2xl rounded-xl border border-slate-200 bg-white p-4 shadow-sm space-y-3">
          <FormField label="AAR ID" value={form.id} onChange={(v) => setForm((f) => ({ ...f, id: v }))} />
          <label className="block text-sm">
            <span className="font-medium text-slate-700">Linked Case</span>
            <select className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" value={form.caseId} onChange={(e) => setForm((f) => ({ ...f, caseId: e.target.value }))}>
              {cases.map((c) => <option key={c.id} value={c.id}>{c.id}</option>)}
            </select>
          </label>
          <FormField label="What Worked" as="textarea" value={form.whatWorked} onChange={(v) => setForm((f) => ({ ...f, whatWorked: v }))} />
          <FormField label="What Failed" as="textarea" value={form.whatFailed} onChange={(v) => setForm((f) => ({ ...f, whatFailed: v }))} />
          <FormField label="Recommendation" as="textarea" value={form.recommendation} onChange={(v) => setForm((f) => ({ ...f, recommendation: v }))} />
          <FormField label="Created By" value={form.createdBy} onChange={(v) => setForm((f) => ({ ...f, createdBy: v }))} />
          <FormField label="Date" type="date" value={form.date} onChange={(v) => setForm((f) => ({ ...f, date: v }))} />
          <button
            onClick={() => {
              if (!form.id) return;
              dispatch(addAar({ ...form, status: "Pending" }));
              router.push("/officer/aars");
            }}
            className="rounded-md bg-blue-700 px-4 py-2 text-sm font-medium text-white"
          >
            Save AAR
          </button>
        </div>
      </AppShell>
    </RoleGuard>
  );
}
