import { useState } from 'react'
import { LayoutDashboard, Users, FileText, History, UserPlus, Calendar, DollarSign, TrendingUp, GraduationCap, Bell, FileBarChart, ChevronDown, ChevronRight, Lock } from 'lucide-react'
import { useAuth } from '@/contexts/RegistrationAuthContext'

type MenuItem = {
  id: string
  label: string
  icon: any
  path: string
  children?: MenuItem[]
  allowedRoles?: string[]
}

const menuItems: MenuItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/hrm/dashboard', allowedRoles: ['hr_officer', 'hr_head', 'system_admin'] },
  { id: 'employees', label: 'Employee List', icon: Users, path: '/hrm/employees', allowedRoles: ['hr_officer', 'hr_head', 'system_admin'] },
  { id: 'documents', label: 'Documents', icon: FileText, path: '/hrm/employees/documents', allowedRoles: ['hr_officer', 'hr_head', 'system_admin'] },
  { id: 'history', label: 'History', icon: History, path: '/hrm/employees/history', allowedRoles: ['hr_officer', 'hr_head', 'system_admin'] },
  {
    id: 'recruitment',
    label: 'Recruitment',
    icon: UserPlus,
    path: '/hrm/recruitment',
    allowedRoles: ['hr_head'],
    children: [
      { id: 'vacancies', label: 'Vacancies', icon: FileText, path: '/hrm/recruitment/vacancies', allowedRoles: ['hr_head'] },
      { id: 'candidates', label: 'Candidates', icon: Users, path: '/hrm/recruitment/candidates', allowedRoles: ['hr_head'] },
      { id: 'shortlisting', label: 'Shortlisting', icon: FileText, path: '/hrm/recruitment/shortlisting', allowedRoles: ['hr_head'] },
      { id: 'interviews', label: 'Interviews', icon: Calendar, path: '/hrm/recruitment/interviews', allowedRoles: ['hr_head'] },
      { id: 'offers', label: 'Offers', icon: FileText, path: '/hrm/recruitment/offers', allowedRoles: ['hr_head'] },
      { id: 'onboarding', label: 'Onboarding', icon: Users, path: '/hrm/recruitment/onboarding', allowedRoles: ['hr_head'] }
    ]
  },
  {
    id: 'attendance',
    label: 'Attendance & Leave',
    icon: Calendar,
    path: '/hrm/attendance',
    allowedRoles: ['hr_officer', 'hr_head'],
    children: [
      { id: 'att-dashboard', label: 'Attendance Dashboard', icon: LayoutDashboard, path: '/hrm/attendance/dashboard', allowedRoles: ['hr_officer', 'hr_head'] },
      { id: 'roster', label: 'Shift & Roster Planner', icon: Calendar, path: '/hrm/attendance/roster', allowedRoles: ['hr_officer', 'hr_head'] },
      { id: 'daily', label: 'Daily Attendance', icon: FileText, path: '/hrm/attendance/daily', allowedRoles: ['hr_officer', 'hr_head'] },
      { id: 'monthly', label: 'Monthly Reports', icon: FileBarChart, path: '/hrm/attendance/monthly', allowedRoles: ['hr_officer', 'hr_head'] },
      { id: 'leave-apps', label: 'Leave Applications', icon: FileText, path: '/hrm/leave/applications', allowedRoles: ['hr_officer', 'hr_head'] },
      { id: 'leave-bal', label: 'Leave Balances', icon: TrendingUp, path: '/hrm/leave/balances', allowedRoles: ['hr_officer', 'hr_head'] }
    ]
  },
  {
    id: 'payroll',
    label: 'Payroll',
    icon: DollarSign,
    path: '/hrm/payroll',
    allowedRoles: ['hr_officer', 'hr_head'],
    children: [
      { id: 'salary-structure', label: 'Salary Structure', icon: FileText, path: '/hrm/payroll/structure', allowedRoles: ['hr_officer', 'hr_head'] },
      { id: 'payroll-processing', label: 'Payroll Processing', icon: TrendingUp, path: '/hrm/payroll/processing', allowedRoles: ['hr_officer', 'hr_head'] },
      { id: 'disbursement', label: 'Salary Disbursement', icon: DollarSign, path: '/hrm/payroll/disbursement', allowedRoles: ['hr_officer', 'hr_head'] },
      { id: 'adjustments', label: 'Arrears & Adjustments', icon: FileText, path: '/hrm/payroll/adjustments', allowedRoles: ['hr_officer', 'hr_head'] },
      { id: 'payslips', label: 'Payslip Generator', icon: FileBarChart, path: '/hrm/payroll/payslips', allowedRoles: ['hr_officer', 'hr_head'] }
    ]
  },
  {
    id: 'performance',
    label: 'Performance',
    icon: TrendingUp,
    path: '/hrm/performance',
    allowedRoles: ['hr_officer', 'hr_head'],
    children: [
      { id: 'kpi-dashboard', label: 'KPI Dashboard', icon: LayoutDashboard, path: '/hrm/performance/kpi', allowedRoles: ['hr_officer', 'hr_head'] },
      { id: 'appraisals', label: 'Appraisals', icon: FileText, path: '/hrm/performance/appraisals', allowedRoles: ['hr_officer', 'hr_head'] },
      { id: 'feedback', label: 'Feedback & Recommendations', icon: Users, path: '/hrm/performance/feedback', allowedRoles: ['hr_officer', 'hr_head'] }
    ]
  },
  {
    id: 'training',
    label: 'Training & Development',
    icon: GraduationCap,
    path: '/hrm/training',
    allowedRoles: ['hr_officer', 'hr_head'],
    children: [
      { id: 'training-calendar', label: 'Training Calendar', icon: Calendar, path: '/hrm/training/calendar', allowedRoles: ['hr_officer', 'hr_head'] },
      { id: 'nominations', label: 'Nominations & Attendance', icon: Users, path: '/hrm/training/nominations', allowedRoles: ['hr_officer', 'hr_head'] },
      { id: 'evaluation', label: 'Post-Training Evaluation', icon: FileText, path: '/hrm/training/evaluation', allowedRoles: ['hr_officer', 'hr_head'] },
      { id: 'certificates', label: 'Certificates', icon: FileBarChart, path: '/hrm/training/certificates', allowedRoles: ['hr_officer', 'hr_head'] }
    ]
  },
  {
    id: 'ess',
    label: 'Employee Self-Service',
    icon: Users,
    path: '/hrm/ess',
    allowedRoles: ['hr_officer', 'hr_head'],
    children: [
      { id: 'ess-profile', label: 'My Profile', icon: Users, path: '/hrm/ess/profile', allowedRoles: ['hr_officer', 'hr_head'] },
      { id: 'ess-leave', label: 'Leave & Attendance', icon: Calendar, path: '/hrm/ess/leave-attendance', allowedRoles: ['hr_officer', 'hr_head'] },
      { id: 'ess-payroll', label: 'Payroll (Payslips & Tax)', icon: DollarSign, path: '/hrm/ess/payroll', allowedRoles: ['hr_officer', 'hr_head'] },
      { id: 'ess-loans', label: 'Loans & Advances', icon: FileText, path: '/hrm/ess/loans', allowedRoles: ['hr_officer', 'hr_head'] },
      { id: 'ess-performance', label: 'Performance', icon: TrendingUp, path: '/hrm/ess/performance', allowedRoles: ['hr_officer', 'hr_head'] }
    ]
  },
  {
    id: 'notices',
    label: 'Notices & Announcements',
    icon: Bell,
    path: '/hrm/notices',
    allowedRoles: ['hr_officer', 'hr_head'],
    children: [
      { id: 'hr-notices', label: 'HR Notices', icon: Bell, path: '/hrm/notices/all', allowedRoles: ['hr_officer', 'hr_head'] },
      { id: 'inbox', label: 'My Inbox', icon: FileText, path: '/hrm/notices/inbox', allowedRoles: ['hr_officer', 'hr_head'] }
    ]
  },
  {
    id: 'compliance',
    label: 'Compliance & Reports',
    icon: FileBarChart,
    path: '/hrm/compliance',
    allowedRoles: ['hr_officer', 'hr_head', 'system_admin'],
    children: [
      { id: 'tax-pf', label: 'Tax & PF/Gratuity', icon: DollarSign, path: '/hrm/compliance/tax-pf', allowedRoles: ['hr_officer', 'hr_head', 'system_admin'] },
      { id: 'analytics', label: 'HR Analytics Dashboard', icon: TrendingUp, path: '/hrm/compliance/analytics', allowedRoles: ['hr_head', 'system_admin'] },
      { id: 'custom-reports', label: 'Custom Reports', icon: FileBarChart, path: '/hrm/compliance/reports', allowedRoles: ['hr_officer', 'hr_head', 'system_admin'] }
    ]
  }
]

