import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Users,
  Search,
  Eye,
  BookOpen,
  GraduationCap,
  TrendingUp,
  FileText,
  Filter,
  X,
  ArrowLeft
} from 'lucide-react'

interface Student {
  id: string
  studentId: string
  name: string
  email: string
  program: string
  campus: string
  admissionSemester: string
  currentSemester: string
  cgpa: number
  totalCredits: number
  completedCredits: number
  remainingCredits: number
  expectedGraduation: string
  status: 'active' | 'probation' | 'graduated' | 'suspended'
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
    instructor: string
  }[]
  semesterGPA: number
  cumulativeGPA: number
  totalCredits: number
}

// Mock student data for academic history
const allStudents: Student[] = [
  {
    id: '1',
    studentId: '2021-1-60-001',
    name: 'Ahmed Rahman',
    email: 'ahmed.rahman@student.nu.edu.bd',
    program: 'Computer Science & Engineering',
    campus: 'Main Campus',
    admissionSemester: 'Spring 2021',
    currentSemester: 'Fall 2024',
    cgpa: 3.75,
    totalCredits: 144,
    completedCredits: 96,
    remainingCredits: 48,
    expectedGraduation: 'Fall 2025',
    status: 'active'
  },
  {
    id: '2',
    studentId: '2021-1-60-002',
    name: 'Fatima Khan',
    email: 'fatima.khan@student.nu.edu.bd',
    program: 'Computer Science & Engineering',
    campus: 'Main Campus',
    admissionSemester: 'Spring 2021',
    currentSemester: 'Fall 2024',
    cgpa: 3.92,
    totalCredits: 144,
    completedCredits: 102,
    remainingCredits: 42,
    expectedGraduation: 'Spring 2025',
    status: 'active'
  },
  {
    id: '3',
    studentId: '2022-1-60-015',
    name: 'Mohammad Ali',
    email: 'mohammad.ali@student.nu.edu.bd',
    program: 'Business Administration',
    campus: 'City Campus',
    admissionSemester: 'Fall 2022',
    currentSemester: 'Fall 2024',
    cgpa: 3.25,
    totalCredits: 120,
    completedCredits: 72,
    remainingCredits: 48,
    expectedGraduation: 'Fall 2025',
    status: 'probation'
  },
  {
    id: '4',
    studentId: '2020-1-60-089',
    name: 'Ayesha Ahmed',
    email: 'ayesha.ahmed@student.nu.edu.bd',
    program: 'Computer Science & Engineering',
    campus: 'Main Campus',
    admissionSemester: 'Spring 2020',
    currentSemester: 'Graduated',
    cgpa: 3.68,
    totalCredits: 144,
    completedCredits: 144,
    remainingCredits: 0,
    expectedGraduation: 'Spring 2024',
    status: 'graduated'
  },
  {
    id: '5',
    studentId: '2022-1-60-025',
    name: 'Rashid Hasan',
    email: 'rashid.hasan@student.nu.edu.bd',
    program: 'Electrical & Electronic Engineering',
    campus: 'Tech Campus',
    admissionSemester: 'Spring 2022',
    currentSemester: 'Fall 2024',
    cgpa: 3.45,
    totalCredits: 144,
    completedCredits: 84,
    remainingCredits: 60,
    expectedGraduation: 'Spring 2026',
    status: 'active'
  }
]

