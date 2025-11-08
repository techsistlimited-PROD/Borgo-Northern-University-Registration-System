import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search, Printer, AlertTriangle } from 'lucide-react'
import { getLedgerForStudent, getStudentSummary } from '../utils/ledger'
import { formatCurrency } from '../utils/financeUtils'

export default function StudentLedgerView() {
  const [studentId, setStudentId] = useState('')
  const [semester, setSemester] = useState('All')
  const [program, setProgram] = useState('All')
  
  const [ledgerEntries, setLedgerEntries] = useState<any[]>([])
  const [summary, setSummary] = useState<any>(null)
  const [searched, setSearched] = useState(false)

  const handleSearch = () => {
    if (!studentId) {
      alert('Please enter Student ID')
      return
    }

    const entries = getLedgerForStudent(studentId, semester)
    const studentSummary = getStudentSummary(studentId)

    setLedgerEntries(entries)
    setSummary(studentSummary)
    setSearched(true)
  }

  const handlePrint = () => {
    const printWindow = window.open('', '_blank')
    if (!printWindow) return

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Student Ledger - ${studentId}</title>
  <style>
    @page { size: A4 portrait; margin: 15mm; }
    body { font-family: Arial, sans-serif; font-size: 10pt; padding: 15px; }
    .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 15px; margin-bottom: 20px; }
    .header h1 { font-size: 18pt; font-weight: bold; margin: 5px 0; text-transform: uppercase; }
    .header h2 { font-size: 12pt; margin: 5px 0; color: #666; }
    .profile { background: #f5f5f5; padding: 15px; margin-bottom: 20px; border: 1px solid #ddd; }
    .profile-row { display: flex; justify-content: space-between; margin: 5px 0; }
    .warning { background: #fee; border: 2px solid #f00; color: #c00; padding: 10px; margin: 10px 0; font-weight: bold; }
    table { width: 100%; border-collapse: collapse; margin: 15px 0; }
    th, td { border: 1px solid #333; padding: 6px; text-align: left; font-size: 9pt; }
    th { background: #e0e0e0; font-weight: bold; }
    .text-right { text-align: right; }
    .text-center { text-align: center; }
    .total-row { background: #f5f5f5; font-weight: bold; }
    .footer { margin-top: 30px; text-align: center; font-size: 8pt; color: #666; }
  </style>
</head>
<body>
  <div class="header">
    <h1>Northern University Bangladesh</h1>
    <h2>Student Ledger</h2>
  </div>

  <div class="profile">
    <div class="profile-row"><span><strong>Student ID:</strong> ${summary?.studentId || studentId}</span></div>
    <div class="profile-row"><span><strong>Student Name:</strong> ${summary?.studentName || 'N/A'}</span></div>
    <div class="profile-row"><span><strong>Program:</strong> ${summary?.program || 'N/A'}</span><span><strong>Campus:</strong> ${summary?.campus || 'N/A'}</span></div>
    <div class="profile-row"><span><strong>Total Payable:</strong> ${summary ? formatCurrency(summary.totalPayable) : 'N/A'}</span></div>
    <div class="profile-row"><span><strong>Total Paid:</strong> ${summary ? formatCurrency(summary.totalPaid) : 'N/A'}</span></div>
    <div class="profile-row"><span><strong>Current Dues:</strong> ${summary ? formatCurrency(summary.currentDues) : 'N/A'}</span></div>
  </div>

  ${summary?.hasHolds ? `
    <div class="warning">
      ⚠ FINANCE HOLD ACTIVE - This student has active holds that may restrict registration or other services.
    </div>
  ` : ''}

  <table>
    <thead>
      <tr>
        <th>Date</th>
        <th>Particular</th>
        <th>Bill No</th>
        <th class="text-right">Debit</th>
        <th class="text-right">Credit</th>
        <th class="text-right">Balance</th>
      </tr>
    </thead>
    <tbody>
      ${ledgerEntries.map(entry => `
        <tr>
          <td>${entry.date}</td>
          <td>${entry.description}</td>
          <td>${entry.reference}</td>
          <td class="text-right">${entry.debit > 0 ? formatCurrency(entry.debit) : '-'}</td>
          <td class="text-right">${entry.credit > 0 ? formatCurrency(entry.credit) : '-'}</td>
          <td class="text-right">${formatCurrency(entry.runningBalance)}</td>
        </tr>
      `).join('')}
      ${ledgerEntries.length > 0 ? `
        <tr class="total-row">
          <td colspan="3" class="text-right">Final Balance:</td>
          <td></td>
          <td></td>
          <td class="text-right">${formatCurrency(ledgerEntries[ledgerEntries.length - 1]?.runningBalance || 0)}</td>
        </tr>
      ` : ''}
    </tbody>
  </table>

  <div class="footer">
    <p>Generated on ${new Date().toLocaleString('en-GB')}</p>
    <p>Northern University Bangladesh - Finance Department</p>
  </div>

  <script>
    window.onload = function() { window.print(); }
  </script>
</body>
</html>
    `

    printWindow.document.write(html)
    printWindow.document.close()
  }

  const semesters = ['All', 'Fall 2024', 'Spring 2025', 'Summer 2025', 'Fall 2025']
  const programs = ['All', 'CSE', 'BBA', 'LLB', 'EEE', 'English']

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-deep-plum">Student Ledger</h1>

      <Card>
        <CardHeader>
          <CardTitle>Search Student</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Student ID *</label>
              <Input
                placeholder="Enter Student ID"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Semester</label>
              <select
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
              >
                {semesters.map(sem => (
                  <option key={sem} value={sem}>{sem}</option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Program</label>
              <select
                value={program}
                onChange={(e) => setProgram(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
              >
                {programs.map(prog => (
                  <option key={prog} value={prog}>{prog}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <Button onClick={handleSearch} className="nu-button-primary">
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {searched && summary && (
        <>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Student Profile</CardTitle>
                <Button onClick={handlePrint} variant="outline">
                  <Printer className="w-4 h-4 mr-2" />
                  Print Ledger
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Student Name</p>
                  <p className="font-semibold text-lg">{summary.studentName || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Student ID</p>
                  <p className="font-mono font-semibold">{summary.studentId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Program</p>
                  <p className="font-medium">{summary.program || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Campus</p>
                  <p className="font-medium">{summary.campus || 'N/A'}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="p-4 bg-blue-50 rounded border border-blue-200">
                  <p className="text-sm text-gray-600">Total Payable</p>
                  <p className="text-xl font-bold text-blue-600">{formatCurrency(summary.totalPayable)}</p>
                </div>
                <div className="p-4 bg-green-50 rounded border border-green-200">
                  <p className="text-sm text-gray-600">Total Paid</p>
                  <p className="text-xl font-bold text-green-600">{formatCurrency(summary.totalPaid)}</p>
                </div>
                <div className="p-4 bg-red-50 rounded border border-red-200">
                  <p className="text-sm text-gray-600">Current Dues</p>
                  <p className="text-xl font-bold text-red-600">{formatCurrency(summary.currentDues)}</p>
                </div>
              </div>

              {summary.hasHolds && (
                <div className="mt-4 p-4 bg-red-100 border-2 border-red-500 rounded">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                    <span className="font-bold text-red-800">FINANCE HOLD ACTIVE</span>
                  </div>
                  <div className="mt-2 space-y-1">
                    {summary.holds.map((hold: any) => (
                      <div key={hold.id} className="text-sm">
                        <Badge className="bg-red-600">{hold.holdType}</Badge>
                        <span className="ml-2 text-red-800">{hold.reason}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ledger Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto border rounded">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left p-3 text-sm font-medium">Date</th>
                      <th className="text-left p-3 text-sm font-medium">Particular</th>
                      <th className="text-left p-3 text-sm font-medium">Bill No</th>
                      <th className="text-right p-3 text-sm font-medium">Debit</th>
                      <th className="text-right p-3 text-sm font-medium">Credit</th>
                      <th className="text-right p-3 text-sm font-medium">Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ledgerEntries.map(entry => (
                      <tr key={entry.id} className="border-t hover:bg-gray-50">
                        <td className="p-3 text-sm">{entry.date}</td>
                        <td className="p-3 text-sm">{entry.description}</td>
                        <td className="p-3 text-sm font-mono">{entry.reference}</td>
                        <td className="p-3 text-sm text-right font-semibold text-red-600">
                          {entry.debit > 0 ? formatCurrency(entry.debit) : '-'}
                        </td>
                        <td className="p-3 text-sm text-right font-semibold text-green-600">
                          {entry.credit > 0 ? formatCurrency(entry.credit) : '-'}
                        </td>
                        <td className="p-3 text-sm text-right font-bold">
                          {formatCurrency(entry.runningBalance)}
                        </td>
                      </tr>
                    ))}
                    {ledgerEntries.length === 0 && (
                      <tr>
                        <td colSpan={6} className="p-6 text-center text-gray-500">
                          No ledger entries found for this student
                        </td>
                      </tr>
                    )}
                    {ledgerEntries.length > 0 && (
                      <tr className="border-t-2 bg-blue-50 font-bold">
                        <td colSpan={3} className="p-3 text-sm text-right">Final Balance:</td>
                        <td className="p-3 text-sm text-right">
                          {formatCurrency(ledgerEntries.reduce((sum, e) => sum + e.debit, 0))}
                        </td>
                        <td className="p-3 text-sm text-right">
                          {formatCurrency(ledgerEntries.reduce((sum, e) => sum + e.credit, 0))}
                        </td>
                        <td className="p-3 text-sm text-right text-lg">
                          {formatCurrency(ledgerEntries[ledgerEntries.length - 1]?.runningBalance || 0)}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {searched && !summary && (
        <Card>
          <CardContent className="p-12 text-center text-gray-500">
            <p>No records found for Student ID: {studentId}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
