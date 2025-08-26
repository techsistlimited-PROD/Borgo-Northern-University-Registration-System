import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Users,
  Search,
  Phone,
  Mail,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  BookOpen,
  GraduationCap,
  AlertTriangle,
  Calendar,
  Award,
  TrendingUp,
  FileText,
  Filter,
  X
} from 'lucide-react'

interface Student {
  id: string
  studentId: string
  name: string
  email: string
  phone: string
  program: string
  campus: string
  admissionSemester: string
  currentSemester: string
  cgpa: number
  totalCredits: number
  registrationStatus: 'pending' | 'approved' | 'hold'
  lastRegistrationDate: string
  teacherNote?: string
}

interface RegisteredCourse {
  id: string
  courseCode: string
  courseName: string
  credits: number
  section: string
  instructor: string
  schedule: string
  status: 'registered' | 'approved' | 'dropped'
}

interface SemesterResult {
  semester: string
  year: string
  courses: {
    courseCode: string
    courseName: string
    credits: number
    grade: string
    points: number
  }[]
  semesterGPA: number
  totalCredits: number
}

// Mock data with enhanced information
const advisedStudents: Student[] = [
  {
    id: '1',
    studentId: '2021-1-60-001',
    name: 'Ahmed Rahman',
    email: 'ahmed.rahman@student.nu.edu.bd',
    phone: '+880 1712-345678',
    program: 'Computer Science & Engineering',
    campus: 'Main Campus',
    admissionSemester: 'Spring 2021',
    currentSemester: 'Fall 2024',
    cgpa: 3.75,
    totalCredits: 96,
    registrationStatus: 'pending',
    lastRegistrationDate: '2024-01-15',
    teacherNote: 'Strong performance in core subjects'
  },
  {
    id: '2',
    studentId: '2021-1-60-002',
    name: 'Fatima Khan',
    email: 'fatima.khan@student.nu.edu.bd',
    phone: '+880 1789-123456',
    program: 'Computer Science & Engineering',
    campus: 'Main Campus',
    admissionSemester: 'Spring 2021',
    currentSemester: 'Fall 2024',
    cgpa: 3.92,
    totalCredits: 102,
    registrationStatus: 'approved',
    lastRegistrationDate: '2024-01-10',
    teacherNote: 'Excellent academic performance, recommended for advanced courses'
  },
  {
    id: '3',
    studentId: '2021-1-60-003',
    name: 'Mohammad Ali',
    email: 'mohammad.ali@student.nu.edu.bd',
    phone: '+880 1987-654321',
    program: 'Business Administration',
    campus: 'City Campus',
    admissionSemester: 'Fall 2021',
    currentSemester: 'Fall 2024',
    cgpa: 3.25,
    totalCredits: 84,
    registrationStatus: 'hold',
    lastRegistrationDate: '2024-01-12',
    teacherNote: 'Needs to improve performance in mathematics courses'
  },
  {
    id: '4',
    studentId: '2021-1-60-004',
    name: 'Ayesha Ahmed',
    email: 'ayesha.ahmed@student.nu.edu.bd',
    phone: '+880 1876-543210',
    program: 'Computer Science & Engineering',
    campus: 'Main Campus',
    admissionSemester: 'Summer 2021',
    currentSemester: 'Fall 2024',
    cgpa: 3.68,
    totalCredits: 90,
    registrationStatus: 'pending',
    lastRegistrationDate: '2024-01-14'
  },
  {
    id: '5',
    studentId: '2022-1-60-005',
    name: 'Rashid Hasan',
    email: 'rashid.hasan@student.nu.edu.bd',
    phone: '+880 1567-891234',
    program: 'Electrical & Electronic Engineering',
    campus: 'Tech Campus',
    admissionSemester: 'Spring 2022',
    currentSemester: 'Fall 2024',
    cgpa: 3.45,
    totalCredits: 72,
    registrationStatus: 'approved',
    lastRegistrationDate: '2024-01-11'
  },
  {
    id: '6',
    studentId: '2022-1-60-006',
    name: 'Nusrat Jahan',
    email: 'nusrat.jahan@student.nu.edu.bd',
    phone: '+880 1456-789123',
    program: 'Business Administration',
    campus: 'City Campus',
    admissionSemester: 'Fall 2022',
    currentSemester: 'Fall 2024',
    cgpa: 3.89,
    totalCredits: 78,
    registrationStatus: 'pending',
    lastRegistrationDate: '2024-01-13'
  }
]

