import { createSlice, nanoid, type PayloadAction } from "@reduxjs/toolkit";
import type { AarItem, CaseItem, Expert, NewRepositoryItem, RepositoryItem, SopItem } from "./types";

type OfficerState = {
  cases: CaseItem[];
  aars: AarItem[];
  sops: SopItem[];
  experts: Expert[];
  repositoryItems: RepositoryItem[];
};

const casesSeed: CaseItem[] = [
  { id: "EFPC-2026-001", name: "Downtown Armed Robbery", crimeType: "Armed Robbery", date: "2026-03-03", location: "Addis Ababa", status: "In Review", description: "Coordinated robbery near central bank branch with two suspects.", createdBy: "Officer Hana" },
  { id: "EFPC-2026-002", name: "Cross-Region Smuggling", crimeType: "Smuggling", date: "2026-02-19", location: "Dire Dawa", status: "Open", description: "Illegal transit of controlled goods across regional checkpoints.", createdBy: "Sergeant Meron" },
  { id: "EFPC-2026-003", name: "Telecom Fraud Cell", crimeType: "Cybercrime", date: "2026-01-25", location: "Bahir Dar", status: "Closed", description: "SIM-swap fraud ring targeting mobile money users.", createdBy: "Officer Senait" },
  { id: "EFPC-2026-004", name: "Warehouse Burglary", crimeType: "Burglary", date: "2026-03-21", location: "Hawassa", status: "Open", description: "Night-time forced entry and theft of high-value electronics.", createdBy: "Officer Hana" },
  { id: "EFPC-2026-005", name: "Highway Cargo Hijack", crimeType: "Hijacking", date: "2026-04-01", location: "Adama", status: "In Review", description: "Cargo truck hijacked at dawn, recovered after 18 hours.", createdBy: "Captain Elias" },
];

const aarsSeed: AarItem[] = [
  { id: "AAR-001", caseId: "EFPC-2026-001", whatWorked: "Quick perimeter lock and CCTV extraction.", whatFailed: "Delayed witness consolidation in first hour.", recommendation: "Create rapid witness intake SOP.", createdBy: "Officer Hana", date: "2026-03-05", status: "Pending" },
  { id: "AAR-002", caseId: "EFPC-2026-002", whatWorked: "Strong inter-region radio coordination.", whatFailed: "Vehicle checkpoint lacked scanning equipment.", recommendation: "Deploy mobile scanners in high-risk corridors.", createdBy: "Sergeant Meron", date: "2026-02-23", status: "Approved" },
  { id: "AAR-003", caseId: "EFPC-2026-003", whatWorked: "Digital forensics identified central operator.", whatFailed: "Citizen reporting hotline response lag.", recommendation: "Add hotline escalation queue.", createdBy: "Officer Senait", date: "2026-01-29", status: "Approved" },
  { id: "AAR-004", caseId: "EFPC-2026-004", whatWorked: "Local patrol maps reduced blind spots.", whatFailed: "Evidence tagging had duplicate labels.", recommendation: "Introduce barcode tagging workflow.", createdBy: "Officer Hana", date: "2026-03-24", status: "Pending" },
  { id: "AAR-005", caseId: "EFPC-2026-005", whatWorked: "Drone support improved pursuit visibility.", whatFailed: "Fuel tracking records were incomplete.", recommendation: "Mandatory fuel log check before dispatch.", createdBy: "Captain Elias", date: "2026-04-02", status: "Rejected" },
];

const sopsSeed: SopItem[] = [
  { id: "SOP-001", title: "Incident Scene Preservation", version: "2.1", category: "Investigation", content: "Secure scene, isolate witness flow, maintain evidence chain.", lastUpdated: "2026-03-01", status: "Approved" },
  { id: "SOP-002", title: "Digital Evidence Intake", version: "1.4", category: "Cybercrime", content: "Document source, clone media, hash files, secure originals.", lastUpdated: "2026-02-13", status: "Approved" },
  { id: "SOP-003", title: "Checkpoint Escalation Protocol", version: "1.0", category: "Field Ops", content: "Escalate based on threat matrix and jurisdiction authority.", lastUpdated: "2026-04-07", status: "Pending" },
  { id: "SOP-004", title: "AAR Submission Standard", version: "3.0", category: "Knowledge", content: "Submit AAR within 48h with objective performance metrics.", lastUpdated: "2026-01-17", status: "Approved" },
  { id: "SOP-005", title: "Joint Unit Briefing", version: "0.9", category: "Operations", content: "Mandatory pre-action briefing template for multi-unit tasks.", lastUpdated: "2026-03-26", status: "Draft" },
];

