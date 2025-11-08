/**
 * DEMO DATA FILLERS
 * Deterministic pseudo-random generators for amplifying finance demo data
 * Only active when DEMO_MODE === true
 */

import { DEMO_MODE } from '@/config/demo'
import type { StudentBill, Payment, PaymentRefund, StudentFine, StudentHold, BankStatement, WaiverAssignment } from '../data/types'

// Simple LCG (Linear Congruential Generator) for deterministic randomness
class DemoRNG {
  private seed: number

  constructor(seed: string) {
    // Convert string seed to number
    let hash = 0
    for (let i = 0; i < seed.length; i++) {
      hash = ((hash << 5) - hash) + seed.charCodeAt(i)
      hash = hash & hash
    }
    this.seed = Math.abs(hash)
  }

  next(): number {
    this.seed = (this.seed * 1103515245 + 12345) & 0x7fffffff
    return this.seed / 0x7fffffff
  }

  nextInt(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min
  }

  pick<T>(arr: T[]): T {
    return arr[this.nextInt(0, arr.length - 1)]
  }
}

const rng = new DemoRNG('finance-demo-2025')

// Name generator
const firstNames = ['Ahmed', 'Fatima', 'Hassan', 'Aisha', 'Omar', 'Zainab', 'Ali', 'Mariam', 'Ibrahim', 'Khadija', 
  'Yusuf', 'Amina', 'Mustafa', 'Nusrat', 'Bilal', 'Hafsa', 'Tariq', 'Ruqayyah', 'Khalid', 'Safiya',
  'Hamza', 'Asma', 'Usman', 'Sumaya', 'Zaid', 'Layla', 'Salman', 'Maryam', 'Imran', 'Rabia']
const lastNames = ['Khan', 'Rahman', 'Ali', 'Hussain', 'Ahmed', 'Hassan', 'Shah', 'Malik', 'Iqbal', 'Jahan',
  'Islam', 'Haque', 'Chowdhury', 'Hossain', 'Uddin', 'Aktar', 'Begum', 'Karim', 'Siddique', 'Mahmud']

function generateName(): string {
  return `${rng.pick(firstNames)} ${rng.pick(lastNames)}`
}

function generateStudentId(program: string, year: number, serial: number): string {
  const yearShort = year.toString().slice(-2)
  const prog = program === 'CSE' ? '1-60' :
    program === 'BBA' ? '2-50' :
    program === 'LLB' ? '3-40' :
    program === 'MBA' ? '4-30' :
    program === 'EEE' ? '1-65' :
    program === 'English' ? '5-20' :
    program === 'BPharm' ? '6-10' :
    '7-00'
  return `20${yearShort}-${prog}-${String(serial).padStart(3, '0')}`
}

