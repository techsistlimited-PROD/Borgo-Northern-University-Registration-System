# Document Printing Hub — Developer Notes

## Route
- **Path**: `/coe/docs/print-center`
- **Mounted in**: `src/pages/COEDashboard.tsx` (switch case: `'Document Printing Hub'`)
- **Sidebar**: Under "Transcripts & Certificates" → "Document Printing Hub"

## Files Created
1. **Data**: `src/coe/data/documents.ts` (12 sample document records)
2. **View**: `src/coe/views/DocumentPrintingHubView.tsx` (main page, 240+ lines)
3. **Component**: `src/coe/components/DocPrintTable.tsx` (table with sorting/pagination)

## Reused Components (from Phase 3.2)
- `CertPreviewDrawer` — Preview drawer with tabs
- `CertPrintTemplate` — Print layout renderer
- `toCsv`, `downloadCsv` utilities from `certificates.ts`

## Data Structure
- `DocumentRecord`: studentId, name, program, campus, batch, credits, cgpa, documentType, issuedDate, serial, qrToken, purpose, remarks
- 12 sample records covering all 14 certificate types (PROV, MAIN, TEST, MIGR, MOI, LRP, GRDL, PVCE, CHAR, BACK, RECO, UTRP, PTRN, OTRN)
- Mixed programs (CSE, EEE, BBA, LLB, MBA, ENG) and campuses (Permanent, Banani, Mirpur)

## Features
1. **Filters**: Program, Campus, Document Type (multi-chip), Student Search
2. **Table**: Sortable columns (Student, Program, Campus, Type, Issued), pagination (10/page)
3. **Row Actions**: Preview (opens drawer), Print (renders template → window.print)
4. **Bulk Actions**: Bulk Print (selected), Export CSV (selected or filtered)
5. **Preview**: Reuses existing CertPreviewDrawer with converted document data
6. **Print**: Reuses existing CertPrintTemplate for all 14 types

## Workflow
- Simple read-only view — no status changes, no workflows
- Focus on filtering → preview → print
- All documents already issued (have serial/QR)
- Bulk print shows alert then triggers window.print()

## Data Conversion
- `convertToPreviewRequest()` adapts DocumentRecord to CertificateRequest for drawer/print compatibility
- Maintains serial/QR from original document record

## Theme
- Consistent purple gradient (`deep-plum` → `accent-purple`) in header/buttons
- Matches existing COE pages (badges, cards, shadows)
- No green accents; uses blue/purple/gray palette

## No Duplication
- Does NOT recreate certificate logic
- Does NOT duplicate print templates
- Lightweight wrapper around existing Phase 3.2 components

## Test Steps
1. Navigate to COE → Transcripts & Certificates → Document Printing Hub
2. Verify filters work (program/campus/type/search)
3. Sort table columns (Student, Program, Campus, Type, Issued)
4. Select 3+ documents → click Bulk Print → verify alert & print dialog
5. Click Preview on any row → verify drawer opens with correct document
6. Click Print on row → verify print template renders
7. Export CSV → verify filtered or selected data downloads
8. Clear Filters → verify all 12 documents shown
9. Type filter chips toggle correctly
10. No console errors; theme consistent; no "demo" labels

## Integration Notes
- Sidebar already has "Transcripts & Certificates" group (from Phase 3.1–3.2)
- Added "Document Printing Hub" under same group
- Route wired in COEDashboard switch/case
- No new sidebar sections needed
