import { useState } from 'react'
import { useAuth } from '@/contexts/RegistrationAuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  GraduationCap, 
  BookOpen, 
  Calendar, 
  User, 
  Search, 
  LogOut, 
  Trophy,
  CreditCard,
  Clock,
  CheckCircle
} from 'lucide-react'

const Sidebar = ({ activeTab, setActiveTab, onLogout }: { 
  activeTab: string, 
  setActiveTab: (tab: string) => void,
  onLogout: () => void 
}) => {
  const menuItems = [
    { id: 'overview', label: 'Dashboard', icon: GraduationCap },
    { id: 'registration', label: 'Course Registration', icon: BookOpen },
    { id: 'history', label: 'Academic History', icon: Trophy },
    { id: 'routine', label: 'Class Routine', icon: Calendar },
    { id: 'search', label: 'Student Search', icon: Search },
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
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full text-left px-4 py-3 rounded-lg mb-2 flex items-center space-x-3 transition-colors ${
                activeTab === item.id 
                  ? 'bg-deep-plum text-white' 
                  : 'text-gray-700 hover:bg-lavender-bg'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          )
        })}
      </nav>
      
      <div className="absolute bottom-4 left-4 right-4">
        <Button 
          onClick={onLogout}
          variant="outline" 
          className="w-full flex items-center space-x-2"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </Button>
      </div>
    </div>
  )
}

const DashboardOverview = ({ user }: { user: any }) => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <h1 className="text-3xl font-bold text-deep-plum">Welcome back, {user.name}!</h1>
      <div className="text-right">
        <p className="text-sm text-gray-600">Student ID: {user.id}</p>
        <p className="text-sm text-gray-600">{user.program}</p>
      </div>
    </div>
    
    <div className="grid md:grid-cols-4 gap-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center space-x-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            <span>CGPA</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-deep-plum">3.75</p>
          <p className="text-sm text-gray-600">Out of 4.00</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center space-x-2">
            <CreditCard className="w-5 h-5 text-blue-500" />
            <span>Credits</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-deep-plum">96</p>
          <p className="text-sm text-gray-600">24 remaining</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-green-500" />
            <span>Semester</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg font-bold text-deep-plum">Fall 2024</p>
          <p className="text-sm text-gray-600">8th Semester</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-mint-green" />
            <span>Status</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg font-bold text-green-600">Active</p>
          <p className="text-sm text-gray-600">No holds</p>
        </CardContent>
      </Card>
    </div>
    
    <div className="grid md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Current Semester Courses</CardTitle>
          <CardDescription>Fall 2024 - Registered Courses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { code: 'CSE401', name: 'Software Engineering', credits: 3, instructor: 'Dr. Ahmed' },
              { code: 'CSE403', name: 'Database Systems', credits: 3, instructor: 'Prof. Rahman' },
              { code: 'CSE405', name: 'Computer Networks', credits: 3, instructor: 'Dr. Khan' },
              { code: 'MAT401', name: 'Numerical Analysis', credits: 3, instructor: 'Dr. Islam' },
            ].map((course, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-lavender-bg rounded-lg">
                <div>
                  <p className="font-semibold text-deep-plum">{course.code}: {course.name}</p>
                  <p className="text-sm text-gray-600">{course.instructor} • {course.credits} credits</p>
                </div>
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Academic Progress</CardTitle>
          <CardDescription>Completion Status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Program Completion</span>
                <span className="text-sm text-gray-600">80%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-deep-plum h-2 rounded-full" style={{ width: '80%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Core Courses</span>
                <span className="text-sm text-gray-600">18/20</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-accent-purple h-2 rounded-full" style={{ width: '90%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Electives</span>
                <span className="text-sm text-gray-600">6/8</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-mint-green h-2 rounded-full" style={{ width: '75%' }}></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
)

const CourseRegistration = () => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <h1 className="text-3xl font-bold text-deep-plum">Course Registration</h1>
      <div className="text-right">
        <p className="text-sm text-green-600 font-medium">Registration Open</p>
        <p className="text-sm text-gray-600">Ends: Dec 15, 2024</p>
      </div>
    </div>
    
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Available Courses - Spring 2025</CardTitle>
            <CardDescription>Select courses for next semester</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { code: 'CSE411', name: 'Artificial Intelligence', credits: 3, seats: '25/30', instructor: 'Dr. Hasan', time: 'ST 10:30-12:00' },
                { code: 'CSE413', name: 'Machine Learning', credits: 3, seats: '18/25', instructor: 'Prof. Ali', time: 'MW 2:00-3:30' },
                { code: 'CSE415', name: 'Web Development', credits: 3, seats: '20/30', instructor: 'Dr. Khan', time: 'ST 8:00-9:30' },
                { code: 'CSE417', name: 'Mobile App Development', credits: 3, seats: '15/20', instructor: 'Prof. Ahmed', time: 'MW 10:30-12:00' },
                { code: 'ENG401', name: 'Technical Writing', credits: 2, seats: '28/35', instructor: 'Dr. Rahman', time: 'T 3:30-5:00' },
              ].map((course, index) => (
                <div key={index} className="flex justify-between items-center p-4 border rounded-lg hover:bg-lavender-bg transition-colors">
                  <div className="flex-1">
                    <h3 className="font-semibold text-deep-plum">{course.code}: {course.name}</h3>
                    <p className="text-sm text-gray-600">{course.instructor} • {course.time}</p>
                    <p className="text-sm text-gray-500">{course.credits} credits • Seats: {course.seats}</p>
                  </div>
                  <Button className="nu-button-primary">Add Course</Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Selected Courses</CardTitle>
            <CardDescription>Spring 2025 Registration</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-semibold text-green-800">CSE411: Artificial Intelligence</h4>
                <p className="text-sm text-green-600">3 credits • Dr. Hasan</p>
              </div>
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-semibold text-green-800">CSE415: Web Development</h4>
                <p className="text-sm text-green-600">3 credits • Dr. Khan</p>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t">
              <div className="flex justify-between text-sm">
                <span>Total Credits:</span>
                <span className="font-semibold">6</span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span>Maximum Allowed:</span>
                <span>18</span>
              </div>
            </div>
            
            <div className="mt-4 space-y-2">
              <Button className="w-full nu-button-primary">Submit for Approval</Button>
              <p className="text-xs text-center text-gray-600">
                Advisor approval required within 72 hours
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
)

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    window.location.href = '/'
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <DashboardOverview user={user} />
      case 'registration':
        return <CourseRegistration />
      case 'history':
        return <div className="text-center py-12"><h2 className="text-2xl text-deep-plum">Academic History - Coming Soon</h2></div>
      case 'routine':
        return <div className="text-center py-12"><h2 className="text-2xl text-deep-plum">Class Routine - Coming Soon</h2></div>
      case 'search':
        return <div className="text-center py-12"><h2 className="text-2xl text-deep-plum">Student Search - Coming Soon</h2></div>
      default:
        return <DashboardOverview user={user} />
    }
  }

  return (
    <div className="flex h-screen bg-lavender-bg">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} />
      <main className="flex-1 overflow-auto p-6">
        {renderContent()}
      </main>
    </div>
  )
}
