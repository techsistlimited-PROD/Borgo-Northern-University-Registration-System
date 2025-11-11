import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/RegistrationAuthContext'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Users, UserX, UserCheck, LogOut, Building2, Calendar, ChevronRight } from 'lucide-react'
import HRMSidebar from '@/components/hrm/HRMSidebar'
import HRMDashboardView from '@/components/hrm/HRMDashboardView'
import HRMEmployeeList from '@/components/hrm/HRMEmployeeList'
import HRMDocuments from '@/components/hrm/HRMDocuments'
import HRMHistory from '@/components/hrm/HRMHistory'
import EmployeeProfile from '@/components/hrm/EmployeeProfile'
import RecruitmentPages from '@/components/hrm/recruitment/RecruitmentPages'
import AttendanceDashboard from '@/components/hrm/attendance/AttendanceDashboard'
import ShiftRosterPlanner from '@/components/hrm/attendance/ShiftRosterPlanner'
import DailyAttendance from '@/components/hrm/attendance/DailyAttendance'
import MonthlyReports from '@/components/hrm/attendance/MonthlyReports'
import LeaveApplications from '@/components/hrm/leave/LeaveApplications'
import LeaveBalances from '@/components/hrm/leave/LeaveBalances'
import SalaryStructure from '@/components/hrm/payroll/SalaryStructure'
import PayrollProcessing from '@/components/hrm/payroll/PayrollProcessing'
import SalaryDisbursement from '@/components/hrm/payroll/SalaryDisbursement'
import ArrearsAdjustments from '@/components/hrm/payroll/ArrearsAdjustments'
import PayslipGenerator from '@/components/hrm/payroll/PayslipGenerator'
import KPIDashboard from '@/components/hrm/performance/KPIDashboard'
import Appraisals from '@/components/hrm/performance/Appraisals'
import FeedbackRecommendations from '@/components/hrm/performance/FeedbackRecommendations'
import TrainingCalendar from '@/components/hrm/training/TrainingCalendar'
import NominationsAttendance from '@/components/hrm/training/NominationsAttendance'
import PostTrainingEvaluation from '@/components/hrm/training/PostTrainingEvaluation'
import Certificates from '@/components/hrm/training/Certificates'
import MyProfile from '@/components/hrm/ess/MyProfile'
import LeaveAttendance from '@/components/hrm/ess/LeaveAttendance'
import PayrollTax from '@/components/hrm/ess/PayrollTax'
import LoansAdvances from '@/components/hrm/ess/LoansAdvances'
import PerformanceSelf from '@/components/hrm/ess/PerformanceSelf'
import HRNotices from '@/components/hrm/notices/HRNotices'
import MyInbox from '@/components/hrm/notices/MyInbox'
import TaxPFGratuity from '@/components/hrm/compliance/TaxPFGratuity'
import HRAnalytics from '@/components/hrm/compliance/HRAnalytics'
import CustomReports from '@/components/hrm/compliance/CustomReports'
import { HRM_STATS } from '@/lib/hrmStatic'

type ActiveView = 'dashboard' | 'employees' | 'documents' | 'history' | 'recruitment' | 'attendance' | 'leave' | 'payroll' | 'performance' | 'training' | 'ess' | 'notices' | 'compliance' | 'other'
type RecruitmentView = 'vacancies' | 'candidates' | 'shortlisting' | 'interviews' | 'offers' | 'onboarding'
type AttendanceView = 'att-dashboard' | 'roster' | 'daily' | 'monthly'
type LeaveView = 'applications' | 'balances'
type PayrollView = 'structure' | 'processing' | 'disbursement' | 'adjustments' | 'payslips'
type PerformanceView = 'kpi' | 'appraisals' | 'feedback'
type TrainingView = 'calendar' | 'nominations' | 'evaluation' | 'certificates'
type ESSView = 'profile' | 'leave-attendance' | 'payroll' | 'loans' | 'performance'
type NoticesView = 'all' | 'inbox'
type ComplianceView = 'tax-pf' | 'analytics' | 'reports'

type BreadcrumbItem = { label: string; path?: string }

