"use client";

import { useParams } from "next/navigation";
import AppShell from "@/components/AppShell";
import EmptyState from "@/components/EmptyState";
import PageHeader from "@/components/PageHeader";
import RoleGuard from "@/components/RoleGuard";
import { useAppSelector } from "@/store/hooks";

export default function AarDetailPage() {
  const params = useParams<{ id: string }>();
  const id = decodeURIComponent(params.id);
  const aar = useAppSelector((state) => state.officer.aars.find((a) => a.id === id));
  const relatedSops = useAppSelector((state) => state.officer.sops.filter((s) => s.status !== "Draft").slice(0, 3));

  if (!aar) {
    return <RoleGuard allowedRoles={["officer", "admin", "viewer"]}><AppShell role="officer"><EmptyState title="AAR Not Found" description="No matching after-action review exists." /></AppShell></RoleGuard>;
  }

  return (
    <RoleGuard allowedRoles={["officer", "admin", "viewer"]}>
      <AppShell role="officer">
        <PageHeader title={`AAR ${aar.id}`} subtitle={`Linked Case: ${aar.caseId}`} />
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white p-4 shadow-sm space-y-4">
            <section><h3 className="font-semibold text-slate-900">What Worked</h3><p className="text-sm text-slate-700">{aar.whatWorked}</p></section>
            <section><h3 className="font-semibold text-slate-900">What Failed</h3><p className="text-sm text-slate-700">{aar.whatFailed}</p></section>
            <section><h3 className="font-semibold text-slate-900">Recommendation</h3><p className="text-sm text-slate-700">{aar.recommendation}</p></section>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h3 className="mb-2 text-sm font-semibold text-slate-900">Related SOP Suggestions</h3>
            {relatedSops.map((s) => (
              <p key={s.id} className="mb-1 rounded bg-slate-50 px-2 py-1 text-xs text-slate-700">{s.title}</p>
            ))}
          </div>
        </div>
      </AppShell>
    </RoleGuard>
  );
}
