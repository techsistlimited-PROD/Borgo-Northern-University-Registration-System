# Guardian Portal - Static Demo Mode Implementation

## ✅ Implementation Complete

The Guardian Portal now has a **fully static demo mode** that works without any Repo seeding or database lookups. It uses hardcoded data and **never shows "No Wards Linked"**.

---

## 🎯 Key Features

### 1. **Static Data Source**
- All data is hardcoded in `src/lib/guardianStatic.ts`
- No dependency on Repo seeding or timing issues
- Guaranteed to always work on first load

### 2. **Never Shows "No Wards Linked"**
- Static mode always has wards available
- Auto-selects first ward on login
- Bypasses all Repo guardian link lookups

### 3. **Working UI with Real Filters**
- Attendance filtering by date range, course, and status
- Finance statements with bills and payments
- Results with gating logic (dues + TER)
- Notifications with read/unread status

### 4. **Demo Credentials**

| Email | Password | Ward | Scenario |
|-------|----------|------|----------|
| father.cse@demo.nu | guardian123 | Mahin Hasan (CSE) | **Blocked** - Has dues (17,000 BDT) + TER pending |
| guardian.bba@demo.nu | guardian123 | Rafi Ahmed (BBA) | **Unlocked** - No dues + TER submitted |

---

## 📁 Files Created

### Core Implementation

1. **`src/config/demo.ts`**
   ```typescript
   export const DEMO_MODE = true
   export const DEMO_STATIC_GUARDIAN = true
   ```

2. **`src/lib/guardianStatic.ts`**
   - Hardcoded demo guardians (3)
   - Hardcoded demo wards (3 students)
   - Attendance records (~50 entries)
   - Results with semester-wise breakdown
   - Finance with bills and payments
   - Notifications

3. **`src/services/guardianDemo.ts`**
   - `GuardianDemo.getWards()` - Returns static wards
   - `GuardianDemo.getActiveWardId()` - Gets active ward from localStorage
   - `GuardianDemo.setActiveWardId()` - Sets active ward
   - `GuardianDemo.getAttendance()` - Returns filtered attendance
   - `GuardianDemo.getAttendanceStats()` - Calculates stats
   - `GuardianDemo.getResults()` - Returns results with gating
   - `GuardianDemo.getFinance()` - Returns finance data
   - `GuardianDemo.getNotifications()` - Returns notifications
   - `GuardianDemo.getUnreadCount()` - Counts unread notifications

---

## 🔧 Files Modified

### Authentication
- **`src/contexts/RegistrationAuthContext.tsx`**
  - Maps guardian emails to guardian IDs
  - Auto-sets first ward on login
  - Uses `DEMO_GUARDIANS` from static data

### Dashboard
- **`src/pages/GuardianDashboard.tsx`**
  - Checks `isStaticMode = DEMO_MODE && DEMO_STATIC_GUARDIAN`
  - Uses `GuardianDemo` instead of `guardianService` in static mode
  - Never shows "No Wards Linked" in static mode
  - Skips audit logging in static mode

### Components
All guardian components updated to support static mode:

1. **`src/components/guardian/GuardianDashboardView.tsx`**
   - Loads data from `GuardianDemo` in static mode
   - Displays stats, recent attendance, recent payments

2. **`src/components/guardian/GuardianScreens.tsx`**
   - **GuardianAttendance**: Filters, stats, CSV export
   - **GuardianAcademics**: Result gating, semester-wise display
   - **GuardianFinance**: Bills, payments, summary cards
   - **GuardianNotifications**: Mark as read (no-op in static)
   - **GuardianProfile**: Guardian info, linked wards, preferences

---

## 📊 Demo Data Breakdown

### Guardians
```typescript
[
  { id: 'g_father_01', name: 'Abdul Karim', email: 'father.cse@demo.nu' },
  { id: 'g_mother_01', name: 'Rokia Begum', email: 'mother.cse@demo.nu' },
  { id: 'g_guardian_02', name: 'Shahidul Islam', email: 'guardian.bba@demo.nu' }
]
```

