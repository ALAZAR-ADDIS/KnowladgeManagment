"use client";

import { Activity, ClipboardList, FileClock, Users } from "lucide-react";
import AppShell from "@/components/AppShell";
import PageHeader from "@/components/PageHeader";
import RoleGuard from "@/components/RoleGuard";
import StatCard from "@/components/StatCard";
import { useAppSelector } from "@/store/hooks";

export default function AdminDashboardPage() {
  const { users, approvalQueue, auditLogs } = useAppSelector((state) => state.admin);
  const contentItems = useAppSelector((state) => state.officer.cases.length + state.officer.aars.length + state.officer.sops.length);

  return (
    <RoleGuard allowedRoles={["admin"]}>
      <AppShell role="admin">
        <PageHeader title="Admin Dashboard" subtitle="System-wide oversight and governance" />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Total Users" value={users.length} hint="Across all departments" icon={Users} />
          <StatCard label="Pending Approvals" value={approvalQueue.filter((q) => q.status === "Pending").length} icon={FileClock} />
          <StatCard label="Audit Logs" value={auditLogs.length} hint="Recent tracked events" icon={ClipboardList} />
          <StatCard label="Content Items" value={contentItems} hint="Cases + AARs + SOPs" icon={Activity} />
        </div>
        <div className="mt-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="mb-3 text-lg font-semibold text-slate-900">Recent Admin Activity</h2>
          <div className="space-y-2">
            {auditLogs.slice(0, 6).map((log) => (
              <div key={log.id} className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-sm">
                <p className="text-slate-800">{log.action}</p>
                <p className="text-xs text-slate-500">{log.actor} • {log.date} • {log.module}</p>
              </div>
            ))}
          </div>
        </div>
      </AppShell>
    </RoleGuard>
  );
}
