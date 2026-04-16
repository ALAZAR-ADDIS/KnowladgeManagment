# EFPC Knowledge Management System (KMS) - School MVP

A frontend-only, role-based Knowledge Management System for the Ethiopian Federal Police Commission (EFPC).

This project is built for a school MVP and uses local dummy data only.

## Project Summary

The system helps users:

- Manage and review cases
- Submit and read after-action reviews
- Create and read standard procedures
- Browse a combined knowledge repository
- View experts and skill profiles
- Perform admin approvals and basic governance tasks

## Tech Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Redux Toolkit
- React Redux
- Lucide Icons

## Important MVP Scope

- Frontend only
- No backend
- No API calls
- No database
- All data is seeded in Redux slices

## Roles

The app supports 3 roles:

1. Admin
2. Officer
3. Viewer

## Mock Login Users

Use the login screen to enter with dummy accounts:

- Inspector Dawit (Admin)
- Officer Hana (Officer)
- Analyst Bekele (Viewer)

## Main Features

### Admin

- Dashboard with key counts and activity
- User management (status toggle, role update, add user)
- Approvals management
  - Search by submitter
  - Filter by approval type
  - Sort by date/type/submitter
  - Detail modal shows the actual linked item (Case/AAR/SOP)
- Audit log with filters and detail modal
- Settings page
  - App name
  - Theme (light/dark)
  - Language label
  - Notification toggle
  - Live application updates through shared shell

### Officer

- Dashboard with quick stats and updates
- Cases CRUD flow
- After-action review creation and listing
- Standard procedure creation and listing
- Expert directory
- Knowledge repository
- Knowledge creation flow
  - Full form page
  - Quick add from officer dashboard
  - Knowledge type options (Case/AAR/SOP)

### Viewer

- Read-only dashboards and module access
- Repository browsing with bookmark support
- Read-only views for cases, reviews, procedures, and experts

## UI/UX Notes

- Responsive layout
- Toggleable sidebar (desktop + mobile drawer)
- Sidebar logout button
- Detail modal patterns for cards, lists, and table rows
- Light blue visual theme with clean contrast

## Project Structure (Key Folders)

```text
app/
	admin/
	officer/
	viewer/
	login/
	glossary/
components/
store/
	slices/
```

## State Management

Redux Toolkit slices:

- `authSlice`: login/logout and active role state
- `adminSlice`: users, approvals, audit logs, settings
- `officerSlice`: cases, reviews, procedures, experts, repository
- `viewerSlice`: bookmarks, recent views, filters, selected item

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Run development server

```bash
npm run dev
```

Open: `http://localhost:3000`

## Available Scripts

```bash
npm run dev
npm run lint
npm run build
npm run start
```

## School Submission Notes

- This is an MVP simulation for demonstration and academic use.
- The app is intentionally frontend-only.
- Data persistence is not included.

## Future Improvements

- Backend API and database integration
- Authentication and authorization with secure sessions
- File uploads and evidence attachments
- Real notification center and audit export
- Advanced analytics and reporting
