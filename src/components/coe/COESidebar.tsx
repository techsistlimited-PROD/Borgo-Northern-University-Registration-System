import { useState } from 'react'
import { ChevronDown, ChevronRight, LayoutDashboard, Calendar, Clock, Users, ClipboardList, FileCheck, AlertCircle, FileText, Award, FileBarChart, BarChart3 } from 'lucide-react'

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
    name: 'Exam Governance',
    icon: <Calendar className="w-4 h-4" />,
    items: ['Calendar & Policies', 'Sessions & Timetable', 'Invigilation Duty']
  },
  {
    name: 'Admit & Seating',
    icon: <ClipboardList className="w-4 h-4" />,
    items: ['Eligibility Check', 'Seat Plan', 'Admit Cards']
  },
  {
    name: 'Exam Conduct',
    icon: <FileCheck className="w-4 h-4" />,
    items: ['Attendance & Incidents']
  },
  {
    name: 'Marks & Tabulation',
    icon: <FileText className="w-4 h-4" />,
    items: ['Mark Entry Status', 'Tabulation Board', 'Publish Results', 'Recheck / Appeals']
  },
  {
    name: 'Certificates & Documents',
    icon: <Award className="w-4 h-4" />,
    items: ['Transcript / Certificate Queue', 'Gazette Archive']
  },
  {
    name: 'Reports',
    icon: <FileBarChart className="w-4 h-4" />,
    items: ['Compliance Reports', 'Analytics']
  }
]

interface COESidebarProps {
  activeSection: string
  onSectionChange: (section: string) => void
}

export default function COESidebar({ activeSection, onSectionChange }: COESidebarProps) {
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
