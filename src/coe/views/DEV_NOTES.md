# Block Manager - Dev Notes

## Route
`/coe/marks/blocks` → Sidebar: "Marks & Result" → "Block/Unblock (Student-wise)"

## Components
- **BlockManagerView.tsx** (469 lines) - Main view with filters, table, dialogs
- **BlockListTable.tsx** (255 lines) - Paginated sortable table with 11 columns
- **BlockAuditDrawer.tsx** (286 lines) - Right drawer with Summary/Audit/Actions tabs
- **BlockCreateDialog.tsx** (280 lines) - Student picker, scope/type/actions selectors
- **AutoBlockBanner.tsx** (47 lines) - Read-only display of auto-block rules
- **BlockBulkActionsBar.tsx** (58 lines) - Bulk Clear/Mark/Export actions

## Data Sources
- `blockSettings.ts` - 5 blocks (3 Active, 2 Cleared), BLOCK_SETTINGS config
- `studentMarks.ts` - Student data for search/picker
- `semesters.ts`, `programs.ts` - Filters

## Block Structure
```typescript
{
  id, studentId, studentName, programCode, semesterId,
  reason: 'Finance Dues' | 'TER Not Submitted' | 'Disciplinary Action' | 'Custom',
  scope: 'Course-only' | 'Term-wide' | 'Program-wide',
  actionsHeld: ['Results', 'Transcript', 'Certificates', 'Admit'],
  source: 'Auto' | 'Manual',
  status: 'Active' | 'Cleared',
  createdOn, clearedOn, clearedBy,
  auditLog: [{ action, by, date, remarks }]
}
```

## Key Features
1. **AutoBlockBanner** - Shows 3 toggles (Finance/TER/Disciplinary) from BLOCK_SETTINGS
2. **Filters** - Semester, Program, Block Type, Status, Search (ID/Name)
3. **Table** - Pagination (10/page), sortable, selection, action icons (Results/Transcript/etc)
4. **Drawer** - Summary card, Reason/Notes, Actions Held chips, Audit Timeline, Clear/Edit buttons
5. **Create Dialog** - Student autocomplete, Scope/Type/Actions multi-select, Date range, Notes (min 10 chars)
6. **Bulk Actions** - Clear/Mark Disciplinary/Finance/TER/Export (requires confirmation notes)

## Behaviors
- **Clear Block**: Requires notes, sets status=Cleared, updates clearedOn/clearedBy, appends audit
- **Edit Block**: Manual only (Auto blocks show tooltip), updates scope/actions/notes, adds audit event
- **Create Block**: Source=Manual, status=Active, generates audit entry
- **Auto vs Manual**: Auto rows not editable (Edit button disabled with tooltip)
- **State**: In-memory only, resets on page reload
- **Exports**: CSV (filtered rows), PDF (print dialog on drawer)

## Theme
- Primary: Purple/blue gradient buttons
- Status: Active=purple, Cleared=gray
- Type: Finance/TER=amber, Disciplinary=red, Custom=blue
- No green accents, no "demo" text

## Test Steps
1. Navigate `/coe/marks/blocks` → See 5 blocks (3 Active, 2 Cleared)
2. Filter: Status "Active" → 3 rows, Status "Cleared" → 2 rows
3. Click "View" → Drawer opens with Summary/Audit tabs
4. Click "Clear Block" → Enter notes → Status becomes Cleared
5. Click "New Block" → Search student → Select scope/type/actions → Create
6. Select 2 Active rows → Bulk "Clear Blocks" → Both cleared
7. Try Edit on Auto block → Tooltip: "Auto-generated blocks cannot be edited"
8. Export CSV → Downloads with all filtered rows
9. No console errors, theme matches purple/blue

## Validation
- Create: Student required, Actions≥1, Notes≥10 chars
- Clear: Notes required
- Edit: Manual blocks only
- Bulk: Confirmation notes required

## Files Modified
- `src/pages/COEDashboard.tsx` - Added BlockManagerView import and route case
- Sidebar already has "Block/Unblock (Student-wise)" menu item
