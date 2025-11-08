import {
  CostHead,
  CostPackage,
  StudentBill,
  Payment,
  WaiverPolicy,
  WaiverAssignment,
  LateFeePolicy,
  DropReadmissionPolicy,
  EmployeeNotice,
  BankStatement,
  BillLineItem
} from './types'

export const costHeadsSeed: CostHead[] = [
  { id: '1', code: 'PER_CREDIT_FEE', name: 'Per credit fee', type: 'Tuition', glAccount: '4010', taxable: false, status: 'Active', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: '2', code: 'ADMISSION_FEE', name: 'Admission fee', type: 'Admission', glAccount: '4020', taxable: false, status: 'Active', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: '3', code: 'RETAKE_FEE', name: 'Retake fee', type: 'Tuition', glAccount: '4030', taxable: false, status: 'Active', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: '4', code: 'SEMESTER_FEE', name: 'Semester fee', type: 'Registration', glAccount: '4040', taxable: false, status: 'Active', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: '5', code: 'FOUNDATION_COURSE', name: 'Foundation course', type: 'Tuition', glAccount: '4050', taxable: false, status: 'Active', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: '6', code: 'LAB_FEE', name: 'Lab fee', type: 'Lab', glAccount: '4060', taxable: false, status: 'Active', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: '7', code: 'LIBRARY_FEE', name: 'Library fee', type: 'Library', glAccount: '4070', taxable: false, status: 'Active', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: '8', code: 'EXAM_FEE', name: 'Exam fee', type: 'Exam', glAccount: '4080', taxable: false, status: 'Active', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: '9', code: 'SPECIAL_EXAM_FEE', name: 'Special exam fee', type: 'Exam', glAccount: '4090', taxable: false, status: 'Active', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: '10', code: 'LATE_FINE', name: 'Late fine', type: 'Penalty', glAccount: '4100', taxable: false, status: 'Active', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: '11', code: 'ID_CARD_FEE', name: 'ID card fee', type: 'Others', glAccount: '4110', taxable: false, status: 'Active', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: '12', code: 'TRANSCRIPT_FEE', name: 'Transcript fee', type: 'Others', glAccount: '4120', taxable: false, status: 'Active', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: '13', code: 'CERTIFICATE_FEE', name: 'Certificate fee', type: 'Others', glAccount: '4130', taxable: false, status: 'Active', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: '14', code: 'CONVOCATION_FEE', name: 'Convocation fee', type: 'Others', glAccount: '4140', taxable: false, status: 'Active', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: '15', code: 'MEDICAL_FEE', name: 'Medical fee', type: 'Others', glAccount: '4150', taxable: false, status: 'Active', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: '16', code: 'TRANSPORT_FEE', name: 'Transport fee', type: 'Others', glAccount: '4160', taxable: false, status: 'Active', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: '17', code: 'ACTIVITY_FEE', name: 'Activity fee', type: 'Others', glAccount: '4170', taxable: false, status: 'Active', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: '18', code: 'DEVELOPMENT_FEE', name: 'Development fee', type: 'Others', glAccount: '4180', taxable: false, status: 'Active', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: '19', code: 'DROP_FEE', name: 'Drop fee', type: 'Penalty', glAccount: '4190', taxable: false, status: 'Active', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: '20', code: 'READMISSION_FEE', name: 'Re-admission fee', type: 'Penalty', glAccount: '4200', taxable: false, status: 'Active', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: '21', code: 'LATE_REGISTRATION_FEE', name: 'Late Registration fee', type: 'Penalty', glAccount: '4210', taxable: false, status: 'Active', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: '22', code: 'STIPEND', name: 'Stipend', type: 'Others', glAccount: '4220', taxable: false, status: 'Active', description: 'Deduction - student stipend', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: '23', code: 'MISC_DEDUCTION', name: 'Miscellaneous deduction', type: 'Others', glAccount: '4230', taxable: false, status: 'Active', createdAt: '2024-01-01', updatedAt: '2024-01-01' }
]

