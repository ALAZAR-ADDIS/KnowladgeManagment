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

const categories = ["All", "Investigation", "Cybercrime", "Field Ops", "Knowledge", "Operations"];

export default function SopsPage() {
  const sops = useAppSelector((state) => state.officer.sops);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = useMemo(
    () =>
      sops.filter((s) => {
        const q = `${s.id} ${s.title} ${s.category}`.toLowerCase();
        return q.includes(query.toLowerCase()) && (category === "All" || s.category === category);
      }),
    [category, query, sops],
  );
  const selectedSop = filtered.find((s) => s.id === selectedId) ?? sops.find((s) => s.id === selectedId) ?? null;

  return (
    <RoleGuard allowedRoles={["officer", "admin"]}>
      <AppShell role="officer">
        <PageHeader title="SOP Library" subtitle="Standard operating procedures" action={<Link href="/officer/sops/add" className="rounded-md bg-blue-700 px-3 py-2 text-sm font-medium text-white">Add SOP</Link>} />
        <div className="mb-4 space-y-3">
          <SearchBar value={query} onChange={setQuery} placeholder="Search title, category, id" />
          <FilterTabs tabs={categories} active={category} onChange={setCategory} />
        </div>
        <DataTable
          columns={[
            { key: "id", label: "SOP ID" },
            { key: "title", label: "Title" },
            { key: "version", label: "Version" },
            { key: "category", label: "Category" },
            { key: "lastUpdated", label: "Last Updated" },
            { key: "status", label: "Status" },
            {
              key: "view",
              label: "View",
              render: (row: (typeof sops)[number]) => (
                <Link onClick={(e) => e.stopPropagation()} href={`/officer/sops/${row.id}`} className="rounded bg-slate-200 px-2 py-1 text-xs">Detail</Link>
              ),
            },
          ]}
          rows={filtered}
          rowKey={(r) => r.id}
          onRowClick={(row) => setSelectedId(row.id)}
        />
        <Modal open={Boolean(selectedSop)} onClose={() => setSelectedId(null)} title="SOP Detail">
          {selectedSop ? (
            <div className="space-y-2 text-sm text-slate-700">
              <p><span className="font-semibold text-slate-900">SOP ID:</span> {selectedSop.id}</p>
              <p><span className="font-semibold text-slate-900">Title:</span> {selectedSop.title}</p>
              <p><span className="font-semibold text-slate-900">Version:</span> {selectedSop.version}</p>
              <p><span className="font-semibold text-slate-900">Category:</span> {selectedSop.category}</p>
              <p><span className="font-semibold text-slate-900">Status:</span> {selectedSop.status}</p>
              <p><span className="font-semibold text-slate-900">Content:</span> {selectedSop.content}</p>
            </div>
          ) : null}
        </Modal>
      </AppShell>
    </RoleGuard>
  );
}
