import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { FileDown, Eye } from 'lucide-react'
import { HRM_ATTENDANCE, HRM_EMPLOYEES } from '@/lib/hrmStatic'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export default function MonthlyReports() {
  const [selectedMonth, setSelectedMonth] = useState('2025-01')
  const [selectedDept, setSelectedDept] = useState('all')
  const [selectedEmployee, setSelectedEmployee] = useState('all')
  const [viewDetailsEmp, setViewDetailsEmp] = useState<string | null>(null)

  const activeEmployees = HRM_EMPLOYEES.filter(e => e.status === 'Active')
  const monthRecords = HRM_ATTENDANCE.filter(a => a.date.startsWith(selectedMonth))

  const weeklyData = [
    { week: 'Week 1', attendance: 92 },
    { week: 'Week 2', attendance: 88 },
    { week: 'Week 3', attendance: 90 },
    { week: 'Week 4', attendance: 85 }
  ]

  const employeeSummary = activeEmployees.map(emp => {
    const empRecords = monthRecords.filter(r => r.empId === emp.id)
    const totalDays = empRecords.length
    const present = empRecords.filter(r => r.status === 'Present').length
    const absent = empRecords.filter(r => r.status === 'Absent').length
    const leave = empRecords.filter(r => r.status === 'On Leave').length
    const late = empRecords.filter(r => r.status === 'Late').length
    const otHours = empRecords.reduce((sum, r) => sum + (r.hours > 8 ? r.hours - 8 : 0), 0)
    const attendancePercent = totalDays > 0 ? Math.round(((present + late) / totalDays) * 100) : 0

    return {
      empId: emp.id,
      name: emp.name,
      dept: emp.department,
      totalDays,
      present,
      absent,
      leave,
      late,
      otHours: otHours.toFixed(1),
      attendancePercent
    }
  })

  const filteredSummary = employeeSummary.filter(s => {
    if (selectedDept !== 'all' && s.dept !== selectedDept) return false
    if (selectedEmployee !== 'all' && s.empId !== selectedEmployee) return false
    return true
  })

  const handleViewDetails = (empId: string) => {
    setViewDetailsEmp(empId)
  }

  const empDetails = viewDetailsEmp ? monthRecords.filter(r => r.empId === viewDetailsEmp) : []

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Monthly Reports</h2>
          <p className="text-gray-600">Comprehensive monthly attendance analytics</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <FileDown className="w-4 h-4" />
            Export PDF
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <FileDown className="w-4 h-4" />
            Export Excel
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <FileDown className="w-4 h-4" />
            Export CSV
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Month & Year</label>
              <Input 
                type="month" 
                value={selectedMonth} 
                onChange={(e) => setSelectedMonth(e.target.value)}
              />
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
              <label className="text-sm font-medium mb-1 block">Employee</label>
              <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Employees</SelectItem>
                  {activeEmployees.map(emp => (
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
          <CardTitle>Attendance Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="attendance" stroke="#3b82f6" strokeWidth={2} name="Attendance %" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Employee Summary ({filteredSummary.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Days</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Present</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Absent</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Leave</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Late</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">OT Hours</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Attendance %</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredSummary.map((summary) => (
                  <tr key={summary.empId}>
                    <td className="px-4 py-3">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{summary.name}</div>
                        <div className="text-xs text-gray-500">{summary.dept}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{summary.totalDays}</td>
                    <td className="px-4 py-3 text-sm text-green-600 font-semibold">{summary.present}</td>
                    <td className="px-4 py-3 text-sm text-red-600 font-semibold">{summary.absent}</td>
                    <td className="px-4 py-3 text-sm text-blue-600">{summary.leave}</td>
                    <td className="px-4 py-3 text-sm text-yellow-600">{summary.late}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{summary.otHours}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              summary.attendancePercent >= 90 ? 'bg-green-500' :
                              summary.attendancePercent >= 75 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${summary.attendancePercent}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{summary.attendancePercent}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleViewDetails(summary.empId)}
                        className="flex items-center gap-1"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!viewDetailsEmp} onOpenChange={() => setViewDetailsEmp(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Daily Attendance Details</DialogTitle>
          </DialogHeader>
          <div className="mt-4 max-h-96 overflow-y-auto">
            <table className="w-full">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Date</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">In Time</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Out Time</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Hours</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Status</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Late (min)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {empDetails.map((record) => (
                  <tr key={record.id}>
                    <td className="px-4 py-2 text-sm">{record.date}</td>
                    <td className="px-4 py-2 text-sm">{record.inTime}</td>
                    <td className="px-4 py-2 text-sm">{record.outTime}</td>
                    <td className="px-4 py-2 text-sm">{record.hours}</td>
                    <td className="px-4 py-2">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        record.status === 'Present' ? 'bg-green-100 text-green-800' :
                        record.status === 'Late' ? 'bg-yellow-100 text-yellow-800' :
                        record.status === 'Absent' ? 'bg-red-100 text-red-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {record.status}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-sm">{record.late || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function Input({ type, value, onChange }: { type: string; value: string; onChange: (e: any) => void }) {
  return <input type={type} value={value} onChange={onChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
}
