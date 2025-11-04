import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { FileDown, Search, CheckSquare, Calendar as CalendarIcon } from 'lucide-react'
import { HRM_ATTENDANCE, type AttendanceRecord } from '@/lib/hrmStatic'

export default function DailyAttendance() {
  const [selectedDate, setSelectedDate] = useState('2025-01-12')
  const [selectedDept, setSelectedDept] = useState('all')
  const [selectedShift, setSelectedShift] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  const filteredRecords = HRM_ATTENDANCE.filter(record => {
    if (record.date !== selectedDate) return false
    if (selectedDept !== 'all' && record.dept !== selectedDept) return false
    if (selectedShift !== 'all' && record.shift !== selectedShift) return false
    if (selectedStatus !== 'all' && record.status !== selectedStatus) return false
    if (searchTerm && !record.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !record.empId.toLowerCase().includes(searchTerm.toLowerCase())) return false
    return true
  })

  const getRowClass = (status: AttendanceRecord['status']) => {
    switch (status) {
      case 'Late': return 'bg-yellow-50'
      case 'Absent': return 'bg-red-50'
      case 'On Leave': return 'bg-blue-50'
      default: return ''
    }
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Daily Attendance</h2>
          <p className="text-gray-600">View and manage daily attendance records</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <CheckSquare className="w-4 h-4" />
            Mark All Present
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4" />
            Mark Holiday
          </Button>
          <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
            <FileDown className="w-4 h-4" />
            Download Report
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Date</label>
              <Input 
                type="date" 
                value={selectedDate} 
                onChange={(e) => setSelectedDate(e.target.value)}
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
              <label className="text-sm font-medium mb-1 block">Shift</label>
              <Select value={selectedShift} onValueChange={setSelectedShift}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Shifts</SelectItem>
                  <SelectItem value="R1">Regular Day</SelectItem>
                  <SelectItem value="R2">Night Shift</SelectItem>
                  <SelectItem value="F1">Flex Morning</SelectItem>
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
                  <SelectItem value="Present">Present</SelectItem>
                  <SelectItem value="Late">Late</SelectItem>
                  <SelectItem value="Absent">Absent</SelectItem>
                  <SelectItem value="On Leave">On Leave</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input 
                  placeholder="Name or ID" 
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Attendance Records ({filteredRecords.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Emp ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dept</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Shift</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">In Time</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Out Time</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hours</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Late (min)</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredRecords.map((record) => (
                  <tr key={record.id} className={getRowClass(record.status)}>
                    <td className="px-4 py-3 text-sm text-gray-600">{record.empId}</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{record.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{record.dept}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{record.shift}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{record.inTime}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{record.outTime}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{record.hours}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {record.late > 0 ? (
                        <span className="text-yellow-600 font-semibold">{record.late}</span>
                      ) : (
                        '-'
                      )}
                    </td>
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
                    <td className="px-4 py-3 text-sm text-gray-600">{record.remarks || '-'}</td>
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
