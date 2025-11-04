import { useState } from 'react'
import { LayoutDashboard, Users, FileText, History, UserPlus, Calendar, DollarSign, TrendingUp, GraduationCap, Bell, FileBarChart, ChevronDown, ChevronRight } from 'lucide-react'

type MenuItem = {
  id: string
  label: string
  icon: any
  path: string
  children?: MenuItem[]
}

const menuItems: MenuItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/hrm/dashboard' },
  { id: 'employees', label: 'Employee List', icon: Users, path: '/hrm/employees' },
  { id: 'documents', label: 'Documents', icon: FileText, path: '/hrm/employees/documents' },
  { id: 'history', label: 'History', icon: History, path: '/hrm/employees/history' },
  {
    id: 'recruitment',
    label: 'Recruitment',
    icon: UserPlus,
    path: '/hrm/recruitment',
    children: [
      { id: 'vacancies', label: 'Vacancies', icon: FileText, path: '/hrm/recruitment/vacancies' },
      { id: 'candidates', label: 'Candidates', icon: Users, path: '/hrm/recruitment/candidates' },
      { id: 'shortlisting', label: 'Shortlisting', icon: FileText, path: '/hrm/recruitment/shortlisting' },
      { id: 'interviews', label: 'Interviews', icon: Calendar, path: '/hrm/recruitment/interviews' },
      { id: 'offers', label: 'Offers', icon: FileText, path: '/hrm/recruitment/offers' },
      { id: 'onboarding', label: 'Onboarding', icon: Users, path: '/hrm/recruitment/onboarding' }
    ]
  },
  {
    id: 'attendance',
    label: 'Attendance & Leave',
    icon: Calendar,
    path: '/hrm/attendance',
    children: [
      { id: 'att-dashboard', label: 'Attendance Dashboard', icon: LayoutDashboard, path: '/hrm/attendance/dashboard' },
      { id: 'roster', label: 'Shift & Roster Planner', icon: Calendar, path: '/hrm/attendance/roster' },
      { id: 'daily', label: 'Daily Attendance', icon: FileText, path: '/hrm/attendance/daily' },
      { id: 'monthly', label: 'Monthly Reports', icon: FileBarChart, path: '/hrm/attendance/monthly' },
      { id: 'leave-apps', label: 'Leave Applications', icon: FileText, path: '/hrm/leave/applications' },
      { id: 'leave-bal', label: 'Leave Balances', icon: TrendingUp, path: '/hrm/leave/balances' }
    ]
  },
  {
    id: 'payroll',
    label: 'Payroll',
    icon: DollarSign,
    path: '/hrm/payroll',
    children: [
      { id: 'salary-structure', label: 'Salary Structure', icon: FileText, path: '/hrm/payroll/structure' },
      { id: 'payroll-processing', label: 'Payroll Processing', icon: TrendingUp, path: '/hrm/payroll/processing' },
      { id: 'disbursement', label: 'Salary Disbursement', icon: DollarSign, path: '/hrm/payroll/disbursement' },
      { id: 'adjustments', label: 'Arrears & Adjustments', icon: FileText, path: '/hrm/payroll/adjustments' },
      { id: 'payslips', label: 'Payslip Generator', icon: FileBarChart, path: '/hrm/payroll/payslips' }
    ]
  },
  {
    id: 'performance',
    label: 'Performance',
    icon: TrendingUp,
    path: '/hrm/performance',
    children: [
      { id: 'kpi-dashboard', label: 'KPI Dashboard', icon: LayoutDashboard, path: '/hrm/performance/kpi' },
      { id: 'appraisals', label: 'Appraisals', icon: FileText, path: '/hrm/performance/appraisals' },
      { id: 'feedback', label: 'Feedback & Recommendations', icon: Users, path: '/hrm/performance/feedback' }
    ]
  },
  {
    id: 'training',
    label: 'Training & Development',
    icon: GraduationCap,
    path: '/hrm/training',
    children: [
      { id: 'training-calendar', label: 'Training Calendar', icon: Calendar, path: '/hrm/training/calendar' },
      { id: 'nominations', label: 'Nominations & Attendance', icon: Users, path: '/hrm/training/nominations' },
      { id: 'evaluation', label: 'Post-Training Evaluation', icon: FileText, path: '/hrm/training/evaluation' },
      { id: 'certificates', label: 'Certificates', icon: FileBarChart, path: '/hrm/training/certificates' }
    ]
  },
  {
    id: 'ess',
    label: 'Employee Self-Service',
    icon: Users,
    path: '/hrm/ess',
    children: [
      { id: 'ess-profile', label: 'My Profile', icon: Users, path: '/hrm/ess/profile' },
      { id: 'ess-leave', label: 'Leave & Attendance', icon: Calendar, path: '/hrm/ess/leave-attendance' },
      { id: 'ess-payroll', label: 'Payroll (Payslips & Tax)', icon: DollarSign, path: '/hrm/ess/payroll' },
      { id: 'ess-loans', label: 'Loans & Advances', icon: FileText, path: '/hrm/ess/loans' },
      { id: 'ess-performance', label: 'Performance', icon: TrendingUp, path: '/hrm/ess/performance' }
    ]
  },
  {
    id: 'notices',
    label: 'Notices & Announcements',
    icon: Bell,
    path: '/hrm/notices',
    children: [
      { id: 'hr-notices', label: 'HR Notices', icon: Bell, path: '/hrm/notices/all' },
      { id: 'inbox', label: 'My Inbox', icon: FileText, path: '/hrm/notices/inbox' }
    ]
  },
  {
    id: 'compliance',
    label: 'Compliance & Reports',
    icon: FileBarChart,
    path: '/hrm/compliance',
    children: [
      { id: 'tax-pf', label: 'Tax & PF/Gratuity', icon: DollarSign, path: '/hrm/compliance/tax-pf' },
      { id: 'analytics', label: 'HR Analytics Dashboard', icon: TrendingUp, path: '/hrm/compliance/analytics' },
      { id: 'custom-reports', label: 'Custom Reports', icon: FileBarChart, path: '/hrm/compliance/reports' }
    ]
  }
]

