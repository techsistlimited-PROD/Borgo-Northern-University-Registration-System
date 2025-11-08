import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ChevronDown, ChevronRight, LayoutDashboard, Users, FileText, Wallet, Award, AlertCircle, Building2, Settings, Bell, BarChart3 } from 'lucide-react'

interface SidebarSection {
  name: string
  icon: React.ReactNode
  items?: { name: string; path: string }[]
  path?: string
}

const sections: SidebarSection[] = [
  {
    name: 'Dashboard',
    icon: <LayoutDashboard className="w-4 h-4" />,
    path: '/finance/dashboard'
  },
  {
    name: 'Student Accounts',
    icon: <Users className="w-4 h-4" />,
    items: [
      { name: 'Search Student / Ledger', path: '/finance/student-ledger' }
    ]
  },
  {
    name: 'Billing',
    icon: <FileText className="w-4 h-4" />,
    items: [
      { name: 'Student Payables', path: '/finance/payables' },
      { name: 'Bulk Late Fee Assignment', path: '/finance/late-fee' },
      { name: 'Drop/Re-admission Fees', path: '/finance/drop-readmission' }
    ]
  },
  {
    name: 'Payments',
    icon: <Wallet className="w-4 h-4" />,
    items: [
      { name: 'Collect Payment', path: '/finance/collect-payment' },
      { name: 'Payment Records', path: '/finance/payment-records' }
    ]
  },
  {
    name: 'Waiver & Scholarship',
    icon: <Award className="w-4 h-4" />,
    path: '/finance/waivers'
  },
  {
    name: 'Fines & Holds',
    icon: <AlertCircle className="w-4 h-4" />,
    path: '/finance/fines-holds'
  },
  {
    name: 'Bank Reconciliation',
    icon: <Building2 className="w-4 h-4" />,
    path: '/finance/bank-recon'
  },
  {
    name: 'Reports',
    icon: <BarChart3 className="w-4 h-4" />,
    path: '/finance/reports'
  },
  {
    name: 'Employees',
    icon: <Bell className="w-4 h-4" />,
    items: [
      { name: 'Employee Notices', path: '/finance/employee-notices' }
    ]
  },
  {
    name: 'Setup',
    icon: <Settings className="w-4 h-4" />,
    items: [
      { name: 'Cost Heads', path: '/finance/setup/cost-heads' },
      { name: 'Cost Packages', path: '/finance/setup/cost-packages' }
    ]
  }
]

export default function FinanceSidebar() {
  const location = useLocation()
  const [expandedSections, setExpandedSections] = useState<string[]>(['Dashboard', 'Billing', 'Payments', 'Setup'])

  const toggleSection = (sectionName: string) => {
    if (expandedSections.includes(sectionName)) {
      setExpandedSections(expandedSections.filter(s => s !== sectionName))
    } else {
      setExpandedSections([...expandedSections, sectionName])
    }
  }

  const isActive = (path: string) => location.pathname === path

  return (
    <aside className="w-64 bg-gradient-to-b from-deep-plum to-accent-purple h-screen overflow-y-auto shadow-lg">
      <div className="p-4 border-b border-white/20 mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
            <LayoutDashboard className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-white">Finance Portal</h2>
            <p className="text-xs text-white/80">Accounts</p>
          </div>
        </div>
      </div>
      <div className="p-4 space-y-1">
        {sections.map((section) => (
          <div key={section.name}>
            {section.path ? (
              <Link
                to={section.path}
                className={`w-full flex items-center justify-between p-2 rounded-md transition-all ${
                  isActive(section.path) 
                    ? 'bg-mint-green text-deep-plum shadow-md' 
                    : 'text-white/90 hover:bg-white/10 hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-2">
                  {section.icon}
                  <span className="font-medium text-sm">{section.name}</span>
                </div>
              </Link>
            ) : (
              <>
                <button
                  onClick={() => toggleSection(section.name)}
                  className="w-full flex items-center justify-between p-2 rounded-md transition-all text-white/90 hover:bg-white/10 hover:text-white"
                >
                  <div className="flex items-center space-x-2">
                    {section.icon}
                    <span className="font-medium text-sm">{section.name}</span>
                  </div>
                  {expandedSections.includes(section.name) ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>

                {section.items && expandedSections.includes(section.name) && (
                  <div className="ml-6 mt-1 space-y-1">
                    {section.items.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`block w-full text-left p-2 text-sm rounded-md transition-all ${
                          isActive(item.path)
                            ? 'bg-mint-green text-deep-plum font-medium shadow-md'
                            : 'text-white/80 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </aside>
  )
}
