"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Briefcase, FileStack, FileText, ListTodo } from "lucide-react";
import AppShell from "@/components/AppShell";
import FormField from "@/components/FormField";
import Modal from "@/components/Modal";
import PageHeader from "@/components/PageHeader";
import RoleGuard from "@/components/RoleGuard";
import StatCard from "@/components/StatCard";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addRepositoryItem } from "@/store/slices/officerSlice";

export default function OfficerDashboardPage() {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.auth.currentUser);
  const { cases, aars, sops, repositoryItems } = useAppSelector((state) => state.officer);
  const [openQuickAdd, setOpenQuickAdd] = useState(false);
  const [formError, setFormError] = useState("");
  const [form, setForm] = useState({
    title: "",
    type: "Case" as "Case" | "AAR" | "SOP",
    sourceId: "",
    summary: "",
    description: "",
    createdBy: currentUser?.name ?? "Officer Hana",
  });

  const sourceOptions = useMemo(() => {
    if (form.type === "Case") {
      return cases.map((item) => ({ id: item.id, label: `${item.id} - ${item.name}` }));
    }
    if (form.type === "AAR") {
      return aars.map((item) => ({ id: item.id, label: `${item.id} - ${item.caseId}` }));
    }
    return sops.map((item) => ({ id: item.id, label: `${item.id} - ${item.title}` }));
  }, [aars, cases, form.type, sops]);

  return (
    <RoleGuard allowedRoles={["officer", "admin"]}>
      <AppShell role="officer">
        <PageHeader
          title="Officer Dashboard"
          subtitle="Operational insights and assignments without abbreviated labels"
          action={
            <div className="flex gap-2">
              <button
                onClick={() => setOpenQuickAdd(true)}
                className="rounded-md bg-blue-700 px-3 py-2 text-sm font-medium text-white hover:bg-blue-800"
              >
                Quick Add Knowledge
              </button>
              <Link href="/officer/repository/add" className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
                Full Knowledge Form
              </Link>
            </div>
          }
        />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Total Cases" value={cases.length} icon={Briefcase} />
          <StatCard label="Total After-Action Reviews" value={aars.length} icon={FileText} />
          <StatCard label="Total Standard Procedures" value={sops.length} icon={FileStack} />
          <StatCard label="Assigned Tasks" value={3} hint="2 urgent follow-ups" icon={ListTodo} />
        </div>
        <div className="mt-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="mb-3 text-lg font-semibold text-slate-900">Recent Updates</h2>
          <ul className="space-y-2 text-sm text-slate-700">
            {repositoryItems.slice(0, 5).map((item) => (
              <li key={item.id} className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2">
                {item.title} <span className="text-xs text-slate-500">({item.type} • {item.date})</span>
              </li>
            ))}
          </ul>
        </div>

        <Modal open={openQuickAdd} onClose={() => setOpenQuickAdd(false)} title="Quick Add Knowledge">
          <div className="space-y-3">
            <FormField label="Title" value={form.title} onChange={(v) => setForm((f) => ({ ...f, title: v }))} />
            <label className="block text-sm">
              <span className="font-medium text-slate-700">Type</span>
              <select
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                value={form.type}
                onChange={(e) => {
                  const nextType = e.target.value as "Case" | "AAR" | "SOP";
                  setForm((f) => ({ ...f, type: nextType, sourceId: "" }));
                }}
              >
                <option value="Case">Case</option>
                <option value="AAR">AAR</option>
                <option value="SOP">SOP</option>
              </select>
            </label>
            <label className="block text-sm">
              <span className="font-medium text-slate-700">Source Item</span>
              <select
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                value={form.sourceId}
                onChange={(e) => setForm((f) => ({ ...f, sourceId: e.target.value }))}
              >
                <option value="">Select source item</option>
                {sourceOptions.map((option) => (
                  <option key={option.id} value={option.id}>{option.label}</option>
                ))}
              </select>
            </label>
            <FormField label="Short Summary" as="textarea" value={form.summary} onChange={(v) => setForm((f) => ({ ...f, summary: v }))} />
            <FormField label="Long Description" as="textarea" value={form.description} onChange={(v) => setForm((f) => ({ ...f, description: v }))} />
            {formError ? <p className="text-xs font-medium text-rose-700">{formError}</p> : null}
            <button
              onClick={() => {
                if (!form.title.trim() || !form.summary.trim() || !form.description.trim() || !form.sourceId.trim()) {
                  setFormError("Please complete title, source item, short summary, and long description.");
                  return;
                }
                dispatch(addRepositoryItem({ ...form, createdBy: currentUser?.name ?? form.createdBy }));
                setOpenQuickAdd(false);
                setFormError("");
                setForm({
                  title: "",
                  type: "Case",
                  sourceId: "",
                  summary: "",
                  description: "",
                  createdBy: currentUser?.name ?? "Officer Hana",
                });
              }}
              className="w-full rounded-md bg-blue-700 py-2 text-sm font-medium text-white hover:bg-blue-800"
            >
              Save Knowledge
            </button>
          </div>
        </Modal>
      </AppShell>
    </RoleGuard>
  );
}
