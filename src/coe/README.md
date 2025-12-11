# COE Portal Module

Controller of Examinations portal for managing exam operations, results, certificates, and compliance.

## Structure

```
/src/coe/
├── data/           # Static dummy data files
├── views/          # Page components
├── components/     # Shared UI components
└── README.md
```

## Data Files (Phase 1 - ✅ Complete)

All dummy data files created with rich, realistic data:

- ✅ `semesters.ts` - Semester definitions (Spring/Summer/Fall 2023-2025)
- ✅ `programs.ts` - Academic programs (CSE, EEE, BBA, LLB, etc.)
- ✅ `examTypes.ts` - Exam type definitions (Midterm, Final, Special, etc.)
- ✅ `gradePolicy.ts` - Grading scales and CGPA bands
- ✅ `markDistributionTemplates.ts` - Mark distribution schemes
- ✅ `studentMarks.ts` - Student mark records
- ✅ `resultCorrectionQueue.ts` - Result correction requests
- ✅ `blockSettings.ts` - Result block/unblock records
- ✅ `transcripts.ts` - Student transcript data
- ✅ `certificates.ts` - Certificate request queue
- ✅ `cbeRecords.ts` - CBE meeting and candidate records
- ✅ `verificationProfiles.ts` - Student verification data
- ✅ `reportSamples.ts` - Report metadata catalog

## Sidebar Menu Structure (Phase 1 - ✅ Complete)

### Exam Governance
- Calendar & Policies
- Sessions & Timetable
- Invigilation Duty

### Admit & Seating
- Eligibility Check
- Seat Plan
- Admit Cards

### Exam Conduct
- Attendance & Incidents

### Marks & Result
- Grading Policy ✅
- Mark Distribution ✅
- Excel Upload (Marks) ✅ (Integrated in Mark Distribution)
- Result Correction ✅
- Publish Results ✅
- Block/Unblock (Student-wise) ⏳
- Block/Unblock Settings ⏳
- Tabulation Board ✅

### Transcripts & Certificates
- Transcript Manager ⏳
- Certificates Manager ⏳
- Document Printing ⏳

### Academic Actions
- Student Updates ⏳
- Admission Cancel / Re-Admission ⏳
- Credit Transfer ⏳
- Course Exemption ⏳
- CBE (Board) ⏳

### Verification
- Student/Degree Verification ⏳

### Reports
- Compliance & UGC/BANBAIS ✅
- Analytics ✅

**Legend:**
- ✅ Implemented
- ⏳ Pending (Phase 2+)

## Phase 1 Foundation Status: ✅ COMPLETE

All Phase 1 deliverables completed:
- [x] Created `/src/coe/data/` with 13 dummy data files
- [x] Created `/src/coe/views/` folder structure
- [x] Created `/src/coe/components/` folder structure
- [x] Updated COE sidebar with new menu groupings
- [x] Preserved all existing working routes

## Phase 2 - Marks & Result (In Progress)

### Completed Items ✅
1. **Grading Policy Management** ✅
   - Route: `/coe/marks/grading-policy`
   - Components: GradeScaleTable, CgpaBandsCard, PolicyEditorDialog, PreviewCalculationDrawer
   - Features: View/edit grade scale, CGPA bands, preview calculations, export
   - See: `src/coe/PHASE2_ITEM1_COMPLETE.md`

2. **Mark Distribution Manager** ✅
   - Route: `/coe/marks/mark-distribution`
   - Components: DistributionTemplateCard, DistributionEditorDialog, CourseDistributionGrid, LockBanner, UploadExcelDrawer
   - Features: Template library, weight distribution, lock/unlock, Excel upload with grade calculation, export
   - Note: Excel Marks Upload is integrated within this feature
   - See: `src/coe/PHASE2_ITEM2_COMPLETE.md`

3. **Result Correction Manager** ✅
   - Route: `/coe/marks/result-corrections`
   - Components: CorrectionQueueTable, CorrectionDetailDrawer, CorrectionCreateDialog, CorrectionAuditTimeline, CorrectionBulkActionsBar
   - Features: Queue management, review workflow, audit trails, bulk actions, grade recalculation, export
   - See: `src/coe/PHASE2_ITEM3_COMPLETE.md`

### Pending Items ⏳
4. Student Result Block/Unblock
5. Block/Unblock Settings

**Awaiting approval to proceed with Phase 2, Item 4: Student Result Block/Unblock Manager.**
