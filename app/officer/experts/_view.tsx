"use client";

import { useState } from "react";
import AppShell from "@/components/AppShell";
import EmptyState from "@/components/EmptyState";
import Modal from "@/components/Modal";
import PageHeader from "@/components/PageHeader";
import RoleGuard from "@/components/RoleGuard";
import { useAppSelector } from "@/store/hooks";

export default function ExpertsInner() {
  const experts = useAppSelector((state) => state.officer.experts);
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = experts.filter((e) =>
    `${e.name} ${e.rank} ${e.region} ${e.skills.join(" ")}`.toLowerCase().includes(query.toLowerCase()),
  );
  const selectedExpert = filtered.find((e) => e.id === selectedId) ?? experts.find((e) => e.id === selectedId) ?? null;

  return (
    <RoleGuard allowedRoles={["officer", "admin", "viewer"]}>
      <AppShell role="officer">
        <PageHeader title="Expert Directory" subtitle="Find officers by skill, rank, and region" />
        <div className="mb-4">
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by skill, rank, region"
            className="w-full rounded-lg border border-sky-200 bg-white py-2 px-3 text-sm text-slate-900 outline-none ring-sky-200 transition focus:border-sky-400 focus:ring-2" />
        </div>
        {filtered.length === 0 ? <EmptyState title="No Experts Found" description="Try another skill or region keyword." /> : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((expert) => (
              <article key={expert.id} onClick={() => setSelectedId(expert.id)} className="cursor-pointer rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                <h3 className="text-base font-semibold text-slate-900">{expert.name}</h3>
                <p className="text-xs text-slate-500">{expert.rank} • {expert.role}</p>
                <p className="mt-2 text-xs text-slate-600">Experience: {expert.experience}</p>
                <p className="text-xs text-slate-600">Region: {expert.region}</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {expert.skills.map((skill) => <span key={skill} className="rounded-full bg-blue-100 px-2 py-0.5 text-[11px] text-blue-800">{skill}</span>)}
                </div>
                <p className="mt-2 text-xs text-slate-500">Contact: {expert.contact}</p>
              </article>
            ))}
          </div>
        )}
        <Modal open={Boolean(selectedExpert)} onClose={() => setSelectedId(null)} title={selectedExpert?.name ?? "Expert Detail"}>
          {selectedExpert ? (
            <div className="space-y-2 text-sm text-slate-700">
              <p><span className="font-semibold text-slate-900">Role:</span> {selectedExpert.role}</p>
              <p><span className="font-semibold text-slate-900">Rank:</span> {selectedExpert.rank}</p>
              <p><span className="font-semibold text-slate-900">Experience:</span> {selectedExpert.experience}</p>
              <p><span className="font-semibold text-slate-900">Region:</span> {selectedExpert.region}</p>
              <p><span className="font-semibold text-slate-900">Skills:</span> {selectedExpert.skills.join(", ")}</p>
              <p><span className="font-semibold text-slate-900">Contact:</span> {selectedExpert.contact}</p>
            </div>
          ) : null}
        </Modal>
      </AppShell>
    </RoleGuard>
  );
}