export const costPackagesSeed: CostPackage[] = [
  {
    id: 'pkg1',
    name: 'CSE - Main Campus - FA25',
    campus: 'Main Campus',
    program: 'CSE',
    semesterTerm: 'Fall',
    effectiveTerm: 'FA25',
    components: [
      { id: 'c1', costHeadCode: 'ADMISSION_FEE', mode: 'Flat', rate: 15000, order: 1 },
      { id: 'c2', costHeadCode: 'PER_CREDIT_FEE', mode: 'Per Credit', rate: 4500, minCap: 9, maxCap: 18, order: 2 },
      { id: 'c3', costHeadCode: 'SEMESTER_FEE', mode: 'Flat', rate: 3000, order: 3 },
      { id: 'c4', costHeadCode: 'LAB_FEE', mode: 'Flat', rate: 5000, order: 4 },
      { id: 'c5', costHeadCode: 'LIBRARY_FEE', mode: 'Flat', rate: 1500, order: 5 },
      { id: 'c6', costHeadCode: 'EXAM_FEE', mode: 'Flat', rate: 2000, order: 6 }
    ],
    waiverRules: [
      { id: 'w1', policyCode: 'MERIT50', percentCap: 50, allowBillOverride: true },
      { id: 'w2', policyCode: 'NEED25', percentCap: 25, allowBillOverride: true }
    ],
    status: 'Active',
    createdAt: '2024-09-01',
    updatedAt: '2024-09-01'
  },
  {
    id: 'pkg2',
    name: 'BBA - Main Campus - FA25',
    campus: 'Main Campus',
    program: 'BBA',
    semesterTerm: 'Fall',
    effectiveTerm: 'FA25',
    components: [
      { id: 'c7', costHeadCode: 'ADMISSION_FEE', mode: 'Flat', rate: 12000, order: 1 },
      { id: 'c8', costHeadCode: 'PER_CREDIT_FEE', mode: 'Per Credit', rate: 3800, minCap: 9, maxCap: 18, order: 2 },
      { id: 'c9', costHeadCode: 'SEMESTER_FEE', mode: 'Flat', rate: 2500, order: 3 },
      { id: 'c10', costHeadCode: 'LIBRARY_FEE', mode: 'Flat', rate: 1200, order: 4 }
    ],
    waiverRules: [
      { id: 'w3', policyCode: 'MERIT30', percentCap: 30, allowBillOverride: false }
    ],
    status: 'Active',
    createdAt: '2024-09-01',
    updatedAt: '2024-09-01'
  },
  {
    id: 'pkg3',
    name: 'LLB - Uttara Campus - FA25',
    campus: 'Uttara Campus',
    program: 'LLB',
    semesterTerm: 'Fall',
    effectiveTerm: 'FA25',
    components: [
      { id: 'c11', costHeadCode: 'ADMISSION_FEE', mode: 'Flat', rate: 10000, order: 1 },
      { id: 'c12', costHeadCode: 'PER_CREDIT_FEE', mode: 'Per Credit', rate: 3500, minCap: 12, maxCap: 18, order: 2 },
      { id: 'c13', costHeadCode: 'SEMESTER_FEE', mode: 'Flat', rate: 2000, order: 3 }
    ],
    waiverRules: [],
    status: 'Active',
    createdAt: '2024-09-01',
    updatedAt: '2024-09-01'
  }
]

export const waiverPoliciesSeed: WaiverPolicy[] = [
  { id: 'wp1', code: 'MERIT50', name: 'Merit Scholarship 50%', percentCap: 50, description: 'Merit-based full waiver', active: true },
  { id: 'wp2', code: 'MERIT30', name: 'Merit Scholarship 30%', percentCap: 30, description: 'Merit-based partial waiver', active: true },
  { id: 'wp3', code: 'NEED25', name: 'Need-based 25%', percentCap: 25, description: 'Financial need based', active: true },
  { id: 'wp4', code: 'SPORTS20', name: 'Sports Quota 20%', percentCap: 20, active: true },
  { id: 'wp5', code: 'SIBLING15', name: 'Sibling Discount 15%', percentCap: 15, active: true }
]

export const waiverAssignmentsSeed: WaiverAssignment[] = [
  { id: 'wa1', studentId: '2021-1-60-001', studentName: 'Nusrat Jahan', policyCode: 'MERIT50', policyName: 'Merit Scholarship 50%', percent: 50, effectiveTerm: 'FA25', locked: true, assignedBy: 'Accounts Officer', assignedDate: '2024-09-05' },
  { id: 'wa2', studentId: '2021-1-60-010', studentName: 'Rakib Hasan', policyCode: 'NEED25', policyName: 'Need-based 25%', percent: 25, effectiveTerm: 'FA25', locked: false, assignedBy: 'Accounts Officer', assignedDate: '2024-09-06' },
  { id: 'wa3', studentId: '2021-2-50-005', studentName: 'Tahmina Akter', policyCode: 'MERIT30', policyName: 'Merit Scholarship 30%', percent: 30, effectiveTerm: 'FA25', locked: true, assignedBy: 'Accounts Officer', assignedDate: '2024-09-07' }
]

