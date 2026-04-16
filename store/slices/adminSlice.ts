import { createSlice, nanoid, type PayloadAction } from "@reduxjs/toolkit";
import type { ApprovalItem, AuditLog, Role, User } from "./types";

type SystemSettings = {
  appName: string;
  theme: "light" | "dark";
  language: string;
  notifications: boolean;
};

type AdminState = {
  users: User[];
  approvalQueue: ApprovalItem[];
  auditLogs: AuditLog[];
  settings: SystemSettings;
};

const initialState: AdminState = {
  users: [
    { id: "u1", name: "Inspector Dawit", username: "dawit.i", role: "admin", status: "active", department: "Command" },
    { id: "u2", name: "Officer Hana", username: "hana.o", role: "officer", status: "active", department: "Investigations" },
    { id: "u3", name: "Analyst Bekele", username: "bekele.a", role: "viewer", status: "active", department: "Intelligence" },
    { id: "u4", name: "Sergeant Meron", username: "meron.s", role: "officer", status: "inactive", department: "Field Ops" },
    { id: "u5", name: "Captain Elias", username: "elias.c", role: "admin", status: "active", department: "Administration" },
    { id: "u6", name: "Officer Senait", username: "senait.o", role: "viewer", status: "active", department: "Community Safety" },
  ],
  approvalQueue: [
    { id: "ap1", type: "sop", title: "SOP: Evidence Transport Chain", sourceId: "SOP-002", submittedBy: "Officer Hana", date: "2026-04-10", status: "Pending" },
    { id: "ap2", type: "aar", title: "AAR: Border Checkpoint Sweep", sourceId: "AAR-002", submittedBy: "Sergeant Meron", date: "2026-04-09", status: "Pending" },
    { id: "ap3", type: "case", title: "Case: Digital Fraud Ring - Addis", sourceId: "EFPC-2026-003", submittedBy: "Officer Hana", date: "2026-04-07", status: "Pending" },
    { id: "ap4", type: "sop", title: "SOP: Patrol Escalation Ladder", sourceId: "SOP-005", submittedBy: "Captain Elias", date: "2026-04-06", status: "Pending" },
    { id: "ap5", type: "aar", title: "AAR: Night Raid Coordination", sourceId: "AAR-004", submittedBy: "Officer Senait", date: "2026-04-05", status: "Pending" },
  ],
  auditLogs: [
    { id: "l1", actor: "Inspector Dawit", action: "Updated role for Officer Hana", module: "Users", date: "2026-04-10 09:12", type: "UPDATE" },
    { id: "l2", actor: "Captain Elias", action: "Approved SOP: Arrest Protocol v2", module: "Approvals", date: "2026-04-09 14:32", type: "APPROVAL" },
    { id: "l3", actor: "Officer Hana", action: "Created case EFPC-2026-014", module: "Cases", date: "2026-04-08 11:04", type: "CREATE" },
    { id: "l4", actor: "Analyst Bekele", action: "Logged in to viewer dashboard", module: "Auth", date: "2026-04-08 07:22", type: "AUTH" },
    { id: "l5", actor: "Inspector Dawit", action: "Changed system language labels", module: "Settings", date: "2026-04-07 18:49", type: "UPDATE" },
    { id: "l6", actor: "Sergeant Meron", action: "Deleted duplicate AAR draft", module: "AAR", date: "2026-04-06 16:18", type: "DELETE" },
  ],
  settings: {
    appName: "EFPC Knowledge Management System",
    theme: "light",
    language: "English (ET)",
    notifications: true,
  },
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    addUser: (state, action: PayloadAction<Omit<User, "id">>) => {
      state.users.push({ id: nanoid(), ...action.payload });
    },
    setUserRole: (state, action: PayloadAction<{ id: string; role: Role }>) => {
      const user = state.users.find((u) => u.id === action.payload.id);
      if (user) user.role = action.payload.role;
    },
    toggleUserStatus: (state, action: PayloadAction<string>) => {
      const user = state.users.find((u) => u.id === action.payload);
      if (user) user.status = user.status === "active" ? "inactive" : "active";
    },
    reviewApproval: (state, action: PayloadAction<{ id: string; decision: "Approved" | "Rejected"; notes: string }>) => {
      const item = state.approvalQueue.find((a) => a.id === action.payload.id);
      if (!item) return;
      item.status = action.payload.decision;
      item.notes = action.payload.notes;
      state.auditLogs.unshift({
        id: nanoid(),
        actor: "Inspector Dawit",
        action: `${action.payload.decision} ${item.type.toUpperCase()} item ${item.title}`,
        module: "Approvals",
        date: new Date().toISOString().slice(0, 16).replace("T", " "),
        type: "APPROVAL",
      });
    },
    updateSettings: (state, action: PayloadAction<Partial<SystemSettings>>) => {
      state.settings = { ...state.settings, ...action.payload };
    },
  },
});

export const { addUser, setUserRole, toggleUserStatus, reviewApproval, updateSettings } = adminSlice.actions;
export default adminSlice.reducer;
