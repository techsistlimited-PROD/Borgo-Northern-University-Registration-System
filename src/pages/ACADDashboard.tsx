import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/RegistrationAuthContext'
import ACADSidebar from '@/components/admin/ACADSidebar'
import { ACADProfileDropdown } from '@/components/admin/AdminProfileDropdown'
import { OfferCourses } from '@/components/admin/CourseOfferingComponents'
import { AddDropManagement } from '@/components/admin/AddDropManagement'
import StudentSectionChange from '@/components/admin/StudentSectionChange'
import { SemesterDropManagement } from '@/components/admin/SemesterDropManagement'
import { StudentClearance } from '@/components/admin/StudentClearance'
import AdvisorAssignmentManagement from '@/components/admin/AdvisorAssignmentManagement'
import { ClassRoutineManagement } from '@/components/admin/ClassRoutineManagement'
import SemesterScheduleManagement from '@/components/admin/SemesterScheduleManagement'
import ResultsGrades from '@/components/admin/ResultsGrades'
import { TERReports } from '@/components/admin/TERReports'
import ComprehensiveReports from '@/components/admin/ComprehensiveReports'
import AttendanceReports from '@/components/admin/AttendanceReports'
import { AdmitCardReport } from '@/components/admin/AdmitCardReport'
import SectionManagement from '@/components/admin/SectionManagement'
import FacultyAssignment from '@/components/admin/FacultyAssignment'
import ExamScheduleManagement from '@/components/admin/ExamScheduleManagement'
import { Card } from '@/components/ui/card'

export default function ACADDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [activeSection, setActiveSection] = useState('Course Offering')
  const [showProfileDialog, setShowProfileDialog] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/acad/login')
  }

  const PlaceholderView = ({ title, description }: { title: string; description: string }) => (
    <div className="p-6">
      <Card className="p-12 text-center">
        <h2 className="text-xl font-semibold text-deep-plum mb-2">{title}</h2>
        <p className="text-gray-500">{description}</p>
      </Card>
    </div>
  )

  const renderContent = () => {
    switch (activeSection) {
      case 'Course Offering':
        return <OfferCourses />
      case 'Add/Drop Management':
        return <AddDropManagement />
      case 'Section Change':
        return <StudentSectionChange />
      case 'Semester Drop':
        return <SemesterDropManagement />
      case 'Student Clearance':
        return <StudentClearance clearanceType="full" />
      case 'Advisor Assignment':
        return <AdvisorAssignmentManagement />
      case 'Class Routine':
        return <ClassRoutineManagement />
      case 'Semester Schedule':
        return <SemesterScheduleManagement />
      case 'Results & Grades':
        return <ResultsGrades />
      case 'TER Reports':
        return <TERReports />
      case 'Comprehensive Reports':
        return <ComprehensiveReports />
      case 'Attendance Reports':
        return <AttendanceReports />
      case 'Admit Card Reports':
        return <AdmitCardReport onClose={() => {}} />
      case 'Section Management':
        return <SectionManagement />
      case 'Faculty Assignment':
        return <FacultyAssignment />
      case 'Exam Schedule':
        return <ExamScheduleManagement />
      default:
        return <PlaceholderView title="Welcome" description="Select a section from the sidebar" />
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <ACADSidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-deep-plum">Academic Affairs Portal</h1>
              <p className="text-sm text-gray-500">Manage courses, schedules, and student services</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user?.name || 'ACAD Officer'}</p>
                <p className="text-xs text-gray-500">{user?.email || 'acad@nu.edu.bd'}</p>
              </div>
              <ACADProfileDropdown
                onViewProfile={() => setShowProfileDialog(true)}
                onEditProfile={() => setShowProfileDialog(true)}
                onChangePassword={() => setShowProfileDialog(true)}
              />
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  )
}
