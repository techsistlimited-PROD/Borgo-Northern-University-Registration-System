import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Download, Printer, AlertCircle } from 'lucide-react'
import { Repo } from '@/lib/repo'
import { formatCurrency, downloadCSV, exportTableToCSV } from '../utils/financeUtils'
import { DEMO_MODE } from '@/config/demo'
import {
  studentBillsStatic,
  paymentsStatic,
  refundsStatic,
  waiverAssignmentsStatic,
  bankStatementsStatic,
  finesStatic,
  holdsStatic,
  unregisteredStudentsStatic
} from '../data/staticSeeds'
import {
  ensureMinRows,
  buildDemoBill,
  buildDemoPayment,
  buildDemoRefund,
  buildDemoWaiverAssignment,
  buildDemoBankStmt,
  buildDemoFine,
  buildDemoHold,
  buildDemoUnregistered
} from '../utils/demoFillers'

type ReportType = 'outstanding' | 'collection' | 'collectionByOfficer' | 'refund' | 'waiver' | 'bank' | 'lateFee' | 'dropReadmission' | 'fines' | 'holds'

export default function FinanceReportsView() {
  const [reportType, setReportType] = useState<ReportType>('outstanding')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [program, setProgram] = useState('All')
  const [semester, setSemester] = useState('All')
  const [method, setMethod] = useState('All')

  const [reportData, setReportData] = useState<any[]>([])
  const [demoDataGenerated, setDemoDataGenerated] = useState(false)

  useEffect(() => {
    generateReport()
  }, [reportType])

  const generateReport = () => {
    // Use static seeds with amplification in DEMO_MODE
    const bills = DEMO_MODE ? ensureMinRows(studentBillsStatic, 200, buildDemoBill) : Repo.get('finance-student-bills')
    const payments = DEMO_MODE ? ensureMinRows(paymentsStatic, 120, buildDemoPayment) : Repo.get('finance-payments')
    const refunds = DEMO_MODE ? ensureMinRows(refundsStatic, 20, buildDemoRefund) : Repo.get('finance-payment-refunds')
    const waivers = DEMO_MODE ? ensureMinRows(waiverAssignmentsStatic, 80, buildDemoWaiverAssignment) : Repo.get('finance-waiver-assignments')
    const bankStatements = DEMO_MODE ? ensureMinRows(bankStatementsStatic, 120, (i) => buildDemoBankStmt(i, { matchRatio: 0.66 })) : Repo.get('finance-bank-statements')
    const fines = DEMO_MODE ? ensureMinRows(finesStatic, 60, buildDemoFine) : Repo.get('finance-student-fines')
    const holds = DEMO_MODE ? ensureMinRows(holdsStatic, 40, buildDemoHold) : Repo.get('finance-student-holds')

    let data: any[] = []
    setDemoDataGenerated(false)

    switch (reportType) {
      case 'outstanding':
        const grouped = bills.reduce((acc: any, bill: any) => {
          const key = `${bill.program}-${bill.semester}`
          if (!acc[key]) {
            acc[key] = {
              program: bill.program,
              semester: bill.semester,
              students: new Set(),
              totalPayable: 0,
              totalPaid: 0,
              totalDue: 0
            }
          }
          acc[key].students.add(bill.studentId)
          acc[key].totalPayable += bill.netTotal ?? 0
          acc[key].totalPaid += bill.paidAmount ?? 0
          acc[key].totalDue += bill.balanceDue ?? 0
          return acc
        }, {})
        
        data = Object.values(grouped).map((g: any) => ({
          ...g,
          students: g.students.size
        }))
        break

      case 'collection':
        data = payments.map((p: any) => ({
          date: p.paymentDate,
          studentId: p.studentId,
          studentName: p.studentName,
          amount: p.totalAmount ?? 0,
          method: p.method,
          receiptNo: p.receiptNo
        }))
        break

      case 'refund':
        data = refunds.map((r: any) => ({
          refundNo: r.refundNo,
          date: r.refundDate,
          studentId: r.studentId,
          studentName: r.studentName,
          program: r.program,
          refundAmount: r.refundAmount ?? 0,
          method: r.refundMethod,
          originalMR: r.originalReceiptNo
        }))
        break

      case 'waiver':
        data = waivers.map((w: any) => ({
          studentId: w.studentId,
          studentName: w.studentName,
          policy: w.policyName,
          percent: w.percent,
          effectiveTerm: w.effectiveTerm,
          assignedBy: w.assignedBy
        }))
        break

      case 'bank':
        data = bankStatements.map((b: any) => ({
          date: b.date,
          reference: b.reference,
          amount: b.amount ?? 0,
          status: b.matched ? 'Matched' : 'Unmatched',
          remarks: b.matchedReceiptNo || b.notes || '-'
        }))
        break

      case 'lateFee':
        const lateFineBills = bills.filter((b: any) => 
          b.lineItems.some((li: any) => li.costHeadCode === '014')
        )
        data = lateFineBills.map((b: any) => {
          const lateFeeItem = b.lineItems.find((li: any) => li.costHeadCode === '014')
          return {
            studentId: b.studentId,
            studentName: b.studentName,
            semester: b.semester,
            fineAmount: lateFeeItem?.netAmount || 0,
            billNo: b.billNo,
            dateApplied: b.updatedAt?.split('T')[0] || b.billDate
          }
        })
        break

      case 'dropReadmission':
        const unregistered = DEMO_MODE ? ensureMinRows(unregisteredStudentsStatic, 60, buildDemoUnregistered) : (Repo.get('finance-unregistered-students') || [])
        data = unregistered.map((s: any) => ({
          studentId: s.studentId,
          studentName: s.studentName,
          program: s.program,
          campus: s.campus,
          lastRegistered: s.lastRegistered,
          status: s.status,
          dropDate: s.dropDate
        }))
        break

      case 'collectionByOfficer':
        const grouped2 = payments.reduce((acc: any, payment: any) => {
          const officer = payment.collectedBy || 'Unknown'
          if (!acc[officer]) {
            acc[officer] = {
              officer,
              totalCollected: 0,
              transactionCount: 0,
              cash: 0,
              bank: 0,
              bKash: 0,
              card: 0,
              other: 0
            }
          }
          acc[officer].totalCollected += payment.totalAmount ?? 0
          acc[officer].transactionCount += 1

          switch(payment.method) {
            case 'Cash':
              acc[officer].cash += payment.totalAmount ?? 0
              break
            case 'Bank':
              acc[officer].bank += payment.totalAmount ?? 0
              break
            case 'bKash':
              acc[officer].bKash += payment.totalAmount ?? 0
              break
            case 'Card':
              acc[officer].card += payment.totalAmount ?? 0
              break
            default:
              acc[officer].other += payment.totalAmount ?? 0
          }
          return acc
        }, {})
        data = Object.values(grouped2)
        break

      case 'fines':
        data = fines.map((f: any) => ({
          studentId: f.studentId,
          studentName: f.studentName,
          fineType: f.fineType,
          amount: f.amount ?? 0,
          date: f.date,
          remarks: f.remarks || '-',
          createdBy: f.createdBy || '-'
        }))
        break

      case 'holds':
        data = holds.map((h: any) => ({
          studentId: h.studentId,
          studentName: h.studentName,
          holdType: h.holdType,
          reason: h.reason,
          date: h.date,
          status: h.status,
          createdBy: h.createdBy || '-',
          removedDate: h.removedDate || '-'
        }))
        break
    }

    setReportData(data)
  }

  const applyFilters = () => {
    let filtered = reportData

    if (program !== 'All') {
      filtered = filtered.filter((row: any) => row.program === program)
    }

    if (semester !== 'All') {
      filtered = filtered.filter((row: any) => row.semester === semester)
    }

    if (method !== 'All') {
      filtered = filtered.filter((row: any) => row.method === method)
    }

    if (dateFrom && dateTo) {
      filtered = filtered.filter((row: any) => {
        const rowDate = row.date || row.dateApplied || row.createdDate
        return rowDate >= dateFrom && rowDate <= dateTo
      })
    }

    return filtered
  }

  const handleExportCSV = () => {
    const filtered = applyFilters()
    if (filtered.length === 0) {
      alert('No data to export')
      return
    }

    const headers = Object.keys(filtered[0])
    const rows = filtered.map((row: any) => Object.values(row))
    const csv = exportTableToCSV(headers, rows)
    downloadCSV(`${reportType}-report-${new Date().toISOString().split('T')[0]}.csv`, csv)
  }

  const handlePrint = () => {
    window.print()
  }

  const filtered = applyFilters()
  const programs = ['All', 'CSE', 'BBA', 'LLB', 'EEE', 'English']
  const semesters = ['All', 'Fall 2024', 'Spring 2025', 'Summer 2025', 'Fall 2025']
  const methods = ['All', 'Cash', 'Bank', 'bKash', 'Card', 'SSLCommerz', 'DBBL Nexus']

  const renderTable = () => {
    switch (reportType) {
      case 'outstanding':
        return (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-3 text-sm font-medium">Program</th>
                <th className="text-left p-3 text-sm font-medium">Semester</th>
                <th className="text-center p-3 text-sm font-medium">Students</th>
                <th className="text-right p-3 text-sm font-medium">Total Payable</th>
                <th className="text-right p-3 text-sm font-medium">Total Paid</th>
                <th className="text-right p-3 text-sm font-medium">Total Due</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row, idx) => (
                <tr key={idx} className="border-t hover:bg-gray-50">
                  <td className="p-3 text-sm font-medium">{row.program}</td>
                  <td className="p-3 text-sm">{row.semester}</td>
                  <td className="p-3 text-sm text-center">{row.students}</td>
                  <td className="p-3 text-sm text-right">{formatCurrency(row.totalPayable)}</td>
                  <td className="p-3 text-sm text-right text-green-600">{formatCurrency(row.totalPaid)}</td>
                  <td className="p-3 text-sm text-right text-red-600 font-semibold">{formatCurrency(row.totalDue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )

      case 'collection':
        return (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-3 text-sm font-medium">Date</th>
                <th className="text-left p-3 text-sm font-medium">Student ID</th>
                <th className="text-left p-3 text-sm font-medium">Student Name</th>
                <th className="text-right p-3 text-sm font-medium">Amount</th>
                <th className="text-left p-3 text-sm font-medium">Method</th>
                <th className="text-left p-3 text-sm font-medium">MR No</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row, idx) => (
                <tr key={idx} className="border-t hover:bg-gray-50">
                  <td className="p-3 text-sm">{row.date}</td>
                  <td className="p-3 text-sm">{row.studentId}</td>
                  <td className="p-3 text-sm font-medium">{row.studentName}</td>
                  <td className="p-3 text-sm text-right font-semibold text-green-600">{formatCurrency(row.amount)}</td>
                  <td className="p-3 text-sm">{row.method}</td>
                  <td className="p-3 text-sm font-mono">{row.receiptNo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )

      case 'refund':
        return (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-3 text-sm font-medium">Refund No</th>
                <th className="text-left p-3 text-sm font-medium">Date</th>
                <th className="text-left p-3 text-sm font-medium">Student ID</th>
                <th className="text-left p-3 text-sm font-medium">Student Name</th>
                <th className="text-left p-3 text-sm font-medium">Program</th>
                <th className="text-right p-3 text-sm font-medium">Refund Amount</th>
                <th className="text-left p-3 text-sm font-medium">Method</th>
                <th className="text-left p-3 text-sm font-medium">Original MR</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row, idx) => (
                <tr key={idx} className="border-t hover:bg-gray-50">
                  <td className="p-3 text-sm font-mono">{row.refundNo}</td>
                  <td className="p-3 text-sm">{row.date}</td>
                  <td className="p-3 text-sm">{row.studentId}</td>
                  <td className="p-3 text-sm font-medium">{row.studentName}</td>
                  <td className="p-3 text-sm">{row.program}</td>
                  <td className="p-3 text-sm text-right font-semibold text-red-600">{formatCurrency(row.refundAmount)}</td>
                  <td className="p-3 text-sm">{row.method}</td>
                  <td className="p-3 text-sm font-mono">{row.originalMR}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )

      case 'waiver':
        return (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-3 text-sm font-medium">Student ID</th>
                <th className="text-left p-3 text-sm font-medium">Student Name</th>
                <th className="text-left p-3 text-sm font-medium">Policy</th>
                <th className="text-center p-3 text-sm font-medium">Percent</th>
                <th className="text-left p-3 text-sm font-medium">Effective Term</th>
                <th className="text-left p-3 text-sm font-medium">Assigned By</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row, idx) => (
                <tr key={idx} className="border-t hover:bg-gray-50">
                  <td className="p-3 text-sm">{row.studentId}</td>
                  <td className="p-3 text-sm font-medium">{row.studentName}</td>
                  <td className="p-3 text-sm">{row.policy}</td>
                  <td className="p-3 text-sm text-center font-semibold">{row.percent}%</td>
                  <td className="p-3 text-sm">{row.effectiveTerm}</td>
                  <td className="p-3 text-sm">{row.assignedBy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )

      case 'bank':
        return (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-3 text-sm font-medium">Date</th>
                <th className="text-left p-3 text-sm font-medium">Reference</th>
                <th className="text-right p-3 text-sm font-medium">Amount</th>
                <th className="text-center p-3 text-sm font-medium">Status</th>
                <th className="text-left p-3 text-sm font-medium">Remarks</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row, idx) => (
                <tr key={idx} className="border-t hover:bg-gray-50">
                  <td className="p-3 text-sm">{row.date}</td>
                  <td className="p-3 text-sm font-mono">{row.reference}</td>
                  <td className="p-3 text-sm text-right font-semibold">{formatCurrency(row.amount)}</td>
                  <td className="p-3 text-sm text-center">
                    <span className={`px-2 py-1 rounded text-xs ${row.status === 'Matched' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="p-3 text-sm">{row.remarks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )

      case 'lateFee':
        return (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-3 text-sm font-medium">Student ID</th>
                <th className="text-left p-3 text-sm font-medium">Student Name</th>
                <th className="text-left p-3 text-sm font-medium">Semester</th>
                <th className="text-right p-3 text-sm font-medium">Fine Amount</th>
                <th className="text-left p-3 text-sm font-medium">Bill No</th>
                <th className="text-left p-3 text-sm font-medium">Date Applied</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row, idx) => (
                <tr key={idx} className="border-t hover:bg-gray-50">
                  <td className="p-3 text-sm">{row.studentId}</td>
                  <td className="p-3 text-sm font-medium">{row.studentName}</td>
                  <td className="p-3 text-sm">{row.semester}</td>
                  <td className="p-3 text-sm text-right font-semibold text-red-600">{formatCurrency(row.fineAmount)}</td>
                  <td className="p-3 text-sm font-mono">{row.billNo}</td>
                  <td className="p-3 text-sm">{row.dateApplied}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )

      case 'dropReadmission':
        return (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-3 text-sm font-medium">Student ID</th>
                <th className="text-left p-3 text-sm font-medium">Student Name</th>
                <th className="text-left p-3 text-sm font-medium">Program</th>
                <th className="text-left p-3 text-sm font-medium">Campus</th>
                <th className="text-left p-3 text-sm font-medium">Last Registered</th>
                <th className="text-center p-3 text-sm font-medium">Status</th>
                <th className="text-left p-3 text-sm font-medium">Drop Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row, idx) => (
                <tr key={idx} className="border-t hover:bg-gray-50">
                  <td className="p-3 text-sm">{row.studentId}</td>
                  <td className="p-3 text-sm font-medium">{row.studentName}</td>
                  <td className="p-3 text-sm">{row.program}</td>
                  <td className="p-3 text-sm">{row.campus}</td>
                  <td className="p-3 text-sm">{row.lastRegistered}</td>
                  <td className="p-3 text-sm text-center">
                    <span className={`px-2 py-1 rounded text-xs ${row.status === 'Dropped' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="p-3 text-sm">{row.dropDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )

      case 'collectionByOfficer':
        return (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-3 text-sm font-medium">Officer</th>
                <th className="text-center p-3 text-sm font-medium">Transactions</th>
                <th className="text-right p-3 text-sm font-medium">Total Collected</th>
                <th className="text-right p-3 text-sm font-medium">Cash</th>
                <th className="text-right p-3 text-sm font-medium">Bank</th>
                <th className="text-right p-3 text-sm font-medium">bKash</th>
                <th className="text-right p-3 text-sm font-medium">Card</th>
                <th className="text-right p-3 text-sm font-medium">Other</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row, idx) => (
                <tr key={idx} className="border-t hover:bg-gray-50">
                  <td className="p-3 text-sm font-medium">{row.officer}</td>
                  <td className="p-3 text-sm text-center">{row.transactionCount}</td>
                  <td className="p-3 text-sm text-right font-bold text-green-600">{formatCurrency(row.totalCollected)}</td>
                  <td className="p-3 text-sm text-right">{formatCurrency(row.cash)}</td>
                  <td className="p-3 text-sm text-right">{formatCurrency(row.bank)}</td>
                  <td className="p-3 text-sm text-right">{formatCurrency(row.bKash)}</td>
                  <td className="p-3 text-sm text-right">{formatCurrency(row.card)}</td>
                  <td className="p-3 text-sm text-right">{formatCurrency(row.other)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )

      case 'fines':
        return (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-3 text-sm font-medium">Student ID</th>
                <th className="text-left p-3 text-sm font-medium">Student Name</th>
                <th className="text-left p-3 text-sm font-medium">Fine Type</th>
                <th className="text-right p-3 text-sm font-medium">Amount</th>
                <th className="text-left p-3 text-sm font-medium">Date</th>
                <th className="text-left p-3 text-sm font-medium">Remarks</th>
                <th className="text-left p-3 text-sm font-medium">Created By</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row, idx) => (
                <tr key={idx} className="border-t hover:bg-gray-50">
                  <td className="p-3 text-sm">{row.studentId}</td>
                  <td className="p-3 text-sm font-medium">{row.studentName}</td>
                  <td className="p-3 text-sm">{row.fineType}</td>
                  <td className="p-3 text-sm text-right font-semibold text-red-600">{formatCurrency(row.amount)}</td>
                  <td className="p-3 text-sm">{row.date}</td>
                  <td className="p-3 text-sm">{row.remarks}</td>
                  <td className="p-3 text-sm">{row.createdBy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )

      case 'holds':
        return (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-3 text-sm font-medium">Student ID</th>
                <th className="text-left p-3 text-sm font-medium">Student Name</th>
                <th className="text-left p-3 text-sm font-medium">Hold Type</th>
                <th className="text-left p-3 text-sm font-medium">Reason</th>
                <th className="text-left p-3 text-sm font-medium">Date</th>
                <th className="text-center p-3 text-sm font-medium">Status</th>
                <th className="text-left p-3 text-sm font-medium">Created By</th>
                <th className="text-left p-3 text-sm font-medium">Removed Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row, idx) => (
                <tr key={idx} className="border-t hover:bg-gray-50">
                  <td className="p-3 text-sm">{row.studentId}</td>
                  <td className="p-3 text-sm font-medium">{row.studentName}</td>
                  <td className="p-3 text-sm">{row.holdType}</td>
                  <td className="p-3 text-sm">{row.reason}</td>
                  <td className="p-3 text-sm">{row.date}</td>
                  <td className="p-3 text-sm text-center">
                    <span className={`px-2 py-1 rounded text-xs ${row.status === 'Active' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="p-3 text-sm">{row.createdBy}</td>
                  <td className="p-3 text-sm">{row.removedDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )
    }
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-deep-plum">Finance Reports</h1>

      <Card>
        <CardHeader>
          <CardTitle>Select Report Type</CardTitle>
        </CardHeader>
        <CardContent>
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value as ReportType)}
            className="w-full px-4 py-3 border rounded-md text-base font-medium"
          >
            <option value="outstanding">Outstanding Dues Summary</option>
            <option value="collection">Collection Summary</option>
            <option value="collectionByOfficer">Collections by Officer</option>
            <option value="refund">Refund Summary</option>
            <option value="fines">Fines Report</option>
            <option value="holds">Holds Report</option>
            <option value="waiver">Waiver Summary</option>
            <option value="bank">Bank Reconciliation</option>
            <option value="lateFee">Late Fee Report</option>
            <option value="dropReadmission">Drop/Readmission Report</option>
          </select>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-3">
            {reportType === 'collection' && (
              <>
                <Input
                  type="date"
                  placeholder="Date From"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                />
                <Input
                  type="date"
                  placeholder="Date To"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                />
                <select
                  value={method}
                  onChange={(e) => setMethod(e.target.value)}
                  className="px-3 py-2 border rounded-md"
                >
                  {methods.map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </>
            )}
            
            {['outstanding', 'collection', 'refund', 'lateFee', 'dropReadmission'].includes(reportType) && (
              <>
                <select
                  value={program}
                  onChange={(e) => setProgram(e.target.value)}
                  className="px-3 py-2 border rounded-md"
                >
                  {programs.map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
                <select
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  className="px-3 py-2 border rounded-md"
                >
                  {semesters.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Report Data</CardTitle>
            <div className="flex gap-2">
              <Button onClick={handleExportCSV} variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
              <Button onClick={handlePrint} variant="outline">
                <Printer className="w-4 h-4 mr-2" />
                Print
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto border rounded">
            {filtered.length > 0 ? renderTable() : (
              <div className="p-12 text-center text-gray-500">
                No data available for the selected filters
              </div>
            )}
          </div>
          {filtered.length > 0 && (
            <div className="mt-4 text-sm text-gray-600">
              Showing {filtered.length} record(s)
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
