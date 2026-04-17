"use client";
export const dynamic = "force-dynamic";

import { useMemo, useState } from "react";
import AppShell from "@/components/AppShell";
import DataTable from "@/components/DataTable";
import PageHeader from "@/components/PageHeader";
import RoleGuard from "@/components/RoleGuard";
import SearchBar from "@/components/SearchBar";
import { useAppSelector } from "@/store/hooks";

export default function ViewerSopsPage() {
  const sops = useAppSelector((state) => state.officer.sops);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string | null>(null);

  const filtered = useMemo(() => sops.filter((s) => `${s.id} ${s.title} ${s.category}`.toLowerCase().includes(query.toLowerCase())), [query, sops]);
  const selectedSop = filtered.find((s) => s.id === selected) ?? filtered[0];

  return (
    <RoleGuard allowedRoles={["viewer", "officer", "admin"]}>
      <AppShell role="viewer">
        <PageHeader title="SOPs" subtitle="Read-only SOP list and detail" />
        <div className="mb-4"><SearchBar value={query} onChange={setQuery} placeholder="Search SOP title/category" /></div>
        <div className="grid gap-4 lg:grid-cols-2">
          <DataTable
            columns={[
              { key: "id", label: "SOP ID" },
              { key: "title", label: "Title" },
              { key: "version", label: "Version" },
              { key: "category", label: "Category" },
              { key: "open", label: "Open", render: (row: (typeof sops)[number]) => <button onClick={() => setSelected(row.id)} className="rounded bg-slate-200 px-2 py-1 text-xs">View</button> },
            ]}
            rows={filtered}
            rowKey={(r) => r.id}
            onRowClick={(row) => setSelected(row.id)}
          />
          {selectedSop ? (
            <article className="space-y-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div>
                <p className="text-base font-semibold text-slate-900">{selectedSop.title}</p>
                <p className="text-xs text-slate-500">{selectedSop.id} • Viewer Perspective</p>
              </div>

              <div className="grid gap-2 sm:grid-cols-2">
                <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">SOP ID</p>
                  <p className="text-sm font-medium text-slate-900">{selectedSop.id}</p>
                </div>
                <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Version</p>
                  <p className="text-sm font-medium text-slate-900">v{selectedSop.version}</p>
                </div>
                <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 sm:col-span-2">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Category</p>
                  <p className="text-sm font-medium text-slate-900">{selectedSop.category}</p>
                </div>
              </div>

              <div className="rounded-lg border border-blue-100 bg-blue-50/50 p-3">
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-blue-700">Standard Operating Guidance</p>
                <p className="text-sm text-slate-700">{selectedSop.content}</p>
              </div>

              <div className="rounded-lg border border-emerald-100 bg-emerald-50/50 p-3">
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-emerald-700">Viewer Perspective</p>
                <p className="text-sm text-slate-700">
                  Use this SOP as a reference baseline when reviewing case actions and AAR recommendations.
                </p>
              </div>
            </article>
          ) : null}
        </div>
      </AppShell>
    </RoleGuard>
  );
}
