# Block/Unblock Settings - Dev Notes

## Route
`/coe/marks/blocks-settings` → Sidebar: "Marks & Result" → "Block/Unblock Settings"

## Files Created
- `BlockSettingsView.tsx` (712 lines) - Main view with 3 tabs
- `settingsStore.ts` (132 lines) - In-memory store with get/update/reset functions

## Files Modified
- `COEDashboard.tsx` - Import + route case
- `BlockManagerView.tsx` - Reads settingsStore for AutoBlockBanner

## Store Structure
```typescript
BlockSettingsStore {
  autoBlockRules: [finance-dues, ter-not-submitted, disciplinary-hold]
  manualReasons: [FIN001, TER001, DIS001, CUS001]
  scopeConfigs: [Course-only, Term-wide, Program-wide]
}
```

## Tabs

### Auto-Block Rules
- 3 cards with enable toggles, affected actions badges
- Finance Dues: threshold input (≥0, default 5000)
- Preview Impact button → modal showing RESULT_BLOCKS counts

### Manual Reasons
- Table: Code, Label, Category, Actions, Enabled, Order
- Add/Edit dialog: Code (unique), Label (3-80), Category, Actions (multi-select)
- Order controls: up/down arrows

### Scopes & Actions
- 3 cards with enable toggles, allowed actions checkboxes
- Legend: Results ✓, Transcript 📄, Certificates 🏆, Admit 💳

## Features
- **Save**: Commits to settingsStore, shows alert
- **Revert**: Resets to initial BLOCK_SETTINGS
- **Export CSV**: 3 sections in one file
- **Preview Impact**: Computes totals from RESULT_BLOCKS
- **Unsaved Banner**: Amber alert when hasChanges

## Integration
- Block Manager reads settingsStore on mount
- AutoBlockBanner reflects rule toggles/thresholds
- Shared in-memory store (session-only)

## Validation
- Finance threshold ≥0
- Reason code unique + required
- Reason label 3-80 chars
- At least one action selected

## Theme
- Purple/indigo gradient buttons
- Category badges: red (Disciplinary), amber (Finance/TER), blue (Custom)
- No "demo" text

## Test
1. Navigate to settings → See 3 tabs
2. Auto tab → Change threshold, Preview Impact
3. Manual tab → Add FIN002, reorder with arrows
4. Scopes tab → Toggle actions
5. Save → Alert shown
6. Navigate Block Manager → See updated values
7. Revert → Reset to defaults
8. Export → CSV downloads

## State
Session-only via module-level variable. Resets on page reload.
