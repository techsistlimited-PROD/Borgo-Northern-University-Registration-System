import { LayoutDashboard, Users, FileText, History, UserPlus, Calendar, DollarSign, TrendingUp, GraduationCap, Bell, FileBarChart } from 'lucide-react'

type MenuItem = {
  id: string
  label: string
  icon: any
  path: string
}

const menuItems: MenuItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/hrm/dashboard' },
  { id: 'employees', label: 'Employee List', icon: Users, path: '/hrm/employees' },
  { id: 'documents', label: 'Documents', icon: FileText, path: '/hrm/employees/documents' },
  { id: 'history', label: 'History', icon: History, path: '/hrm/employees/history' },
  { id: 'recruitment', label: 'Recruitment', icon: UserPlus, path: '/hrm/recruitment' },
  { id: 'attendance', label: 'Attendance & Leave', icon: Calendar, path: '/hrm/attendance' },
  { id: 'payroll', label: 'Payroll', icon: DollarSign, path: '/hrm/payroll' },
  { id: 'performance', label: 'Performance', icon: TrendingUp, path: '/hrm/performance' },
  { id: 'training', label: 'Training', icon: GraduationCap, path: '/hrm/training' },
  { id: 'ess', label: 'ESS Portal', icon: Users, path: '/hrm/ess' },
  { id: 'notices', label: 'HR Notices', icon: Bell, path: '/hrm/notices' },
  { id: 'reports', label: 'Reports', icon: FileBarChart, path: '/hrm/reports' }
]

type Props = {
  activePath: string
  onNavigate: (path: string) => void
}

export default function HRMSidebar({ activePath, onNavigate }: Props) {
  return (
    <aside className="w-64 bg-gradient-to-b from-blue-600 to-blue-800 min-h-[calc(100vh-80px)] shadow-lg">
      <nav className="p-4 space-y-2">
        {menuItems.map(item => {
          const Icon = item.icon
          const isActive = activePath === item.path
          
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.path)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? 'bg-white text-blue-600 shadow-md'
                  : 'text-white/90 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          )
        })}
      </nav>
    </aside>
  )
}
