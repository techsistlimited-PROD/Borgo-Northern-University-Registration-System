// STATIC DEMO SEEDS - Expanded for comprehensive demo
// Reset on refresh, no persistence
import { CostHead, CostPackage, StudentBill, Payment, PaymentRefund, StudentFine, StudentHold, StudentLedgerEntry, BankStatement, WaiverPolicy, WaiverAssignment, CostPackageComponent } from './types'
import { makeBill, makePayment, makeRefund, makeFine, makeHold, makeLedgerEntry, makeBankStatement, makeWaiverAssignment, rangeStudents, randomName } from './seedFactory'
import { ensureMin, buildDemoBill, buildDemoPayment, buildDemoRefund, buildDemoFine, buildDemoHold, buildDemoBankStmt, buildDemoWaiverAssignment, buildDemoUnregistered } from '../utils/demoFillers'
import { DEMO_MODE } from '@/config/demo'

// 23 Cost Heads (codes 001-023) - Client's full list
export const costHeadsStatic: CostHead[] = [
  { id: 'ch1', code: '001', serialNo: 1, name: 'Per Credit Fee', type: 'Tuition', glAccount: '4100', taxable: false, status: 'Active', description: 'Tuition per credit hour', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: 'ch2', code: '002', serialNo: 2, name: 'Admission Fee', type: 'Admission', glAccount: '4200', taxable: false, status: 'Active', description: 'One-time admission', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: 'ch3', code: '003', serialNo: 3, name: 'Semester Fee', type: 'Registration', glAccount: '4300', taxable: false, status: 'Active', description: 'Per semester charge', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: 'ch4', code: '004', serialNo: 4, name: 'Library Fee', type: 'Library', glAccount: '4400', taxable: false, status: 'Active', description: 'Library access fee', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: 'ch5', code: '005', serialNo: 5, name: 'Lab Fee', type: 'Lab', glAccount: '4500', taxable: false, status: 'Active', description: 'Laboratory usage', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: 'ch6', code: '006', serialNo: 6, name: 'Sports Fee', type: 'Others', glAccount: '4600', taxable: false, status: 'Active', description: 'Sports facilities', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: 'ch7', code: '007', serialNo: 7, name: 'Medical Fee', type: 'Others', glAccount: '4700', taxable: false, status: 'Active', description: 'Medical services', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: 'ch8', code: '008', serialNo: 8, name: 'Internet & Computer Fee', type: 'Others', glAccount: '4800', taxable: false, status: 'Active', description: 'IT infrastructure', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: 'ch9', code: '009', serialNo: 9, name: 'Student Activities Fee', type: 'Others', glAccount: '4900', taxable: false, status: 'Active', description: 'Extracurricular activities', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: 'ch10', code: '010', serialNo: 10, name: 'Development Fee', type: 'Others', glAccount: '5000', taxable: false, status: 'Active', description: 'Campus development', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: 'ch11', code: '011', serialNo: 11, name: 'Exam Fee', type: 'Exam', glAccount: '5100', taxable: false, status: 'Active', description: 'Examination charges', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: 'ch12', code: '012', serialNo: 12, name: 'ID Card Fee', type: 'Others', glAccount: '5200', taxable: false, status: 'Active', description: 'Student ID card', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: 'ch13', code: '013', serialNo: 13, name: 'Registration Fee', type: 'Registration', glAccount: '5300', taxable: false, status: 'Active', description: 'Course registration', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: 'ch14', code: '014', serialNo: 14, name: 'Late Fine', type: 'Penalty', glAccount: '5400', taxable: false, status: 'Active', description: 'Late payment penalty', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: 'ch15', code: '015', serialNo: 15, name: 'Special Exam Fee', type: 'Exam', glAccount: '5500', taxable: false, status: 'Active', description: 'Special/makeup exams', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: 'ch16', code: '016', serialNo: 16, name: 'Transcript Fee', type: 'Others', glAccount: '5600', taxable: false, status: 'Active', description: 'Transcript issuance', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: 'ch17', code: '017', serialNo: 17, name: 'Certificate Fee', type: 'Others', glAccount: '5700', taxable: false, status: 'Active', description: 'Certificate issuance', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: 'ch18', code: '018', serialNo: 18, name: 'Migration Fee', type: 'Others', glAccount: '5800', taxable: false, status: 'Active', description: 'Program migration', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: 'ch19', code: '019', serialNo: 19, name: 'Welfare Fund', type: 'Others', glAccount: '5900', taxable: false, status: 'Active', description: 'Student welfare', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: 'ch20', code: '020', serialNo: 20, name: 'Technology Fee', type: 'Others', glAccount: '6000', taxable: false, status: 'Active', description: 'Technology enhancement', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: 'ch21', code: '021', serialNo: 21, name: 'Convocation Fee', type: 'Others', glAccount: '6100', taxable: false, status: 'Active', description: 'Graduation ceremony', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: 'ch22', code: '022', serialNo: 22, name: 'Late Registration Fee', type: 'Penalty', glAccount: '6200', taxable: false, status: 'Active', description: 'Late course registration', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: 'ch23', code: '023', serialNo: 23, name: 'Readmission Fee', type: 'Others', glAccount: '6300', taxable: false, status: 'Active', description: 'Student readmission', createdAt: '2024-01-01', updatedAt: '2024-01-01' }
]

