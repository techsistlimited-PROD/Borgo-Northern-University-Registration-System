# Oracle Database Integration Guide

## Overview
This guide explains how to integrate the new Oracle database data services into the existing Finance and HRM portal views.

## Architecture

The integration follows a three-layer architecture:

```
Views (React Components)
    ↓
Data Services (financeDataService, hrmDataService)
    ↓
Repository Pattern (Repo) or Oracle API
```

## Data Services

### Finance Data Service
**Location:** `src/finance/services/financeDataService.ts`
**Export:** `financeDataService`

**Key Methods:**
- `getBills(filters?)` - Retrieve bills with optional filters
- `createBill(bill)` - Create a new bill
- `updateBill(id, updates)` - Update existing bill
- `deleteBill(id)` - Delete a bill
- `getPayments(filters?)` - Retrieve payments
- `createPayment(payment)` - Record new payment
- `getCostHeads()` - Get all cost heads
- `getCostPackages(filters?)` - Get cost packages
- `getLateFees(filters?)` - Get late fees
- `getWaivers()` - Get waiver policies
- `getWaiverAssignments(filters?)` - Get assigned waivers
- `getStudents(filters?)` - Get student list

**Configuration:**
```typescript
import { financeDataService } from '@/finance/services/financeDataService'

// Use default mock data
// No configuration needed

// Or configure for Oracle:
financeDataService.setUseOracle(true, 'https://api.example.com')
```

### HRM Data Service
**Location:** `src/components/hrm/services/hrmDataService.ts`
**Export:** `hrmDataService`

**Key Methods:**
- `getEmployees(filters?)` - Retrieve employees
- `createEmployee(emp)` - Create new employee
- `updateEmployee(id, updates)` - Update employee
- `getDesignations()` - Get all designations
- `getDepartments()` - Get all departments
- `getAttendance(filters?)` - Retrieve attendance records
- `recordAttendance(attendance)` - Record new attendance
- `getLeaveApplications(filters?)` - Get leave applications
- `applyLeave(leave)` - Apply for leave
- `approveLeave(leaveId, approvedBy)` - Approve leave application
- `getSalaryStructures(filters?)` - Get salary structures
- `getPayroll(filters?)` - Get payroll data
- `generatePayslip(payslip)` - Generate payslip

**Configuration:**
```typescript
import { hrmDataService } from '@/components/hrm/services/hrmDataService'

// Use default mock data
// No configuration needed

// Or configure for Oracle:
hrmDataService.setUseOracle(true, 'https://api.example.com')
```

## Usage Examples

### Example 1: Update Finance Bill View

**Before (Using Repo):**
```typescript
import { Repo } from '@/lib/repo'

export default function StudentPayablesView() {
  const [bills, setBills] = useState<StudentBill[]>([])

  useEffect(() => {
    const baseBills = Repo.get<StudentBill>('finance-student-bills')
    setBills(baseBills)
  }, [])
}
```

**After (Using financeDataService):**
```typescript
import { financeDataService } from '@/finance/services/financeDataService'
import { FinanceBill } from '@/lib/oracleSchema'

export default function StudentPayablesView() {
  const [bills, setBills] = useState<FinanceBill[]>([])

  useEffect(() => {
    const loadBills = async () => {
      const bills = await financeDataService.getBills()
      setBills(bills)
    }
    loadBills()

    // Subscribe to updates
    const unsubscribe = financeDataService.subscribeToBills(setBills)
    return unsubscribe
  }, [])
}
```

### Example 2: Create Payment in Finance

**Using financeDataService:**
```typescript
const handleCreatePayment = async (paymentData: any) => {
  try {
    const payment = await financeDataService.createPayment({
      receiptNo: `RCP-${Date.now()}`,
      billId: selectedBill.id,
      paymentDate: new Date().toISOString(),
      amount: paymentData.amount,
      method: paymentData.method,
      status: 'Pending'
    })
    
    // Optionally update bill status
    if (payment) {
      await financeDataService.updateBill(selectedBill.id, {
        status: 'Partial'
      })
    }
  } catch (error) {
    console.error('Payment creation failed:', error)
  }
}
```

### Example 3: Update HRM Employee View

**Before (Using Static Data):**
```typescript
import { HRM_EMPLOYEES } from '@/lib/hrmStatic'

export default function HRMEmployeeList() {
  const [employees, setEmployees] = useState(HRM_EMPLOYEES)
}
```

**After (Using hrmDataService):**
```typescript
import { hrmDataService } from '@/components/hrm/services/hrmDataService'
import { HrmEiEmp } from '@/lib/oracleSchema'

export default function HRMEmployeeList() {
  const [employees, setEmployees] = useState<HrmEiEmp[]>([])

  useEffect(() => {
    const loadEmployees = async () => {
      const emps = await hrmDataService.getEmployees()
      setEmployees(emps)
    }
    loadEmployees()

    // Subscribe to updates
    const unsubscribe = hrmDataService.subscribeToEmployees(setEmployees)
    return unsubscribe
  }, [])
}
```