function generateDate(yearFrom: number, yearTo: number): string {
  const year = rng.nextInt(yearFrom, yearTo)
  const month = rng.nextInt(1, 12)
  const day = rng.nextInt(1, 28)
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

// Ensure minimum count utility
export function ensureMin<T>(
  baseArray: T[],
  minCount: number,
  buildFn: (index: number) => T
): T[] {
  if (!DEMO_MODE || baseArray.length >= minCount) {
    return baseArray
  }

  const result = [...baseArray]
  const needed = minCount - baseArray.length

  for (let i = 0; i < needed; i++) {
    result.push(buildFn(baseArray.length + i))
  }

  return result
}

// Bill builder
export function buildDemoBill(index: number): StudentBill {
  const programs = ['CSE', 'BBA', 'LLB', 'MBA']
  const campuses = ['Permanent Campus', 'Main Campus', 'Uttara Campus', 'Lakshmipur Campus']
  const semesters = ['Fall 2024', 'Spring 2025', 'Summer 2025', 'Fall 2025']
  
  const program = rng.pick(programs)
  const campus = rng.pick(campuses)
  const semester = rng.pick(semesters)
  const studentId = generateStudentId(program, rng.nextInt(2020, 2023), index % 200)
  const studentName = generateName()
  
  const grossTotal = rng.nextInt(40000, 120000)
  const waiverTotal = rng.nextInt(0, grossTotal * 0.5)
  const netTotal = grossTotal - waiverTotal
  const statusRoll = rng.next()
  let paidAmount = 0
  let status: 'Paid' | 'Partial' | 'Overdue'
  
  if (statusRoll < 0.35) {
    status = 'Paid'
    paidAmount = netTotal
  } else if (statusRoll < 0.70) {
    status = 'Partial'
    paidAmount = Math.floor(netTotal * rng.next() * 0.7)
  } else {
    status = 'Overdue'
    paidAmount = Math.floor(netTotal * rng.next() * 0.3)
  }
  
  const balanceDue = netTotal - paidAmount
  const billDate = generateDate(2024, 2025)
  
  return {
    id: `demo-bill-${index}`,
    billNo: `INV-${semester.split(' ')[1]}-${String(index + 1).padStart(5, '0')}`,
    studentId,
    studentName,
    program,
    campus,
    semester,
    billDate,
    dueDate: billDate,
    lineItems: [],
    grossTotal,
    waiverTotal,
    scholarshipTotal: 0,
    deductionTotal: 0,
    netTotal,
    paidAmount,
    balanceDue,
    status,
    createdAt: billDate,
    updatedAt: billDate
  }
}

// Payment builder
export function buildDemoPayment(index: number): Payment {
  const methods: Array<'Cash' | 'Bank' | 'bKash' | 'Card' | 'SSLCommerz' | 'DBBL Nexus'> = 
    ['Cash', 'Bank', 'bKash', 'Card', 'SSLCommerz', 'DBBL Nexus']
  const programs = ['CSE', 'BBA', 'LLB', 'MBA']
  const campuses = ['Permanent Campus', 'Main Campus', 'Uttara Campus']
  const semesters = ['Fall 2024', 'Spring 2025', 'Fall 2025']
  
  const program = rng.pick(programs)
  const semester = rng.pick(semesters)
  const studentId = generateStudentId(program, rng.nextInt(2020, 2023), index % 150)
  const studentName = generateName()
  const amount = rng.nextInt(10000, 80000)
  const method = rng.pick(methods)
  const paymentDate = generateDate(2024, 2025)
  const officers = ['Mahfuz Rahman', 'Faria Islam', 'Tanvir Ahmed', 'Shabnam Akter']
  
  return {
    id: `demo-pay-${index}`,
    receiptNo: `MR-2024-${String(index + 1).padStart(5, '0')}`,
    studentId,
    studentName,
    program,
    campus: rng.pick(campuses),
    semester,
    paymentDate,
    paymentTime: `${rng.nextInt(9, 16)}:${rng.nextInt(0, 59).toString().padStart(2, '0')}`,
    totalAmount: amount,
    method,
    allocations: [],
    collectedBy: rng.pick(officers),
    status: 'Completed',
    createdAt: `${paymentDate}T${rng.nextInt(9, 16)}:00:00`,
    transactionRef: method !== 'Cash' ? `TXN-${method.toUpperCase()}-${index}` : undefined
  }
}

// Refund builder
export function buildDemoRefund(index: number): PaymentRefund {
  const programs = ['CSE', 'BBA', 'LLB']
  const reasons = ['Course drop', 'Program discontinuation', 'Overpayment', 'Scholarship adjustment']
  
  const program = rng.pick(programs)
  const studentId = generateStudentId(program, rng.nextInt(2020, 2023), index % 100)
  const originalAmount = rng.nextInt(30000, 100000)
  const refundAmount = rng.nextInt(5000, Math.floor(originalAmount * 0.5))
  const refundDate = generateDate(2024, 2025)
  
  return {
    id: `demo-refund-${index}`,
    refundNo: `RF-2024-${String(index + 1).padStart(5, '0')}`,
    refundDate,
    studentId,
    studentName: generateName(),
    program,
    semester: rng.pick(['Fall 2024', 'Spring 2025']),
    originalReceiptNo: `MR-2024-${String(rng.nextInt(1, 500)).padStart(5, '0')}`,
    originalAmount,
    refundAmount,
    refundMethod: rng.pick(['Cash', 'Bank', 'bKash']),
    remarks: rng.pick(reasons),
    inWords: 'Amount in words',
    allocations: [],
    createdAt: `${refundDate}T10:00:00`,
    createdBy: 'Accounts Officer'
  }
}

// Fine builder
export function buildDemoFine(index: number): StudentFine {
  const fineTypes: Array<'Late Fine' | 'Library Fine' | 'Exam Fine' | 'Misc Fine'> = 
    ['Late Fine', 'Library Fine', 'Exam Fine', 'Misc Fine']
  const programs = ['CSE', 'BBA', 'LLB', 'MBA']
  
  const fineType = rng.pick(fineTypes)
  const program = rng.pick(programs)
  const amount = fineType === 'Late Fine' ? rng.nextInt(1000, 3000) :
    fineType === 'Library Fine' ? rng.nextInt(200, 1000) :
    fineType === 'Exam Fine' ? rng.nextInt(500, 2000) :
    rng.nextInt(300, 1500)
  
  return {
    id: `demo-fine-${index}`,
    studentId: generateStudentId(program, rng.nextInt(2020, 2023), index % 150),
    studentName: generateName(),
    fineType,
    amount,
    date: generateDate(2024, 2025),
    remarks: `${fineType} applied`,
    createdBy: rng.pick(['Accounts Officer', 'Library Admin', 'Exam Controller'])
  }
}

// Hold builder
export function buildDemoHold(index: number): StudentHold {
  const holdTypes: Array<'Finance Hold' | 'Registration Hold' | 'Exam Hold'> = 
    ['Finance Hold', 'Registration Hold', 'Exam Hold']
  const reasons = ['Outstanding dues', 'Clearance required', 'Document pending', 'Payment overdue']
  const programs = ['CSE', 'BBA', 'LLB', 'MBA']
  
  const isActive = rng.next() < 0.7 // 70% active
  const date = generateDate(2024, 2025)
  
  return {
    id: `demo-hold-${index}`,
    studentId: generateStudentId(rng.pick(programs), rng.nextInt(2020, 2023), index % 100),
    studentName: generateName(),
    holdType: rng.pick(holdTypes),
    reason: rng.pick(reasons),
    date,
    status: isActive ? 'Active' : 'Removed',
    createdBy: rng.pick(['Accounts Officer', 'Registrar Office']),
    removedDate: isActive ? undefined : generateDate(2024, 2025),
    removedBy: isActive ? undefined : 'Accounts Officer'
  }
}

// Bank statement builder
export function buildDemoBankStmt(index: number, options?: { matchRatio?: number }): BankStatement {
  const matchRatio = options?.matchRatio ?? 0.66
  const isMatched = rng.next() < matchRatio
  const amount = rng.nextInt(10000, 80000)
  const date = generateDate(2024, 2025)
  
  return {
    id: `demo-bank-${index}`,
    date,
    reference: isMatched ? `TXN-${index}` : `UNMATCH-${index}`,
    amount,
    matched: isMatched,
    matchedReceiptNo: isMatched ? `MR-2024-${String(rng.nextInt(1, 500)).padStart(5, '0')}` : undefined,
    notes: isMatched ? 'Matched' : 'Pending reconciliation'
  }
}

// Waiver assignment builder
export function buildDemoWaiverAssignment(index: number): WaiverAssignment {
  const policies = [
    { code: 'MERIT-50', name: 'Merit Scholarship 50%', percent: 50 },
    { code: 'MERIT-25', name: 'Merit Scholarship 25%', percent: 25 },
    { code: 'NEED-30', name: 'Need Based 30%', percent: 30 },
    { code: 'SPORTS-20', name: 'Sports Quota 20%', percent: 20 }
  ]
  const programs = ['CSE', 'BBA', 'LLB', 'MBA']
  const policy = rng.pick(policies)
  
  return {
    id: `demo-waiver-${index}`,
    studentId: generateStudentId(rng.pick(programs), rng.nextInt(2020, 2023), index % 120),
    studentName: generateName(),
    policyCode: policy.code,
    policyName: policy.name,
    percent: policy.percent,
    effectiveTerm: rng.pick(['Fall 2024', 'Spring 2025', 'Fall 2025']),
    locked: rng.next() < 0.3,
    assignedBy: 'Accounts Officer',
    assignedDate: generateDate(2024, 2025)
  }
}

// Unregistered student builder
export function buildDemoUnregistered(index: number): any {
  const programs = ['CSE', 'BBA', 'LLB', 'MBA']
  const campuses = ['Permanent Campus', 'Main Campus', 'Uttara Campus', 'Lakshmipur Campus']
  const program = rng.pick(programs)
  
  return {
    studentId: generateStudentId(program, rng.nextInt(2019, 2022), index % 150),
    studentName: generateName(),
    program,
    campus: rng.pick(campuses),
    lastRegistered: rng.pick(['Fall 2023', 'Spring 2024', 'Fall 2024']),
    status: rng.pick(['Dropped', 'Unregistered']),
    dropDate: generateDate(2023, 2024)
  }
}
