# Course Exemption Console — Developer Notes

## Route
- **Path**: `/coe/academic/exemptions`
- **Mounted in**: `src/pages/COEDashboard.tsx` (switch case: `'Course Exemption'`)
- **Sidebar**: Under "Academic Actions" → "Course Exemption"

## Files Created
1. **Data**: `src/coe/data/courseExemptions.ts` (14 requests, 6 statuses, 378 lines)
2. **Utils**: `src/coe/utils/courseExemption.ts` (compute credits, gating, validation, CSV, 151 lines)
3. **View**: `src/coe/views/CourseExemptionView.tsx` (main page, 370+ lines)
4. **Components**:
   - `CERequestTable.tsx` — Queue table with sorting/pagination (247 lines)
   - `CEDetailDrawer.tsx` — Drawer with 3 tabs (206 lines)
   - `CECoursePicker.tsx` — Course selection grid (150 lines)
   - `CEBulkBar.tsx` — Bulk actions bar (145 lines)
   - `CEDecisionDialog.tsx` — Approve/Reject dialog (79 lines)

## Statuses & Workflow
- **Requested** → **Under Review** → **Evaluated** → **Approved** → **Applied**
- **Rejected** can occur from Requested/Under Review/Evaluated
- **Evaluate**: Select courses → Save Draft → Mark Evaluated
- **Approve**: Requires at least 1 course selected, approval notes required
- **Apply**: Finalizes exemption, updates student record (client-side)

## Seed Data (14 requests)
- 3 gated (STU-2023-0010, STU-2024-0201, STU-2023-0145) blocked by Finance/TER/Disciplinary
- 3 Evaluated, 2 Approved, 1 Applied, 2 Rejected, 6 Requested/Under Review
- Programs: CSE, EEE, BBA, LLB, MBA, ENG
- Campuses: Permanent, Banani, Mirpur

## Course Selection Features
- **Requested Courses**: Left list with checkboxes
- **Exemptable Courses**: Right list showing selected (live preview)
- **Validation**: Max 12 credits per semester (soft rule, shows warning)
- **Totals**: Computed (total requested vs total exempted)
- **Read-only**: Approved/Applied/Rejected requests have locked grids

## Detail Drawer Tabs
1. **Summary**: Request info, credit summary cards, notes, gating alerts
2. **Courses**: CECoursePicker for selecting courses to exempt
3. **Audit**: Chronological timeline with timestamps & actors

## Gating (Phase 2 integration)
- Checks active blocks before Evaluate/Approve/Apply
- Disabled actions show tooltip: "Blocked by Finance/TER/Disciplinary. Clear in Block Manager."

## Utilities
- `computeTotalRequestedCredits(request)`: Returns sum of requested course credits
- `computeTotalExemptedCredits(request)`: Returns sum of selected exempted course credits
- `validateExemption(request)`: Checks at least 1 course selected, max 12 credits
- `isGated(request)`: Returns blocked status with reason
- `canProceed(request, action)`: Enforces gating + status rules
- `fakeToast(msg)`: Purple toast notification (2s auto-dismiss)

## Exports
- **CSV**: Student ID, Name, Program, Campus, Total Requested, Total Exempted, Status, Requested, Updated
- **Print**: Table print (hide chrome)

## Test Steps
1. Navigate to COE → Academic Actions → Course Exemption
2. Verify filters (semester/program/campus/status/search) combine correctly
3. Check 3 gated rows show disabled actions + tooltip
4. View request → verify drawer tabs (Summary, Courses, Audit)
5. Evaluate request → open Courses tab → select courses → Save Draft → verify Evaluated status
6. Approve evaluated → verify approval notes required → status changes to Approved
7. Reject request → verify reason required → status changes to Rejected
8. Apply approved → verify status changes to Applied, audit updated
9. Bulk select 3+ → Approve/Reject/Apply/Export CSV
10. Verify 12 credit limit warning appears when exceeded
11. Export CSV → verify filtered/selected data downloads
12. Theme consistent; no console errors; no "demo" labels
