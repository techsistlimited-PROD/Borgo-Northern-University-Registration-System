import { StudentBill, BillLineItem, CostPackage, Payment, PaymentAllocation, StudentLedgerEntry } from '../data/types'
import { Repo } from '@/lib/repo'

export const formatCurrency = (amount: number): string => {
  return `BDT ${amount.toLocaleString('en-BD', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export const formatShortId = (studentId: string, program: string): string => {
  return `${program} ${studentId}`
}

export const calculateLateFee = (bill: StudentBill, paidPercent: number, rules: any[]): number => {
  for (const rule of rules.sort((a, b) => a.threshold - b.threshold)) {
    if (paidPercent < rule.threshold) {
      if (rule.feeType === 'Flat') {
        return rule.feeAmount
      } else {
        return (bill.netTotal * rule.feeAmount) / 100
      }
    }
  }
  return 0
}

export const rebuildBillFromPackage = (
  studentId: string,
  studentName: string,
  program: string,
  campus: string,
  semester: string,
  packageId: string,
  creditsTaken: number = 12
): StudentBill => {
  const packages = Repo.get<CostPackage>('finance-cost-packages')
  const pkg = packages.find(p => p.id === packageId)
  
  if (!pkg) {
    throw new Error('Package not found')
  }

  const costHeads = Repo.get('finance-cost-heads')
  const lineItems: BillLineItem[] = pkg.components.map((comp, idx) => {
    const costHead = costHeads.find((ch: any) => ch.code === comp.costHeadCode)
    const qty = comp.mode === 'Per Credit' ? creditsTaken : comp.mode === 'Per Course' ? 1 : 1
    const subtotal = comp.rate * qty
    
    return {
      id: `li-${Date.now()}-${idx}`,
      costHeadCode: comp.costHeadCode,
      costHeadName: costHead?.name || comp.costHeadCode,
      mode: comp.mode,
      quantity: qty,
      rate: comp.rate,
      subtotal,
      waiverPercent: 0,
      scholarshipPercent: 0,
      deduction: 0,
      netAmount: subtotal
    }
  })

  const grossTotal = lineItems.reduce((sum, li) => sum + li.subtotal, 0)
  const netTotal = lineItems.reduce((sum, li) => sum + li.netAmount, 0)

  const billNo = `INV-${semester.replace(' ', '')}-${String(Math.floor(Math.random() * 9999) + 1).padStart(4, '0')}`

  return {
    id: `bill-${Date.now()}`,
    billNo,
    studentId,
    studentName,
    program,
    campus,
    semester,
    billDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    lineItems,
    grossTotal,
    waiverTotal: 0,
    scholarshipTotal: 0,
    deductionTotal: 0,
    netTotal,
    paidAmount: 0,
    balanceDue: netTotal,
    status: 'Issued',
    packageId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
}

export const allocatePaymentToEarliestDues = (
  studentId: string,
  paymentAmount: number
): PaymentAllocation[] => {
  const bills = Repo.get<StudentBill>('finance-student-bills')
  const studentBills = bills
    .filter(b => b.studentId === studentId && b.balanceDue > 0)
    .sort((a, b) => {
      const dateCompare = new Date(a.billDate).getTime() - new Date(b.billDate).getTime()
      if (dateCompare !== 0) return dateCompare
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    })

  const allocations: PaymentAllocation[] = []
  let remainingAmount = paymentAmount

  for (const bill of studentBills) {
    if (remainingAmount <= 0) break

    const allocatedAmount = Math.min(remainingAmount, bill.balanceDue)
    allocations.push({
      billId: bill.id,
      billNo: bill.billNo,
      allocatedAmount
    })

    bill.paidAmount += allocatedAmount
    bill.balanceDue -= allocatedAmount
    bill.status = bill.balanceDue === 0 ? 'Paid' : bill.balanceDue < bill.netTotal ? 'Partial' : bill.status
    Repo.update('finance-student-bills', bill.id, bill)

    remainingAmount -= allocatedAmount
  }

  return allocations
}

export const addLedgerEntry = (
  studentId: string,
  type: 'Bill' | 'Payment' | 'Adjustment',
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
    id: `ledger-${Date.now()}`,
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

export const parseBillCSV = (csvContent: string): Partial<StudentBill>[] => {
  const lines = csvContent.trim().split('\n')
  const headers = lines[0].split(',').map(h => h.trim())
  
  const bills: Map<string, Partial<StudentBill>> = new Map()

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim())
    const row: any = {}
    headers.forEach((h, idx) => {
      row[h] = values[idx]
    })

    const key = `${row.StudentID}-${row.Semester}`
    
    if (!bills.has(key)) {
      bills.set(key, {
        studentId: row.StudentID,
        semester: row.Semester,
        lineItems: []
      })
    }

    const bill = bills.get(key)!
    const lineItem: BillLineItem = {
      id: `li-${Date.now()}-${i}`,
      costHeadCode: row.CostHead,
      costHeadName: row.CostHead,
      mode: row.Mode as any,
      quantity: parseFloat(row.Qty || '1'),
      rate: parseFloat(row.Rate || '0'),
      subtotal: parseFloat(row.Qty || '1') * parseFloat(row.Rate || '0'),
      waiverPercent: parseFloat(row['Waiver%'] || '0'),
      scholarshipPercent: parseFloat(row['Scholarship%'] || '0'),
      deduction: 0,
      netAmount: 0,
      notes: row.Notes
    }

    lineItem.netAmount = lineItem.subtotal * (1 - lineItem.waiverPercent / 100) * (1 - lineItem.scholarshipPercent / 100)
    bill.lineItems!.push(lineItem)
  }

  return Array.from(bills.values())
}

export const exportTableToCSV = (headers: string[], rows: any[][]): string => {
  const csvRows = [headers.join(',')]
  rows.forEach(row => {
    csvRows.push(row.map(cell => `"${cell}"`).join(','))
  })
  return csvRows.join('\n')
}

export const downloadCSV = (filename: string, content: string): void => {
  const blob = new Blob([content], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  window.URL.revokeObjectURL(url)
}

export const printElement = (elementId: string): void => {
  const element = document.getElementById(elementId)
  if (!element) return

  const printWindow = window.open('', '', 'width=800,height=600')
  if (!printWindow) return

  printWindow.document.write(`
    <html>
      <head>
        <title>Print</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          table { width: 100%; border-collapse: collapse; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f4f4f4; }
          @media print {
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        ${element.innerHTML}
      </body>
    </html>
  `)
  printWindow.document.close()
  printWindow.print()
}
