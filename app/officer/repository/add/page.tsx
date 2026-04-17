"use client";
export const dynamic = "force-dynamic";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import AppShell from "@/components/AppShell";
import FormField from "@/components/FormField";
import PageHeader from "@/components/PageHeader";
import RoleGuard from "@/components/RoleGuard";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addRepositoryItem } from "@/store/slices/officerSlice";

export default function AddRepositoryItemPage() {
  const dispatch = useAppDispatch();
  const { cases, aars, sops } = useAppSelector((state) => state.officer);
  const currentUser = useAppSelector((state) => state.auth.currentUser);
  const router = useRouter();
  const [formError, setFormError] = useState("");
  const [form, setForm] = useState(() => {
    const defaultType =
      typeof window !== "undefined"
        ? (() => {
            const paramType = new URLSearchParams(window.location.search).get("type");
            if (paramType === "AAR" || paramType === "SOP" || paramType === "Case") {
              return paramType;
            }
            return "Case";
          })()
        : "Case";

    return {
      title: "",
      type: defaultType as "Case" | "AAR" | "SOP",
      sourceId: "",
      summary: "",
      description: "",
      createdBy: currentUser?.name ?? "Officer Hana",
    };
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
        <PageHeader title="Create Knowledge Base Entry" subtitle="Officer can publish reusable knowledge from operational experience" />
        <div className="max-w-3xl rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="grid gap-3 md:grid-cols-2">
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
            <FormField label="Created By" value={form.createdBy} onChange={(v) => setForm((f) => ({ ...f, createdBy: v }))} />
            <div className="md:col-span-2">
              <FormField label="Short Summary" as="textarea" value={form.summary} onChange={(v) => setForm((f) => ({ ...f, summary: v }))} />
            </div>
            <div className="md:col-span-2">
              <FormField label="Long Description" as="textarea" value={form.description} onChange={(v) => setForm((f) => ({ ...f, description: v }))} />
            </div>
            {formError ? <p className="md:col-span-2 text-xs font-medium text-rose-700">{formError}</p> : null}
          </div>
          <button
            onClick={() => {
              if (!form.title.trim() || !form.summary.trim() || !form.description.trim() || !form.sourceId.trim()) {
                setFormError("Please complete title, source item, short summary, and long description.");
                return;
              }
              dispatch(addRepositoryItem(form));
              setFormError("");
              router.push("/officer/repository");
            }}
            className="mt-4 rounded-md bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800"
          >
            Save Knowledge Entry
          </button>
        </div>
      </AppShell>
    </RoleGuard>
  );
}
