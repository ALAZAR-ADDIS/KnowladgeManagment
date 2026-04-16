export type Role = "admin" | "officer" | "viewer";

export type User = {
  id: string;
  name: string;
  username: string;
  role: Role;
  status: "active" | "inactive";
  department: string;
};

export type CaseItem = {
  id: string;
  name: string;
  crimeType: string;
  date: string;
  location: string;
  status: "Open" | "In Review" | "Closed";
  description: string;
  createdBy: string;
};

export type AarItem = {
  id: string;
  caseId: string;
  whatWorked: string;
  whatFailed: string;
  recommendation: string;
  createdBy: string;
  date: string;
  status: "Pending" | "Approved" | "Rejected";
};

export type SopItem = {
  id: string;
  title: string;
  version: string;
  category: string;
  content: string;
  lastUpdated: string;
  status: "Draft" | "Pending" | "Approved";
};

export type Expert = {
  id: string;
  name: string;
  role: string;
  rank: string;
  skills: string[];
  experience: string;
  region: string;
  contact: string;
};

export type RepositoryItem = {
  id: string;
  title: string;
  type: "Case" | "AAR" | "SOP";
  summary: string;
  description: string;
  sourceId: string;
  date: string;
  createdBy: string;
};

export type NewRepositoryItem = {
  title: string;
  type: "Case" | "AAR" | "SOP";
  summary: string;
  description: string;
  sourceId: string;
  createdBy: string;
  date?: string;
};

export type ApprovalItem = {
  id: string;
  type: "case" | "aar" | "sop";
  title: string;
  sourceId?: string;
  submittedBy: string;
  date: string;
  notes?: string;
  status: "Pending" | "Approved" | "Rejected";
};

export type AuditLog = {
  id: string;
  actor: string;
  action: string;
  module: string;
  date: string;
  type: "CREATE" | "UPDATE" | "DELETE" | "APPROVAL" | "AUTH";
};