export default function HRMDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [activeView, setActiveView] = useState<ActiveView>('dashboard')
  const [recruitmentView, setRecruitmentView] = useState<RecruitmentView>('vacancies')
  const [attendanceView, setAttendanceView] = useState<AttendanceView>('att-dashboard')
  const [leaveView, setLeaveView] = useState<LeaveView>('applications')
  const [payrollView, setPayrollView] = useState<PayrollView>('structure')
  const [performanceView, setPerformanceView] = useState<PerformanceView>('kpi')
  const [trainingView, setTrainingView] = useState<TrainingView>('calendar')
  const [essView, setESSView] = useState<ESSView>('profile')
  const [noticesView, setNoticesView] = useState<NoticesView>('all')
  const [complianceView, setComplianceView] = useState<ComplianceView>('tax-pf')
  const [activePath, setActivePath] = useState('/hrm/dashboard')
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([{ label: 'Dashboard' }])

  const handleNavigation = (path: string) => {
    setActivePath(path)

    const updateBreadcrumbs = (group: string, subPage: string) => {
      setBreadcrumbs([{ label: group }, { label: subPage }])
    }

    if (path === '/hrm/dashboard') {
      setActiveView('dashboard')
      setBreadcrumbs([{ label: 'Dashboard' }])
    }
    else if (path === '/hrm/employees') {
      setActiveView('employees')
      setBreadcrumbs([{ label: 'Employee Information', path: '/hrm/employees' }, { label: 'Employee List' }])
    }
    else if (path === '/hrm/employees/documents') {
      setActiveView('documents')
      setBreadcrumbs([{ label: 'Employee Information', path: '/hrm/employees' }, { label: 'Documents' }])
    }
    else if (path === '/hrm/employees/history') {
      setActiveView('history')
      setBreadcrumbs([{ label: 'Employee Information', path: '/hrm/employees' }, { label: 'History' }])
    }
    else if (path.startsWith('/hrm/recruitment')) {
      setActiveView('recruitment')
      if (path.includes('/vacancies')) { setRecruitmentView('vacancies'); updateBreadcrumbs('Recruitment', 'Vacancies') }
      else if (path.includes('/candidates')) { setRecruitmentView('candidates'); updateBreadcrumbs('Recruitment', 'Candidates') }
      else if (path.includes('/shortlisting')) { setRecruitmentView('shortlisting'); updateBreadcrumbs('Recruitment', 'Shortlisting') }
      else if (path.includes('/interviews')) { setRecruitmentView('interviews'); updateBreadcrumbs('Recruitment', 'Interviews') }
      else if (path.includes('/offers')) { setRecruitmentView('offers'); updateBreadcrumbs('Recruitment', 'Offers') }
      else if (path.includes('/onboarding')) { setRecruitmentView('onboarding'); updateBreadcrumbs('Recruitment', 'Onboarding') }
      else { setRecruitmentView('vacancies'); updateBreadcrumbs('Recruitment', 'Vacancies') }
    }
    else if (path.startsWith('/hrm/attendance')) {
      setActiveView('attendance')
      if (path.includes('/dashboard')) { setAttendanceView('att-dashboard'); updateBreadcrumbs('Attendance & Leave', 'Attendance Dashboard') }
      else if (path.includes('/roster')) { setAttendanceView('roster'); updateBreadcrumbs('Attendance & Leave', 'Shift & Roster Planner') }
      else if (path.includes('/daily')) { setAttendanceView('daily'); updateBreadcrumbs('Attendance & Leave', 'Daily Attendance') }
      else if (path.includes('/monthly')) { setAttendanceView('monthly'); updateBreadcrumbs('Attendance & Leave', 'Monthly Reports') }
      else { setAttendanceView('att-dashboard'); updateBreadcrumbs('Attendance & Leave', 'Attendance Dashboard') }
    }
    else if (path.startsWith('/hrm/leave')) {
      setActiveView('leave')
      if (path.includes('/applications')) { setLeaveView('applications'); updateBreadcrumbs('Attendance & Leave', 'Leave Applications') }
      else if (path.includes('/balances')) { setLeaveView('balances'); updateBreadcrumbs('Attendance & Leave', 'Leave Balances') }
      else { setLeaveView('applications'); updateBreadcrumbs('Attendance & Leave', 'Leave Applications') }
    }
    else if (path.startsWith('/hrm/payroll')) {
      setActiveView('payroll')
      if (path.includes('/structure')) { setPayrollView('structure'); updateBreadcrumbs('Payroll', 'Salary Structure') }
      else if (path.includes('/processing')) { setPayrollView('processing'); updateBreadcrumbs('Payroll', 'Payroll Processing') }
      else if (path.includes('/disbursement')) { setPayrollView('disbursement'); updateBreadcrumbs('Payroll', 'Salary Disbursement') }
      else if (path.includes('/adjustments')) { setPayrollView('adjustments'); updateBreadcrumbs('Payroll', 'Arrears & Adjustments') }
      else if (path.includes('/payslips')) { setPayrollView('payslips'); updateBreadcrumbs('Payroll', 'Payslip Generator') }
      else { setPayrollView('structure'); updateBreadcrumbs('Payroll', 'Salary Structure') }
    }
    else if (path.startsWith('/hrm/performance')) {
      setActiveView('performance')
      if (path.includes('/kpi')) { setPerformanceView('kpi'); updateBreadcrumbs('Performance', 'KPI Dashboard') }
      else if (path.includes('/appraisals')) { setPerformanceView('appraisals'); updateBreadcrumbs('Performance', 'Appraisals') }
      else if (path.includes('/feedback')) { setPerformanceView('feedback'); updateBreadcrumbs('Performance', 'Feedback & Recommendations') }
      else { setPerformanceView('kpi'); updateBreadcrumbs('Performance', 'KPI Dashboard') }
    }
    else if (path.startsWith('/hrm/training')) {
      setActiveView('training')
      if (path.includes('/calendar')) { setTrainingView('calendar'); updateBreadcrumbs('Training & Development', 'Training Calendar') }
      else if (path.includes('/nominations')) { setTrainingView('nominations'); updateBreadcrumbs('Training & Development', 'Nominations & Attendance') }
      else if (path.includes('/evaluation')) { setTrainingView('evaluation'); updateBreadcrumbs('Training & Development', 'Post-Training Evaluation') }
      else if (path.includes('/certificates')) { setTrainingView('certificates'); updateBreadcrumbs('Training & Development', 'Certificates') }
      else { setTrainingView('calendar'); updateBreadcrumbs('Training & Development', 'Training Calendar') }
    }
    else if (path.startsWith('/hrm/ess')) {
      setActiveView('ess')
      if (path.includes('/profile')) { setESSView('profile'); updateBreadcrumbs('Employee Self-Service', 'My Profile') }
      else if (path.includes('/leave-attendance')) { setESSView('leave-attendance'); updateBreadcrumbs('Employee Self-Service', 'Leave & Attendance') }
      else if (path.includes('/payroll')) { setESSView('payroll'); updateBreadcrumbs('Employee Self-Service', 'Payroll & Tax') }
      else if (path.includes('/loans')) { setESSView('loans'); updateBreadcrumbs('Employee Self-Service', 'Loans & Advances') }
      else if (path.includes('/performance')) { setESSView('performance'); updateBreadcrumbs('Employee Self-Service', 'Performance') }
      else { setESSView('profile'); updateBreadcrumbs('Employee Self-Service', 'My Profile') }
    }
    else if (path.startsWith('/hrm/notices')) {
      setActiveView('notices')
      if (path.includes('/inbox')) { setNoticesView('inbox'); updateBreadcrumbs('Notices & Announcements', 'My Inbox') }
      else { setNoticesView('all'); updateBreadcrumbs('Notices & Announcements', 'HR Notices') }
    }
    else if (path.startsWith('/hrm/compliance')) {
      setActiveView('compliance')
      if (path.includes('/tax-pf')) { setComplianceView('tax-pf'); updateBreadcrumbs('Compliance & Reports', 'Tax & PF/Gratuity') }
      else if (path.includes('/analytics')) { setComplianceView('analytics'); updateBreadcrumbs('Compliance & Reports', 'HR Analytics Dashboard') }
      else if (path.includes('/reports')) { setComplianceView('reports'); updateBreadcrumbs('Compliance & Reports', 'Custom Reports') }
      else { setComplianceView('tax-pf'); updateBreadcrumbs('Compliance & Reports', 'Tax & PF/Gratuity') }
    }
    else setActiveView('other')
  }

  const handleLogout = () => {
    logout()
    navigate('/hrm-login')
  }

  const renderContent = () => {
    const contentKey = activePath
    const content = (() => {
      switch (activeView) {
        case 'dashboard':
          return <HRMDashboardView />
        case 'employees':
          return <HRMEmployeeList />
        case 'documents':
          return <HRMDocuments />
        case 'history':
          return <HRMHistory />
        case 'recruitment':
          return <RecruitmentPages view={recruitmentView} />
        case 'attendance':
          if (attendanceView === 'att-dashboard') return <AttendanceDashboard />
          if (attendanceView === 'roster') return <ShiftRosterPlanner />
          if (attendanceView === 'daily') return <DailyAttendance />
          if (attendanceView === 'monthly') return <MonthlyReports />
          return <AttendanceDashboard />
        case 'leave':
          if (leaveView === 'applications') return <LeaveApplications />
          if (leaveView === 'balances') return <LeaveBalances />
          return <LeaveApplications />
        case 'payroll':
          if (payrollView === 'structure') return <SalaryStructure />
          if (payrollView === 'processing') return <PayrollProcessing />
          if (payrollView === 'disbursement') return <SalaryDisbursement />
          if (payrollView === 'adjustments') return <ArrearsAdjustments />
          if (payrollView === 'payslips') return <PayslipGenerator />
          return <SalaryStructure />
        case 'performance':
          if (performanceView === 'kpi') return <KPIDashboard />
          if (performanceView === 'appraisals') return <Appraisals />
          if (performanceView === 'feedback') return <FeedbackRecommendations />
          return <KPIDashboard />
        case 'training':
          if (trainingView === 'calendar') return <TrainingCalendar />
          if (trainingView === 'nominations') return <NominationsAttendance />
          if (trainingView === 'evaluation') return <PostTrainingEvaluation />
          if (trainingView === 'certificates') return <Certificates />
          return <TrainingCalendar />
        case 'ess':
          if (essView === 'profile') return <MyProfile />
          if (essView === 'leave-attendance') return <LeaveAttendance />
          if (essView === 'payroll') return <PayrollTax />
          if (essView === 'loans') return <LoansAdvances />
          if (essView === 'performance') return <PerformanceSelf />
          return <MyProfile />
        case 'notices':
          if (noticesView === 'all') return <HRNotices />
          if (noticesView === 'inbox') return <MyInbox />
          return <HRNotices />
        case 'compliance':
          if (complianceView === 'tax-pf') return <TaxPFGratuity />
          if (complianceView === 'analytics') return <HRAnalytics />
          if (complianceView === 'reports') return <CustomReports />
          return <TaxPFGratuity />
        case 'other':
          return (
            <div className="p-8 text-center">
              <Building2 className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Module Not Available</h3>
              <p className="text-gray-600">This module is currently unavailable.</p>
            </div>
          )
        default:
          return <HRMDashboardView />
      }
    })()

    return (
      <div
        key={contentKey}
        className="animate-fadeIn"
      >
        {content}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <header className="bg-gradient-to-r from-deep-violet to-soft-plum text-white shadow-lg sticky top-0 z-50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Users className="w-8 h-8" />
              <div>
                <h1 className="text-xl font-semibold font-poppins">Human Resource Management</h1>
                <p className="text-sm text-white/80 font-inter">Employee Administration</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Stats Quick View */}
              <div className="hidden lg:flex items-center space-x-6 text-sm">
                <div className="flex items-center space-x-2">
                  <UserCheck className="w-4 h-4" />
                  <span>Active: <strong>{HRM_STATS.activeStaff}</strong></span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>On Leave: <strong>{HRM_STATS.onLeave}</strong></span>
                </div>
                <div className="flex items-center space-x-2">
                  <UserX className="w-4 h-4" />
                  <span>Resigned: <strong>{HRM_STATS.resigned}</strong></span>
                </div>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-white hover:bg-white/10">
                    <Avatar className="w-8 h-8 mr-2">
                      <AvatarFallback className="bg-white text-deep-violet font-semibold">
                        {user?.name.split(' ').map(n => n[0]).join('').substring(0, 2) || 'HR'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden md:flex flex-col items-start mr-2">
                      <span className="text-sm font-medium">{user?.name || 'HR Officer'}</span>
                      <span className="text-xs text-white/70">{user?.email || 'hr@nu.edu.bd'}</span>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="rounded-xl">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <span className="font-semibold">{user?.name || 'HR Officer'}</span>
                      <span className="text-xs text-gray-500">{user?.email || 'hr@nu.edu.bd'}</span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Breadcrumbs */}
          <div className="mt-3 flex items-center space-x-2 text-sm text-white/90">
            <span className="font-poppins">HRM</span>
            {breadcrumbs.map((crumb, index) => (
              <div key={index} className="flex items-center space-x-2">
                <ChevronRight className="w-4 h-4" />
                <span className={index === breadcrumbs.length - 1 ? 'font-semibold text-light-lavender' : ''}>
                  {crumb.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <HRMSidebar activePath={activePath} onNavigate={handleNavigation} />

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  )
}
