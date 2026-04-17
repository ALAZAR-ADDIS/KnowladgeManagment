"use client";

import type { ReactNode } from "react";
import { useAppSelector } from "@/store/hooks";
import { resolveLocale, translateLoose } from "@/lib/i18n";

type DataTableProps<T> = {
  columns: { key: string; label: string; render?: (row: T) => ReactNode }[];
  rows: T[];
  rowKey: (row: T) => string;
  onRowClick?: (row: T) => void;
};

export default function DataTable<T>({ columns, rows, rowKey, onRowClick }: DataTableProps<T>) {
  const languageLabel = useAppSelector((state) => state.admin.settings.language);
  const locale = resolveLocale(languageLabel);

  return (
    <div className="overflow-x-auto rounded-xl border border-sky-100 bg-white shadow-sm shadow-sky-100/60">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-linear-to-r from-sky-50 to-blue-50 text-slate-700">
          <tr>
            {columns.map((column) => (
              <th key={column.key} className="px-4 py-3 font-medium">
                {translateLoose(locale, column.label)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={rowKey(row)}
              className={`border-t border-slate-100 ${onRowClick ? "cursor-pointer transition hover:bg-sky-50/70" : ""}`}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
            >
              {columns.map((column) => (
                <td key={column.key} className="px-4 py-3 text-slate-700">
                  {column.render
                    ? column.render(row)
                    : translateLoose(locale, String((row as Record<string, unknown>)[column.key] ?? ""))}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