const mockAcademicHistory: Record<string, SemesterResult[]> = {
  '1': [
    {
      semester: 'Fall',
      year: '2024',
      courses: [
        { courseCode: 'CSE401', courseName: 'Database Management Systems', credits: 3, grade: 'A-', points: 11.1, instructor: 'Dr. Abdul Rahman' },
        { courseCode: 'CSE403', courseName: 'Software Engineering', credits: 3, grade: 'B+', points: 9.9, instructor: 'Dr. Sarah Khan' },
        { courseCode: 'CSE405', courseName: 'Computer Networks', credits: 3, grade: 'A', points: 12.0, instructor: 'Dr. Rahman Ali' },
        { courseCode: 'ENG102', courseName: 'Technical Writing', credits: 2, grade: 'B', points: 6.0, instructor: 'Prof. Lisa Johnson' }
      ],
      semesterGPA: 3.54,
      cumulativeGPA: 3.75,
      totalCredits: 11
    },
    {
      semester: 'Summer',
      year: '2024',
      courses: [
        { courseCode: 'CSE301', courseName: 'Data Structures', credits: 3, grade: 'A', points: 12.0, instructor: 'Dr. Computer Expert' },
        { courseCode: 'CSE303', courseName: 'Algorithms', credits: 3, grade: 'A-', points: 11.1, instructor: 'Dr. Math Wizard' },
        { courseCode: 'MATH201', courseName: 'Statistics', credits: 3, grade: 'B+', points: 9.9, instructor: 'Prof. Stats Master' }
      ],
      semesterGPA: 3.67,
      cumulativeGPA: 3.72,
      totalCredits: 9
    },
    {
      semester: 'Spring',
      year: '2024',
      courses: [
        { courseCode: 'CSE201', courseName: 'Programming', credits: 3, grade: 'A', points: 12.0, instructor: 'Dr. Code Master' },
        { courseCode: 'CSE203', courseName: 'Object Oriented Programming', credits: 3, grade: 'A-', points: 11.1, instructor: 'Dr. OOP Expert' },
        { courseCode: 'MATH101', courseName: 'Calculus I', credits: 3, grade: 'B+', points: 9.9, instructor: 'Prof. Calculus Pro' },
        { courseCode: 'PHY101', courseName: 'Physics I', credits: 3, grade: 'B', points: 9.0, instructor: 'Dr. Physics Guru' }
      ],
      semesterGPA: 3.50,
      cumulativeGPA: 3.68,
      totalCredits: 12
    }
  ],
  '2': [
    {
      semester: 'Fall',
      year: '2024',
      courses: [
        { courseCode: 'CSE401', courseName: 'Database Management Systems', credits: 3, grade: 'A', points: 12.0, instructor: 'Dr. Abdul Rahman' },
        { courseCode: 'CSE407', courseName: 'Artificial Intelligence', credits: 3, grade: 'A', points: 12.0, instructor: 'Dr. AI Expert' },
        { courseCode: 'CSE409', courseName: 'Machine Learning', credits: 3, grade: 'A-', points: 11.1, instructor: 'Dr. ML Specialist' }
      ],
      semesterGPA: 3.90,
      cumulativeGPA: 3.92,
      totalCredits: 9
    }
  ]
}