### Example 4: Record Attendance

**Using hrmDataService:**
```typescript
const handleRecordAttendance = async (empId: string, status: string) => {
  try {
    const attendance = await hrmDataService.recordAttendance({
      empId,
      attendanceDate: new Date().toISOString().split('T')[0],
      status: status as 'Present' | 'Absent' | 'Leave' | 'Half Day',
      checkInTime: new Date().toISOString()
    })

    if (attendance) {
      showSuccessMessage('Attendance recorded successfully')
      await refreshAttendance()
    }
  } catch (error) {
    console.error('Failed to record attendance:', error)
  }
}
```

## Integration Steps

### Step 1: Update Import Statements
Replace mock data imports with data service imports:
```typescript
// OLD
import { studentBillsStatic } from '@/finance/data/staticSeeds'
import { HRM_EMPLOYEES } from '@/lib/hrmStatic'

// NEW
import { financeDataService } from '@/finance/services/financeDataService'
import { hrmDataService } from '@/components/hrm/services/hrmDataService'
import { FinanceBill, HrmEiEmp } from '@/lib/oracleSchema'
```

### Step 2: Update State and Effects
Replace synchronous Repo calls with async service methods:
```typescript
// OLD
useEffect(() => {
  const data = Repo.get<StudentBill>('finance-student-bills')
  setData(data)
}, [])

// NEW
useEffect(() => {
  const loadData = async () => {
    const data = await financeDataService.getBills()
    setData(data)
  }
  loadData()
}, [])
```

### Step 3: Configure for Oracle (Optional)
In your app initialization code:
```typescript
import { financeDataService } from '@/finance/services/financeDataService'
import { hrmDataService } from '@/components/hrm/services/hrmDataService'

// Initialize when app starts
const initializeServices = () => {
  const oracleEnabled = import.meta.env.VITE_ORACLE_ENABLED === 'true'
  const oracleApiUrl = import.meta.env.VITE_ORACLE_API_URL

  if (oracleEnabled && oracleApiUrl) {
    financeDataService.setUseOracle(true, oracleApiUrl)
    hrmDataService.setUseOracle(true, oracleApiUrl)
  }
}

// Call in App.tsx or main.tsx
initializeServices()
```

### Step 4: Update Environment Variables
Add to your `.env` file:
```
VITE_ORACLE_ENABLED=false
VITE_ORACLE_API_URL=http://localhost:3001
```

## Entity Mappings

### Finance Entities
- `FinanceBill` - Maps to `FINANCE_BILL` table
- `FinancePayment` - Maps to `FINANCE_PAYMENT` table
- `FinanceCostHead` - Maps to `FINANCE_COST_HEAD` table
- `FinanceCostPackage` - Maps to `FINANCE_COST_PACKAGE` table
- `FinanceLateFee` - Maps to `FINANCE_LATE_FEE` table
- `FinanceWaiver` - Maps to `FINANCE_WAIVER` table
- `FinanceWaiverAssignment` - Maps to `FINANCE_WAIVER_ASSIGNMENT` table

### HRM Entities
- `HrmEiEmp` - Maps to `HRM_EI_EMP` table
- `HrmStpDesig` - Maps to `HRM_STP_DESIG` table
- `HrmStpDept` - Maps to `HRM_STP_DEPT` table
- `HrmAttendance` - Maps to `HRM_ATTENDANCE` table
- `HrmLeaveApplication` - Maps to `HRM_LEAVE_APPLICATION` table
- `HrmSalaryStructure` - Maps to `HRM_SALARY_STRUCTURE` table
- `HrmPayroll` - Maps to `HRM_PAYROLL` table
- `HrmPayslip` - Maps to `HRM_PAYSLIP` table

## Backward Compatibility

The data services automatically fall back to storage (localStorage) if Oracle is not configured or if there's an error. This ensures:
- Existing views continue to work with mock data
- Gradual migration to Oracle is possible
- No breaking changes to existing functionality

## Migration Timeline

1. **Phase 1:** Data service creation ✅
2. **Phase 2:** Update Finance views to use financeDataService
3. **Phase 3:** Update HRM views to use hrmDataService
4. **Phase 4:** Create Oracle API backend
5. **Phase 5:** Enable Oracle in production

## Troubleshooting

### Data not loading?
1. Check if Oracle is enabled: `financeDataService.config.useOracle`
2. Verify API URL is configured
3. Check browser console for errors
4. Fallback data will load from storage

### Type mismatches?
- Import types from `@/lib/oracleSchema` instead of local type files
- Use `FinanceBill`, `HrmEiEmp`, etc. for consistency

### Performance issues?
- Use filtering parameters to reduce data load
- Implement pagination for large datasets
- Consider caching strategies

## Next Steps

1. Choose a Finance view to update first (suggested: `StudentPayablesView`)
2. Replace Repo calls with financeDataService
3. Update types to use Oracle schema types
4. Test with mock data
5. Repeat for other views
6. Once all views are updated, implement Oracle API backend
