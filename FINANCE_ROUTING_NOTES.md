# Finance Portal - URL Routing & Global Filters

**Status:** ✅ COMPLETE  
**Date:** December 2024

---

## 🔗 URL ROUTING STRUCTURE

All Finance routes are now **deep-linkable** with proper URL paths:

### Base Route
- **Entry:** `/finance-login` → `/finance/dashboard`

### Route Map

| URL Path | Component | Sidebar Section | Global Filter |
|----------|-----------|-----------------|---------------|
| `/finance/dashboard` | `FinanceDashboard.tsx` | Dashboard | ❌ |
| `/finance/student-ledger` | `StudentLedger.tsx` | Student Accounts | ✅ |
| `/finance/payables` | `StudentPayablesView.tsx` | Billing | ✅ |
| `/finance/late-fee` | `LateFeeAssignmentView.tsx` | Billing | ✅ |
| `/finance/drop-readmission` | `DropReadmissionView.tsx` | Billing | ✅ |
| `/finance/collect-payment` | `PaymentCollectionView.tsx` | Payments | ✅ |
| `/finance/payment-records` | `PaymentRecordsView.tsx` | Payments | ✅ |
| `/finance/waivers` | `WaiverAssignmentView.tsx` | Waiver & Scholarship | ❌ |
| `/finance/fines-holds` | `FinesHolds.tsx` | Fines & Holds | ❌ |
| `/finance/bank-recon` | `BankReconciliationView.tsx` | Bank Reconciliation | ❌ |
| `/finance/reports` | `FinanceReportsView.tsx` | Reports | ✅ |
| `/finance/employee-notices` | `EmployeeNoticesView.tsx` | Employees | ❌ |
| `/finance/setup/cost-heads` | `CostHeadSetup.tsx` | Setup | ❌ |
| `/finance/setup/cost-packages` | `CostPackageWizard.tsx` | Setup | ❌ |

**Total Routes:** 14

---

## 🎯 BREADCRUMB NAVIGATION

Implemented on all Finance views (matching PDF pattern):

```
Home / Student Finance / <Page Name>
```

**Example:**
- `/finance/payables` → "Home / Student Finance / Students Payable"
- `/finance/reports` → "Home / Student Finance / Finance Reports"

**Icons (Top-Right):**
- 📊 Analytics/Graph icon (clickable)
- 👤 User Profile icon (clickable)

**Location:** `FinanceLayout.tsx` component wraps all routes

---

## 🔍 GLOBAL FILTER BAR

### Appearance
**Sticky bar** below breadcrumb on these routes:
- Student Ledger
- Student Payables
- Late Fee Assignment
- Drop/Re-admission
- Payment Collection
- Payment Records
- Finance Reports

### Filter Fields

| Field | Type | Options |
|-------|------|---------|
| **Semester** | Dropdown | Spring 2025, Fall 2025, Summer 2025, Spring 2024, Fall 2024 |
| **Annex/Campus** | Dropdown | All, Main Campus, Permanent Campus, Uttara Campus, Banasree Campus |
| **Program** | Dropdown | All, CSE, BBA, LLB, MBA, EEE, Civil, English, BANG, BPharm |
| **Student Search** | Text Input | Search by ID or Name |
| **Search** | Button | Apply filters |

### Persistence Logic

**Storage:** `localStorage` key `finance-global-filters`

**Behavior:**
1. User sets filters on any page → saved immediately
2. Navigate to different Finance route → filters **persist**
3. Filters apply to:
   - Table filtering (combined with local search)
   - Report generation
   - Preview operations (Late Fee, Drop/Readmission)

**Example Flow:**
```
User at /finance/payables:
  - Sets: Semester = "Fall 2025", Program = "CSE"
  - Sees filtered bills

User navigates to /finance/late-fee:
  - Filter bar shows: Semester = "Fall 2025", Program = "CSE"
  - Preview shows only CSE Fall 2025 eligible bills

User navigates to /finance/payment-records:
  - Filter bar shows: Semester = "Fall 2025", Program = "CSE"
  - Table shows only CSE Fall 2025 payments
```

**Reset:** Filters persist until user changes them or clears localStorage

---

## 🔧 IMPLEMENTATION DETAILS

### Context API
**File:** `src/contexts/FinanceFilterContext.tsx`

```typescript
interface FinanceFilters {
  semester: string
  campus: string
  program: string
  studentSearch: string
}

useFinanceFilters() → { filters, setFilters, resetFilters }
```

### Layout Component
**File:** `src/components/finance/FinanceLayout.tsx`

**Props:**
- `children: ReactNode` - Page content
- `showGlobalFilter?: boolean` - Whether to show filter bar

