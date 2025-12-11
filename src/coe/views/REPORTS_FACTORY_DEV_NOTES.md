# Reports Factory — Developer Notes

**Route**: `/coe/reports/factory`

## Overview
Comprehensive reporting system with 23 reports across 7 categories. Rebuilt with large previews (20-40 rows), full-width tables (min 1100px), multi-section layouts.

## Report Categories (23 total)
1. **Enrollment & Admission** (3): Registered Students, Admission List, Dropout List
2. **Academic Progress** (4): Credit Completion, Semester GPA, CGPA Range, Below 2.00
3. **Graduation & Completion** (4): UGC Format, CBE Grads, Convocation, Top Rankers
4. **Results & Performance** (4): Grade Sheets, Performance, Unpublished Sections
5. **Scholarships & Honors** (3): Scholarship List, Gold Medal, Merit Scholars
6. **Documents & Operations** (3): Issue Summary, Request Tracking, Daily Processing
7. **Multi-format Reports** (2): BANBAIS Multi-format, UGC Metrics

## Architecture

### Data (`reportsData.ts`)
- 23 report definitions: id, code, title, description, category, filters, columns
- `getData()` returns 20-40 realistic rows per report
- Optional `summaryCards` for KPI metrics
- Dynamic generation via `generateStudentData(count)`

### Utils (`reportsFactory.ts`)
- `applyFilters()` - Client-side filtering
- `exportToCSV()` - Download as CSV
- `printReport()` - Print layout with header/metadata/table
- `sortData()`, `paginateData()` - Table controls

### Components
- **ReportCatalogTree** - Left sidebar, 7 categories, collapsible
- **ReportFiltersPanel** - Dynamic filters (semester/program/campus/status/CGPA/dates)
- **ReportPreview** - Large table (min 1100px), sorting, pagination (25/50/100)
- **ReportSummaryCards** - KPI cards (purple/indigo theme)

### View (`ReportsFactoryView.tsx`)
- Layout: Catalog (1 col) + Content (3 cols)
- Header: title, code badge, description, metadata
- Filters panel (conditional)
- Summary cards (auto-calculated)
- Preview table (20-40 rows visible)
- Export: CSV + Print

## Features
- **Large Previews**: 1100px min width, 20-40 rows, horizontal scroll
- **Sorting**: Click column headers to toggle asc/desc
- **Pagination**: 25/50/100 rows per page
- **Filters**: Dynamic based on report type
- **Export**: CSV (all filtered data) + Print (formatted HTML)
- **Theme**: Purple/indigo (no green), code badges purple-100

## Sample Data
- Programs: CSE, BBA, EEE, LLB, MBA, English, Physics, Mathematics
- CGPA: 2.5-4.0 range
- Statuses: Active, Inactive, Graduated, Dropout
- 30-42 rows per major report

## Print Layout
- University header (purple border)
- Report title, code, description
- Metadata row (generated date, record count, category)
- Full table with borders
- Footer with description

## Future Extensions
- API integration (replace `getData()` with fetch)
- Advanced filters (multi-select, autocomplete)
- Chart visualizations
- Scheduled email delivery
- Custom report builder
