# Reports Factory — Dev Notes

**Route**: `/coe/reports/factory`

## Overview

Centralized reporting system with 20 institutional reports across 6 categories.

## Report Catalog

### Groups (6)
1. **Enrollment** (3): REG_STU_LIST, ADM_LIST, DROPOUT_LIST
2. **Progress** (3): COMPLETED_UGC, REQ_CRED_DONE, CBE_GRADS
3. **Grades** (5): GRADE_SHEET_SEC, SEM_GPA_LIST, CGPA_RANGE, CGPA_BELOW_2, PERF_REPORT
4. **Honors** (3): SCHOLARSHIP_LIST, GOLD_ELIGIBLE, TOP_RANKERS
5. **Publication** (3): UNPUB_SECTIONS, RESULT_PUB_LOG, BANBAIS_UGC_FMT
6. **Documents** (3): DOC_ISSUE_COUNTS, DOC_SUMMARY, CONVOCATION_COUNTS

### Report Structure
Each report in `reportsCatalog.ts` defines:
- **id**: Unique identifier
- **code**: Official report code (e.g., REG_STU_LIST)
- **title**: Display name
- **description**: Brief purpose
- **group**: Category (Enrollment/Progress/Grades/Honors/Publication/Documents)
- **filters**: Dynamic filter controls (semester, program, campus, dateRange, status, cgpaRange, section, period)
- **columns**: Table column headers
- **sampleRowsProvider**: Function returning seed data (10–50 rows per report)

## Components

### ReportPicker
- Left panel grouped tree
- 6 collapsible groups
- Highlights selected report (purple-50 bg)
- Shows count per group

### ReportFiltersPanel
- Dynamically renders filters based on `report.filters`
- 8 filter types: semester, program, campus, dateRange, status, cgpaRange, section, period
- Required fields marked with red asterisk
- Reset button clears all filters

### ReportPreviewTable
- Sortable columns (click header to toggle asc/desc)
- Pagination: 25/50/100 rows per page
- Shows range indicator (e.g., "Showing 1 to 25 of 120")
- Empty state for no data

### ReportSummaryCards
- Optional KPI cards above table
- Auto-calculated: Total Records, Average CGPA, Total Credits
- Color-coded: purple/indigo/violet

## Utilities (`reports.ts`)

- `buildReportRows`: Apply filters to sample data
- `buildCSV`: Convert rows to CSV format
- `downloadCSV`: Trigger client-side download
- `printReport`: Open print-friendly window
- `calculateSummaryStats`: Generate KPI cards
- `sortRows`: Sort by column (asc/desc)
- `paginateRows`: Slice rows by page/size

## UX Flow

1. Select report from left catalog tree
2. Dynamic filters appear based on report requirements
3. Preview table renders with sample data
4. Sort columns, paginate, view summary cards
5. Export → CSV or Print

## Data Sources

Reports reuse existing Phase 1–4 data:
- Enrollment: admissionActions, student records
- Progress: CBE data, credit completion
- Grades: result tables, CGPA calculations
- Honors: scholarships, rankings
- Publication: result logs, UGC formats
- Documents: certificates, verification, convocation

## Export Formats

- **CSV**: All columns, all filtered rows, timestamped filename
- **Print**: Formatted HTML with report title, description, table, auto-print on load

## Theme Consistency

- Purple/indigo badges and buttons (no green)
- Consistent card shadows and spacing
- Matches Grading Policy/Block Manager styling
