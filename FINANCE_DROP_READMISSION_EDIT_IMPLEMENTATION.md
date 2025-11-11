# Finance Portal - Drop/Re-admission Fees Edit Functionality

## User Request
"Drop/Re-admission Fees -> Fee management tab-> can only be view..can not be edited ..should be editable"

## Problem
The Fee Management tab in the Drop/Re-admission Fees page displayed drop fees, re-admission fees, and absent thresholds as read-only text. Users could not modify these values.

### Before:
- Fee values displayed as static text
- No edit buttons
- No way to update policies
- Read-only view only

## Solution Implemented

Added full edit functionality with a professional dialog interface for updating drop and re-admission fee policies.

### File Modified:
`src/finance/views/DropReadmissionView.tsx`

## Features Added

### 1. Edit Button on Each Policy Card
Each policy card (Tri-semester, Bi-semester) now has an "Edit" button in the header.

```tsx
<Button
  size="sm"
  variant="outline"
  onClick={() => handleEditPolicy(policy)}
>
  <Edit2 className="w-4 h-4 mr-2" />
  Edit
</Button>
```

### 2. Edit Policy Dialog
A comprehensive dialog with input fields for all editable values:

**Editable Fields:**
- **Drop Fee (BDT)** - Number input with step increments of 100
- **Re-admission Fee (BDT)** - Number input with step increments of 100
- **Absent Threshold (Semesters)** - Integer input for minimum semesters

**Dialog Features:**
- Clear field labels with required indicators
- Number inputs with min/max constraints
- Helper text explaining each field
- Live preview showing formatted values
- Validation before saving
- Cancel and Save buttons

### 3. State Management
Added React state hooks to manage editing:

```typescript
const [editingPolicy, setEditingPolicy] = useState<DropReadmissionPolicy | null>(null)
const [editForm, setEditForm] = useState({ 
  dropFee: 0, 
  readmissionFee: 0, 
  absentThreshold: 1 
})
```

### 4. Edit Handler
Opens the dialog and populates form with current values:

```typescript
const handleEditPolicy = (policy: DropReadmissionPolicy) => {
  setEditingPolicy(policy)
  setEditForm({
    dropFee: policy.dropFee,
    readmissionFee: policy.readmissionFee,
    absentThreshold: policy.absentThreshold
  })
}
```

### 5. Save Handler with Validation
Validates input and updates the Repo:

```typescript
const handleSavePolicy = () => {
  if (!editingPolicy) return

  // Validation
  if (editForm.dropFee < 0 || editForm.readmissionFee < 0) {
    alert('Fees cannot be negative')
    return
  }

  if (editForm.absentThreshold < 1) {
    alert('Absent threshold must be at least 1')
    return
  }

  // Update Repo
  Repo.update('finance-drop-readmission-policies', editingPolicy.id, {
    dropFee: editForm.dropFee,
    readmissionFee: editForm.readmissionFee,
    absentThreshold: editForm.absentThreshold
  })

  alert(showDemoToast('Policy updated successfully'))
  setEditingPolicy(null)
  loadPolicies()
}
```

### 6. Cancel Handler
Closes dialog without saving:

```typescript
const handleCancelEdit = () => {
  setEditingPolicy(null)
}
```

## User Interface

### Fee Management Cards (Before):
```
┌─────────────────────────────┐
│ Tri-semester               │
├─────────────────────────────┤
│ Drop Fee: ৳1,000.00        │
│ Re-admission Fee: ৳5,000.00│
│ Threshold: > 2 semesters   │
└─────────────────────────────┘
```

### Fee Management Cards (After):
```
┌─────────────────────────────┐
│ Tri-semester      [Edit]   │
├─────────────────────────────┤
│ Drop Fee: ৳1,000.00        │
│ Re-admission Fee: ৳5,000.00│
│ Threshold: > 2 semesters   │
└─────────────────────────────┘
```

### Edit Dialog:
```
┌───────────────────────────────────────┐
│ Edit Tri-semester Policy          [×]│
│ Update drop and re-admission fees    │
├───────────────────────────────────────┤
│                                       │
│ Drop Fee (BDT) *                     │
│ [1000                            ]   │
│                                       │
│ Re-admission Fee (BDT) *             │
│ [5000                            ]   ��
│                                       │
│ Absent Threshold (Semesters) *       │
│ [2                               ]   │
│ Policy applies if student is         │
│ absent/unregistered for more than    │
│ this many semesters                  │
│                                       │
│ ┌─────────────────────────────────┐  │
│ │ Preview:                        │  │
│ │ • Drop Fee: ৳1,000.00          │  │
│ │ • Re-admission Fee: ৳5,000.00  │  │
│ │ • Threshold: 2 semester(s)     │  │
│ └─────────────────────────────────┘  │
│                                       │
│          [Cancel]  [Save Changes]    │
└───────────────────────────────────────┘
```

