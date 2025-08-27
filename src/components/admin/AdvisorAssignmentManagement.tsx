import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Users,
  Search,
  UserPlus,
  Download,
  CheckCircle,
  RotateCcw,
  UserCheck,
  FileText,
  GraduationCap,
  UserX
} from 'lucide-react'

interface Teacher {
  id: string
  employeeId: string
  name: string
  department: string
  designation: string
  email: string
  phone: string
  maxAdviseeLimit: number
  currentAdvisees: number
  specialization: string[]
  isActive: boolean
}

interface Student {
  id: string
  studentId: string
  name: string
  program: string
  semester: string
  admissionYear: string
  currentSemester: number
  cgpa: number
  totalCredits: number
  currentAdvisor: string | null
  currentAdvisorName: string | null
  assignmentDate: string | null
  email: string
  phone: string
  campus: string
  status: 'active' | 'suspended' | 'graduated' | 'dropped'
}


// Mock data for teachers
const teachersData: Teacher[] = [
  {
    id: '1',
    employeeId: 'T001',
    name: 'Dr. Rahman Ahmed',
    department: 'CSE',
    designation: 'Professor',
    email: 'rahman.ahmed@nu.edu.bd',
    phone: '+880 1711-123456',
    maxAdviseeLimit: 25,
    currentAdvisees: 22,
    specialization: ['Software Engineering', 'Database Systems'],
    isActive: true
  },
  {
    id: '2',
    employeeId: 'T002',
    name: 'Prof. Sarah Khan',
    department: 'CSE',
    designation: 'Associate Professor',
    email: 'sarah.khan@nu.edu.bd',
    phone: '+880 1711-123457',
    maxAdviseeLimit: 20,
    currentAdvisees: 18,
    specialization: ['Machine Learning', 'Artificial Intelligence'],
    isActive: true
  },
  {
    id: '3',
    employeeId: 'T003',
    name: 'Dr. Mohammad Ali',
    department: 'CSE',
    designation: 'Assistant Professor',
    email: 'mohammad.ali@nu.edu.bd',
    phone: '+880 1711-123458',
    maxAdviseeLimit: 15,
    currentAdvisees: 12,
    specialization: ['Computer Networks', 'Cybersecurity'],
    isActive: true
  },
  {
    id: '4',
    employeeId: 'T004',
    name: 'Dr. Fatima Rahman',
    department: 'BBA',
    designation: 'Professor',
    email: 'fatima.rahman@nu.edu.bd',
    phone: '+880 1711-123459',
    maxAdviseeLimit: 30,
    currentAdvisees: 28,
    specialization: ['Marketing', 'Strategic Management'],
    isActive: true
  },
  {
    id: '5',
    employeeId: 'T005',
    name: 'Prof. Ahmed Hassan',
    department: 'EEE',
    designation: 'Associate Professor',
    email: 'ahmed.hassan@nu.edu.bd',
    phone: '+880 1711-123460',
    maxAdviseeLimit: 20,
    currentAdvisees: 15,
    specialization: ['Power Systems', 'Electronics'],
    isActive: true
  }
]