// 12 Cost Packages with variety
const makePackageComponents = (): CostPackageComponent[] => [
  { id: 'comp1', costHeadCode: '001', mode: 'Per Credit', rate: 5000, order: 1 },
  { id: 'comp2', costHeadCode: '003', mode: 'Flat', rate: 8000, order: 2 },
  { id: 'comp3', costHeadCode: '004', mode: 'Flat', rate: 1500, order: 3 },
  { id: 'comp4', costHeadCode: '006', mode: 'Flat', rate: 1000, order: 4 },
  { id: 'comp5', costHeadCode: '008', mode: 'Flat', rate: 1500, order: 5 },
  { id: 'comp6', costHeadCode: '010', mode: 'Flat', rate: 2000, order: 6 },
  { id: 'comp7', costHeadCode: '011', mode: 'Flat', rate: 2500, order: 7 }
]

export const costPackagesStatic: CostPackage[] = [
  { id: 'pkg1', programNo: '674', name: 'CSE Regular Package', packageNo: 'PKG-674-2024', campus: 'Permanent Campus', program: 'CSE', semesterFrom: 'Fall 2024', semesterTo: 'Fall 2025', currency: 'BDT', isForeign: false, activeFrom: '2024-09-01', activeTo: '2025-12-31', remarks: 'Regular CSE package', components: makePackageComponents(), waiverRules: [], status: 'Active', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: 'pkg2', programNo: '688', name: 'BBA Package', packageNo: 'PKG-688-2024', campus: 'Permanent Campus', program: 'BBA', semesterFrom: 'Fall 2024', semesterTo: 'Spring 2025', currency: 'BDT', isForeign: false, activeFrom: '2024-09-01', activeTo: '2025-06-30', remarks: 'BBA package', components: makePackageComponents(), waiverRules: [], status: 'Active', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: 'pkg3', programNo: '689', name: 'EEE Uttara Package', packageNo: 'PKG-689-2024', campus: 'Uttara Campus', program: 'EEE', semesterFrom: 'Spring 2025', semesterTo: 'Summer 2025', currency: 'BDT', isForeign: false, activeFrom: '2025-01-01', activeTo: '2025-08-31', remarks: 'EEE Uttara', components: makePackageComponents(), waiverRules: [], status: 'Active', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: 'pkg4', programNo: '717', name: 'CSE International', packageNo: 'PKG-717-2024F', campus: 'Permanent Campus', program: 'CSE', semesterFrom: 'Fall 2024', semesterTo: 'Fall 2025', currency: 'USD', isForeign: true, activeFrom: '2024-09-01', activeTo: '2025-12-31', remarks: 'CSE for foreign students', components: makePackageComponents(), waiverRules: [], status: 'Active', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: 'pkg5', programNo: '723', name: 'LLB Package', packageNo: 'PKG-723-2024', campus: 'Lakshmipur Campus', program: 'LLB', semesterFrom: 'Fall 2024', semesterTo: 'Fall 2025', currency: 'BDT', isForeign: false, activeFrom: '2024-09-01', activeTo: '2025-12-31', remarks: 'Law program', components: makePackageComponents(), waiverRules: [], status: 'Active', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: 'pkg6', programNo: '724', name: 'English Package', packageNo: 'PKG-724-2024', campus: 'Permanent Campus', program: 'English', semesterFrom: 'Spring 2025', semesterTo: 'Spring 2026', currency: 'BDT', isForeign: false, activeFrom: '2025-01-01', activeTo: '2026-06-30', remarks: 'English literature', components: makePackageComponents(), waiverRules: [], status: 'Active', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: 'pkg7', programNo: 'E43', name: 'BBA Evening', packageNo: 'PKG-E43-2024', campus: 'Uttara Campus', program: 'BBA', semesterFrom: 'Fall 2024', semesterTo: 'Summer 2025', currency: 'BDT', isForeign: false, activeFrom: '2024-09-01', activeTo: '2025-08-31', remarks: 'Evening BBA', components: makePackageComponents(), waiverRules: [], status: 'Active', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: 'pkg8', programNo: '913', name: 'BBA International', packageNo: 'PKG-913-2024F', campus: 'Permanent Campus', program: 'BBA', semesterFrom: 'Fall 2024', semesterTo: 'Fall 2025', currency: 'USD', isForeign: true, activeFrom: '2024-09-01', activeTo: '2025-12-31', remarks: 'BBA international', components: makePackageComponents(), waiverRules: [], status: 'Active', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: 'pkg9', programNo: '675', name: 'CSE Spring 2025', packageNo: 'PKG-675-2025', campus: 'Permanent Campus', program: 'CSE', semesterFrom: 'Spring 2025', semesterTo: 'Spring 2026', currency: 'BDT', isForeign: false, activeFrom: '2025-01-01', activeTo: '2026-06-30', remarks: 'Spring intake', components: makePackageComponents(), waiverRules: [], status: 'Active', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: 'pkg10', programNo: '690', name: 'MBA Package', packageNo: 'PKG-690-2024', campus: 'Permanent Campus', program: 'MBA', semesterFrom: 'Fall 2024', semesterTo: 'Fall 2025', currency: 'BDT', isForeign: false, activeFrom: '2024-09-01', activeTo: '2025-12-31', remarks: 'Graduate program', components: makePackageComponents(), waiverRules: [], status: 'Active', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: 'pkg11', programNo: '725', name: 'BPharm Package', packageNo: 'PKG-725-2024', campus: 'Main Campus', program: 'BPharm', semesterFrom: 'Fall 2024', semesterTo: 'Fall 2025', currency: 'BDT', isForeign: false, activeFrom: '2024-09-01', activeTo: '2025-12-31', remarks: 'Pharmacy program', components: makePackageComponents(), waiverRules: [], status: 'Active', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: 'pkg12', programNo: '726', name: 'BANG Package', packageNo: 'PKG-726-2024', campus: 'Permanent Campus', program: 'BANG', semesterFrom: 'Fall 2024', semesterTo: 'Fall 2025', currency: 'BDT', isForeign: false, activeFrom: '2024-09-01', activeTo: '2025-12-31', remarks: 'Bangla department', components: makePackageComponents(), waiverRules: [], status: 'Active', createdAt: '2024-01-01', updatedAt: '2024-01-01' }
]

