"use client";

import { useMemo, useState } from "react";
import AppShell from "@/components/AppShell";
import DataTable from "@/components/DataTable";
import FilterTabs from "@/components/FilterTabs";
import Modal from "@/components/Modal";
import PageHeader from "@/components/PageHeader";
import RoleGuard from "@/components/RoleGuard";
import SearchBar from "@/components/SearchBar";
import { useAppSelector } from "@/store/hooks";

const tabs = ["All", "CREATE", "UPDATE", "DELETE", "APPROVAL", "AUTH"];

export default function AdminAuditPage() {
  const logs = useAppSelector((state) => state.admin.auditLogs);
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = useMemo(
    () =>
      logs.filter((log) => {
        const matchesQuery = `${log.actor} ${log.action} ${log.module}`.toLowerCase().includes(query.toLowerCase());
        const matchesType = activeTab === "All" || log.type === activeTab;
        return matchesQuery && matchesType;
      }),
    [activeTab, logs, query],
  );
  const selectedLog = filtered.find((item) => item.id === selectedId) ?? logs.find((item) => item.id === selectedId) ?? null;

  return (
    <RoleGuard allowedRoles={["admin"]}>
      <AppShell role="admin">
        <PageHeader title="Audit Logs" subtitle="Track who did what and when" />
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <div className="min-w-64 flex-1"><SearchBar value={query} onChange={setQuery} placeholder="Search actor, action, module" /></div>
          <FilterTabs tabs={tabs} active={activeTab} onChange={setActiveTab} />
        </div>
        <DataTable
          columns={[
            { key: "actor", label: "Actor" },
            { key: "action", label: "Action" },
            { key: "module", label: "Module" },
            { key: "type", label: "Type" },
            { key: "date", label: "Date/Time" },
          ]}
          rows={filtered}
          rowKey={(r) => r.id}
          onRowClick={(row) => setSelectedId(row.id)}
        />
        <Modal open={Boolean(selectedLog)} onClose={() => setSelectedId(null)} title="Audit Log Detail">
          {selectedLog ? (
            <div className="space-y-2 text-sm text-slate-700">
              <p><span className="font-semibold text-slate-900">Actor:</span> {selectedLog.actor}</p>
              <p><span className="font-semibold text-slate-900">Action:</span> {selectedLog.action}</p>
              <p><span className="font-semibold text-slate-900">Module:</span> {selectedLog.module}</p>
              <p><span className="font-semibold text-slate-900">Type:</span> {selectedLog.type}</p>
              <p><span className="font-semibold text-slate-900">Date/Time:</span> {selectedLog.date}</p>
            </div>
          ) : null}
        </Modal>
      </AppShell>
    </RoleGuard>
  );
}
