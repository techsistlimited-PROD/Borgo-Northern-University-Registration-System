# HRM Export & Print Utilities - Usage Examples

Quick reference guide for developers working with HRM modules.

---

## Export Naming Examples

### Import the Utility

```typescript
import { generateHRMExportFilename } from '@/lib/hrmUtils'
```

### Daily Reports

```typescript
// Daily Present Report
const filename = generateHRMExportFilename(
  'daily-present',        // Report type
  'CSE',                  // Department
  'Permanent Campus',     // Campus
  '2025-01-31',          // Date (YYYY-MM-DD)
  'csv'                   // Extension
)
// Result: daily-present-cse-permanent-campus-31-01-2025.csv

// Daily Absent Report
const filename = generateHRMExportFilename(
  'daily-absent',
  'BBA',
  'Banani',
  '2025-08-15',
  'csv'
)
// Result: daily-absent-bba-banani-15-08-2025.csv

// Daily Summary (All Departments, All Campuses)
const filename = generateHRMExportFilename(
  'daily-summary',
  'all',
  'all',
  '2025-01-31',
  'csv'
)
// Result: daily-summary-all-departments-all-campuses-31-01-2025.csv
```

### Monthly Reports

```typescript
// Monthly Department Summary
const filename = generateHRMExportFilename(
  'monthly-summary',
  'CSE',
  'Permanent',
  '2025-08',           // Month (YYYY-MM)
  'xlsx'               // Excel format
)
// Result: monthly-summary-cse-permanent-08-2025.xlsx

// Individual Monthly Report
const filename = generateHRMExportFilename(
  'individual-report',
  'HRD',              // Employee's department
  'Main Campus',
  '2025-08',
  'csv',
  '108514'            // Employee ID (optional parameter)
)
// Result: individual-report-108514-hrd-08-2025.csv
```

### Payroll Reports (Future Use)

```typescript
// Monthly Payslip
const filename = generateHRMExportFilename(
  'payslip',
  employee.department,
  employee.campus,
  '2025-08',
  'pdf',
  employee.id
)
// Result: payslip-108514-cse-08-2025.pdf

// Salary Disbursement Report
const filename = generateHRMExportFilename(
  'salary-disbursement',
  'all',
  'all',
  '2025-08',
  'xlsx'
)
// Result: salary-disbursement-all-departments-all-campuses-08-2025.xlsx
```

### Performance Reports (Future Use)

```typescript
// Appraisal Report
const filename = generateHRMExportFilename(
  'appraisal',
  'CSE',
  'Permanent',
  '2025-06',
  'pdf',
  'EMP-2024-001'
)
// Result: appraisal-emp-2024-001-cse-06-2025.pdf

// KPI Dashboard Export
const filename = generateHRMExportFilename(
  'kpi-dashboard',
  'BBA',
  'Banani',
  '2025-08',
  'xlsx'
)
// Result: kpi-dashboard-bba-banani-08-2025.xlsx
```

---

## Slugification Examples

### Import the Utility

```typescript
import { slugify } from '@/lib/hrmUtils'
```

### Common Cases

```typescript
slugify('CSE')                    // 'cse'
slugify('Business & Admin')       // 'business-admin'
slugify('Permanent Campus')       // 'permanent-campus'
slugify('All Departments')        // 'all-departments'
slugify('BBA (Hons.)')           // 'bba-hons'
slugify('IT & Software')          // 'it-software'
slugify('Human Resources Dept.')  // 'human-resources-dept'
slugify('Main Campus - Block A')  // 'main-campus-block-a'
```

---

## PrintSection Component Examples

### Import the Component

```typescript
import PrintSection from '@/components/hrm/reports/PrintSection'
```

### Basic Usage

```typescript
<div className="hidden print:block">
  <PrintSection
    title="Daily Report : Present"
    subtitle="CSE, Permanent Campus"
    dateLine="Date : 31/01/2025"
    pageCount={1}
    currentPage={1}
  >
    <table className="w-full border-collapse">
      {/* Your table content */}
    </table>
  </PrintSection>
</div>
```

### Multi-Page Report

```typescript
// Page 1
<div className="hidden print:block">
  <PrintSection
    title="Monthly Attendance Report"
    subtitle="All Departments"
    dateLine="Month : January 2025"
    pageCount={3}
    currentPage={1}
  >
    {/* Page 1 content */}
  </PrintSection>
</div>

// Page 2 (with page break)
<div className="hidden print:block page-break">
  <PrintSection
    title="Monthly Attendance Report"
    subtitle="All Departments"
    dateLine="Month : January 2025"
    pageCount={3}
    currentPage={2}
  >
    {/* Page 2 content */}
  </PrintSection>
</div>
```

### Auto-Print on Load

```typescript
// Trigger print automatically when component mounts
<PrintSection
  title="Payslip"
  subtitle={`${employee.name} - ${employee.designation}`}
  dateLine={`Month : ${month}`}
  pageCount={1}
  currentPage={1}
  autoPrint={true}  // Will print automatically after 100ms
>
  {/* Payslip content */}
</PrintSection>
```

### Payslip Example