// Generate 300 Student Bills (35% Paid, 35% Partial, 30% Overdue)
function generateBills(): StudentBill[] {
  const bills: StudentBill[] = []
  const programs = ['CSE', 'BBA', 'LLB', 'MBA', 'EEE', 'English', 'BPharm', 'BANG']
  const campuses = ['Permanent Campus', 'Main Campus', 'Uttara Campus', 'Banani Campus', 'Lakshmipur Campus']
  const semesters = ['Fall 2024', 'Spring 2025', 'Summer 2025', 'Fall 2025']

  let billIndex = 1

  for (let i = 0; i < 300; i++) {
    const program = programs[i % programs.length]
    const campus = campuses[i % campuses.length]
    const semester = semesters[i % semesters.length]
    const studentIds = rangeStudents(program, 10, 2020 + Math.floor(i / 100))
    const studentId = studentIds[i % 10]
    const studentName = randomName()

    let status: 'Paid' | 'Partial' | 'Overdue' | 'Issued'
    if (i < 105) status = 'Paid'
    else if (i < 210) status = 'Partial'
    else status = 'Overdue'

    bills.push(makeBill(studentId, studentName, semester, program, campus, status, billIndex++))
  }

  return bills
}

// Generate 450 Payments (cover all methods)
function generatePayments(bills: StudentBill[]): Payment[] {
  const payments: Payment[] = []
  const methods = ['Cash', 'Bank', 'bKash', 'Card', 'SSLCommerz', 'DBBL Nexus']
  let receiptIndex = 1

  // Create payments for paid bills
  bills.filter(b => b.status === 'Paid').forEach((bill, idx) => {
    const method = methods[idx % methods.length]
    payments.push(makePayment(
      bill.studentId,
      bill.studentName,
      bill.program,
      bill.campus,
      bill.semester,
      bill.paidAmount,
      method,
      [{ billId: bill.id, billNo: bill.billNo, amount: bill.paidAmount }],
      receiptIndex++
    ))
  })

  // Create payments for partial bills
  bills.filter(b => b.status === 'Partial').forEach((bill, idx) => {
    const method = methods[idx % methods.length]
    payments.push(makePayment(
      bill.studentId,
      bill.studentName,
      bill.program,
      bill.campus,
      bill.semester,
      bill.paidAmount,
      method,
      [{ billId: bill.id, billNo: bill.billNo, amount: bill.paidAmount }],
      receiptIndex++
    ))
  })

  // Add extra payments for 450 total
  const extraCount = 450 - payments.length
  for (let i = 0; i < extraCount; i++) {
    const bill = bills[i % bills.length]
    const method = methods[i % methods.length]
    const amount = Math.floor(Math.random() * 30000) + 10000
    payments.push(makePayment(
      bill.studentId,
      bill.studentName,
      bill.program,
      bill.campus,
      bill.semester,
      amount,
      method,
      [{ billId: bill.id, billNo: bill.billNo, amount }],
      receiptIndex++
    ))
  }

  return payments
}

