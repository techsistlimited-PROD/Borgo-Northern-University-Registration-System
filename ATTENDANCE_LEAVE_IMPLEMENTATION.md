# HRM.3 — Attendance & Leave Management Implementation

## Overview
Complete implementation of HRM Attendance & Leave subsystem with static demo data, focusing on UI and functional flow.

## Navigation Structure

Added under HRM sidebar with expandable submenu:

**Attendance & Leave**
- Attendance Dashboard → `/hrm/attendance/dashboard`
- Shift & Roster Planner → `/hrm/attendance/roster`
- Daily Attendance → `/hrm/attendance/daily`
- Monthly Reports → `/hrm/attendance/monthly`
- Leave Applications → `/hrm/leave/applications`
- Leave Balances → `/hrm/leave/balances`

## Static Data Models

### 1. Attendance Records (`AttendanceRecord`)
```typescript
{
  id: string
  empId: string
  name: string
  dept: string
  date: string
  inTime: string
  outTime: string
  hours: number
  late: number (minutes)
  status: 'Present' | 'Absent' | 'Late' | 'On Leave'
  shift: string
  remarks?: string
}
```
**Data**: ~120 records (10 employees × 12 days)

### 2. Shifts (`Shift`)
```typescript
{
  id: string
  name: string
  start: string (HH:mm)
  end: string (HH:mm)
  type: 'Regular' | 'Night' | 'Flex'
  campus: string
  remarks?: string
}
```
**Data**: 4 shifts (R1, R2, F1, F2)

### 3. Roster (`Roster`)
```typescript
{
  dept: string
  date: string
  shiftId: string
  employees: string[] (empIds)
}
```
**Data**: 6 roster entries across departments

### 4. Leave Applications (`LeaveApplication`)
```typescript
{
  id: string
  empId: string
  name: string
  dept: string
  type: 'Casual' | 'Medical' | 'Earn' | 'Maternity' | 'Special' | 'Duty' | 'Study' | 'Semester Break'
  from: string
  to: string
  totalDays: number
  reason: string
  status: 'Pending' | 'Approved' | 'Rejected' | 'Cancelled'
  workflow: {
    hod: 'Pending' | 'Approved' | 'Rejected'
    dean: 'Pending' | 'Approved' | 'Rejected'
    hr: 'Pending' | 'Approved' | 'Rejected'
    registrar: 'Pending' | 'Approved' | 'Rejected'
    vc: 'Pending' | 'Approved' | 'Rejected'
  }
  remarks?: string
  appliedOn: string
}
```
**Data**: 15 applications with varying workflow progress

### 5. Leave Balances (`LeaveBalance`)
```typescript
{
  empId: string
  name: string
  dept: string
  casual: number
  medical: number
  earn: number
  special: number
  used: number
  remaining: number
}
```
**Data**: 12 employee balances

## Components Created

### Attendance Components

#### 1. `AttendanceDashboard.tsx`
**Path**: `src/components/hrm/attendance/AttendanceDashboard.tsx`

**Features**:
- 4 summary cards: Total Staff, Present Today, Absent, On Leave
- Department-wise attendance pie chart
- Late vs On Time bar chart by department
- Today's attendance table (top 10)
- Filters: Department, Shift, Date
- Export buttons: PDF, CSV

**Charts**: Recharts (Pie + Bar)

#### 2. `ShiftRosterPlanner.tsx`
**Path**: `src/components/hrm/attendance/ShiftRosterPlanner.tsx`

**Features**:
- Add Shift modal with form (name, start, end, type, campus)
- Shift List table with Edit/Delete actions
- 7-day roster calendar grid per department
- Employee assignment with shift badges
- Generate Roster button

**Actions**: Add, Edit, Delete shifts; Assign employees to dates

#### 3. `DailyAttendance.tsx`
**Path**: `src/components/hrm/attendance/DailyAttendance.tsx`

**Features**:
- Filters: Date, Dept, Shift, Status, Search (name/ID)
- Color-coded rows: Yellow (Late), Red (Absent), Blue (On Leave)
- Table columns: EmpID, Name, Dept, Shift, In Time, Out Time, Hours, Late(min), Status, Remarks
- Bulk actions: Mark All Present, Mark Holiday, Download Report

**Row Highlighting**: Dynamic based on status

#### 4. `MonthlyReports.tsx`
**Path**: `src/components/hrm/attendance/MonthlyReports.tsx`

**Features**:
- Filters: Month & Year, Dept, Employee
- Attendance trend line chart (weekly %)
- Employee summary table: Total Days, Present, Absent, Leave, Late, OT Hours, Attendance %
- Progress bars for attendance percentage
- View modal: Daily attendance details per employee
- Export: PDF, Excel, CSV buttons

**Charts**: Recharts (Line)

### Leave Components

#### 5. `LeaveApplications.tsx`
**Path**: `src/components/hrm/leave/LeaveApplications.tsx`

**Features**:
- 3 summary cards: Pending (yellow), Approved (green), Rejected (red)
- Filters: Dept, Leave Type, Status, Date Range, Search
- Table with workflow progress bars (5-stage approval)
- Status badges with color coding
- Side drawer with 3 tabs:
  - Details: Full application info
  - Workflow Timeline: HOD → Dean → HR → Registrar → VC
  - Remarks: Additional notes
