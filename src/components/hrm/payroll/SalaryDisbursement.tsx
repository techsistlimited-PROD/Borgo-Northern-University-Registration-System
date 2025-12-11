import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { FileDown } from 'lucide-react'
import { PAYROLL_RECORDS } from '@/lib/payrollPerformanceStatic'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const COLORS = ['#3b82f6', '#22c55e']

export default function SalaryDisbursement() {
  const [selectedMonth, setSelectedMonth] = useState('October')
  const [selectedYear, setSelectedYear] = useState('2024')
  const [selectedDept, setSelectedDept] = useState('all')
  const [selectedMode, setSelectedMode] = useState('all')

  const paidRecords = PAYROLL_RECORDS.filter(r => r.status === 'Paid' || r.status === 'Processed')
  
  const filteredRecords = paidRecords.filter(r => {
    if (r.month !== selectedMonth || r.year !== Number(selectedYear)) return false
    if (selectedDept !== 'all' && r.dept !== selectedDept) return false
    if (selectedMode !== 'all' && r.paymentMode !== selectedMode) return false
    return true
  })

  const bankCount = filteredRecords.filter(r => r.paymentMode === 'Bank').length
  const cashCount = filteredRecords.filter(r => r.paymentMode === 'Cash').length

  const chartData = [
    { name: 'Bank', value: bankCount },
    { name: 'Cash', value: cashCount }
  ]

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Salary Disbursement</h2>
          <p className="text-gray-600">Track salary payments and disbursement status</p>
        </div>
        <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
          <FileDown className="w-4 h-4" />
          Download Bank Statement
        </Button>
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
              <label className="text-sm font-medium mb-1 block">Payment Mode</label>
              <Select value={selectedMode} onValueChange={setSelectedMode}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Modes</SelectItem>
                  <SelectItem value="Bank">Bank Transfer</SelectItem>
                  <SelectItem value="Cash">Cash</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payment Mode Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Disbursement Records ({filteredRecords.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Emp ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bank Account</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mode</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Net Pay</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredRecords.map((record) => (
                  <tr key={record.id}>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{record.empId}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{record.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {record.paymentMode === 'Bank' ? record.bankAcc : 'N/A'}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={record.paymentMode === 'Bank' ? 'default' : 'secondary'}>
                        {record.paymentMode}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-sm font-bold text-green-600">৳{record.netPay.toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {new Date(2024, 11, 5).toLocaleDateString('en-GB')}
                    </td>
                    <td className="px-4 py-3">
                      <Badge className="bg-green-100 text-green-800">Paid</Badge>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">Completed</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