const expertsSeed: Expert[] = [
  { id: "e1", name: "Commander Tsegaye", role: "Strategic Advisor", rank: "Commander", skills: ["Operations", "Risk Assessment", "Negotiation"], experience: "17 years", region: "Addis Ababa", contact: "contact@efpc.local" },
  { id: "e2", name: "Inspector Rahel", role: "Forensics Lead", rank: "Inspector", skills: ["Forensics", "Evidence Chain", "Lab QA"], experience: "11 years", region: "Amhara", contact: "contact@efpc.local" },
  { id: "e3", name: "Officer Yonatan", role: "Cyber Analyst", rank: "Officer", skills: ["Cybercrime", "OSINT", "Digital Tracing"], experience: "7 years", region: "Oromia", contact: "contact@efpc.local" },
  { id: "e4", name: "Captain Selam", role: "Field Operations", rank: "Captain", skills: ["Patrol Strategy", "Crowd Control", "Logistics"], experience: "13 years", region: "Tigray", contact: "contact@efpc.local" },
  { id: "e5", name: "Sergeant Fitsum", role: "Community Liaison", rank: "Sergeant", skills: ["Mediation", "Public Safety", "Reporting"], experience: "9 years", region: "SNNPR", contact: "contact@efpc.local" },
];

const repositorySeed: RepositoryItem[] = [
  {
    id: "r1",
    title: "Case Lessons: Downtown Armed Robbery",
    type: "Case",
    summary: "Highlights of perimeter response and evidence handling.",
    description:
      "The team secured all entry and exit corridors within nine minutes and used nearby commercial CCTV to establish suspect movement. The strongest lesson was that early witness sequencing prevented conflicting narratives, but evidence tagging still required secondary verification to avoid chain gaps during transfer.",
    sourceId: "EFPC-2026-001",
    date: "2026-03-06",
    createdBy: "Officer Hana",
  },
  {
    id: "r2",
    title: "AAR Insight: Cross-Region Smuggling",
    type: "AAR",
    summary: "Radio protocol improvements for inter-region operations.",
    description:
      "Inter-region command channels reduced confusion when field units crossed local boundaries. The AAR recommends a single escalation vocabulary, mandatory half-hour synchronization calls, and an automatic relay fallback for low-signal routes to preserve continuity in active pursuits.",
    sourceId: "AAR-002",
    date: "2026-02-24",
    createdBy: "Sergeant Meron",
  },
  {
    id: "r3",
    title: "SOP Update: Digital Evidence Intake",
    type: "SOP",
    summary: "Revised digital evidence hashing standards.",
    description:
      "The revised SOP formalizes dual-hash validation and introduces a checklist for device imaging under constrained field conditions. Every intake now records source context, acquisition tool version, and verification witness signature before handoff to central forensic storage.",
    sourceId: "SOP-002",
    date: "2026-02-13",
    createdBy: "Inspector Rahel",
  },
  {
    id: "r4",
    title: "Case Spotlight: Highway Cargo Hijack",
    type: "Case",
    summary: "Recovery timeline and pursuit coordination notes.",
    description:
      "This case documents phased pursuit management with drone-assisted route prediction. Recovery succeeded after predictive choke-point planning, but post-operation analysis highlighted communication lag between escort and dispatch teams during fuel-check handovers.",
    sourceId: "EFPC-2026-005",
    date: "2026-04-03",
    createdBy: "Captain Elias",
  },
  {
    id: "r5",
    title: "SOP Draft: Joint Unit Briefing",
    type: "SOP",
    summary: "Standardized pre-action communication template.",
    description:
      "The draft introduces a role-by-role briefing sequence covering objective, constraints, fallback channels, and arrest authority limits. It is designed to reduce ambiguity in mixed-unit operations and improve accountability during dynamic transitions.",
    sourceId: "SOP-005",
    date: "2026-03-26",
    createdBy: "Captain Selam",
  },
  {
    id: "r6",
    title: "Knowledge Brief: Witness Intake Window",
    type: "AAR",
    summary: "Optimizing first-hour witness capture and verification.",
    description:
      "A cross-case review found that witness statements degrade rapidly after the first operational hour. The brief recommends deploying a dedicated intake officer, using a two-stage question protocol, and reconciling witness maps against geotagged patrol logs before formal escalation.",
    sourceId: "AAR-001",
    date: "2026-03-12",
    createdBy: "Officer Senait",
  },
  {
    id: "r7",
    title: "Case Pattern: Warehouse Burglary Entry Methods",
    type: "Case",
    summary: "Comparative profile of forced-entry signatures.",
    description:
      "This pattern note compares seven warehouse incidents and highlights recurring lock bypass techniques, target selection by loading schedule, and low-visibility timing. It supports faster suspect profiling by matching entry signatures to known regional operating methods.",
    sourceId: "EFPC-2026-004",
    date: "2026-03-29",
    createdBy: "Officer Hana",
  },
  {
    id: "r8",
    title: "SOP Companion: Checkpoint Escalation Decision Tree",
    type: "SOP",
    summary: "Operational matrix for stop, inspect, and escalate decisions.",
    description:
      "This companion document translates the checkpoint SOP into a visual decision tree for field use. It clarifies when to escalate to command, when to involve forensic units, and how to document discretionary actions under rapidly changing threat conditions.",
    sourceId: "SOP-003",
    date: "2026-04-08",
    createdBy: "Commander Tsegaye",
  },
  {
    id: "r9",
    title: "AAR Trend: Hotline Escalation Delays",
    type: "AAR",
    summary: "Root causes behind delayed escalation from public reporting channels.",
    description:
      "Trend analysis across quarterly hotline logs shows delay clusters during shift overlap and incident spikes. The recommendation is to introduce queue triage tags, automated severity scoring, and scripted operator prompts to minimize handoff ambiguity and lost urgency.",
    sourceId: "AAR-003",
    date: "2026-02-02",
    createdBy: "Analyst Bekele",
  },
  {
    id: "r10",
    title: "Case Intelligence Note: Telecom Fraud Cell",
    type: "Case",
    summary: "Network structure and SIM-swap operational indicators.",
    description:
      "The intelligence note captures communication patterns, account takeover intervals, and mule-account rotation cycles in telecom fraud cases. It emphasizes early collaboration between cyber analysts and field investigators to freeze high-risk assets before network migration occurs.",
    sourceId: "EFPC-2026-003",
    date: "2026-01-30",
    createdBy: "Officer Yonatan",
  },
];