- Actions: View, Approve, Reject, Cancel, Print

**Workflow Stages**: HOD → Dean → HR → Registrar → VC (visual progress)

#### 6. `LeaveBalances.tsx`
**Path**: `src/components/hrm/leave/LeaveBalances.tsx`

**Features**:
- Filters: Dept, Employment Type, Campus
- Stacked bar chart: Used vs Remaining per leave type (or per employee if dept selected)
- Table: Casual, Medical, Earn, Special, Used, Remaining
- View History modal: Approved leaves with type, dates, days

**Charts**: Recharts (Stacked Bar)

## UI Behavior

### Interactive Features
- All filters update tables instantly
- Actions (approve, reject, cancel) mutate local array with toast confirmation
- Modals/drawers for detailed views
- Sticky table headers for scrolling
- Responsive cards for mobile

### Color Palette
- Primary: Blue gradient (`from-blue-600 to-blue-800`)
- Success: Green (`#22c55e`)
- Warning: Yellow (`#f59e0b`)
- Danger: Red (`#ef4444`)
- Info: Blue (`#3b82f6`)

### Status Color Coding
- **Attendance Status**:
  - Present: Green (`bg-green-100 text-green-800`)
  - Late: Yellow (`bg-yellow-100 text-yellow-800`)
  - Absent: Red (`bg-red-100 text-red-800`)
  - On Leave: Blue (`bg-blue-100 text-blue-800`)

- **Leave Status**:
  - Pending: Yellow
  - Approved: Green
  - Rejected: Red
  - Cancelled: Gray

## Charts & Widgets

### Attendance Dashboard
- 1 Pie Chart: Status distribution
- 1 Bar Chart: Late vs On Time by department
- 4 Gradient cards: Stats summary

### Monthly Reports
- 1 Line Chart: Weekly attendance trend
- Progress bars: Attendance percentage per employee

### Leave Balances
- 1 Stacked Bar Chart: Used vs Remaining (overall) or Leave types (dept-specific)

**Library**: Recharts v2.x (installed)

## Files Modified/Created

### Created
1. `src/components/hrm/attendance/AttendanceDashboard.tsx` (236 lines)
2. `src/components/hrm/attendance/ShiftRosterPlanner.tsx` (246 lines)
3. `src/components/hrm/attendance/DailyAttendance.tsx` (196 lines)
4. `src/components/hrm/attendance/MonthlyReports.tsx` (270 lines)
5. `src/components/hrm/leave/LeaveApplications.tsx` (344 lines)
6. `src/components/hrm/leave/LeaveBalances.tsx` (233 lines)
7. `src/components/ui/sheet.tsx` (104 lines) - New UI component for side drawers

### Modified
1. `src/lib/hrmStatic.ts` - Added:
   - `AttendanceRecord`, `Shift`, `Roster`, `LeaveApplication`, `LeaveBalance` types
   - `HRM_SHIFTS` (4 shifts)
   - `HRM_ATTENDANCE` (120 records, auto-generated)
   - `HRM_ROSTER` (6 entries)
   - `HRM_LEAVE_APPLICATIONS` (15 applications)
   - `HRM_LEAVE_BALANCES` (12 balances)

2. `src/components/hrm/HRMSidebar.tsx` - Added:
   - Expandable "Attendance & Leave" submenu (6 items)
   - Auto-expand state for new submenu

3. `src/pages/HRMDashboard.tsx` - Added:
   - Routing for 6 new views
   - `AttendanceView` and `LeaveView` types
   - Navigation handler updates
   - Content renderer updates

### Dependencies Added
- `recharts` - For charts and data visualization

## Demo Credentials

Access HRM Portal:
- **URL**: `/hrm/login`
- **Username**: `admin`
- **Password**: `admin123`

## Testing Checklist

- [x] Sidebar navigation to all 6 pages
- [x] Filters working on all pages
- [x] Charts rendering with static data
- [x] Modals/drawers opening and closing
- [x] Tables displaying correctly
- [x] Actions (approve, reject, etc.) updating state
- [x] Responsive design on mobile
- [x] Color coding consistent with ERP theme
- [x] Export buttons (UI only, no actual export)

## Future Enhancements (Not Implemented)

1. Actual PDF/CSV export functionality
2. Real-time attendance marking via biometric integration
3. Email notifications for leave approvals
4. Advanced analytics dashboard
5. Mobile app integration
6. Overtime calculation automation
7. Holiday calendar integration
8. Geolocation-based attendance (field staff)

## Notes

- All data is **static** and stored in `src/lib/hrmStatic.ts`
- No backend API calls or database connections
- State management via React `useState` (component-level)
- Data persists only during session (no localStorage)
- Actions are simulated (approve/reject updates local array only)
- Charts use Recharts library for consistency
- UI follows existing HRM color scheme (blue gradient sidebar)

---

**Implementation Date**: January 2025  
**Version**: 1.0  
**Status**: ✅ Complete
