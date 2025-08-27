import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AdmitCardReport } from '@/components/admin/AdmitCardReport'
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
  Users,
  GraduationCap,
  BookOpen,
  BarChart3,
  TrendingUp,
  Award,
  Clock,
  Settings,
  FileSpreadsheet,
  FileType,
  File,
  Eye,
  Filter,
  Search,
  CheckCircle,
  AlertCircle
} from 'lucide-react'

interface ReportFilter {
  semester?: string
  program?: string
  term?: string
  teacherId?: string
  studentId?: string
  courseCode?: string
  cgpaThreshold?: number
  individual?: boolean
}

// Mock data for reports
const reportData = {
  semesters: ['Fall 2024', 'Spring 2024', 'Summer 2024', 'Fall 2023'],
  programs: ['CSE', 'BBA', 'EEE', 'Textile Engineering', 'B. Pharm'],
  terms: ['Midterm', 'Final'],
  teachers: [
    { id: 'T001', name: 'Dr. Rahman Ahmed', advisees: 22 },
    { id: 'T002', name: 'Prof. Sarah Khan', advisees: 18 },
    { id: 'T003', name: 'Dr. Mohammad Ali', advisees: 15 }
  ],
  courses: [
    { code: 'CSE401', name: 'Software Engineering', registered: 120 },
    { code: 'CSE403', name: 'Database Systems', registered: 95 },
    { code: 'BBA401', name: 'Strategic Management', registered: 80 }
  ]
}

