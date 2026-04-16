"use client";

import { useParams } from "next/navigation";
import AppShell from "@/components/AppShell";
import EmptyState from "@/components/EmptyState";
import PageHeader from "@/components/PageHeader";
import RoleGuard from "@/components/RoleGuard";
import { useAppSelector } from "@/store/hooks";

export default function ViewerCaseDetailPage() {
  const params = useParams<{ id: string }>();
  const id = decodeURIComponent(params.id);
  const caseItem = useAppSelector((state) => state.officer.cases.find((c) => c.id === id));
  const linkedAars = useAppSelector((state) => state.officer.aars.filter((a) => a.caseId === id));
  const linkedSops = useAppSelector((state) => state.officer.sops.filter((s) => ["Investigation", "Field Ops"].includes(s.category)));

  if (!caseItem) {
    return <RoleGuard allowedRoles={["viewer", "officer", "admin"]}><AppShell role="viewer"><EmptyState title="Case Not Found" description="The selected case could not be found." /></AppShell></RoleGuard>;
  }

  return (
    <RoleGuard allowedRoles={["viewer", "officer", "admin"]}>
      <AppShell role="viewer">
        <PageHeader title={caseItem.name} subtitle={`${caseItem.id} • Viewer Perspective`} />
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            <div className="grid gap-2 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Crime Type</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{caseItem.crimeType}</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Status</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{caseItem.status}</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Location</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{caseItem.location}</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Date</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{caseItem.date}</p>
              </div>
            </div>

            <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-4 shadow-sm">
              <h3 className="mb-2 text-sm font-semibold text-blue-800">Situation Overview</h3>
              <p className="text-sm text-slate-700">{caseItem.description}</p>
            </div>

            <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-4 shadow-sm">
              <h3 className="mb-2 text-sm font-semibold text-emerald-800">Viewer Perspective</h3>
              <p className="text-sm text-slate-700">
                Focus on understanding case context, current status, and validated lessons learned from linked AARs and SOP guidance.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <h3 className="mb-2 text-sm font-semibold text-slate-900">Linked AARs (view-only)</h3>
              {linkedAars.length > 0 ? linkedAars.map((a) => (
                <p key={a.id} className="mb-1 rounded bg-slate-50 px-2 py-1 text-xs text-slate-700">{a.id}: {a.recommendation}</p>
              )) : <p className="text-xs text-slate-500">No linked AARs for this case yet.</p>}
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <h3 className="mb-2 text-sm font-semibold text-slate-900">Relevant SOP Context</h3>
              {linkedSops.slice(0, 3).map((s) => (
                <p key={s.id} className="mb-1 rounded bg-slate-50 px-2 py-1 text-xs text-slate-700">{s.id}: {s.title}</p>
              ))}
            </div>
          </div>
        </div>
      </AppShell>
    </RoleGuard>
  );
}