export const lateFeePoliciesSeed: LateFeePolicy[] = [
  {
    id: 'lfp1',
    name: 'Standard Late Fee Tiers',
    costHeadCode: 'LATE_FINE',
    active: true,
    rules: [
      { id: 'r1', name: 'Less than 40% paid', threshold: 40, feeType: 'Percent', feeAmount: 10, order: 1 },
      { id: 'r2', name: 'Less than 70% paid', threshold: 70, feeType: 'Percent', feeAmount: 5, order: 2 },
      { id: 'r3', name: 'Less than 100% paid', threshold: 100, feeType: 'Flat', feeAmount: 500, order: 3 }
    ],
    createdAt: '2024-01-01'
  }
]

export const dropReadmissionPoliciesSeed: DropReadmissionPolicy[] = [
  {
    id: 'drp1',
    systemType: 'Tri-semester',
    dropFee: 1000,
    readmissionFee: 5000,
    absentThreshold: 2,
    dropCostHeadCode: 'DROP_FEE',
    readmissionCostHeadCode: 'READMISSION_FEE'
  },
  {
    id: 'drp2',
    systemType: 'Bi-semester',
    dropFee: 1500,
    readmissionFee: 5000,
    absentThreshold: 1,
    dropCostHeadCode: 'DROP_FEE',
    readmissionCostHeadCode: 'READMISSION_FEE'
  }
]

const generateBillLineItems = (packageId: string): BillLineItem[] => {
  const pkg = costPackagesSeed.find(p => p.id === packageId)
  if (!pkg) return []

  return pkg.components.map(comp => {
    const costHead = costHeadsSeed.find(ch => ch.code === comp.costHeadCode)
    const qty = comp.mode === 'Per Credit' ? 12 : 1
    const subtotal = comp.rate * qty
    const waiverPercent = packageId === 'pkg1' ? 50 : 0
    const scholarshipPercent = 0
    const deduction = 0
    const netAmount = subtotal * (1 - waiverPercent / 100) - deduction

    return {
      id: `li-${comp.id}`,
      costHeadCode: comp.costHeadCode,
      costHeadName: costHead?.name || comp.costHeadCode,
      mode: comp.mode,
      quantity: qty,
      rate: comp.rate,
      subtotal,
      waiverPercent,
      scholarshipPercent,
      deduction,
      netAmount,
      notes: waiverPercent > 0 ? 'MERIT50 applied' : undefined
    }
  })
}

const calculateBillTotals = (lineItems: BillLineItem[]) => {
  const grossTotal = lineItems.reduce((sum, li) => sum + li.subtotal, 0)
  const waiverTotal = lineItems.reduce((sum, li) => sum + (li.subtotal * li.waiverPercent / 100), 0)
  const scholarshipTotal = lineItems.reduce((sum, li) => sum + (li.subtotal * li.scholarshipPercent / 100), 0)
  const deductionTotal = lineItems.reduce((sum, li) => sum + li.deduction, 0)
  const netTotal = lineItems.reduce((sum, li) => sum + li.netAmount, 0)
  return { grossTotal, waiverTotal, scholarshipTotal, deductionTotal, netTotal }
}

export const studentBillsSeed: StudentBill[] = [
  {
    id: 'bill1',
    billNo: 'INV-FA25-0001',
    studentId: '2021-1-60-001',
    studentName: 'Nusrat Jahan',
    program: 'CSE',
    campus: 'Main Campus',
    semester: 'Fall 2025',
    billDate: '2024-09-10',
    dueDate: '2024-10-10',
    lineItems: generateBillLineItems('pkg1'),
    grossTotal: 81000,
    waiverTotal: 40500,
    scholarshipTotal: 0,
    deductionTotal: 0,
    netTotal: 40500,
    paidAmount: 20000,
    balanceDue: 20500,
    status: 'Partial',
    packageId: 'pkg1',
    createdAt: '2024-09-10',
    updatedAt: '2024-11-15'
  },
  {
    id: 'bill2',
    billNo: 'INV-FA25-0002',
    studentId: '2021-1-60-010',
    studentName: 'Rakib Hasan',
    program: 'CSE',
    campus: 'Main Campus',
    semester: 'Fall 2025',
    billDate: '2024-09-10',
    dueDate: '2024-10-10',
    lineItems: generateBillLineItems('pkg1'),
    grossTotal: 81000,
    waiverTotal: 0,
    scholarshipTotal: 0,
    deductionTotal: 0,
    netTotal: 81000,
    paidAmount: 0,
    balanceDue: 81000,
    status: 'Overdue',
    packageId: 'pkg1',
    createdAt: '2024-09-10',
    updatedAt: '2024-09-10'
  },
  {
    id: 'bill3',
    billNo: 'INV-FA25-0003',
    studentId: '2021-2-50-005',
    studentName: 'Tahmina Akter',
    program: 'BBA',
    campus: 'Main Campus',
    semester: 'Fall 2025',
    billDate: '2024-09-11',
    dueDate: '2024-10-11',
    lineItems: generateBillLineItems('pkg2'),
    grossTotal: 61100,
    waiverTotal: 0,
    scholarshipTotal: 0,
    deductionTotal: 0,
    netTotal: 61100,
    paidAmount: 61100,
    balanceDue: 0,
    status: 'Paid',
    packageId: 'pkg2',
    createdAt: '2024-09-11',
    updatedAt: '2024-10-01'
  }
]