// Generate 50 Refunds
function generateRefunds(payments: Payment[]): PaymentRefund[] {
  const refunds: PaymentRefund[] = []
  const reasons = ['Course drop', 'Program discontinuation', 'Overpayment', 'Scholarship adjustment', 'Fee waiver', 'Duplicate payment', 'Semester withdrawal', 'Program transfer']

  for (let i = 0; i < 50; i++) {
    const payment = payments[i * 8]
    const refundAmount = Math.floor(payment.totalAmount * (0.1 + Math.random() * 0.3))
    refunds.push(makeRefund(
      payment.studentId,
      payment.studentName,
      payment.program,
      payment.semester,
      payment.receiptNo,
      payment.totalAmount,
      refundAmount,
      reasons[i % reasons.length],
      i + 1
    ))
  }

  return refunds
}

// Generate 120 Fines
function generateFines(bills: StudentBill[]): StudentFine[] {
  const fines: StudentFine[] = []
  const fineTypes: Array<'Late Fine' | 'Library Fine' | 'Exam Fine' | 'Misc Fine'> = ['Late Fine', 'Library Fine', 'Exam Fine', 'Misc Fine']

  for (let i = 0; i < 120; i++) {
    const bill = bills[i]
    const fineType = fineTypes[i % fineTypes.length]
    const amount = fineType === 'Late Fine' ? Math.floor(Math.random() * 2000) + 1000 :
      fineType === 'Library Fine' ? Math.floor(Math.random() * 800) + 200 :
      fineType === 'Exam Fine' ? Math.floor(Math.random() * 1500) + 500 :
      Math.floor(Math.random() * 1000) + 300

    fines.push(makeFine(bill.studentId, bill.studentName, fineType, amount, i + 1))
  }

  return fines
}

