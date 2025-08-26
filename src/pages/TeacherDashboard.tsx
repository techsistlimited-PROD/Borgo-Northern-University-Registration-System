import { useState } from 'react'
import { useAuth } from '@/contexts/RegistrationAuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import TeacherClassRoutine from '@/components/teacher/TeacherClassRoutine'
import AttendanceMarking from '@/components/teacher/AttendanceMarking'
import AttendanceReports from '@/components/teacher/AttendanceReports'
import {
  Calendar,
  Users,
  BookOpen,
  ClipboardCheck,
  BarChart3,
  GraduationCap,
  UserCheck,
  Bell,
  Clock,
  ChevronRight,
  Award
} from 'lucide-react'

// Teacher Dashboard Components
function TeacherSidebar({ activeTab, setActiveTab, onLogout }: { 
  activeTab: string; 
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
}) {
  const { user } = useAuth()

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { 
      id: 'routine', 
      label: 'My Classes', 
      icon: Calendar,
      subItems: [
        { id: 'class-routine', label: 'Class Routine' },
        { id: 'schedule-view', label: 'Schedule View' }
      ]
    },
    { 
      id: 'attendance', 
      label: 'Attendance', 
      icon: UserCheck,
      subItems: [
        { id: 'mark-attendance', label: 'Mark Attendance' },
        { id: 'attendance-reports', label: 'Reports' }
      ]
    },
    { 
      id: 'results', 
      label: 'Results & Grades', 
      icon: Award,
      subItems: [
        { id: 'continuous-assessment', label: 'Continuous Assessment' },
        { id: 'cumulative-score', label: 'Cumulative Score' },
        { id: 'midterm-marks', label: 'Midterm Marks' },
        { id: 'final-marks', label: 'Final Marks' }
      ]
    },
    { 
      id: 'students', 
      label: 'My Students', 
      icon: Users,
      subItems: [
        { id: 'advised-students', label: 'Advised Students' },
        { id: 'academic-history', label: 'Academic History' }
      ]
    }
  ]

  const [expandedItems, setExpandedItems] = useState<string[]>(['dashboard'])

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    )
  }

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-deep-plum to-accent-purple rounded-lg flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-deep-plum">Teacher Portal</h2>
            <p className="text-sm text-gray-500">{user?.name}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <div key={item.id}>
            <button
              onClick={() => {
                if (item.subItems) {
                  toggleExpanded(item.id)
                } else {
                  setActiveTab(item.id)
                }
              }}
              className={`w-full flex items-center justify-between px-3 py-2 text-left rounded-lg transition-colors ${
                activeTab === item.id
                  ? 'bg-deep-plum text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center space-x-3">
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </div>
              {item.subItems && (
                <ChevronRight 
                  className={`w-4 h-4 transition-transform ${
                    expandedItems.includes(item.id) ? 'rotate-90' : ''
                  }`} 
                />
              )}
            </button>
            
            {item.subItems && expandedItems.includes(item.id) && (
              <div className="ml-8 mt-2 space-y-1">
                {item.subItems.map((subItem) => (
                  <button
                    key={subItem.id}
                    onClick={() => setActiveTab(subItem.id)}
                    className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                      activeTab === subItem.id
                        ? 'bg-accent-purple text-white'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {subItem.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <button
          onClick={onLogout}
          className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  )
}

function TeacherDashboardOverview() {
  const { user } = useAuth()

  // Mock data for teacher dashboard
  const teacherStats = {
    totalClasses: 12,
    totalStudents: 156,
    pendingGrades: 8,
    attendanceToday: 3
  }

  const upcomingClasses = [
    { time: '08:00 AM', course: 'CSE401', section: 'A', room: 'Room 301', students: 42 },
    { time: '10:00 AM', course: 'CSE303', section: 'B', room: 'Room 205', students: 38 },
    { time: '02:00 PM', course: 'CSE401', section: 'C', room: 'Room 301', students: 40 }
  ]

  const pendingTasks = [
    { task: 'Grade CSE401 Midterm', deadline: '2 days', type: 'grading' },
    { task: 'Submit Attendance Report', deadline: '1 day', type: 'attendance' },
    { task: 'Approve Student Registration', deadline: '3 days', type: 'approval' },
    { task: 'Upload Course Material', deadline: '5 days', type: 'content' }
  ]

  const recentNotifications = [
    { message: 'New student registered for CSE401', time: '2 hours ago', type: 'info' },
    { message: 'Midterm schedule updated', time: '4 hours ago', type: 'update' },
    { message: 'Grade submission deadline approaching', time: '1 day ago', type: 'warning' }
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-deep-plum">Welcome back, {user?.name?.split(' ')[1] || user?.name}!</h1>
          <p className="text-gray-600 mt-1">Here's what's happening in your classes today</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Clock className="w-4 h-4" />
          <span>{new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</span>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Classes</p>
                <p className="text-2xl font-bold text-deep-plum">{teacherStats.totalClasses}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Students</p>
                <p className="text-2xl font-bold text-deep-plum">{teacherStats.totalStudents}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Users className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Grades</p>
                <p className="text-2xl font-bold text-deep-plum">{teacherStats.pendingGrades}</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <ClipboardCheck className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Classes Today</p>
                <p className="text-2xl font-bold text-deep-plum">{teacherStats.attendanceToday}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Schedule */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="w-5 h-5" />
              <span>Today's Schedule</span>
            </CardTitle>
            <CardDescription>Your upcoming classes for today</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingClasses.map((class_, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="text-sm font-medium text-deep-plum">{class_.time}</div>
                  <div>
                    <div className="font-medium">{class_.course} - Section {class_.section}</div>
                    <div className="text-sm text-gray-500">{class_.room} • {class_.students} students</div>
                  </div>
                </div>
                <Badge variant="outline">Upcoming</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Pending Tasks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ClipboardCheck className="w-5 h-5" />
              <span>Pending Tasks</span>
            </CardTitle>
            <CardDescription>Important tasks requiring your attention</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {pendingTasks.map((task, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium">{task.task}</div>
                  <div className="text-sm text-gray-500">Due in {task.deadline}</div>
                </div>
                <Badge 
                  variant={task.deadline.includes('1 day') ? 'destructive' : 'default'}
                >
                  {task.type}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Notifications */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bell className="w-5 h-5" />
              <span>Recent Notifications</span>
            </CardTitle>
            <CardDescription>Latest updates and announcements</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentNotifications.map((notification, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="p-2 bg-blue-100 rounded-full">
                  <Bell className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="font-medium">{notification.message}</div>
                  <div className="text-sm text-gray-500">{notification.time}</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function TeacherDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const { logout } = useAuth()

  const handleLogout = () => {
    logout()
    window.location.href = '/'
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <TeacherDashboardOverview />
      case 'class-routine':
        return <TeacherClassRoutine />
      case 'mark-attendance':
        return <AttendanceMarking />
      case 'attendance-reports':
        return <AttendanceReports />
      case 'continuous-assessment':
        return (
          <div className="text-center py-20">
            <ClipboardCheck className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-700 mb-2">Continuous Assessment</h2>
            <p className="text-gray-500">Coming soon - Manage class tests, quizzes, and assignments</p>
          </div>
        )
      case 'advised-students':
        return (
          <div className="text-center py-20">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-700 mb-2">Advised Students</h2>
            <p className="text-gray-500">Coming soon - Manage your advised students and course approvals</p>
          </div>
        )
      default:
        return (
          <div className="text-center py-20">
            <div className="text-2xl font-bold text-gray-700 mb-2">Feature Coming Soon</div>
            <p className="text-gray-500">This feature is under development</p>
          </div>
        )
    }
  }

  return (
    <div className="flex h-screen bg-lavender-bg">
      <TeacherSidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onLogout={handleLogout}
      />
      
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {renderContent()}
        </div>
      </div>
    </div>
  )
}