### Wards
```typescript
{
  g_father_01: [{ id: 'stu_cse_01', name: 'Mahin Hasan', program: 'BSc CSE', ... }],
  g_mother_01: [{ id: 'stu_cse_01', name: 'Mahin Hasan', ... }], // Same ward
  g_guardian_02: [{ id: 'stu_bba_01', name: 'Rafi Ahmed', program: 'BBA', ... }]
}
```

### Attendance (~50 records)
- CSE student: 25 records across 3 courses (CSE101, CSE102, MAT101)
- BBA student: 20 records across 2 courses (BUS101, ACC110)
- Mix of Present (P), Absent (A), Late (L)
- Date range: 2025-10-01 to 2025-10-29

### Results
**CSE Student (Mahin Hasan)**:
- CGPA: 3.62
- Spring 2025: GPA 3.55 (3 courses)
- Fall 2025: GPA 3.70 (2 courses)
- **Gating**: dues=17000, terPending=true → **BLOCKED**

**BBA Student (Rafi Ahmed)**:
- CGPA: 3.28
- Fall 2025: GPA 3.30 (2 courses)
- **Gating**: dues=0, terPending=false → **UNLOCKED**

### Finance
**CSE Student**:
- Total Bill: 52,000 BDT
- Total Paid: 35,000 BDT
- Outstanding: 17,000 BDT
- 3 bills (Tuition, Lab, Library)
- 2 payments

**BBA Student**:
- Total Bill: 38,000 BDT
- Total Paid: 38,000 BDT
- Outstanding: 0 BDT
- 2 bills (Tuition, ID Card)
- 1 payment (full)

### Notifications
- **father.cse@demo.nu**: 3 notifications (absence alert, payment reminder, TER pending)
- **guardian.bba@demo.nu**: 2 notifications (result published, payment confirmed)

---

## 🧪 Testing Guide

### Test 1: Blocked Results (CSE Student)

1. Login: `father.cse@demo.nu` / `guardian123`
2. Verify Dashboard:
   - ✅ Ward: Mahin Hasan (CSE-25010341)
   - ✅ CGPA: 3.62
   - ✅ Outstanding: 17,000 BDT (RED alert)
   - ✅ GPA: LOCKED (RED badge)
   - ✅ Alerts: "Outstanding Dues" + "TER Pending"

3. Check Attendance:
   - ✅ 25 records visible
   - ✅ Stats: Present ~85%, Absent 3, Late 1
   - ✅ Filters work (date range, course, status)
   - ✅ CSV export works

4. Check Academics:
   - ✅ RED banner: "Results locked: Clear dues and submit TER"
   - ✅ Only shows Spring 2025 + Fall 2025 semester details
   - ✅ CGPA: 3.62 displayed

5. Check Finance:
   - ✅ Total Bill: 52,000 BDT
   - ✅ Total Paid: 35,000 BDT
   - ✅ Outstanding: 17,000 BDT
   - ✅ 3 bills listed (Partial, Paid, Unpaid)
   - ✅ 2 payments listed

6. Check Notifications:
   - ✅ 3 notifications visible
   - ✅ Unread count badge shows in header
   - ✅ Mark as read works (visual only in static mode)

### Test 2: Unlocked Results (BBA Student)

1. Login: `guardian.bba@demo.nu` / `guardian123`
2. Verify Dashboard:
   - ✅ Ward: Rafi Ahmed (BBA-25030327)
   - ✅ CGPA: 3.28
   - ✅ Outstanding: 0 BDT (GREEN)
   - ✅ GPA: 3.30 (no lock)
   - ✅ No alerts

3. Check Academics:
   - ✅ NO blocking banner
   - ✅ Fall 2025 results visible
   - ✅ Course table shows grades

4. Check Finance:
   - ✅ All paid (38,000 / 38,000)
   - ✅ Status badges: Paid (green)

### Test 3: Ward Switching (Mother)