const mockRegisteredCourses: Record<string, RegisteredCourse[]> = {
  '1': [
    { id: '1', courseCode: 'CSE401', courseName: 'Database Management Systems', credits: 3, section: 'A', instructor: 'Dr. Abdul Rahman', schedule: 'Sun, Tue - 08:00-09:30', status: 'registered' },
    { id: '2', courseCode: 'CSE403', courseName: 'Software Engineering', credits: 3, section: 'B', instructor: 'Dr. Sarah Khan', schedule: 'Mon, Wed - 10:00-11:30', status: 'registered' },
    { id: '3', courseCode: 'CSE405', courseName: 'Computer Networks', credits: 3, section: 'A', instructor: 'Dr. Rahman Ali', schedule: 'Thu, Fri - 14:00-15:30', status: 'registered' },
    { id: '4', courseCode: 'ENG102', courseName: 'Technical Writing', credits: 2, section: 'C', instructor: 'Prof. Lisa Johnson', schedule: 'Wed - 16:00-17:30', status: 'registered' }
  ],
  '2': [
    { id: '5', courseCode: 'CSE401', courseName: 'Database Management Systems', credits: 3, section: 'B', instructor: 'Dr. Abdul Rahman', schedule: 'Mon, Wed - 08:00-09:30', status: 'approved' },
    { id: '6', courseCode: 'CSE407', courseName: 'Artificial Intelligence', credits: 3, section: 'A', instructor: 'Dr. AI Expert', schedule: 'Sun, Tue - 14:00-15:30', status: 'approved' },
    { id: '7', courseCode: 'CSE409', courseName: 'Machine Learning', credits: 3, section: 'A', instructor: 'Dr. ML Specialist', schedule: 'Thu, Fri - 10:00-11:30', status: 'approved' }
  ]
}

const mockAcademicHistory: Record<string, SemesterResult[]> = {
  '1': [
    {
      semester: 'Spring',
      year: '2024',
      courses: [
        { courseCode: 'CSE301', courseName: 'Data Structures', credits: 3, grade: 'A-', points: 11.1 },
        { courseCode: 'CSE303', courseName: 'Algorithms', credits: 3, grade: 'B+', points: 9.9 },
        { courseCode: 'CSE305', courseName: 'Database Systems', credits: 3, grade: 'A', points: 12.0 },
        { courseCode: 'MATH201', courseName: 'Statistics', credits: 3, grade: 'B', points: 9.0 }
      ],
      semesterGPA: 3.50,
      totalCredits: 12
    },
    {
      semester: 'Fall',
      year: '2023',
      courses: [
        { courseCode: 'CSE201', courseName: 'Programming', credits: 3, grade: 'A', points: 12.0 },
        { courseCode: 'CSE203', courseName: 'Object Oriented Programming', credits: 3, grade: 'A-', points: 11.1 },
        { courseCode: 'MATH101', courseName: 'Calculus I', credits: 3, grade: 'B+', points: 9.9 },
        { courseCode: 'PHY101', courseName: 'Physics I', credits: 3, grade: 'B', points: 9.0 }
      ],
      semesterGPA: 3.50,
      totalCredits: 12
    }
  ]
}

