import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  FileText,
  Download,
  Eye,
  Search,
  Filter,
  RefreshCw,
  CheckCircle,
  Clock,
  AlertCircle,
  User,
  Calendar
} from 'lucide-react'

// Mock student data for admit cards
const mockStudentData = [
  {
    id: '2021-1-60-001',
    name: 'Ahmed Hassan Rahman',
    department: 'CSE',
    program: 'Computer Science & Engineering',
    semester: 'Fall 2024',
    semesterNo: 8,
    term: 'Final',
    status: 'generated',
    generatedDate: '2024-11-15',
    rollNo: '210160001',
    regNo: 'CSE-2021-001',
    profileImage: '/placeholder-avatar.jpg'
  },
  {
    id: '2021-1-60-002',
    name: 'Fatima Khan',
    department: 'CSE',
    program: 'Computer Science & Engineering',
    semester: 'Fall 2024',
    semesterNo: 8,
    term: 'Final',
    status: 'pending',
    generatedDate: null,
    rollNo: '210160002',
    regNo: 'CSE-2021-002',
    profileImage: '/placeholder-avatar.jpg'
  },
  {
    id: '2021-2-50-015',
    name: 'Mohammad Ali',
    department: 'BBA',
    program: 'Bachelor of Business Administration',
    semester: 'Fall 2024',
    semesterNo: 6,
    term: 'Final',
    status: 'generated',
    generatedDate: '2024-11-14',
    rollNo: '210250015',
    regNo: 'BBA-2021-015',
    profileImage: '/placeholder-avatar.jpg'
  },
  {
    id: '2022-1-60-025',
    name: 'Sarah Ahmed',
    department: 'CSE',
    program: 'Computer Science & Engineering',
    semester: 'Fall 2024',
    semesterNo: 6,
    term: 'Final',
    status: 'generated',
    generatedDate: '2024-11-16',
    rollNo: '220160025',
    regNo: 'CSE-2022-025',
    profileImage: '/placeholder-avatar.jpg'
  },
  {
    id: '2020-3-70-008',
    name: 'Rahman Hossain',
    department: 'EEE',
    program: 'Electrical & Electronic Engineering',
    semester: 'Fall 2024',
    semesterNo: 9,
    term: 'Final',
    status: 'pending',
    generatedDate: null,
    rollNo: '200370008',
    regNo: 'EEE-2020-008',
    profileImage: '/placeholder-avatar.jpg'
  },
  {
    id: '2021-2-50-030',
    name: 'Nusrat Jahan',
    department: 'BBA',
    program: 'Bachelor of Business Administration',
    semester: 'Fall 2024',
    semesterNo: 6,
    term: 'Final',
    status: 'generated',
    generatedDate: '2024-11-13',
    rollNo: '210250030',
    regNo: 'BBA-2021-030',
    profileImage: '/placeholder-avatar.jpg'
  }
]

const mockCourses = [
  { code: 'CSE401', name: 'Software Engineering', examDate: '2024-12-20', examTime: '09:00 AM - 12:00 PM', room: 'Room 301' },
  { code: 'CSE403', name: 'Database Systems', examDate: '2024-12-22', examTime: '02:00 PM - 05:00 PM', room: 'Room 302' },
  { code: 'CSE405', name: 'Computer Networks', examDate: '2024-12-24', examTime: '09:00 AM - 12:00 PM', room: 'Room 303' },
  { code: 'BBA401', name: 'Strategic Management', examDate: '2024-12-21', examTime: '10:00 AM - 01:00 PM', room: 'Room 201' },
  { code: 'EEE301', name: 'Circuit Analysis', examDate: '2024-12-23', examTime: '02:00 PM - 05:00 PM', room: 'Room 401' }
]

interface AdmitCardReportProps {
  onClose?: () => void
}

