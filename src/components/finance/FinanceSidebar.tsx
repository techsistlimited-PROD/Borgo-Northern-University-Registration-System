import { useState } from 'react'
import { ChevronDown, ChevronRight, LayoutDashboard, Users, FileText, Wallet, Award, AlertCircle, Building2, Settings } from 'lucide-react'

interface SidebarSection {
  name: string
  icon: React.ReactNode
  items?: string[]
  path?: string
}

const sections: SidebarSection[] = [
  {
    name: 'Dashboard',
    icon: <LayoutDashboard className="w-4 h-4" />,
    path: 'dashboard'
  },
  {
    name: 'Student Accounts',
    icon: <Users className="w-4 h-4" />,
    items: ['Search Student / Ledger']
  },
  {
    name: 'Billing',
    icon: <FileText className="w-4 h-4" />,
    items: ['Student Payables', 'Bulk Late Fee Assignment']
  },
  {
    name: 'Payments',
    icon: <Wallet className="w-4 h-4" />,
    items: ['Collect Payment', 'Payment Records']
  },
  {
    name: 'Waiver & Scholarship',
    icon: <Award className="w-4 h-4" />,
    path: 'Waiver & Scholarship'
  },
  {
    name: 'Fines & Holds',
    icon: <AlertCircle className="w-4 h-4" />,
    path: 'Fines & Holds'
  },
  {
    name: 'Bank Reconciliation',
    icon: <Building2 className="w-4 h-4" />,
    path: 'Bank Reconciliation'
  },
  {
    name: 'Setup',
    icon: <Settings className="w-4 h-4" />,
    items: ['Cost Heads', 'Cost Packages']
  }
]

interface FinanceSidebarProps {
  activeSection: string
  onSectionChange: (section: string) => void
}

export default function FinanceSidebar({ activeSection, onSectionChange }: FinanceSidebarProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>(['Dashboard'])

  const toggleSection = (sectionName: string) => {
    if (expandedSections.includes(sectionName)) {
      setExpandedSections(expandedSections.filter(s => s !== sectionName))
    } else {
      setExpandedSections([...expandedSections, sectionName])
    }
  }

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen overflow-y-auto">
      <div className="p-4 space-y-1">
        {sections.map((section) => (
          <div key={section.name}>
            <button
              onClick={() => {
                if (section.items) {
                  toggleSection(section.name)
                } else if (section.path) {
                  onSectionChange(section.path)
                }
              }}
              className={`w-full flex items-center justify-between p-2 rounded-md hover:bg-gray-100 transition-colors ${
                activeSection === section.path ? 'bg-deep-plum text-white hover:bg-deep-plum' : 'text-gray-700'
              }`}
            >
              <div className="flex items-center space-x-2">
                {section.icon}
                <span className="font-medium text-sm">{section.name}</span>
              </div>
              {section.items && (
                expandedSections.includes(section.name) ? 
                  <ChevronDown className="w-4 h-4" /> : 
                  <ChevronRight className="w-4 h-4" />
              )}
            </button>
            
            {section.items && expandedSections.includes(section.name) && (
              <div className="ml-6 mt-1 space-y-1">
                {section.items.map((item) => (
                  <button
                    key={item}
                    onClick={() => onSectionChange(item)}
                    className={`w-full text-left p-2 text-sm rounded-md hover:bg-gray-100 transition-colors ${
                      activeSection === item ? 'bg-mint-green/30 text-deep-plum font-medium' : 'text-gray-600'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </aside>
  )
}
