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
  ArrowRight, 
  Download, 
  Upload,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Filter,
  RotateCcw,
  UserCheck,
  FileText,
  Calendar,
  BookOpen
} from 'lucide-react'

interface Student {
  id: string
  studentId: string
  name: string
  program: string
  semester: string
  courseCode: string
  currentSection: string
  email: string
  phone: string
  cgpa: number
  registrationStatus: 'active' | 'hold' | 'dropped'
}

interface SectionChangeRequest {
  id: string
  studentId: string
  studentName: string
  courseCode: string
  courseName: string
  fromSection: string
  toSection: string
  reason: string
  requestDate: string
  status: 'pending' | 'approved' | 'rejected'
  processedBy?: string
  processedDate?: string
  notes?: string
}

// Mock data for students
const studentsData: Student[] = [
  {
    id: '1',
    studentId: '2021-1-60-001',
    name: 'Ahmed Rahman',
    program: 'CSE',
    semester: 'Fall 2024',
    courseCode: 'CSE401',
    currentSection: 'A',
    email: 'ahmed.rahman@student.nu.edu.bd',
    phone: '+880 1712-345678',
    cgpa: 3.75,
    registrationStatus: 'active'
  },
  {
    id: '2',
    studentId: '2021-1-60-002',
    name: 'Fatima Khan',
    program: 'CSE',
    semester: 'Fall 2024',
    courseCode: 'CSE401',
    currentSection: 'A',
    email: 'fatima.khan@student.nu.edu.bd',
    phone: '+880 1789-123456',
    cgpa: 3.92,
    registrationStatus: 'active'
  },
  {
    id: '3',
    studentId: '2021-1-60-003',
    name: 'Mohammad Ali',
    program: 'CSE',
    semester: 'Fall 2024',
    courseCode: 'CSE401',
    currentSection: 'B',
    email: 'mohammad.ali@student.nu.edu.bd',
    phone: '+880 1987-654321',
    cgpa: 3.25,
    registrationStatus: 'active'
  },
  {
    id: '4',
    studentId: '2022-1-60-004',
    name: 'Ayesha Ahmed',
    program: 'BBA',
    semester: 'Fall 2024',
    courseCode: 'BBA401',
    currentSection: 'A',
    email: 'ayesha.ahmed@student.nu.edu.bd',
    phone: '+880 1876-543210',
    cgpa: 3.68,
    registrationStatus: 'active'
  },
  {
    id: '5',
    studentId: '2022-1-60-005',
    name: 'Rashid Hasan',
    program: 'EEE',
    semester: 'Fall 2024',
    courseCode: 'EEE201',
    currentSection: 'A',
    email: 'rashid.hasan@student.nu.edu.bd',
    phone: '+880 1567-891234',
    cgpa: 3.45,
    registrationStatus: 'active'
  }
]

// Mock data for change requests
const changeRequests: SectionChangeRequest[] = [
  {
    id: '1',
    studentId: '2021-1-60-001',
    studentName: 'Ahmed Rahman',
    courseCode: 'CSE401',
    courseName: 'Software Engineering',
    fromSection: 'A',
    toSection: 'B',
    reason: 'Schedule conflict with part-time job',
    requestDate: '2024-01-15',
    status: 'pending'
  },
  {
    id: '2',
    studentId: '2021-1-60-007',
    studentName: 'Sarah Khan',
    courseCode: 'CSE303',
    courseName: 'Data Structures',
    fromSection: 'B',
    toSection: 'A',
    reason: 'Medical reasons - need morning classes',
    requestDate: '2024-01-14',
    status: 'approved',
    processedBy: 'Admin User',
    processedDate: '2024-01-14',
    notes: 'Approved due to medical documentation'
  },
  {
    id: '3',
    studentId: '2021-1-60-008',
    studentName: 'Ali Hassan',
    courseCode: 'BBA201',
    courseName: 'Marketing Principles',
    fromSection: 'C',
    toSection: 'A',
    reason: 'Better instructor preference',
    requestDate: '2024-01-13',
    status: 'rejected',
    processedBy: 'Admin User',
    processedDate: '2024-01-13',
    notes: 'Section A is full, no capacity available'
  }
]

