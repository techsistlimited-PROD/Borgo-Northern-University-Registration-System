import { useState } from 'react'
import { ChevronDown, ChevronRight, LayoutDashboard, Calendar, ClipboardList, FileCheck, FileText, Award, FileBarChart, Users2, ShieldCheck } from 'lucide-react'

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
    name: 'Marks & Result',
    icon: <FileText className="w-4 h-4" />,
    items: [
      'Grading Policy',
      'Mark Distribution',
      'Excel Upload (Marks)',
      'Result Correction',
      'Publish Results',
      'Block/Unblock (Student-wise)',
      'Block/Unblock Settings',
      'Tabulation Board'
    ]
  },
  {
    name: 'Transcripts & Certificates',
    icon: <Award className="w-4 h-4" />,
    items: [
      'Transcript Manager',
      'Certificates Manager',
      'Document Printing'
    ]
  },
  {
    name: 'Academic Actions',
    icon: <Users2 className="w-4 h-4" />,
    items: [
      'Student Updates',
      'Admission Cancel / Re-Admission',
      'Credit Transfer',
      'Course Exemption',
      'CBE (Board)'
    ]
  },
  {
    name: 'Verification',
    icon: <ShieldCheck className="w-4 h-4" />,
    items: ['Student/Degree Verification']
  },
  {
    name: 'Reports',
    icon: <FileBarChart className="w-4 h-4" />,
    items: ['Compliance & UGC/BANBAIS', 'Analytics']
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
    <aside className="w-64 bg-gradient-to-b from-deep-plum to-accent-purple min-h-screen sticky top-0 overflow-y-auto shadow-lg">
      <div className="p-4 border-b border-white/20 mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
            <ClipboardList className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-white">COE Portal</h2>
            <p className="text-xs text-white/80">Examinations</p>
          </div>
        </div>
      </div>
      <div className="p-4 space-y-1">
        {sections.map((section) => (
          <div key={section.name}>
            <button
              onClick={() => {
                if (section.items) {
                  const isExp = expandedSections.includes(section.name)
                  toggleSection(section.name)
                  // When expanding, also navigate to the first child so content is visible
                  if (!isExp && section.items && section.items.length > 0) {
                    onSectionChange(section.items[0])
                  }
                } else if (section.path) {
                  onSectionChange(section.path)
                }
              }}
              className={`w-full flex items-center justify-between p-2 rounded-md transition-all ${
                activeSection === section.path ? 'bg-mint-green text-deep-plum shadow-md' : 'text-white/90 hover:bg-white/10 hover:text-white'
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
                    className={`w-full text-left p-2 text-sm rounded-md transition-all ${
                      activeSection === item ? 'bg-mint-green text-deep-plum font-medium shadow-md' : 'text-white/80 hover:bg-white/10 hover:text-white'
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
