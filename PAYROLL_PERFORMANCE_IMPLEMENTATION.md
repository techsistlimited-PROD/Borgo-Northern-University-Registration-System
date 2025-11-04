# HRM.4 — Payroll & Performance Management Implementation

## Overview
Complete implementation of HRM Payroll and Performance Management subsystems with static demo data, focusing on realistic UI/UX and functional demonstration flows.

## Navigation Structure

### Payroll Submenu (5 items)
- Salary Structure → `/hrm/payroll/structure`
- Payroll Processing → `/hrm/payroll/processing`
- Salary Disbursement → `/hrm/payroll/disbursement`
- Arrears & Adjustments → `/hrm/payroll/adjustments`
- Payslip Generator → `/hrm/payroll/payslips`

### Performance Submenu (3 items)
- KPI Dashboard → `/hrm/performance/kpi`
- Appraisals → `/hrm/performance/appraisals`
- Feedback & Recommendations → `/hrm/performance/feedback`

## Static Data Models

### Payroll Data Types

#### 1. Salary Template (`SalaryTemplate`)
```typescript
{
  id: string
  grade: string (G-11, G-10, G-9, etc.)
  designation: string
  basic: number
  houseRent: number
  medical: number
  transport: number
  other: number
  total: number (auto-calculated)
  effectiveFrom: string (date)
  status: 'Active' | 'Inactive'
}
```
**Data**: 7 templates covering grades G-4 to G-11

#### 2. Payroll Record (`PayrollRecord`)
```typescript
{
  id: string
  empId: string
  name: string
  dept: string
  designation: string
  grade: string
  bankAcc: string
  paymentMode: 'Bank' | 'Cash'
  gross: number
  pf: number (10% of gross)
  tax: number (variable based on grade)
  loanDeduction: number
  netPay: number
  status: 'Pending' | 'Processed' | 'Paid'
  month: string
  year: number
}
```
**Data**: 36 records (12 employees × 3 months: Oct, Nov, Dec 2024)

#### 3. Arrear/Adjustment (`Arrear`)
```typescript
{
  id: string
  empId: string
  name: string
  dept: string
  month: string
  year: number
  type: 'Arrear' | 'Bonus' | 'Adjustment'
  description: string
  amount: number
  status: 'Pending' | 'Approved'
}
```
**Data**: 5 arrear/adjustment entries

### Performance Data Types

#### 4. KPI (`KPI`)
```typescript
{
  id: string
  department: string
  role: string
  kpi: string (KPI name)
  target: number
  achieved: number
  weight: number (percentage)
  score: number (auto-calculated)
}
```
**Data**: 10 KPIs across departments

#### 5. Appraisal (`Appraisal`)
```typescript
{
  id: string
  empId: string
  name: string
  dept: string
  designation: string
  appraisalPeriod: string (e.g., "2024 Annual")
  kpiScore: number
  peerFeedback: number (out of 5)
  supervisorFeedback: number (out of 5)
  finalScore: number
  recommendation: 'Promotion' | 'Increment' | 'Training' | 'None'
  status: 'Completed' | 'Pending'
  remarks?: string
}
```
**Data**: 8 appraisals

#### 6. Feedback (`Feedback`)
```typescript
{
  id: string
  empId: string
  empName: string
  from: string
  fromId: string
  date: string
  rating: number (1-5)
  comments: string
  type: 'Peer' | 'Supervisor' | 'Self'
}
```
**Data**: 10 feedback entries

## Components Created

### Payroll Components (5 Pages)

#### 1. Salary Structure (`SalaryStructure.tsx`)
**Path**: `src/components/hrm/payroll/SalaryStructure.tsx`

**Features**:
- Add Template modal with auto-sum total calculation
- Filters: Grade, Status
- Horizontal bar chart showing average salary per grade
- Table with full breakdown: Basic, House Rent, Medical, Transport, Other, Total
- Actions: View, Edit, Archive
- Status badges: Active (blue), Inactive (gray)

**Charts**: Recharts (Horizontal Bar)

#### 2. Payroll Processing (`PayrollProcessing.tsx`)
**Path**: `src/components/hrm/payroll/PayrollProcessing.tsx`

**Features**:
- 4 summary cards: Pending, Processed, Paid, Total Employees
- Filters: Month, Year, Dept, Status
- Side drawer with salary breakdown showing:
  - Earnings section (template components)
  - Deductions section (PF, Tax, Loan)
  - Net Pay calculation
- Actions: View Details, Process Payroll (Pending→Processed), Mark Paid (Processed→Paid)
- Export buttons: CSV, Bank Statement

**Status Flow**: Pending → Processed → Paid

#### 3. Salary Disbursement (`SalaryDisbursement.tsx`)
**Path**: `src/components/hrm/payroll/SalaryDisbursement.tsx`

