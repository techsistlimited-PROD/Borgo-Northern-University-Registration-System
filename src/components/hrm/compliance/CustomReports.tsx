import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { FileDown, FileText } from 'lucide-react'
import { HRM_EMPLOYEES } from '@/lib/hrmStatic'
import { PAYROLL_RECORDS } from '@/lib/payrollPerformanceStatic'

export default function CustomReports() {
  const [reportType, setReportType] = useState('active-staff')

  const activeStaff = HRM_EMPLOYEES.filter(e => e.status === 'Active').map(e => ({
    id: e.id,
    name: e.name,
    dept: e.department,
    designation: e.designation,
    email: e.email,
    joiningDate: e.joiningDate
  }))

  const inactiveStaff = HRM_EMPLOYEES.filter(e => e.status !== 'Active').map(e => ({
    id: e.id,
    name: e.name,
    dept: e.department,
    designation: e.designation,
    status: e.status,
    email: e.email
  }))

  const salaryReport = PAYROLL_RECORDS.filter(r => r.month === 'December' && r.year === 2024).map(r => ({
    id: r.empId,
    name: r.name,
    dept: r.dept,
    designation: r.designation,
    gross: `৳${r.gross.toLocaleString()}`,
    deductions: `৳${(r.pf + r.tax + r.loanDeduction).toLocaleString()}`,
    net: `৳${r.netPay.toLocaleString()}`
  }))

  const leaveSummary = HRM_EMPLOYEES.filter(e => e.status === 'Active').slice(0, 8).map((e, idx) => ({
    id: e.id,
    name: e.name,
    dept: e.department,
    totalLeave: 20,
    taken: [5, 8, 3, 12, 6, 4, 10, 7][idx],
    pending: [2, 1, 0, 0, 1, 2, 0, 1][idx],
    balance: 20 - [5, 8, 3, 12, 6, 4, 10, 7][idx] - [2, 1, 0, 0, 1, 2, 0, 1][idx]
  }))

  const recruitment = [
    { position: 'Associate Professor - CSE', applicants: 45, shortlisted: 12, interviewed: 5, offered: 2, status: 'In Progress' },
    { position: 'Lecturer - BBA', applicants: 67, shortlisted: 18, interviewed: 8, offered: 3, status: 'In Progress' },
    { position: 'Assistant Professor - EEE', applicants: 32, shortlisted: 10, interviewed: 4, offered: 1, status: 'Completed' },
    { position: 'Lab Instructor - CSE', applicants: 28, shortlisted: 8, interviewed: 3, offered: 2, status: 'Offer Stage' },
    { position: 'Senior Officer - HR', applicants: 55, shortlisted: 15, interviewed: 6, offered: 1, status: 'Completed' }
  ]

  const training = [
    { program: 'Digital Teaching Methods', department: 'CSE', participants: 8, completed: 8, avgRating: 4.5, date: '2024-11-15' },
    { program: 'Research Methodology', department: 'BBA', participants: 6, completed: 5, avgRating: 4.2, date: '2024-11-20' },
    { program: 'HR Management Systems', department: 'HR', participants: 4, completed: 4, avgRating: 4.8, date: '2024-12-01' },
    { program: 'Academic Administration', department: 'All', participants: 12, completed: 11, avgRating: 4.3, date: '2024-12-10' },
    { program: 'Student Counseling', department: 'All', participants: 10, completed: 9, avgRating: 4.6, date: '2024-12-15' }
  ]

  const reportData: Record<string, any[]> = {
    'active-staff': activeStaff,
    'inactive-staff': inactiveStaff,
    'salary-report': salaryReport,
    'leave-summary': leaveSummary,
    'recruitment': recruitment,
    'training': training
  }

  const currentData = reportData[reportType] || []

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold text-gray-800">Custom Reports</h2>

      <Card>
        <CardHeader>
          <CardTitle>Report Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Report Type</label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active-staff">Active Staff</SelectItem>
                  <SelectItem value="inactive-staff">Inactive Staff</SelectItem>
                  <SelectItem value="salary-report">Salary Report</SelectItem>
                  <SelectItem value="leave-summary">Leave Summary</SelectItem>
                  <SelectItem value="recruitment">Recruitment Pipeline</SelectItem>
                  <SelectItem value="training">Training Participation</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Department</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  <SelectItem value="CSE">CSE</SelectItem>
                  <SelectItem value="BBA">BBA</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">From Date</label>
              <Input type="date" />
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">To Date</label>
              <Input type="date" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Report Results ({currentData.length})</CardTitle>
            <div className="flex gap-2">
              <Button className="flex items-center gap-2" variant="outline">
                <FileText className="w-4 h-4" />
                Export CSV
              </Button>
              <Button className="flex items-center gap-2">
                <FileDown className="w-4 h-4" />
                Export PDF
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                {Object.keys(currentData[0] || {}).map(key => (
                  <th key={key} className="px-3 py-2 text-left capitalize">{key}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">
              {currentData.map((row, idx) => (
                <tr key={idx}>
                  {Object.values(row).map((val: any, i) => (
                    <td key={i} className="px-3 py-2">{val}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
