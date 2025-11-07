# Grading Policy Management - Implementation Notes

**Phase 2, Item 1: Complete**

## Overview

Grading Policy Management allows COE officers to view, edit, and manage the grading scale and CGPA classification bands used throughout the system.

## File Structure

```
/src/coe/
├── views/
│   └── GradingPolicyView.tsx          # Main page component
├── components/
��   ├── GradeScaleTable.tsx            # Grade scale table display
│   ├── CgpaBandsCard.tsx              # CGPA bands card
│   ├── PolicyEditorDialog.tsx         # Edit dialog with validation
│   └── PreviewCalculationDrawer.tsx   # Live calculation preview
└── data/
    ├── types.ts                        # TypeScript type definitions
    └── selectors.ts                    # Data selector helpers
```

## Route

- **Path:** Accessed via sidebar menu "Marks & Result → Grading Policy"
- **Component:** `GradingPolicyView`
- **Integration:** Added to `COEDashboard.tsx` switch statement

## Key Features Implemented

### 1. Grade Scale Table (`GradeScaleTable.tsx`)
- Displays letter grades (A+ to F) with grade points and numerical ranges
- Highlights passing grade row
- Fully responsive table design
- Purple/blue theme consistent with system

### 2. CGPA Bands Card (`CgpaBandsCard.tsx`)
- Shows CGPA classification bands (Distinction, First, Second Upper, etc.)
- Color-coded badges for each classification
- Informational note about usage in analytics

### 3. Policy Editor Dialog (`PolicyEditorDialog.tsx`)

**Grade Scale Tab:**
- Editable table with inline validation
- Add/Remove rows functionality
- Reset to defaults button
- Validations:
  - ��� No overlapping score ranges
  - ✅ min < max for all rows
  - ✅ Unique letter grades
  - ✅ Grade points between 0.00-4.00
- Live error display with specific messages

**Settings Tab:**
- Passing grade selector (dropdown)
- Tie-break rule (Round Half Up / Truncate)
- Applicable exam types (checkboxes)

### 4. Preview Calculation Drawer (`PreviewCalculationDrawer.tsx`)
- Student selection (up to 10 students)
- Live grade calculation using current policy
- Shows raw scores (Attendance/CA/Mid/Final)
- Displays computed total, letter grade, and grade point
- Highlights grade changes from default policy
- Warning banner when policy is edited

### 5. Export Functionality
- **CSV Export:** Downloads grade scale as CSV file
- **PDF Export:** Triggers browser print dialog with print-optimized styles

### 6. Filters Bar
- Semester dropdown (from `semesters.ts`)
- Program dropdown (from `programs.ts`)
- Exam Type dropdown (from `examTypes.ts`)
- Note: Filters affect preview calculations only; policy table is global

## Data Flow

1. **Initial Load:** Reads from `GLOBAL_GRADE_SCALE` and `CGPA_BANDS`
2. **Edit Policy:** Updates in-memory state only (not persistent)
3. **Preview:** Recalculates grades using current state
4. **Export:** Generates files from current state

## State Management

```typescript
const [currentPolicy, setCurrentPolicy] = useState<PolicyEditFormData>({
  gradeScale: [...GLOBAL_GRADE_SCALE],
  passingGrade: 'D',
  tieBreakRule: 'round-half-up',
  applicableExamTypes: EXAM_TYPES.map(t => t.code)
})
```

**Important:** Changes are session-only. Page refresh reverts to defaults.

## Validation Rules

All validation happens client-side in `PolicyEditorDialog.tsx`:

1. **Range Validation:** Each row's minMarks must be < maxMarks
2. **Overlap Detection:** No two rows can have overlapping score ranges
3. **Unique Letters:** Each letter grade must be unique
4. **Grade Point Bounds:** Must be between 0.00 and 4.00
5. **Decimal Precision:** Grade points stored to 2 decimal places

## Grade Calculation Logic

```typescript
const calculateGrade = (total: number, gradeScale: GradeScale[]) => {
  const grade = gradeScale.find(g => total >= g.minMarks && total <= g.maxMarks)
  return {
    letter: grade?.letterGrade || 'F',
    point: grade?.gradePoint || 0.0
  }
}
```

## Theme Compliance

✅ Purple/blue gradient (`from-deep-plum to-accent-purple`)  
✅ No green accents  
✅ No "demo" labels  
✅ Consistent with existing COE pages  

## Dependencies

- React 18+ with hooks
- shadcn/ui components (Dialog, Card, Button, Badge)
- lucide-react icons
- Existing data from Phase 1 (`/src/coe/data/`)

## Testing Checklist

✅ Page loads without console errors  
✅ Filters render correctly  
✅ Grade scale table displays all rows  
✅ CGPA bands card shows all classifications  
✅ Edit dialog opens and validates input  
✅ Preview drawer calculates grades correctly  
✅ CSV export downloads file  
✅ PDF export opens print dialog  
✅ No modifications to existing routes  
✅ Theme matches system-wide purple/blue  

## Known Limitations

1. **Persistence:** Changes are not saved to database/localStorage
2. **RBAC:** Uses existing COE auth (no additional restrictions)
3. **Multi-Program Policies:** Currently shows global policy only (no per-program overrides in UI)

## Future Enhancements (Not in Scope)

- Backend API integration for persistent saves
- Per-program policy overrides UI
- Audit trail for policy changes
- Email notifications on policy updates
- Bulk import/export from Excel

## Integration Points

- **Sidebar:** Updated in Phase 1 with "Grading Policy" menu item
- **Dashboard:** Added case in `renderContent()` switch
- **Data:** Reuses existing `/src/coe/data/` files
- **Components:** New components in `/src/coe/components/`

---

**Status:** ✅ Complete and ready for approval  
**Next Item:** Mark Distribution Manager (Phase 2, Item 2)  
**Awaiting:** User approval to proceed
