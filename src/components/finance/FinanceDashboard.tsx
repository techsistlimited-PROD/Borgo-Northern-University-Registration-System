import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { DollarSign, Users, Lock, Award, Download, Eye, FileText } from 'lucide-react'

interface OfficerCollection {
  officer: string
  mode: string
  receipts: number
  amount: number
  lastReceipt: string
}

interface OfficerReceipt {
  receiptNo: string
  time: string
  studentId: string
  studentName: string
  amount: number
  method: string
}

export default function FinanceDashboard() {
  const [viewDetailsOpen, setViewDetailsOpen] = useState(false)
  const [selectedOfficer, setSelectedOfficer] = useState<OfficerCollection | null>(null)

  const handleViewReceipt = (receipt: OfficerReceipt) => {
    alert(`View Receipt: ${receipt.receiptNo}\n\nThis would open a detailed receipt view or print preview.\n\nStudent: ${receipt.studentName}\nAmount: BDT ${receipt.amount.toLocaleString('en-BD', { minimumFractionDigits: 2 })}\nMethod: ${receipt.method}`)
  }

  const collectionsByOfficer: OfficerCollection[] = [
    { officer: 'Mahfuz Rahman (Cash Counter 1)', mode: 'Cash', receipts: 84, amount: 412000, lastReceipt: '11:42 AM' },
    { officer: 'Faria Islam (Online Gateway)', mode: 'Online / SSLCommerz', receipts: 156, amount: 740500, lastReceipt: '11:47 AM' },
    { officer: 'Tanjina Akter (Bank Desk)', mode: 'Bank Deposit Slip', receipts: 72, amount: 300000, lastReceipt: '11:39 AM' }
  ]

  // Generate sample receipts for selected officer
  const getOfficerReceipts = (officer: OfficerCollection): OfficerReceipt[] => {
    const receipts: OfficerReceipt[] = []
    const baseReceiptNo = officer.officer.includes('Mahfuz') ? 1001 : officer.officer.includes('Faria') ? 2001 : 3001
    const studentNames = ['Nusrat Jahan', 'Rakib Hasan', 'Tahmina Akter', 'Ahmed Khan', 'Sadia Rahman', 'Fatima Khatun', 'Mahbub Alam', 'Rifat Hossain', 'Shirin Akhter', 'Nasrin Begum']
    const programs = ['CSE', 'BBA', 'LLB', 'MBA', 'EEE']

    const count = Math.min(officer.receipts, 15) // Show max 15 for preview
    for (let i = 0; i < count; i++) {
      const hour = 9 + Math.floor(Math.random() * 3)
      const minute = Math.floor(Math.random() * 60)
      const ampm = hour < 12 ? 'AM' : 'PM'
      const displayHour = hour > 12 ? hour - 12 : hour

      receipts.push({
        receiptNo: `MR-2024-${String(baseReceiptNo + i).padStart(5, '0')}`,
        time: `${displayHour}:${String(minute).padStart(2, '0')} ${ampm}`,
        studentId: `2021-${Math.floor(Math.random() * 3) + 1}-${programs[i % programs.length].toLowerCase().substring(0, 2)}-${String(Math.floor(Math.random() * 100)).padStart(3, '0')}`,
        studentName: studentNames[i % studentNames.length],
        amount: Math.floor(Math.random() * 50000) + 20000,
        method: officer.mode
      })
    }

    return receipts.sort((a, b) => b.time.localeCompare(a.time))
  }

  const handleViewDetails = (officer: OfficerCollection) => {
    setSelectedOfficer(officer)
    setViewDetailsOpen(true)
  }

  const duesAging = [
    { range: '0–30 days', amount: 6100000, color: 'bg-green-500' },
    { range: '31–60 days', amount: 4200000, color: 'bg-amber-500' },
    { range: '61–90 days', amount: 1300000, color: 'bg-orange-500' },
    { range: '>90 days', amount: 7300000, color: 'bg-red-500', critical: true }
  ]

  const programDues = [
    { program: 'CSE', overdueAmount: 2150000, students: 19 },
    { program: 'BBA', overdueAmount: 1980000, students: 14 },
    { program: 'LLB', overdueAmount: 1120000, students: 7 },
    { program: 'MBA', overdueAmount: 2050000, students: 9 }
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-deep-plum">Finance Dashboard</h1>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Summary PDF
          </Button>
          <Button className="nu-button-primary">Overdue List</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription className="text-xs">Total Collection Today</CardDescription>
              <DollarSign className="w-4 h-4 text-green-600" />
            </div>
            <CardTitle className="text-2xl">BDT 1,452,500.00</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-gray-600">312 receipts</p>
          </CardContent>
        </Card>

        <Card className="border-red-200">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription className="text-xs">Outstanding Dues (All)</CardDescription>
              <DollarSign className="w-4 h-4 text-red-600" />
            </div>
            <CardTitle className="text-2xl">BDT 18,940,230.00</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge className="bg-red-100 text-red-800">Overdue 7.3M</Badge>
          </CardContent>
        </Card>

        <Card className="border-purple-200">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription className="text-xs">Students on Finance Hold</CardDescription>
              <Lock className="w-4 h-4 text-purple-600" />
            </div>
            <CardTitle className="text-3xl">42</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge className="bg-purple-100 text-purple-800">HOLD</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription className="text-xs">Scholarship / Waiver Impact</CardDescription>
              <Award className="w-4 h-4 text-amber-600" />
            </div>
            <CardTitle className="text-xl">BDT 685,000 waived</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-gray-600">128 students (Fall 2025)</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Collections by Officer</CardTitle>
          <CardDescription>Today's collection summary by officer</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Officer</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Payment Mode</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Receipts Count</th>
                  <th className="text-right p-3 text-sm font-medium text-gray-700">Amount Collected (BDT)</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Last Receipt Time</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {collectionsByOfficer.map((row, idx) => (
                  <tr key={idx} className="border-b hover:bg-gray-50">
                    <td className="p-3 text-sm font-medium">{row.officer}</td>
                    <td className="p-3 text-sm">{row.mode}</td>
                    <td className="p-3 text-sm">{row.receipts}</td>
                    <td className="p-3 text-sm text-right font-semibold">{row.amount.toLocaleString('en-BD', { minimumFractionDigits: 2 })}</td>
                    <td className="p-3 text-sm">{row.lastReceipt}</td>
                    <td className="p-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewDetails(row)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View Details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Dues Aging Buckets</CardTitle>
            <CardDescription>Outstanding dues by aging period</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {duesAging.map((bucket, idx) => (
                <div key={idx}>
                  <div className="flex justify-between text-sm mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{bucket.range}</span>
                      {bucket.critical && <Badge className="bg-red-100 text-red-800">Critical</Badge>}
                    </div>
                    <span className="font-semibold">BDT {(bucket.amount / 1000000).toFixed(1)}M</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className={`${bucket.color} h-3 rounded-full`}
                      style={{ width: `${(bucket.amount / 18900000) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Program-wise &gt;90 Day Dues</CardTitle>
            <CardDescription>Critical overdue amounts by program</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 text-sm font-medium text-gray-700">Program</th>
                    <th className="text-right p-3 text-sm font-medium text-gray-700">&gt;90 Dues (BDT)</th>
                    <th className="text-right p-3 text-sm font-medium text-gray-700">Students</th>
                  </tr>
                </thead>
                <tbody>
                  {programDues.map((row, idx) => (
                    <tr key={idx} className="border-b hover:bg-gray-50">
                      <td className="p-3 text-sm font-medium">{row.program}</td>
                      <td className="p-3 text-sm text-right text-red-600 font-semibold">
                        {row.overdueAmount.toLocaleString('en-BD', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="p-3 text-sm text-right">{row.students}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Officer Collection Details Modal */}
      <Dialog open={viewDetailsOpen} onOpenChange={setViewDetailsOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">
              Collection Details - {selectedOfficer?.officer}
            </DialogTitle>
            <p className="text-sm text-gray-600">
              Payment Mode: {selectedOfficer?.mode} | Total Receipts: {selectedOfficer?.receipts} | Total Amount: BDT {selectedOfficer?.amount.toLocaleString('en-BD', { minimumFractionDigits: 2 })}
            </p>
          </DialogHeader>

          {selectedOfficer && (
            <div className="mt-4">
              <div className="mb-4 p-4 bg-gray-50 rounded-lg grid grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-gray-600">Total Receipts</p>
                  <p className="text-2xl font-bold text-deep-plum">{selectedOfficer.receipts}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Total Collected</p>
                  <p className="text-2xl font-bold text-green-600">
                    BDT {selectedOfficer.amount.toLocaleString('en-BD', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Last Receipt</p>
                  <p className="text-2xl font-bold text-gray-700">{selectedOfficer.lastReceipt}</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr className="border-b">
                      <th className="text-left p-3 text-sm font-medium text-gray-700">Receipt No</th>
                      <th className="text-left p-3 text-sm font-medium text-gray-700">Time</th>
                      <th className="text-left p-3 text-sm font-medium text-gray-700">Student ID</th>
                      <th className="text-left p-3 text-sm font-medium text-gray-700">Student Name</th>
                      <th className="text-right p-3 text-sm font-medium text-gray-700">Amount (BDT)</th>
                      <th className="text-left p-3 text-sm font-medium text-gray-700">Method</th>
                      <th className="text-center p-3 text-sm font-medium text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getOfficerReceipts(selectedOfficer).map((receipt, idx) => (
                      <tr key={idx} className="border-b hover:bg-gray-50">
                        <td className="p-3 text-sm font-mono">{receipt.receiptNo}</td>
                        <td className="p-3 text-sm">{receipt.time}</td>
                        <td className="p-3 text-sm font-mono">{receipt.studentId}</td>
                        <td className="p-3 text-sm font-medium">{receipt.studentName}</td>
                        <td className="p-3 text-sm text-right font-semibold text-green-600">
                          {receipt.amount.toLocaleString('en-BD', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="p-3 text-sm">
                          <Badge variant="outline">{receipt.method}</Badge>
                        </td>
                        <td className="p-3 text-center">
                          <Button variant="ghost" size="sm" title="View Receipt" onClick={() => handleViewReceipt(receipt)}>
                            <FileText className="w-4 h-4 text-blue-600" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {selectedOfficer.receipts > 15 && (
                <p className="text-sm text-gray-600 mt-4 text-center">
                  Showing 15 of {selectedOfficer.receipts} receipts. Use Payment Records view for complete list.
                </p>
              )}

              <div className="flex justify-end gap-2 mt-6">
                <Button variant="outline" onClick={() => setViewDetailsOpen(false)}>
                  Close
                </Button>
                <Button className="nu-button-primary">
                  <Download className="w-4 h-4 mr-2" />
                  Export to CSV
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
