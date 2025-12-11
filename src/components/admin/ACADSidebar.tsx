import { BookOpen, Users, Calendar, FileText, ClipboardCheck, GraduationCap, UserCheck, LayoutGrid } from 'lucide-react'

interface ACADSidebarProps {
  activeSection: string
  onSectionChange: (section: string) => void
}

export default function ACADSidebar({ activeSection, onSectionChange }: ACADSidebarProps) {
  const sections = [
    {
      category: 'Course Management',
      icon: BookOpen,
      items: [
        'Course Offering',
        'Section Management',
        'Faculty Assignment'
      ]
    },
    {
      category: 'Student Services',
      icon: Users,
      items: [
        'Add/Drop Management',
        'Section Change',
        'Semester Drop',
        'Student Clearance',
        'Advisor Assignment'
      ]
    },
    {
      category: 'Scheduling',
      icon: Calendar,
      items: [
        'Class Routine',
        'Semester Schedule',
        'Exam Schedule'
      ]
    },
    {
      category: 'Academic Reports',
      icon: FileText,
      items: [
        'Results & Grades',
        'TER Reports',
        'Comprehensive Reports',
        'Attendance Reports',
        'Admit Card Reports'
      ]
    }
  ]

  return (
    <div className="w-64 bg-gradient-to-b from-deep-plum to-accent-purple h-screen overflow-y-auto shadow-lg">
      <div className="p-4 border-b border-white/20">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-white">ACAD Portal</h2>
            <p className="text-xs text-white/80">Academic Affairs</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {sections.map((section) => (
          <div key={section.category}>
            <div className="flex items-center space-x-2 mb-2">
              <section.icon className="w-4 h-4 text-mint-green" />
              <h3 className="text-sm font-semibold text-white">{section.category}</h3>
            </div>
            <div className="space-y-1">
              {section.items.map((item) => (
                <button
                  key={item}
                  onClick={() => onSectionChange(item)}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm transition-all ${
                    activeSection === item
                      ? 'bg-mint-green text-deep-plum font-medium shadow-md'
                      : 'text-white/90 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
