# Guardian Portal Troubleshooting Guide

## "No Wards Linked" Error

If you see "No Wards Linked" after logging in, follow these steps:

### Step 1: Verify Demo Data is Seeded

Open browser console (F12) and run:
```javascript
verifyGuardianData()
```

This will show:
- Current logged-in user ID and email
- All guardians in the system
- All students in the system  
- All guardian-student links
- **Your specific links** (if logged in as guardian)

Expected output for `father.cse@demo.nu`:
```
📊 Current User: g_father_01 - father.cse@demo.nu (role: guardian)

📋 Guardians: 3
  - g_father_01 → father.cse@demo.nu ( Abdul Karim )
  - g_mother_01 → mother.cse@demo.nu ( Rokia Begum )
  - g_guardian_02 → guardian.bba@demo.nu ( Shahidul Islam )

👥 Students: 3
  - stu_cse_01 → Mahin Hasan ( CSE )
  - stu_cse_02 → Arisha Khan ( CSE )
  - stu_bba_01 → Rafi Ahmed ( BBA )

🔗 Guardian Links: 3
  - g_father_01 → stu_cse_01 ( Father )
  - g_mother_01 → stu_cse_01 ( Mother )
  - g_guardian_02 → stu_bba_01 ( Guardian )

✅ My Links: 1
  - stu_cse_01 → Mahin Hasan
```

### Step 2: Check for ID Mismatch

The most common issue is **ID mismatch** between:
1. User ID from login (`user.id`)
2. Guardian ID in guardians table
3. Guardian ID in guardian links

**They must all be the same!**

For example, if you log in as `father.cse@demo.nu`:
- ✅ `user.id` should be `g_father_01`
- ✅ Guardian record ID should be `g_father_01`
- ✅ Guardian link `guardianId` should be `g_father_01`

If any of these don't match, you'll see "No Wards Linked".

### Step 3: Reset Demo Data

If data looks wrong or incomplete:

```javascript
resetDemoData()
```

Then reload the page. This will:
1. Clear all demo seed flags
2. Re-run the seed on next page load
3. Create fresh data with correct IDs

### Step 4: Check Console Logs

When you log in, watch the console. You should see:

```
🌱 Running seedAll before React render...
🔄 Seeding Guardian Portal Demo Data...
✅ Guardian Portal demo data seeded successfully
   - Guardians: 3 → g_father_01 (father.cse@demo.nu), g_mother_01 (mother.cse@demo.nu), g_guardian_02 (guardian.bba@demo.nu)
   - Students: 3 → stu_cse_01 (Mahin Hasan), stu_cse_02 (Arisha Khan), stu_bba_01 (Rafi Ahmed)
   - Guardian Links: 3 → g_father_01 → stu_cse_01, g_mother_01 → stu_cse_01, g_guardian_02 → stu_bba_01
✅ seedAll complete
```

Then when you visit the dashboard:

```
🔍 GuardianDashboard: Loading data for user: g_father_01 father.cse@demo.nu
🔍 GuardianDashboard: Found wards: 1 ['stu_cse_01']
✅ Active ward set to: stu_cse_01 Mahin Hasan
```

If you see:
```
🔍 GuardianDashboard: Found wards: 0 []
⚠️ No wards found for guardian g_father_01 - attempting self-heal...
```

The self-heal will try to create a link automatically.

### Step 5: Manual Link Creation (Last Resort)

If self-heal fails, you can manually create a link in console:

```javascript
// For father.cse@demo.nu → Mahin Hasan (CSE student)
Repo.add('guardianLinks', {
  id: 'manual_link_father_cse',
  guardianId: 'g_father_01',
  studentId: 'stu_cse_01',
  relation: 'Father',
  isPrimary: true,
  createdAt: new Date().toISOString()
})

// Reload the page
location.reload()
```

For `guardian.bba@demo.nu`:
```javascript
Repo.add('guardianLinks', {
  id: 'manual_link_guardian_bba',
  guardianId: 'g_guardian_02',
  studentId: 'stu_bba_01',
  relation: 'Guardian',
  isPrimary: true,
  createdAt: new Date().toISOString()
})
location.reload()
```

## Common Issues

### Issue 1: User ID doesn't match Guardian ID

**Symptom**: Console shows `user.id = 'father.cse@demo.nu'` instead of `g_father_01`

**Cause**: Auth context not mapping email to guardian ID correctly

**Fix**: Check `src/contexts/RegistrationAuthContext.tsx`:
```typescript
const demoUsers: Record<string, User> = {
  'father.cse@demo.nu': {
    id: 'g_father_01',  // ← Must match guardian ID!
    name: 'Abdul Karim',
    role: 'guardian',
    email: 'father.cse@demo.nu'
  }
}
```

### Issue 2: Guardian Links use wrong ID

**Symptom**: Console shows links like `guardianId: 'father_01'` instead of `g_father_01`

**Cause**: Guardian demo seed not using canonical constants

**Fix**: Check `src/lib/guardianDemoSeed.ts` uses constants:
```typescript
const G_FATHER_01 = 'g_father_01'  // Canonical ID

const guardianLinks: GuardianLink[] = [
  { id: 'link1', guardianId: G_FATHER_01, studentId: STU_CSE_01, ... }
]
```

### Issue 3: Seed not running

**Symptom**: Console doesn't show "Seeding Guardian Portal Demo Data"

**Cause**: DEMO_MODE disabled or seedAll not called

**Fix**: 
1. Check `src/config/demo.ts`: `export const DEMO_MODE = true`
2. Check `src/main.tsx` calls `seedAll()` before `ReactDOM.createRoot()`
3. Check `src/lib/seedAll.ts` calls `seedGuardianDemoData()`

### Issue 4: Data cleared on reload

**Symptom**: Data appears after reset but disappears on next reload

**Cause**: `seedOnceDemo` flag preventing re-seed

**Fix**: 
```javascript
// Clear the seed flag
localStorage.removeItem('nu-erp-demo-seeded-guardian-portal-demo:v1')
location.reload()
```

## Verification Checklist

Before reporting an issue, verify:

- [ ] `DEMO_MODE = true` in `src/config/demo.ts`
- [ ] Console shows guardian seed running
- [ ] `verifyGuardianData()` shows 3 guardians, 3 students, 3 links
- [ ] Logged-in user ID matches a guardian ID
- [ ] At least one guardian link has matching `guardianId`
- [ ] Browser console has no red errors
- [ ] localStorage contains `nu-erp-guardians` key
- [ ] localStorage contains `nu-erp-guardianLinks` key

## Still Having Issues?

1. Clear browser cache and localStorage completely
2. Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
3. Try different browser
4. Check if ad blocker is interfering with localStorage

## Debug Commands Reference

```javascript
// See all guardian data
verifyGuardianData()

// Reset and re-seed
resetDemoData()

// Check what's in localStorage
Object.keys(localStorage).filter(k => k.startsWith('nu-erp-')).forEach(k => {
  console.log(k, '→', JSON.parse(localStorage.getItem(k) || '[]').length, 'items')
})

// Check current user
JSON.parse(localStorage.getItem('nu-user'))

// Check guardian links
Repo.get('guardianLinks')

// Check guardians
Repo.get('guardians')

// Check students
Repo.get('students')
```
