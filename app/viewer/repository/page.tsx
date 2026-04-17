"use client";
export const dynamic = "force-dynamic";

import { useMemo, useState } from "react";
import AppShell from "@/components/AppShell";
import EmptyState from "@/components/EmptyState";
import FilterTabs from "@/components/FilterTabs";
import Modal from "@/components/Modal";
import PageHeader from "@/components/PageHeader";
import RoleGuard from "@/components/RoleGuard";
import SearchBar from "@/components/SearchBar";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setViewerFilters, toggleBookmark } from "@/store/slices/viewerSlice";

const tabs = ["all", "Case", "AAR", "SOP"];

export default function ViewerRepositoryPage() {
  const { repositoryItems } = useAppSelector((state) => state.officer);
  const { filters, bookmarks } = useAppSelector((state) => state.viewer);
  const dispatch = useAppDispatch();
  const [query, setQuery] = useState(filters.keyword);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = useMemo(
    () =>
      repositoryItems.filter((item) => {
        const matchQuery = `${item.title} ${item.summary}`.toLowerCase().includes(query.toLowerCase());
        const matchTab = filters.repositoryType === "all" || item.type === filters.repositoryType;
        return matchQuery && matchTab;
      }),
    [filters.repositoryType, query, repositoryItems],
  );
  const selected = filtered.find((item) => item.id === selectedId) ?? repositoryItems.find((item) => item.id === selectedId) ?? null;

  return (
    <RoleGuard allowedRoles={["viewer", "officer", "admin"]}>
      <AppShell role="viewer">
        <PageHeader title="Repository" subtitle="Read-only searchable knowledge list" />
        <div className="mb-4 space-y-3">
          <SearchBar
            value={query}
            onChange={(value) => {
              setQuery(value);
              dispatch(setViewerFilters({ keyword: value }));
            }}
            placeholder="Search public knowledge"
          />
          <FilterTabs
            tabs={tabs}
            active={filters.repositoryType}
            onChange={(tab) => dispatch(setViewerFilters({ repositoryType: tab as "all" | "Case" | "AAR" | "SOP" }))}
          />
        </div>
        {filtered.length === 0 ? (
          <EmptyState title="No Results" description="No repository items matched your filters." />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((item) => {
              const saved = bookmarks.includes(item.id);
              return (
                <article key={item.id} onClick={() => setSelectedId(item.id)} className="cursor-pointer rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <h3 className="font-semibold text-slate-900">{item.title}</h3>
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-700">{item.type}</span>
                  </div>
                  <p className="text-sm text-slate-600">{item.summary}</p>
                  <p className="mt-2 line-clamp-2 text-xs text-slate-500">{item.description}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <p className="text-xs text-slate-500">{item.date}</p>
                    <button onClick={() => dispatch(toggleBookmark(item.id))} className={`rounded px-2 py-1 text-xs ${saved ? "bg-blue-700 text-white" : "bg-slate-200 text-slate-700"}`}>
                      {saved ? "Bookmarked" : "Bookmark"}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
        <Modal open={Boolean(selected)} onClose={() => setSelectedId(null)} title={selected?.title ?? "Knowledge Detail"}>
          {selected ? (
            <div className="space-y-2 text-sm text-slate-700">
              <p><span className="font-semibold text-slate-900">Type:</span> {selected.type}</p>
              <p><span className="font-semibold text-slate-900">Source:</span> {selected.sourceId}</p>
              <p><span className="font-semibold text-slate-900">Date:</span> {selected.date}</p>
              <p><span className="font-semibold text-slate-900">Created By:</span> {selected.createdBy}</p>
              <p><span className="font-semibold text-slate-900">Summary:</span> {selected.summary}</p>
              <p><span className="font-semibold text-slate-900">Full Description:</span> {selected.description}</p>
            </div>
          ) : null}
        </Modal>
      </AppShell>
    </RoleGuard>
  );
}
