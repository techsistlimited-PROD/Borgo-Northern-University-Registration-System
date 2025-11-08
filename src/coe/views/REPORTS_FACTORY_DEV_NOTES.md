# Reports Factory — Developer Notes

**Route**: `/coe/reports/factory`

## Overview

Comprehensive reporting system with 23 institutional reports across 7 categories.
Rebuilt from scratch with large previews (20-40 rows), full-width tables (min 1100px), and multi-section layouts.

## Report Catalog

### Categories (7)
1. **Enrollment & Admission** (3): Registered Students, Admission List, Dropout List
2. **Academic Progress** (4): Credit Completion, Semester GPA, CGPA Range, Students Below 2.00
3. **Graduation & Completion** (4): UGC Format, CBE Grads, Convocation Candidates, Top Rankers
4. **Results & Performance** (4): Grade Sheets, Performance Reports, Unpublished Sections
5. **Scholarships & Honors** (3): Scholarship List, Gold Medal, Merit Scholars
6. **Documents & Operations** (3): Document Issue Summary, Request Tracking, Daily Processing
7. **Multi-format Reports** (2): BANBAIS Multi-format, UGC Metrics

## Architecture

### Data Layer (`src/coe/data/reportsData.ts`)
- 23 report definitions with comprehensive metadata
- Each report includes: id, code, title, description, category, filters, columns
- `getData()` function returns 20-40 realistic sample rows
- Optional `summaryCards` for KPI metrics (Total Records, Avg CGPA, etc.)
- Dynamic data generation using helper functions

### Utilities (`src/coe/utils/reportsFactory.ts`)
- `applyFilters()` - Client-side filtering by program, status, CGPA range
- `exportToCSV()` - Download filtered data as CSV
- `printReport()` - Print-friendly layout with university header, metadata, table
- `sortData()` - Column sorting (asc/desc)
- `paginateData()` - Pagination logic (25/50/100 rows per page)

### Components
1. **ReportCatalogTree** - Left sidebar with 7 collapsible categories
2. **ReportFiltersPanel** - Dynamic filters (semester, program, campus, status, CGPA range, dates)
3. **ReportPreview** - Large table (min 1100px) with sorting, pagination
4. **ReportSummaryCards** - KPI cards (purple/indigo theme)

### Main View (`ReportsFactoryView.tsx`)
- 4-column layout: Catalog (1 col) + Content (3 cols)
- Report header with title, code badge, description, metadata
- Dynamic filters panel (only shown if report has filters)
- Summary KPI cards (auto-calculated from data)
- Full-width preview table with 20-40 rows
- Export dropdown (CSV + Print)

## Features

### Large Previews
- Minimum table width: 1100px (enforced via inline style)
- 20-40 rows per report (realistic sample data)
- Horizontal scroll for wide tables
- Sortable columns (click header to toggle)
- Pagination: 25/50/100 rows per page

### Multi-section Report Layout
- **Header**: Report title, code, description
- **Metadata**: Category, timestamp, record count
- **Filters**: Dynamic based on report requirements
- **Summary Cards**: Auto-calculated KPIs
- **Table**: Full data preview with controls

### Export Formats
- **CSV**: All columns, filtered data, timestamped filename
- **Print**: Formatted HTML with university header, metadata, table, footer

### Theme
- Purple/indigo badges and buttons (no green)
- Consistent with COE module styling
- Code badges use purple-100 background
- Category badges use purple theme

## Sample Data

Reports use dynamic generation:
- `generateStudentData(count)` creates realistic student records
- Programs: CSE, BBA, EEE, LLB, MBA, English, Physics, Mathematics
- CGPA ranges: 2.5-4.0
- Mix of Active/Inactive/Graduated statuses
- 30-42 rows per major report type

## Future Extensions

- API integration: Replace `getData()` with async fetch calls
- Advanced filters: Date pickers, multi-select, autocomplete
- Chart visualizations: Add charts to summary cards
- Scheduled reports: Email delivery of reports
- Custom report builder: User-defined columns/filters