// Generate 80 Holds (70% Active, 30% Removed)
function generateHolds(bills: StudentBill[]): StudentHold[] {
  const holds: StudentHold[] = []
  const holdTypes: Array<'Finance Hold' | 'Registration Hold' | 'Exam Hold'> = ['Finance Hold', 'Registration Hold', 'Exam Hold']
  const reasons = ['Outstanding dues', 'Clearance required', 'Document pending', 'Payment overdue', 'Finance clearance required', 'Library dues', 'Incomplete documentation']

  for (let i = 0; i < 80; i++) {
    const bill = bills[i]
    const holdType = holdTypes[i % holdTypes.length]
    const isActive = i < 56 // 70% active
    holds.push(makeHold(
      bill.studentId,
      bill.studentName,
      holdType,
      reasons[i % reasons.length],
      isActive,
      i + 1
    ))
  }

  return holds
}

// Generate 300 Ledger Entries
function generateLedgerEntries(bills: StudentBill[], payments: Payment[], fines: StudentFine[], refunds: PaymentRefund[]): StudentLedgerEntry[] {
  const entries: StudentLedgerEntry[] = []
  let entryIndex = 1
  const balances = new Map<string, number>()
  
  // Create entries for bills
  bills.forEach(bill => {
    const prevBalance = balances.get(bill.studentId) || 0
    entries.push(makeLedgerEntry(
      bill.studentId,
      'Bill',
      bill.billNo,
      `${bill.semester} Semester Bill`,
      bill.netTotal,
      0,
      prevBalance,
      entryIndex++
    ))
    balances.set(bill.studentId, prevBalance + bill.netTotal)
  })
  
  // Create entries for payments
  payments.forEach(payment => {
    const prevBalance = balances.get(payment.studentId) || 0
    entries.push(makeLedgerEntry(
      payment.studentId,
      'Payment',
      payment.receiptNo,
      `Payment - ${payment.method}`,
      0,
      payment.totalAmount,
      prevBalance,
      entryIndex++
    ))
    balances.set(payment.studentId, prevBalance - payment.totalAmount)
  })
  
  // Create entries for fines
  fines.forEach(fine => {
    const prevBalance = balances.get(fine.studentId) || 0
    entries.push(makeLedgerEntry(
      fine.studentId,
      'Fine',
      fine.id,
      fine.fineType,
      fine.amount,
      0,
      prevBalance,
      entryIndex++
    ))
    balances.set(fine.studentId, prevBalance + fine.amount)
  })
  
  // Create entries for refunds
  refunds.forEach(refund => {
    const prevBalance = balances.get(refund.studentId) || 0
    entries.push(makeLedgerEntry(
      refund.studentId,
      'Refund',
      refund.refundNo,
      `Refund - ${refund.remarks}`,
      0,
      refund.refundAmount,
      prevBalance,
      entryIndex++
    ))
    balances.set(refund.studentId, prevBalance - refund.refundAmount)
  })
  
  return entries.slice(0, 800) // Limit to 800
}

// Generate 350 Bank Statements (80% Matched, 20% Unmatched)
function generateBankStatements(payments: Payment[]): BankStatement[] {
  const statements: BankStatement[] = []

  // Match 80% of payments
  const matchCount = Math.floor(payments.length * 0.8)
  for (let i = 0; i < matchCount; i++) {
    const payment = payments[i]
    const variance = Math.random() < 0.9 ? 0 : Math.floor(Math.random() * 200) - 100
    statements.push(makeBankStatement(
      payment.paymentDate,
      payment.transactionRef || `REF-${i + 1}`,
      payment.totalAmount + variance,
      true,
      payment.receiptNo,
      i + 1
    ))
  }

  // Add unmatched statements
  const unmatchedCount = 350 - matchCount
  for (let i = 0; i < unmatchedCount; i++) {
    const date = new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1)
    statements.push(makeBankStatement(
      date.toISOString().split('T')[0],
      `UNMATCH-${i + 1}`,
      Math.floor(Math.random() * 50000) + 10000,
      false,
      undefined,
      matchCount + i + 1
    ))
  }

  return statements
}

