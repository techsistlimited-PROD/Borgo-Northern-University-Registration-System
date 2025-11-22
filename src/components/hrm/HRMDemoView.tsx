import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
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
  Clock,
  UserPlus,
  GraduationCap,
  Bell,
  FileBarChart,
  Download,
  Settings
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
  vacancies: number
  candidates: number
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
    avgSalary: 0,
    vacancies: 0,
    candidates: 0
  })
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterDepartment, setFilterDepartment] = useState('All')
  const [selectedEmployee, setSelectedEmployee] = useState<HrmEiEmp | null>(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [applyLeaveOpen, setApplyLeaveOpen] = useState(false)
  const [postNoticeOpen, setPostNoticeOpen] = useState(false)
  const [newLeave, setNewLeave] = useState({
    type: 'Casual',
    from: '',
    to: '',
    reason: ''
  })
  const [newNotice, setNewNotice] = useState({
    title: '',
    type: 'HR',
    content: '',
    priority: 'Medium'
  })

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
      avgSalary,
      vacancies: 12,
      candidates: 45
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
          {[...Array(8)].map((_, i) => (
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
        <h1 className="text-3xl font-bold text-gray-900">HRM Portal - Complete Demo</h1>
        <p className="text-gray-600 mt-2">Comprehensive demonstration of all Human Resource Management features</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6 lg:grid-cols-11 lg:w-auto gap-1">
          <TabsTrigger value="dashboard"><TrendingUp className="w-4 h-4 mr-1" />Dashboard</TabsTrigger>
          <TabsTrigger value="employees"><Users className="w-4 h-4 mr-1" />Employees</TabsTrigger>
          <TabsTrigger value="recruitment"><UserPlus className="w-4 h-4 mr-1" />Recruitment</TabsTrigger>
          <TabsTrigger value="attendance"><Calendar className="w-4 h-4 mr-1" />Attendance</TabsTrigger>
          <TabsTrigger value="leaves"><Clock className="w-4 h-4 mr-1" />Leaves</TabsTrigger>
          <TabsTrigger value="payroll"><DollarSign className="w-4 h-4 mr-1" />Payroll</TabsTrigger>
          <TabsTrigger value="performance"><TrendingUp className="w-4 h-4 mr-1" />Performance</TabsTrigger>
          <TabsTrigger value="training"><GraduationCap className="w-4 h-4 mr-1" />Training</TabsTrigger>
          <TabsTrigger value="ess"><Users className="w-4 h-4 mr-1" />ESS</TabsTrigger>
          <TabsTrigger value="notices"><Bell className="w-4 h-4 mr-1" />Notices</TabsTrigger>
          <TabsTrigger value="compliance"><FileBarChart className="w-4 h-4 mr-1" />Compliance</TabsTrigger>
        </TabsList>

        {/* Dashboard Tab */}
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
                    <p className="text-sm opacity-90">Active Staff</p>
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
                    <p className="text-sm opacity-90">On Leave</p>
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
                    <p className="text-sm opacity-90">Pending Approvals</p>
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
                    <p className="text-sm opacity-90">Payslips</p>
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

            <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-90">Open Vacancies</p>
                    <p className="text-4xl font-bold">{stats.vacancies}</p>
                  </div>
                  <UserPlus className="w-12 h-12 opacity-80" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-teal-500 to-teal-600 text-white">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-90">Candidates</p>
                    <p className="text-4xl font-bold">{stats.candidates}</p>
                  </div>
                  <Users className="w-12 h-12 opacity-80" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Joiners</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {employees.slice(0, 5).map(emp => (
                    <div key={emp.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{emp.firstName} {emp.lastName}</p>
                        <p className="text-sm text-gray-600">{emp.empCode} - {emp.designation}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">{emp.departmentId}</p>
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
                        <p className="text-sm text-gray-600">{leave.leaveType} - {leave.noOfDays} days</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">{leave.fromDate}</p>
                        <p className="text-xs font-semibold text-orange-600">Pending</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Employees Tab */}
        <TabsContent value="employees" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Employee Directory</CardTitle>
                <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => alert('Add Employee - Demo Feature: In production, this will open a form to add a new employee to the system')}>
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
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Code</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Department</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Designation</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredEmployees.slice(0, 15).map(emp => (
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
                  Showing {Math.min(15, filteredEmployees.length)} of {filteredEmployees.length} employees
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Recruitment Tab */}
        <TabsContent value="recruitment" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserPlus className="w-5 h-5" />
                  Vacancies
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {['Senior Developer', 'HR Manager', 'Marketing Executive', 'Finance Officer'].map((title, i) => (
                    <div key={i} className="p-3 bg-blue-50 rounded-lg">
                      <p className="font-semibold text-gray-900">{title}</p>
                      <p className="text-sm text-gray-600">Posted: {i + 5} days ago</p>
                      <p className="text-sm text-blue-600 font-medium">{i + 3} applications</p>
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700" onClick={() => alert('Post Vacancy - Demo Feature: In production, this will open a form to create a new job vacancy posting')}>
                  <Plus className="w-4 h-4 mr-2" />
                  Post Vacancy
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Candidates
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {['John Smith', 'Sarah Johnson', 'Mike Brown', 'Emily Davis'].map((name, i) => (
                    <div key={i} className="p-3 bg-green-50 rounded-lg">
                      <p className="font-semibold text-gray-900">{name}</p>
                      <p className="text-sm text-gray-600">Applied for: Senior Developer</p>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Shortlisted</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Interviews
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {['John Smith - Tomorrow 10:00 AM', 'Sarah Johnson - Tomorrow 2:00 PM', 'Mike Brown - Friday 11:00 AM'].map((interview, i) => (
                    <div key={i} className="p-3 bg-purple-50 rounded-lg">
                      <p className="font-semibold text-gray-900 text-sm">{interview.split(' - ')[0]}</p>
                      <p className="text-sm text-gray-600">{interview.split(' - ')[1]}</p>
                      <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">Scheduled</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recruitment Pipeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {[
                  { stage: 'Applications', count: 45, color: 'blue' },
                  { stage: 'Shortlisted', count: 18, color: 'green' },
                  { stage: 'Interviewed', count: 12, color: 'purple' },
                  { stage: 'Offered', count: 5, color: 'orange' },
                  { stage: 'Joined', count: 3, color: 'teal' }
                ].map((item, i) => (
                  <div key={i} className={`p-4 bg-${item.color}-50 rounded-lg text-center`}>
                    <p className="text-sm text-gray-600">{item.stage}</p>
                    <p className={`text-3xl font-bold text-${item.color}-600`}>{item.count}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Attendance Tab */}
        <TabsContent value="attendance" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Attendance Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <Card className="bg-green-50">
                  <CardContent className="pt-6 text-center">
                    <CheckCircle className="w-10 h-10 text-green-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-green-600">{stats.presentToday}</p>
                    <p className="text-sm text-gray-600">Present Today</p>
                  </CardContent>
                </Card>
                <Card className="bg-red-50">
                  <CardContent className="pt-6 text-center">
                    <AlertCircle className="w-10 h-10 text-red-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-red-600">{Math.floor(Math.random() * 10)}</p>
                    <p className="text-sm text-gray-600">Absent</p>
                  </CardContent>
                </Card>
                <Card className="bg-yellow-50">
                  <CardContent className="pt-6 text-center">
                    <Clock className="w-10 h-10 text-yellow-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-yellow-600">{Math.floor(Math.random() * 20)}</p>
                    <p className="text-sm text-gray-600">Late</p>
                  </CardContent>
                </Card>
                <Card className="bg-blue-50">
                  <CardContent className="pt-6 text-center">
                    <Calendar className="w-10 h-10 text-blue-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-blue-600">{stats.onLeave}</p>
                    <p className="text-sm text-gray-600">On Leave</p>
                  </CardContent>
                </Card>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b bg-gray-50">
                    <tr>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Employee</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Check In</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Check Out</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Hours</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendance.slice(0, 15).map(att => (
                      <tr key={att.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium text-gray-900">{att.empId}</td>
                        <td className="py-3 px-4 text-gray-600">{att.attendanceDate}</td>
                        <td className="py-3 px-4 text-gray-600">{att.checkIn || '-'}</td>
                        <td className="py-3 px-4 text-gray-600">{att.checkOut || '-'}</td>
                        <td className="py-3 px-4 text-gray-600">{att.checkIn && att.checkOut ? '8h' : '-'}</td>
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

        {/* Leaves Tab */}
        <TabsContent value="leaves" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Leave Management</CardTitle>
                <Button className="bg-green-600 hover:bg-green-700" onClick={() => setApplyLeaveOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Apply Leave
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {[
                  { label: 'Pending', count: stats.pendingLeaveApprovals, color: 'yellow' },
                  { label: 'Approved', count: leaves.filter(l => l.status === 'Approved').length, color: 'green' },
                  { label: 'Rejected', count: leaves.filter(l => l.status === 'Rejected').length, color: 'red' }
                ].map((item, i) => (
                  <Card key={i} className={`bg-${item.color}-50`}>
                    <CardContent className="pt-6 text-center">
                      <p className={`text-3xl font-bold text-${item.color}-600`}>{item.count}</p>
                      <p className="text-sm text-gray-600">{item.label}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b bg-gray-50">
                    <tr>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Employee</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Leave Type</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">From</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">To</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Days</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaves.slice(0, 15).map(leave => (
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
                          <Button variant="outline" size="sm" onClick={() => alert(`View Leave Details for ${leave.empId} - ${leave.leaveType}`)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payroll Tab */}
        <TabsContent value="payroll" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Salary Processing</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-gray-600">Total Payroll</p>
                      <p className="text-2xl font-bold text-blue-600">{formatCurrency(5240000)}</p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg">
                      <p className="text-sm text-gray-600">Processed</p>
                      <p className="text-2xl font-bold text-green-600">{stats.totalPayslips}</p>
                    </div>
                  </div>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={() => alert('Process Monthly Payroll - Demo Feature: In production, this will process monthly payroll for all employees and generate payslips')}>
                    Process Monthly Payroll
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payslips Generated</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b bg-gray-50">
                      <tr>
                        <th className="text-left py-2 px-3 font-semibold text-gray-700 text-sm">Month</th>
                        <th className="text-left py-2 px-3 font-semibold text-gray-700 text-sm">Count</th>
                        <th className="text-left py-2 px-3 font-semibold text-gray-700 text-sm">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {['January 2025', 'December 2024', 'November 2024'].map((month, i) => (
                        <tr key={i} className="border-b">
                          <td className="py-2 px-3 text-sm">{month}</td>
                          <td className="py-2 px-3 text-sm font-semibold">{stats.totalPayslips - i * 10}</td>
                          <td className="py-2 px-3">
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Released</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Payslips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b bg-gray-50">
                    <tr>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Payslip No</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Employee</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Month</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Gross</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Deductions</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Net</th>
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
                            payslip.status === 'Released' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
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

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>KPI Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['Productivity', 'Quality', 'Team Collaboration', 'Innovation'].map((kpi, i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{kpi}</span>
                        <span className="text-blue-600">{75 + i * 5}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${75 + i * 5}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Appraisals Due</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {employees.slice(0, 4).map(emp => (
                    <div key={emp.id} className="p-3 bg-yellow-50 rounded-lg">
                      <p className="font-semibold text-sm">{emp.firstName} {emp.lastName}</p>
                      <p className="text-xs text-gray-600">Due: {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Feedback Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-3xl font-bold text-green-600">{Math.floor(Math.random() * 50 + 120)}</p>
                    <p className="text-sm text-gray-600">Positive Feedbacks</p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-3xl font-bold text-blue-600">{Math.floor(Math.random() * 30 + 45)}</p>
                    <p className="text-sm text-gray-600">Recommendations</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Training Tab */}
        <TabsContent value="training" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Training Calendar</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {['Leadership Skills', 'Technical Workshop', 'Communication Training', 'Safety Protocol'].map((training, i) => (
                    <div key={i} className="p-4 bg-purple-50 rounded-lg">
                      <p className="font-semibold text-gray-900">{training}</p>
                      <p className="text-sm text-gray-600">Date: 2025-02-{String((i + 1) * 5).padStart(2, '0')}</p>
                      <p className="text-sm text-purple-600 font-medium">{Math.floor(Math.random() * 20 + 10)} enrolled</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Certificates Issued</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {employees.slice(0, 4).map(emp => (
                    <div key={emp.id} className="p-3 bg-green-50 rounded-lg flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-sm">{emp.firstName} {emp.lastName}</p>
                        <p className="text-xs text-gray-600">Leadership Skills - Jan 2025</p>
                      </div>
                      <Button size="sm" variant="outline" onClick={() => alert(`Download Certificate - Demo Feature: In production, this will download the training certificate for ${emp.firstName} ${emp.lastName}`)}>
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ESS Tab */}
        <TabsContent value="ess" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Employee Self-Service Portal</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { title: 'My Profile', icon: Users, desc: 'View and update personal information' },
                  { title: 'Leave & Attendance', icon: Calendar, desc: 'Check attendance and apply for leave' },
                  { title: 'Payroll & Tax', icon: DollarSign, desc: 'View payslips and tax documents' },
                  { title: 'Loans & Advances', icon: FileText, desc: 'Apply for loans and advances' },
                  { title: 'My Performance', icon: TrendingUp, desc: 'View performance reviews and goals' },
                  { title: 'Training & Development', icon: GraduationCap, desc: 'Enroll in training programs' }
                ].map((item, i) => {
                  const Icon = item.icon
                  return (
                    <Card key={i} className="cursor-pointer hover:shadow-lg transition-shadow">
                      <CardContent className="pt-6">
                        <div className="flex flex-col items-center text-center space-y-3">
                          <div className="p-4 bg-blue-100 rounded-full">
                            <Icon className="w-8 h-8 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{item.title}</p>
                            <p className="text-sm text-gray-600 mt-1">{item.desc}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notices Tab */}
        <TabsContent value="notices" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>HR Notices & Announcements</CardTitle>
                <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setPostNoticeOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Post Notice
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { title: 'Holiday Announcement', date: '2025-01-15', priority: 'High' },
                  { title: 'New Policy Update', date: '2025-01-10', priority: 'Medium' },
                  { title: 'Training Schedule', date: '2025-01-08', priority: 'Low' },
                  { title: 'Annual Review Process', date: '2025-01-05', priority: 'High' }
                ].map((notice, i) => (
                  <div key={i} className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Bell className="w-5 h-5 text-blue-600" />
                          <p className="font-semibold text-gray-900">{notice.title}</p>
                          <span className={`text-xs px-2 py-1 rounded ${
                            notice.priority === 'High' ? 'bg-red-100 text-red-800' :
                            notice.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {notice.priority}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">Posted on {notice.date}</p>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => alert(`View Notice Details: ${notice.title}`)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Compliance Tab */}
        <TabsContent value="compliance" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Tax & PF/Gratuity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-600">Total PF Contribution</p>
                    <p className="text-2xl font-bold text-blue-600">{formatCurrency(245000)}</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <p className="text-sm text-gray-600">Total Tax Deduction</p>
                    <p className="text-2xl font-bold text-green-600">{formatCurrency(180000)}</p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <p className="text-sm text-gray-600">Gratuity Provision</p>
                    <p className="text-2xl font-bold text-purple-600">{formatCurrency(95000)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>HR Analytics Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { metric: 'Employee Turnover Rate', value: '8.5%', trend: 'down' },
                    { metric: 'Avg. Time to Hire', value: '21 days', trend: 'down' },
                    { metric: 'Training Hours/Employee', value: '24 hrs', trend: 'up' },
                    { metric: 'Employee Satisfaction', value: '4.2/5', trend: 'up' }
                  ].map((item, i) => (
                    <div key={i} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-sm text-gray-600">{item.metric}</p>
                        <p className="text-lg font-bold text-gray-900">{item.value}</p>
                      </div>
                      <div className={`text-sm font-semibold ${item.trend === 'up' ? 'text-green-600' : 'text-blue-600'}`}>
                        {item.trend === 'up' ? '↑' : '↓'}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Custom Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  'Headcount Report',
                  'Salary Distribution',
                  'Leave Analysis',
                  'Attendance Summary',
                  'Recruitment Analytics',
                  'Performance Metrics'
                ].map((report, i) => (
                  <Card key={i} className="cursor-pointer hover:shadow-lg transition-shadow bg-gray-50">
                    <CardContent className="pt-6">
                      <div className="flex items-center space-x-3">
                        <FileBarChart className="w-6 h-6 text-blue-600" />
                        <div>
                          <p className="font-semibold text-gray-900">{report}</p>
                          <p className="text-sm text-gray-600">Generate</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
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
    </div>
  )
}
