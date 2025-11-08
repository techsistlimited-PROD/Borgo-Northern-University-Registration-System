// Seed Factory - Pure functions to generate realistic demo data
import { StudentBill, Payment, PaymentRefund, StudentFine, StudentHold, StudentLedgerEntry, BillLineItem, PaymentAllocation, BankStatement, WaiverAssignment } from './types'

const programs = ['CSE', 'BBA', 'LLB', 'MBA', 'EEE', 'English', 'BANG', 'BPharm']
const campuses = ['Permanent Campus', 'Main Campus', 'Uttara Campus', 'Banani Campus', 'Lakshmipur Campus']
const semesters = ['Spring 2024', 'Summer 2024', 'Fall 2024', 'Spring 2025', 'Summer 2025', 'Fall 2025', 'Spring 2026']
const paymentMethods = ['Cash', 'Bank', 'bKash', 'Card', 'SSLCommerz', 'DBBL Nexus']

const firstNames = ['Nusrat', 'Rakib', 'Tahmina', 'Karim', 'Sadia', 'Ahmed', 'Fatima', 'Mahbub', 'Rifat', 'Shirin', 'Tanvir', 'Nasrin', 'Shakil', 'Ruma', 'Mehedi', 'Ayesha', 'Jamal', 'Farhana', 'Kazi', 'Sultana', 'Habib', 'Sabina', 'Mizanur', 'Shahana', 'Imran', 'Mousumi', 'Shahed', 'Rumana', 'Rahim', 'Sharmin']
const lastNames = ['Jahan', 'Hasan', 'Akter', 'Ahmed', 'Rahman', 'Khan', 'Khatun', 'Alam', 'Hossain', 'Akhter', 'Islam', 'Begum', 'Uddin', 'Yasmin', 'Siddiqua', 'Ali', 'Chowdhury', 'Mia', 'Talukder', 'Biswas']

export function rangeStudents(program: string, count: number, startYear: number = 2020): string[] {
  const ids: string[] = []
  const programCode = program === 'CSE' ? '60' : program === 'BBA' ? '50' : program === 'LLB' ? '40' : program === 'EEE' ? '10' : program === 'English' ? '30' : '70'
  
  for (let i = 0; i < count; i++) {
    const year = startYear + Math.floor(i / 30)
    const batch = Math.floor(i / 30) + 1
    const serial = String(i % 30 + 1).padStart(3, '0')
    ids.push(`${year}-${batch}-${programCode}-${serial}`)
  }
  return ids
}

export function randomName(): string {
  const first = firstNames[Math.floor(Math.random() * firstNames.length)]
  const last = lastNames[Math.floor(Math.random() * lastNames.length)]
  return `${first} ${last}`
}

