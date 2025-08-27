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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
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
  const [selectedStudent, setSelectedStudent] = useState<any>(null)
  const [showModal, setShowModal] = useState(false)

  const students = [
    {
      id: '2021-1-60-001',
      name: 'John Doe',
      semester: 'Fall 2024',
      program: 'CSE',
      campus: 'Main Campus',
      email: 'john.doe@student.nu.edu.bd',
      phone: '+880 1712-345678',
      presentAddress: '123 Green Road, Dhaka-1205, Bangladesh',
      permanentAddress: '456 Village Road, Comilla-3500, Bangladesh',
      fatherName: 'Robert Doe',
      motherName: 'Mary Doe',
      bloodGroup: 'B+',
      admissionYear: '2021',
      currentSemester: '8th',
      cgpa: 3.75,
      completedCredits: 120,
      academicHistory: [
        { semester: '1st', sgpa: 3.5, courses: 6, credits: 18 },
        { semester: '2nd', sgpa: 3.8, courses: 6, credits: 18 },
        { semester: '3rd', sgpa: 3.6, courses: 5, credits: 15 },
        { semester: '4th', sgpa: 3.9, courses: 5, credits: 15 },
        { semester: '5th', sgpa: 3.7, courses: 5, credits: 15 },
        { semester: '6th', sgpa: 3.8, courses: 5, credits: 15 },
        { semester: '7th', sgpa: 3.7, courses: 4, credits: 12 },
        { semester: '8th', sgpa: 3.6, courses: 4, credits: 12 }
      ]
    },
    {
      id: '2021-1-60-002',
      name: 'Jane Smith',
      semester: 'Fall 2024',
      program: 'BBA',
      campus: 'Khulna Campus',
      email: 'jane.smith@student.nu.edu.bd',
      phone: '+880 1987-654321',
      presentAddress: '789 Road No. 5, Khulna-9000, Bangladesh',
      permanentAddress: '321 Main Street, Jessore-7400, Bangladesh',
      fatherName: 'James Smith',
      motherName: 'Jennifer Smith',
      bloodGroup: 'A+',
      admissionYear: '2021',
      currentSemester: '8th',
      cgpa: 3.85,
      completedCredits: 108,
      academicHistory: [
        { semester: '1st', sgpa: 3.8, courses: 5, credits: 15 },
        { semester: '2nd', sgpa: 3.9, courses: 5, credits: 15 },
        { semester: '3rd', sgpa: 3.7, courses: 5, credits: 15 },
        { semester: '4th', sgpa: 3.8, courses: 5, credits: 15 },
        { semester: '5th', sgpa: 3.9, courses: 5, credits: 15 },
        { semester: '6th', sgpa: 3.8, courses: 4, credits: 12 },
        { semester: '7th', sgpa: 3.9, courses: 4, credits: 12 },
        { semester: '8th', sgpa: 3.7, courses: 3, credits: 9 }
      ]
    },
    {
      id: '2021-1-60-003',
      name: 'Ahmed Rahman',
      semester: 'Fall 2024',
      program: 'EEE',
      campus: 'Main Campus',
      email: 'ahmed.rahman@student.nu.edu.bd',
      phone: '+880 1555-123456',
      presentAddress: '456 Gulshan Avenue, Dhaka-1212, Bangladesh',
      permanentAddress: '789 College Road, Sylhet-3100, Bangladesh',
      fatherName: 'Abdul Rahman',
      motherName: 'Fatima Rahman',
      bloodGroup: 'O+',
      admissionYear: '2021',
      currentSemester: '8th',
      cgpa: 3.65,
      completedCredits: 126,
      academicHistory: [
        { semester: '1st', sgpa: 3.4, courses: 6, credits: 18 },
        { semester: '2nd', sgpa: 3.6, courses: 6, credits: 18 },
        { semester: '3rd', sgpa: 3.5, courses: 5, credits: 15 },
        { semester: '4th', sgpa: 3.8, courses: 5, credits: 15 },
        { semester: '5th', sgpa: 3.7, courses: 5, credits: 15 },
        { semester: '6th', sgpa: 3.9, courses: 5, credits: 15 },
        { semester: '7th', sgpa: 3.6, courses: 4, credits: 12 },
        { semester: '8th', sgpa: 3.5, courses: 4, credits: 12 }
      ]
    }
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

  const handleViewStudent = (student: any) => {
    setSelectedStudent(student)
    setShowModal(true)
  }

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
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleViewStudent(student)}
                    >
                      <FileText className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Student Details Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              Student Details - {selectedStudent?.name} ({selectedStudent?.id})
            </DialogTitle>
          </DialogHeader>

          {selectedStudent && (
            <Tabs defaultValue="academic" className="mt-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="academic">Academic History</TabsTrigger>
                <TabsTrigger value="personal">Personal Information</TabsTrigger>
              </TabsList>

              <TabsContent value="academic" className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">{selectedStudent.cgpa}</p>
                    <p className="text-sm text-gray-600">CGPA</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">{selectedStudent.completedCredits}</p>
                    <p className="text-sm text-gray-600">Completed Credits</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <p className="text-2xl font-bold text-purple-600">{selectedStudent.currentSemester}</p>
                    <p className="text-sm text-gray-600">Current Semester</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {selectedStudent.academicHistory.map((record: any, index: number) => (
                    <Card key={index}>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">{record.semester} Semester</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>SGPA:</span>
                            <Badge variant="outline">{record.sgpa}</Badge>
                          </div>
                          <div className="flex justify-between">
                            <span>Courses:</span>
                            <span>{record.courses}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Credits:</span>
                            <span>{record.credits}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="personal" className="space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Basic Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <Label className="text-sm font-medium text-gray-500">Full Name</Label>
                        <p className="text-lg">{selectedStudent.name}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-500">Student ID</Label>
                        <p>{selectedStudent.id}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-500">Program</Label>
                        <p>{selectedStudent.program}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-500">Campus</Label>
                        <p>{selectedStudent.campus}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-500">Admission Year</Label>
                        <p>{selectedStudent.admissionYear}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-500">Blood Group</Label>
                        <p>{selectedStudent.bloodGroup}</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Contact Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <Label className="text-sm font-medium text-gray-500">Email</Label>
                        <p>{selectedStudent.email}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-500">Phone</Label>
                        <p>{selectedStudent.phone}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-500">Present Address</Label>
                        <p className="text-sm">{selectedStudent.presentAddress}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-500">Permanent Address</Label>
                        <p className="text-sm">{selectedStudent.permanentAddress}</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="md:col-span-2">
                    <CardHeader>
                      <CardTitle>Family Information</CardTitle>
                    </CardHeader>
                    <CardContent className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-500">Father's Name</Label>
                        <p>{selectedStudent.fatherName}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-500">Mother's Name</Label>
                        <p>{selectedStudent.motherName}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}


const Courses = () => {
  const [courses, setCourses] = useState([
    { id: 1, code: 'CSE101', title: 'Introduction to Programming', dept: 'CSE', program: 'CSE', type: 'Theory', credits: 3, ter: 'Yes' },
    { id: 2, code: 'CSE102', title: 'Programming Lab', dept: 'CSE', program: 'CSE', type: 'Lab', credits: 1, ter: 'No' },
    { id: 3, code: 'BBA101', title: 'Principles of Management', dept: 'Business', program: 'BBA', type: 'Theory', credits: 3, ter: 'Yes' },
    { id: 4, code: 'EEE101', title: 'Circuit Analysis', dept: 'EEE', program: 'EEE', type: 'Theory', credits: 3, ter: 'Yes' },
  ])
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingCourse, setEditingCourse] = useState<any>(null)
  const [newCourse, setNewCourse] = useState({
    code: '',
    title: '',
    dept: '',
    program: '',
    type: 'Theory',
    credits: 3,
    ter: 'Yes'
  })

  const handleAddCourse = () => {
    if (!newCourse.code || !newCourse.title || !newCourse.dept || !newCourse.program) {
      alert('Please fill all required fields')
      return
    }

    const courseToAdd = {
      id: courses.length + 1,
      ...newCourse
    }

    setCourses([...courses, courseToAdd])
    setNewCourse({
      code: '',
      title: '',
      dept: '',
      program: '',
      type: 'Theory',
      credits: 3,
      ter: 'Yes'
    })
    setShowAddModal(false)
    alert('Course added successfully!')
  }

  const handleEditCourse = (course: any) => {
    setEditingCourse(course)
    setNewCourse(course)
    setShowAddModal(true)
  }

  const handleUpdateCourse = () => {
    if (!newCourse.code || !newCourse.title || !newCourse.dept || !newCourse.program) {
      alert('Please fill all required fields')
      return
    }

    setCourses(courses.map(course =>
      course.id === editingCourse.id ? { ...newCourse, id: editingCourse.id } : course
    ))
    setEditingCourse(null)
    setNewCourse({
      code: '',
      title: '',
      dept: '',
      program: '',
      type: 'Theory',
      credits: 3,
      ter: 'Yes'
    })
    setShowAddModal(false)
    alert('Course updated successfully!')
  }

  const handleDeleteCourse = (courseId: number) => {
    if (confirm('Are you sure you want to delete this course?')) {
      setCourses(courses.filter(course => course.id !== courseId))
      alert('Course deleted successfully!')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-deep-plum">Course Management</h1>
        <Button
          className="nu-button-primary flex items-center space-x-2"
          onClick={() => setShowAddModal(true)}
        >
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
          <CardTitle>Course List ({courses.length})</CardTitle>
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
              {courses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell className="font-medium">{course.code}</TableCell>
                  <TableCell>{course.title}</TableCell>
                  <TableCell>{course.dept}</TableCell>
                  <TableCell>{course.program}</TableCell>
                  <TableCell>{course.type}</TableCell>
                  <TableCell>{course.credits}</TableCell>
                  <TableCell>{course.ter}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditCourse(course)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteCourse(course.id)}
                        className="text-red-600 hover:text-red-700"
                      >
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

      {/* Add/Edit Course Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingCourse ? 'Edit Course' : 'Add New Course'}
            </DialogTitle>
          </DialogHeader>

          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <div className="space-y-2">
              <Label>Course Code *</Label>
              <Input
                placeholder="e.g., CSE401"
                value={newCourse.code}
                onChange={(e) => setNewCourse({...newCourse, code: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label>Course Title *</Label>
              <Input
                placeholder="e.g., Software Engineering"
                value={newCourse.title}
                onChange={(e) => setNewCourse({...newCourse, title: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label>Department *</Label>
              <Select value={newCourse.dept} onValueChange={(value) => setNewCourse({...newCourse, dept: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CSE">Computer Science & Engineering</SelectItem>
                  <SelectItem value="EEE">Electrical & Electronic Engineering</SelectItem>
                  <SelectItem value="Business">Business Administration</SelectItem>
                  <SelectItem value="English">English Language & Literature</SelectItem>
                  <SelectItem value="Law">Law</SelectItem>
                  <SelectItem value="Pharmacy">Pharmacy</SelectItem>
                  <SelectItem value="Textile">Textile Engineering</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Program *</Label>
              <Select value={newCourse.program} onValueChange={(value) => setNewCourse({...newCourse, program: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select program" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CSE">CSE</SelectItem>
                  <SelectItem value="EEE">EEE</SelectItem>
                  <SelectItem value="BBA">BBA</SelectItem>
                  <SelectItem value="MBA">MBA</SelectItem>
                  <SelectItem value="LLB">LLB</SelectItem>
                  <SelectItem value="LLM">LLM</SelectItem>
                  <SelectItem value="B.Pharm">B.Pharm</SelectItem>
                  <SelectItem value="Textile">Textile Engineering</SelectItem>
                  <SelectItem value="English">English</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Course Type</Label>
              <Select value={newCourse.type} onValueChange={(value) => setNewCourse({...newCourse, type: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Theory">Theory</SelectItem>
                  <SelectItem value="Lab">Lab</SelectItem>
                  <SelectItem value="Practical">Practical</SelectItem>
                  <SelectItem value="Project">Project</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Credits</Label>
              <Select value={newCourse.credits.toString()} onValueChange={(value) => setNewCourse({...newCourse, credits: parseInt(value)})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                  <SelectItem value="4">4</SelectItem>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="6">6</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label>TER Required</Label>
              <Select value={newCourse.ter} onValueChange={(value) => setNewCourse({...newCourse, ter: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Yes">Yes</SelectItem>
                  <SelectItem value="No">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end space-x-2 mt-6">
            <Button variant="outline" onClick={() => {
              setShowAddModal(false)
              setEditingCourse(null)
              setNewCourse({
                code: '',
                title: '',
                dept: '',
                program: '',
                type: 'Theory',
                credits: 3,
                ter: 'Yes'
              })
            }}>
              Cancel
            </Button>
            <Button onClick={editingCourse ? handleUpdateCourse : handleAddCourse}>
              {editingCourse ? 'Update Course' : 'Add Course'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

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