function StudentRegistrationDetails({ 
  student, 
  courses, 
  onApprove, 
  onHold, 
  onViewHistory 
}: { 
  student: Student;
  courses: RegisteredCourse[];
  onApprove: () => void;
  onHold: () => void;
  onViewHistory: () => void;
}) {
  const totalCredits = courses.reduce((sum, course) => sum + course.credits, 0)

  return (
    <div className="space-y-6">
      {/* Student Info Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-deep-plum to-accent-purple rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">
                  {student.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-deep-plum">{student.name}</h3>
                <p className="text-gray-600">ID: {student.studentId}</p>
                <p className="text-gray-600">{student.program}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <div className="flex items-center space-x-1">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{student.phone}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{student.email}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{student.cgpa}</p>
                  <p className="text-sm text-gray-600">CGPA</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{student.totalCredits}</p>
                  <p className="text-sm text-gray-600">Credits</p>
                </div>
              </div>
            </div>
          </div>
          
          {student.teacherNote && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Teacher Note:</strong> {student.teacherNote}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Registered Courses */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <BookOpen className="w-5 h-5" />
                <span>Registered Courses - {student.semester}</span>
              </CardTitle>
              <CardDescription>
                Total Credits: {totalCredits} | Registration Date: {new Date(student.lastRegistrationDate).toLocaleDateString()}
              </CardDescription>
            </div>
            <Badge 
              variant={
                student.registrationStatus === 'approved' ? 'default' :
                student.registrationStatus === 'hold' ? 'destructive' : 'secondary'
              }
            >
              {student.registrationStatus === 'approved' && <CheckCircle className="w-4 h-4 mr-1" />}
              {student.registrationStatus === 'hold' && <XCircle className="w-4 h-4 mr-1" />}
              {student.registrationStatus === 'pending' && <Clock className="w-4 h-4 mr-1" />}
              {student.registrationStatus.charAt(0).toUpperCase() + student.registrationStatus.slice(1)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-200 px-4 py-3 text-left font-medium">Course Code</th>
                  <th className="border border-gray-200 px-4 py-3 text-left font-medium">Course Name</th>
                  <th className="border border-gray-200 px-4 py-3 text-center font-medium">Credits</th>
                  <th className="border border-gray-200 px-4 py-3 text-center font-medium">Section</th>
                  <th className="border border-gray-200 px-4 py-3 text-left font-medium">Instructor</th>
                  <th className="border border-gray-200 px-4 py-3 text-left font-medium">Schedule</th>
                  <th className="border border-gray-200 px-4 py-3 text-center font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {courses.map(course => (
                  <tr key={course.id} className="hover:bg-gray-50">
                    <td className="border border-gray-200 px-4 py-3 font-mono font-medium">
                      {course.courseCode}
                    </td>
                    <td className="border border-gray-200 px-4 py-3">{course.courseName}</td>
                    <td className="border border-gray-200 px-4 py-3 text-center font-medium">
                      {course.credits}
                    </td>
                    <td className="border border-gray-200 px-4 py-3 text-center">
                      {course.section}
                    </td>
                    <td className="border border-gray-200 px-4 py-3">{course.instructor}</td>
                    <td className="border border-gray-200 px-4 py-3 text-sm">{course.schedule}</td>
                    <td className="border border-gray-200 px-4 py-3 text-center">
                      <Badge variant={course.status === 'approved' ? 'default' : 'secondary'}>
                        {course.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-between items-center">
        <Button 
          onClick={onViewHistory}
          variant="outline" 
          className="flex items-center space-x-2"
        >
          <FileText className="w-4 h-4" />
          <span>View Academic History</span>
        </Button>

        {student.registrationStatus === 'pending' && (
          <div className="flex space-x-2">
            <Button 
              onClick={onHold}
              variant="outline"
              className="text-red-600 hover:bg-red-50"
            >
              <XCircle className="w-4 h-4 mr-2" />
              Hold Registration
            </Button>
            <Button onClick={onApprove} className="bg-green-600 hover:bg-green-700">
              <CheckCircle className="w-4 h-4 mr-2" />
              Approve Registration
            </Button>
          </div>
        )}

        {student.registrationStatus === 'hold' && (
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <span className="text-red-600 font-medium">
              Registration on hold - Student needs to meet with teacher
            </span>
          </div>
        )}

        {student.registrationStatus === 'approved' && (
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="text-green-600 font-medium">Registration approved</span>
          </div>
        )}
      </div>
    </div>
  )
}

function AcademicHistory({ 
  student, 
  history, 
  onBack 
}: { 
  student: Student;
  history: SemesterResult[];
  onBack: () => void;
}) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-deep-plum">Academic History</h2>
          <p className="text-gray-600">{student.name} ({student.studentId})</p>
        </div>
        <Button onClick={onBack} variant="outline">Back to Registration</Button>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{student.cgpa}</p>
              <p className="text-sm text-gray-600">Overall CGPA</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{student.totalCredits}</p>
              <p className="text-sm text-gray-600">Total Credits</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">{history.length}</p>
              <p className="text-sm text-gray-600">Semesters</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">
                {Math.round((student.totalCredits / (history.length * 15)) * 100)}%
              </p>
              <p className="text-sm text-gray-600">Progress</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Semester Results */}
      <div className="space-y-4">
        {history.map((semester, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{semester.semester} {semester.year}</span>
                <div className="flex items-center space-x-4">
                  <Badge variant="outline">
                    GPA: {semester.semesterGPA}
                  </Badge>
                  <Badge variant="outline">
                    Credits: {semester.totalCredits}
                  </Badge>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-200">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-200 px-4 py-2 text-left font-medium">Course Code</th>
                      <th className="border border-gray-200 px-4 py-2 text-left font-medium">Course Name</th>
                      <th className="border border-gray-200 px-4 py-2 text-center font-medium">Credits</th>
                      <th className="border border-gray-200 px-4 py-2 text-center font-medium">Grade</th>
                      <th className="border border-gray-200 px-4 py-2 text-center font-medium">Points</th>
                    </tr>
                  </thead>
                  <tbody>
                    {semester.courses.map((course, courseIndex) => (
                      <tr key={courseIndex} className="hover:bg-gray-50">
                        <td className="border border-gray-200 px-4 py-2 font-mono">
                          {course.courseCode}
                        </td>
                        <td className="border border-gray-200 px-4 py-2">{course.courseName}</td>
                        <td className="border border-gray-200 px-4 py-2 text-center">
                          {course.credits}
                        </td>
                        <td className="border border-gray-200 px-4 py-2 text-center">
                          <Badge variant={
                            course.grade.startsWith('A') ? 'default' :
                            course.grade.startsWith('B') ? 'secondary' :
                            course.grade.startsWith('C') ? 'outline' : 'destructive'
                          }>
                            {course.grade}
                          </Badge>
                        </td>
                        <td className="border border-gray-200 px-4 py-2 text-center font-medium">
                          {course.points}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default function AdvisedStudents() {
  const [students, setStudents] = useState<Student[]>(advisedStudents)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [showHistory, setShowHistory] = useState(false)

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.studentId.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleApproveRegistration = (studentId: string) => {
    setStudents(prev => prev.map(student =>
      student.id === studentId
        ? { ...student, registrationStatus: 'approved' as const }
        : student
    ))
    alert('Registration approved successfully!')
  }

  const handleHoldRegistration = (studentId: string) => {
    const reason = prompt('Please provide a reason for holding the registration:')
    if (reason) {
      setStudents(prev => prev.map(student =>
        student.id === studentId
          ? { 
              ...student, 
              registrationStatus: 'hold' as const,
              teacherNote: `Registration held: ${reason}`
            }
          : student
      ))
      alert('Registration has been placed on hold. Student will be notified.')
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'hold': return <XCircle className="w-4 h-4 text-red-600" />
      default: return <Clock className="w-4 h-4 text-yellow-600" />
    }
  }

  const getStatusCount = (status: string) => {
    return students.filter(student => student.registrationStatus === status).length
  }

  if (showHistory && selectedStudent) {
    return (
      <AcademicHistory
        student={selectedStudent}
        history={mockAcademicHistory[selectedStudent.id] || []}
        onBack={() => setShowHistory(false)}
      />
    )
  }

  if (selectedStudent) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-deep-plum">Student Registration Details</h1>
            <p className="text-gray-600 mt-1">Review and approve student course registration</p>
          </div>
          <Button onClick={() => setSelectedStudent(null)} variant="outline">
            Back to Students List
          </Button>
        </div>

        <StudentRegistrationDetails
          student={selectedStudent}
          courses={mockRegisteredCourses[selectedStudent.id] || []}
          onApprove={() => handleApproveRegistration(selectedStudent.id)}
          onHold={() => handleHoldRegistration(selectedStudent.id)}
          onViewHistory={() => setShowHistory(true)}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-deep-plum">My Advised Students</h1>
          <p className="text-gray-600 mt-1">Manage student registrations and academic progress</p>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Students</p>
                <p className="text-2xl font-bold text-deep-plum">{students.length}</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Approval</p>
                <p className="text-2xl font-bold text-yellow-600">{getStatusCount('pending')}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-green-600">{getStatusCount('approved')}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">On Hold</p>
                <p className="text-2xl font-bold text-red-600">{getStatusCount('hold')}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search by student name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Students List */}
      <Card>
        <CardHeader>
          <CardTitle>Advised Students</CardTitle>
          <CardDescription>
            {filteredStudents.length} student(s) found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredStudents.map(student => (
              <div
                key={student.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                onClick={() => setSelectedStudent(student)}
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-deep-plum to-accent-purple rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">
                      {student.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">{student.name}</h4>
                    <p className="text-gray-600">{student.studentId}</p>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-sm text-gray-500">CGPA: {student.cgpa}</span>
                      <span className="text-sm text-gray-500">Credits: {student.totalCredits}</span>
                      <span className="text-sm text-gray-500">
                        Last Registration: {new Date(student.lastRegistrationDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Badge 
                    variant={
                      student.registrationStatus === 'approved' ? 'default' :
                      student.registrationStatus === 'hold' ? 'destructive' : 'secondary'
                    }
                    className="flex items-center space-x-1"
                  >
                    {getStatusIcon(student.registrationStatus)}
                    <span>{student.registrationStatus.charAt(0).toUpperCase() + student.registrationStatus.slice(1)}</span>
                  </Badge>
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-1" />
                    View Details
                  </Button>
                </div>
              </div>
            ))}

            {filteredStudents.length === 0 && (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No Students Found</h3>
                <p className="text-gray-500">
                  {searchTerm ? 'No students match your search criteria' : 'You have no advised students at the moment'}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