**Features**:
- Filters: Month, Year, Dept, Payment Mode
- Pie chart: Bank vs Cash distribution
- Table: EmpID, Name, Bank Account, Mode, Net Pay, Payment Date, Status
- Only shows **Paid** records
- Download Bank Statement button

**Charts**: Recharts (Pie)

#### 4. Arrears & Adjustments (`ArrearsAdjustments.tsx`)
**Path**: `src/components/hrm/payroll/ArrearsAdjustments.tsx`

**Features**:
- Add Adjustment modal with form
- Filters: Dept, Month, Year, Type, Status
- Table with type badges:
  - Arrear (orange)
  - Bonus (green)
  - Adjustment (blue)
- Status: Pending (gray), Approved (blue)

#### 5. Payslip Generator (`PayslipGenerator.tsx`)
**Path**: `src/components/hrm/payroll/PayslipGenerator.tsx`

**Features**:
- Filters: Month, Year, Dept, Employee
- Generate Payslip button → Opens formatted PDF preview modal
- Payslip template includes:
  - University header with logo placeholder
  - Employee details (ID, Name, Designation, Dept, Grade, Bank Account)
  - Earnings table (Basic, House Rent, Medical, Transport, Other)
  - Deductions table (PF, Tax, Loan)
  - Net Pay with amount in words converter
  - HR authorization footer
- Download PDF button

**Special Feature**: `numberToWords()` function converts net pay to words (e.g., "Eighty Five Thousand Taka Only")

### Performance Components (3 Pages)

#### 6. KPI Dashboard (`KPIDashboard.tsx`)
**Path**: `src/components/hrm/performance/KPIDashboard.tsx`

**Features**:
- 4 summary cards: Avg KPI Score, Best Dept, Lowest Performer, Pending Reviews
- Filters: Dept, Role, Period
- Radar chart: Target vs Achieved per department/KPI
- Table: KPI, Target, Achieved, Weight, Score, Dept, Remarks

**Charts**: Recharts (Radar)

#### 7. Appraisals (`Appraisals.tsx`)
**Path**: `src/components/hrm/performance/Appraisals.tsx`

**Features**:
- Filters: Dept, Period, Status
- Table with full appraisal data
- Side drawer with 4 tabs:
  1. **Overview**: Employee info + Performance scores (KPI, Peer, Supervisor, Final)
  2. **Feedback**: Collated feedback entries with star ratings
  3. **Recommendation**: Update recommendation dropdown (Promotion/Increment/Training/None) + remarks
  4. **History**: Past 3 appraisals (static)
- Recommendation badges:
  - Promotion (purple)
  - Increment (blue)
  - Training (orange)
  - None (gray)
- Actions: View, Download Report

#### 8. Feedback & Recommendations (`FeedbackRecommendations.tsx`)
**Path**: `src/components/hrm/performance/FeedbackRecommendations.tsx`

**Features**:
- Add Feedback modal with employee selector, rating (1-5), comments
- 3 summary cards: Avg Peer, Supervisor, Self ratings
- Filters: Dept, Type, Rating Range
- Bar chart: Star rating distribution (1★ to 5★ count)
- Table: Date, From, To, Type, Rating (visual stars), Comments
- Interactive star display: ★★★★★ (filled/unfilled based on rating)

**Charts**: Recharts (Bar)

## UI/UX Features

### Color Palette (Consistent with HRM Theme)
- **Primary**: Blue gradient (`from-blue-600 to-blue-800`)
- **Success**: Green (`#22c55e`, `from-green-500 to-green-600`)
- **Warning**: Yellow (`#f59e0b`, `from-yellow-500 to-yellow-600`)
- **Danger**: Red (`#ef4444`, `from-red-500 to-red-600`)
- **Info**: Blue (`#3b82f6`, `from-blue-500 to-blue-600`)
- **Special**: Purple (`from-purple-500 to-purple-600`)

### Status Color Coding

**Payroll Status**:
- Pending: Yellow (`bg-yellow-100 text-yellow-800`)
- Processed: Blue (`bg-blue-100 text-blue-800`)
- Paid: Green (`bg-green-100 text-green-800`)

**Arrear Types**:
- Arrear: Orange
- Bonus: Green
- Adjustment: Blue

**Appraisal Status**:
- Completed: Green
- Pending: Yellow (secondary)

**Recommendations**:
- Promotion: Purple
- Increment: Blue
- Training: Orange
- None: Gray

### Interactive Elements
- All actions trigger state updates with immediate UI reflection
- Toast confirmations for actions (Process Payroll, Mark Paid, etc.)
- Modals/drawers for detailed views
- Sticky table headers for scrolling
- Responsive design (grid cards collapse on mobile)
- Export buttons (PDF/CSV/Excel) - UI only, no actual export