export const AdmitCardReport = ({ onClose }: AdmitCardReportProps) => {
  const [filters, setFilters] = useState({
    semester: 'Fall 2024',
    department: 'all',
    term: 'Final',
    status: 'all',
    searchTerm: ''
  })
  const [selectedStudent, setSelectedStudent] = useState<any>(null)
  const [showAdmitCard, setShowAdmitCard] = useState(false)
  const [generatingCards, setGeneratingCards] = useState<string[]>([])

  const departments = [...new Set(mockStudentData.map(s => s.department))]
  const semesters = ['Fall 2024', 'Spring 2024', 'Summer 2024']
  const terms = ['Midterm', 'Final']

  const filteredStudents = mockStudentData.filter(student => {
    const matchesSemester = filters.semester === 'all' || student.semester === filters.semester
    const matchesDepartment = filters.department === 'all' || student.department === filters.department
    const matchesTerm = filters.term === 'all' || student.term === filters.term
    const matchesStatus = filters.status === 'all' || student.status === filters.status
    const matchesSearch = !filters.searchTerm || 
      student.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      student.id.toLowerCase().includes(filters.searchTerm.toLowerCase())
    
    return matchesSemester && matchesDepartment && matchesTerm && matchesStatus && matchesSearch
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'generated':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Generated</Badge>
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />Pending</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800"><AlertCircle className="w-3 h-3 mr-1" />Unknown</Badge>
    }
  }

  const handleViewAdmitCard = (student: any) => {
    setSelectedStudent(student)
    setShowAdmitCard(true)
  }

  const handleGenerateAdmitCard = (studentId: string) => {
    setGeneratingCards([...generatingCards, studentId])
    
    setTimeout(() => {
      setGeneratingCards(generatingCards.filter(id => id !== studentId))
      // Update student status in real implementation
      alert(`Admit card generated successfully for student ${studentId}`)
    }, 2000)
  }

  const handleBulkGenerate = () => {
    const pendingStudents = filteredStudents.filter(s => s.status === 'pending')
    if (pendingStudents.length === 0) {
      alert('No pending admit cards to generate')
      return
    }
    
    if (confirm(`Generate admit cards for ${pendingStudents.length} students?`)) {
      alert(`Generating ${pendingStudents.length} admit cards...`)
    }
  }

  const handleExportList = () => {
    alert(`Exporting admit card list for ${filteredStudents.length} students...`)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-deep-plum">Admit Card Report</h2>
          <p className="text-gray-600">Manage and generate student admit cards for examinations</p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={handleBulkGenerate} className="bg-green-600 hover:bg-green-700">
            <RefreshCw className="w-4 h-4 mr-2" />
            Generate Pending Cards
          </Button>
          <Button onClick={handleExportList} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export List
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="w-5 h-5" />
            <span>Filters</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-5 gap-4">
            <div className="space-y-2">
              <Label>Semester</Label>
              <Select value={filters.semester} onValueChange={(value) => setFilters({...filters, semester: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {semesters.map(semester => (
                    <SelectItem key={semester} value={semester}>{semester}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Department</Label>
              <Select value={filters.department} onValueChange={(value) => setFilters({...filters, department: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {departments.map(dept => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Term</Label>
              <Select value={filters.term} onValueChange={(value) => setFilters({...filters, term: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {terms.map(term => (
                    <SelectItem key={term} value={term}>{term}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={filters.status} onValueChange={(value) => setFilters({...filters, status: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="generated">Generated</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Search</Label>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Student name or ID"
                  value={filters.searchTerm}
                  onChange={(e) => setFilters({...filters, searchTerm: e.target.value})}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Students</p>
                <p className="text-2xl font-bold text-blue-600">{filteredStudents.length}</p>
              </div>
              <User className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Generated</p>
                <p className="text-2xl font-bold text-green-600">
                  {filteredStudents.filter(s => s.status === 'generated').length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {filteredStudents.filter(s => s.status === 'pending').length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Departments</p>
                <p className="text-2xl font-bold text-purple-600">{departments.length}</p>
              </div>
              <FileText className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Students Table */}
      <Card>
        <CardHeader>
          <CardTitle>Student Admit Card List</CardTitle>
          <CardDescription>
            {filteredStudents.length} students found with current filters
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student ID</TableHead>
                <TableHead>Student Name</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Semester</TableHead>
                <TableHead>Semester No.</TableHead>
                <TableHead>Term</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Generated Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">{student.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-xs font-semibold text-blue-600">
                          {student.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </span>
                      </div>
                      <span>{student.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{student.department}</Badge>
                  </TableCell>
                  <TableCell>{student.semester}</TableCell>
                  <TableCell>
                    <Badge className="bg-purple-100 text-purple-800">{student.semesterNo}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className="bg-blue-100 text-blue-800">{student.term}</Badge>
                  </TableCell>
                  <TableCell>{getStatusBadge(student.status)}</TableCell>
                  <TableCell>{student.generatedDate || '-'}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      {student.status === 'generated' ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewAdmitCard(student)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => handleGenerateAdmitCard(student.id)}
                          disabled={generatingCards.includes(student.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          {generatingCards.includes(student.id) ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                          ) : (
                            <FileText className="w-4 h-4" />
                          )}
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredStudents.length === 0 && (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">No Students Found</h3>
              <p className="text-gray-500">No students match your current filter criteria</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Individual Admit Card Modal */}
      <Dialog open={showAdmitCard} onOpenChange={setShowAdmitCard}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Admit Card - {selectedStudent?.name}</DialogTitle>
          </DialogHeader>

          {selectedStudent && (
            <div className="space-y-6">
              {/* Admit Card Header */}
              <div className="text-center border-b pb-4">
                <h2 className="text-xl font-bold text-deep-plum">Northern University Bangladesh</h2>
                <p className="text-gray-600">Examination Admit Card</p>
                <p className="text-sm font-semibold">{selectedStudent.semester} - {selectedStudent.term} Examination</p>
              </div>

              {/* Student Information */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Student Name</Label>
                    <p className="font-semibold">{selectedStudent.name}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Student ID</Label>
                    <p className="font-semibold">{selectedStudent.id}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Registration No</Label>
                    <p className="font-semibold">{selectedStudent.regNo}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Roll No</Label>
                    <p className="font-semibold">{selectedStudent.rollNo}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Program</Label>
                    <p className="font-semibold">{selectedStudent.program}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Department</Label>
                    <p className="font-semibold">{selectedStudent.department}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Semester</Label>
                    <p className="font-semibold">{selectedStudent.semester} (Semester {selectedStudent.semesterNo})</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Generated Date</Label>
                    <p className="font-semibold">{selectedStudent.generatedDate}</p>
                  </div>
                </div>
              </div>

              {/* Exam Schedule */}
              <div>
                <h3 className="font-semibold text-deep-plum mb-3">Examination Schedule</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Course Code</TableHead>
                      <TableHead>Course Name</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Room</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockCourses
                      .filter(course => 
                        (selectedStudent.department === 'CSE' && course.code.startsWith('CSE')) ||
                        (selectedStudent.department === 'BBA' && course.code.startsWith('BBA')) ||
                        (selectedStudent.department === 'EEE' && course.code.startsWith('EEE'))
                      )
                      .slice(0, 3)
                      .map((course) => (
                        <TableRow key={course.code}>
                          <TableCell className="font-medium">{course.code}</TableCell>
                          <TableCell>{course.name}</TableCell>
                          <TableCell>{course.examDate}</TableCell>
                          <TableCell>{course.examTime}</TableCell>
                          <TableCell>{course.room}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>

              {/* Instructions */}
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="font-semibold text-yellow-800 mb-2">Important Instructions:</h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Students must bring this admit card to the examination hall</li>
                  <li>• Students must bring valid ID card along with admit card</li>
                  <li>• Students must arrive 30 minutes before the exam time</li>
                  <li>• Mobile phones and electronic devices are strictly prohibited</li>
                  <li>• Students will not be allowed to enter after 30 minutes of exam start</li>
                </ul>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowAdmitCard(false)}>
                  Close
                </Button>
                <Button onClick={() => alert('Downloading admit card...')}>
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
