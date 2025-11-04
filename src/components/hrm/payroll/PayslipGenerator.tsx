import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { FileDown } from 'lucide-react'
import { PAYROLL_RECORDS, SALARY_TEMPLATES, type PayrollRecord } from '@/lib/payrollPerformanceStatic'

export default function PayslipGenerator() {
  const [selectedMonth, setSelectedMonth] = useState('December')
  const [selectedYear, setSelectedYear] = useState('2024')
  const [selectedDept, setSelectedDept] = useState('all')
  const [selectedEmployee, setSelectedEmployee] = useState('all')
  const [viewPayslip, setViewPayslip] = useState<PayrollRecord | null>(null)

  const filteredRecords = PAYROLL_RECORDS.filter(r => {
    if (r.month !== selectedMonth || r.year !== Number(selectedYear)) return false
    if (selectedDept !== 'all' && r.dept !== selectedDept) return false
    if (selectedEmployee !== 'all' && r.empId !== selectedEmployee) return false
    return true
  })

  const uniqueEmployees = Array.from(new Set(PAYROLL_RECORDS.map(r => r.empId))).map(id => {
    const record = PAYROLL_RECORDS.find(r => r.empId === id)
    return { id, name: record?.name || '' }
  })

  const getTemplate = (grade: string) => SALARY_TEMPLATES.find(t => t.grade === grade)

  const numberToWords = (num: number): string => {
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine']
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety']
    const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen']

    if (num === 0) return 'Zero'
    if (num < 10) return ones[num]
    if (num >= 10 && num < 20) return teens[num - 10]
    if (num >= 20 && num < 100) return tens[Math.floor(num / 10)] + (num % 10 !== 0 ? ' ' + ones[num % 10] : '')
    if (num >= 100 && num < 1000) return ones[Math.floor(num / 100)] + ' Hundred' + (num % 100 !== 0 ? ' ' + numberToWords(num % 100) : '')
    if (num >= 1000 && num < 100000) return numberToWords(Math.floor(num / 1000)) + ' Thousand' + (num % 1000 !== 0 ? ' ' + numberToWords(num % 1000) : '')
    if (num >= 100000) return numberToWords(Math.floor(num / 100000)) + ' Lakh' + (num % 100000 !== 0 ? ' ' + numberToWords(num % 100000) : '')
    return ''
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Payslip Generator</h2>
          <p className="text-gray-600">Generate and download employee payslips</p>
        </div>
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
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Employee</label>
              <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Employees</SelectItem>
                  {uniqueEmployees.map(emp => (
                    <SelectItem key={emp.id} value={emp.id}>{emp.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payslips ({filteredRecords.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Emp ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Designation</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Month/Year</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Net Pay</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredRecords.map((record) => (
                  <tr key={record.id}>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{record.empId}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{record.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{record.designation}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{record.dept}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{record.month} {record.year}</td>
                    <td className="px-4 py-3 text-sm font-bold text-green-600">৳{record.netPay.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <Button size="sm" onClick={() => setViewPayslip(record)} className="flex items-center gap-2">
                        <FileDown className="w-4 h-4" />
                        Generate
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!viewPayslip} onOpenChange={() => setViewPayslip(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Payslip Preview</DialogTitle>
          </DialogHeader>
          {viewPayslip && (() => {
            const template = getTemplate(viewPayslip.grade)
            if (!template) return null
            return (
              <div className="mt-4 p-8 bg-white border-2 border-gray-300">
                <div className="text-center mb-6">
                  <h1 className="text-2xl font-bold text-blue-600">NORTHERN UNIVERSITY BANGLADESH</h1>
                  <p className="text-sm text-gray-600 mt-1">Salary Slip</p>
                  <p className="text-xs text-gray-500 mt-1">{viewPayslip.month} {viewPayslip.year}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                  <div>
                    <p><strong>Employee ID:</strong> {viewPayslip.empId}</p>
                    <p><strong>Name:</strong> {viewPayslip.name}</p>
                    <p><strong>Designation:</strong> {viewPayslip.designation}</p>
                  </div>
                  <div>
                    <p><strong>Department:</strong> {viewPayslip.dept}</p>
                    <p><strong>Grade:</strong> {viewPayslip.grade}</p>
                    <p><strong>Bank Account:</strong> {viewPayslip.bankAcc}</p>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="font-semibold mb-2 text-sm bg-gray-100 p-2">Earnings</h3>
                  <table className="w-full text-sm">
                    <tbody>
                      <tr className="border-b">
                        <td className="py-1">Basic Salary</td>
                        <td className="py-1 text-right">৳{template.basic.toLocaleString()}</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-1">House Rent</td>
                        <td className="py-1 text-right">৳{template.houseRent.toLocaleString()}</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-1">Medical Allowance</td>
                        <td className="py-1 text-right">৳{template.medical.toLocaleString()}</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-1">Transport Allowance</td>
                        <td className="py-1 text-right">৳{template.transport.toLocaleString()}</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-1">Other Allowance</td>
                        <td className="py-1 text-right">৳{template.other.toLocaleString()}</td>
                      </tr>
                      <tr className="font-semibold border-b-2">
                        <td className="py-1">Gross Salary</td>
                        <td className="py-1 text-right">৳{viewPayslip.gross.toLocaleString()}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="mb-6">
                  <h3 className="font-semibold mb-2 text-sm bg-gray-100 p-2">Deductions</h3>
                  <table className="w-full text-sm">
                    <tbody>
                      <tr className="border-b">
                        <td className="py-1">Provident Fund (10%)</td>
                        <td className="py-1 text-right text-red-600">-৳{viewPayslip.pf.toLocaleString()}</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-1">Income Tax</td>
                        <td className="py-1 text-right text-red-600">-৳{viewPayslip.tax.toLocaleString()}</td>
                      </tr>
                      {viewPayslip.loanDeduction > 0 && (
                        <tr className="border-b">
                          <td className="py-1">Loan Deduction</td>
                          <td className="py-1 text-right text-red-600">-৳{viewPayslip.loanDeduction.toLocaleString()}</td>
                        </tr>
                      )}
                      <tr className="font-semibold border-b-2">
                        <td className="py-1">Total Deductions</td>
                        <td className="py-1 text-right text-red-600">-৳{(viewPayslip.pf + viewPayslip.tax + viewPayslip.loanDeduction).toLocaleString()}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="mb-6 bg-green-50 p-3 border border-green-200">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-lg">Net Pay:</span>
                    <span className="font-bold text-2xl text-green-600">৳{viewPayslip.netPay.toLocaleString()}</span>
                  </div>
                  <p className="text-xs mt-2 text-gray-600">
                    <strong>In Words:</strong> {numberToWords(viewPayslip.netPay)} Taka Only
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t text-xs text-gray-500">
                  <p className="text-center">Authorized by HR Officer - Northern University Bangladesh</p>
                  <p className="text-center mt-1">This is a computer-generated document and does not require a signature</p>
                </div>

                <div className="mt-4 flex justify-center">
                  <Button className="flex items-center gap-2">
                    <FileDown className="w-4 h-4" />
                    Download PDF
                  </Button>
                </div>
              </div>
            )
          })()}
        </DialogContent>
      </Dialog>
    </div>
  )
}
