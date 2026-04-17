"use client";
export const dynamic = "force-dynamic";

import Link from "next/link";
import { useMemo, useState } from "react";
import AppShell from "@/components/AppShell";
import DataTable from "@/components/DataTable";
import FilterTabs from "@/components/FilterTabs";
import Modal from "@/components/Modal";
import PageHeader from "@/components/PageHeader";
import RoleGuard from "@/components/RoleGuard";
import SearchBar from "@/components/SearchBar";
import { useAppSelector } from "@/store/hooks";

const statuses = ["All", "Open", "In Review", "Closed"];

export default function ViewerCasesPage() {
  const cases = useAppSelector((state) => state.officer.cases);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = useMemo(
    () =>
      cases.filter((item) => {
        const q = `${item.id} ${item.name} ${item.location}`.toLowerCase();
        return q.includes(query.toLowerCase()) && (status === "All" || item.status === status);
      }),
    [cases, query, status],
  );
  const selectedCase = filtered.find((c) => c.id === selectedId) ?? cases.find((c) => c.id === selectedId) ?? null;

  return (
    <RoleGuard allowedRoles={["viewer", "officer", "admin"]}>
      <AppShell role="viewer">
        <PageHeader title="Cases" subtitle="Read-only case list" />
        <div className="mb-4 space-y-3">
          <SearchBar value={query} onChange={setQuery} placeholder="Search case ID, name, location" />
          <FilterTabs tabs={statuses} active={status} onChange={setStatus} />
        </div>
        <DataTable
          columns={[
            { key: "id", label: "Case ID" },
            { key: "name", label: "Case Name" },
            { key: "crimeType", label: "Crime Type" },
            { key: "status", label: "Status" },
            {
              key: "view",
              label: "View",
              render: (row: (typeof cases)[number]) => (
                <Link onClick={(e) => e.stopPropagation()} href={`/viewer/cases/${row.id}`} className="rounded bg-slate-200 px-2 py-1 text-xs">Open</Link>
              ),
            },
          ]}
          rows={filtered}
          rowKey={(r) => r.id}
          onRowClick={(row) => setSelectedId(row.id)}
        />
        <Modal open={Boolean(selectedCase)} onClose={() => setSelectedId(null)} title="Case Detail">
          {selectedCase ? (
            <div className="space-y-4 text-sm text-slate-700">
              <div>
                <p className="text-base font-semibold text-slate-900">{selectedCase.name}</p>
                <p className="text-xs text-slate-500">{selectedCase.id} • Viewer Perspective</p>
              </div>

              <div className="grid gap-2 sm:grid-cols-2">
                <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Crime Type</p>
                  <p className="text-sm font-medium text-slate-900">{selectedCase.crimeType}</p>
                </div>
                <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Status</p>
                  <p className="text-sm font-medium text-slate-900">{selectedCase.status}</p>
                </div>
                <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Location</p>
                  <p className="text-sm font-medium text-slate-900">{selectedCase.location}</p>
                </div>
                <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Date</p>
                  <p className="text-sm font-medium text-slate-900">{selectedCase.date}</p>
                </div>
              </div>

              <div className="rounded-lg border border-blue-100 bg-blue-50/50 p-3">
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-blue-700">Situation Overview</p>
                <p>{selectedCase.description}</p>
              </div>

              <div className="pt-1">
                <Link href={`/viewer/cases/${selectedCase.id}`} className="inline-flex rounded-md bg-blue-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-800">
                  Open Full Perspective
                </Link>
              </div>
            </div>
          ) : null}
        </Modal>
      </AppShell>
    </RoleGuard>
  );
}
