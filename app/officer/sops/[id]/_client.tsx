"use client";

import { useParams } from "next/navigation";
import AppShell from "@/components/AppShell";
import EmptyState from "@/components/EmptyState";
import PageHeader from "@/components/PageHeader";
import RoleGuard from "@/components/RoleGuard";
import { useAppSelector } from "@/store/hooks";

export default function SopDetailPage() {
  const params = useParams<{ id: string }>();
  const id = decodeURIComponent(params.id);
  const sop = useAppSelector((state) => state.officer.sops.find((s) => s.id === id));
  const relatedCases = useAppSelector((state) => state.officer.cases.slice(0, 3));

  if (!sop) {
    return <RoleGuard allowedRoles={["officer", "admin", "viewer"]}><AppShell role="officer"><EmptyState title="SOP Not Found" description="No matching SOP exists." /></AppShell></RoleGuard>;
  }

  return (
    <RoleGuard allowedRoles={["officer", "admin", "viewer"]}>
      <AppShell role="officer">
        <PageHeader title={sop.title} subtitle={`${sop.id} • v${sop.version}`} />
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm lg:col-span-2">
            <p className="text-sm text-slate-600">Category: <span className="font-medium text-slate-900">{sop.category}</span></p>
            <p className="text-sm text-slate-600">Status: <span className="font-medium text-slate-900">{sop.status}</span></p>
            <p className="text-sm text-slate-600">Last Updated: <span className="font-medium text-slate-900">{sop.lastUpdated}</span></p>
            <p className="mt-3 text-sm text-slate-700">{sop.content}</p>
            <div className="mt-4 rounded-lg border border-slate-100 bg-slate-50 p-3 text-xs text-slate-600">
              Version history area: v{sop.version} (current), v{Math.max(0.1, Number(sop.version) - 0.1).toFixed(1)} (previous)
            </div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h3 className="mb-2 text-sm font-semibold text-slate-900">Related Cases</h3>
            {relatedCases.map((c) => (
              <p key={c.id} className="mb-1 rounded bg-slate-50 px-2 py-1 text-xs text-slate-700">{c.id} - {c.name}</p>
            ))}
          </div>
        </div>
      </AppShell>
    </RoleGuard>
  );
}