## Usage Workflow

### Edit Tri-semester Policy:
1. Navigate to **Finance Portal → Drop/Re-admission Fees**
2. Click **"Fee Management"** button (top right)
3. Find **"Tri-semester"** card
4. Click **"Edit"** button
5. Dialog opens with current values:
   - Drop Fee: ৳1,000.00
   - Re-admission Fee: ৳5,000.00
   - Absent Threshold: 2 semesters
6. Update values as needed:
   - Example: Change Drop Fee to ৳1,500
   - Example: Change Re-admission Fee to ৳6,000
   - Example: Change Threshold to 3 semesters
7. Preview shows updated values in real-time
8. Click **"Save Changes"**
9. Success message appears
10. Card updates with new values

### Edit Bi-semester Policy:
Same process for the "Bi-semester" policy card.

## Validation Rules

### Drop Fee:
- ✅ Must be a non-negative number
- ✅ Can be 0 (free drop)
- ❌ Cannot be negative

### Re-admission Fee:
- ✅ Must be a non-negative number
- ✅ Can be 0 (free re-admission)
- ❌ Cannot be negative

### Absent Threshold:
- ✅ Must be at least 1 semester
- ✅ Integer values only
- ❌ Cannot be less than 1

## Data Persistence

### Storage:
- Data stored in Repo: `finance-drop-readmission-policies`
- Updates persist in browser localStorage
- Survives page refreshes

### Seed Data:
Located in `src/finance/data/seedData.ts`:

```typescript
export const dropReadmissionPoliciesSeed: DropReadmissionPolicy[] = [
  {
    id: 'drp1',
    systemType: 'Tri-semester',
    dropFee: 1000,
    readmissionFee: 5000,
    absentThreshold: 2,
    dropCostHeadCode: '023',
    readmissionCostHeadCode: '023'
  },
  {
    id: 'drp2',
    systemType: 'Bi-semester',
    dropFee: 1500,
    readmissionFee: 5000,
    absentThreshold: 1,
    dropCostHeadCode: '023',
    readmissionCostHeadCode: '023'
  }
]
```

## Technical Implementation

### Imports Added:
```typescript
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Edit2, Save, X } from 'lucide-react'
import { showDemoToast } from '@/config/demo'
```

### State Variables:
```typescript
const [editingPolicy, setEditingPolicy] = useState<DropReadmissionPolicy | null>(null)
const [editForm, setEditForm] = useState({ 
  dropFee: 0, 
  readmissionFee: 0, 
  absentThreshold: 1 
})
```

### Functions:
- `handleEditPolicy(policy)` - Opens edit dialog
- `handleSavePolicy()` - Validates and saves changes
- `handleCancelEdit()` - Closes dialog without saving

## Benefits

✅ **Fully Editable:** All fee values can now be updated
✅ **User-Friendly:** Clear dialog interface with labels and helpers
✅ **Validation:** Prevents invalid values (negative fees, threshold < 1)
✅ **Live Preview:** Shows formatted values before saving
✅ **Persistent:** Updates saved to localStorage
✅ **Success Feedback:** Confirmation message after save
✅ **Cancel Option:** Can discard changes without saving
✅ **Professional UX:** Follows standard edit dialog patterns

## Testing Recommendations

- [ ] Navigate to Drop/Re-admission Fees
- [ ] Click "Fee Management" tab
- [ ] Click "Edit" on Tri-semester policy
- [ ] Verify dialog opens with current values
- [ ] Update Drop Fee to 2000
- [ ] Update Re-admission Fee to 7000
- [ ] Update Threshold to 3
- [ ] Verify preview shows updated values
- [ ] Click "Save Changes"
- [ ] Verify success message appears
- [ ] Verify card shows new values
- [ ] Refresh page and verify values persist
- [ ] Click "Edit" again
- [ ] Click "Cancel" without saving
- [ ] Verify dialog closes without changes
- [ ] Try entering negative fee (should show error)
- [ ] Try entering threshold of 0 (should show error)
- [ ] Edit Bi-semester policy and verify it works

## Summary

The Drop/Re-admission Fees Fee Management tab is now fully editable. Users can:
- Click "Edit" button on any policy card
- Update drop fees, re-admission fees, and absent thresholds
- See live preview of changes
- Save updates with validation
- Cancel without saving if needed

This transforms the read-only fee display into a fully functional fee management system with proper validation and user feedback.