export function makeBill(
  studentId: string,
  studentName: string,
  semester: string,
  program: string,
  campus: string,
  status: 'Paid' | 'Partial' | 'Overdue' | 'Issued',
  billIndex: number
): StudentBill {
  const semesterCode = semester.includes('Fall') ? 'FA' : semester.includes('Spring') ? 'SP' : 'SU'
  const year = semester.match(/\d{2}/)?.[0] || '25'
  const billNo = `INV-${semesterCode}${year}-${String(billIndex).padStart(4, '0')}`
  
  // Generate line items based on program
  const lineItems: BillLineItem[] = []
  let itemId = 1
  
  // Per Credit Fee (12 credits typical)
  const creditCount = 12
  const creditRate = program === 'CSE' || program === 'EEE' ? 5000 : program === 'BBA' || program === 'MBA' ? 3500 : 2800
  lineItems.push({
    id: `li-${billIndex}-${itemId++}`,
    costHeadCode: '001',
    costHeadName: 'Per Credit Fee',
    mode: 'Per Credit',
    quantity: creditCount,
    rate: creditRate,
    subtotal: creditCount * creditRate,
    waiverPercent: 0,
    scholarshipPercent: 0,
    deduction: 0,
    netAmount: creditCount * creditRate
  })
  
  // Flat fees
  const flatFees = [
    { code: '003', name: 'Semester Fee', amount: 8000 },
    { code: '004', name: 'Library Fee', amount: 1500 },
    { code: '006', name: 'Sports Fee', amount: 1000 },
    { code: '008', name: 'Internet & Computer Fee', amount: 1500 },
    { code: '010', name: 'Development Fee', amount: 2000 },
    { code: '011', name: 'Exam Fee', amount: 2500 }
  ]
  
  flatFees.forEach(fee => {
    lineItems.push({
      id: `li-${billIndex}-${itemId++}`,
      costHeadCode: fee.code,
      costHeadName: fee.name,
      mode: 'Flat',
      quantity: 1,
      rate: fee.amount,
      subtotal: fee.amount,
      waiverPercent: 0,
      scholarshipPercent: 0,
      deduction: 0,
      netAmount: fee.amount
    })
  })
  
  const grossTotal = lineItems.reduce((sum, item) => sum + item.subtotal, 0)
  const waiverPercent = Math.random() < 0.3 ? [20, 25, 50][Math.floor(Math.random() * 3)] : 0
  const waiverTotal = waiverPercent > 0 ? Math.floor(grossTotal * waiverPercent / 100) : 0
  const netTotal = grossTotal - waiverTotal
  
  let paidAmount = 0
  let balanceDue = netTotal
  
  if (status === 'Paid') {
    paidAmount = netTotal
    balanceDue = 0
  } else if (status === 'Partial') {
    paidAmount = Math.floor(netTotal * (0.3 + Math.random() * 0.4))
    balanceDue = netTotal - paidAmount
  } else if (status === 'Overdue') {
    paidAmount = 0
    balanceDue = netTotal
  }
  
  if (waiverPercent > 0) {
    lineItems[0].waiverPercent = waiverPercent
    lineItems[0].deduction = Math.floor(lineItems[0].subtotal * waiverPercent / 100)
    lineItems[0].netAmount = lineItems[0].subtotal - lineItems[0].deduction
  }
  
  const date = new Date(2024, semester.includes('Spring') ? 0 : semester.includes('Summer') ? 4 : 8, 10 + Math.floor(Math.random() * 5))
  const dueDate = new Date(date.getTime() + 30 * 24 * 60 * 60 * 1000)
  
  return {
    id: `bill-${billIndex}`,
    billNo,
    code: `BL-${String(billIndex).padStart(4, '0')}`,
    semesterRegistrationId: `${studentId}-${semesterCode}${year}`,
    studentId,
    studentName,
    program,
    campus,
    semester,
    billDate: date.toISOString().split('T')[0],
    dueDate: dueDate.toISOString().split('T')[0],
    lineItems,
    grossTotal,
    waiverTotal,
    scholarshipTotal: 0,
    deductionTotal: waiverTotal,
    netTotal,
    paidAmount,
    balanceDue,
    status,
    createdAt: date.toISOString(),
    updatedAt: new Date(date.getTime() + Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString()
  }
}

export function makePayment(
  studentId: string,
  studentName: string,
  program: string,
  campus: string,
  semester: string,
  amount: number,
  method: string,
  billRefs: { billId: string; billNo: string; amount: number }[],
  receiptIndex: number
): Payment {
  const year = new Date().getFullYear()
  const receiptNo = `MR-${year}-${String(receiptIndex).padStart(5, '0')}`
  
  const date = new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1)
  const time = `${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')} ${Math.random() > 0.5 ? 'AM' : 'PM'}`
  
  const allocations: PaymentAllocation[] = billRefs.map(ref => ({
    billId: ref.billId,
    billNo: ref.billNo,
    allocatedAmount: ref.amount
  }))
  
  const transactionRef = method === 'bKash' ? `BK${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}${String(Math.floor(Math.random() * 999999)).padStart(6, '0')}` :
    method === 'SSLCommerz' ? `SSL${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}${String(Math.floor(Math.random() * 999999)).padStart(6, '0')}` :
    method === 'Card' ? `CARD${String(date.getFullYear()).slice(2)}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}${String(Math.floor(Math.random() * 999999)).padStart(6, '0')}` :
    method === 'DBBL Nexus' ? `DBBL${String(date.getFullYear()).slice(2)}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}${String(Math.floor(Math.random() * 999999)).padStart(6, '0')}` :
    undefined
  
  return {
    id: `pay-${receiptIndex}`,
    receiptNo,
    studentId,
    studentName,
    program,
    campus,
    semester,
    paymentDate: date.toISOString().split('T')[0],
    paymentTime: time,
    totalAmount: amount,
    method: method as any,
    purpose: amount > 50000 ? 'Full Payment' : 'Installment',
    allocations,
    collectedBy: method === 'Cash' || method === 'Bank' ? ['Mahfuz Rahman', 'Faria Islam', 'Accounts Officer'][Math.floor(Math.random() * 3)] : 'System',
    status: 'Completed',
    transactionRef,
    bankName: method === 'Bank' ? ['DBBL', 'City Bank', 'BRAC Bank', 'EBL'][Math.floor(Math.random() * 4)] : undefined,
    branchName: method === 'Bank' ? ['Banani', 'Uttara', 'Gulshan', 'Dhanmondi'][Math.floor(Math.random() * 4)] : undefined,
    createdAt: date.toISOString()
  }
}

