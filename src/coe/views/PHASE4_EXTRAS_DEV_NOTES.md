# Phase 4.4 + Extras — Dev Notes

**Modules**: CBE Console, Scholarship Assign, Verification Hub, Convocation Manager

## Quick Reference

### Routes
- `/coe/academic/cbe` → CBEConsoleView
- `/coe/academic/scholarships` → ScholarshipAssignView
- `/coe/verify` → VerificationHubView
- `/coe/convocation` → ConvocationManagerView

### Data Files
- `src/coe/data/cbe.ts` — CBE meetings (4) + candidates (8)
- `src/coe/data/scholarships.ts` — Rules (4 tiers) + proposals (8)
- `src/coe/data/convocation.ts` — Events (3) + registrations (8)
- `src/coe/data/verification.ts` — Student profiles (8)

### Utils
- `src/coe/utils/cbe.ts` — Meeting validation, CSV export, gating checks
- `src/coe/utils/scholarships.ts` — Tier assignment, waiver validation, CSV
- `src/coe/utils/convocation.ts` — Eligibility checks, CSV export
- `src/coe/utils/verification.ts` — Token/QR generation, CSV export

## CBE Console
**Components**: CBEMeetingTable, CBECandidateDrawer, CBEBulkBar, CBECreateMeetingDialog, CBEImportCandidatesDrawer

**Features**:
- Filters: Semester, Program, Meeting No., Status, Search
- Meeting table with Draft/Published/Closed status badges (purple/indigo theme)
- Candidate drawer with 4 tabs (Summary, Eligibility, Decision, Audit)
- Bulk actions: Approve/Withhold/Reject, CSV export
- Gating: Disciplinary blocks disable Approve (tooltip shown)
- Decision workflow: Pending → Eligible/Not Eligible/Withheld

## Scholarship Assign
**Components**: ScholarshipRuleCard, ScholarshipProposalsTable, ScholarshipDecisionDialog

**Features**:
- Left panel: 4 tier rule cards (editable waiver %, reset/revert)
- Right panel: Proposals table with Proposed/Approved/Rejected/Assigned status
- Tier colors: purple/indigo/violet (no green)
- Decision dialog: Select tier, adjust waiver %, notes
- Notice: Finance/TER holds are read-only (no blocking)
- CGPA-based tier suggestion on load

## Verification Hub
**Components**: VerificationSearchBar, VerificationResultCard, VerificationPreviewDrawer

**Features**:
- Search by studentId or token
- Filters: Program, Status (Verified/Pending/Rejected)
- Card grid layout with quick badges
- Preview drawer: Summary, history, QR/Token display
- Actions: Mark Verified / Reject (with reason), Print letter (reuses CertPrintTemplate)
- Export CSV

## Convocation Manager
**Components**: ConvocationEventTable, ConvocationRegistrationTable, ConvocationCreateDialog, ConvocationBulkActionsBar

**Features**:
- Events table: No., Title, Covered Sem, CBE range, Reg window, Date, Status
- Create/Edit event, Open/Close registration (Draft → Open → Closed → Completed)
- Registrations table (per event): Student, Program, Credits, CGPA, Fee Status, Reg Status
- Bulk actions: Approve/Reject/Mark Paid/Export/Print
- Fee status badges: Paid (indigo), Unpaid (amber)
- Reg status badges: Requested (blue), Approved (purple), Rejected (gray)

## Theme & UX
- All badges/buttons use purple/indigo palette (no green)
- No "demo" labels or text
- Session-only state (resets on refresh)
- Gating integrated where specified (CBE disciplinary blocks)
- CSV exports follow standard helper pattern
- Print functionality reuses existing patterns

## Future Extensions
- API/Repo integration points ready in view handlers
- Audit logs extendable via `auditLog` / `history` arrays
- All seed data arrays easily extendable (10–30 rows)
- Components designed for reuse across similar workflows
