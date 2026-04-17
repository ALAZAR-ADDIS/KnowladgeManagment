"use client";
export const dynamic = "force-dynamic";

import Link from "next/link";
import { useMemo, useState } from "react";
import AppShell from "@/components/AppShell";
import EmptyState from "@/components/EmptyState";
import FilterTabs from "@/components/FilterTabs";
import Modal from "@/components/Modal";
import PageHeader from "@/components/PageHeader";
import RoleGuard from "@/components/RoleGuard";
import SearchBar from "@/components/SearchBar";
import { useAppSelector } from "@/store/hooks";

const tabs = ["All", "Case", "AAR", "SOP"];

export default function OfficerRepositoryPage() {
  const items = useAppSelector((state) => state.officer.repositoryItems);
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState("All");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = useMemo(
    () => items.filter((item) => (`${item.title} ${item.summary}`.toLowerCase().includes(query.toLowerCase()) && (tab === "All" || item.type === tab))),
    [items, query, tab],
  );
  const selected = filtered.find((item) => item.id === selectedId) ?? items.find((item) => item.id === selectedId) ?? null;

  return (
    <RoleGuard allowedRoles={["officer", "admin", "viewer"]}>
      <AppShell role="officer">
        <PageHeader
          title="Knowledge Repository"
          subtitle="Unified knowledge from cases, AARs, and SOPs"
          action={<Link href="/officer/repository/add" className="rounded-md bg-blue-700 px-3 py-2 text-sm font-medium text-white">Create Knowledge Entry</Link>}
        />
        <div className="mb-4 space-y-3">
          <SearchBar value={query} onChange={setQuery} placeholder="Search repository" />
          <FilterTabs tabs={tabs} active={tab} onChange={setTab} />
        </div>
        {filtered.length === 0 ? <EmptyState title="No Knowledge Items" description="Try a broader keyword or a different filter tab." /> : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((item) => (
              <article key={item.id} onClick={() => setSelectedId(item.id)} className="cursor-pointer rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="font-semibold text-slate-900">{item.title}</h3>
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-700">{item.type}</span>
                </div>
                <p className="text-sm text-slate-600">{item.summary}</p>
                <p className="mt-2 line-clamp-2 text-xs text-slate-500">{item.description}</p>
                <p className="mt-2 text-xs text-slate-500">Source: {item.sourceId} • {item.date}</p>
              </article>
            ))}
          </div>
        )}
        <Modal open={Boolean(selected)} onClose={() => setSelectedId(null)} title={selected?.title ?? "Repository Detail"}>
          {selected ? (
            <div className="space-y-2 text-sm text-slate-700">
              <p><span className="font-semibold text-slate-900">Type:</span> {selected.type}</p>
              <p><span className="font-semibold text-slate-900">Source ID:</span> {selected.sourceId}</p>
              <p><span className="font-semibold text-slate-900">Date:</span> {selected.date}</p>
              <p><span className="font-semibold text-slate-900">Created By:</span> {selected.createdBy}</p>
              <p><span className="font-semibold text-slate-900">Summary:</span> {selected.summary}</p>
              <p><span className="font-semibold text-slate-900">Full Description:</span> {selected.description}</p>
              <div className="rounded-lg border border-slate-100 bg-slate-50 p-3 text-xs text-slate-600">
                Tip: this detail panel helps officers quickly review context before opening related case/AAR/SOP modules.
              </div>
            </div>
          ) : null}
        </Modal>
      </AppShell>
    </RoleGuard>
  );
}
