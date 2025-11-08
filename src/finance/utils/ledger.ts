import { Repo } from '@/lib/repo'
import { StudentLedgerEntry, StudentBill, Payment, PaymentRefund, StudentFine } from '../data/types'

export const getLedgerForStudent = (studentId: string, semester?: string): StudentLedgerEntry[] => {
  const allEntries = Repo.get<StudentLedgerEntry>('finance-student-ledger')
  let entries = allEntries.filter(e => e.studentId === studentId)
  
  if (semester && semester !== 'All') {
    const bills = Repo.get<StudentBill>('finance-student-bills')
    const payments = Repo.get<Payment>('finance-payments')
    const refunds = Repo.get<PaymentRefund>('finance-refunds')
    
    const semesterBillRefs = bills.filter(b => b.studentId === studentId && b.semester === semester).map(b => b.billNo)
    const semesterPaymentRefs = payments.filter(p => p.studentId === studentId && p.semester === semester).map(p => p.receiptNo)
    const semesterRefundRefs = refunds.filter(r => r.studentId === studentId && r.semester === semester).map(r => r.refundNo)
    
    const validRefs = new Set([...semesterBillRefs, ...semesterPaymentRefs, ...semesterRefundRefs])
    entries = entries.filter(e => validRefs.has(e.reference))
  }
  
  return entries.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
}

export const recalculateLedgerBalance = (studentId: string): void => {
  const entries = Repo.get<StudentLedgerEntry>('finance-student-ledger')
  const studentEntries = entries
    .filter(e => e.studentId === studentId)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  
  let runningBalance = 0
  studentEntries.forEach(entry => {
    runningBalance = runningBalance + entry.debit - entry.credit
    Repo.update('finance-student-ledger', entry.id, { runningBalance })
  })
}

export const addLedgerEntry = (
  studentId: string,
  type: 'Bill' | 'Payment' | 'Adjustment' | 'Refund' | 'Fine',
  reference: string,
  description: string,
  debit: number,
  credit: number
): void => {
  const entries = Repo.get<StudentLedgerEntry>('finance-student-ledger')
  const studentEntries = entries.filter(e => e.studentId === studentId)
  const lastBalance = studentEntries.length > 0 
    ? studentEntries[studentEntries.length - 1].runningBalance 
    : 0
  
  const runningBalance = lastBalance + debit - credit

  const entry: StudentLedgerEntry = {
    id: `ledger-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    studentId,
    date: new Date().toISOString().split('T')[0],
    type,
    reference,
    description,
    debit,
    credit,
    runningBalance
  }

  Repo.add('finance-student-ledger', entry)
}

export const getStudentSummary = (studentId: string) => {
  const bills = Repo.get<StudentBill>('finance-student-bills').filter(b => b.studentId === studentId)
  const payments = Repo.get<Payment>('finance-payments').filter(p => p.studentId === studentId)
  const fines = Repo.get<StudentFine>('finance-fines').filter(f => f.studentId === studentId)
  const holds = Repo.get('finance-holds').filter((h: any) => h.studentId === studentId && h.status === 'Active')
  
  const totalPayable = bills.reduce((sum, b) => sum + b.netTotal, 0)
  const totalPaid = payments.reduce((sum, p) => sum + p.totalAmount, 0)
  const totalFines = fines.reduce((sum, f) => sum + f.amount, 0)
  const currentDues = totalPayable + totalFines - totalPaid
  
  const studentName = bills[0]?.studentName || payments[0]?.studentName || ''
  const program = bills[0]?.program || payments[0]?.program || ''
  const campus = bills[0]?.campus || payments[0]?.campus || ''
  
  return {
    studentId,
    studentName,
    program,
    campus,
    totalPayable,
    totalPaid,
    totalFines,
    currentDues,
    hasHolds: holds.length > 0,
    holds
  }
}

export const reverseRefundAlloca = (refund: PaymentRefund): void => {
  const bills = Repo.get<StudentBill>('finance-student-bills')
  
  refund.allocations.forEach(allocation => {
    const bill = bills.find(b => b.id === allocation.billId)
    if (bill) {
      const newPaid = bill.paidAmount - allocation.allocatedAmount
      const newBalance = bill.balanceDue + allocation.allocatedAmount
      
      Repo.update('finance-student-bills', bill.id, {
        paidAmount: Math.max(0, newPaid),
        balanceDue: newBalance,
        status: newBalance >= bill.netTotal ? 'Issued' : newBalance > 0 ? 'Partial' : 'Paid'
      })
    }
  })
}
