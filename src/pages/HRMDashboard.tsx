import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/RegistrationAuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Users, UserX, UserCheck, LogOut, Building2, Calendar } from 'lucide-react'
import HRMSidebar from '@/components/hrm/HRMSidebar'
import HRMDashboardView from '@/components/hrm/HRMDashboardView'
import HRMEmployeeList from '@/components/hrm/HRMEmployeeList'
import HRMDocuments from '@/components/hrm/HRMDocuments'
import HRMHistory from '@/components/hrm/HRMHistory'
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

  const handleNavigation = (path: string) => {
    setActivePath(path)

    if (path === '/hrm/dashboard') setActiveView('dashboard')
    else if (path === '/hrm/employees') setActiveView('employees')
    else if (path === '/hrm/employees/documents') setActiveView('documents')
    else if (path === '/hrm/employees/history') setActiveView('history')
    else if (path.startsWith('/hrm/recruitment')) {
      setActiveView('recruitment')
      if (path.includes('/vacancies')) setRecruitmentView('vacancies')
      else if (path.includes('/candidates')) setRecruitmentView('candidates')
      else if (path.includes('/shortlisting')) setRecruitmentView('shortlisting')
      else if (path.includes('/interviews')) setRecruitmentView('interviews')
      else if (path.includes('/offers')) setRecruitmentView('offers')
      else if (path.includes('/onboarding')) setRecruitmentView('onboarding')
      else setRecruitmentView('vacancies')
    }
    else if (path.startsWith('/hrm/attendance')) {
      setActiveView('attendance')
      if (path.includes('/dashboard')) setAttendanceView('att-dashboard')
      else if (path.includes('/roster')) setAttendanceView('roster')
      else if (path.includes('/daily')) setAttendanceView('daily')
      else if (path.includes('/monthly')) setAttendanceView('monthly')
      else setAttendanceView('att-dashboard')
    }
    else if (path.startsWith('/hrm/leave')) {
      setActiveView('leave')
      if (path.includes('/applications')) setLeaveView('applications')
      else if (path.includes('/balances')) setLeaveView('balances')
      else setLeaveView('applications')
    }
    else if (path.startsWith('/hrm/payroll')) {
      setActiveView('payroll')
      if (path.includes('/structure')) setPayrollView('structure')
      else if (path.includes('/processing')) setPayrollView('processing')
      else if (path.includes('/disbursement')) setPayrollView('disbursement')
      else if (path.includes('/adjustments')) setPayrollView('adjustments')
      else if (path.includes('/payslips')) setPayrollView('payslips')
      else setPayrollView('structure')
    }
    else if (path.startsWith('/hrm/performance')) {
      setActiveView('performance')
      if (path.includes('/kpi')) setPerformanceView('kpi')
      else if (path.includes('/appraisals')) setPerformanceView('appraisals')
      else if (path.includes('/feedback')) setPerformanceView('feedback')
      else setPerformanceView('kpi')
    }
    else if (path.startsWith('/hrm/training')) {
      setActiveView('training')
      if (path.includes('/calendar')) setTrainingView('calendar')
      else if (path.includes('/nominations')) setTrainingView('nominations')
      else if (path.includes('/evaluation')) setTrainingView('evaluation')
      else if (path.includes('/certificates')) setTrainingView('certificates')
      else setTrainingView('calendar')
    }
    else if (path.startsWith('/hrm/ess')) {
      setActiveView('ess')
      if (path.includes('/profile')) setESSView('profile')
      else if (path.includes('/leave-attendance')) setESSView('leave-attendance')
      else if (path.includes('/payroll')) setESSView('payroll')
      else if (path.includes('/loans')) setESSView('loans')
      else if (path.includes('/performance')) setESSView('performance')
      else setESSView('profile')
    }
    else if (path.startsWith('/hrm/notices')) {
      setActiveView('notices')
      if (path.includes('/inbox')) setNoticesView('inbox')
      else setNoticesView('all')
    }
    else if (path.startsWith('/hrm/compliance')) {
      setActiveView('compliance')
      if (path.includes('/tax-pf')) setComplianceView('tax-pf')
      else if (path.includes('/analytics')) setComplianceView('analytics')
      else if (path.includes('/reports')) setComplianceView('reports')
      else setComplianceView('tax-pf')
    }
    else setActiveView('other')
  }

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  const renderContent = () => {
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
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Under Development</h3>
            <p className="text-gray-600">This module is currently under development.</p>
          </div>
        )
      default:
        return <HRMDashboardView />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg sticky top-0 z-50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Users className="w-8 h-8" />
              <div>
                <h1 className="text-xl font-bold">Human Resource Management</h1>
                <p className="text-sm text-white/80">Employee Information & Administration</p>
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
                      <AvatarFallback className="bg-white text-blue-600">
                        {user?.name.split(' ').map(n => n[0]).join('').substring(0, 2) || 'HR'}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden md:inline">{user?.name || 'HR Officer'}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>HR Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
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
