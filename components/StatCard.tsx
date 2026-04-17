import type { LucideIcon } from "lucide-react";

type StatCardProps = {
  label: string;
  value: string | number;
  hint?: string;
  icon: LucideIcon;
};

export default function StatCard({ label, value, hint, icon: Icon }: StatCardProps) {
  return (
    <div className="rounded-xl border border-sky-100 bg-linear-to-br from-white to-sky-50 p-4 shadow-sm shadow-sky-100/60">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm text-slate-600">{label}</p>
        <span className="rounded-md bg-sky-100 p-1.5 text-sky-700">
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
      {hint ? <p className="mt-1 text-xs text-slate-500">{hint}</p> : null}
    </div>
  );
}
