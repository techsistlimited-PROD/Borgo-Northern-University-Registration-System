# Certificates Manager — Developer Notes

## Route
- **Path**: `/coe/docs/certificates`
- **Mounted in**: `src/pages/COEDashboard.tsx` (switch case: `'Certificates Manager'`)
- **Sidebar**: Under "Transcripts & Certificates" → "Certificates Manager"

## Files Created
1. **View**: `src/coe/views/CertificatesManagerView.tsx` (main page, 330+ lines)
2. **Components**:
   - `src/coe/components/CertQueueTable.tsx` (queue grid with sorting/pagination)
   - `src/coe/components/CertPreviewDrawer.tsx` (right drawer: preview/history/notes)
   - `src/coe/components/CertPrintTemplate.tsx` (print-ready layout variants)
   - `src/coe/components/CertBulkActionsBar.tsx` (bulk actions bar)
   - `src/coe/components/CertIssueDialog.tsx` (issue/approve dialog)
3. **Utils**: `src/coe/utils/certificates.ts` (gating, serial/QR gen, CSV export)
4. **Data**: Extended `src/coe/data/certificates.ts` (16 total requests, mixed types/statuses)

## Supported Certificate Types (14)
OTRN (Official Transcript Full), PTRN (Partial), UTRP (Unofficial), PROV (Provisional),
MAIN (Main Cert), MIGR (Migration), MOI (Medium of Instruction), TEST (Testimonial),
CHAR (Character), RECO (Recommendation), GRDL (Grading System), BACK (Backlog),
PVCE (PVC Equivalency), LRP (Result Publication)

## Data Structure
- `CertificateRequest`: studentId, name, program, batch, campus, credits, cgpa, documentType, status, dates, serial, qrToken
- Statuses: Requested → Processing → Ready → Collected | Rejected
- Seed data includes 3 blocked students (finance/TER/disciplinary) for gating demo

## Features
1. **Queue Table**: sortable columns, pagination (10/page), multi-select
2. **Filters**: Semester, Program, Type (multi-chip), Status (multi-chip), Search (ID/Name)
3. **Row Actions**: Preview, Mark Ready, Mark Collected, Reject, Print
4. **Bulk Actions**: Mark Ready, Mark Collected, Reject (with reason), Export Selected CSV
5. **Gating**: Checks active blocks via `canIssueOrPrint()` before Ready/Print; disables + tooltip if blocked
6. **Preview Drawer**: 3 tabs (Preview with CertPrintTemplate, History timeline, Notes)
7. **Print Template**: 4 layout variants (Certificate, Testimonial, Letter, Transcript) based on type
8. **Issue Dialog**: Student autocomplete (from transcripts.ts), type select, purpose, "Issue & Process"
9. **Serial/QR**: Auto-generated on Mark Ready (`SER-YYYY-xxxxx`, 8-char QR hash)
10. **CSV Export**: Filtered queue or selected rows

## Workflow
- **Requested** (new/issue) → **Processing** (manual/auto) → **Mark Ready** (gen serial/QR) → **Ready** → **Mark Collected** → **Collected**
- **Reject** path: Requested/Processing → Rejected (with reason)
- Gating halts Ready/Print if active block exists

## Validation
- Issue dialog requires student + type
- Reject requires reason
- Blocked students cannot be marked ready

## Theme
- Purple gradient (`deep-plum` → `accent-purple`) in header/buttons/badges
- Consistent with existing COE pages
- Print template uses border/seal/signatory layout, purple accent strip

## Test Steps
1. Navigate to COE → Transcripts & Certificates → Certificates Manager
2. Verify filters work (program/type/status/search) and combine correctly
3. Check blocked rows (STU-2023-0010, STU-2024-0201, STU-2023-0088) show disabled actions + tooltip
4. Preview a request → verify tabs (Preview, History, Notes)
5. Mark Ready → verify serial/QR generated
6. Mark Collected → verify status transition
7. Reject → verify reason captured
8. Bulk select 3+ rows → test bulk actions (Ready/Collected/Reject/Export CSV)
9. Click Print on Ready row → verify print template opens
10. New Issue → autocomplete student, select type, issue → verify new row appears
11. Export CSV → verify filtered data downloaded
12. No console errors; theme consistent; no "demo" labels
