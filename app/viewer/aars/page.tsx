"use client";

import { useState } from "react";
import AppShell from "@/components/AppShell";
import DataTable from "@/components/DataTable";
import Modal from "@/components/Modal";
import PageHeader from "@/components/PageHeader";
import RoleGuard from "@/components/RoleGuard";
import SearchBar from "@/components/SearchBar";
import { useAppSelector } from "@/store/hooks";

export default function ViewerAarsPage() {
  const aars = useAppSelector((state) => state.officer.aars);
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const rows = aars.filter((a) => `${a.id} ${a.caseId} ${a.createdBy}`.toLowerCase().includes(query.toLowerCase()));
  const selectedAar = rows.find((a) => a.id === selectedId) ?? aars.find((a) => a.id === selectedId) ?? null;

  return (
    <RoleGuard allowedRoles={["viewer", "officer", "admin"]}>
      <AppShell role="viewer">
        <PageHeader title="AARs" subtitle="Read-only after-action review list" />
        <div className="mb-4"><SearchBar value={query} onChange={setQuery} placeholder="Search AARs" /></div>
        <DataTable
          columns={[
            { key: "id", label: "AAR ID" },
            { key: "caseId", label: "Case ID" },
            { key: "createdBy", label: "Created By" },
            { key: "date", label: "Date" },
            { key: "status", label: "Status" },
          ]}
          rows={rows}
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