**Features:**
- Breadcrumb generation from route path
- Top-right icons (Analytics, Profile)
- Conditional global filter bar
- Auto-saves filter changes to localStorage

### Sidebar Navigation
**File:** `src/components/finance/FinanceSidebar.tsx`

**Changes:**
- Converted from `<button onClick>` to `<Link to>`
- Uses `useLocation()` to highlight active route
- Supports expandable sections with nested routes

### Route Protection
**File:** `src/pages/FinanceDashboard.tsx`

**Wrapper:** `FinanceFilterProvider` wraps entire route tree

**Structure:**
```jsx
<FinanceFilterProvider>
  <Sidebar />
  <Routes>
    <Route path="dashboard" element={
      <FinanceLayout>
        <DashboardView />
      </FinanceLayout>
    } />
    <Route path="payables" element={
      <FinanceLayout showGlobalFilter>
        <PayablesView />
      </FinanceLayout>
    } />
    ...
  </Routes>
</FinanceFilterProvider>
```

---

## ✅ ACCEPTANCE CRITERIA

### 1. Deep Links Work
**Test:**
```
1. Copy URL: http://localhost/finance/payables
2. Paste in new tab → Opens Payables view directly
3. Refresh page → Stays on Payables view
4. Filter bar shows saved filters
```

**Result:** ✅ PASS

### 2. Global Filters Persist
**Test:**
```
1. At /finance/payables:
   - Set Semester = "Fall 2025", Program = "CSE"
2. Click sidebar → Late Fee Assignment
3. Filter bar shows: Semester = "Fall 2025", Program = "CSE"
4. Preview shows only CSE Fall 2025 bills
5. Click sidebar → Payment Records
6. Filter bar shows: Semester = "Fall 2025", Program = "CSE"
7. Table filtered to CSE Fall 2025 payments
```

**Result:** ✅ PASS

### 3. Breadcrumb Updates
**Test:**
```
1. Navigate to /finance/payables → "Home / Student Finance / Students Payable"
2. Navigate to /finance/reports → "Home / Student Finance / Finance Reports"
3. Navigate to /finance/setup/cost-heads → "Home / Student Finance / Cost Heads"
```

**Result:** ✅ PASS

### 4. Icons Present
**Test:**
```
1. Check top-right corner on any Finance route
2. See: BarChart3 icon (Analytics) + User icon (Profile)
```

**Result:** ✅ PASS

---

## 📊 FILTER INTEGRATION BY VIEW

### Student Payables
**Filters Applied:**
- ✅ Semester (matches bill.semester)
- ✅ Campus (matches bill.campus)
- ✅ Program (matches bill.program)
- ✅ Student Search (matches bill.studentId or bill.studentName)

**Combined With:** Local search box (bill no, ID, name, semester, program)

### Late Fee Assignment
**Filters Applied:**
- ✅ Semester (filters eligible bills)
- ✅ Campus (filters eligible bills)
- ✅ Program (filters eligible bills)
- ✅ Student Search (filters eligible bills)

**Preview:** Only shows bills matching global filters

### Payment Records
**Filters Applied:**
- ✅ Semester (matches payment.semester)
- ✅ Campus (matches payment.campus)
- ✅ Program (matches payment.program)
- ✅ Student Search (matches payment.studentId or payment.studentName)

**Combined With:** Local search box (receipt no, student ID, name)

### Finance Reports
**Filters Applied:**
- ✅ Semester (filters report data)
- ✅ Campus (filters report data)
- ✅ Program (filters report data)

**Combined With:** Report-specific filters (date range, payment method)

---

## 🚀 MIGRATION NOTES

**Breaking Changes:**
- Sidebar now uses React Router `<Link>` instead of state changes
- Finance views must be wrapped in `<FinanceLayout>` to show breadcrumbs
- Filter-aware views must call `useFinanceFilters()` hook

**Backwards Compatibility:**
- Old `/finance` route redirects to `/finance/dashboard`
- All seed data unchanged
- Existing components work without modification

**New Dependencies:**
- `FinanceFilterContext` (React Context)
- `FinanceLayout` (Layout component)
- `useLocation` (React Router hook)

---

## 📝 TESTING CHECKLIST

- [x] All 14 routes accessible via URL
- [x] Breadcrumb shows correct page name
- [x] Icons appear on all routes
- [x] Global filter bar appears on 7 routes
- [x] Filters persist across navigation
- [x] Filters stored in localStorage
- [x] Filters apply to table data
- [x] Sidebar highlights active route
- [x] Deep linking works (copy URL → refresh)
- [x] Nested routes work (/finance/setup/cost-heads)

---

**Implementation Complete:** ✅  
**Routes:** 14  
**Global Filter Views:** 7  
**Persistent Storage:** localStorage

*All routes now support deep linking and global filter persistence.*
