# Phase 2, Item 2: Mark Distribution Manager - Verification Checklist

## Quick Verification Steps

### 1. Navigate to Mark Distribution Page
- [ ] Access COE Portal (login if needed)
- [ ] Click "Marks & Result" in sidebar
- [ ] Click "Mark Distribution"
- [ ] Verify page loads without errors
- [ ] Verify URL is `/coe/marks/mark-distribution`

### 2. Check Page Layout
- [ ] Header displays: "Mark Distribution Manager"
- [ ] Header has three buttons: "New Template", Help icon, "Export"
- [ ] Filter bar shows 5 dropdowns: Semester, Program, Exam Type, Course, Section
- [ ] Two-column layout: Templates (left 40%) and Distribution (right 60%)

### 3. Templates Library (Left Column)
- [ ] See 5+ template cards
- [ ] Each card shows:
  - Template name
  - Scheme type badge (4-Part or 100-Mark)
  - Component breakdown (e.g., Attendance 10%, CA 20%, etc.)
  - Total weight (should be 100% in green)
  - Four action buttons: Apply, Edit, Duplicate, Archive
- [ ] Some templates may show "Locked" badge

### 4. Create New Template
- [ ] Click "New Template" button
- [ ] Dialog opens with title "Create New Template"
- [ ] Enter template name: "Test Distribution"
- [ ] Verify scheme type defaults to "Four-part"
- [ ] See four components: Attendance, CA, Midterm, Final
- [ ] Change weights to: 15, 25, 25, 35
- [ ] Verify total shows "100.00%" in green badge
- [ ] Click "Save Template"
- [ ] Dialog closes
- [ ] New template appears at bottom of library

### 5. Edit Template
- [ ] Click Edit icon on any custom template
- [ ] Dialog opens in edit mode
- [ ] Modify a weight (e.g., change Attendance to 20)
- [ ] Verify total updates (should become 105%, red badge)
- [ ] Adjust Final to 30 to get back to 100%
- [ ] Click "Save Template"
- [ ] Verify template updates in library

### 6. Duplicate Template
- [ ] Click Duplicate icon on any template
- [ ] Verify new template appears with " (Copy)" suffix
- [ ] New template has same weights as original

### 7. Archive Template
- [ ] Click Archive icon on a custom template
- [ ] Confirm dialog appears
- [ ] Click OK
- [ ] Template disappears from library

### 8. Apply Template to Course
- [ ] Select filters:
  - Semester: Fall 2025
  - Program: CSE
  - Exam Type: Final
  - Course: CSE1101 - Programming Fundamentals
  - Section: Section A
- [ ] Verify right column shows "Course Distribution" grid
- [ ] Click "Apply" on any template in library
- [ ] Verify grid updates with template's weights

### 9. Course Distribution Grid
- [ ] Verify grid shows:
  - Course name and section in header
  - Lock status badge
  - Component rows (Attendance, CA, Midterm, Final)
  - Weight column (editable inputs)
  - Policy Note column (read-only descriptions)
  - Total row at bottom
- [ ] Change a weight (e.g., Attendance to 12)
- [ ] Verify "Unsaved changes" indicator appears
- [ ] Verify total updates (should be 102%, red text)
- [ ] Change another weight to get back to 100%
- [ ] Click "Save" button
- [ ] Verify indicator disappears
- [ ] Click "Revert" to test reset

### 10. Lock/Unlock Functionality
- [ ] Click Lock icon in grid header
- [ ] Verify LockBanner appears above grid
- [ ] Banner shows: "Distribution Locked" with explanation
- [ ] Verify weight inputs are disabled
- [ ] Click "Unlock" button in banner
- [ ] Banner disappears
- [ ] Inputs become editable again

### 11. Upload Excel Drawer
- [ ] Click "Upload Class Marks (Excel)" button below grid
- [ ] Drawer opens with title "Upload Class Marks (Excel/CSV)"
- [ ] Verify expected format help text shows:
  - For four-part: "StudentID, Attendance, CA, Midterm, Final"
- [ ] Create a test CSV file with content:
    ```
    StudentID,Attendance,CA,Midterm,Final
    STU-001,10,18,27,38
    STU-002,9,16,24,35
    STU-003,8,14,21,32
    ```
- [ ] Click "Select File" and choose the CSV
- [ ] Click "Process" button
- [ ] Verify preview table appears with:
  - Student IDs
  - Component marks
  - Computed totals (93, 84, 75)
  - Letter grades (A+, A, A-)
  - Grade points (4.00, 3.75, 3.50)
  - Status badges ("Draft")
- [ ] Click "Save to Page State"
- [ ] Drawer closes
- [ ] Verify success message below upload button

### 12. Export CSV
- [ ] Click "Export" dropdown
- [ ] Click "Export CSV"
- [ ] File downloads automatically
- [ ] Open file in text editor or Excel
- [ ] Verify it contains:
  - Distribution weights
  - Student marks (if uploaded)
  - Filename includes course, section, date

