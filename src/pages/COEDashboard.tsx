import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/RegistrationAuthContext'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { LogOut, User, Zap, Building2 } from 'lucide-react'
import COESidebar from '@/components/coe/COESidebar'
import COEDashboardView from '@/components/coe/COEDashboardView'
import EligibilityCheck from '@/components/coe/EligibilityCheck'
import SeatPlanGenerator from '@/components/coe/SeatPlanGenerator'
import MarkEntryStatus from '@/components/coe/MarkEntryStatus'
import AttendanceIncidents from '@/components/coe/AttendanceIncidents'
import PublishResults from '@/components/coe/PublishResults'
import TabulationBoard from '@/components/coe/TabulationBoard'
import CalendarPolicies from '@/components/coe/CalendarPolicies'
import SessionsTimetable from '@/components/coe/SessionsTimetable'
import CertificatesQueue from '@/components/coe/CertificatesQueue'
import ComplianceReports from '@/components/coe/ComplianceReports'

export default function COEDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [activeSection, setActiveSection] = useState('dashboard')

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <COEDashboardView />
      case 'Eligibility Check':
        return <EligibilityCheck />
      case 'Seat Plan':
        return <SeatPlanGenerator />
      case 'Mark Entry Status':
        return <MarkEntryStatus />
      case 'Attendance & Incidents':
        return <AttendanceIncidents />
      case 'Calendar & Policies':
        return <CalendarPolicies />
      case 'Sessions & Timetable':
        return <SessionsTimetable />
      case 'Invigilation Duty':
        return <PlaceholderView title="Invigilation Duty" description="Assign invigilators to exam sessions" />
      case 'Admit Cards':
        return <PlaceholderView title="Admit Cards" description="Generate and manage admit cards" />
      case 'Tabulation Board':
        return <TabulationBoard />
      case 'Publish Results':
        return <PublishResults />
      case 'Recheck / Appeals':
        return <PlaceholderView title="Recheck / Appeals" description="Handle recheck and appeal requests" />
      case 'Transcript / Certificate Queue':
      case 'Gazette Archive':
        return <CertificatesQueue />
      case 'Compliance Reports':
      case 'Analytics':
        return <ComplianceReports />
      default:
        return <COEDashboardView />
    }
  }

  return (
    <div className="min-h-screen bg-lavender-bg flex">
      <COESidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm border-b sticky top-0 z-10">
          <div className="px-6 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <div>
                  <h1 className="text-xl font-bold text-deep-plum">Controller of Examinations</h1>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className="bg-mint-green text-deep-plum">Fall 2025 · Published</Badge>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Building2 className="w-4 h-4 mr-2" />
                      Permanent Campus
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>Permanent Campus</DropdownMenuItem>
                    <DropdownMenuItem>Banani Campus</DropdownMenuItem>
                    <DropdownMenuItem>Mirpur Campus</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="nu-button-primary" size="sm">
                      <Zap className="w-4 h-4 mr-2" />
                      Fast Actions
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setActiveSection('Eligibility Check')}>
                      Run Eligibility
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setActiveSection('Publish Results')}>
                      Publish Result
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setActiveSection('Admit Cards')}>
                      Generate Admit Cards
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center space-x-2">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-deep-plum text-white text-sm">
                          {user?.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="text-left">
                        <p className="text-sm font-medium">{user?.name}</p>
                        <p className="text-xs text-gray-500">Exam Officer</p>
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <User className="w-4 h-4 mr-2" />
                      Profile Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
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

function PlaceholderView({ title, description }: { title: string; description: string }) {
  return (
    <div className="p-6">
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-deep-plum mb-2">{title}</h2>
          <p className="text-gray-600">{description}</p>
          <p className="text-sm text-gray-500 mt-4">This section is under development</p>
        </div>
      </div>
    </div>
  )
}
