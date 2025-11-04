import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Users, UserCheck, UserX, Calendar, FileDown, FileText } from 'lucide-react'
import { HRM_ATTENDANCE, HRM_EMPLOYEES } from '@/lib/hrmStatic'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const COLORS = ['#22c55e', '#f59e0b', '#ef4444', '#3b82f6']

export default function AttendanceDashboard() {
  const [selectedDept, setSelectedDept] = useState('all')
  const [selectedShift, setSelectedShift] = useState('all')
  const [selectedDate, setSelectedDate] = useState('2025-01-12')

  const today = HRM_ATTENDANCE.filter(a => a.date === selectedDate)
  const filteredToday = today.filter(a => 
    (selectedDept === 'all' || a.dept === selectedDept) &&
    (selectedShift === 'all' || a.shift === selectedShift)
  )

  const totalStaff = HRM_EMPLOYEES.filter(e => e.status === 'Active').length
  const presentToday = filteredToday.filter(a => a.status === 'Present' || a.status === 'Late').length
  const absentToday = filteredToday.filter(a => a.status === 'Absent').length
  const onLeaveToday = filteredToday.filter(a => a.status === 'On Leave').length

  const statusData = [
    { name: 'Present', value: filteredToday.filter(a => a.status === 'Present').length },
    { name: 'Late', value: filteredToday.filter(a => a.status === 'Late').length },
    { name: 'Absent', value: filteredToday.filter(a => a.status === 'Absent').length },
    { name: 'On Leave', value: filteredToday.filter(a => a.status === 'On Leave').length }
  ]

  const deptData = ['CSE', 'BBA', 'HR', 'Accounts', 'IT'].map(dept => ({
    name: dept,
    late: today.filter(a => a.dept === dept && a.status === 'Late').length,
    onTime: today.filter(a => a.dept === dept && a.status === 'Present').length
  }))

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Attendance Dashboard</h2>
          <p className="text-gray-600">Real-time attendance overview and analytics</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <FileDown className="w-4 h-4" />
            Export PDF
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Export CSV
          </Button>
        </div>
      </div>

      <div className="flex gap-4">
        <Select value={selectedDept} onValueChange={setSelectedDept}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select Department" />
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

        <Select value={selectedShift} onValueChange={setSelectedShift}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select Shift" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Shifts</SelectItem>
            <SelectItem value="R1">Regular Day</SelectItem>
            <SelectItem value="R2">Night Shift</SelectItem>
            <SelectItem value="F1">Flex Morning</SelectItem>
          </SelectContent>
        </Select>

        <Input 
          type="date" 
          value={selectedDate} 
          onChange={(e) => setSelectedDate(e.target.value)}
          className="w-48"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-white/90">Total Staff</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">{totalStaff}</div>
              <Users className="w-8 h-8 text-white/80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-white/90">Present Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">{presentToday}</div>
              <UserCheck className="w-8 h-8 text-white/80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-white/90">Absent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">{absentToday}</div>
              <UserX className="w-8 h-8 text-white/80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-white/90">On Leave</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">{onLeaveToday}</div>
              <Calendar className="w-8 h-8 text-white/80" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Department-wise Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Late vs On Time by Department</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={deptData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="onTime" fill="#22c55e" name="On Time" />
                <Bar dataKey="late" fill="#f59e0b" name="Late" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Today's Attendance (Top 10)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">In Time</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Out Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredToday.slice(0, 10).map((record) => (
                  <tr key={record.id}>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{record.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{record.dept}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        record.status === 'Present' ? 'bg-green-100 text-green-800' :
                        record.status === 'Late' ? 'bg-yellow-100 text-yellow-800' :
                        record.status === 'Absent' ? 'bg-red-100 text-red-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {record.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{record.inTime}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{record.outTime}</td>
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
