import { useState } from 'react'
import { useAuth } from '@/contexts/RegistrationAuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { StudentProfileDropdown } from '@/components/student/StudentProfileDropdown'
import { StudentProfile, EditStudentProfile, ChangePassword } from '@/components/student/StudentProfile'
import { StudentDashboardOverview } from '@/components/student/StudentDashboardOverview'
import { WaiverInfo } from '@/components/student/WaiverInfo'
import { SemesterSchedule } from '@/components/student/SemesterSchedule'
import { SemesterRegistration } from '@/components/student/SemesterRegistration'
import { ClassRoutine } from '@/components/student/ClassRoutine'
import { PaymentInformation } from '@/components/student/PaymentInformation'
import { TERForm } from '@/components/student/TERForm'
import { ExamResults } from '@/components/student/ExamResults'
import {
  Home,
  Users,
  Calendar,
  BookOpen,
  LogOut,
  Search,
  Gift,
  ClipboardList,
  GraduationCap,
  CreditCard,
  Clock,
  FileText,
  Award
} from 'lucide-react'

const Sidebar = ({ activeTab, setActiveTab }: { 
  activeTab: string, 
  setActiveTab: (tab: string) => void
}) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'waiver-info', label: 'Waiver Info', icon: Gift },
    { id: 'semester-schedule', label: 'Semester Schedule', icon: Calendar },
    {
      id: 'semester-registration',
      label: 'Semester Registration',
      icon: ClipboardList,
      subItems: [
        { id: 'last-registration', label: 'Last Registration' },
        { id: 'new-registration', label: 'New Registration' },
        { id: 'all-registration', label: 'All Registration' }
      ]
    },
    { id: 'class-routine', label: 'Class Routine', icon: Clock },
    { id: 'ter-form', label: 'TER Fill Up', icon: FileText },
    {
      id: 'exam-results',
      label: 'Exam and Results',
      icon: Award,
      subItems: [
        { id: 'clearance-assessment', label: 'Clearance for Assessment' },
        { id: 'results', label: 'Results' }
      ]
    },
    {
      id: 'payment-info',
      label: 'Payment Information',
      icon: CreditCard,
      subItems: [
        { id: 'payable-list', label: 'Payable List' },
        { id: 'payment-history', label: 'Payment History' },
        { id: 'financial-summary', label: 'Financial Summary' },
        { id: 'detailed-report', label: 'Detailed Report' }
      ]
    },
  ]

  return (
    <div className="w-64 bg-white h-screen shadow-lg border-r">
      <div className="p-6 border-b">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-deep-plum rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">NU</span>
          </div>
          <div>
            <h2 className="font-bold text-deep-plum">Student Portal</h2>
            <p className="text-xs text-gray-500">Northern University</p>
          </div>
        </div>
      </div>
      
      <nav className="p-4">
        {menuItems.map((item) => {
          const Icon = item.icon
          return (
            <div key={item.id}>
              <button
                onClick={() => setActiveTab(item.id)}
                className={`w-full text-left px-4 py-3 rounded-lg mb-2 flex items-center space-x-3 transition-colors ${
                  activeTab === item.id || (item.subItems && item.subItems.some(sub => sub.id === activeTab))
                    ? 'bg-deep-plum text-white' 
                    : 'text-gray-700 hover:bg-lavender-bg'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
              
              {/* Submenus for components with tabs */}
              {item.subItems && (activeTab === item.id || item.subItems.some(sub => sub.id === activeTab)) && (
                <div className="ml-6 mb-2 space-y-1">
                  {item.subItems.map((subItem) => (
                    <button
                      key={subItem.id}
                      onClick={() => setActiveTab(subItem.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        activeTab === subItem.id
                          ? 'bg-accent-purple text-white'
                          : 'text-gray-600 hover:bg-lavender-bg'
                      }`}
                    >
                      {subItem.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </nav>
    </div>
  )
}

// Student holds and financial information - initial state
const initialStudentHolds = {
  hasFinancialHold: true,
  hasConductHold: false,
  hasAcademicHold: false,
  financialDetails: {
    totalDue: 45000,
    semesterFee: 35000,
    libraryFine: 500,
    hostleDue: 9500,
    lastPaymentDate: '2024-08-15',
    nextInstallmentDue: '2024-12-15'
  },
  conductDetails: null,
  academicDetails: null
}

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [showProfile, setShowProfile] = useState(false)
  const [showEditProfile, setShowEditProfile] = useState(false)
  const [showChangePassword, setShowChangePassword] = useState(false)
  const [studentHolds, setStudentHolds] = useState(initialStudentHolds)
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    window.location.href = '/'
  }

  const handleViewProfile = () => {
    setShowProfile(true)
  }

  const handleEditProfile = () => {
    setShowEditProfile(true)
  }

  const handleChangePassword = () => {
    setShowChangePassword(true)
  }

  const handlePaymentUpdate = (totalOutstanding: number) => {
    // Clear financial hold if total outstanding is 0 or less
    if (totalOutstanding <= 0) {
      setStudentHolds(prev => ({
        ...prev,
        hasFinancialHold: false,
        financialDetails: {
          ...prev.financialDetails,
          totalDue: 0
        }
      }))
    } else {
      setStudentHolds(prev => ({
        ...prev,
        financialDetails: {
          ...prev.financialDetails,
          totalDue: totalOutstanding
        }
      }))
    }
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <StudentDashboardOverview user={user} />
      case 'waiver-info':
        return <WaiverInfo />
      case 'semester-schedule':
        return <SemesterSchedule />

      // Semester Registration cases
      case 'semester-registration':
      case 'last-registration':
        return <SemesterRegistration activeTab="last" studentHolds={studentHolds} />
      case 'new-registration':
        return <SemesterRegistration activeTab="new" studentHolds={studentHolds} />
      case 'all-registration':
        return <SemesterRegistration activeTab="all" studentHolds={studentHolds} />

      case 'class-routine':
        return <ClassRoutine />
      case 'ter-form':
        return <TERForm />

      // Exam Results cases
      case 'exam-results':
      case 'clearance-assessment':
        return <ExamResults activeTab="clearance" />
      case 'results':
        return <ExamResults activeTab="results" />

      // Payment Information cases
      case 'payment-info':
      case 'payable-list':
        return <PaymentInformation activeTab="payable" onPaymentUpdate={handlePaymentUpdate} onNavigateToRegistration={() => setActiveTab('new-registration')} />
      case 'payment-history':
        return <PaymentInformation activeTab="history" onPaymentUpdate={handlePaymentUpdate} onNavigateToRegistration={() => setActiveTab('new-registration')} />
      case 'financial-summary':
        return <PaymentInformation activeTab="summary" onPaymentUpdate={handlePaymentUpdate} onNavigateToRegistration={() => setActiveTab('new-registration')} />
      case 'detailed-report':
        return <PaymentInformation activeTab="detailed" onPaymentUpdate={handlePaymentUpdate} onNavigateToRegistration={() => setActiveTab('new-registration')} />

      default:
        return <StudentDashboardOverview user={user} />
    }
  }

  return (
    <div className="flex h-screen bg-lavender-bg">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="flex-1 flex flex-col">
        {/* Top Header with Profile Dropdown */}
        <header className="bg-white border-b px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-semibold text-deep-plum">
              {activeTab === 'dashboard' && 'Dashboard'}
              {activeTab === 'waiver-info' && 'Waiver Information'}
              {activeTab === 'semester-schedule' && 'Semester Schedule'}
              {(activeTab === 'semester-registration' || activeTab === 'last-registration' || activeTab === 'new-registration' || activeTab === 'all-registration') && 'Semester Registration'}
              {activeTab === 'class-routine' && 'Class Routine'}
              {activeTab === 'ter-form' && 'TER Fill Up'}
              {(activeTab === 'exam-results' || activeTab === 'clearance-assessment' || activeTab === 'results') && 'Exam and Results'}
              {(activeTab === 'payment-info' || activeTab === 'payable-list' || activeTab === 'payment-history' || activeTab === 'financial-summary' || activeTab === 'detailed-report') && 'Payment Information'}
            </h1>
            <p className="text-sm text-gray-600">Welcome to Northern University Student Portal</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right mr-4">
              <p className="text-sm font-medium text-gray-900">{user?.name}</p>
              <p className="text-xs text-gray-600">Student ID: {user?.id}</p>
            </div>
            <StudentProfileDropdown
              onViewProfile={handleViewProfile}
              onEditProfile={handleEditProfile}
              onChangePassword={handleChangePassword}
            />
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto p-6">
          {renderContent()}
        </main>
      </div>

      {/* Profile Modals */}
      {showProfile && (
        <StudentProfile
          onClose={() => setShowProfile(false)}
          onEdit={() => {
            setShowProfile(false)
            setShowEditProfile(true)
          }}
        />
      )}

      {showEditProfile && (
        <EditStudentProfile
          onClose={() => setShowEditProfile(false)}
          onSave={() => setShowEditProfile(false)}
        />
      )}

      {showChangePassword && (
        <ChangePassword
          onClose={() => setShowChangePassword(false)}
          onSave={() => setShowChangePassword(false)}
        />
      )}
    </div>
  )
}
