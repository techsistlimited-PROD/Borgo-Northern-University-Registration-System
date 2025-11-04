import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/RegistrationAuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Users, UserX, UserCheck, LogOut, Building2, Calendar } from 'lucide-react'
import HRMSidebar from '@/components/hrm/HRMSidebar'
import HRMDashboardView from '@/components/hrm/HRMDashboardView'
import HRMEmployeeList from '@/components/hrm/HRMEmployeeList'
import HRMDocuments from '@/components/hrm/HRMDocuments'
import HRMHistory from '@/components/hrm/HRMHistory'
import RecruitmentPages from '@/components/hrm/recruitment/RecruitmentPages'
import { HRM_STATS } from '@/lib/hrmStatic'

type ActiveView = 'dashboard' | 'employees' | 'documents' | 'history' | 'recruitment' | 'other'
type RecruitmentView = 'vacancies' | 'candidates' | 'shortlisting' | 'interviews' | 'offers' | 'onboarding'

export default function HRMDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [activeView, setActiveView] = useState<ActiveView>('dashboard')
  const [recruitmentView, setRecruitmentView] = useState<RecruitmentView>('vacancies')
  const [activePath, setActivePath] = useState('/hrm/dashboard')

  const handleNavigation = (path: string) => {
    setActivePath(path)

    if (path === '/hrm/dashboard') setActiveView('dashboard')
    else if (path === '/hrm/employees') setActiveView('employees')
    else if (path === '/hrm/employees/documents') setActiveView('documents')
    else if (path === '/hrm/employees/history') setActiveView('history')
    else if (path.startsWith('/hrm/recruitment')) {
      setActiveView('recruitment')
      if (path.includes('/vacancies')) setRecruitmentView('vacancies')
      else if (path.includes('/candidates')) setRecruitmentView('candidates')
      else if (path.includes('/shortlisting')) setRecruitmentView('shortlisting')
      else if (path.includes('/interviews')) setRecruitmentView('interviews')
      else if (path.includes('/offers')) setRecruitmentView('offers')
      else if (path.includes('/onboarding')) setRecruitmentView('onboarding')
      else setRecruitmentView('vacancies')
    }
    else setActiveView('other')
  }

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return <HRMDashboardView />
      case 'employees':
        return <HRMEmployeeList />
      case 'documents':
        return <HRMDocuments />
      case 'history':
        return <HRMHistory />
      case 'recruitment':
        return <RecruitmentPages view={recruitmentView} />
      case 'other':
        return (
          <div className="p-8 text-center">
            <Building2 className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Under Development</h3>
            <p className="text-gray-600">This module is currently under development.</p>
          </div>
        )
      default:
        return <HRMDashboardView />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg sticky top-0 z-50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Users className="w-8 h-8" />
              <div>
                <h1 className="text-xl font-bold">Human Resource Management</h1>
                <p className="text-sm text-white/80">Employee Information & Administration</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Stats Quick View */}
              <div className="hidden lg:flex items-center space-x-6 text-sm">
                <div className="flex items-center space-x-2">
                  <UserCheck className="w-4 h-4" />
                  <span>Active: <strong>{HRM_STATS.activeStaff}</strong></span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>On Leave: <strong>{HRM_STATS.onLeave}</strong></span>
                </div>
                <div className="flex items-center space-x-2">
                  <UserX className="w-4 h-4" />
                  <span>Resigned: <strong>{HRM_STATS.resigned}</strong></span>
                </div>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-white hover:bg-white/10">
                    <Avatar className="w-8 h-8 mr-2">
                      <AvatarFallback className="bg-white text-blue-600">
                        {user?.name.split(' ').map(n => n[0]).join('').substring(0, 2) || 'HR'}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden md:inline">{user?.name || 'HR Officer'}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>HR Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <HRMSidebar activePath={activePath} onNavigate={handleNavigation} />

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  )
}
