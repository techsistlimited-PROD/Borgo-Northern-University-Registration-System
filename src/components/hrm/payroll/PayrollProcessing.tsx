import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { Eye, CheckCircle, FileDown, FileText } from 'lucide-react'
import { PAYROLL_RECORDS, SALARY_TEMPLATES, type PayrollRecord } from '@/lib/payrollPerformanceStatic'
import { DEMO_MODE, showDemoToast } from '@/config/demo'

export default function PayrollProcessing() {
  const [records, setRecords] = useState<PayrollRecord[]>(PAYROLL_RECORDS)
  const [selectedMonth, setSelectedMonth] = useState('December')
  const [selectedYear, setSelectedYear] = useState('2024')
  const [selectedDept, setSelectedDept] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')

  const handleExportCSV = () => {
    if (DEMO_MODE) {
      alert(showDemoToast('Export payroll data as CSV'))
      return
    }

    const csvHeaders = ['Emp ID', 'Name', 'Department', 'Basic', 'Allowances', 'Deductions', 'Net Salary', 'Status']
    const csvRows = filteredRecords.map(rec => [
      rec.empId,
      rec.empName,
      rec.dept,
      rec.basic,
      rec.allowances,
      rec.deductions,
      rec.netSalary,
      rec.status
    ])

    const csvContent = [
      csvHeaders.join(','),
      ...csvRows.map(row => row.join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `payroll-${selectedMonth}-${selectedYear}.csv`
    link.click()
  }

  const handleBankStatement = () => {
    if (DEMO_MODE) {
      alert(showDemoToast('Generate bank statement'))
      return
    }

    alert('Generating bank statement...')
  }
  const [viewRecord, setViewRecord] = useState<PayrollRecord | null>(null)

  const filteredRecords = records.filter(r => {
    if (r.month !== selectedMonth || r.year !== Number(selectedYear)) return false
    if (selectedDept !== 'all' && r.dept !== selectedDept) return false
    if (selectedStatus !== 'all' && r.status !== selectedStatus) return false
    return true
  })

  const pendingCount = filteredRecords.filter(r => r.status === 'Pending').length
  const processedCount = filteredRecords.filter(r => r.status === 'Processed').length
  const paidCount = filteredRecords.filter(r => r.status === 'Paid').length
  const totalEmployees = filteredRecords.length

  const handleProcess = (id: string) => {
    setRecords(records.map(r =>
      r.id === id ? { ...r, status: 'Processed' as const } : r
    ))
  }

  const handleMarkPaid = (id: string) => {
    setRecords(records.map(r =>
      r.id === id ? { ...r, status: 'Paid' as const } : r
    ))
  }

  const getStatusBadge = (status: PayrollRecord['status']) => {
    const variants = {
      Pending: 'bg-yellow-100 text-yellow-800',
      Processed: 'bg-blue-100 text-blue-800',
      Paid: 'bg-green-100 text-green-800'
    }
    return variants[status]
  }

  const getTemplate = (grade: string) => SALARY_TEMPLATES.find(t => t.grade === grade)

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Payroll Processing</h2>
          <p className="text-gray-600">Process monthly salary and manage payments</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2" onClick={handleExportCSV}>
            <FileText className="w-4 h-4" />
            Export CSV
          </Button>
          <Button variant="outline" className="flex items-center gap-2" onClick={handleBankStatement}>
            <FileDown className="w-4 h-4" />
            Bank Statement
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-white/90">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{pendingCount}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-white/90">Processed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{processedCount}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-white/90">Paid</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{paidCount}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-white/90">Total Employees</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalEmployees}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Month</label>
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="October">October</SelectItem>
                  <SelectItem value="November">November</SelectItem>
                  <SelectItem value="December">December</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Year</label>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2023">2023</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Department</label>
              <Select value={selectedDept} onValueChange={setSelectedDept}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  <SelectItem value="CSE">CSE</SelectItem>
                  <SelectItem value="BBA">BBA</SelectItem>
                  <SelectItem value="HR">HR</SelectItem>
                  <SelectItem value="Accounts">Accounts</SelectItem>
                  <SelectItem value="IT">IT</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Status</label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Processed">Processed</SelectItem>
                  <SelectItem value="Paid">Paid</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payroll Records ({filteredRecords.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Emp ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dept</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Designation</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Gross</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Deductions</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Net Pay</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredRecords.map((record) => {
                  const totalDeductions = record.pf + record.tax + record.loanDeduction
                  return (
                    <tr key={record.id}>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{record.empId}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{record.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{record.dept}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{record.designation}</td>
                      <td className="px-4 py-3 text-sm font-semibold text-gray-900">৳{record.gross.toLocaleString()}</td>
                      <td className="px-4 py-3 text-sm text-red-600">৳{totalDeductions.toLocaleString()}</td>
                      <td className="px-4 py-3 text-sm font-bold text-green-600">৳{record.netPay.toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <Badge className={getStatusBadge(record.status)}>{record.status}</Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" onClick={() => setViewRecord(record)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                          {record.status === 'Pending' && (
                            <Button variant="ghost" size="sm" onClick={() => handleProcess(record.id)}>
                              <CheckCircle className="w-4 h-4 text-blue-600" />
                            </Button>
                          )}
                          {record.status === 'Processed' && (
                            <Button variant="ghost" size="sm" onClick={() => handleMarkPaid(record.id)}>
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Sheet open={!!viewRecord} onOpenChange={() => setViewRecord(null)}>
        <SheetContent className="w-[600px] sm:max-w-[600px]">
          <SheetHeader>
            <SheetTitle>Salary Breakdown</SheetTitle>
          </SheetHeader>
          {viewRecord && (
            <div className="mt-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Employee ID</label>
                  <p className="text-sm font-semibold">{viewRecord.empId}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Name</label>
                  <p className="text-sm font-semibold">{viewRecord.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Department</label>
                  <p className="text-sm">{viewRecord.dept}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Designation</label>
                  <p className="text-sm">{viewRecord.designation}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Month / Year</label>
                  <p className="text-sm">{viewRecord.month} {viewRecord.year}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Payment Mode</label>
                  <p className="text-sm">{viewRecord.paymentMode}</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">Earnings</h3>
                {(() => {
                  const template = getTemplate(viewRecord.grade)
                  if (!template) return null
                  return (
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Basic Salary</span>
                        <span className="text-sm font-medium">৳{template.basic.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">House Rent</span>
                        <span className="text-sm font-medium">৳{template.houseRent.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Medical Allowance</span>
                        <span className="text-sm font-medium">৳{template.medical.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Transport Allowance</span>
                        <span className="text-sm font-medium">৳{template.transport.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Other Allowance</span>
                        <span className="text-sm font-medium">৳{template.other.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between font-semibold pt-2 border-t">
                        <span>Gross Salary</span>
                        <span>৳{viewRecord.gross.toLocaleString()}</span>
                      </div>
                    </div>
                  )
                })()}
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">Deductions</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Provident Fund (10%)</span>
                    <span className="text-sm font-medium text-red-600">-৳{viewRecord.pf.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Income Tax</span>
                    <span className="text-sm font-medium text-red-600">-৳{viewRecord.tax.toLocaleString()}</span>
                  </div>
                  {viewRecord.loanDeduction > 0 && (
                    <div className="flex justify-between">
                      <span className="text-sm">Loan Deduction</span>
                      <span className="text-sm font-medium text-red-600">-৳{viewRecord.loanDeduction.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-semibold pt-2 border-t">
                    <span>Total Deductions</span>
                    <span className="text-red-600">-৳{(viewRecord.pf + viewRecord.tax + viewRecord.loanDeduction).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold">Net Pay</span>
                  <span className="text-2xl font-bold text-green-600">৳{viewRecord.netPay.toLocaleString()}</span>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex gap-2">
                  {viewRecord.status === 'Pending' && (
                    <Button className="flex-1" onClick={() => {handleProcess(viewRecord.id); setViewRecord(null)}}>
                      Process Payroll
                    </Button>
                  )}
                  {viewRecord.status === 'Processed' && (
                    <Button className="flex-1 bg-green-600 hover:bg-green-700" onClick={() => {handleMarkPaid(viewRecord.id); setViewRecord(null)}}>
                      Mark as Paid
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
