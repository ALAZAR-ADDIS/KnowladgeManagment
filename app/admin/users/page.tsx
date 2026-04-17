"use client";
export const dynamic = "force-dynamic";

import { useMemo, useState } from "react";
import AppShell from "@/components/AppShell";
import DataTable from "@/components/DataTable";
import FormField from "@/components/FormField";
import Modal from "@/components/Modal";
import PageHeader from "@/components/PageHeader";
import RoleGuard from "@/components/RoleGuard";
import { addUser, setUserRole, toggleUserStatus } from "@/store/slices/adminSlice";
import type { Role } from "@/store/slices/types";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { resolveLocale, translateLoose } from "@/lib/i18n";

export default function AdminUsersPage() {
  const users = useAppSelector((state) => state.admin.users);
  const languageLabel = useAppSelector((state) => state.admin.settings.language);
  const dispatch = useAppDispatch();
  const locale = resolveLocale(languageLabel);
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", username: "", role: "viewer" as Role, department: "" });
  const selectedUser = users.find((u) => u.id === selectedId) ?? null;

  const columns = useMemo(
    () => [
      { key: "name", label: "Name" },
      { key: "username", label: "Username" },
      {
        key: "role",
        label: "Role",
        render: (row: (typeof users)[number]) => (
          <select
            value={row.role}
            onChange={(e) => dispatch(setUserRole({ id: row.id, role: e.target.value as Role }))}
            onClick={(e) => e.stopPropagation()}
            title="User role"
            className="rounded border border-slate-300 px-2 py-1 text-xs"
          >
            <option value="admin">{translateLoose(locale, "admin")}</option>
            <option value="officer">{translateLoose(locale, "officer")}</option>
            <option value="viewer">{translateLoose(locale, "viewer")}</option>
          </select>
        ),
      },
      { key: "department", label: "Department" },
      {
        key: "status",
        label: "Status",
        render: (row: (typeof users)[number]) => (
          <button
            onClick={(e) => {
              e.stopPropagation();
              dispatch(toggleUserStatus(row.id));
            }}
            className={`rounded px-2 py-1 text-xs ${
              row.status === "active" ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
            }`}
          >
            {translateLoose(locale, row.status)}
          </button>
        ),
      },
    ],
    [dispatch, locale],
  );

  return (
    <RoleGuard allowedRoles={["admin"]}>
      <AppShell role="admin">
        <PageHeader
          title="User Management"
          subtitle="Manage accounts, role assignments, and active status"
          action={
            <button onClick={() => setOpen(true)} className="rounded-md bg-blue-700 px-3 py-2 text-sm font-medium text-white hover:bg-blue-800">
              Add User
            </button>
          }
        />
        <DataTable columns={columns} rows={users} rowKey={(u) => u.id} onRowClick={(row) => setSelectedId(row.id)} />

        <Modal open={Boolean(selectedUser)} onClose={() => setSelectedId(null)} title="User Detail">
          {selectedUser ? (
            <div className="space-y-2 text-sm text-slate-700">
              <p><span className="font-semibold text-slate-900">Name:</span> {selectedUser.name}</p>
              <p><span className="font-semibold text-slate-900">Username:</span> {selectedUser.username}</p>
              <p><span className="font-semibold text-slate-900">Role:</span> {translateLoose(locale, selectedUser.role)}</p>
              <p><span className="font-semibold text-slate-900">Status:</span> {translateLoose(locale, selectedUser.status)}</p>
              <p><span className="font-semibold text-slate-900">Department:</span> {selectedUser.department}</p>
            </div>
          ) : null}
        </Modal>

        <Modal open={open} onClose={() => setOpen(false)} title="Add New User">
          <div className="space-y-3">
            <FormField label="Name" value={form.name} onChange={(value) => setForm((f) => ({ ...f, name: value }))} />
            <FormField label="Username" value={form.username} onChange={(value) => setForm((f) => ({ ...f, username: value }))} />
            <FormField label="Department" value={form.department} onChange={(value) => setForm((f) => ({ ...f, department: value }))} />
            <label className="block text-sm">
              <span className="font-medium text-slate-700">Role</span>
              <select
                value={form.role}
                onChange={(e) => setForm((f) => ({ ...f, role: e.target.value as Role }))}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
              >
                <option value="admin">{translateLoose(locale, "admin")}</option>
                <option value="officer">{translateLoose(locale, "officer")}</option>
                <option value="viewer">{translateLoose(locale, "viewer")}</option>
              </select>
            </label>
            <button
              onClick={() => {
                if (!form.name || !form.username || !form.department) return;
                dispatch(addUser({ ...form, status: "active" }));
                setOpen(false);
                setForm({ name: "", username: "", role: "viewer", department: "" });
              }}
              className="w-full rounded-md bg-blue-700 py-2 text-sm font-medium text-white hover:bg-blue-800"
            >
              Save User
            </button>
          </div>
        </Modal>
      </AppShell>
    </RoleGuard>
  );
}