function StudentAcademicDetails({ 
  student, 
  history, 
  onBack 
}: { 
  student: Student
  history: SemesterResult[]
  onBack: () => void
}) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button onClick={onBack} variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Student List
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-deep-plum">Academic History</h2>
            <p className="text-gray-600">{student.name} ({student.studentId})</p>
          </div>
        </div>
      </div>

      {/* Student Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Student Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <Label className="text-sm font-medium text-gray-600">Program</Label>
              <p className="font-semibold">{student.program}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-600">Campus</Label>
              <p className="font-semibold">{student.campus}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-600">Admission</Label>
              <p className="font-semibold">{student.admissionSemester}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-600">Status</Label>
              <Badge variant={
                student.status === 'active' ? 'default' :
                student.status === 'graduated' ? 'secondary' :
                student.status === 'probation' ? 'destructive' : 'outline'
              }>
                {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Academic Progress */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{student.cgpa}</p>
              <p className="text-sm text-gray-600">Cumulative GPA</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{student.completedCredits}</p>
              <p className="text-sm text-gray-600">Completed Credits</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">{student.remainingCredits}</p>
              <p className="text-sm text-gray-600">Remaining Credits</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-lg font-bold text-orange-600">
                {Math.round((student.completedCredits / student.totalCredits) * 100)}%
              </p>
              <p className="text-sm text-gray-600">Progress</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Semester-wise Academic History */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-deep-plum">Semester-wise Academic Record</h3>
        {history.map((semester, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{semester.semester} {semester.year}</span>
                <div className="flex items-center space-x-4">
                  <Badge variant="outline">
                    Semester GPA: {semester.semesterGPA}
                  </Badge>
                  <Badge variant="outline">
                    Cumulative GPA: {semester.cumulativeGPA}
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
                      <th className="border border-gray-200 px-4 py-2 text-left font-medium">Instructor</th>
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
                        <td className="border border-gray-200 px-4 py-2 text-sm">
                          {course.instructor}
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

export default function AcademicHistory() {
  const [students] = useState<Student[]>(allStudents)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [programFilter, setProgramFilter] = useState('')
  const [campusFilter, setCampusFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  // Get unique values for filter options
  const uniquePrograms = [...new Set(students.map(s => s.program))].sort()
  const uniqueCampuses = [...new Set(students.map(s => s.campus))].sort()

  const filteredStudents = students.filter(student => {
    const matchesSearch = !searchTerm ||
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesProgram = !programFilter || student.program === programFilter
    const matchesCampus = !campusFilter || student.campus === campusFilter
    const matchesStatus = !statusFilter || student.status === statusFilter

    return matchesSearch && matchesProgram && matchesCampus && matchesStatus
  })

  const clearAllFilters = () => {
    setSearchTerm('')
    setProgramFilter('')
    setCampusFilter('')
    setStatusFilter('')
  }

  const getActiveFilterCount = () => {
    let count = 0
    if (searchTerm) count++
    if (programFilter) count++
    if (campusFilter) count++
    if (statusFilter) count++
    return count
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <BookOpen className="w-4 h-4 text-green-600" />
      case 'graduated': return <GraduationCap className="w-4 h-4 text-blue-600" />
      case 'probation': return <TrendingUp className="w-4 h-4 text-yellow-600" />
      default: return <Users className="w-4 h-4 text-gray-600" />
    }
  }

  if (selectedStudent) {
    return (
      <StudentAcademicDetails
        student={selectedStudent}
        history={mockAcademicHistory[selectedStudent.id] || []}
        onBack={() => setSelectedStudent(null)}
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-deep-plum">Academic History</h1>
          <p className="text-gray-600 mt-1">View academic records and performance of all students</p>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Search className="w-5 h-5" />
              <span>Student Search & Filters</span>
              {getActiveFilterCount() > 0 && (
                <Badge variant="default" className="ml-2">
                  {getActiveFilterCount()} active
                </Badge>
              )}
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2"
              >
                <Filter className="w-4 h-4" />
                <span>{showFilters ? 'Hide' : 'Show'} Filters</span>
              </Button>
              {getActiveFilterCount() > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearAllFilters}
                  className="flex items-center space-x-2 text-red-600 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                  <span>Clear All</span>
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Basic Search */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search by student name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="space-y-4 border-t pt-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="program">Program</Label>
                  <Select value={programFilter} onValueChange={setProgramFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Programs" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Programs</SelectItem>
                      {uniquePrograms.map(program => (
                        <SelectItem key={program} value={program}>
                          {program}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="campus">Campus</Label>
                  <Select value={campusFilter} onValueChange={setCampusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Campuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Campuses</SelectItem>
                      {uniqueCampuses.map(campus => (
                        <SelectItem key={campus} value={campus}>
                          {campus}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Academic Status</Label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Statuses</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="graduated">Graduated</SelectItem>
                      <SelectItem value="probation">Probation</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Students List */}
      <Card>
        <CardHeader>
          <CardTitle>All Students</CardTitle>
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
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {student.program}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {student.campus}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                      <span>CGPA: {student.cgpa}</span>
                      <span>Credits: {student.completedCredits}/{student.totalCredits}</span>
                      <span>Expected Graduation: {student.expectedGraduation}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Badge 
                    variant={
                      student.status === 'active' ? 'default' :
                      student.status === 'graduated' ? 'secondary' :
                      student.status === 'probation' ? 'destructive' : 'outline'
                    }
                    className="flex items-center space-x-1"
                  >
                    {getStatusIcon(student.status)}
                    <span>{student.status.charAt(0).toUpperCase() + student.status.slice(1)}</span>
                  </Badge>
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-1" />
                    View History
                  </Button>
                </div>
              </div>
            ))}

            {filteredStudents.length === 0 && (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No Students Found</h3>
                <p className="text-gray-500">
                  {searchTerm || programFilter || campusFilter || statusFilter ? 
                    'No students match your search criteria' : 
                    'No student records available'
                  }
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