function StudentReports() {
  const [filters, setFilters] = useState<ReportFilter>({})
  const [selectedReportType, setSelectedReportType] = useState('all')
  const [showDetailedView, setShowDetailedView] = useState(false)
  const [reportData, setReportData] = useState<any>(null)

  const studentReportTypes = [
    { 
      id: 'admit-card',
      name: 'Admit Card',
      description: 'Generate admit cards for examinations',
      filters: ['semester', 'program', 'term', 'individual']
    },
    {
      id: 'registered-list',
      name: 'Registered Students List',
      description: 'List of registered students with multiple filter options',
      filters: ['semester', 'program', 'individual']
    },
    {
      id: 'registered-with-courses',
      name: 'Registered Students with Taken Courses',
      description: 'Students list including their registered courses',
      filters: ['semester', 'program']
    },
    {
      id: 'registered-with-credits',
      name: 'Registered Students with Taken Credits',
      description: 'Students list with credit information',
      filters: ['semester', 'program']
    },
    {
      id: 'registered-number',
      name: 'Registered Students Number',
      description: 'Count of registered students by category',
      filters: ['semester', 'program']
    },
    {
      id: 'registered-retake',
      name: 'Registered Students with Retake',
      description: 'Students who are retaking courses',
      filters: ['semester', 'program']
    },
    {
      id: 'unregistered-previous',
      name: 'Unregistered in Previous Semester',
      description: 'Students who missed previous semester registration',
      filters: ['semester', 'program']
    },
    {
      id: 'dropout-list',
      name: 'Dropout Students List',
      description: 'List of students who have dropped out',
      filters: ['semester', 'program']
    },
    {
      id: 'dropout-number',
      name: 'Dropout Students Number',
      description: 'Count of dropout students',
      filters: ['semester', 'program']
    },
    {
      id: 'completed-list',
      name: 'Completed Students List',
      description: 'Students who have completed their degree',
      filters: ['semester', 'program']
    },
    {
      id: 'completed-with-address',
      name: 'Completed Students with Address',
      description: 'Completed students including address information',
      filters: ['semester', 'program']
    },
    {
      id: 'earned-credit-cgpa',
      name: 'Students with Earned Credit & CGPA',
      description: 'Academic performance summary',
      filters: ['semester', 'program']
    },
    {
      id: 'pending-approval',
      name: 'Registrations Pending Advisor Approval',
      description: 'Students awaiting advisor approval',
      filters: ['semester', 'program']
    }
  ]

  const handleGenerateReport = () => {
    if (!selectedReportType) {
      alert('Please select a report type')
      return
    }

    const reportType = studentReportTypes.find(r => r.id === selectedReportType)

    // For admit card, show detailed view
    if (selectedReportType === 'admit-card') {
      setShowDetailedView(true)
      return
    }

    // Generate mock data for other reports
    const mockData = generateMockReportData(selectedReportType)
    setReportData(mockData)
    setShowDetailedView(true)
  }

  const generateMockReportData = (reportType: string) => {
    switch (reportType) {
      case 'registered-list':
        return {
          title: 'Registered Students List',
          data: [
            { id: '2021-1-60-001', name: 'Ahmed Hassan', program: 'CSE', semester: 'Fall 2024', status: 'Active', credits: 18 },
            { id: '2021-1-60-002', name: 'Fatima Khan', program: 'CSE', semester: 'Fall 2024', status: 'Active', credits: 15 },
            { id: '2021-2-50-015', name: 'Mohammad Ali', program: 'BBA', semester: 'Fall 2024', status: 'Active', credits: 12 }
          ],
          columns: ['Student ID', 'Name', 'Program', 'Semester', 'Status', 'Credits']
        }
      case 'registered-with-courses':
        return {
          title: 'Registered Students with Taken Courses',
          data: [
            { id: '2021-1-60-001', name: 'Ahmed Hassan', courses: 'CSE401, CSE403, CSE405', totalCredits: 12 },
            { id: '2021-1-60-002', name: 'Fatima Khan', courses: 'CSE401, CSE403, BBA301', totalCredits: 9 }
          ],
          columns: ['Student ID', 'Name', 'Registered Courses', 'Total Credits']
        }
      case 'dropout-list':
        return {
          title: 'Dropout Students List',
          data: [
            { id: '2020-1-60-010', name: 'John Smith', program: 'CSE', lastSemester: 'Spring 2023', reason: 'Academic Performance' },
            { id: '2020-2-50-025', name: 'Sara Wilson', program: 'BBA', lastSemester: 'Fall 2023', reason: 'Personal Reasons' }
          ],
          columns: ['Student ID', 'Name', 'Program', 'Last Semester', 'Reason']
        }
      case 'completed-list':
        return {
          title: 'Completed Students List',
          data: [
            { id: '2018-1-60-001', name: 'Ali Rahman', program: 'CSE', cgpa: 3.85, completionDate: '2024-01-15' },
            { id: '2018-2-50-010', name: 'Nusrat Jahan', program: 'BBA', cgpa: 3.92, completionDate: '2024-01-15' }
          ],
          columns: ['Student ID', 'Name', 'Program', 'CGPA', 'Completion Date']
        }
      default:
        return {
          title: reportType,
          data: [],
          columns: []
        }
    }
  }

  const handleExport = (format: 'pdf' | 'excel' | 'word') => {
    if (!selectedReportType) {
      alert('Please generate a report first')
      return
    }

    const reportType = studentReportTypes.find(r => r.id === selectedReportType)
    alert(`Exporting ${reportType?.name} as ${format.toUpperCase()}...`)
  }

  if (showDetailedView) {
    if (selectedReportType === 'admit-card') {
      return <AdmitCardReport onClose={() => setShowDetailedView(false)} />
    }

    if (reportData) {
      return (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-deep-plum">{reportData.title}</h2>
              <p className="text-gray-600">Generated report based on selected filters</p>
            </div>
            <div className="flex space-x-2">
              <Button onClick={() => setShowDetailedView(false)} variant="outline">
                Back to Reports
              </Button>
              <Button onClick={() => alert('Exporting report...')}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          <Card>
            <CardContent className="p-0">
              {reportData.data.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      {reportData.columns.map((column: string, index: number) => (
                        <TableHead key={index}>{column}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reportData.data.map((row: any, index: number) => (
                      <TableRow key={index}>
                        {Object.values(row).map((value: any, cellIndex: number) => (
                          <TableCell key={cellIndex}>{value}</TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">No Data Found</h3>
                  <p className="text-gray-500">No records match the selected criteria</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )
    }
  }

  return (
    <div className="space-y-6">
      {/* Report Type Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Student Reports</CardTitle>
          <CardDescription>Select report type and configure filters</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Report Type</Label>
              <Select value={selectedReportType} onValueChange={setSelectedReportType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  {studentReportTypes.map(report => (
                    <SelectItem key={report.id} value={report.id}>
                      {report.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedReportType && (
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-blue-800 font-medium">
                  {studentReportTypes.find(r => r.id === selectedReportType)?.name}
                </p>
                <p className="text-blue-700 text-sm">
                  {studentReportTypes.find(r => r.id === selectedReportType)?.description}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      {selectedReportType && (
        <Card>
          <CardHeader>
            <CardTitle>Report Filters</CardTitle>
            <CardDescription>Configure filters for your report</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              {studentReportTypes.find(r => r.id === selectedReportType)?.filters.includes('semester') && (
                <div className="space-y-2">
                  <Label>Semester</Label>
                  <Select value={filters.semester || ''} onValueChange={(value) => setFilters({...filters, semester: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select semester" />
                    </SelectTrigger>
                    <SelectContent>
                      {reportData.semesters.map(semester => (
                        <SelectItem key={semester} value={semester}>{semester}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {studentReportTypes.find(r => r.id === selectedReportType)?.filters.includes('program') && (
                <div className="space-y-2">
                  <Label>Program</Label>
                  <Select value={filters.program || ''} onValueChange={(value) => setFilters({...filters, program: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select program" />
                    </SelectTrigger>
                    <SelectContent>
                      {reportData.programs.map(program => (
                        <SelectItem key={program} value={program}>{program}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {studentReportTypes.find(r => r.id === selectedReportType)?.filters.includes('term') && (
                <div className="space-y-2">
                  <Label>Term</Label>
                  <Select value={filters.term || ''} onValueChange={(value) => setFilters({...filters, term: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select term" />
                    </SelectTrigger>
                    <SelectContent>
                      {reportData.terms.map(term => (
                        <SelectItem key={term} value={term}>{term}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {studentReportTypes.find(r => r.id === selectedReportType)?.filters.includes('individual') && (
                <div className="space-y-2">
                  <Label>Student ID (Individual)</Label>
                  <Input
                    placeholder="Enter student ID"
                    value={filters.studentId || ''}
                    onChange={(e) => setFilters({...filters, studentId: e.target.value})}
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <Button variant="outline" onClick={() => setFilters({})}>
                Clear Filters
              </Button>
              <Button onClick={handleGenerateReport}>
                <BarChart3 className="w-4 h-4 mr-2" />
                Generate Report
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Export Options */}
      {selectedReportType && (
        <Card>
          <CardHeader>
            <CardTitle>Export Report</CardTitle>
            <CardDescription>Download report in your preferred format</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-4">
              <Button onClick={() => handleExport('pdf')} variant="outline">
                <FileType className="w-4 h-4 mr-2" />
                Export as PDF
              </Button>
              <Button onClick={() => handleExport('excel')} variant="outline">
                <FileSpreadsheet className="w-4 h-4 mr-2" />
                Export as Excel
              </Button>
              <Button onClick={() => handleExport('word')} variant="outline">
                <File className="w-4 h-4 mr-2" />
                Export as Word
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function AttendanceReports() {
  const [filters, setFilters] = useState<ReportFilter>({})
  const [selectedReportType, setSelectedReportType] = useState('all')
  const [showDetailedView, setShowDetailedView] = useState(false)
  const [reportData, setReportData] = useState<any>(null)

  const attendanceReportTypes = [
    {
      id: 'class-attendance',
      name: 'Class Attendance',
      description: 'Course-wise number of registered students (semester-wise & individual)',
      filters: ['semester', 'courseCode', 'individual']
    },
    {
      id: 'exam-attendance-missing',
      name: 'Students Absent in Mid Exam',
      description: 'List of students absent in midterm exam as reported by teachers',
      filters: ['semester', 'courseCode', 'program']
    },
    {
      id: 'exam-attendance-final',
      name: 'Final Exam Attendance List',
      description: 'Final exam attendance with "Y" mark for attended',
      filters: ['semester', 'courseCode', 'program']
    }
  ]

  const handleGenerateReport = () => {
    if (!selectedReportType) {
      alert('Please select a report type')
      return
    }

    const mockData = generateAttendanceReportData(selectedReportType)
    setReportData(mockData)
    setShowDetailedView(true)
  }

  const generateAttendanceReportData = (reportType: string) => {
    switch (reportType) {
      case 'class-attendance':
        return {
          title: 'Class Attendance Report',
          data: [
            { course: 'CSE401', courseName: 'Software Engineering', registered: 45, present: 42, absent: 3, percentage: '93.3%' },
            { course: 'CSE403', courseName: 'Database Systems', registered: 40, present: 38, absent: 2, percentage: '95.0%' },
            { course: 'BBA401', courseName: 'Strategic Management', registered: 35, present: 33, absent: 2, percentage: '94.3%' }
          ],
          columns: ['Course Code', 'Course Name', 'Registered', 'Present', 'Absent', 'Percentage']
        }
      case 'exam-attendance-missing':
        return {
          title: 'Students Absent in Mid Exam',
          data: [
            { id: '2021-1-60-005', name: 'Rahman Ali', course: 'CSE401', reason: 'Illness', status: 'Excused' },
            { id: '2021-1-60-010', name: 'Fatima Khatun', course: 'CSE403', reason: 'Family Emergency', status: 'Pending' },
            { id: '2021-2-50-008', name: 'Karim Hassan', course: 'BBA401', reason: 'Not Provided', status: 'Unexcused' }
          ],
          columns: ['Student ID', 'Student Name', 'Course', 'Reason', 'Status']
        }
      case 'exam-attendance-final':
        return {
          title: 'Final Exam Attendance List',
          data: [
            { id: '2021-1-60-001', name: 'Ahmed Hassan', course: 'CSE401', attended: 'Y', seat: 'A-15', hall: 'Hall-1' },
            { id: '2021-1-60-002', name: 'Fatima Khan', course: 'CSE401', attended: 'Y', seat: 'A-16', hall: 'Hall-1' },
            { id: '2021-1-60-003', name: 'Mohammad Ali', course: 'CSE401', attended: 'N', seat: 'A-17', hall: 'Hall-1' }
          ],
          columns: ['Student ID', 'Student Name', 'Course', 'Attended', 'Seat No', 'Exam Hall']
        }
      default:
        return { title: reportType, data: [], columns: [] }
    }
  }

  if (showDetailedView && reportData) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-deep-plum">{reportData.title}</h2>
            <p className="text-gray-600">Attendance report for {filters.semester || 'selected semester'}</p>
          </div>
          <div className="flex space-x-2">
            <Button onClick={() => setShowDetailedView(false)} variant="outline">
              Back to Reports
            </Button>
            <Button onClick={() => alert('Exporting attendance report...')}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  {reportData.columns.map((column: string, index: number) => (
                    <TableHead key={index}>{column}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {reportData.data.map((row: any, index: number) => (
                  <TableRow key={index}>
                    {Object.values(row).map((value: any, cellIndex: number) => (
                      <TableCell key={cellIndex}>
                        {cellIndex === reportData.columns.length - 1 && reportData.title.includes('Attendance Report') ? (
                          <Badge className={parseFloat(value) >= 90 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                            {value}
                          </Badge>
                        ) : (
                          value
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Attendance Reports</CardTitle>
          <CardDescription>Generate various attendance-related reports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Report Type</Label>
              <Select value={selectedReportType} onValueChange={setSelectedReportType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select attendance report type" />
                </SelectTrigger>
                <SelectContent>
                  {attendanceReportTypes.map(report => (
                    <SelectItem key={report.id} value={report.id}>
                      {report.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedReportType && (
              <>
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-green-800 font-medium">
                    {attendanceReportTypes.find(r => r.id === selectedReportType)?.name}
                  </p>
                  <p className="text-green-700 text-sm">
                    {attendanceReportTypes.find(r => r.id === selectedReportType)?.description}
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Semester</Label>
                    <Select value={filters.semester || ''} onValueChange={(value) => setFilters({...filters, semester: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select semester" />
                      </SelectTrigger>
                      <SelectContent>
                        {reportData.semesters.map(semester => (
                          <SelectItem key={semester} value={semester}>{semester}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Course Code</Label>
                    <Select value={filters.courseCode || ''} onValueChange={(value) => setFilters({...filters, courseCode: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select course" />
                      </SelectTrigger>
                      <SelectContent>
                        {reportData.courses.map(course => (
                          <SelectItem key={course.code} value={course.code}>
                            {course.code} - {course.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Program</Label>
                    <Select value={filters.program || ''} onValueChange={(value) => setFilters({...filters, program: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select program" />
                      </SelectTrigger>
                      <SelectContent>
                        {reportData.programs.map(program => (
                          <SelectItem key={program} value={program}>{program}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <Button variant="outline" onClick={() => setFilters({})}>
                    Clear Filters
                  </Button>
                  <Button onClick={handleGenerateReport}>
                    <Clock className="w-4 h-4 mr-2" />
                    Generate Report
                  </Button>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function TeacherReports() {
  const [filters, setFilters] = useState<ReportFilter>({})
  const [selectedReportType, setSelectedReportType] = useState('all')
  const [showDetailedView, setShowDetailedView] = useState(false)
  const [reportData, setReportData] = useState<any>(null)

  const teacherReportTypes = [
    {
      id: 'advising-list',
      name: 'Teachers Student Advising List',
      description: 'List of students advised by teachers with filter options',
      filters: ['semester', 'program', 'teacherId']
    },
    {
      id: 'course-load',
      name: 'Teachers Course Load Distribution',
      description: 'Teaching load distribution by semester, program, or individual',
      filters: ['semester', 'program', 'teacherId']
    }
  ]

  const handleGenerateReport = () => {
    if (!selectedReportType) {
      alert('Please select a report type')
      return
    }

    const mockData = generateTeacherReportData(selectedReportType)
    setReportData(mockData)
    setShowDetailedView(true)
  }

  const generateTeacherReportData = (reportType: string) => {
    switch (reportType) {
      case 'advising-list':
        return {
          title: 'Teachers Student Advising List',
          data: [
            { teacherId: 'T001', teacherName: 'Dr. Rahman Ahmed', department: 'CSE', advisees: 22, activeStudents: 20, graduatedStudents: 2 },
            { teacherId: 'T002', teacherName: 'Prof. Sarah Khan', department: 'CSE', advisees: 18, activeStudents: 16, graduatedStudents: 2 },
            { teacherId: 'T004', teacherName: 'Dr. Fatima Rahman', department: 'BBA', advisees: 15, activeStudents: 15, graduatedStudents: 0 }
          ],
          columns: ['Teacher ID', 'Teacher Name', 'Department', 'Total Advisees', 'Active Students', 'Graduated Students']
        }
      case 'course-load':
        return {
          title: 'Teachers Course Load Distribution',
          data: [
            { teacherId: 'T001', teacherName: 'Dr. Rahman Ahmed', semester: 'Fall 2024', courses: 3, sections: 4, totalStudents: 165, credits: 12 },
            { teacherId: 'T002', teacherName: 'Prof. Sarah Khan', semester: 'Fall 2024', courses: 2, sections: 3, totalStudents: 125, credits: 9 },
            { teacherId: 'T003', teacherName: 'Dr. Mohammad Ali', semester: 'Fall 2024', courses: 3, sections: 2, totalStudents: 85, credits: 9 }
          ],
          columns: ['Teacher ID', 'Teacher Name', 'Semester', 'Courses', 'Sections', 'Total Students', 'Credit Hours']
        }
      default:
        return { title: reportType, data: [], columns: [] }
    }
  }

  if (showDetailedView && reportData) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-deep-plum">{reportData.title}</h2>
            <p className="text-gray-600">Teacher report for {filters.semester || 'all semesters'}</p>
          </div>
          <div className="flex space-x-2">
            <Button onClick={() => setShowDetailedView(false)} variant="outline">
              Back to Reports
            </Button>
            <Button onClick={() => alert('Exporting teacher report...')}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  {reportData.columns.map((column: string, index: number) => (
                    <TableHead key={index}>{column}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {reportData.data.map((row: any, index: number) => (
                  <TableRow key={index}>
                    {Object.values(row).map((value: any, cellIndex: number) => (
                      <TableCell key={cellIndex}>{value}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Teacher Reports</CardTitle>
          <CardDescription>Generate reports related to teacher activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Report Type</Label>
              <Select value={selectedReportType} onValueChange={setSelectedReportType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select teacher report type" />
                </SelectTrigger>
                <SelectContent>
                  {teacherReportTypes.map(report => (
                    <SelectItem key={report.id} value={report.id}>
                      {report.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedReportType && (
              <>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <p className="text-purple-800 font-medium">
                    {teacherReportTypes.find(r => r.id === selectedReportType)?.name}
                  </p>
                  <p className="text-purple-700 text-sm">
                    {teacherReportTypes.find(r => r.id === selectedReportType)?.description}
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Teacher ID</Label>
                    <Select value={filters.teacherId || ''} onValueChange={(value) => setFilters({...filters, teacherId: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select teacher" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Teachers</SelectItem>
                        {reportData.teachers.map(teacher => (
                          <SelectItem key={teacher.id} value={teacher.id}>
                            {teacher.id} - {teacher.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Semester</Label>
                    <Select value={filters.semester || ''} onValueChange={(value) => setFilters({...filters, semester: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select semester" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Semesters</SelectItem>
                        {reportData.semesters.map(semester => (
                          <SelectItem key={semester} value={semester}>{semester}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Program</Label>
                    <Select value={filters.program || ''} onValueChange={(value) => setFilters({...filters, program: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select program" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Programs</SelectItem>
                        {reportData.programs.map(program => (
                          <SelectItem key={program} value={program}>{program}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <Button variant="outline" onClick={() => setFilters({})}>
                    Clear Filters
                  </Button>
                  <Button onClick={handleGenerateReport}>
                    <GraduationCap className="w-4 h-4 mr-2" />
                    Generate Report
                  </Button>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function AcademicReports() {
  const [filters, setFilters] = useState<ReportFilter>({})
  const [selectedReportType, setSelectedReportType] = useState('all')

  const academicReportTypes = [
    {
      id: 'student-results',
      name: 'Student Results',
      description: 'Filter students by CGPA threshold and show completed courses',
      filters: ['cgpaThreshold', 'semester', 'program']
    },
    {
      id: 'performance-report',
      name: 'Student Performance Report',
      description: 'Semester-wise and overall performance with remaining courses',
      filters: ['semester', 'program', 'individual']
    },
    {
      id: 'ter-reports',
      name: 'TER Reports',
      description: 'Semester-wise TER filling status (mandatory before results)',
      filters: ['semester', 'program']
    },
    {
      id: 'completed-incomplete',
      name: 'Completed/Incomplete Student List',
      description: 'Semester-wise and program-wise completion status',
      filters: ['semester', 'program']
    },
    {
      id: 'mark-sheet',
      name: 'Mark Sheet Hard Copy',
      description: 'List of offered courses and current student numbers',
      filters: ['semester', 'program', 'courseCode']
    }
  ]

  const handleGenerateReport = () => {
    if (!selectedReportType) {
      alert('Please select a report type')
      return
    }

    const reportType = academicReportTypes.find(r => r.id === selectedReportType)
    alert(`Generating ${reportType?.name} report...\nFilters applied: ${JSON.stringify(filters, null, 2)}`)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Academic Reports</CardTitle>
          <CardDescription>Generate academic performance and progress reports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Report Type</Label>
              <Select value={selectedReportType} onValueChange={setSelectedReportType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select academic report type" />
                </SelectTrigger>
                <SelectContent>
                  {academicReportTypes.map(report => (
                    <SelectItem key={report.id} value={report.id}>
                      {report.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedReportType && (
              <>
                <div className="p-3 bg-orange-50 rounded-lg">
                  <p className="text-orange-800 font-medium">
                    {academicReportTypes.find(r => r.id === selectedReportType)?.name}
                  </p>
                  <p className="text-orange-700 text-sm">
                    {academicReportTypes.find(r => r.id === selectedReportType)?.description}
                  </p>
                </div>

                <div className="grid md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label>Semester</Label>
                    <Select value={filters.semester || ''} onValueChange={(value) => setFilters({...filters, semester: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select semester" />
                      </SelectTrigger>
                      <SelectContent>
                        {reportData.semesters.map(semester => (
                          <SelectItem key={semester} value={semester}>{semester}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Program</Label>
                    <Select value={filters.program || ''} onValueChange={(value) => setFilters({...filters, program: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select program" />
                      </SelectTrigger>
                      <SelectContent>
                        {reportData.programs.map(program => (
                          <SelectItem key={program} value={program}>{program}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedReportType === 'student-results' && (
                    <div className="space-y-2">
                      <Label>CGPA Threshold</Label>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        max="4"
                        placeholder="e.g., 3.5"
                        value={filters.cgpaThreshold || ''}
                        onChange={(e) => setFilters({...filters, cgpaThreshold: parseFloat(e.target.value)})}
                      />
                    </div>
                  )}

                  {(selectedReportType === 'performance-report' || selectedReportType === 'mark-sheet') && (
                    <div className="space-y-2">
                      <Label>Individual Student</Label>
                      <Input
                        placeholder="Student ID (optional)"
                        value={filters.studentId || ''}
                        onChange={(e) => setFilters({...filters, studentId: e.target.value})}
                      />
                    </div>
                  )}

                  {selectedReportType === 'mark-sheet' && (
                    <div className="space-y-2">
                      <Label>Course Code</Label>
                      <Select value={filters.courseCode || ''} onValueChange={(value) => setFilters({...filters, courseCode: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select course" />
                        </SelectTrigger>
                        <SelectContent>
                          {reportData.courses.map(course => (
                            <SelectItem key={course.code} value={course.code}>
                              {course.code} - {course.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>

                <div className="flex justify-end space-x-3">
                  <Button variant="outline" onClick={() => setFilters({})}>
                    Clear Filters
                  </Button>
                  <Button onClick={handleGenerateReport}>
                    <Award className="w-4 h-4 mr-2" />
                    Generate Report
                  </Button>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function QuickReports() {
  const quickReportTemplates = [
    { name: 'Today\'s Attendance Summary', type: 'attendance', icon: Clock },
    { name: 'Pending Advisor Approvals', type: 'approval', icon: Users },
    { name: 'Current Enrollment Stats', type: 'enrollment', icon: BarChart3 },
    { name: 'Active Teachers Workload', type: 'workload', icon: GraduationCap },
    { name: 'Recent Registrations', type: 'registration', icon: BookOpen },
    { name: 'Students with Low CGPA', type: 'performance', icon: TrendingUp }
  ]

  const handleQuickReport = (reportType: string) => {
    alert(`Generating ${reportType} quick report...`)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Quick Reports</CardTitle>
          <CardDescription>Pre-configured reports for common use cases</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickReportTemplates.map((template, index) => {
              const Icon = template.icon
              return (
                <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Icon className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-sm">{template.name}</h4>
                          <p className="text-xs text-gray-500 capitalize">{template.type} report</p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleQuickReport(template.name)}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Scheduled Reports</CardTitle>
          <CardDescription>Set up automatic report generation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Coming Soon</h3>
            <p className="text-gray-500">
              Schedule automatic report generation and email delivery
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function ComprehensiveReports() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-deep-plum">Comprehensive Reports</h1>
          <p className="text-gray-600 mt-1">Generate, view, and export all academic reports</p>
        </div>
        <Badge className="bg-blue-100 text-blue-800">
          <FileText className="w-4 h-4 mr-1" />
          All formats supported
        </Badge>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Student Reports</p>
                <p className="text-2xl font-bold text-deep-plum">13</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Attendance Reports</p>
                <p className="text-2xl font-bold text-green-600">3</p>
              </div>
              <Clock className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Teacher Reports</p>
                <p className="text-2xl font-bold text-purple-600">2</p>
              </div>
              <GraduationCap className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Academic Reports</p>
                <p className="text-2xl font-bold text-orange-600">5</p>
              </div>
              <Award className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Report Categories */}
      <Tabs defaultValue="students" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="students" className="flex items-center space-x-2">
            <Users className="w-4 h-4" />
            <span>Student Reports</span>
          </TabsTrigger>
          <TabsTrigger value="attendance" className="flex items-center space-x-2">
            <Clock className="w-4 h-4" />
            <span>Attendance</span>
          </TabsTrigger>
          <TabsTrigger value="teachers" className="flex items-center space-x-2">
            <GraduationCap className="w-4 h-4" />
            <span>Teachers</span>
          </TabsTrigger>
          <TabsTrigger value="academic" className="flex items-center space-x-2">
            <Award className="w-4 h-4" />
            <span>Academic</span>
          </TabsTrigger>
          <TabsTrigger value="quick" className="flex items-center space-x-2">
            <BarChart3 className="w-4 h-4" />
            <span>Quick Reports</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="students">
          <StudentReports />
        </TabsContent>

        <TabsContent value="attendance">
          <AttendanceReports />
        </TabsContent>

        <TabsContent value="teachers">
          <TeacherReports />
        </TabsContent>

        <TabsContent value="academic">
          <AcademicReports />
        </TabsContent>

        <TabsContent value="quick">
          <QuickReports />
        </TabsContent>
      </Tabs>
    </div>
  )
}