type Props = {
  activePath: string
  onNavigate: (path: string) => void
}

export default function HRMSidebar({ activePath, onNavigate }: Props) {
  const [expandedItems, setExpandedItems] = useState<string[]>(['recruitment', 'attendance', 'payroll', 'performance', 'training', 'ess', 'notices', 'compliance'])

  const toggleExpand = (id: string) => {
    if (expandedItems.includes(id)) {
      setExpandedItems(expandedItems.filter(item => item !== id))
    } else {
      setExpandedItems([...expandedItems, id])
    }
  }

  const renderMenuItem = (item: MenuItem, isChild = false) => {
    const Icon = item.icon
    const isActive = activePath === item.path
    const isExpanded = expandedItems.includes(item.id)
    const hasChildren = item.children && item.children.length > 0

    return (
      <div key={item.id}>
        <button
          onClick={() => {
            if (hasChildren) {
              toggleExpand(item.id)
            } else {
              onNavigate(item.path)
            }
          }}
          className={`w-full flex items-center justify-between space-x-3 px-4 py-3 rounded-lg transition-all ${
            isChild ? 'ml-4 text-sm' : ''
          } ${
            isActive
              ? 'bg-white text-blue-600 shadow-md'
              : 'text-white/90 hover:bg-white/10 hover:text-white'
          }`}
        >
          <div className="flex items-center space-x-3">
            <Icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </div>
          {hasChildren && (
            isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />
          )}
        </button>

        {hasChildren && isExpanded && (
          <div className="mt-1 space-y-1">
            {item.children!.map(child => renderMenuItem(child, true))}
          </div>
        )}
      </div>
    )
  }

  return (
    <aside className="w-64 bg-gradient-to-b from-blue-600 to-blue-800 min-h-[calc(100vh-80px)] shadow-lg overflow-y-auto">
      <nav className="p-4 space-y-2">
        {menuItems.map(item => renderMenuItem(item))}
      </nav>
    </aside>
  )
}
