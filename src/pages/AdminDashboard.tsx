import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/RegistrationAuthContext'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { LogOut, User, Search, Bell } from 'lucide-react'
import AdminSidebar from '@/components/admin/AdminSidebar'
import OrganizationSetup from '@/components/admin/OrganizationSetup'
import UserManagement from '@/components/admin/UserManagement'
import AccessControl from '@/components/admin/AccessControl'
import AccessLog from '@/components/admin/AccessLog'
import Programs from '@/components/admin/Programs'
import CampusProgramMapping from '@/components/admin/CampusProgramMapping'
import CourseManagement from '@/components/admin/CourseManagement'
import ExemptedCourseGroup from '@/components/admin/ExemptedCourseGroup'
import BuildingManagement from '@/components/admin/BuildingManagement'
import AcademicPolicies from '@/components/admin/AcademicPolicies'
import ActivityLog from '@/components/admin/ActivityLog'
import RolesPermissions from '@/components/admin/RolesPermissions'
import MasterData from '@/components/admin/MasterData'
import PasswordChangeLog from '@/components/admin/PasswordChangeLog'
import UserListByTask from '@/components/admin/UserListByTask'

export default function AdminDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [activeSection, setActiveSection] = useState('Organization Setup')

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'Organization Setup':
        return <OrganizationSetup />
      case 'User Management':
        return <UserManagement />
      case 'Access Control':
        return <AccessControl />
      case 'Access Log':
        return <AccessLog />
      case 'Programs':
        return <Programs />
      case 'Campus ↔ Program Mapping':
        return <CampusProgramMapping />
      case 'Course & Course Group':
        return <CourseManagement />
      case 'Exempted Course Group':
        return <ExemptedCourseGroup />
      case 'Building / Floor / Room':
        return <BuildingManagement />
      case 'Academic Policies':
        return <AcademicPolicies />
      case 'Activity Log':
        return <ActivityLog />
      case 'Roles & Permissions':
        return <RolesPermissions />
      case 'Master Data':
        return <MasterData />
      case 'Password Change Log':
        return <PasswordChangeLog />
      case 'User List by Task':
        return <UserListByTask />
      case 'Result Change Log':
      case 'Name Change Log':
        return <PlaceholderView title={activeSection} description="Audit and compliance tracking" />
      case 'Course Package Copy':
      case 'Academic Credit Limit':
        return <PlaceholderView title={activeSection} description="Academic setup and configuration" />
      case 'Master Data':
      case 'Location Directory':
      case 'External Institutes':
      case 'Currency & Rates':
      case 'Code Generator':
        return <PlaceholderView title={activeSection} description="Master data management" />
      case 'Roles & Permissions':
      case 'User List by Task':
        return <PlaceholderView title={activeSection} description="User and role management" />
      default:
        return <OrganizationSetup />
    }
  }

  return (
    <div className="min-h-screen bg-lavender-bg flex">
      <AdminSidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm border-b sticky top-0 z-10">
          <div className="px-6 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-deep-plum rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">NU</span>
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-deep-plum">University ERP</h1>
                    <p className="text-xs text-gray-600">Admin & Security Panel</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <select className="p-2 border rounded-md text-sm">
                  <option>Dhaka Campus</option>
                  <option>Permanent Campus</option>
                </select>
                
                <select className="p-2 border rounded-md text-sm">
                  <option>Fall 2025</option>
                  <option>Summer 2025</option>
                  <option>Spring 2025</option>
                </select>

                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Search student / ref / ID..." 
                    className="pl-10 pr-4 py-2 border rounded-md text-sm w-64"
                  />
                </div>

                <Button variant="ghost" size="sm">
                  <Bell className="w-5 h-5" />
                </Button>

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
                        <p className="text-xs text-gray-500">System Admin</p>
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