let receiptCounter = 1
export const generateReceiptNo = (): string => {
  const year = new Date().getFullYear()
  const num = String(receiptCounter++).padStart(5, '0')
  return `MR-${year}-${num}`
}

export const paymentsSeed: Payment[] = [
  {
    id: 'pay1',
    receiptNo: 'MR-2024-00001',
    studentId: '2021-1-60-001',
    studentName: 'Nusrat Jahan',
    program: 'CSE',
    campus: 'Main Campus',
    semester: 'Fall 2025',
    paymentDate: '2024-11-15',
    paymentTime: '10:30 AM',
    totalAmount: 20000,
    method: 'Cash',
    allocations: [{ billId: 'bill1', billNo: 'INV-FA25-0001', allocatedAmount: 20000 }],
    collectedBy: 'Mahfuz Rahman',
    status: 'Completed',
    createdAt: '2024-11-15T10:30:00'
  },
  {
    id: 'pay2',
    receiptNo: 'MR-2024-00002',
    studentId: '2021-2-50-005',
    studentName: 'Tahmina Akter',
    program: 'BBA',
    campus: 'Main Campus',
    semester: 'Fall 2025',
    paymentDate: '2024-10-01',
    paymentTime: '02:15 PM',
    totalAmount: 61100,
    method: 'bKash',
    allocations: [{ billId: 'bill3', billNo: 'INV-FA25-0003', allocatedAmount: 61100 }],
    collectedBy: 'Faria Islam',
    status: 'Completed',
    transactionRef: 'BK20240930145632',
    createdAt: '2024-10-01T14:15:00'
  }
]

export const employeeNoticesSeed: EmployeeNotice[] = [
  { id: 'n1', title: 'Year-end accounting closure', category: 'Accounts', publishedDate: '2024-12-01', content: 'All departments must submit final expense reports by Dec 15, 2024.', isNew: true },
  { id: 'n2', title: 'New tax filing guidelines', category: 'HR', publishedDate: '2024-11-20', content: 'Updated guidelines for TDS and PF deductions effective Jan 2025.', isNew: true },
  { id: 'n3', title: 'Holiday schedule 2025', category: 'General', publishedDate: '2024-11-10', content: 'Official holiday list for calendar year 2025 is now available.', isNew: false },
  { id: 'n4', title: 'Salary disbursement schedule', category: 'Accounts', publishedDate: '2024-10-25', content: 'December salaries will be disbursed on Dec 28, 2024.', isNew: false },
  { id: 'n5', title: 'Provident fund rate change', category: 'HR', publishedDate: '2024-10-15', content: 'PF contribution rate increased from 10% to 12% from January 2025.', attachments: ['pf_circular.pdf'], isNew: false }
]

export const bankStatementsSeed: BankStatement[] = [
  { id: 'bs1', date: '2024-11-15', reference: 'CHQ-123456', amount: 20000, matched: true, matchedReceiptNo: 'MR-2024-00001', notes: 'Cash deposit' },
  { id: 'bs2', date: '2024-10-01', reference: 'ONLINE-BK20240930145632', amount: 61100, matched: true, matchedReceiptNo: 'MR-2024-00002', notes: 'bKash payment' },
  { id: 'bs3', date: '2024-11-20', reference: 'NEFT-789012', amount: 15000, matched: false, notes: 'Unmatched transfer' },
  { id: 'bs4', date: '2024-11-22', reference: 'CHQ-234567', amount: 30000, matched: false, notes: 'Pending reconciliation' }
]
