# Result Correction Manager - Verification Checklist

## Quick Verification Steps

### 1. Navigate to Result Correction Page
- [ ] Access COE Portal
- [ ] Click "Marks & Result" in sidebar
- [ ] Click "Result Correction"
- [ ] Verify page loads without errors
- [ ] Verify URL is `/coe/marks/result-corrections`

### 2. Check Page Layout
- [ ] Header displays: "Result Correction Manager"
- [ ] Header has three elements: "New Correction", Help icon, "Export"
- [ ] Filter bar shows dropdowns and badges
- [ ] Queue table displays with 4 correction rows
- [ ] No console errors

### 3. Test Filters

#### Basic Filters
- [ ] Change Semester → table updates
- [ ] Change Program to "CSE" → table filters
- [ ] Select Course (if available) → table filters
- [ ] Select Section (if available) → table filters

#### Status Multi-select
- [ ] Click "Submitted" badge → badge highlights, table shows only Submitted
- [ ] Click "Under Review" badge → adds to filter
- [ ] Click "Submitted" again → removes from filter
- [ ] Click "Approved" → filters to Approved only

#### Type Multi-select
- [ ] Click "Script Error" badge → filters by type
- [ ] Click "Component Update" → adds to filter
- [ ] Multiple types can be selected

#### Search
- [ ] Type "STU-2023" → filters to matching student IDs
- [ ] Type student name → filters to matching names
- [ ] Type "RC-2025" → filters to matching ref numbers
- [ ] Clear search → all rows return

### 4. Queue Table Features

#### Sorting
- [ ] Click "Ref No" column header → sorts by ref no
- [ ] Click again → reverses sort direction
- [ ] Click "Student" → sorts by student name
- [ ] Click "Status" → sorts by status
- [ ] Click "Submitted" → sorts by date

#### Selection
- [ ] Click checkbox on first row → row selected
- [ ] Click checkbox again → row unselected
- [ ] Click header checkbox → all rows selected
- [ ] Click header checkbox again → all rows unselected

#### Display
- [ ] Ref No shows (e.g., RC-2025-001)
- [ ] Student shows ID and Name
- [ ] Program•Course•Section combined properly
- [ ] Type badge displays correct type
- [ ] Requested Change shows summary
- [ ] Status badge shows correct color:
  - Submitted: Blue
  - Under Review: Amber
  - Approved: Green
  - Rejected: Red
  - Applied: Purple

### 5. Detail Drawer

#### Open Drawer
- [ ] Click "View" button on any row
- [ ] Drawer opens from right side
- [ ] Header shows Ref No and student info
- [ ] Status badge displays correctly
- [ ] Four tabs visible: Summary, Marks, Audit, Actions

#### Summary Tab
- [ ] Program displays
- [ ] Section displays
- [ ] Exam Type displays
- [ ] Correction Type badge displays
- [ ] Requested By name shows
- [ ] Requested On date shows
- [ ] Reason text displays
- [ ] If reviewed: Review info shows

#### Marks Before/After Tab
- [ ] Table shows component rows
- [ ] Original column has values
- [ ] Requested column has values
- [ ] Difference column shows badges:
  - Green badge for increases
  - Red badge for decreases
  - No badge if no change
- [ ] Total row shows computed totals
- [ ] Letter Grade row shows grades
- [ ] Grade Point row shows points

#### Audit Timeline Tab
- [ ] Timeline displays vertically
- [ ] Each event has icon
- [ ] Icons are color-coded:
  - Blue for Submitted
  - Amber for Under Review
  - Green for Approved
  - Red for Rejected
  - Purple for Applied
- [ ] Each event shows:
  - Action name
  - Who performed it
  - Date/time
  - Notes

#### Actions Tab
- [ ] Action notes textarea visible
- [ ] Placeholder text shown
- [ ] Buttons shown based on status:
  - For Submitted: Approve, Reject, Mark Under Review
  - For Under Review: Approve, Reject
  - For Approved: Apply Changes
  - For Rejected: No action buttons
  - For Applied: No action buttons

### 6. Actions Workflow

#### Approve Correction
- [ ] Open drawer for "Submitted" correction
- [ ] Go to Actions tab
- [ ] Enter notes: "Verified, approved"
- [ ] Click "Approve" button
- [ ] Drawer closes
- [ ] Correction status changes to "Approved" (green badge)
- [ ] Open drawer again
- [ ] Check Audit tab → new "Approved" event appears