export function makeRefund(
  studentId: string,
  studentName: string,
  program: string,
  semester: string,
  originalReceiptNo: string,
  originalAmount: number,
  refundAmount: number,
  reason: string,
  refundIndex: number
): PaymentRefund {
  const refundNo = `RF-${new Date().getFullYear()}-${String(refundIndex).padStart(5, '0')}`
  const date = new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1)
  
  const thousands = Math.floor(refundAmount / 1000)
  const hundreds = Math.floor((refundAmount % 1000) / 100)
  const inWords = `${thousands > 0 ? `${thousands} Thousand ` : ''}${hundreds > 0 ? `${hundreds} Hundred ` : ''}Taka Only`
  
  return {
    id: `refund-${refundIndex}`,
    refundNo,
    refundDate: date.toISOString().split('T')[0],
    studentId,
    studentName,
    program,
    semester,
    originalReceiptNo,
    originalAmount,
    refundAmount,
    refundMethod: ['Cash', 'Bank', 'Mobile Banking'][Math.floor(Math.random() * 3)] as any,
    remarks: reason,
    inWords,
    allocations: [],
    createdAt: date.toISOString(),
    createdBy: 'Accounts Officer'
  }
}

export function makeFine(
  studentId: string,
  studentName: string,
  fineType: 'Late Fine' | 'Library Fine' | 'Exam Fine' | 'Misc Fine',
  amount: number,
  fineIndex: number
): StudentFine {
  const date = new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1)
  const remarks = fineType === 'Late Fine' ? 'Payment overdue' :
    fineType === 'Library Fine' ? 'Book overdue/lost' :
    fineType === 'Exam Fine' ? 'Late exam registration' :
    'Miscellaneous fine'
  
  return {
    id: `fine-${fineIndex}`,
    studentId,
    studentName,
    fineType,
    amount,
    date: date.toISOString().split('T')[0],
    remarks,
    createdBy: fineType === 'Library Fine' ? 'Library' : fineType === 'Exam Fine' ? 'Exam Office' : 'Accounts'
  }
}

export function makeHold(
  studentId: string,
  studentName: string,
  holdType: 'Finance Hold' | 'Registration Hold' | 'Exam Hold',
  reason: string,
  isActive: boolean,
  holdIndex: number
): StudentHold {
  const date = new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1)
  const removedDate = !isActive ? new Date(date.getTime() + Math.random() * 14 * 24 * 60 * 60 * 1000) : undefined
  
  return {
    id: `hold-${holdIndex}`,
    studentId,
    studentName,
    holdType,
    reason,
    date: date.toISOString().split('T')[0],
    status: isActive ? 'Active' : 'Removed',
    createdBy: holdType === 'Finance Hold' ? 'Accounts' : holdType === 'Registration Hold' ? 'Registrar' : 'Exam Office',
    removedDate: removedDate?.toISOString().split('T')[0],
    removedBy: !isActive ? (holdType === 'Finance Hold' ? 'Accounts' : holdType === 'Registration Hold' ? 'Registrar' : 'Exam Office') : undefined
  }
}

export function makeLedgerEntry(
  studentId: string,
  type: 'Bill' | 'Payment' | 'Adjustment' | 'Refund' | 'Fine',
  reference: string,
  description: string,
  debit: number,
  credit: number,
  previousBalance: number,
  entryIndex: number
): StudentLedgerEntry {
  const runningBalance = previousBalance + debit - credit
  const date = new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1)
  
  return {
    id: `ledger-${entryIndex}`,
    studentId,
    date: date.toISOString().split('T')[0],
    type,
    reference,
    description,
    debit,
    credit,
    runningBalance
  }
}

export function makeBankStatement(
  date: string,
  reference: string,
  amount: number,
  matched: boolean,
  matchedReceiptNo: string | undefined,
  stmtIndex: number
): BankStatement {
  return {
    id: `bank-${stmtIndex}`,
    date,
    reference,
    amount,
    matched,
    matchedReceiptNo,
    notes: matched ? 'Auto-matched' : 'Pending match'
  }
}

export function makeWaiverAssignment(
  studentId: string,
  studentName: string,
  policyCode: string,
  policyName: string,
  percent: number,
  term: string,
  assignIndex: number
): WaiverAssignment {
  return {
    id: `waiver-${assignIndex}`,
    studentId,
    studentName,
    policyCode,
    policyName,
    percent,
    effectiveTerm: term,
    locked: Math.random() > 0.3,
    assignedBy: ['Dr. Hasan', 'Prof. Rahman', 'Dean Office'][Math.floor(Math.random() * 3)],
    assignedDate: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0]
  }
}
