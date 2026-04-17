"use client";
export const dynamic = "force-dynamic";

import Link from "next/link";
import { useMemo, useState } from "react";
import AppShell from "@/components/AppShell";
import DataTable from "@/components/DataTable";
import Modal from "@/components/Modal";
import PageHeader from "@/components/PageHeader";
import RoleGuard from "@/components/RoleGuard";
import SearchBar from "@/components/SearchBar";
import { useAppSelector } from "@/store/hooks";

export default function OfficerAarsPage() {
  const aars = useAppSelector((state) => state.officer.aars);
  const [query, setQuery] = useState("");
  const [caseFilter, setCaseFilter] = useState("All");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const caseOptions = useMemo(() => ["All", ...Array.from(new Set(aars.map((a) => a.caseId)))], [aars]);
  const filtered = useMemo(
    () =>
      aars.filter((a) => {
        const q = `${a.id} ${a.caseId} ${a.createdBy}`.toLowerCase();
        return q.includes(query.toLowerCase()) && (caseFilter === "All" || a.caseId === caseFilter);
      }),
    [aars, caseFilter, query],
  );
  const selectedAar = filtered.find((a) => a.id === selectedId) ?? aars.find((a) => a.id === selectedId) ?? null;

  return (
    <RoleGuard allowedRoles={["officer", "admin"]}>
      <AppShell role="officer">
        <PageHeader title="After-Action Reviews" subtitle="Capture what worked, what failed, and recommendations" action={<Link href="/officer/aars/add" className="rounded-md bg-blue-700 px-3 py-2 text-sm font-medium text-white">Add AAR</Link>} />
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <div className="min-w-64 flex-1"><SearchBar value={query} onChange={setQuery} placeholder="Search AAR ID, case, author" /></div>
          <select
            value={caseFilter}
            onChange={(e) => setCaseFilter(e.target.value)}
            title="Filter by case"
            aria-label="Filter by case"
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          >
            {caseOptions.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <DataTable
          columns={[
            { key: "id", label: "AAR ID" },
            { key: "caseId", label: "Case ID" },
            { key: "createdBy", label: "Created By" },
            { key: "date", label: "Date" },
            { key: "status", label: "Status" },
            {
              key: "actions",
              label: "Actions",
              render: (row: (typeof aars)[number]) => (
                <Link onClick={(e) => e.stopPropagation()} href={`/officer/aars/${row.id}`} className="rounded bg-slate-200 px-2 py-1 text-xs">View</Link>
              ),
            },
          ]}
          rows={filtered}
          rowKey={(r) => r.id}
          onRowClick={(row) => setSelectedId(row.id)}
        />
        <Modal open={Boolean(selectedAar)} onClose={() => setSelectedId(null)} title="AAR Detail">
          {selectedAar ? (
            <div className="space-y-2 text-sm text-slate-700">
              <p><span className="font-semibold text-slate-900">AAR ID:</span> {selectedAar.id}</p>
              <p><span className="font-semibold text-slate-900">Case ID:</span> {selectedAar.caseId}</p>
              <p><span className="font-semibold text-slate-900">Created By:</span> {selectedAar.createdBy}</p>
              <p><span className="font-semibold text-slate-900">Date:</span> {selectedAar.date}</p>
              <p><span className="font-semibold text-slate-900">What Worked:</span> {selectedAar.whatWorked}</p>
              <p><span className="font-semibold text-slate-900">What Failed:</span> {selectedAar.whatFailed}</p>
              <p><span className="font-semibold text-slate-900">Recommendation:</span> {selectedAar.recommendation}</p>
            </div>
          ) : null}
        </Modal>
      </AppShell>
    </RoleGuard>
  );
}