#### Reject Correction
- [ ] Open drawer for "Submitted" correction
- [ ] Go to Actions tab
- [ ] Enter notes: "Insufficient evidence"
- [ ] Click "Reject" button
- [ ] Drawer closes
- [ ] Status changes to "Rejected" (red badge)
- [ ] Audit trail updated

#### Mark Under Review
- [ ] Open drawer for "Submitted" correction
- [ ] Go to Actions tab
- [ ] Enter notes: "Needs further verification"
- [ ] Click "Mark Under Review"
- [ ] Status changes to "Under Review" (amber badge)
- [ ] Audit trail updated

#### Apply Changes
- [ ] First approve a correction (see above)
- [ ] Open drawer for "Approved" correction
- [ ] Go to Actions tab
- [ ] Enter notes: "Marks updated"
- [ ] Click "Apply Changes"
- [ ] Status changes to "Applied" (purple badge)
- [ ] Audit trail shows "Applied" event

#### Required Notes Validation
- [ ] Open drawer
- [ ] Go to Actions tab
- [ ] Leave notes empty
- [ ] Click any action button
- [ ] Alert appears: "Action notes are required"
- [ ] Action not performed

### 7. Bulk Actions

#### Select Multiple Rows
- [ ] Select 2-3 corrections
- [ ] Bulk actions bar appears above table
- [ ] Bar shows purple gradient background
- [ ] Count badge shows number selected (e.g., "2 selected")
- [ ] 5 buttons visible: Approve, Reject, Mark Under Review, Apply Changes, Clear

#### Bulk Approve
- [ ] Select 2 "Submitted" corrections
- [ ] Click "Approve" in bulk bar
- [ ] Prompt appears asking for notes
- [ ] Enter notes: "Batch approved"
- [ ] Click OK
- [ ] Both corrections change to "Approved"
- [ ] Selection clears
- [ ] Bar disappears

#### Bulk Reject
- [ ] Select corrections
- [ ] Click "Reject"
- [ ] Enter notes in prompt
- [ ] All selected change to "Rejected"

#### Bulk Under Review
- [ ] Select corrections
- [ ] Click "Mark Under Review"
- [ ] Enter notes
- [ ] All change to "Under Review"

#### Clear Selection
- [ ] Select multiple rows
- [ ] Click "Clear" button in bar
- [ ] All selections cleared
- [ ] Bar disappears

### 8. Create New Correction

#### Open Dialog
- [ ] Click "New Correction" button in header
- [ ] Dialog opens with title "Create New Correction Request"
- [ ] All fields visible

#### Student Search
- [ ] Type "STU" in student search
- [ ] Dropdown appears with matching students
- [ ] Shows Student Name, ID, Program
- [ ] Click a student to select
- [ ] Student fills in blue box
- [ ] Program auto-fills in Program dropdown

#### Course/Section Selection
- [ ] Semester dropdown has values
- [ ] Program is auto-filled (can change)
- [ ] Course dropdown cascades by program
- [ ] Section dropdown cascades by course
- [ ] Select CSE1101, Section A

#### Load Existing Marks
- [ ] After selecting student/course/section
- [ ] Component editor table updates
- [ ] Original column shows student's current marks
- [ ] Requested column pre-fills with same values

#### Edit Component Marks
- [ ] Change Attendance from 7 to 8
- [ ] Change CA from 14 to 16
- [ ] Change Midterm from 20 to 24
- [ ] Change Final from 28 to 32
- [ ] Verify Requested column updates
- [ ] Verify Total computes live
- [ ] Verify Letter Grade updates (e.g., B → B+)
- [ ] Verify Grade Point updates

#### Correction Type
- [ ] Select "Script Error" from dropdown
- [ ] Select "Component Update"
- [ ] Select "Grade Override"
- [ ] Grade Override section appears
- [ ] Enable checkbox
- [ ] Override fields appear

#### Grade Override
- [ ] Check "Enable Grade Override"
- [ ] Enter override letter: "A"
- [ ] Enter override GP: 3.75
- [ ] Verify grade shows override values

#### Reason
- [ ] Type short reason (5 chars)
- [ ] Red validation message appears
- [ ] Type full reason (20 chars)
- [ ] Validation message disappears

#### Attachments
- [ ] Enter file name: "script_page_3.pdf"
- [ ] Click "+" button
- [ ] Badge appears with file name
- [ ] Click "X" on badge
- [ ] Badge removed
- [ ] Add 2-3 file names

#### Submit
- [ ] Ensure all fields filled
- [ ] Click "Submit Request"
- [ ] Dialog closes
- [ ] New correction appears in queue table
- [ ] Status is "Submitted"
- [ ] Ref No generated (e.g., RC-2025-005)

