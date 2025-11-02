import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/RegistrationAuthContext'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { LogOut, User } from 'lucide-react'
import FinanceSidebar from '@/components/finance/FinanceSidebar'
import GlobalFilters from '@/components/finance/GlobalFilters'
import FinanceDashboard from '@/components/finance/FinanceDashboard'
import StudentLedger from '@/components/finance/StudentLedger'
import PaymentCollection from '@/components/finance/PaymentCollection'
import FinesHolds from '@/components/finance/FinesHolds'

export default function FinanceDashboardPage() {
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
        return <FinanceDashboard />
      case 'Search Student / Ledger':
        return <StudentLedger />
      case 'Student Payables':
      case 'Bulk Late Fee Assignment':
        return <PlaceholderView title={activeSection} description="Billing and payables management" />
      case 'Collect Payment':
      case 'Payment Records':
        return <PaymentCollection />
      case 'Waiver & Scholarship':
        return <PlaceholderView title="Waiver & Scholarship" description="Manage student waivers and scholarships" />
      case 'Fines & Holds':
        return <FinesHolds />
      case 'Bank Reconciliation':
        return <PlaceholderView title="Bank Reconciliation" description="Bank statement reconciliation" />
      case 'Cost Heads':
      case 'Cost Packages':
        return <PlaceholderView title={activeSection} description="Finance setup and configuration" />
      default:
        return <FinanceDashboard />
    }
  }

  return (
    <div className="min-h-screen bg-lavender-bg flex">
      <FinanceSidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm border-b sticky top-0 z-10">
          <div className="px-6 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <div>
                  <h1 className="text-xl font-bold text-deep-plum">Finance & Accounts</h1>
                  <p className="text-xs text-gray-600">Student Finance Management Portal</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
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
                        <p className="text-xs text-gray-500">Finance Officer</p>
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
          <GlobalFilters />
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
