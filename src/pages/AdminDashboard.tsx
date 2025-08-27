import { useState } from 'react'
import { useAuth } from '@/contexts/RegistrationAuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Syllabuses, OfferCourses, SectionManagement } from '@/components/admin/CourseOfferingComponents'
import { ClassRoutineManagement } from '@/components/admin/ClassRoutineManagement'
import SemesterScheduleManagement from '@/components/admin/SemesterScheduleManagement'
import StudentSectionChange from '@/components/admin/StudentSectionChange'
import AdvisorAssignmentManagement from '@/components/admin/AdvisorAssignmentManagement'
import ComprehensiveReports from '@/components/admin/ComprehensiveReports'
import { TERReports } from '@/components/admin/TERReports'
import { StudentClearance } from '@/components/admin/StudentClearance'
import {
  Users,
  Calendar,
  BookOpen,
  Settings,
  LogOut,
  Search,
  Plus,
  Edit,
  Trash2,
  Filter,
  Download,
  Upload,
  Clock,
  Building,
  GraduationCap,
  FileText,
  Database,
  BarChart3,
  UserPlus,
  CalendarPlus,
  BookPlus,
  Home,
  Award
} from 'lucide-react'

const AdminSidebar = ({ activeTab, setActiveTab, onLogout }: { 
  activeTab: string, 
  setActiveTab: (tab: string) => void,
  onLogout: () => void 
}) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'students', label: 'Student Information', icon: Users },
    { id: 'semester-schedule', label: 'Create Semester Schedule', icon: CalendarPlus },
    {
      id: 'course-offering',
      label: 'Course Offering',
      icon: BookOpen,
      subItems: [
        { id: 'courses', label: 'Courses', icon: BookPlus },
        { id: 'syllabuses', label: 'Syllabuses', icon: FileText },
        { id: 'offer-courses', label: 'Offer Courses', icon: UserPlus },
        { id: 'section-management', label: 'Section Management', icon: Settings },
      ]
    },
    { id: 'class-routine', label: 'Central Class Routine & Room Management', icon: Building },
    { id: 'section-change', label: 'Change Students\' Section', icon: Users },
    { id: 'advisor-assignment', label: 'Student Advisor Assignment', icon: UserPlus },
    { id: 'ter-reports', label: 'TER Reports', icon: FileText },
    {
      id: 'student-clearance',
      label: 'Student Clearance',
      icon: GraduationCap,
      subItems: [
        { id: 'exam-clearance', label: 'Exam Clearance', icon: Calendar },
        { id: 'final-clearance', label: 'Final Clearance for Certificates', icon: Award },
      ]
    },
    { id: 'reports', label: 'Comprehensive Reports', icon: BarChart3 },
  ]

  return (
    <div className="w-64 bg-white h-screen shadow-lg border-r">
      <div className="p-6 border-b">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-deep-plum rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">NU</span>
          </div>
          <div>
            <h2 className="font-bold text-deep-plum">Admin Portal</h2>
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
              
              {item.subItems && (activeTab === item.id || item.subItems.some(sub => sub.id === activeTab)) && (
                <div className="ml-6 mb-2">
                  {item.subItems.map((subItem) => {
                    const SubIcon = subItem.icon
                    return (
                      <button
                        key={subItem.id}
                        onClick={() => setActiveTab(subItem.id)}
                        className={`w-full text-left px-3 py-2 rounded-lg mb-1 flex items-center space-x-2 transition-colors text-sm ${
                          activeTab === subItem.id
                            ? 'bg-accent-purple text-white' 
                            : 'text-gray-600 hover:bg-lavender-bg'
                        }`}
                      >
                        <SubIcon className="w-4 h-4" />
                        <span>{subItem.label}</span>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </nav>
      
      <div className="absolute bottom-4 left-4 right-4">
        <button
          onClick={onLogout}
          className="w-full text-left px-4 py-3 rounded-lg flex items-center space-x-3 text-red-600 hover:bg-red-50 transition-colors border border-red-200"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  )
}

const AdminDashboardOverview = ({ user }: { user: any }) => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <h1 className="text-3xl font-bold text-deep-plum">Admin Dashboard</h1>
      <div className="text-right">
        <p className="text-sm text-gray-600">Welcome, {user.name}</p>
        <p className="text-sm text-gray-600">System Administrator</p>
      </div>
    </div>
    
    <div className="grid md:grid-cols-4 gap-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center space-x-2">
            <Users className="w-5 h-5 text-blue-500" />
            <span>Total Students</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-deep-plum">1,247</p>
          <p className="text-sm text-gray-600">Active students</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-green-500" />
            <span>Active Courses</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-deep-plum">89</p>
          <p className="text-sm text-gray-600">This semester</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center space-x-2">
            <GraduationCap className="w-5 h-5 text-purple-500" />
            <span>Programs</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-deep-plum">13</p>
          <p className="text-sm text-gray-600">UG + PG programs</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center space-x-2">
            <Building className="w-5 h-5 text-orange-500" />
            <span>Campuses</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-deep-plum">2</p>
          <p className="text-sm text-gray-600">Main & Khulna</p>
        </CardContent>
      </Card>
    </div>
    
    <div className="grid md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Recent Registrations</CardTitle>
          <CardDescription>Latest student registrations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { id: '2024-1-60-001', name: 'Ahmed Hassan', program: 'CSE', time: '2 hours ago' },
              { id: '2024-1-60-002', name: 'Fatima Khan', program: 'BBA', time: '3 hours ago' },
              { id: '2024-1-60-003', name: 'Rahul Sharma', program: 'EEE', time: '5 hours ago' },
            ].map((student, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-lavender-bg rounded-lg">
                <div>
                  <p className="font-semibold text-deep-plum">{student.name}</p>
                  <p className="text-sm text-gray-600">{student.id} • {student.program}</p>
                </div>
                <span className="text-xs text-gray-500">{student.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>System Status</CardTitle>
          <CardDescription>Current system overview</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Registration Status</span>
              <span className="text-sm text-green-600 font-semibold">Open</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Current Semester</span>
              <span className="text-sm text-deep-plum font-semibold">Fall 2024</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Active Sessions</span>
              <span className="text-sm text-blue-600 font-semibold">456</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Database Status</span>
              <span className="text-sm text-green-600 font-semibold">Healthy</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
)

const StudentInformation = () => {
  const [searchId, setSearchId] = useState('')
  const [selectedProgram, setSelectedProgram] = useState('all')
  const [selectedCampus, setSelectedCampus] = useState('all')
  const [selectedSemester, setSelectedSemester] = useState('all')

  const students = [
    { id: '2021-1-60-001', name: 'John Doe', semester: 'Fall 2024', program: 'CSE', campus: 'Main Campus' },
    { id: '2021-1-60-002', name: 'Jane Smith', semester: 'Fall 2024', program: 'BBA', campus: 'Khulna Campus' },
    { id: '2021-1-60-003', name: 'Ahmed Rahman', semester: 'Fall 2024', program: 'EEE', campus: 'Main Campus' },
    { id: '2021-1-60-004', name: 'Fatima Khan', semester: 'Fall 2024', program: 'Textile Engineering', campus: 'Main Campus' },
    { id: '2021-1-60-005', name: 'Rahul Sharma', semester: 'Fall 2024', program: 'B. Pharm', campus: 'Khulna Campus' },
  ]

  const programs = [
    'CSE (Computer Science & Engineering)',
    'BBA (Bachelor of Business Administration)',
    'EEE (Electrical and Electronic Engineering)',
    'Textile Engineering',
    'B. Pharm (Bachelor of Pharmacy)',
    'BA (Hons) in ELL (English Language & Literature)',
    'LLB (Bachelor of Laws)',
    'MBA (Master of Business Administration)',
    'MBM (Master of Business Management)',
    'MAE (Master of Arts in English)',
    'MAELT (Master of Arts in English Language and Teaching)',
    'MPH (Master of Public Health)',
    'LLM (Master of Laws)'
  ]

  const filteredStudents = students.filter(student => {
    return (
      (!searchId || student.id.toLowerCase().includes(searchId.toLowerCase())) &&
      (!selectedProgram || selectedProgram === 'all' || student.program.includes(selectedProgram)) &&
      (!selectedCampus || selectedCampus === 'all' || student.campus === selectedCampus) &&
      (!selectedSemester || selectedSemester === 'all' || student.semester === selectedSemester)
    )
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-deep-plum">Student Information</h1>
        <Button className="nu-button-primary flex items-center space-x-2">
          <Download className="w-4 h-4" />
          <span>Export Data</span>
        </Button>
      </div>
      
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>Filter student information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search-id">Student ID Search</Label>
              <Input
                id="search-id"
                placeholder="Enter student ID"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="program">Program</Label>
              <Select value={selectedProgram} onValueChange={setSelectedProgram}>
                <SelectTrigger>
                  <SelectValue placeholder="Select program" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Programs</SelectItem>
                  {programs.map((program) => (
                    <SelectItem key={program} value={program.split(' ')[0]}>{program}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="campus">Campus</Label>
              <Select value={selectedCampus} onValueChange={setSelectedCampus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select campus" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Campuses</SelectItem>
                  <SelectItem value="Main Campus">Main Campus</SelectItem>
                  <SelectItem value="Khulna Campus">Khulna Campus</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="semester">Admission Semester</Label>
              <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                <SelectTrigger>
                  <SelectValue placeholder="Select semester" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Semesters</SelectItem>
                  <SelectItem value="Fall 2024">Fall 2024</SelectItem>
                  <SelectItem value="Spring 2024">Spring 2024</SelectItem>
                  <SelectItem value="Summer 2024">Summer 2024</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Student Table */}
      <Card>
        <CardHeader>
          <CardTitle>Student Records ({filteredStudents.length})</CardTitle>
          <CardDescription>Complete student information</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student ID</TableHead>
                <TableHead>Student Name</TableHead>
                <TableHead>Admission Semester</TableHead>
                <TableHead>Program</TableHead>
                <TableHead>Campus</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">{student.id}</TableCell>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.semester}</TableCell>
                  <TableCell>{student.program}</TableCell>
                  <TableCell>{student.campus}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <FileText className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}


const Courses = () => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <h1 className="text-3xl font-bold text-deep-plum">Course Management</h1>
      <Button className="nu-button-primary flex items-center space-x-2">
        <Plus className="w-4 h-4" />
        <span>Add New Course</span>
      </Button>
    </div>
    
    <Card>
      <CardHeader>
        <CardTitle>Course Filters</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-4 gap-4">
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Course Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="undergraduate">Undergraduate</SelectItem>
              <SelectItem value="postgraduate">Postgraduate</SelectItem>
            </SelectContent>
          </Select>
          
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Program" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cse">CSE</SelectItem>
              <SelectItem value="bba">BBA</SelectItem>
              <SelectItem value="eee">EEE</SelectItem>
            </SelectContent>
          </Select>
          
          <Input placeholder="Search by course code" />
          <Input placeholder="Search by course name" />
        </div>
      </CardContent>
    </Card>
    
    <Card>
      <CardHeader>
        <CardTitle>Course List</CardTitle>
        <CardDescription>Manage all university courses</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Course Code</TableHead>
              <TableHead>Course Title</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Program</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Credits</TableHead>
              <TableHead>TER Required</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[
              { code: 'CSE101', title: 'Introduction to Programming', dept: 'CSE', program: 'CSE', type: 'Theory', credits: 3, ter: 'Yes' },
              { code: 'CSE102', title: 'Programming Lab', dept: 'CSE', program: 'CSE', type: 'Lab', credits: 1, ter: 'No' },
              { code: 'BBA101', title: 'Principles of Management', dept: 'Business', program: 'BBA', type: 'Theory', credits: 3, ter: 'Yes' },
              { code: 'EEE101', title: 'Circuit Analysis', dept: 'EEE', program: 'EEE', type: 'Theory', credits: 3, ter: 'Yes' },
            ].map((course, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{course.code}</TableCell>
                <TableCell>{course.title}</TableCell>
                <TableCell>{course.dept}</TableCell>
                <TableCell>{course.program}</TableCell>
                <TableCell>{course.type}</TableCell>
                <TableCell>{course.credits}</TableCell>
                <TableCell>{course.ter}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  </div>
)

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    window.location.href = '/'
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <AdminDashboardOverview user={user} />
      case 'students':
        return <StudentInformation />
      case 'semester-schedule':
        return <SemesterScheduleManagement />
      case 'courses':
        return <Courses />
      case 'syllabuses':
        return <Syllabuses />
      case 'offer-courses':
        return <OfferCourses />
      case 'section-management':
        return <SectionManagement />
      case 'class-routine':
        return <ClassRoutineManagement />
      case 'section-change':
        return <StudentSectionChange />
      case 'advisor-assignment':
        return <AdvisorAssignmentManagement />
      case 'ter-reports':
        return <TERReports />
      case 'exam-clearance':
        return <StudentClearance clearanceType="exam" />
      case 'final-clearance':
        return <StudentClearance clearanceType="final" />
      case 'reports':
        return <ComprehensiveReports />
      default:
        return <AdminDashboardOverview user={user} />
    }
  }

  return (
    <div className="flex h-screen bg-lavender-bg">
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} />
      <main className="flex-1 overflow-auto p-6">
        {renderContent()}
      </main>
    </div>
  )
}
