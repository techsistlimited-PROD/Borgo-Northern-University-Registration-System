import { useState } from 'react'
import { ChevronDown, ChevronRight, Building2, Database, FileText, Shield } from 'lucide-react'

interface SidebarSection {
  name: string
  icon: React.ReactNode
  items: string[]
}

const sections: SidebarSection[] = [
  {
    name: 'University & Academic Setup',
    icon: <Building2 className="w-4 h-4" />,
    items: [
      'Organization Setup',
      'Programs',
      'Campus ↔ Program Mapping',
      'Course & Course Group',
      'Exempted Course Group',
      'Course Package Copy',
      'Building / Floor / Room',
      'Academic Policies',
      'Academic Credit Limit'
    ]
  },
  {
    name: 'Data Lookup',
    icon: <Database className="w-4 h-4" />,
    items: [
      'Master Data',
      'Location Directory',
      'External Institutes',
      'Currency & Rates',
      'Code Generator'
    ]
  },
  {
    name: 'Access & Change Log',
    icon: <FileText className="w-4 h-4" />,
    items: [
      'Access Log',
      'Activity Log',
      'Password Change Log',
      'Result Change Log',
      'Name Change Log'
    ]
  },
  {
    name: 'Setup & Common Data',
    icon: <Shield className="w-4 h-4" />,
    items: [
      'Access Control',
      'Roles & Permissions',
      'User Management',
      'User List by Task'
    ]
  }
]

interface AdminSidebarProps {
  activeSection: string
  onSectionChange: (section: string) => void
}

export default function AdminSidebar({ activeSection, onSectionChange }: AdminSidebarProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>(['University & Academic Setup'])

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
              onClick={() => toggleSection(section.name)}
              className="w-full flex items-center justify-between p-2 rounded-md hover:bg-gray-100 transition-colors text-gray-700"
            >
              <div className="flex items-center space-x-2">
                {section.icon}
                <span className="font-medium text-sm">{section.name}</span>
              </div>
              {expandedSections.includes(section.name) ? 
                <ChevronDown className="w-4 h-4" /> : 
                <ChevronRight className="w-4 h-4" />
              }
            </button>
            
            {expandedSections.includes(section.name) && (
              <div className="ml-6 mt-1 space-y-1">
                {section.items.map((item) => (
                  <button
                    key={item}
                    onClick={() => onSectionChange(item)}
                    className={`w-full text-left p-2 text-sm rounded-md hover:bg-gray-100 transition-colors ${
                      activeSection === item ? 'bg-mint-green/30 text-deep-plum font-medium border-l-2 border-deep-plum' : 'text-gray-600'
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