#### Validation Tests
- [ ] Leave student empty → Submit button disabled
- [ ] Leave course empty → Submit button disabled
- [ ] Leave section empty → Submit button disabled
- [ ] Reason <10 chars → Submit button disabled
- [ ] Fill all → Submit button enabled

### 9. Export Functions

#### CSV Export
- [ ] Click "Export" dropdown
- [ ] Click "Export CSV"
- [ ] File downloads
- [ ] Open file in text editor or Excel
- [ ] Verify columns:
  - Ref No, Student ID, Student Name
  - Program, Course, Section
  - Exam Type, Type, Status
  - Submitted On, Last Updated
  - Requested Summary
- [ ] Verify all filtered rows included
- [ ] Filename includes date

#### PDF Export
- [ ] Click "Export" dropdown
- [ ] Click "Export PDF"
- [ ] Browser print dialog opens
- [ ] Preview shows page content
- [ ] Can cancel or print

### 10. Help Popover
- [ ] Hover over Help icon (?)
- [ ] Popover appears
- [ ] Text explains correction flow
- [ ] Move mouse away
- [ ] Popover disappears

### 11. Edge Cases

#### Empty Queue
- [ ] Filter to show no results (e.g., Status "Draft" only)
- [ ] Table shows "No correction requests found" message

#### No Student in Search
- [ ] Search for "XXXXXXX"
- [ ] No dropdown appears
- [ ] No error shown

#### Invalid Status for Action
- [ ] Open "Applied" correction
- [ ] Go to Actions tab
- [ ] No action buttons shown
- [ ] Message: "No actions available for current status: Applied"

#### Attempt to Apply Non-Approved
- [ ] Select a "Submitted" correction
- [ ] Bulk select it
- [ ] Try to Apply Changes
- [ ] Should not work or show alert

### 12. State Persistence Test
- [ ] Create a new correction
- [ ] Approve a correction
- [ ] Apply a correction
- [ ] Verify all changes visible
- [ ] Refresh page (F5)
- [ ] All custom changes reset
- [ ] Queue returns to original 4 corrections from data
- [ ] Only base data remains

### 13. Theme Check
- [ ] Verify purple/blue gradient on:
  - New Correction button
  - Bulk actions bar
  - Apply Changes button (in drawer)
  - Selected status/type badges
- [ ] No green accents except:
  - Approved badge (green-100 background)
  - Positive diff badges in Marks tab
- [ ] No text says "Demo" anywhere
- [ ] All badges use appropriate colors
- [ ] Typography consistent

### 14. Console Check
- [ ] Open browser DevTools (F12)
- [ ] Go to Console tab
- [ ] Perform all actions above
- [ ] Verify no red errors
- [ ] Only warnings or info (if any)

## Quick Acceptance Test

Run this minimal test (takes ~5 min):

1. Navigate to `/coe/marks/result-corrections` ✓
2. See queue table with 4 corrections ✓
3. Filter by Status "Submitted" → 1 row ✓
4. Click "View" → drawer opens ✓
5. Go to Actions tab → enter notes → Approve ✓
6. Status changes to "Approved" (green) ✓
7. Open again → Apply Changes ✓
8. Status changes to "Applied" (purple) ✓
9. Click "New Correction" ✓
10. Search student → select → edit marks → submit ✓
11. New correction appears in queue ✓
12. Select 2 rows → bulk bar appears ✓
13. Bulk approve → both change status ✓
14. Export CSV → downloads ✓
15. No console errors ✓

**If all 15 pass: Feature is working correctly! ✅**

## Troubleshooting

### Drawer not opening
- Check console for errors
- Verify correction ID exists in data
- Try refreshing page

### Actions not working
- Verify action notes are entered
- Check current status (only certain statuses allow actions)
- Approved corrections can only Apply Changes

### New correction not appearing
- Check all required fields filled
- Verify reason is at least 10 characters
- Check student/course/section selected

### Bulk actions not visible
- Ensure rows are selected via checkbox
- Bar only appears when 1+ rows selected

### Calculations not updating
- Check browser console for errors
- Verify grading policy data loaded
- Refresh page and try again

## Browser Compatibility
Tested on:
- [ ] Chrome 90+
- [ ] Firefox 88+
- [ ] Safari 14+
- [ ] Edge 90+

## Performance
- Page loads in < 2 seconds
- Drawer opens instantly
- Create dialog responds immediately
- Filter operations < 500ms
- Export generation < 1 second

---

**Last Updated**: December 2024  
**Feature**: Result Correction Manager  
**Status**: Ready for Testing