1. Login: `mother.cse@demo.nu` / `guardian123`
2. Verify:
   - ✅ Same ward as father (Mahin Hasan)
   - ✅ Same data displayed
   - ✅ Relation: Mother (shown in Profile)

---

## 🔍 How It Works

### Login Flow
```
User enters email + password
  ↓
Auth checks DEMO_STATIC_GUARDIAN flag
  ↓
Looks up guardian in DEMO_GUARDIANS by email
  ↓
Creates session with guardian ID
  ↓
Auto-sets first ward as active in localStorage
  ↓
Redirects to /guardian/dashboard
```

### Dashboard Load Flow
```
GuardianDashboard checks isStaticMode
  ↓
If static: GuardianDemo.getWards()
  ↓
If not static: guardianService.getMyWards() (Repo lookup)
  ↓
Sets activeWard from localStorage or first ward
  ↓
Never shows "No Wards Linked" in static mode
```

### Component Data Flow
```
Component checks isStaticMode
  ↓
If static: GuardianDemo.get*()
  ↓
If not static: Service.get*() (Repo lookup)
  ↓
Renders data with appropriate format
```

---

## 🎨 UI Features

### Filters
- **Attendance**: Date range, course code, status (P/A/L)
- **Finance**: None (shows all for active ward)
- **Notifications**: None (shows all for guardian)

### Downloads
- **Attendance CSV**: Exports filtered records
- **Receipt PDF**: Opens print dialog (window.print())
- **Transcript PDF**: Opens print dialog (window.print())

### Badges & Alerts
- **Status Badges**: Present (green), Absent (red), Late (amber)
- **Alert Banners**: Outstanding Dues (red), TER Pending (orange)
- **Result Lock**: RED "LOCKED" badge when blocked

---

## 🚀 Production Notes

### To Enable Static Mode
```typescript
// src/config/demo.ts
export const DEMO_MODE = true
export const DEMO_STATIC_GUARDIAN = true
```

### To Disable Static Mode
```typescript
// src/config/demo.ts
export const DEMO_MODE = true
export const DEMO_STATIC_GUARDIAN = false // Use Repo-based demo
```

### To Disable All Demo
```typescript
// src/config/demo.ts
export const DEMO_MODE = false
export const DEMO_STATIC_GUARDIAN = false
```

### Adding New Static Guardians

Edit `src/lib/guardianStatic.ts`:

```typescript
export const DEMO_GUARDIANS = [
  // ... existing
  { id: 'g_new_guardian', name: 'New Guardian', email: 'new@demo.nu' }
]

export const DEMO_WARDS = {
  // ... existing
  g_new_guardian: [
    { id: 'stu_new', name: 'New Student', program: 'LLB', ... }
  ]
}
```

Then update auth mapping in `src/contexts/RegistrationAuthContext.tsx` (auto-mapped by email now).

---

## ✨ Advantages of Static Mode

1. **Guaranteed to Work**: No seeding timing issues
2. **Fast Load**: No Repo lookups or filtering
3. **No Dependencies**: Works without seedAll()
4. **Easy Debugging**: Data is visible in source
5. **Consistent**: Same data every time
6. **Demo-Friendly**: Perfect for presentations

---

## 📝 Known Limitations

1. **No Persistence**: Mark as read, preferences don't persist
2. **No Real-time**: Attendance stream, notifications don't update
3. **Fixed Data**: Can't add new records at runtime
4. **Static Filters**: Filtering happens client-side on fixed dataset

These are **intentional** for demo mode and won't exist in production.

---

## 🎉 Done!

The Guardian Portal now has a **fully functional static demo mode** that:
- ✅ Never shows "No Wards Linked"
- ✅ Works with hardcoded data
- ✅ Has working filters and downloads
- ✅ Shows realistic gating scenarios
- ✅ Supports multiple demo accounts

Login and test it now!
- `father.cse@demo.nu` / `guardian123` → Blocked results
- `guardian.bba@demo.nu` / `guardian123` → Unlocked results
