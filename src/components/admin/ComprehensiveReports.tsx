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
  FileText,
  Download,
  Filter,
  Calendar,
  Users,
  GraduationCap,
  BookOpen,
  BarChart3,
  TrendingUp,
  Award,
  Clock,
  Search,
  Settings,
  Eye,
  FileSpreadsheet,
  FileType,
  File
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
  const [selectedReportType, setSelectedReportType] = useState('')

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
    alert(`Generating ${reportType?.name} report...\nFilters applied: ${JSON.stringify(filters, null, 2)}`)
  }

  const handleExport = (format: 'pdf' | 'excel' | 'word') => {
    if (!selectedReportType) {
      alert('Please generate a report first')
      return
    }

    const reportType = studentReportTypes.find(r => r.id === selectedReportType)
    alert(`Exporting ${reportType?.name} as ${format.toUpperCase()}...`)
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
                <FilePdf className="w-4 h-4 mr-2" />
                Export as PDF
              </Button>
              <Button onClick={() => handleExport('excel')} variant="outline">
                <FileSpreadsheet className="w-4 h-4 mr-2" />
                Export as Excel
              </Button>
              <Button onClick={() => handleExport('word')} variant="outline">
                <FileWord className="w-4 h-4 mr-2" />
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
  const [selectedReportType, setSelectedReportType] = useState('')

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

    const reportType = attendanceReportTypes.find(r => r.id === selectedReportType)
    alert(`Generating ${reportType?.name} report...\nFilters applied: ${JSON.stringify(filters, null, 2)}`)
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
  const [selectedReportType, setSelectedReportType] = useState('')

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

    const reportType = teacherReportTypes.find(r => r.id === selectedReportType)
    alert(`Generating ${reportType?.name} report...\nFilters applied: ${JSON.stringify(filters, null, 2)}`)
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
                        <SelectItem value="">All Teachers</SelectItem>
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
                        <SelectItem value="">All Semesters</SelectItem>
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
                        <SelectItem value="">All Programs</SelectItem>
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
  const [selectedReportType, setSelectedReportType] = useState('')

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