// Mock data for students
const studentsData: Student[] = [
  {
    id: '1',
    studentId: '2021-1-60-001',
    name: 'Ahmed Rahman',
    program: 'CSE',
    semester: 'Fall 2024',
    admissionYear: '2021',
    currentSemester: 8,
    cgpa: 3.75,
    totalCredits: 120,
    currentAdvisor: 'T001',
    currentAdvisorName: 'Dr. Rahman Ahmed',
    assignmentDate: '2021-03-15',
    email: 'ahmed.rahman@student.nu.edu.bd',
    phone: '+880 1712-345678',
    campus: 'Main Campus',
    status: 'active'
  },
  {
    id: '2',
    studentId: '2022-1-60-002',
    name: 'Fatima Khan',
    program: 'CSE',
    semester: 'Fall 2024',
    admissionYear: '2022',
    currentSemester: 6,
    cgpa: 3.92,
    totalCredits: 90,
    currentAdvisor: 'T002',
    currentAdvisorName: 'Prof. Sarah Khan',
    assignmentDate: '2022-03-15',
    email: 'fatima.khan@student.nu.edu.bd',
    phone: '+880 1789-123456',
    campus: 'Main Campus',
    status: 'active'
  },
  {
    id: '3',
    studentId: '2023-1-60-003',
    name: 'Mohammad Ali',
    program: 'CSE',
    semester: 'Fall 2024',
    admissionYear: '2023',
    currentSemester: 4,
    cgpa: 3.25,
    totalCredits: 60,
    currentAdvisor: null,
    currentAdvisorName: null,
    assignmentDate: null,
    email: 'mohammad.ali@student.nu.edu.bd',
    phone: '+880 1987-654321',
    campus: 'Main Campus',
    status: 'active'
  },
  {
    id: '4',
    studentId: '2022-1-60-004',
    name: 'Ayesha Ahmed',
    program: 'BBA',
    semester: 'Fall 2024',
    admissionYear: '2022',
    currentSemester: 6,
    cgpa: 3.68,
    totalCredits: 84,
    currentAdvisor: 'T004',
    currentAdvisorName: 'Dr. Fatima Rahman',
    assignmentDate: '2022-03-15',
    email: 'ayesha.ahmed@student.nu.edu.bd',
    phone: '+880 1876-543210',
    campus: 'Main Campus',
    status: 'active'
  },
  {
    id: '5',
    studentId: '2023-1-60-005',
    name: 'Rashid Hasan',
    program: 'EEE',
    semester: 'Fall 2024',
    admissionYear: '2023',
    currentSemester: 4,
    cgpa: 3.45,
    totalCredits: 54,
    currentAdvisor: null,
    currentAdvisorName: null,
    assignmentDate: null,
    email: 'rashid.hasan@student.nu.edu.bd',
    phone: '+880 1567-891234',
    campus: 'Tech Campus',
    status: 'active'
  }
]


