"use client";

import { useMemo, useState } from "react";
import AppShell from "@/components/AppShell";
import DataTable from "@/components/DataTable";
import FilterTabs from "@/components/FilterTabs";
import Modal from "@/components/Modal";
import PageHeader from "@/components/PageHeader";
import RoleGuard from "@/components/RoleGuard";
import SearchBar from "@/components/SearchBar";
import { reviewApproval } from "@/store/slices/adminSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

const typeTabs = ["all", "case", "aar", "sop"];

export default function AdminApprovalsPage() {
  const approvals = useAppSelector((state) => state.admin.approvalQueue);
  const { cases, aars, sops } = useAppSelector((state) => state.officer);
  const dispatch = useAppDispatch();
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"dateDesc" | "dateAsc" | "type" | "submitter">("dateDesc");

  const pendingRows = useMemo(() => {
    const base = approvals.filter((a) => a.status === "Pending");
    const filtered = base.filter((item) => {
      const matchesType = typeFilter === "all" || item.type === typeFilter;
      const matchesName = item.submittedBy.toLowerCase().includes(query.toLowerCase());
      return matchesType && matchesName;
    });
    return filtered.sort((a, b) => {
      if (sortBy === "type") return a.type.localeCompare(b.type);
      if (sortBy === "submitter") return a.submittedBy.localeCompare(b.submittedBy);
      if (sortBy === "dateAsc") return a.date.localeCompare(b.date);
      return b.date.localeCompare(a.date);
    });
  }, [approvals, query, sortBy, typeFilter]);

  const selectedApproval = pendingRows.find((a) => a.id === selectedId) ?? approvals.find((a) => a.id === selectedId) ?? null;
  const selectedCase = selectedApproval?.type === "case" && selectedApproval.sourceId ? cases.find((item) => item.id === selectedApproval.sourceId) : null;
  const selectedAar = selectedApproval?.type === "aar" && selectedApproval.sourceId ? aars.find((item) => item.id === selectedApproval.sourceId) : null;
  const selectedSop = selectedApproval?.type === "sop" && selectedApproval.sourceId ? sops.find((item) => item.id === selectedApproval.sourceId) : null;

  const columns = useMemo(
    () => [
      { key: "type", label: "Type" },
      { key: "title", label: "Title" },
      { key: "submittedBy", label: "Submitted By" },
      { key: "date", label: "Date" },
      {
        key: "notes",
        label: "Approval Notes",
        render: (row: (typeof approvals)[number]) => (
          <input
            value={notes[row.id] ?? row.notes ?? ""}
            onChange={(e) => setNotes((n) => ({ ...n, [row.id]: e.target.value }))}
            onClick={(e) => e.stopPropagation()}
            placeholder="Add notes"
            className="w-44 rounded border border-slate-300 px-2 py-1 text-xs"
          />
        ),
      },
      {
        key: "actions",
        label: "Actions",
        render: (row: (typeof approvals)[number]) => (
          <div className="flex gap-2">
            <button onClick={(e) => { e.stopPropagation(); setSelectedId(row.id); }} className="rounded bg-slate-600 px-2 py-1 text-xs text-white">Details</button>
            <button onClick={(e) => { e.stopPropagation(); dispatch(reviewApproval({ id: row.id, decision: "Approved", notes: notes[row.id] ?? "Approved" })); }} className="rounded bg-emerald-600 px-2 py-1 text-xs text-white">Approve</button>
            <button onClick={(e) => { e.stopPropagation(); dispatch(reviewApproval({ id: row.id, decision: "Rejected", notes: notes[row.id] ?? "Rejected" })); }} className="rounded bg-rose-600 px-2 py-1 text-xs text-white">Reject</button>
          </div>
        ),
      },
    ],
    [dispatch, notes],
  );

  return (
    <RoleGuard allowedRoles={["admin"]}>
      <AppShell role="admin">
        <PageHeader title="Approvals" subtitle="Review pending SOPs, AARs, and cases" />
        <div className="mb-4 space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <div className="min-w-64 flex-1">
              <SearchBar value={query} onChange={setQuery} placeholder="Search by submitter name" />
            </div>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value as "dateDesc" | "dateAsc" | "type" | "submitter")} title="Sort approvals" aria-label="Sort approvals" className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700">
              <option value="dateDesc">Sort: Newest date</option>
              <option value="dateAsc">Sort: Oldest date</option>
              <option value="type">Sort: Approval type</option>
              <option value="submitter">Sort: Submitter name</option>
            </select>
          </div>
          <FilterTabs tabs={typeTabs} active={typeFilter} onChange={setTypeFilter} />
        </div>
        <DataTable columns={columns} rows={pendingRows} rowKey={(a) => a.id} onRowClick={(row) => setSelectedId(row.id)} />
        <Modal open={Boolean(selectedApproval)} onClose={() => setSelectedId(null)} title="Approval Detail">
          {selectedApproval ? (
            <div className="space-y-2 text-sm text-slate-700">
              <p><span className="font-semibold text-slate-900">Type:</span> {selectedApproval.type.toUpperCase()}</p>
              <p><span className="font-semibold text-slate-900">Title:</span> {selectedApproval.title}</p>
              <p><span className="font-semibold text-slate-900">Source ID:</span> {selectedApproval.sourceId ?? "N/A"}</p>
              <p><span className="font-semibold text-slate-900">Submitted By:</span> {selectedApproval.submittedBy}</p>
              <p><span className="font-semibold text-slate-900">Date:</span> {selectedApproval.date}</p>
              <p><span className="font-semibold text-slate-900">Current Notes:</span> {notes[selectedApproval.id] ?? selectedApproval.notes ?? "No notes yet"}</p>
              <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Item Being Approved</p>
                {selectedCase ? (
                  <div className="space-y-1">
                    <p><span className="font-semibold text-slate-900">Case Name:</span> {selectedCase.name}</p>
                    <p><span className="font-semibold text-slate-900">Crime Type:</span> {selectedCase.crimeType}</p>
                    <p><span className="font-semibold text-slate-900">Location:</span> {selectedCase.location}</p>
                    <p><span className="font-semibold text-slate-900">Status:</span> {selectedCase.status}</p>
                    <p><span className="font-semibold text-slate-900">Description:</span> {selectedCase.description}</p>
                  </div>
                ) : null}
                {selectedAar ? (
                  <div className="space-y-1">
                    <p><span className="font-semibold text-slate-900">Linked Case:</span> {selectedAar.caseId}</p>
                    <p><span className="font-semibold text-slate-900">What Worked:</span> {selectedAar.whatWorked}</p>
                    <p><span className="font-semibold text-slate-900">What Failed:</span> {selectedAar.whatFailed}</p>
                    <p><span className="font-semibold text-slate-900">Recommendation:</span> {selectedAar.recommendation}</p>
                  </div>
                ) : null}
                {selectedSop ? (
                  <div className="space-y-1">
                    <p><span className="font-semibold text-slate-900">Procedure Title:</span> {selectedSop.title}</p>
                    <p><span className="font-semibold text-slate-900">Version:</span> {selectedSop.version}</p>
                    <p><span className="font-semibold text-slate-900">Category:</span> {selectedSop.category}</p>
                    <p><span className="font-semibold text-slate-900">Content:</span> {selectedSop.content}</p>
                  </div>
                ) : null}
                {!selectedCase && !selectedAar && !selectedSop ? (
                  <p className="text-xs text-slate-500">No linked record found for this approval item.</p>
                ) : null}
              </div>
            </div>
          ) : null}
        </Modal>
      </AppShell>
    </RoleGuard>
  );
}
