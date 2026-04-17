"use client";

import Link from "next/link";
import { ArrowRight, BookOpenText, ClipboardCheck, Shield } from "lucide-react";
import AppShell from "@/components/AppShell";
import PageHeader from "@/components/PageHeader";
import RoleGuard from "@/components/RoleGuard";

const options = [
  { title: "Case Knowledge Entry", description: "Create a knowledge article based on case investigations, patterns, and practical field lessons for future operations.", type: "Case", icon: Shield },
  { title: "After-Action Review Knowledge", description: "Capture learning from completed operations, including what worked, what failed, and recommended process improvements.", type: "AAR", icon: ClipboardCheck },
  { title: "Standard Procedure Knowledge", description: "Write procedural knowledge that formalizes best practices and repeatable operating methods for police units.", type: "SOP", icon: BookOpenText },
] as const;

export default function OfficerKnowledgeOptionsPage() {
  return (
    <RoleGuard allowedRoles={["officer", "admin"]}>
      <AppShell role="officer">
        <PageHeader title="Knowledge Options" subtitle="Choose the knowledge type you want to create" />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {options.map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.type} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                <div className="mb-3 inline-flex rounded-lg bg-blue-100 p-2 text-blue-800"><Icon className="h-5 w-5" /></div>
                <h2 className="text-lg font-semibold text-slate-900">{item.title}</h2>
                <p className="mt-2 text-sm text-slate-600">{item.description}</p>
                <Link href={`/officer/repository/add?type=${item.type}`} className="mt-4 inline-flex items-center gap-1 rounded-md bg-blue-700 px-3 py-2 text-sm font-medium text-white hover:bg-blue-800">
                  Continue <ArrowRight className="h-4 w-4" />
                </Link>
              </article>
            );
          })}
        </div>
      </AppShell>
    </RoleGuard>
  );
}
