"use client";

import AppShell from "@/components/AppShell";
import PageHeader from "@/components/PageHeader";
import RoleGuard from "@/components/RoleGuard";
import { useAppSelector } from "@/store/hooks";

const glossaryItems = [
  { term: "EFPC", meaning: "Ethiopian Federal Police Commission", usage: "Main institution owning this KMS." },
  { term: "KMS", meaning: "Knowledge Management System", usage: "The platform for storing and sharing police knowledge." },
  { term: "AAR", meaning: "After-Action Review", usage: "A structured reflection on what worked/failed after operations." },
  { term: "SOP", meaning: "Standard Operating Procedure", usage: "Official procedure guide used by officers." },
  { term: "ID", meaning: "Identifier", usage: "Unique value for records like case ID or SOP ID." },
  { term: "CRUD", meaning: "Create, Read, Update, Delete", usage: "Core actions available for data records." },
  { term: "Auth", meaning: "Authentication", usage: "Login and access control by role." },
  { term: "UI", meaning: "User Interface", usage: "Visible screens, buttons, forms, and layouts." },
  { term: "Dashboard", meaning: "Summary screen", usage: "Quick overview of stats and recent activities." },
  { term: "Repository", meaning: "Knowledge store", usage: "Combined library of cases, AARs, and SOPs." },
];

const roleByPath = (path: string): "admin" | "officer" | "viewer" => {
  if (path === "admin") return "admin";
  if (path === "officer") return "officer";
  return "viewer";
};

export default function GlossaryPage() {
  const role = useAppSelector((state) => state.auth.currentRole ?? "viewer");

  return (
    <RoleGuard allowedRoles={["admin", "officer", "viewer"]}>
      <AppShell role={roleByPath(role)}>
        <PageHeader
          title="Abbreviations and Terms"
          subtitle="Clear meanings for sidebar labels and frequently used system terms"
        />
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="grid grid-cols-12 border-b border-slate-200 bg-slate-100 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-600">
            <p className="col-span-2">Term</p>
            <p className="col-span-4">Meaning</p>
            <p className="col-span-6">How it is used</p>
          </div>
          {glossaryItems.map((item) => (
            <div key={item.term} className="grid grid-cols-12 border-b border-slate-100 px-4 py-3 text-sm">
              <p className="col-span-2 font-semibold text-blue-800">{item.term}</p>
              <p className="col-span-4 text-slate-800">{item.meaning}</p>
              <p className="col-span-6 text-slate-600">{item.usage}</p>
            </div>
          ))}
        </div>
      </AppShell>
    </RoleGuard>
  );
}
