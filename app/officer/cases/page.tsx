"use client";

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

const crimeTypes = ["All", "Armed Robbery", "Smuggling", "Cybercrime", "Burglary", "Hijacking"];
const statuses = ["All", "Open", "In Review", "Closed"];

export default function OfficerCasesPage() {
  const cases = useAppSelector((state) => state.officer.cases);
  const [query, setQuery] = useState("");
  const [crime, setCrime] = useState("All");
  const [status, setStatus] = useState("All");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = useMemo(
    () =>
      cases.filter((item) => {
        const q = `${item.id} ${item.name} ${item.location}`.toLowerCase();
        return (
          q.includes(query.toLowerCase()) &&
          (crime === "All" || item.crimeType === crime) &&
          (status === "All" || item.status === status)
        );
      }),
    [cases, crime, query, status],
  );
  const selectedCase = filtered.find((item) => item.id === selectedId) ?? cases.find((item) => item.id === selectedId) ?? null;

  return (
    <RoleGuard allowedRoles={["officer", "admin"]}>
      <AppShell role="officer">
        <PageHeader
          title="Case Management"
          subtitle="Create, review, and track investigation cases"
          action={<Link href="/officer/cases/add" className="rounded-md bg-blue-700 px-3 py-2 text-sm font-medium text-white">Add Case</Link>}
        />
        <div className="mb-4 space-y-3">
          <SearchBar value={query} onChange={setQuery} placeholder="Search by case ID, name, location" />
          <div className="flex flex-wrap gap-3">
            <FilterTabs tabs={crimeTypes} active={crime} onChange={setCrime} />
            <FilterTabs tabs={statuses} active={status} onChange={setStatus} />
          </div>
        </div>
        <DataTable
          columns={[
            { key: "id", label: "Case ID" },
            { key: "name", label: "Case Name" },
            { key: "crimeType", label: "Crime Type" },
            { key: "date", label: "Date" },
            { key: "location", label: "Location" },
            { key: "status", label: "Status" },
            {
              key: "actions",
              label: "Actions",
              render: (row: (typeof cases)[number]) => (
                <div className="flex gap-2 text-xs">
                  <Link onClick={(e) => e.stopPropagation()} href={`/officer/cases/${row.id}`} className="rounded bg-slate-200 px-2 py-1">View</Link>
                  <Link onClick={(e) => e.stopPropagation()} href={`/officer/cases/edit/${row.id}`} className="rounded bg-blue-700 px-2 py-1 text-white">Edit</Link>
                </div>
              ),
            },
          ]}
          rows={filtered}
          rowKey={(r) => r.id}
          onRowClick={(row) => setSelectedId(row.id)}
        />
        <Modal open={Boolean(selectedCase)} onClose={() => setSelectedId(null)} title={selectedCase?.name ?? "Case Detail"}>
          {selectedCase ? (
            <div className="space-y-2 text-sm text-slate-700">
              <p><span className="font-semibold text-slate-900">Case ID:</span> {selectedCase.id}</p>
              <p><span className="font-semibold text-slate-900">Crime Type:</span> {selectedCase.crimeType}</p>
              <p><span className="font-semibold text-slate-900">Date:</span> {selectedCase.date}</p>
              <p><span className="font-semibold text-slate-900">Location:</span> {selectedCase.location}</p>
              <p><span className="font-semibold text-slate-900">Status:</span> {selectedCase.status}</p>
              <p><span className="font-semibold text-slate-900">Description:</span> {selectedCase.description}</p>
            </div>
          ) : null}
        </Modal>
      </AppShell>
    </RoleGuard>
  );
}
