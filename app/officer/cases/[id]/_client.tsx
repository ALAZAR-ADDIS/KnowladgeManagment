"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import AppShell from "@/components/AppShell";
import EmptyState from "@/components/EmptyState";
import PageHeader from "@/components/PageHeader";
import RoleGuard from "@/components/RoleGuard";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { deleteCase } from "@/store/slices/officerSlice";

export default function OfficerCaseDetailPage() {
  const params = useParams<{ id: string }>();
  const id = decodeURIComponent(params.id);
  const caseItem = useAppSelector((state) => state.officer.cases.find((c) => c.id === id));
  const linkedAars = useAppSelector((state) => state.officer.aars.filter((a) => a.caseId === id));
  const linkedSops = useAppSelector((state) => state.officer.sops.filter((s) => ["Investigation", "Field Ops"].includes(s.category)));
  const currentRole = useAppSelector((state) => state.auth.currentRole);
  const dispatch = useAppDispatch();
  const router = useRouter();

  if (!caseItem) {
    return (
      <RoleGuard allowedRoles={["officer", "admin", "viewer"]}>
        <AppShell role="officer"><EmptyState title="Case Not Found" description="The selected case does not exist in dummy state." /></AppShell>
      </RoleGuard>
    );
  }

  return (
    <RoleGuard allowedRoles={["officer", "admin", "viewer"]}>
      <AppShell role="officer">
        <PageHeader title={caseItem.name} subtitle={`${caseItem.id} • ${caseItem.location}`} />
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm lg:col-span-2">
            <p className="text-sm text-slate-600">Crime Type: <span className="font-medium text-slate-900">{caseItem.crimeType}</span></p>
            <p className="text-sm text-slate-600">Status: <span className="font-medium text-slate-900">{caseItem.status}</span></p>
            <p className="text-sm text-slate-600">Date: <span className="font-medium text-slate-900">{caseItem.date}</span></p>
            <p className="mt-3 text-sm text-slate-700">{caseItem.description}</p>
            {(currentRole === "officer" || currentRole === "admin") ? (
              <div className="mt-4 flex gap-2">
                <Link href={`/officer/cases/edit/${caseItem.id}`} className="rounded bg-blue-700 px-3 py-1.5 text-xs text-white">Edit</Link>
                <button
                  onClick={() => { dispatch(deleteCase(caseItem.id)); router.push("/officer/cases"); }}
                  className="rounded bg-rose-600 px-3 py-1.5 text-xs text-white"
                >Delete</button>
              </div>
            ) : null}
          </div>
          <div className="space-y-4">
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <h3 className="mb-2 text-sm font-semibold text-slate-900">Linked AARs</h3>
              {linkedAars.map((item) => (
                <p key={item.id} className="mb-1 text-xs text-slate-600">{item.id}: {item.recommendation}</p>
              ))}
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <h3 className="mb-2 text-sm font-semibold text-slate-900">Linked SOPs</h3>
              {linkedSops.slice(0, 3).map((s) => (
                <p key={s.id} className="mb-1 text-xs text-slate-600">{s.title}</p>
              ))}
            </div>
          </div>
        </div>
      </AppShell>
    </RoleGuard>
  );
}