// 15 Waiver Policies
export const waiverPoliciesStatic: WaiverPolicy[] = [
  { id: 'wp1', code: 'MERIT-50', name: 'Merit Scholarship 50%', percentCap: 50, description: 'Top performers', active: true },
  { id: 'wp2', code: 'MERIT-25', name: 'Merit Scholarship 25%', percentCap: 25, description: 'High achievers', active: true },
  { id: 'wp3', code: 'MERIT-100', name: 'Merit Scholarship 100%', percentCap: 100, description: 'Exceptional students', active: true },
  { id: 'wp4', code: 'NEED-30', name: 'Need Based 30%', percentCap: 30, description: 'Financial need', active: true },
  { id: 'wp5', code: 'NEED-50', name: 'Need Based 50%', percentCap: 50, description: 'High financial need', active: true },
  { id: 'wp6', code: 'SPORTS-20', name: 'Sports Quota 20%', percentCap: 20, description: 'Athletic achievement', active: true },
  { id: 'wp7', code: 'SPORTS-40', name: 'Sports Quota 40%', percentCap: 40, description: 'National level athletes', active: true },
  { id: 'wp8', code: 'SIBLING-15', name: 'Sibling Discount 15%', percentCap: 15, description: 'Family discount', active: true },
  { id: 'wp9', code: 'STAFF-50', name: 'Staff Child 50%', percentCap: 50, description: 'University staff children', active: true },
  { id: 'wp10', code: 'STAFF-100', name: 'Staff Child 100%', percentCap: 100, description: 'Senior staff children', active: true },
  { id: 'wp11', code: 'FF-100', name: 'Freedom Fighter 100%', percentCap: 100, description: 'Freedom fighter quota', active: true },
  { id: 'wp12', code: 'TRIBAL-30', name: 'Tribal Quota 30%', percentCap: 30, description: 'Tribal community support', active: true },
  { id: 'wp13', code: 'ORPHAN-40', name: 'Orphan Waiver 40%', percentCap: 40, description: 'Orphaned students', active: true },
  { id: 'wp14', code: 'DISABILITY-35', name: 'Disability Waiver 35%', percentCap: 35, description: 'Students with disabilities', active: true },
  { id: 'wp15', code: 'ALUMNI-10', name: 'Alumni Child 10%', percentCap: 10, description: 'Children of alumni', active: true }
]

// Generate 150 Waiver Assignments
function generateWaiverAssignments(bills: StudentBill[]): WaiverAssignment[] {
  const assignments: WaiverAssignment[] = []
  const policies = waiverPoliciesStatic

  for (let i = 0; i < 150; i++) {
    const bill = bills[i]
    const policy = policies[i % policies.length]
    assignments.push(makeWaiverAssignment(
      bill.studentId,
      bill.studentName,
      policy.code,
      policy.name,
      policy.percentCap,
      bill.semester,
      i + 1
    ))
  }

  return assignments
}

// Initialize all seeds
export const studentBillsStatic = generateBills()
export const paymentsStatic = generatePayments(studentBillsStatic)
export const refundsStatic = generateRefunds(paymentsStatic)
export const finesStatic = generateFines(studentBillsStatic)
export const holdsStatic = generateHolds(studentBillsStatic)
export const ledgerEntriesStatic = generateLedgerEntries(studentBillsStatic, paymentsStatic, finesStatic, refundsStatic)
export const bankStatementsStatic = generateBankStatements(paymentsStatic)
export const waiverAssignmentsStatic = generateWaiverAssignments(studentBillsStatic)

// 90 Unregistered Students for Drop/Readmission report
export const unregisteredStudentsStatic = studentBillsStatic.filter(b => b.status === 'Overdue').slice(0, 90).map((b, i) => ({
  studentId: b.studentId,
  studentName: b.studentName,
  program: b.program,
  campus: b.campus,
  lastRegistered: b.semester,
  status: i % 2 === 0 ? 'Dropped' : 'Unregistered',
  dropDate: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0]
}))