// Available sections for different courses
const courseSections = {
  'CSE401': [
    { section: 'A', capacity: 50, enrolled: 48, instructor: 'Dr. Ahmad Hassan', schedule: 'Sun, Tue 10:00-11:30' },
    { section: 'B', capacity: 50, enrolled: 42, instructor: 'Prof. Sarah Ahmed', schedule: 'Mon, Wed 14:00-15:30' },
    { section: 'C', capacity: 45, enrolled: 35, instructor: 'Dr. Rahman Ali', schedule: 'Thu, Fri 08:00-09:30' }
  ],
  'BBA401': [
    { section: 'A', capacity: 40, enrolled: 38, instructor: 'Dr. Fatima Rahman', schedule: 'Sun, Tue 14:00-15:30' },
    { section: 'B', capacity: 40, enrolled: 32, instructor: 'Prof. Ahmed Hassan', schedule: 'Mon, Wed 10:00-11:30' }
  ],
  'EEE201': [
    { section: 'A', capacity: 45, enrolled: 41, instructor: 'Dr. Electrical Expert', schedule: 'Sun, Tue 08:00-09:30' },
    { section: 'B', capacity: 45, enrolled: 39, instructor: 'Prof. Circuit Master', schedule: 'Thu, Fri 14:00-15:30' }
  ]
}

