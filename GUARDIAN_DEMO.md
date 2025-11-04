# Guardian Portal Demo Implementation

## Overview
The Guardian Portal allows parents/guardians to monitor their ward's academic progress, attendance, and financial status in real-time.

## Demo Credentials

| Email | Password | Ward(s) |
|-------|----------|---------|
| father.cse@demo.nu | guardian123 | Mahin Hasan (CSE-25010345) |
| mother.cse@demo.nu | guardian123 | Mahin Hasan (CSE-25010345) |
| guardian.bba@demo.nu | guardian123 | Rafi Ahmed (BBA-25030312) |

## Features Implemented

### 1. Dashboard
- **Student Overview**: Name, ID, Program, CGPA
- **Quick Stats**:
  - Attendance percentage (this term)
  - Outstanding dues
  - Current GPA (with lock status)
- **Alerts**:
  - Red alert for outstanding dues
  - Orange alert for pending TER (Teacher Evaluation Report)
- **Recent Activity**:
  - Last 5 attendance records
  - Last 5 payments

### 2. Attendance Monitoring
- **Filters**: Date range, status (Present/Absent/Late)
- **Stats Cards**: Present count, Absent count, Late count, Attendance %
- **Detailed Table**: Date, Course, Section, Status
- **Export**: CSV download

### 3. Academic Results
- **Gating Logic**:
  - Results are LOCKED if:
    - Outstanding dues > 0 BDT
    - TER not submitted
  - When locked, only past term results are shown
- **When Unlocked**:
  - GPA, CGPA, Credits Earned
  - Course-wise results table
  - Transcript view option
  - Download transcript (PDF stub)

### 4. Finance
- **Summary Cards**: Total Bill, Total Paid, Outstanding
- **Bills Table**: Bill No, Total, Paid, Due, Status
- **Payments Table**: MR No, Amount, Method, Date, Download Receipt
- **Receipt Download**: Opens print-friendly window (stub)

### 5. Notifications
- **Real-time Updates**: Attendance alerts, payment reminders, result notifications
- **Channels**: ERP, SMS, Email
- **Mark as Read**: Interactive status updates
- **Unread Badge**: Shows count in header bell icon

### 6. Profile
- **Guardian Info**: Name, Email, Mobile, Status
- **Linked Wards**: Table of all wards with relation type
- **Notification Preferences**: Toggle for ERP Push, SMS, Email

## Demo Data Scenarios

### Scenario 1: father.cse@demo.nu
- **Ward**: Mahin Hasan (CSE student)
- **Status**: Has outstanding dues (17,000 BDT) + TER pending
- **Result**: LOCKED for Fall 2025
- **Past Results**: Available for Spring 2025
- **Attendance**: Mix of Present/Absent/Late over 30 days
- **Finance**: Partially paid (22,000 of 39,000)

### Scenario 2: guardian.bba@demo.nu
- **Ward**: Rafi Ahmed (BBA student)
- **Status**: No dues + TER submitted
- **Result**: UNLOCKED for Fall 2025
- **Attendance**: Regular pattern over 18 days
- **Finance**: Fully paid (33,500)

## Technical Implementation

### Seeding (src/lib/guardianDemoSeed.ts)
- Uses `Repo.seedOnceDemo()` to ensure data is seeded only once
- Creates realistic dummy data:
  - 3 guardians
  - 3 students
  - 3 guardian-student links
  - Attendance records (30-day rolling)
  - Grades (historical + current term)
  - Finance payables & receipts
  - TER flags
  - Notifications

### Services (src/lib/guardianServices.ts)
- `GuardianService`: Profile, wards, preferences
- `AttendanceService`: List, stats, real-time stream
- `ResultService`: Term summary, course results, unlock logic
- `FinanceService`: Payables, payments, statements
- `TERService`: Status check
- `NotificationService`: List, mark as read, unread count
- `LogService`: Audit trail for all guardian actions

### Result Gating Logic
```typescript
const isBlockedForResults = (studentId, termCode) => {
  const payable = Repo.finance.payables.list().find(p => p.studentId===studentId && p.termCode===termCode);
  const ter = Repo.terFlags.list().find(t => t.studentId===studentId && t.termCode===termCode);
  const dues = (payable?.presentDues || 0) > 0;
  const terMissing = !(ter?.submitted);
  return dues || terMissing;
};
```

## RBAC
- Route protection: All `/guardian/*` routes require `role: 'guardian'`
- Session check: Redirects to login if not authenticated
- Ward selection: Stored in localStorage, validated on load

## Logging
All major actions are logged via `LogService.add()`:
- `GUARDIAN.LOGIN.VIEW`
- `GUARDIAN.SWITCH_WARD`
- `GUARDIAN.DASHBOARD.VIEW`
- `GUARDIAN.ATTENDANCE.VIEW`
- `GUARDIAN.RESULTS.VIEW`
- `GUARDIAN.FINANCE.VIEW`
- `GUARDIAN.NOTIFICATIONS.VIEW`
- `GUARDIAN.PROFILE.VIEW`
- `GUARDIAN.RECEIPT.DOWNLOAD`

## Development

### Reset Demo Data
In browser console:
```javascript
resetDemoData()
// Then reload the page
```

### Toggle Demo Mode
Edit `src/config/demo.ts`:
```typescript
export const DEMO_MODE = true // or false
```

### Add New Guardian
Edit `src/lib/guardianDemoSeed.ts` and add to the guardians array, then reset demo data.

## UI/UX
- **Theme**: Consistent with rest of system (deep-plum to accent-purple gradient)
- **Responsive**: Works on mobile, tablet, desktop
- **Accessibility**: Proper labels, ARIA attributes, keyboard navigation
- **Badges**: Color-coded (green=good, red=alert, orange=warning)
- **Icons**: Lucide React icons throughout

## Production Notes
- When `DEMO_MODE = false`, no demo seed runs
- All logic remains functional, just needs real API integration
- Services use Repo pattern, easy to swap with API calls
- No static JSON; everything dynamic through Repo collections