```typescript
const PayslipPrint = ({ employee, payrollData, month }) => {
  return (
    <div className="hidden print:block">
      <PrintSection
        title="Payslip"
        subtitle={`${employee.name} - ${employee.department}`}
        dateLine={`Month: ${month}`}
        pageCount={1}
        currentPage={1}
        autoPrint={false}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p><strong>Employee ID:</strong> {employee.id}</p>
              <p><strong>Designation:</strong> {employee.designation}</p>
              <p><strong>Department:</strong> {employee.department}</p>
            </div>
            <div>
              <p><strong>Grade:</strong> {employee.grade}</p>
              <p><strong>Bank Account:</strong> {payrollData.bankAccount}</p>
              <p><strong>Payment Mode:</strong> {payrollData.mode}</p>
            </div>
          </div>

          <table className="w-full border-collapse border">
            <thead>
              <tr className="bg-gray-50">
                <th className="border px-3 py-2">Earnings</th>
                <th className="border px-3 py-2 text-right">Amount</th>
                <th className="border px-3 py-2">Deductions</th>
                <th className="border px-3 py-2 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {/* Salary components */}
            </tbody>
          </table>

          <div className="text-right font-bold">
            Net Salary: {payrollData.netSalary}
          </div>
        </div>
      </PrintSection>
    </div>
  )
}
```

### Training Certificate Example

```typescript
const TrainingCertificatePrint = ({ employee, training }) => {
  return (
    <div className="hidden print:block">
      <PrintSection
        title="Training Certificate"
        subtitle={training.name}
        dateLine={`Date: ${training.completionDate}`}
        pageCount={1}
        currentPage={1}
        autoPrint={true}
      >
        <div className="text-center space-y-6 mt-8">
          <p className="text-lg">This is to certify that</p>
          <p className="text-2xl font-bold">{employee.name}</p>
          <p className="text-lg">({employee.designation}, {employee.department})</p>
          <p className="text-lg">has successfully completed</p>
          <p className="text-xl font-bold">{training.name}</p>
          <p className="text-lg">on {training.completionDate}</p>
          <p className="text-lg mt-8">Duration: {training.duration} hours</p>
          <p className="text-lg">Score: {training.score}%</p>
        </div>
      </PrintSection>
    </div>
  )
}
```

---

## Complete Export Handler Example

### Daily Attendance Export

```typescript
import { generateHRMExportFilename } from '@/lib/hrmUtils'

const handleDailyAttendanceExport = () => {
  // 1. Prepare data
  const headers = ['SL', 'ID', 'Name', 'Status', 'In Time', 'Out Time']
  const rows = attendanceRecords.map((record, index) => [
    index + 1,
    record.empId,
    record.name,
    record.status,
    record.inTime,
    record.outTime
  ])

  // 2. Generate CSV content
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n')

  // 3. Create blob and download link
  const blob = new Blob([csvContent], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url

  // 4. Generate standardized filename
  const filename = generateHRMExportFilename(
    'daily-present',
    selectedDepartment,
    selectedCampus,
    selectedDate,
    'csv'
  )

  a.download = filename
  a.click()

  // 5. Cleanup
  URL.revokeObjectURL(url)
}
```

---

## Date Format Utilities

### Import the Utilities

```typescript
import { formatDateForFilename, formatMonthForFilename } from '@/lib/hrmUtils'
```

### Usage

```typescript
// Convert YYYY-MM-DD to DD-MM-YYYY
formatDateForFilename('2025-01-31')
// Result: '31-01-2025'

// Convert YYYY-MM to MM-YYYY
formatMonthForFilename('2025-08')
// Result: '08-2025'
```

---

## Best Practices

### 1. Always Use Unified Naming
❌ **Bad:**
```typescript
a.download = `attendance_${dept}_${campus}_${date}.csv`
```

✅ **Good:**
```typescript
const filename = generateHRMExportFilename('daily-summary', dept, campus, date)
a.download = filename
```

### 2. Use Descriptive Report Types
❌ **Bad:**
```typescript
generateHRMExportFilename('report', dept, campus, date)
```

✅ **Good:**
```typescript
generateHRMExportFilename('monthly-summary', dept, campus, date)
generateHRMExportFilename('individual-report', dept, campus, date)
generateHRMExportFilename('payslip', dept, campus, date)
```

### 3. Include Employee ID for Individual Reports
❌ **Bad:**
```typescript
generateHRMExportFilename('individual', dept, campus, date)
```

✅ **Good:**
```typescript
generateHRMExportFilename('individual-report', dept, campus, date, 'csv', employeeId)
```

### 4. Wrap Print Content, Don't Replace It
❌ **Bad (replacing existing structure):**
```typescript
<PrintSection>
  <PrintableHeader />  {/* Duplicate! PrintSection already includes this */}
  <table>...</table>
</PrintSection>
```

✅ **Good:**
```typescript
<PrintSection title="..." subtitle="..." dateLine="...">
  <table>...</table>  {/* PrintableHeader automatically included */}
</PrintSection>
```

---

## Quick Reference Table

| Task | Function/Component | Example |
|------|-------------------|---------|
| Slugify text | `slugify(text)` | `slugify('CSE Dept.')` → `'cse-dept'` |
| Format date for filename | `formatDateForFilename(date)` | `formatDateForFilename('2025-01-31')` → `'31-01-2025'` |
| Format month for filename | `formatMonthForFilename(month)` | `formatMonthForFilename('2025-08')` → `'08-2025'` |
| Generate export filename | `generateHRMExportFilename(...)` | See examples above |
| Print wrapper | `<PrintSection>` | See examples above |

---

*End of Usage Examples*
