# Block/Unblock Settings - Dev Notes

## Route
`/coe/marks/blocks-settings` → Sidebar: "Marks & Result" → "Block/Unblock Settings"
Dashboard case: `'Block/Unblock Settings'`

## Files Created
- `src/coe/views/BlockSettingsView.tsx` (712 lines) - Main view with 3 tabs
- `src/coe/data/settingsStore.ts` (132 lines) - In-memory settings store

## Files Modified
- `src/pages/COEDashboard.tsx` - Added import + route case
- `src/coe/views/BlockManagerView.tsx` - Integration with settingsStore

## Structure

### In-Memory Store (`settingsStore.ts`)
```typescript
BlockSettingsStore {
  autoBlockRules: AutoBlockRule[]      // 3 rules: finance-dues, ter-not-submitted, disciplinary-hold
  manualReasons: ManualBlockReason[]   // 4 preset reasons (FIN001, TER001, DIS001, CUS001)
  scopeConfigs: ScopeConfig[]          // 3 scopes: Course-only, Term-wide, Program-wide
}
```

**Functions**: `getBlockSettings()`, `updateBlockSettings()`, `resetBlockSettings()`, `getInitialSettings()`

### Tab 1: Auto-Block Rules
- 3 cards: Finance Dues (with threshold input), TER Not Submitted, Disciplinary Hold
- Each: Enable toggle, description, affected actions (badges)
- Finance Dues: Numeric threshold input (default 5000, must be ≥0)
- Preview Impact button → Modal showing block counts from RESULT_BLOCKS

### Tab 2: Manual Block Reasons
- Table: Code, Label, Category, Default Actions (icons), Enabled, Order, Edit/Delete
- Add Reason dialog: Code (unique, required), Label (3-80 chars), Category (select), Actions (multi-select), Enabled toggle
- Order control: Up/down arrows + drag handle icon
- Validation: Unique code, label 3-80 chars

### Tab 3: Scopes & Actions
- 3 cards: Course-only, Term-wide, Program-wide
- Each: Enable toggle, description, allowed actions (checkboxes)
- Actions legend at top: Results (✓), Transcript (📄), Certificates (🏆), Admit (💳)

## Features
1. **Save** - Commits to settingsStore (in-memory), shows "Settings saved successfully"
2. **Revert** - Calls resetBlockSettings(), restores initial values
3. **Export CSV** - 3 sections (Auto Rules, Manual Reasons, Scopes) in one CSV
4. **Preview Impact Modal** - Computes from RESULT_BLOCKS:
   - Total students, Total blocked, Per-rule counts (finance/ter/disc)
5. **Unsaved Changes Banner** - Amber alert when hasChanges=true

## Integration with Block Manager
- Block Manager reads `getBlockSettings()` on mount
- AutoBlockBanner shows values from settingsStore (finance/TER/disc toggles)
- Create Dialog can use manualReasons for preset dropdown
- Scope defaults from scopeConfigs

## Validation
- **Finance threshold**: ≥0 (numeric input, min="0")
- **Reason code**: Required, unique (checked before save)
- **Reason label**: 3-80 chars (checked before save, counter shown)
- **Reason actions**: At least one required (implicit - dialog enforces)

## Theme
- Primary buttons: Purple/indigo gradient (`from-deep-plum to-accent-purple`)
- Category badges: Disciplinary=red, Finance/TER=amber, Custom=blue
- Enabled badges: Green-100, Disabled=gray
- No green accents except "Enabled" status
- No "demo" text

## Test Steps
1. Navigate `/coe/marks/blocks-settings` → See 3 tabs
2. Auto-Block Rules tab → Toggle finance rule, change threshold to 10000, click Preview Impact
3. Preview shows counts from RESULT_BLOCKS (3 active blocks)
4. Manual Reasons tab → Click Add Reason → Enter FIN002, "Late fees", Finance, select Results → Add
5. See new reason in table, use up/down to reorder
6. Scopes tab → Uncheck "Admit" for Course-only scope
7. Click Save → Settings saved alert
8. Navigate to Block Manager → AutoBlockBanner reflects new threshold
9. Click Revert → All back to initial values
10. Export CSV → Downloads with 3 sections

## State Persistence
- Session-only: Settings persist during session via module-level `settingsStore` variable
- Page reload: Resets to initial values from BLOCK_SETTINGS constants
- Block Manager and Block Settings share same store instance

## CSV Export Format
```
Block/Unblock Settings Export

AUTO-BLOCK RULES
Rule,Enabled,Threshold,Affected Actions
finance-dues,Yes,5000,Results; Transcript
...

MANUAL BLOCK REASONS
Code,Label,Category,Default Actions,Enabled,Order
FIN001,Finance dues,Finance,Results; Transcript,Yes,1
...

SCOPES & ACTIONS
Scope,Enabled,Allowed Actions
Course-only,Yes,Results
...
```
