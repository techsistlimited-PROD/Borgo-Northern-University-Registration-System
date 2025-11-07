# Transcript Manager - Dev Notes

## Route
`/coe/docs/transcripts` → Sidebar: "Transcripts & Certificates" → "Transcripts"
Dashboard case: `'Transcripts'`

## Files Created
- `TranscriptManagerView.tsx` (451 lines) - Main view with queue and preview

## Files Modified
- `COEDashboard.tsx` - Added import + route case

## Data Source
- `transcripts.ts` (3 student records: Nishat Sultana, Farzana Kabir, Tahmina Akter)
- Each transcript has: studentId, programCode, semesters[], totalCredits, finalCGPA, classification
- Semester structure: courses[], GPA, CGPA

## Features

### Transcript Queue Table
- Columns: Student ID, Name, Program, Credits Completed, CGPA, Status
- Status badges: Requested (gray), Processing (amber), Ready (green), Collected (blue)
- Filter by: Program, Student Search (ID/Name)
- Initial data: 3 requests (Ready, Processing, Collected)

### Actions per Row
- **Preview** (Eye icon) - Opens preview drawer for all rows
- **Mark Ready** (CheckCircle) - Requested/Processing → Ready
- **Mark Collected** (Package) - Ready → Collected
- **Download PDF** (FileText, purple) - Opens print dialog (Ready status only)

### Preview Drawer
- Header: "Northern University Bangladesh - Official Academic Transcript"
- Student info: ID, Name, Program, Batch, Enrollment Date, Status
- Semester cards (for each semester):
  - Semester name + Credits/GPA/CGPA summary
  - Course table: Code, Name, Credit, Grade (badge), GP
- Footer summary: Total credits required/earned, Final CGPA (large), Classification
- Print/Download PDF button (calls window.print)

### Export
- **CSV Export**: Student ID, Name, Program, Credits, CGPA, Status, Dates
- Filename: `transcripts-queue-{date}.csv`

### Status Workflow
Requested → Processing → Ready → Collected
(Mark Ready works for Requested or Processing)

## Integration
- Uses `TRANSCRIPTS` from `transcripts.ts`
- Queue state managed in-memory (session-only)
- Preview reads full transcript data for selected student

## Validation
- No validation needed (actions are straightforward state updates)

## Theme
- Purple/indigo gradient for Download PDF button
- Status badges use theme colors (gray/amber/green/blue)
- No "demo" text

## Test
1. Navigate to Transcripts → See 3 requests in queue
2. Filter by Program "BBA" → See Farzana Kabir only
3. Search "Nishat" → See Nishat Sultana only
4. Click Preview on any row → Drawer opens with semester-wise courses
5. See GPA/CGPA for each semester, total credits, classification
6. Click "Mark Ready" on Processing request → Status becomes Ready
7. Click Download PDF on Ready request → Print dialog opens
8. Click "Mark Collected" on Ready request → Status becomes Collected
9. Export CSV → Downloads with all requests

## State
- Session-only: Request status updates persist during session
- Page reload: Resets to initial 3 requests (Ready, Processing, Collected)

## Print Styling
- Preview drawer includes `print:` classes for PDF generation
- Print dialog triggered via window.print()
