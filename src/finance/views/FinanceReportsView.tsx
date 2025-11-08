import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Download, Printer, FileText, Calendar, DollarSign } from 'lucide-react'
import { Repo } from '@/lib/repo'
import { StudentBill, Payment } from '../data/types'
import { formatCurrency, exportTableToCSV, downloadCSV } from '../utils/financeUtils'

type ReportType = 'collection_summary' | 'dues_aging' | 'revenue_by_head' | 'cashier_recon' | 'waiver_impact' | 'payment_mix' | 'outstanding_by_program' | 'mr_register'

export default function FinanceReportsView() {
  const [selectedReport, setSelectedReport] = useState<ReportType>('collection_summary')
  const [dateFrom, setDateFrom] = useState('2024-01-01')
  const [dateTo, setDateTo] = useState(new Date().toISOString().split('T')[0])
  const [selectedProgram, setSelectedProgram] = useState('All')
  const [selectedMethod, setSelectedMethod] = useState('All')
  const [reportData, setReportData] = useState<any[]>([])

  const reports = [
    { id: 'collection_summary', name: 'Collection Summary', icon: DollarSign },
    { id: 'dues_aging', name: 'Dues Aging Detail', icon: Calendar },
    { id: 'revenue_by_head', name: 'Revenue by Cost Head', icon: FileText },
    { id: 'cashier_recon', name: 'Cashier Reconciliation', icon: DollarSign },
    { id: 'waiver_impact', name: 'Scholarship/Waiver Impact', icon: FileText },
    { id: 'payment_mix', name: 'Payment Method Mix', icon: DollarSign },
    { id: 'outstanding_by_program', name: 'Outstanding by Program/Campus', icon: FileText },
    { id: 'mr_register', name: 'MR Register', icon: FileText }
  ]

  useEffect(() => {
    generateReport()
  }, [selectedReport, dateFrom, dateTo, selectedProgram, selectedMethod])

  const generateReport = () => {
    const bills = Repo.get<StudentBill>('finance-student-bills')
    const payments = Repo.get<Payment>('finance-payments')
    const waiverAssignments = Repo.get('finance-waiver-assignments')

    switch (selectedReport) {
      case 'collection_summary':
        generateCollectionSummary(payments)
        break
      case 'dues_aging':
        generateDuesAging(bills)
        break
      case 'revenue_by_head':
        generateRevenueByHead(bills)
        break
      case 'cashier_recon':
        generateCashierRecon(payments)
        break
      case 'waiver_impact':
        generateWaiverImpact(bills, waiverAssignments)
        break
      case 'payment_mix':
        generatePaymentMix(payments)
        break
      case 'outstanding_by_program':
        generateOutstandingByProgram(bills)
        break
      case 'mr_register':
        generateMRRegister(payments)
        break
    }
  }

  const generateCollectionSummary = (payments: Payment[]) => {
    const filtered = payments.filter(p => {
      const date = new Date(p.paymentDate)
      return date >= new Date(dateFrom) && date <= new Date(dateTo) &&
             (selectedProgram === 'All' || p.program === selectedProgram) &&
             (selectedMethod === 'All' || p.method === selectedMethod)
    })

    const summary = filtered.reduce((acc, p) => {
      const key = `${p.paymentDate}-${p.method}`
      if (!acc[key]) {
        acc[key] = { date: p.paymentDate, method: p.method, count: 0, amount: 0 }
      }
      acc[key].count++
      acc[key].amount += p.totalAmount
      return acc
    }, {} as Record<string, any>)

    setReportData(Object.values(summary))
  }

  const generateDuesAging = (bills: StudentBill[]) => {
    const today = new Date()
    const data = bills
      .filter(b => b.balanceDue > 0)
      .map(b => {
        const dueDate = new Date(b.dueDate)
        const daysPastDue = Math.floor((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24))
        const bucket = daysPastDue <= 30 ? '0-30' : daysPastDue <= 60 ? '31-60' : daysPastDue <= 90 ? '61-90' : '>90'
        return {
          studentId: b.studentId,
          studentName: b.studentName,
          program: b.program,
          billNo: b.billNo,
          dueDate: b.dueDate,
          balanceDue: b.balanceDue,
          daysPastDue,
          bucket
        }
      })
      .sort((a, b) => b.daysPastDue - a.daysPastDue)

    setReportData(data.slice(0, 50))
  }

  const generateRevenueByHead = (bills: StudentBill[]) => {
    const revenue: Record<string, { costHead: string; amount: number }> = {}

    bills.forEach(bill => {
      bill.lineItems.forEach(li => {
        if (!revenue[li.costHeadCode]) {
          revenue[li.costHeadCode] = { costHead: li.costHeadName, amount: 0 }
        }
        revenue[li.costHeadCode].amount += li.netAmount
      })
    })

    setReportData(Object.values(revenue).sort((a, b) => b.amount - a.amount).slice(0, 40))
  }

  const generateCashierRecon = (payments: Payment[]) => {
    const byOfficer: Record<string, { officer: string; count: number; amount: number; matched: number }> = {}

    payments.forEach(p => {
      if (!byOfficer[p.collectedBy]) {
        byOfficer[p.collectedBy] = { officer: p.collectedBy, count: 0, amount: 0, matched: 0 }
      }
      byOfficer[p.collectedBy].count++
      byOfficer[p.collectedBy].amount += p.totalAmount
      if (p.status === 'Completed') {
        byOfficer[p.collectedBy].matched++
      }
    })

    setReportData(Object.values(byOfficer))
  }

  const generateWaiverImpact = (bills: StudentBill[], assignments: any[]) => {
    const impact: Record<string, { policy: string; students: number; amountForgone: number }> = {}

    assignments.forEach(a => {
      if (!impact[a.policyCode]) {
        impact[a.policyCode] = { policy: a.policyName, students: 0, amountForgone: 0 }
      }
      impact[a.policyCode].students++
    })

    bills.forEach(bill => {
      impact['Total'] = impact['Total'] || { policy: 'All Waivers', students: 0, amountForgone: 0 }
      impact['Total'].amountForgone += bill.waiverTotal + bill.scholarshipTotal
    })

    setReportData(Object.values(impact))
  }

  const generatePaymentMix = (payments: Payment[]) => {
    const mix: Record<string, { method: string; count: number; amount: number; percentage: number }> = {}

    payments.forEach(p => {
      if (!mix[p.method]) {
        mix[p.method] = { method: p.method, count: 0, amount: 0, percentage: 0 }
      }
      mix[p.method].count++
      mix[p.method].amount += p.totalAmount
    })

    const total = Object.values(mix).reduce((sum, m) => sum + m.amount, 0)
    Object.values(mix).forEach(m => {
      m.percentage = (m.amount / total) * 100
    })

    setReportData(Object.values(mix))
  }

  const generateOutstandingByProgram = (bills: StudentBill[]) => {
    const outstanding: Record<string, { program: string; campus: string; students: Set<string>; balance: number }> = {}

    bills
      .filter(b => b.balanceDue > 0)
      .forEach(b => {
        const key = `${b.program}-${b.campus}`
        if (!outstanding[key]) {
          outstanding[key] = { program: b.program, campus: b.campus, students: new Set(), balance: 0 }
        }
        outstanding[key].students.add(b.studentId)
        outstanding[key].balance += b.balanceDue
      })

    setReportData(
      Object.values(outstanding)
        .map(o => ({ ...o, studentCount: o.students.size }))
        .sort((a, b) => b.balance - a.balance)
    )
  }

  const generateMRRegister = (payments: Payment[]) => {
    const filtered = payments
      .filter(p => {
        const date = new Date(p.paymentDate)
        return date >= new Date(dateFrom) && date <= new Date(dateTo)
      })
      .sort((a, b) => a.receiptNo.localeCompare(b.receiptNo))

    setReportData(filtered.slice(0, 50))
  }

  const handleExport = () => {
    const headers = getReportHeaders()
    const rows = getReportRows()
    const csv = exportTableToCSV(headers, rows)
    downloadCSV(`${selectedReport}_${new Date().toISOString().split('T')[0]}.csv`, csv)
  }

  const handlePrint = () => {
    window.print()
  }

  const getReportHeaders = (): string[] => {
    switch (selectedReport) {
      case 'collection_summary':
        return ['Date', 'Method', 'Count', 'Amount']
      case 'dues_aging':
        return ['Student ID', 'Student Name', 'Program', 'Bill No', 'Due Date', 'Balance Due', 'Days Past Due', 'Bucket']
      case 'revenue_by_head':
        return ['Cost Head', 'Amount']
      case 'cashier_recon':
        return ['Officer', 'MR Count', 'Total Amount', 'Matched']
      case 'waiver_impact':
        return ['Policy', 'Students', 'Amount Forgone']
      case 'payment_mix':
        return ['Method', 'Count', 'Amount', 'Percentage']
      case 'outstanding_by_program':
        return ['Program', 'Campus', 'Students', 'Balance']
      case 'mr_register':
        return ['Receipt No', 'Date', 'Student ID', 'Student Name', 'Amount', 'Method', 'Collected By']
      default:
        return []
    }
  }

  const getReportRows = (): any[][] => {
    switch (selectedReport) {
      case 'collection_summary':
        return reportData.map(r => [r.date, r.method, r.count, r.amount])
      case 'dues_aging':
        return reportData.map(r => [r.studentId, r.studentName, r.program, r.billNo, r.dueDate, r.balanceDue, r.daysPastDue, r.bucket])
      case 'revenue_by_head':
        return reportData.map(r => [r.costHead, r.amount])
      case 'cashier_recon':
        return reportData.map(r => [r.officer, r.count, r.amount, r.matched])
      case 'waiver_impact':
        return reportData.map(r => [r.policy, r.students, r.amountForgone])
      case 'payment_mix':
        return reportData.map(r => [r.method, r.count, r.amount, r.percentage])
      case 'outstanding_by_program':
        return reportData.map(r => [r.program, r.campus, r.studentCount, r.balance])
      case 'mr_register':
        return reportData.map((r: Payment) => [r.receiptNo, r.paymentDate, r.studentId, r.studentName, r.totalAmount, r.method, r.collectedBy])
      default:
        return []
    }
  }

  const renderReportTable = () => {
    const headers = getReportHeaders()

    return (
      <div className="overflow-x-auto border rounded" style={{ maxHeight: '650px', overflowY: 'auto' }}>
        <table className="w-full">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              {headers.map((header, idx) => (
                <th key={idx} className={`p-3 text-xs font-medium ${header.includes('Amount') || header.includes('Balance') || header.includes('Count') ? 'text-right' : 'text-left'}`}>
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {reportData.map((row, idx) => (
              <tr key={idx} className="border-t hover:bg-gray-50">
                {selectedReport === 'collection_summary' && (
                  <>
                    <td className="p-3 text-sm">{row.date}</td>
                    <td className="p-3 text-sm"><Badge variant="outline">{row.method}</Badge></td>
                    <td className="p-3 text-sm text-right">{row.count}</td>
                    <td className="p-3 text-sm text-right font-semibold">{formatCurrency(row.amount)}</td>
                  </>
                )}
                {selectedReport === 'dues_aging' && (
                  <>
                    <td className="p-3 text-sm">{row.studentId}</td>
                    <td className="p-3 text-sm font-medium">{row.studentName}</td>
                    <td className="p-3 text-sm">{row.program}</td>
                    <td className="p-3 text-sm font-mono">{row.billNo}</td>
                    <td className="p-3 text-sm">{row.dueDate}</td>
                    <td className="p-3 text-sm text-right font-semibold text-red-600">{formatCurrency(row.balanceDue)}</td>
                    <td className="p-3 text-sm text-right">{row.daysPastDue}</td>
                    <td className="p-3 text-sm">
                      <Badge className={
                        row.bucket === '0-30' ? 'bg-green-100 text-green-800' :
                        row.bucket === '31-60' ? 'bg-yellow-100 text-yellow-800' :
                        row.bucket === '61-90' ? 'bg-orange-100 text-orange-800' :
                        'bg-red-100 text-red-800'
                      }>{row.bucket} days</Badge>
                    </td>
                  </>
                )}
                {selectedReport === 'revenue_by_head' && (
                  <>
                    <td className="p-3 text-sm font-medium">{row.costHead}</td>
                    <td className="p-3 text-sm text-right font-semibold text-green-600">{formatCurrency(row.amount)}</td>
                  </>
                )}
                {selectedReport === 'cashier_recon' && (
                  <>
                    <td className="p-3 text-sm font-medium">{row.officer}</td>
                    <td className="p-3 text-sm text-right">{row.count}</td>
                    <td className="p-3 text-sm text-right font-semibold">{formatCurrency(row.amount)}</td>
                    <td className="p-3 text-sm text-right">{row.matched}</td>
                  </>
                )}
                {selectedReport === 'waiver_impact' && (
                  <>
                    <td className="p-3 text-sm font-medium">{row.policy}</td>
                    <td className="p-3 text-sm text-right">{row.students}</td>
                    <td className="p-3 text-sm text-right font-semibold text-red-600">{formatCurrency(row.amountForgone)}</td>
                  </>
                )}
                {selectedReport === 'payment_mix' && (
                  <>
                    <td className="p-3 text-sm font-medium">{row.method}</td>
                    <td className="p-3 text-sm text-right">{row.count}</td>
                    <td className="p-3 text-sm text-right font-semibold">{formatCurrency(row.amount)}</td>
                    <td className="p-3 text-sm text-right">{row.percentage.toFixed(1)}%</td>
                  </>
                )}
                {selectedReport === 'outstanding_by_program' && (
                  <>
                    <td className="p-3 text-sm font-medium">{row.program}</td>
                    <td className="p-3 text-sm">{row.campus}</td>
                    <td className="p-3 text-sm text-right">{row.studentCount}</td>
                    <td className="p-3 text-sm text-right font-semibold text-red-600">{formatCurrency(row.balance)}</td>
                  </>
                )}
                {selectedReport === 'mr_register' && (
                  <>
                    <td className="p-3 text-sm font-mono font-semibold text-blue-600">{row.receiptNo}</td>
                    <td className="p-3 text-sm">{row.paymentDate}</td>
                    <td className="p-3 text-sm">{row.studentId}</td>
                    <td className="p-3 text-sm font-medium">{row.studentName}</td>
                    <td className="p-3 text-sm text-right font-semibold text-green-600">{formatCurrency(row.totalAmount)}</td>
                    <td className="p-3 text-sm"><Badge variant="outline">{row.method}</Badge></td>
                    <td className="p-3 text-sm">{row.collectedBy}</td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-deep-plum">Finance Reports</h1>
          <p className="text-sm text-gray-600">Comprehensive reporting with exports</p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {reports.map(report => {
          const Icon = report.icon
          return (
            <button
              key={report.id}
              onClick={() => setSelectedReport(report.id as ReportType)}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectedReport === report.id
                  ? 'border-accent-purple bg-accent-purple text-white'
                  : 'border-gray-200 hover:border-accent-purple hover:bg-purple-50'
              }`}
            >
              <Icon className="w-6 h-6 mb-2 mx-auto" />
              <p className="text-sm font-medium text-center">{report.name}</p>
            </button>
          )
        })}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{reports.find(r => r.id === selectedReport)?.name}</CardTitle>
            <div className="flex gap-2">
              <Button onClick={handleExport} variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                CSV
              </Button>
              <Button onClick={handlePrint} variant="outline" size="sm">
                <Printer className="w-4 h-4 mr-2" />
                Print
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4 p-4 bg-gray-50 rounded flex gap-4">
            <div>
              <label className="block text-xs font-medium mb-1">From Date</label>
              <Input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">To Date</label>
              <Input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="text-sm"
              />
            </div>
            {(selectedReport === 'collection_summary' || selectedReport === 'outstanding_by_program') && (
              <div>
                <label className="block text-xs font-medium mb-1">Program</label>
                <select
                  value={selectedProgram}
                  onChange={(e) => setSelectedProgram(e.target.value)}
                  className="px-3 py-2 border rounded-md text-sm"
                >
                  <option value="All">All</option>
                  <option value="CSE">CSE</option>
                  <option value="BBA">BBA</option>
                  <option value="LLB">LLB</option>
                </select>
              </div>
            )}
            {selectedReport === 'collection_summary' && (
              <div>
                <label className="block text-xs font-medium mb-1">Method</label>
                <select
                  value={selectedMethod}
                  onChange={(e) => setSelectedMethod(e.target.value)}
                  className="px-3 py-2 border rounded-md text-sm"
                >
                  <option value="All">All</option>
                  <option value="Cash">Cash</option>
                  <option value="Bank">Bank</option>
                  <option value="bKash">bKash</option>
                </select>
              </div>
            )}
          </div>

          {renderReportTable()}

          <div className="mt-4 text-sm text-gray-600">
            Showing {reportData.length} records
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