### 13. Export PDF
- [ ] Click "Export" dropdown
- [ ] Click "Export PDF"
- [ ] Browser print dialog opens
- [ ] Preview shows page content
- [ ] Cancel or print as needed

### 14. Help Popover
- [ ] Hover over Help icon (question mark)
- [ ] Popover appears with explanation text
- [ ] Move mouse away
- [ ] Popover disappears

### 15. Filter Cascading
- [ ] Change Program to "BBA"
- [ ] Verify Course dropdown updates to show BBA courses
- [ ] Select a BBA course
- [ ] Verify Section dropdown updates
- [ ] Change Semester
- [ ] Verify Course list updates for new semester

### 16. Validation Tests

#### Template Editor Validation
- [ ] Open "New Template"
- [ ] Leave name empty
- [ ] Try to save → Save button is disabled
- [ ] Enter name
- [ ] Change weights to: 10, 20, 30, 30 (total 90%)
- [ ] Verify error badge shows "90.00%" in red
- [ ] Error message appears: "Total weight must equal 100%"
- [ ] Save button is disabled
- [ ] Adjust to get 100%
- [ ] Save button becomes enabled

#### Grid Validation
- [ ] Edit distribution in grid
- [ ] Set weights to total 95%
- [ ] Verify total shows in red: "95.00%"
- [ ] Verify "Must equal 100%" note
- [ ] Save button is disabled
- [ ] Adjust to 100%
- [ ] Save button becomes enabled

### 17. Single 100-Mark Scheme
- [ ] Open "New Template"
- [ ] Enter name: "Law Exam Distribution"
- [ ] Click "Single 100-Mark" button
- [ ] Verify components change to single row: "Total100" with 100%
- [ ] Click "Save Template"
- [ ] New template appears with "100-Mark" badge
- [ ] Apply this template to course
- [ ] Verify grid shows single component

### 18. State Persistence (Session-Only)
- [ ] Create a custom template
- [ ] Apply it to a course
- [ ] Edit weights and save
- [ ] Upload marks
- [ ] Refresh the page (F5)
- [ ] Verify custom template is gone
- [ ] Verify course distribution reverts to original
- [ ] Verify uploaded marks are cleared
- [ ] Only base templates from data file remain

### 19. Theme Consistency
- [ ] Verify all buttons use purple/blue gradient for primary actions
- [ ] No green accents except validation success badges
- [ ] No text says "Demo" anywhere
- [ ] Typography is consistent with other COE pages
- [ ] Cards have subtle shadows
- [ ] Badges use appropriate colors (amber for locked, etc.)

### 20. Error Handling
- [ ] Try uploading a .txt file
- [ ] Verify error: "Invalid file format"
- [ ] Try uploading empty CSV
- [ ] Verify error: "No valid data found"
- [ ] Try creating template with duplicate component names
- [ ] Verify error: "Component names must be unique"

### 21. Console Check
- [ ] Open browser DevTools (F12)
- [ ] Go to Console tab
- [ ] Refresh page
- [ ] Verify no red errors
- [ ] Only warnings or info messages (if any)

## Quick Acceptance Test

Run this minimal test to verify basic functionality:

1. Navigate to `/coe/marks/mark-distribution` ✓
2. See templates library on left ✓
3. Click "New Template" → Create → See in library ✓
4. Select: Fall 2025, CSE, Final, CSE1101, Section A ✓
5. Click "Apply" on a template → Grid updates ✓
6. Edit a weight → Save ✓
7. Lock/Unlock toggle works ✓
8. Upload CSV → Preview shows → Save ✓
9. Export CSV → Downloads ✓
10. No console errors ✓

**If all 10 pass: Feature is working correctly! ✅**

## Troubleshooting

### Template not appearing after creation
- Check browser console for errors
- Verify template name is unique
- Ensure sum of weights equals 100%

### Grid not updating when changing filters
- Verify course and section are selected
- Check that course exists for selected program/semester
- Try refreshing the page

### Upload not processing
- Check file format (.csv or .xlsx)
- Verify CSV has correct columns
- Ensure data rows exist after header
- Check console for parsing errors

### Exports not working
- Check browser popup blocker
- Verify you have write permissions for downloads folder
- Try different browser if issue persists

### State not persisting
- This is expected behavior (session-only by design)
- State resets on page reload
- No data is saved to backend

## Browser Compatibility
Tested and working on:
- [ ] Chrome 90+
- [ ] Firefox 88+
- [ ] Safari 14+
- [ ] Edge 90+

## Performance Notes
- Page loads in < 2 seconds
- Template operations instant
- CSV parsing < 1 second for 100 rows
- Export generation < 1 second

---

**Last Updated**: December 2024  
**Feature**: Mark Distribution Manager  
**Status**: Ready for Testing