type Props = {
  activePath: string
  onNavigate: (path: string) => void
}

export default function HRMSidebar({ activePath, onNavigate }: Props) {
  const { user } = useAuth()
  const [expandedItems, setExpandedItems] = useState<string[]>(['recruitment', 'attendance', 'payroll', 'performance', 'training', 'ess', 'notices', 'compliance'])

  const toggleExpand = (id: string) => {
    if (expandedItems.includes(id)) {
      setExpandedItems(expandedItems.filter(item => item !== id))
    } else {
      setExpandedItems([...expandedItems, id])
    }
  }

  const hasAccess = (allowedRoles?: string[]) => {
    if (!allowedRoles || allowedRoles.length === 0) return true
    return allowedRoles.includes(user?.role || '')
  }

  const renderMenuItem = (item: MenuItem, isChild = false) => {
    const Icon = item.icon
    const isActive = activePath === item.path
    const isExpanded = expandedItems.includes(item.id)
    const hasChildren = item.children && item.children.length > 0
    const allowed = hasAccess(item.allowedRoles)

    if (!allowed && !hasChildren) return null

    return (
      <div key={item.id}>
        <button
          onClick={() => {
            if (!allowed && !hasChildren) return
            if (hasChildren) {
              toggleExpand(item.id)
            } else if (allowed) {
              onNavigate(item.path)
            }
          }}
          disabled={!allowed && !hasChildren}
          className={`w-full flex items-center justify-between space-x-3 px-4 py-3 rounded-lg transition-all ${
            isChild ? 'ml-4 text-sm' : ''
          } ${
            isActive && allowed
              ? 'bg-white text-growth-green shadow-md border-l-4 border-accent-cyan font-semibold'
              : allowed
              ? 'text-white/90 hover:bg-white/15 hover:text-white'
              : 'text-white/40 cursor-not-allowed'
          }`}
          title={!allowed ? 'Restricted - Insufficient Permissions' : ''}
        >
          <div className="flex items-center space-x-3">
            <Icon className="w-5 h-5" />
            <span className={allowed ? 'font-medium' : 'font-normal'}>{item.label}</span>
            {!allowed && <Lock className="w-3 h-3 ml-1" />}
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
    <aside className="w-64 bg-gradient-to-r from-growth-green to-metal-black min-h-[calc(100vh-80px)] shadow-lg overflow-y-auto sticky top-20">
      <nav className="p-4 space-y-2">
        {menuItems.map(item => renderMenuItem(item))}
      </nav>
    </aside>
  )
}