const initialState: OfficerState = {
  cases: casesSeed,
  aars: aarsSeed,
  sops: sopsSeed,
  experts: expertsSeed,
  repositoryItems: repositorySeed,
};

const officerSlice = createSlice({
  name: "officer",
  initialState,
  reducers: {
    addCase: (state, action: PayloadAction<CaseItem>) => {
      state.cases.unshift(action.payload);
    },
    editCase: (state, action: PayloadAction<CaseItem>) => {
      const index = state.cases.findIndex((c) => c.id === action.payload.id);
      if (index >= 0) state.cases[index] = action.payload;
    },
    deleteCase: (state, action: PayloadAction<string>) => {
      state.cases = state.cases.filter((c) => c.id !== action.payload);
    },
    addAar: (state, action: PayloadAction<AarItem>) => {
      state.aars.unshift(action.payload);
    },
    editAar: (state, action: PayloadAction<AarItem>) => {
      const index = state.aars.findIndex((a) => a.id === action.payload.id);
      if (index >= 0) state.aars[index] = action.payload;
    },
    deleteAar: (state, action: PayloadAction<string>) => {
      state.aars = state.aars.filter((a) => a.id !== action.payload);
    },
    addSop: (state, action: PayloadAction<SopItem>) => {
      state.sops.unshift(action.payload);
    },
    editSop: (state, action: PayloadAction<SopItem>) => {
      const index = state.sops.findIndex((s) => s.id === action.payload.id);
      if (index >= 0) state.sops[index] = action.payload;
    },
    deleteSop: (state, action: PayloadAction<string>) => {
      state.sops = state.sops.filter((s) => s.id !== action.payload);
    },
    addRepositoryItem: (state, action: PayloadAction<NewRepositoryItem>) => {
      const created: RepositoryItem = {
        id: `r-${nanoid(6)}`,
        date: action.payload.date ?? new Date().toISOString().slice(0, 10),
        ...action.payload,
      };
      state.repositoryItems.unshift(created);
    },
  },
});

export const {
  addCase,
  editCase,
  deleteCase,
  addAar,
  editAar,
  deleteAar,
  addSop,
  editSop,
  deleteSop,
  addRepositoryItem,
} = officerSlice.actions;

export default officerSlice.reducer;
