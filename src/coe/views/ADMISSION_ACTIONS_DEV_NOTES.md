# Admission Actions — Developer Notes

## Route
- **Path**: `/coe/academic/admission-actions`
- **Mounted in**: `src/pages/COEDashboard.tsx` (switch case: `'Admission Actions'`)
- **Sidebar**: Under "Academic Actions" → "Admission Actions"

## Files Created
1. **Data**: `src/coe/data/admissionActions.ts` (18 actions, 5 types, mixed statuses)
2. **Utils**: `src/coe/utils/admissionActions.ts` (gating, validation, CSV, helpers)
3. **View**: `src/coe/views/AdmissionActionsView.tsx` (main page, 390+ lines)
4. **Components**:
   - `AdmissionActionsTable.tsx` (table with sorting/pagination)
   - `ActionDetailDrawer.tsx` (drawer with 3 tabs)
   - `ActionCreateDialog.tsx` (4-step wizard)

## Action Types (5)
- `STUDENT_INFO_UPDATE` — Phone/email/address only
- `PROGRAM_CHANGE` — From/to program, effective semester, reason
- `CAMPUS_CHANGE` — From/to campus, effective semester
- `ADMISSION_CANCEL` — Effective semester, reason
- `READMISSION` — Last active term, returning term, reason

## Statuses & Workflow
- **Requested** → **Under Review** → **Approved** → **Applied**
- **Requested/Under Review** → **Rejected**
- Apply mutates `currentProgram` or `currentCampus` in-memory

## Seed Data (18 actions)
- 3 gated (STU-2023-0010, STU-2023-0145, STU-2024-0201) blocked by Finance/TER/Disciplinary
- Mixed statuses: 5 Requested, 4 Under Review, 5 Approved, 2 Rejected, 2 Applied
- Programs: CSE, EEE, BBA, LLB, ENG, MBA
- Campuses: Permanent, Banani, Mirpur

## Features
1. **Filters**: Semester, Program, Campus, Action Type (multi), Status (multi), Search
2. **Table**: Sortable, pagination (10/page), row selection
3. **Row Actions**: View, Approve, Reject (reason), Apply, Print
4. **Bulk Actions**: Approve, Reject (reason), Apply, Export CSV
5. **Gating**: Checks blocks before Approve/Apply; disables + tooltip if blocked
6. **Detail Drawer**: 3 tabs (Summary, Audit, Notes), footer actions
7. **Create Wizard**: 4 steps (Student, Type, Form, Review), validation
8. **Validation**: Required fields per type, reason min 10 chars, phone/email format

## Validation Rules
- **PROGRAM_CHANGE**: from, to, effective, reason (min 10 chars)
- **CAMPUS_CHANGE**: from, to, effective
- **ADMISSION_CANCEL**: effective, reason (min 10 chars)
- **READMISSION**: lastActive, returning, reason (min 10 chars)
- **STUDENT_INFO_UPDATE**: at least one field (phone/email/address), phone 11 digits (01...), email format

## Integration
- Reuses Phase 2 gating helpers (`getActiveBlocks`, `canApproveOrApply`)
- Reuses CSV/download utils pattern
- Consistent theme (purple gradient, badges, cards, shadows)

## Test Steps
1. Navigate to COE → Academic Actions → Admission Actions
2. Verify filters (semester/program/campus/type/status/search) combine correctly
3. Check 3 gated rows show disabled actions + tooltip
4. View action → verify drawer tabs (Summary, Audit, Notes)
5. Approve action → verify status changes to Approved
6. Reject action → verify reason required (min 10 chars)
7. Apply approved action → verify status changes to Applied, program/campus updated
8. New Action → 4-step wizard → verify all 5 types work with validation
9. Bulk select 3+ → test Approve/Reject/Apply/Export
10. Export CSV → verify filtered data downloaded
11. Print row → verify summary renders
12. Theme consistent; no console errors; no "demo" labels
