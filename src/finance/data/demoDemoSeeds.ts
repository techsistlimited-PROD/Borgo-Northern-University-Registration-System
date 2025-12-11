import { FinanceBill, FinancePayment, FinanceLateFee, FinanceWaiver, FinanceCostHead, FinanceCostPackage } from '@/lib/oracleSchema'

const generateId = () => Math.random().toString(36).substring(2, 11)
const generateStudentId = (index: number) => `STU${String(index).padStart(5, '0')}`
const generateBillNo = (index: number) => `BILL${String(index).padStart(6, '0')}`
const generateReceiptNo = (index: number) => `RCP${String(index).padStart(6, '0')}`

const campuses = ['Permanent Campus', 'Uttara', 'Lakshmipur', 'Dhaka']
const semesters = ['Fall 2024', 'Spring 2025', 'Summer 2025', 'Fall 2025']
const programs = ['BBA', 'BTech', 'MSc', 'MBA', 'LLB']
const paymentMethods = ['Bank Transfer', 'Cash', 'Cheque', 'Card', 'Online Gateway']
const costHeadNames = ['Tuition Fee', 'Lab Fee', 'Library Fee', 'Sports Fee', 'Examination Fee', 'Miscellaneous']

export function generateDemoFinanceBills(count: number = 150): FinanceBill[] {
  const bills: FinanceBill[] = []
  const statuses: Array<'Draft' | 'Issued' | 'Partial' | 'Paid' | 'Overdue'> = ['Draft', 'Issued', 'Partial', 'Paid', 'Overdue']
  
  for (let i = 0; i < count; i++) {
    const status = statuses[Math.floor(Math.random() * statuses.length)]
    const baseAmount = 15000 + Math.random() * 35000
    const daysAgo = Math.floor(Math.random() * 180)
    
    bills.push({
      id: generateId(),
      billNo: generateBillNo(i + 1),
      studentId: generateStudentId(Math.floor(Math.random() * 500)),
      billDate: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      dueDate: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000 + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      amount: Math.round(baseAmount),
      status,
      createdAt: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString()
    })
  }
  
  return bills
}

export function generateDemoFinancePayments(count: number = 120): FinancePayment[] {
  const payments: FinancePayment[] = []
  
  for (let i = 0; i < count; i++) {
    const daysAgo = Math.floor(Math.random() * 180)
    
    payments.push({
      id: generateId(),
      receiptNo: generateReceiptNo(i + 1),
      billId: generateBillNo(Math.floor(Math.random() * 150) + 1),
      amount: 5000 + Math.random() * 40000,
      paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
      paymentDate: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      reference: `REF${generateId().substring(0, 8)}`,
      status: 'Confirmed',
      createdAt: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString()
    })
  }
  
  return payments
}

export function generateDemoLateFees(count: number = 80): FinanceLateFee[] {
  const fees: FinanceLateFee[] = []
  const rates = [2, 3, 5, 10]
  const statuses: Array<'Applied' | 'Waived' | 'Pending'> = ['Applied', 'Pending', 'Waived']
  
  for (let i = 0; i < count; i++) {
    const rate = rates[Math.floor(Math.random() * rates.length)]
    const baseAmount = 15000 + Math.random() * 35000
    
    fees.push({
      id: generateId(),
      billId: generateBillNo(Math.floor(Math.random() * 150) + 1),
      studentId: generateStudentId(Math.floor(Math.random() * 500)),
      amount: Math.round((baseAmount * rate) / 100),
      rate,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      appliedDate: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })
  }
  
  return fees
}

export function generateDemoWaivers(count: number = 50): FinanceWaiver[] {
  const waivers: FinanceWaiver[] = []
  const reasons = ['Merit Based', 'Financial Hardship', 'Scholarship', 'Institutional Policy', 'Special Case']
  const statuses: Array<'Pending' | 'Approved' | 'Rejected'> = ['Pending', 'Approved', 'Rejected']
  
  for (let i = 0; i < count; i++) {
    const baseAmount = 5000 + Math.random() * 20000
    
    waivers.push({
      id: generateId(),
      studentId: generateStudentId(Math.floor(Math.random() * 500)),
      amount: Math.round(baseAmount),
      reason: reasons[Math.floor(Math.random() * reasons.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      requestDate: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      approvalDate: statuses[Math.floor(Math.random() * statuses.length)] === 'Approved' 
        ? new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        : undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })
  }
  
  return waivers
}

export function generateDemoCostHeads(count: number = 10): FinanceCostHead[] {
  const heads: FinanceCostHead[] = []
  
  for (let i = 0; i < Math.min(count, costHeadNames.length); i++) {
    heads.push({
      id: generateId(),
      headCode: `CH${String(i + 1).padStart(3, '0')}`,
      headName: costHeadNames[i],
      headDescription: `Cost head for ${costHeadNames[i].toLowerCase()}`,
      amount: (i + 1) * 5000,
      status: 'Active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })
  }
  
  return heads
}

export function generateDemoCostPackages(count: number = 15): FinanceCostPackage[] {
  const packages: FinanceCostPackage[] = []
  
  for (let i = 0; i < count; i++) {
    const totalAmount = 50000 + Math.random() * 50000
    
    packages.push({
      id: generateId(),
      packageCode: `PKG${String(i + 1).padStart(3, '0')}`,
      packageName: `${programs[Math.floor(Math.random() * programs.length)]} Package ${i + 1}`,
      totalAmount: Math.round(totalAmount),
      status: 'Active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })
  }
  
  return packages
}

export const DEMO_FINANCE_BILLS = generateDemoFinanceBills()
export const DEMO_FINANCE_PAYMENTS = generateDemoFinancePayments()
export const DEMO_LATE_FEES = generateDemoLateFees()
export const DEMO_WAIVERS = generateDemoWaivers()
export const DEMO_COST_HEADS = generateDemoCostHeads()
export const DEMO_COST_PACKAGES = generateDemoCostPackages()