function IndividualAssignment() {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null)
  const [searchStudentTerm, setSearchStudentTerm] = useState('')
  const [searchTeacherTerm, setSearchTeacherTerm] = useState('')
  const [assignmentReason, setAssignmentReason] = useState('')

  const filteredStudents = studentsData.filter(student =>
    (student.name.toLowerCase().includes(searchStudentTerm.toLowerCase()) ||
     student.studentId.toLowerCase().includes(searchStudentTerm.toLowerCase())) &&
    student.status === 'active'
  )

  const filteredTeachers = teachersData.filter(teacher =>
    (teacher.name.toLowerCase().includes(searchTeacherTerm.toLowerCase()) ||
     teacher.employeeId.toLowerCase().includes(searchTeacherTerm.toLowerCase())) &&
    teacher.isActive &&
    teacher.currentAdvisees < teacher.maxAdviseeLimit
  )

  const handleAssignment = () => {
    if (!selectedStudent || !selectedTeacher) {
      alert('Please select both student and teacher')
      return
    }

    if (selectedStudent.currentAdvisor) {
      const confirmReassign = confirm(
        `${selectedStudent.name} is currently advised by ${selectedStudent.currentAdvisorName}. Do you want to reassign?`
      )
      if (!confirmReassign) return
    }

    alert(`Successfully assigned ${selectedStudent.name} to ${selectedTeacher.name}`)
    setSelectedStudent(null)
    setSelectedTeacher(null)
    setAssignmentReason('')
  }

  return (
    <div className="space-y-6">
      {/* Student Search */}
      <Card>
        <CardHeader>
          <CardTitle>Select Student</CardTitle>
          <CardDescription>Search and select a student for advisor assignment</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search by student name or ID..."
                value={searchStudentTerm}
                onChange={(e) => setSearchStudentTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {searchStudentTerm && (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {filteredStudents.map(student => (
                  <div
                    key={student.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedStudent?.id === student.id ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedStudent(student)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{student.name}</h4>
                        <p className="text-sm text-gray-600">{student.studentId}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                          <span>{student.program}</span>
                          <span>Semester {student.currentSemester}</span>
                          <span>CGPA: {student.cgpa}</span>
                        </div>
                        {student.currentAdvisorName && (
                          <p className="text-sm text-orange-600 mt-1">
                            Current Advisor: {student.currentAdvisorName}
                          </p>
                        )}
                      </div>
                      <Badge variant={student.currentAdvisor ? 'secondary' : 'destructive'}>
                        {student.currentAdvisor ? 'Assigned' : 'Unassigned'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Teacher Search */}
      <Card>
        <CardHeader>
          <CardTitle>Select Advisor</CardTitle>
          <CardDescription>Search and select a teacher to assign as advisor</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search by teacher name or employee ID..."
                value={searchTeacherTerm}
                onChange={(e) => setSearchTeacherTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {searchTeacherTerm && (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {filteredTeachers.map(teacher => (
                  <div
                    key={teacher.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedTeacher?.id === teacher.id ? 'border-green-500 bg-green-50' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedTeacher(teacher)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{teacher.name}</h4>
                        <p className="text-sm text-gray-600">{teacher.employeeId} - {teacher.designation}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                          <span>{teacher.department}</span>
                          <span>{teacher.email}</span>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {teacher.specialization.map(spec => (
                            <Badge key={spec} variant="outline" className="text-xs">
                              {spec}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant={teacher.currentAdvisees < teacher.maxAdviseeLimit ? 'default' : 'destructive'}>
                          {teacher.currentAdvisees}/{teacher.maxAdviseeLimit}
                        </Badge>
                        <p className="text-xs text-gray-500 mt-1">
                          {teacher.maxAdviseeLimit - teacher.currentAdvisees} available
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Assignment Form */}
      {selectedStudent && selectedTeacher && (
        <Card>
          <CardHeader>
            <CardTitle>Confirm Assignment</CardTitle>
            <CardDescription>Review the assignment details before confirming</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Student</h4>
                <p className="font-medium">{selectedStudent.name}</p>
                <p className="text-sm text-gray-600">{selectedStudent.studentId}</p>
                <p className="text-sm">{selectedStudent.program} - Semester {selectedStudent.currentSemester}</p>
                <p className="text-sm">CGPA: {selectedStudent.cgpa}</p>
              </div>

              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">Advisor</h4>
                <p className="font-medium">{selectedTeacher.name}</p>
                <p className="text-sm text-gray-600">{selectedTeacher.employeeId} - {selectedTeacher.designation}</p>
                <p className="text-sm">{selectedTeacher.department}</p>
                <p className="text-sm">Load: {selectedTeacher.currentAdvisees + 1}/{selectedTeacher.maxAdviseeLimit}</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Assignment Reason (Optional)</Label>
              <Input
                placeholder="Enter reason for this assignment..."
                value={assignmentReason}
                onChange={(e) => setAssignmentReason(e.target.value)}
              />
            </div>

            <div className="flex justify-end space-x-3">
              <Button 
                variant="outline" 
                onClick={() => {
                  setSelectedStudent(null)
                  setSelectedTeacher(null)
                  setAssignmentReason('')
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleAssignment}>
                <UserCheck className="w-4 h-4 mr-2" />
                Confirm Assignment
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function BulkAssignment() {
  const [selectedStudents, setSelectedStudents] = useState<Set<string>>(new Set())
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null)
  const [filterProgram, setFilterProgram] = useState('all')
  const [filterSemester, setFilterSemester] = useState('all')
  const [bulkReason, setBulkReason] = useState('')

  const filteredStudents = studentsData.filter(student => {
    return (filterProgram === 'all' || student.program === filterProgram) &&
           (filterSemester === 'all' || student.semester === filterSemester) &&
           student.status === 'active' &&
           !student.currentAdvisor // Only unassigned students
  })

  const availableTeachers = teachersData.filter(teacher => 
    teacher.isActive && teacher.currentAdvisees < teacher.maxAdviseeLimit
  )

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedStudents(new Set(filteredStudents.map(s => s.id)))
    } else {
      setSelectedStudents(new Set())
    }
  }

  const handleSelectStudent = (studentId: string, checked: boolean) => {
    const newSelected = new Set(selectedStudents)
    if (checked) {
      newSelected.add(studentId)
    } else {
      newSelected.delete(studentId)
    }
    setSelectedStudents(newSelected)
  }

  const handleBulkAssignment = () => {
    if (selectedStudents.size === 0 || !selectedTeacher) {
      alert('Please select students and a teacher')
      return
    }

    if (selectedTeacher.currentAdvisees + selectedStudents.size > selectedTeacher.maxAdviseeLimit) {
      alert(`Cannot assign ${selectedStudents.size} students. Teacher capacity will be exceeded.`)
      return
    }

    alert(`Successfully assigned ${selectedStudents.size} students to ${selectedTeacher.name}`)
    setSelectedStudents(new Set())
    setSelectedTeacher(null)
    setBulkReason('')
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Students</CardTitle>
          <CardDescription>Filter unassigned students by program and semester</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Program</Label>
              <Select value={filterProgram} onValueChange={setFilterProgram}>
                <SelectTrigger>
                  <SelectValue placeholder="All Programs" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Programs</SelectItem>
                  <SelectItem value="CSE">CSE</SelectItem>
                  <SelectItem value="BBA">BBA</SelectItem>
                  <SelectItem value="EEE">EEE</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Semester</Label>
              <Select value={filterSemester} onValueChange={setFilterSemester}>
                <SelectTrigger>
                  <SelectValue placeholder="All Semesters" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Semesters</SelectItem>
                  <SelectItem value="Fall 2024">Fall 2024</SelectItem>
                  <SelectItem value="Spring 2024">Spring 2024</SelectItem>
                  <SelectItem value="Summer 2024">Summer 2024</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Advisor</Label>
              <Select value={selectedTeacher?.id || ''} onValueChange={(value) => {
                const teacher = availableTeachers.find(t => t.id === value)
                setSelectedTeacher(teacher || null)
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Advisor" />
                </SelectTrigger>
                <SelectContent>
                  {availableTeachers.map(teacher => (
                    <SelectItem key={teacher.id} value={teacher.id}>
                      {teacher.name} ({teacher.currentAdvisees}/{teacher.maxAdviseeLimit})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => {
                  setFilterProgram('')
                  setFilterSemester('')
                  setSelectedTeacher(null)
                  setSelectedStudents(new Set())
                }}
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Students List */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Unassigned Students ({filteredStudents.length})</CardTitle>
              <CardDescription>
                Select students for bulk advisor assignment. {selectedStudents.size} selected.
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={selectedStudents.size === filteredStudents.length && filteredStudents.length > 0}
                onCheckedChange={handleSelectAll}
              />
              <Label>Select All</Label>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredStudents.map(student => (
              <div key={student.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                <Checkbox
                  checked={selectedStudents.has(student.id)}
                  onCheckedChange={(checked) => handleSelectStudent(student.id, checked as boolean)}
                />
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{student.name}</h4>
                      <p className="text-sm text-gray-600">{student.studentId}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                        <span>{student.program}</span>
                        <span>Semester {student.currentSemester}</span>
                        <span>CGPA: {student.cgpa}</span>
                        <span>{student.campus}</span>
                      </div>
                    </div>
                    <Badge variant="destructive">
                      Unassigned
                    </Badge>
                  </div>
                </div>
              </div>
            ))}

            {filteredStudents.length === 0 && (
              <div className="text-center py-8">
                <UserCheck className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">No Unassigned Students</h3>
                <p className="text-gray-500">All students matching the criteria have advisors assigned</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Bulk Assignment Controls */}
      {selectedStudents.size > 0 && selectedTeacher && (
        <Card>
          <CardHeader>
            <CardTitle>Bulk Assignment Details</CardTitle>
            <CardDescription>
              Assigning {selectedStudents.size} students to {selectedTeacher.name}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">Assignment Summary</h4>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p><span className="font-medium">Advisor:</span> {selectedTeacher.name}</p>
                  <p><span className="font-medium">Employee ID:</span> {selectedTeacher.employeeId}</p>
                  <p><span className="font-medium">Department:</span> {selectedTeacher.department}</p>
                </div>
                <div>
                  <p><span className="font-medium">Current Load:</span> {selectedTeacher.currentAdvisees}/{selectedTeacher.maxAdviseeLimit}</p>
                  <p><span className="font-medium">After Assignment:</span> {selectedTeacher.currentAdvisees + selectedStudents.size}/{selectedTeacher.maxAdviseeLimit}</p>
                  <p><span className="font-medium">Remaining Capacity:</span> {selectedTeacher.maxAdviseeLimit - selectedTeacher.currentAdvisees - selectedStudents.size}</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Assignment Reason</Label>
              <Input
                placeholder="Reason for bulk assignment..."
                value={bulkReason}
                onChange={(e) => setBulkReason(e.target.value)}
              />
            </div>

            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setSelectedStudents(new Set())}>
                Clear Selection
              </Button>
              <Button onClick={handleBulkAssignment}>
                <Users className="w-4 h-4 mr-2" />
                Assign {selectedStudents.size} Students
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function AssignmentOverview() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterBy, setFilterBy] = useState('all')

  const handleSearchByTeacher = () => {
    const teacherId = prompt('Enter Teacher Employee ID:')
    if (teacherId) {
      const teacher = teachersData.find(t => t.employeeId.toLowerCase() === teacherId.toLowerCase())
      if (teacher) {
        const advisees = studentsData.filter(s => s.currentAdvisor === teacher.id)
        alert(`${teacher.name} is advising ${advisees.length} students:\n${advisees.map(s => `- ${s.name} (${s.studentId})`).join('\n')}`)
      } else {
        alert('Teacher not found')
      }
    }
  }

  const handleSearchByStudent = () => {
    const studentId = prompt('Enter Student ID:')
    if (studentId) {
      const student = studentsData.find(s => s.studentId.toLowerCase() === studentId.toLowerCase())
      if (student) {
        if (student.currentAdvisorName) {
          alert(`${student.name} is advised by ${student.currentAdvisorName} since ${student.assignmentDate}`)
        } else {
          alert(`${student.name} does not have an assigned advisor`)
        }
      } else {
        alert('Student not found')
      }
    }
  }

  const handleReassignAdvisor = (studentId: string) => {
    const student = studentsData.find(s => s.id === studentId)
    if (student) {
      const reason = prompt(`Reassign advisor for ${student.name}?\nCurrent advisor: ${student.currentAdvisorName}\n\nEnter reason for reassignment:`)
      if (reason) {
        alert('Advisor reassignment initiated. Please use the Individual Assignment tab to complete the process.')
      }
    }
  }

  const handleRemoveAdvisor = (studentId: string) => {
    const student = studentsData.find(s => s.id === studentId)
    if (student) {
      const confirm = window.confirm(`Remove advisor assignment for ${student.name}?\nCurrent advisor: ${student.currentAdvisorName}`)
      if (confirm) {
        alert('Advisor assignment removed successfully')
      }
    }
  }

  const filteredAssignments = studentsData.filter(student => {
    const matchesSearch = !searchTerm || 
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.currentAdvisorName?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesFilter = filterBy === 'all' || 
      (filterBy === 'assigned' && student.currentAdvisor) ||
      (filterBy === 'unassigned' && !student.currentAdvisor)
    
    return matchesSearch && matchesFilter && student.status === 'active'
  })

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Students</p>
                <p className="text-2xl font-bold text-deep-plum">
                  {studentsData.filter(s => s.status === 'active').length}
                </p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Assigned</p>
                <p className="text-2xl font-bold text-green-600">
                  {studentsData.filter(s => s.currentAdvisor && s.status === 'active').length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Unassigned</p>
                <p className="text-2xl font-bold text-red-600">
                  {studentsData.filter(s => !s.currentAdvisor && s.status === 'active').length}
                </p>
              </div>
              <UserX className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Teachers</p>
                <p className="text-2xl font-bold text-purple-600">
                  {teachersData.filter(t => t.isActive).length}
                </p>
              </div>
              <GraduationCap className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Search & Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search students or advisors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={filterBy} onValueChange={setFilterBy}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Students</SelectItem>
                <SelectItem value="assigned">Assigned</SelectItem>
                <SelectItem value="unassigned">Unassigned</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" onClick={handleSearchByTeacher}>
              Search by Teacher
            </Button>

            <Button variant="outline" onClick={handleSearchByStudent}>
              Search by Student
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Assignments List */}
      <Card>
        <CardHeader>
          <CardTitle>Current Assignments ({filteredAssignments.length})</CardTitle>
          <CardDescription>Overview of all advisor assignments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredAssignments.map(student => (
              <div key={student.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-4">
                    <div>
                      <h4 className="font-medium">{student.name}</h4>
                      <p className="text-sm text-gray-600">{student.studentId}</p>
                    </div>
                    <div className="text-sm">
                      <p>{student.program} - Semester {student.currentSemester}</p>
                      <p className="text-gray-500">CGPA: {student.cgpa} | Credits: {student.totalCredits}</p>
                    </div>
                    <div className="text-sm">
                      {student.currentAdvisorName ? (
                        <div>
                          <p className="font-medium text-green-700">{student.currentAdvisorName}</p>
                          <p className="text-gray-500">Since: {student.assignmentDate}</p>
                        </div>
                      ) : (
                        <Badge variant="destructive">Unassigned</Badge>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2">
                  {student.currentAdvisor ? (
                    <>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleReassignAdvisor(student.id)}
                      >
                        <RotateCcw className="w-4 h-4 mr-1" />
                        Reassign
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleRemoveAdvisor(student.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <UserX className="w-4 h-4 mr-1" />
                        Remove
                      </Button>
                    </>
                  ) : (
                    <Button 
                      size="sm"
                      onClick={() => alert('Use Individual Assignment tab to assign advisor')}
                    >
                      <UserPlus className="w-4 h-4 mr-1" />
                      Assign
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function AdvisorAssignmentManagement() {
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-deep-plum">Advisor Assignment Management</h1>
          <p className="text-gray-600 mt-1">Assign and manage student-advisor relationships</p>
        </div>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export Assignments
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center space-x-2">
            <FileText className="w-4 h-4" />
            <span>Overview</span>
          </TabsTrigger>
          <TabsTrigger value="individual" className="flex items-center space-x-2">
            <UserPlus className="w-4 h-4" />
            <span>Individual Assignment</span>
          </TabsTrigger>
          <TabsTrigger value="bulk" className="flex items-center space-x-2">
            <Users className="w-4 h-4" />
            <span>Bulk Assignment</span>
          </TabsTrigger>
          <TabsTrigger value="teachers" className="flex items-center space-x-2">
            <GraduationCap className="w-4 h-4" />
            <span>Teacher Workload</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <AssignmentOverview />
        </TabsContent>

        <TabsContent value="individual">
          <IndividualAssignment />
        </TabsContent>

        <TabsContent value="bulk">
          <BulkAssignment />
        </TabsContent>

        <TabsContent value="teachers">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Teacher Workload Summary</CardTitle>
                <CardDescription>Current advisor load for all active teachers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {teachersData.filter(t => t.isActive).map(teacher => (
                    <div key={teacher.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4">
                          <div>
                            <h4 className="font-medium">{teacher.name}</h4>
                            <p className="text-sm text-gray-600">{teacher.employeeId} - {teacher.designation}</p>
                          </div>
                          <div className="text-sm">
                            <p>{teacher.department}</p>
                            <p className="text-gray-500">{teacher.email}</p>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {teacher.specialization.map(spec => (
                              <Badge key={spec} variant="outline" className="text-xs">
                                {spec}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-2">
                          <span className={`font-semibold ${teacher.currentAdvisees >= teacher.maxAdviseeLimit ? 'text-red-600' : 'text-green-600'}`}>
                            {teacher.currentAdvisees}/{teacher.maxAdviseeLimit}
                          </span>
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${teacher.currentAdvisees >= teacher.maxAdviseeLimit ? 'bg-red-500' : 'bg-green-500'}`}
                              style={{ width: `${(teacher.currentAdvisees / teacher.maxAdviseeLimit) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {teacher.maxAdviseeLimit - teacher.currentAdvisees} available
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