### Charts & Widgets

**Payroll**:
- 1 Horizontal Bar Chart: Salary by grade
- 1 Pie Chart: Bank vs Cash distribution

**Performance**:
- 1 Radar Chart: Target vs Achieved KPIs
- 1 Bar Chart: Rating distribution

**Library**: Recharts v2.x

## Files Modified/Created

### Created
1. `src/lib/payrollPerformanceStatic.ts` (645 lines) - All static data and types
2. `src/components/hrm/payroll/SalaryStructure.tsx` (340 lines)
3. `src/components/hrm/payroll/PayrollProcessing.tsx` (361 lines)
4. `src/components/hrm/payroll/SalaryDisbursement.tsx` (192 lines)
5. `src/components/hrm/payroll/ArrearsAdjustments.tsx` (282 lines)
6. `src/components/hrm/payroll/PayslipGenerator.tsx` (278 lines)
7. `src/components/hrm/performance/KPIDashboard.tsx` (212 lines)
8. `src/components/hrm/performance/Appraisals.tsx` (303 lines)
9. `src/components/hrm/performance/FeedbackRecommendations.tsx` (303 lines)

### Modified
1. `src/components/hrm/HRMSidebar.tsx`:
   - Added Payroll submenu (5 items)
   - Added Performance submenu (3 items)
   - Updated expanded items state to include both

2. `src/pages/HRMDashboard.tsx`:
   - Added imports for 8 new components
   - Added `PayrollView` and `PerformanceView` types
   - Updated navigation handler for new routes
   - Updated content renderer for new views

## Demo Credentials

Access HRM Portal:
- **URL**: `/hrm/login`
- **Username**: `admin`
- **Password**: `admin123`

Navigate to:
- **Payroll**: Click "Payroll" in sidebar → Select any submenu item
- **Performance**: Click "Performance" in sidebar → Select any submenu item

## Sample Data Summary

### Payroll
- **Salary Templates**: 7 (G-4 to G-11, ranging from ৳45,000 to ৳145,000)
- **Payroll Records**: 36 (12 employees × 3 months)
- **Arrears/Adjustments**: 5 entries
- **Payment Modes**: ~90% Bank, ~10% Cash

### Performance
- **KPIs**: 10 entries across 4 departments
- **Appraisals**: 8 employees (mix of Completed/Pending)
- **Feedback**: 10 entries (Peer/Supervisor/Self)
- **Ratings**: 1-5 stars with distribution

## Tax & Deduction Logic

### Provident Fund (PF)
- **Rate**: 10% of gross salary
- **Applied to**: All employees

### Income Tax
- **G-11, G-10**: 15% of gross
- **G-9, G-7**: 12% of gross
- **G-6, G-5, G-4**: 8% of gross

### Loan Deduction
- **Specific employees only** (e.g., EMP-2025-002: ৳5,000, EMP-2025-008: ৳3,000)

### Net Pay Calculation
```
Net Pay = Gross - (PF + Tax + Loan Deduction)
```

## Testing Checklist

- [x] Sidebar navigation to all 8 pages
- [x] Filters working correctly on all pages
- [x] Charts rendering with static data
- [x] Modals/drawers opening and closing
- [x] Tables displaying correctly
- [x] Actions updating state (Process, Mark Paid, Add, etc.)
- [x] Status badges with correct colors
- [x] Currency formatting (৳ symbol with localeString)
- [x] Responsive design
- [x] Number to words converter in payslip
- [x] Star rating display in feedback

## Future Enhancements (Not Implemented)

1. Actual PDF/CSV/Excel export functionality
2. Email notifications for payroll processing
3. Bank file generation for direct deposit
4. Tax calculation based on real Bangladesh tax slabs
5. Overtime and bonus calculation automation
6. Integration with attendance for auto-calculation
7. Multi-month bulk processing
8. Advanced analytics dashboards
9. 360-degree feedback system
10. Goal-setting and tracking for KPIs

## Notes

- All data is **static** and stored in `src/lib/payrollPerformanceStatic.ts`
- No backend API calls or database connections
- State management via React `useState` (component-level)
- Data persists only during session (no localStorage)
- Actions are simulated (process/approve updates local array only)
- Charts use Recharts library for consistency
- UI follows existing HRM color scheme (blue gradient sidebar)
- All monetary values use Bangladesh Taka (৳) symbol
- Number formatting uses `toLocaleString()` for readability

---

**Implementation Date**: January 2025  
**Version**: 1.0  
**Status**: ✅ Complete  
**Total Components**: 8 pages + 1 data file  
**Total Lines of Code**: ~2,900
