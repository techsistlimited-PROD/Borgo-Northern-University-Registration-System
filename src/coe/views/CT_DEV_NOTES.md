# Credit Transfer Console — Developer Notes

## Route
- **Path**: `/coe/academic/credit-transfer`
- **Mounted in**: `src/pages/COEDashboard.tsx` (switch case: `'Credit Transfer'`)
- **Sidebar**: Under "Academic Actions" → "Credit Transfer"

## Files Created
1. **Data**: `src/coe/data/creditTransfers.ts` (12 requests, mixed statuses, 619 lines)
2. **Utils**: `src/coe/utils/creditTransfer.ts` (compute, gating, validation, CSV, 204 lines)
3. **View**: `src/coe/views/CreditTransferView.tsx` (main page, 430+ lines)
4. **Components**:
   - `CTRequestTable.tsx` — Queue table with sorting/pagination (253 lines)
   - `CTDetailDrawer.tsx` — Drawer with 4 tabs (259 lines)
   - `CTCourseMapGrid.tsx` — Equivalence mapping grid (220 lines)
   - `CTBulkBar.tsx` — Bulk actions bar (136 lines)
   - `CTDecisionDialog.tsx` — Approve/Reject dialog (81 lines)
   - `CTImportTranscriptDrawer.tsx` — CSV/Manual import (269 lines)

## Statuses & Workflow
- **Requested** → **Under Review** → **Evaluated** → **Approved** → **Applied**
- **Rejected** can occur from Requested/Under Review/Evaluated
- **Evaluate**: opens mapping grid, on save sets Evaluated + updates totals
- **Approve**: requires Evaluated, captures remarks
- **Apply**: finalizes transfer, locks mapping grid (read-only)

## Seed Data (12 requests)
- 3 gated (STU-2023-0010, STU-2024-0201, STU-2023-0145) blocked by Finance/TER/Disciplinary
- Mixed statuses: 3 Requested, 2 Under Review, 3 Evaluated, 2 Approved, 1 Rejected, 1 Applied
- Programs: CSE, EEE, BBA, LLB, MBA, ENG
- Campuses: Permanent, Banani, Mirpur
- Source universities: DU, BUET, BRAC, IBA, KUET, JU, etc.

## Course Mapping Features
- **Decisions**: Map (to target course), Waive (with reason), Reject (with reason)
- **Validation**: Target required for Map, no duplicate mappings, credit mismatch warning
- **Totals**: Computed automatically (source/mapped/waived credits, mapping %)
- **Sample courses**: 12 courses from CSE/BBA/EEE/LAW for mapping targets
- **Read-only**: Approved/Applied/Rejected requests have locked grids

## Import Modes
- **CSV Upload**: Paste CSV (sourceCode,sourceTitle,sourceCredit,grade), client-side parse
- **Manual Entry**: Add courses one-by-one with form
- Creates Requested status with initial mappings

## Detail Drawer Tabs
1. **Summary**: Transfer info, totals cards (source/mapped/waived/%), notes, gating alerts
2. **Mapping**: CTCourseMapGrid for equivalence decisions
3. **Attachments**: Stub list (transcript.pdf, course_descriptions.pdf)
4. **Audit**: Chronological timeline with timestamps & actors

## Gating (Phase 2 integration)
- Checks active blocks before Evaluate/Approve/Apply
- Disabled actions show tooltip: "Blocked by Finance/TER/Disciplinary. Clear holds in Block Manager."

## Utilities
- `computeTotals(mappings)`: returns sourceCredits/mappedCredits/waivedCredits
- `getMappingPercentage(totals)`: returns mapping coverage %
- `canProceed(request, action)`: enforces gating + status rules
- `validateMapping(mapping, existing)`: validates target selection, duplicates, credits
- `parseCsv(content)`: client-side CSV parser
- `fakeToast(msg)`: simple purple toast notification (2s auto-dismiss)

## Exports
- **CSV**: Student ID, Name, Program, Campus, Source Univ, Source/Mapped/Waived Credits, Status, Updated
- **Print**: Table print (hide chrome, purple header)

## Test Steps
1. Navigate to COE → Academic Actions → Credit Transfer
2. Verify filters (semester/program/campus/status/search) combine correctly
3. Check 3 gated rows show disabled actions + tooltip
4. View request → verify drawer tabs (Summary, Mapping, Attachments, Audit)
5. Evaluate request → map courses, waive, reject → Save Draft → verify status → Evaluated
6. Approve evaluated → verify decision dialog → status → Approved
7. Reject request → verify reason required
8. Apply approved → verify status → Applied, audit updated
9. New Request → CSV mode → paste CSV → verify course preview → Create
10. New Request → Manual mode → add courses → Create
11. Bulk select 3+ → Approve/Reject/Apply/Export CSV
12. Export CSV → verify filtered/selected data downloads
13. Theme consistent; no console errors; no "demo" labels
