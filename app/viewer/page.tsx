"use client";

import { BookOpen, Clock3, Eye } from "lucide-react";
import AppShell from "@/components/AppShell";
import PageHeader from "@/components/PageHeader";
import RoleGuard from "@/components/RoleGuard";
import StatCard from "@/components/StatCard";
import { useAppSelector } from "@/store/hooks";

export default function ViewerDashboardPage() {
  const { repositoryItems } = useAppSelector((state) => state.officer);
  const { bookmarks, recentViews } = useAppSelector((state) => state.viewer);

  return (
    <RoleGuard allowedRoles={["viewer", "officer", "admin"]}>
      <AppShell role="viewer">
        <PageHeader title="Viewer Dashboard" subtitle="Read-only intelligence and updates" />
        <div className="grid gap-4 md:grid-cols-3">
          <StatCard label="Public Knowledge Items" value={repositoryItems.length} icon={BookOpen} />
          <StatCard label="Bookmarks" value={bookmarks.length} icon={Eye} />
          <StatCard label="Recent Views" value={recentViews.length} icon={Clock3} />
        </div>
        <div className="mt-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="mb-3 text-lg font-semibold text-slate-900">Latest Public Knowledge</h2>
          <div className="space-y-2">
            {repositoryItems.slice(0, 6).map((item) => (
              <div key={item.id} className="rounded-md border border-slate-100 bg-slate-50 p-3 text-sm text-slate-700">
                <p className="font-medium text-slate-900">{item.title}</p>
                <p className="text-xs text-slate-500">{item.type} • {item.date}</p>
              </div>
            ))}
          </div>
        </div>
      </AppShell>
    </RoleGuard>
  );
}
