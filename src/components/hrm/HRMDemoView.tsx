import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Users,
  UserCheck,
  Calendar,
  DollarSign,
  AlertCircle,
  TrendingUp,
  FileText,
  Eye,
  Plus,
  Search,
  CheckCircle,
  Clock
} from 'lucide-react'
import { hrmDataService } from '@/components/hrm/services/hrmDataService'
import { HRMDataServiceHelper } from '@/components/hrm/utils/hrmDataServiceHelper'
import { HrmEiEmp, HrmAttendance, HrmLeaveApplication, HrmPayslip } from '@/lib/oracleSchema'
import { DEMO_MODE, showDemoToast } from '@/config/demo'

interface DashboardStats {
  totalEmployees: number
  activeEmployees: number
  onLeave: number
  presentToday: number
  pendingLeaveApprovals: number
  totalPayslips: number
  departmentCount: number
  avgSalary: number
}

interface DemoTab {
  id: string
  label: string
  icon: React.ReactNode
}

export default function HRMDemoView() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [employees, setEmployees] = useState<HrmEiEmp[]>([])
  const [attendance, setAttendance] = useState<HrmAttendance[]>([])
  const [leaves, setLeaves] = useState<HrmLeaveApplication[]>([])
  const [payslips, setPayslips] = useState<HrmPayslip[]>([])
  const [stats, setStats] = useState<DashboardStats>({
    totalEmployees: 0,
    activeEmployees: 0,
    onLeave: 0,
    presentToday: 0,
    pendingLeaveApprovals: 0,
    totalPayslips: 0,
    departmentCount: 0,
    avgSalary: 0
  })
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterDepartment, setFilterDepartment] = useState('All')
  const [selectedEmployee, setSelectedEmployee] = useState<HrmEiEmp | null>(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [selectedLeave, setSelectedLeave] = useState<HrmLeaveApplication | null>(null)
  const [leaveDialogOpen, setLeaveDialogOpen] = useState(false)

  useEffect(() => {
    loadDemoData()
  }, [])

  const loadDemoData = async () => {
    setLoading(true)
    try {
      const [empData, attData, leaveData, payslipData] = await Promise.all([
        HRMDataServiceHelper.getEmployeesWithFallback(),
        HRMDataServiceHelper.getAttendanceWithFallback(),
        HRMDataServiceHelper.getLeaveApplicationsWithFallback(),
        HRMDataServiceHelper.getPayslipsWithFallback()
      ])

      const typedEmployees = empData as unknown as HrmEiEmp[]
      const typedAttendance = attData as unknown as HrmAttendance[]
      const typedLeaves = leaveData as unknown as HrmLeaveApplication[]
      const typedPayslips = payslipData as unknown as HrmPayslip[]

      setEmployees(typedEmployees)
      setAttendance(typedAttendance)
      setLeaves(typedLeaves)
      setPayslips(typedPayslips)

      calculateStats(typedEmployees, typedAttendance, typedLeaves, typedPayslips)
    } catch (error) {
      console.error('Error loading HRM demo data:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (
    empData: HrmEiEmp[],
    attData: HrmAttendance[],
    leaveData: HrmLeaveApplication[],
    payslipData: HrmPayslip[]
  ) => {
    const activeEmps = empData.filter(e => e.status === 'Active')
    const onLeaveEmps = leaveData.filter(l => l.status === 'Approved')
    const todayAttendance = attData.filter(a => {
      const attDate = new Date(a.attendanceDate)
      const today = new Date()
      return attDate.toDateString() === today.toDateString()
    })
    const pendingLeaves = leaveData.filter(l => l.status === 'Pending')
    const departments = new Set(empData.map(e => e.departmentId))
    const totalSalary = empData.reduce((sum, e) => sum + (e.ctc || 0), 0)
    const avgSalary = empData.length > 0 ? totalSalary / empData.length : 0

    setStats({
      totalEmployees: empData.length,
      activeEmployees: activeEmps.length,
      onLeave: onLeaveEmps.length,
      presentToday: todayAttendance.length,
      pendingLeaveApprovals: pendingLeaves.length,
      totalPayslips: payslipData.length,
      departmentCount: departments.size,
      avgSalary
    })
  }

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = searchQuery === '' ||
      (emp.empCode?.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (emp.firstName?.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (emp.lastName?.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesDepartment = filterDepartment === 'All' || emp.departmentId === filterDepartment

    return matchesSearch && matchesDepartment
  })

  const handleViewEmployee = (emp: HrmEiEmp) => {
    setSelectedEmployee(emp)
    setViewDialogOpen(true)
  }

  const handleViewLeave = (leave: HrmLeaveApplication) => {
    setSelectedLeave(leave)
    setLeaveDialogOpen(true)
  }

  const demoTabs: DemoTab[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'employees', label: 'Employees', icon: <Users className="w-4 h-4" /> },
    { id: 'attendance', label: 'Attendance', icon: <Calendar className="w-4 h-4" /> },
    { id: 'leaves', label: 'Leave Management', icon: <AlertCircle className="w-4 h-4" /> },
    { id: 'payroll', label: 'Payroll', icon: <DollarSign className="w-4 h-4" /> }
  ]

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="pt-6 h-24 bg-gray-200 rounded" />
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">HRM Portal Demo</h1>
        <p className="text-gray-600 mt-2">Comprehensive demonstration of Human Resource Management Module features</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 lg:w-auto">
          {demoTabs.map(tab => (
            <TabsTrigger key={tab.id} value={tab.id} className="flex items-center gap-2">
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-90">Total Employees</p>
                    <p className="text-4xl font-bold">{stats.totalEmployees}</p>
                  </div>
                  <Users className="w-12 h-12 opacity-80" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-90">Active Employees</p>
                    <p className="text-4xl font-bold">{stats.activeEmployees}</p>
                  </div>
                  <UserCheck className="w-12 h-12 opacity-80" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-90">On Leave Today</p>
                    <p className="text-4xl font-bold">{stats.onLeave}</p>
                  </div>
                  <Calendar className="w-12 h-12 opacity-80" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-90">Present Today</p>
                    <p className="text-4xl font-bold">{stats.presentToday}</p>
                  </div>
                  <CheckCircle className="w-12 h-12 opacity-80" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-90">Pending Leave Approvals</p>
                    <p className="text-4xl font-bold">{stats.pendingLeaveApprovals}</p>
                  </div>
                  <AlertCircle className="w-12 h-12 opacity-80" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-90">Departments</p>
                    <p className="text-4xl font-bold">{stats.departmentCount}</p>
                  </div>
                  <TrendingUp className="w-12 h-12 opacity-80" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-cyan-500 to-cyan-600 text-white">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-90">Total Payslips</p>
                    <p className="text-4xl font-bold">{stats.totalPayslips}</p>
                  </div>
                  <FileText className="w-12 h-12 opacity-80" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-pink-500 to-pink-600 text-white">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-90">Avg Salary</p>
                    <p className="text-2xl font-bold">{formatCurrency(stats.avgSalary)}</p>
                  </div>
                  <DollarSign className="w-12 h-12 opacity-80" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Employees</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {employees.slice(0, 5).map(emp => (
                    <div key={emp.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{emp.firstName} {emp.lastName}</p>
                        <p className="text-sm text-gray-600">{emp.empCode}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">{emp.designation}</p>
                        <p className={`text-xs font-semibold ${
                          emp.status === 'Active' ? 'text-green-600' : 'text-gray-600'
                        }`}>
                          {emp.status}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pending Leave Requests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {leaves.filter(l => l.status === 'Pending').slice(0, 5).map(leave => (
                    <div key={leave.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{leave.empId}</p>
                        <p className="text-sm text-gray-600">{leave.leaveType}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">{leave.fromDate} to {leave.toDate}</p>
                        <p className="text-xs font-semibold text-orange-600">Pending</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="employees" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Employee Management</CardTitle>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Employee
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Search employees..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <select
                    value={filterDepartment}
                    onChange={(e) => setFilterDepartment(e.target.value)}
                    className="px-4 py-2 border rounded-lg"
                  >
                    <option>All</option>
                    {Array.from(new Set(employees.map(e => e.departmentId))).map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b bg-gray-50">
                      <tr>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Employee Code</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Department</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Designation</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredEmployees.slice(0, 10).map(emp => (
                        <tr key={emp.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4 font-medium text-gray-900">{emp.empCode}</td>
                          <td className="py-3 px-4 text-gray-600">{emp.firstName} {emp.lastName}</td>
                          <td className="py-3 px-4 text-gray-600">{emp.departmentId}</td>
                          <td className="py-3 px-4 text-gray-600">{emp.designation}</td>
                          <td className="py-3 px-4">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                              emp.status === 'Active' ? 'bg-green-100 text-green-800' :
                              emp.status === 'Inactive' ? 'bg-gray-100 text-gray-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {emp.status}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewEmployee(emp)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="text-sm text-gray-600">
                  Showing {Math.min(10, filteredEmployees.length)} of {filteredEmployees.length} employees
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attendance" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Attendance Records</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b bg-gray-50">
                    <tr>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Employee Code</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Employee Name</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Check In</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Check Out</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendance.slice(0, 10).map(att => (
                      <tr key={att.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium text-gray-900">{att.empId}</td>
                        <td className="py-3 px-4 text-gray-600">{att.empId}</td>
                        <td className="py-3 px-4 text-gray-600">{att.attendanceDate}</td>
                        <td className="py-3 px-4 text-gray-600">{att.checkIn || '-'}</td>
                        <td className="py-3 px-4 text-gray-600">{att.checkOut || '-'}</td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                            att.status === 'Present' ? 'bg-green-100 text-green-800' :
                            att.status === 'Absent' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {att.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leaves" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Leave Management</CardTitle>
                <Button className="bg-green-600 hover:bg-green-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Apply Leave
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b bg-gray-50">
                      <tr>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Employee ID</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Leave Type</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">From Date</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">To Date</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Days</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leaves.slice(0, 10).map(leave => (
                        <tr key={leave.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4 font-medium text-gray-900">{leave.empId}</td>
                          <td className="py-3 px-4 text-gray-600">{leave.leaveType}</td>
                          <td className="py-3 px-4 text-gray-600">{leave.fromDate}</td>
                          <td className="py-3 px-4 text-gray-600">{leave.toDate}</td>
                          <td className="py-3 px-4 text-gray-600">{leave.noOfDays}</td>
                          <td className="py-3 px-4">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                              leave.status === 'Approved' ? 'bg-green-100 text-green-800' :
                              leave.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {leave.status}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewLeave(leave)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payroll" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Payslips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b bg-gray-50">
                    <tr>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Payslip No</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Employee ID</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Month/Year</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Gross Salary</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Deductions</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Net Salary</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payslips.slice(0, 10).map(payslip => (
                      <tr key={payslip.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium text-gray-900">{payslip.payslipNo}</td>
                        <td className="py-3 px-4 text-gray-600">{payslip.empId}</td>
                        <td className="py-3 px-4 text-gray-600">{payslip.monthYear}</td>
                        <td className="py-3 px-4 font-semibold text-blue-600">{formatCurrency(payslip.grossSalary || 0)}</td>
                        <td className="py-3 px-4 font-semibold text-red-600">{formatCurrency(payslip.deductions || 0)}</td>
                        <td className="py-3 px-4 font-semibold text-green-600">{formatCurrency(payslip.netSalary || 0)}</td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                            payslip.status === 'Generated' ? 'bg-green-100 text-green-800' :
                            payslip.status === 'Released' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {payslip.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Employee Details</DialogTitle>
          </DialogHeader>
          {selectedEmployee && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600">Employee Code</label>
                  <p className="font-semibold">{selectedEmployee.empCode}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Full Name</label>
                  <p className="font-semibold">{selectedEmployee.firstName} {selectedEmployee.lastName}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Department</label>
                  <p className="font-semibold">{selectedEmployee.departmentId}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Designation</label>
                  <p className="font-semibold">{selectedEmployee.designation}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Email</label>
                  <p className="font-semibold">{selectedEmployee.email}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">CTC</label>
                  <p className="font-semibold text-blue-600">{formatCurrency(selectedEmployee.ctc || 0)}</p>
                </div>
                <div className="col-span-2">
                  <label className="text-sm text-gray-600">Status</label>
                  <p className={`font-semibold ${selectedEmployee.status === 'Active' ? 'text-green-600' : 'text-gray-600'}`}>
                    {selectedEmployee.status}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={leaveDialogOpen} onOpenChange={setLeaveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Leave Application Details</DialogTitle>
          </DialogHeader>
          {selectedLeave && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600">Employee ID</label>
                  <p className="font-semibold">{selectedLeave.empId}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Leave Type</label>
                  <p className="font-semibold">{selectedLeave.leaveType}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">From Date</label>
                  <p className="font-semibold">{selectedLeave.fromDate}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">To Date</label>
                  <p className="font-semibold">{selectedLeave.toDate}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">No of Days</label>
                  <p className="font-semibold">{selectedLeave.noOfDays}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Status</label>
                  <p className={`font-semibold ${
                    selectedLeave.status === 'Approved' ? 'text-green-600' :
                    selectedLeave.status === 'Pending' ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {selectedLeave.status}
                  </p>
                </div>
                <div className="col-span-2">
                  <label className="text-sm text-gray-600">Reason</label>
                  <p className="font-semibold">{selectedLeave.reason || 'Not specified'}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