function IndividualSectionChange() {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [targetSection, setTargetSection] = useState('')
  const [changeReason, setChangeReason] = useState('')

  const filteredStudents = studentsData.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.studentId.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSectionChange = () => {
    if (!selectedStudent || !targetSection || !changeReason) {
      alert('Please fill all required fields')
      return
    }

    const sections = courseSections[selectedStudent.courseCode as keyof typeof courseSections]
    const targetSectionData = sections?.find(s => s.section === targetSection)
    
    if (targetSectionData && targetSectionData.enrolled >= targetSectionData.capacity) {
      alert(`Cannot change to Section ${targetSection}: Section is full (${targetSectionData.enrolled}/${targetSectionData.capacity})`)
      return
    }

    alert(`Section change processed successfully!\n${selectedStudent.name} moved from Section ${selectedStudent.currentSection} to Section ${targetSection}`)
    setSelectedStudent(null)
    setTargetSection('')
    setChangeReason('')
  }

  return (
    <div className="space-y-6">
      {/* Search Students */}
      <Card>
        <CardHeader>
          <CardTitle>Search Student</CardTitle>
          <CardDescription>Find student by name or ID for section change</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search by student name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {searchTerm && (
            <div className="mt-4 space-y-2 max-h-64 overflow-y-auto">
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
                        <span>{student.courseCode} - Section {student.currentSection}</span>
                        <Badge variant={student.registrationStatus === 'active' ? 'default' : 'destructive'}>
                          {student.registrationStatus}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right text-sm">
                      <p>CGPA: {student.cgpa}</p>
                      <p className="text-gray-500">{student.semester}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Section Change Form */}
      {selectedStudent && (
        <Card>
          <CardHeader>
            <CardTitle>Section Change Details</CardTitle>
            <CardDescription>
              Processing section change for {selectedStudent.name}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Current Information</Label>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="font-medium">{selectedStudent.name}</p>
                  <p className="text-sm text-gray-600">{selectedStudent.studentId}</p>
                  <p className="text-sm">{selectedStudent.courseCode} - Section {selectedStudent.currentSection}</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label>New Section</Label>
                <Select value={targetSection} onValueChange={setTargetSection}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select new section" />
                  </SelectTrigger>
                  <SelectContent>
                    {courseSections[selectedStudent.courseCode as keyof typeof courseSections]?.map(section => (
                      <SelectItem 
                        key={section.section} 
                        value={section.section}
                        disabled={section.section === selectedStudent.currentSection || section.enrolled >= section.capacity}
                      >
                        Section {section.section} - {section.enrolled}/{section.capacity} 
                        ({section.instructor})
                        {section.enrolled >= section.capacity && ' (Full)'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {targetSection && (
              <div className="p-3 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">Target Section Details</h4>
                {(() => {
                  const sectionData = courseSections[selectedStudent.courseCode as keyof typeof courseSections]?.find(s => s.section === targetSection)
                  return sectionData ? (
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p><span className="font-medium">Instructor:</span> {sectionData.instructor}</p>
                        <p><span className="font-medium">Schedule:</span> {sectionData.schedule}</p>
                      </div>
                      <div>
                        <p><span className="font-medium">Capacity:</span> {sectionData.enrolled}/{sectionData.capacity}</p>
                        <p><span className="font-medium">Available Slots:</span> {sectionData.capacity - sectionData.enrolled}</p>
                      </div>
                    </div>
                  ) : null
                })()}
              </div>
            )}

            <div className="space-y-2">
              <Label>Reason for Change</Label>
              <Input
                placeholder="Enter reason for section change..."
                value={changeReason}
                onChange={(e) => setChangeReason(e.target.value)}
              />
            </div>

            <div className="flex justify-end space-x-3">
              <Button 
                variant="outline" 
                onClick={() => {
                  setSelectedStudent(null)
                  setTargetSection('')
                  setChangeReason('')
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleSectionChange}>
                <UserCheck className="w-4 h-4 mr-2" />
                Process Change
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function BulkSectionChange() {
  const [selectedStudents, setSelectedStudents] = useState<Set<string>>(new Set())
  const [filterSemester, setFilterSemester] = useState('')
  const [filterProgram, setFilterProgram] = useState('')
  const [filterCourse, setFilterCourse] = useState('')
  const [bulkTargetSection, setBulkTargetSection] = useState('')
  const [bulkReason, setBulkReason] = useState('')

  const filteredStudents = studentsData.filter(student => {
    return (!filterSemester || student.semester === filterSemester) &&
           (!filterProgram || student.program === filterProgram) &&
           (!filterCourse || student.courseCode === filterCourse)
  })

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

  const handleBulkChange = () => {
    if (selectedStudents.size === 0 || !bulkTargetSection || !bulkReason) {
      alert('Please select students, target section, and provide a reason')
      return
    }

    alert(`Bulk section change processed for ${selectedStudents.size} students to Section ${bulkTargetSection}`)
    setSelectedStudents(new Set())
    setBulkTargetSection('')
    setBulkReason('')
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Students</CardTitle>
          <CardDescription>Filter students by semester, program, or course</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Semester</Label>
              <Select value={filterSemester} onValueChange={setFilterSemester}>
                <SelectTrigger>
                  <SelectValue placeholder="All Semesters" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Semesters</SelectItem>
                  <SelectItem value="Fall 2024">Fall 2024</SelectItem>
                  <SelectItem value="Spring 2024">Spring 2024</SelectItem>
                  <SelectItem value="Summer 2024">Summer 2024</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Program</Label>
              <Select value={filterProgram} onValueChange={setFilterProgram}>
                <SelectTrigger>
                  <SelectValue placeholder="All Programs" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Programs</SelectItem>
                  <SelectItem value="CSE">CSE</SelectItem>
                  <SelectItem value="BBA">BBA</SelectItem>
                  <SelectItem value="EEE">EEE</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Course Code</Label>
              <Select value={filterCourse} onValueChange={setFilterCourse}>
                <SelectTrigger>
                  <SelectValue placeholder="All Courses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Courses</SelectItem>
                  <SelectItem value="CSE401">CSE401</SelectItem>
                  <SelectItem value="BBA401">BBA401</SelectItem>
                  <SelectItem value="EEE201">EEE201</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => {
                  setFilterSemester('')
                  setFilterProgram('')
                  setFilterCourse('')
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
              <CardTitle>Students List ({filteredStudents.length})</CardTitle>
              <CardDescription>
                Select students for bulk section change. {selectedStudents.size} selected.
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
                        <span>{student.courseCode} - Section {student.currentSection}</span>
                      </div>
                    </div>
                    <Badge variant={student.registrationStatus === 'active' ? 'default' : 'destructive'}>
                      {student.registrationStatus}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Bulk Change Controls */}
      {selectedStudents.size > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Bulk Section Change</CardTitle>
            <CardDescription>
              Processing section change for {selectedStudents.size} selected students
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Target Section</Label>
                <Select value={bulkTargetSection} onValueChange={setBulkTargetSection}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select new section" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A">Section A</SelectItem>
                    <SelectItem value="B">Section B</SelectItem>
                    <SelectItem value="C">Section C</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Reason</Label>
                <Input
                  placeholder="Reason for bulk change..."
                  value={bulkReason}
                  onChange={(e) => setBulkReason(e.target.value)}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setSelectedStudents(new Set())}>
                Clear Selection
              </Button>
              <Button onClick={handleBulkChange}>
                <Users className="w-4 h-4 mr-2" />
                Process Bulk Change
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function ChangeRequests() {
  const [statusFilter, setStatusFilter] = useState('all')

  const filteredRequests = changeRequests.filter(request => 
    statusFilter === 'all' || request.status === statusFilter
  )

  const handleApproveRequest = (requestId: string) => {
    alert(`Change request ${requestId} approved`)
  }

  const handleRejectRequest = (requestId: string) => {
    const reason = prompt('Reason for rejection:')
    if (reason) {
      alert(`Change request ${requestId} rejected: ${reason}`)
    }
  }

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Requests</p>
                <p className="text-2xl font-bold text-deep-plum">{changeRequests.length}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {changeRequests.filter(r => r.status === 'pending').length}
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-green-600">
                  {changeRequests.filter(r => r.status === 'approved').length}
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
                <p className="text-sm font-medium text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-red-600">
                  {changeRequests.filter(r => r.status === 'rejected').length}
                </p>
              </div>
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <Label>Filter by Status:</Label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Requests</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <div className="text-sm text-gray-600">
              Showing {filteredRequests.length} of {changeRequests.length} requests
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Requests List */}
      <div className="space-y-4">
        {filteredRequests.map(request => (
          <Card key={request.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <h3 className="text-lg font-semibold">{request.studentName}</h3>
                    <span className="text-gray-600">({request.studentId})</span>
                    <Badge variant={
                      request.status === 'pending' ? 'secondary' :
                      request.status === 'approved' ? 'default' : 'destructive'
                    }>
                      {request.status}
                    </Badge>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Course & Section Change:</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="font-mono bg-gray-100 px-2 py-1 rounded text-sm">
                          {request.courseCode} - Section {request.fromSection}
                        </span>
                        <ArrowRight className="w-4 h-4 text-gray-400" />
                        <span className="font-mono bg-blue-100 px-2 py-1 rounded text-sm">
                          {request.courseCode} - Section {request.toSection}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{request.courseName}</p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-700">Request Details:</p>
                      <p className="text-sm text-gray-600 mt-1">Date: {request.requestDate}</p>
                      <p className="text-sm text-gray-600">Reason: {request.reason}</p>
                    </div>
                  </div>

                  {request.status !== 'pending' && (
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium text-gray-700">
                        {request.status === 'approved' ? 'Approved' : 'Rejected'} by {request.processedBy} on {request.processedDate}
                      </p>
                      {request.notes && (
                        <p className="text-sm text-gray-600 mt-1">Notes: {request.notes}</p>
                      )}
                    </div>
                  )}
                </div>

                {request.status === 'pending' && (
                  <div className="flex space-x-2">
                    <Button 
                      onClick={() => handleApproveRequest(request.id)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approve
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => handleRejectRequest(request.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default function StudentSectionChange() {
  const [activeTab, setActiveTab] = useState('individual')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-deep-plum">Student Section Change</h1>
          <p className="text-gray-600 mt-1">Manage student section changes individually or in bulk</p>
        </div>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="individual" className="flex items-center space-x-2">
            <UserCheck className="w-4 h-4" />
            <span>Individual Change</span>
          </TabsTrigger>
          <TabsTrigger value="bulk" className="flex items-center space-x-2">
            <Users className="w-4 h-4" />
            <span>Bulk Change</span>
          </TabsTrigger>
          <TabsTrigger value="requests" className="flex items-center space-x-2">
            <FileText className="w-4 h-4" />
            <span>Change Requests</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="individual">
          <IndividualSectionChange />
        </TabsContent>

        <TabsContent value="bulk">
          <BulkSectionChange />
        </TabsContent>

        <TabsContent value="requests">
          <ChangeRequests />
        </TabsContent>
      </Tabs>
    </div>
  )
}
