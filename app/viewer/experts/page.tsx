"use client";
export const dynamic = "force-dynamic";

import { useMemo, useState } from "react";
import AppShell from "@/components/AppShell";
import EmptyState from "@/components/EmptyState";
import Modal from "@/components/Modal";
import PageHeader from "@/components/PageHeader";
import RoleGuard from "@/components/RoleGuard";
import SearchBar from "@/components/SearchBar";
import { useAppSelector } from "@/store/hooks";

export default function ViewerExpertsPage() {
  const experts = useAppSelector((state) => state.officer.experts);
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = useMemo(() => experts.filter((e) => `${e.name} ${e.rank} ${e.skills.join(" ")} ${e.region}`.toLowerCase().includes(query.toLowerCase())), [experts, query]);
  const selectedExpert = filtered.find((e) => e.id === selectedId) ?? experts.find((e) => e.id === selectedId) ?? null;

  return (
    <RoleGuard allowedRoles={["viewer", "officer", "admin"]}>
      <AppShell role="viewer">
        <PageHeader title="Experts" subtitle="Read-only expert profiles" />
        <div className="mb-4"><SearchBar value={query} onChange={setQuery} placeholder="Search by skill, rank, region" /></div>
        {filtered.length === 0 ? <EmptyState title="No Experts Found" description="Try broader keywords." /> : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((expert) => (
              <article key={expert.id} onClick={() => setSelectedId(expert.id)} className="cursor-pointer rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                <h3 className="font-semibold text-slate-900">{expert.name}</h3>
                <p className="text-xs text-slate-500">{expert.rank} • {expert.role}</p>
                <p className="mt-1 text-xs text-slate-600">Region: {expert.region}</p>
                <p className="text-xs text-slate-600">Experience: {expert.experience}</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {expert.skills.map((skill) => <span key={skill} className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-700">{skill}</span>)}
                </div>
              </article>
            ))}
          </div>
        )}
        <Modal open={Boolean(selectedExpert)} onClose={() => setSelectedId(null)} title={selectedExpert?.name ?? "Expert Profile"}>
          {selectedExpert ? (
            <div className="space-y-2 text-sm text-slate-700">
              <p><span className="font-semibold text-slate-900">Role:</span> {selectedExpert.role}</p>
              <p><span className="font-semibold text-slate-900">Rank:</span> {selectedExpert.rank}</p>
              <p><span className="font-semibold text-slate-900">Region:</span> {selectedExpert.region}</p>
              <p><span className="font-semibold text-slate-900">Experience:</span> {selectedExpert.experience}</p>
              <p><span className="font-semibold text-slate-900">Skills:</span> {selectedExpert.skills.join(", ")}</p>
              <p><span className="font-semibold text-slate-900">Contact:</span> {selectedExpert.contact}</p>
            </div>
          ) : null}
        </Modal>
      </AppShell>
    </RoleGuard>
  );
}
