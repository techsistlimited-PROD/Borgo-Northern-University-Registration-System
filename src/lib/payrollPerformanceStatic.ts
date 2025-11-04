import { HRM_EMPLOYEES } from './hrmStatic'

// Re-export HRM_EMPLOYEES for components that need it
export { HRM_EMPLOYEES }

// Payroll Types
export type SalaryTemplate = {
  id: string
  grade: string
  designation: string
  basic: number
  houseRent: number
  medical: number
  transport: number
  other: number
  total: number
  effectiveFrom: string
  status: 'Active' | 'Inactive'
}

export type PayrollRecord = {
  id: string
  empId: string
  name: string
  dept: string
  designation: string
  grade: string
  bankAcc: string
  paymentMode: 'Bank' | 'Cash'
  gross: number
  pf: number
  tax: number
  loanDeduction: number
  netPay: number
  status: 'Pending' | 'Processed' | 'Paid'
  month: string
  year: number
}

export type DeductionAddition = {
  id: string
  type: 'PF' | 'Tax' | 'Loan' | 'Overtime' | 'Bonus' | 'Penalty' | 'Incentive'
  category: 'Deduction' | 'Addition'
  amount: number
  remarks: string
}

export type Arrear = {
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

// Performance Types
export type KPI = {
  id: string
  department: string
  role: string
  kpi: string
  target: number
  achieved: number
  weight: number
  score: number
}

export type Appraisal = {
  id: string
  empId: string
  name: string
  dept: string
  designation: string
  appraisalPeriod: string
  kpiScore: number
  peerFeedback: number
  supervisorFeedback: number
  finalScore: number
  recommendation: 'Promotion' | 'Increment' | 'Training' | 'None'
  status: 'Completed' | 'Pending'
  remarks?: string
}

export type Feedback = {
  id: string
  empId: string
  empName: string
  from: string
  fromId: string
  date: string
  rating: number
  comments: string
  type: 'Peer' | 'Supervisor' | 'Self'
}

// Static Data: Salary Templates
export const SALARY_TEMPLATES: SalaryTemplate[] = [
  {
    id: 'ST-001',
    grade: 'G-11',
    designation: 'Dean/Professor',
    basic: 80000,
    houseRent: 40000,
    medical: 10000,
    transport: 5000,
    other: 10000,
    total: 145000,
    effectiveFrom: '2024-01-01',
    status: 'Active'
  },
  {
    id: 'ST-002',
    grade: 'G-10',
    designation: 'Professor',
    basic: 70000,
    houseRent: 35000,
    medical: 10000,
    transport: 5000,
    other: 8000,
    total: 128000,
    effectiveFrom: '2024-01-01',
    status: 'Active'
  },
  {
    id: 'ST-003',
    grade: 'G-9',
    designation: 'Associate Professor',
    basic: 60000,
    houseRent: 30000,
    medical: 8000,
    transport: 4000,
    other: 6000,
    total: 108000,
    effectiveFrom: '2024-01-01',
    status: 'Active'
  },
  {
    id: 'ST-004',
    grade: 'G-7',
    designation: 'Assistant Professor',
    basic: 45000,
    houseRent: 22500,
    medical: 6000,
    transport: 3500,
    other: 5000,
    total: 82000,
    effectiveFrom: '2024-01-01',
    status: 'Active'
  },
  {
    id: 'ST-005',
    grade: 'G-6',
    designation: 'Lecturer',
    basic: 35000,
    houseRent: 17500,
    medical: 5000,
    transport: 3000,
    other: 4000,
    total: 64500,
    effectiveFrom: '2024-01-01',
    status: 'Active'
  },
  {
    id: 'ST-006',
    grade: 'G-5',
    designation: 'Assistant Manager/Librarian',
    basic: 30000,
    houseRent: 15000,
    medical: 4000,
    transport: 2500,
    other: 3000,
    total: 54500,
    effectiveFrom: '2024-01-01',
    status: 'Active'
  },
  {
    id: 'ST-007',
    grade: 'G-4',
    designation: 'Officer',
    basic: 25000,
    houseRent: 12500,
    medical: 3000,
    transport: 2000,
    other: 2500,
    total: 45000,
    effectiveFrom: '2024-01-01',
    status: 'Active'
  }
]

// Generate payroll records for 12 employees × 3 months
const generatePayrollRecords = (): PayrollRecord[] => {
  const records: PayrollRecord[] = []
  const months = ['October', 'November', 'December']
  const year = 2024
  
  HRM_EMPLOYEES.filter(e => e.status === 'Active').forEach(emp => {
    const template = SALARY_TEMPLATES.find(t => t.grade === emp.grade)
    if (!template) return
    
    months.forEach((month, idx) => {
      const gross = template.total
      const pf = Math.round(gross * 0.1)
      const tax = emp.grade.includes('11') || emp.grade.includes('10') ? Math.round(gross * 0.15) :
                  emp.grade.includes('9') || emp.grade.includes('7') ? Math.round(gross * 0.12) :
                  Math.round(gross * 0.08)
      const loanDeduction = emp.id === 'EMP-2025-002' ? 5000 : emp.id === 'EMP-2025-008' ? 3000 : 0
      const netPay = gross - pf - tax - loanDeduction
      
      const status: PayrollRecord['status'] = 
        idx === 0 ? 'Paid' : idx === 1 ? 'Processed' : 'Pending'
      
      records.push({
        id: `PR-${emp.id}-${year}-${(idx + 10).toString().padStart(2, '0')}`,
        empId: emp.id,
        name: emp.name,
        dept: emp.department,
        designation: emp.designation,
        grade: emp.grade,
        bankAcc: `${Math.floor(Math.random() * 9000000000) + 1000000000}`,
        paymentMode: Math.random() > 0.1 ? 'Bank' : 'Cash',
        gross,
        pf,
        tax,
        loanDeduction,
        netPay,
        status,
        month,
        year
      })
    })
  })
  
  return records
}

export const PAYROLL_RECORDS: PayrollRecord[] = generatePayrollRecords()

export const DEDUCTIONS_ADDITIONS: DeductionAddition[] = [
  { id: 'DA-001', type: 'PF', category: 'Deduction', amount: 0, remarks: 'Provident Fund @ 10%' },
  { id: 'DA-002', type: 'Tax', category: 'Deduction', amount: 0, remarks: 'Income Tax (Variable)' },
  { id: 'DA-003', type: 'Loan', category: 'Deduction', amount: 0, remarks: 'Loan Repayment' },
  { id: 'DA-004', type: 'Overtime', category: 'Addition', amount: 0, remarks: 'Overtime Payment' },
  { id: 'DA-005', type: 'Bonus', category: 'Addition', amount: 0, remarks: 'Performance Bonus' },
  { id: 'DA-006', type: 'Penalty', category: 'Deduction', amount: 0, remarks: 'Late/Absence Penalty' },
  { id: 'DA-007', type: 'Incentive', category: 'Addition', amount: 0, remarks: 'Special Incentive' }
]

export const ARREARS: Arrear[] = [
  {
    id: 'ARR-001',
    empId: 'EMP-2025-001',
    name: 'Dr. Ayesha Karim',
    dept: 'CSE',
    month: 'September',
    year: 2024,
    type: 'Arrear',
    description: 'Salary arrear for promotion adjustment',
    amount: 15000,
    status: 'Approved'
  },
  {
    id: 'ARR-002',
    empId: 'EMP-2025-006',
    name: 'Dr. Farhan Chowdhury',
    dept: 'CSE',
    month: 'November',
    year: 2024,
    type: 'Bonus',
    description: 'Research publication bonus',
    amount: 25000,
    status: 'Approved'
  },
  {
    id: 'ARR-003',
    empId: 'EMP-2025-008',
    name: 'Rafiqul Islam',
    dept: 'BBA',
    month: 'October',
    year: 2024,
    type: 'Adjustment',
    description: 'House rent adjustment correction',
    amount: -2000,
    status: 'Approved'
  },
  {
    id: 'ARR-004',
    empId: 'EMP-2025-011',
    name: 'Dr. Khaleda Rahman',
    dept: 'BBA',
    month: 'December',
    year: 2024,
    type: 'Bonus',
    description: 'End of year performance bonus',
    amount: 30000,
    status: 'Pending'
  },
  {
    id: 'ARR-005',
    empId: 'EMP-2025-003',
    name: 'Saiful Islam',
    dept: 'HR',
    month: 'November',
    year: 2024,
    type: 'Arrear',
    description: 'Overtime arrear for October',
    amount: 3500,
    status: 'Pending'
  }
]

// Performance Data: KPIs
export const KPIS: KPI[] = [
  {
    id: 'KPI-001',
    department: 'CSE',
    role: 'Professor',
    kpi: 'Research Publications',
    target: 4,
    achieved: 5,
    weight: 30,
    score: 37.5
  },
  {
    id: 'KPI-002',
    department: 'CSE',
    role: 'Professor',
    kpi: 'Student Satisfaction',
    target: 85,
    achieved: 88,
    weight: 25,
    score: 25.9
  },
  {
    id: 'KPI-003',
    department: 'CSE',
    role: 'Professor',
    kpi: 'Course Completion',
    target: 95,
    achieved: 98,
    weight: 20,
    score: 20.6
  },
  {
    id: 'KPI-004',
    department: 'BBA',
    role: 'Lecturer',
    kpi: 'Class Attendance',
    target: 90,
    achieved: 92,
    weight: 25,
    score: 25.5
  },
  {
    id: 'KPI-005',
    department: 'BBA',
    role: 'Lecturer',
    kpi: 'Assignment Grading',
    target: 100,
    achieved: 95,
    weight: 20,
    score: 19
  },
  {
    id: 'KPI-006',
    department: 'HR',
    role: 'Officer',
    kpi: 'Process Efficiency',
    target: 85,
    achieved: 90,
    weight: 30,
    score: 31.8
  },
  {
    id: 'KPI-007',
    department: 'HR',
    role: 'Officer',
    kpi: 'Employee Satisfaction',
    target: 80,
    achieved: 82,
    weight: 25,
    score: 25.6
  },
  {
    id: 'KPI-008',
    department: 'Accounts',
    role: 'Manager',
    kpi: 'Report Accuracy',
    target: 98,
    achieved: 99,
    weight: 35,
    score: 35.4
  },
  {
    id: 'KPI-009',
    department: 'Accounts',
    role: 'Manager',
    kpi: 'Audit Compliance',
    target: 100,
    achieved: 100,
    weight: 30,
    score: 30
  },
  {
    id: 'KPI-010',
    department: 'Library',
    role: 'Librarian',
    kpi: 'Resource Management',
    target: 90,
    achieved: 88,
    weight: 30,
    score: 29.3
  }
]

export const APPRAISALS: Appraisal[] = [
  {
    id: 'APP-001',
    empId: 'EMP-2025-001',
    name: 'Dr. Ayesha Karim',
    dept: 'CSE',
    designation: 'Associate Professor',
    appraisalPeriod: '2024 Annual',
    kpiScore: 85,
    peerFeedback: 4.5,
    supervisorFeedback: 4.7,
    finalScore: 88,
    recommendation: 'Promotion',
    status: 'Completed'
  },
  {
    id: 'APP-002',
    empId: 'EMP-2025-002',
    name: 'Mahbub Alam',
    dept: 'BBA',
    designation: 'Lecturer',
    appraisalPeriod: '2024 Annual',
    kpiScore: 78,
    peerFeedback: 4.2,
    supervisorFeedback: 4.0,
    finalScore: 80,
    recommendation: 'Increment',
    status: 'Completed'
  },
  {
    id: 'APP-003',
    empId: 'EMP-2025-003',
    name: 'Saiful Islam',
    dept: 'HR',
    designation: 'Officer',
    appraisalPeriod: '2024 Annual',
    kpiScore: 82,
    peerFeedback: 4.3,
    supervisorFeedback: 4.5,
    finalScore: 84,
    recommendation: 'Increment',
    status: 'Completed'
  },
  {
    id: 'APP-004',
    empId: 'EMP-2025-004',
    name: 'Nusrat Jahan',
    dept: 'Accounts',
    designation: 'Assistant Manager',
    appraisalPeriod: '2024 Annual',
    kpiScore: 90,
    peerFeedback: 4.6,
    supervisorFeedback: 4.8,
    finalScore: 92,
    recommendation: 'Promotion',
    status: 'Completed'
  },
  {
    id: 'APP-005',
    empId: 'EMP-2025-006',
    name: 'Dr. Farhan Chowdhury',
    dept: 'CSE',
    designation: 'Professor',
    appraisalPeriod: '2024 Annual',
    kpiScore: 92,
    peerFeedback: 4.8,
    supervisorFeedback: 4.9,
    finalScore: 94,
    recommendation: 'Promotion',
    status: 'Pending'
  },
  {
    id: 'APP-006',
    empId: 'EMP-2025-007',
    name: 'Shabnam Akter',
    dept: 'Library',
    designation: 'Librarian',
    appraisalPeriod: '2024 Annual',
    kpiScore: 75,
    peerFeedback: 4.0,
    supervisorFeedback: 4.1,
    finalScore: 77,
    recommendation: 'Training',
    status: 'Pending'
  },
  {
    id: 'APP-007',
    empId: 'EMP-2025-008',
    name: 'Rafiqul Islam',
    dept: 'BBA',
    designation: 'Assistant Professor',
    appraisalPeriod: '2024 Annual',
    kpiScore: 86,
    peerFeedback: 4.4,
    supervisorFeedback: 4.6,
    finalScore: 87,
    recommendation: 'Increment',
    status: 'Completed'
  },
  {
    id: 'APP-008',
    empId: 'EMP-2025-009',
    name: 'Tasneem Hossain',
    dept: 'Admission',
    designation: 'Senior Officer',
    appraisalPeriod: '2024 Annual',
    kpiScore: 80,
    peerFeedback: 4.2,
    supervisorFeedback: 4.3,
    finalScore: 82,
    recommendation: 'Increment',
    status: 'Pending'
  }
]

export const FEEDBACK_ENTRIES: Feedback[] = [
  {
    id: 'FB-001',
    empId: 'EMP-2025-001',
    empName: 'Dr. Ayesha Karim',
    from: 'Dr. Farhan Chowdhury',
    fromId: 'EMP-2025-006',
    date: '2024-12-15',
    rating: 5,
    comments: 'Excellent research output and student mentoring',
    type: 'Peer'
  },
  {
    id: 'FB-002',
    empId: 'EMP-2025-001',
    empName: 'Dr. Ayesha Karim',
    from: 'Prof. Dr. Rahim Uddin',
    fromId: 'EMP-2025-010',
    date: '2024-12-18',
    rating: 5,
    comments: 'Outstanding performance in all areas',
    type: 'Supervisor'
  },
  {
    id: 'FB-003',
    empId: 'EMP-2025-002',
    empName: 'Mahbub Alam',
    from: 'Dr. Khaleda Rahman',
    fromId: 'EMP-2025-011',
    date: '2024-12-16',
    rating: 4,
    comments: 'Good teaching skills, needs improvement in research',
    type: 'Supervisor'
  },
  {
    id: 'FB-004',
    empId: 'EMP-2025-002',
    empName: 'Mahbub Alam',
    from: 'Rafiqul Islam',
    fromId: 'EMP-2025-008',
    date: '2024-12-17',
    rating: 4,
    comments: 'Collaborative and helpful colleague',
    type: 'Peer'
  },
  {
    id: 'FB-005',
    empId: 'EMP-2025-003',
    empName: 'Saiful Islam',
    from: 'Aminul Haque',
    fromId: 'EMP-2025-012',
    date: '2024-12-14',
    rating: 4,
    comments: 'Efficient in HR operations, good team player',
    type: 'Supervisor'
  },
  {
    id: 'FB-006',
    empId: 'EMP-2025-004',
    empName: 'Nusrat Jahan',
    from: 'Jahangir Kabir',
    fromId: 'EMP-2025-013',
    date: '2024-12-19',
    rating: 5,
    comments: 'Exceptional attention to detail and accuracy',
    type: 'Supervisor'
  },
  {
    id: 'FB-007',
    empId: 'EMP-2025-006',
    empName: 'Dr. Farhan Chowdhury',
    from: 'Prof. Dr. Rahim Uddin',
    fromId: 'EMP-2025-010',
    date: '2024-12-20',
    rating: 5,
    comments: 'Leading researcher with excellent leadership',
    type: 'Supervisor'
  },
  {
    id: 'FB-008',
    empId: 'EMP-2025-007',
    empName: 'Shabnam Akter',
    from: 'Self Assessment',
    fromId: 'EMP-2025-007',
    date: '2024-12-10',
    rating: 4,
    comments: 'Need to improve digital cataloging skills',
    type: 'Self'
  },
  {
    id: 'FB-009',
    empId: 'EMP-2025-008',
    empName: 'Rafiqul Islam',
    from: 'Dr. Khaleda Rahman',
    fromId: 'EMP-2025-011',
    date: '2024-12-21',
    rating: 4,
    comments: 'Strong teaching performance, active in departmental activities',
    type: 'Supervisor'
  },
  {
    id: 'FB-010',
    empId: 'EMP-2025-009',
    empName: 'Tasneem Hossain',
    from: 'Self Assessment',
    fromId: 'EMP-2025-009',
    date: '2024-12-12',
    rating: 4,
    comments: 'Handling admission process efficiently',
    type: 'Self'
  }
]
