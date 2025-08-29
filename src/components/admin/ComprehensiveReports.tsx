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
const mockReportData = {
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
  const [filters, setFilters] = useState<ReportFilter>({
    semester: 'Fall 2024',
    program: 'all',
    individual: false
  })
  const [selectedReportType, setSelectedReportType] = useState('all')
  const [showDetailedView, setShowDetailedView] = useState(false)
  const [reportData, setReportData] = useState<any>(null)
  const [showStudentDetail, setShowStudentDetail] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState('')

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
      description: 'List of registered students with department, search by ID, course type filters',
      filters: ['semester', 'department', 'search', 'courseType']
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
      description: 'List of students who have dropped out with last semester and credits completed',
      filters: ['semester', 'program']
    },
    {
      id: 'completed-list',
      name: 'Completed Students List',
      description: 'Students ready for graduation with clearance status',
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

    // For admit card, show detailed view
    if (selectedReportType === 'admit-card') {
      setShowDetailedView(true)
      return
    }

    // Clear semester filter for reports that shouldn't have it
    if (selectedReportType === 'unregistered-previous' || selectedReportType === 'dropout-list') {
      setFilters(prev => ({ ...prev, semester: undefined }))
    }

    // Generate mock data for other reports
    const mockData = generateMockReportData(selectedReportType)
    setReportData(mockData)
    setShowDetailedView(true)
  }

  const applyFilters = () => {
    if (!reportData || !reportData.data) return

    let filteredData = [...reportData.data]

    // Filter by department
    if (filters.program && filters.program !== 'all') {
      filteredData = filteredData.filter((item: any) => item.dept === filters.program)
    }

    // Filter by search query (student ID)
    if (searchQuery.trim()) {
      filteredData = filteredData.filter((item: any) =>
        item.id.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Filter by course type (for registered students)
    if (filters.courseCode && filters.courseCode !== 'all') {
      filteredData = filteredData.filter((item: any) =>
        item.courseType?.toLowerCase() === filters.courseCode.toLowerCase()
      )
    }

    // Filter by CGPA threshold (for earned credit & CGPA report)
    if (filters.cgpaThreshold) {
      filteredData = filteredData.filter((item: any) =>
        item.cgpa >= filters.cgpaThreshold
      )
    }

    // Filter by clearance status (for completed students)
    if (filters.individual !== undefined) {
      filteredData = filteredData.filter((item: any) =>
        filters.individual ? item.clearanceStatus === 'Pending' : item.clearanceStatus === 'Approved'
      )
    }

    // Filter by lead time (for pending approval)
    if (filters.teacherId && filters.teacherId !== 'all') {
      filteredData = filteredData.filter((item: any) =>
        filters.teacherId === 'safe' ? item.leadTime <= 3 : item.leadTime > 3
      )
    }

    const updatedData = {
      ...reportData,
      data: filteredData,
      totalCount: filteredData.length
    }

    setReportData(updatedData)
  }

  const generateMockReportData = (reportType: string) => {
    switch (reportType) {
      case 'registered-list':
        return {
          title: 'Registered Students List',
          data: [
            { id: '2021-1-60-001', name: 'Ahmed Hassan', dept: 'CSE', courseType: 'Regular', totalCredits: 18 },
            { id: '2021-1-60-002', name: 'Fatima Khan', dept: 'CSE', courseType: 'Retake', totalCredits: 15 },
            { id: '2021-2-50-015', name: 'Mohammad Ali', dept: 'BBA', courseType: 'Regular', totalCredits: 12 },
            { id: '2020-1-60-088', name: 'Sarah Ahmed', dept: 'EEE', courseType: 'Retake', totalCredits: 21 },
            { id: '2022-3-55-012', name: 'Karim Rahman', dept: 'Textile', courseType: 'Regular', totalCredits: 16 },
            { id: '2021-1-60-105', name: 'Nadia Sultana', dept: 'CSE', courseType: 'Retake', totalCredits: 14 },
            { id: '2021-4-45-020', name: 'Rashid Khan', dept: 'B. Pharm', courseType: 'Regular', totalCredits: 20 },
            { id: '2021-3-40-077', name: 'Salma Rahman', dept: 'EEE', courseType: 'Regular', totalCredits: 19 }
          ],
          columns: ['Student ID', 'Name', 'Department', 'Course Type', 'Total Credits', 'View'],
          totalCount: 8
        }
      case 'unregistered-previous':
        return {
          title: 'Unregistered in Previous Semester',
          data: [
            { id: '2020-1-60-033', name: 'Omar Faruk', dept: 'CSE', totalCredits: 89 },
            { id: '2021-2-50-077', name: 'Ruma Begum', dept: 'BBA', totalCredits: 102 },
            { id: '2020-3-55-044', name: 'Tanvir Hasan', dept: 'Textile', totalCredits: 78 },
            { id: '2021-1-60-088', name: 'Marium Khan', dept: 'CSE', totalCredits: 95 },
            { id: '2020-4-45-021', name: 'Sabbir Ahmed', dept: 'B. Pharm', totalCredits: 110 },
            { id: '2021-3-40-009', name: 'Ayesha Rahman', dept: 'EEE', totalCredits: 72 },
            { id: '2020-2-50-055', name: 'Habib Rahman', dept: 'BBA', totalCredits: 67 },
            { id: '2021-3-55-012', name: 'Nasir Uddin', dept: 'Textile', totalCredits: 84 }
          ],
          columns: ['Student ID', 'Name', 'Department', 'Total Credits Completed'],
          totalCount: 8
        }
      case 'dropout-list':
        return {
          title: 'Dropout Students List',
          data: [
            { id: '2019-1-60-010', name: 'Rafiq Ahmed', dept: 'CSE', lastSemester: 'Fall 2022', creditsCompleted: 67 },
            { id: '2020-2-50-025', name: 'Salma Khatun', dept: 'BBA', lastSemester: 'Summer 2023', creditsCompleted: 89 },
            { id: '2018-3-55-033', name: 'Imran Hossain', dept: 'Textile', lastSemester: 'Spring 2022', creditsCompleted: 45 },
            { id: '2019-4-45-018', name: 'Nasir Uddin', dept: 'B. Pharm', lastSemester: 'Fall 2023', creditsCompleted: 78 },
            { id: '2020-3-40-012', name: 'Rashida Begum', dept: 'EEE', lastSemester: 'Summer 2022', creditsCompleted: 56 },
            { id: '2019-1-60-055', name: 'Habib Rahman', dept: 'CSE', lastSemester: 'Spring 2023', creditsCompleted: 91 },
            { id: '2018-2-50-088', name: 'Khalil Ahmed', dept: 'BBA', lastSemester: 'Fall 2022', creditsCompleted: 34 },
            { id: '2019-3-55-021', name: 'Ruma Ahmed', dept: 'Textile', lastSemester: 'Summer 2023', creditsCompleted: 52 }
          ],
          columns: ['Student ID', 'Name', 'Department', 'Last Semester Completed', 'Credits Completed'],
          totalCount: 8
        }
      case 'completed-list':
        return {
          title: 'Completed Students List (Ready for Graduation)',
          data: [
            { id: '2020-1-60-001', name: 'Ali Rahman', dept: 'CSE', clearanceStatus: 'Approved' },
            { id: '2020-2-50-010', name: 'Nusrat Jahan', dept: 'BBA', clearanceStatus: 'Pending' },
            { id: '2020-3-55-008', name: 'Farhan Ahmed', dept: 'Textile', clearanceStatus: 'Approved' },
            { id: '2020-4-45-003', name: 'Rehana Khatun', dept: 'B. Pharm', clearanceStatus: 'Pending' },
            { id: '2020-3-40-005', name: 'Shafiq Islam', dept: 'EEE', clearanceStatus: 'Approved' },
            { id: '2020-1-60-088', name: 'Taslima Begum', dept: 'CSE', clearanceStatus: 'Pending' },
            { id: '2020-2-50-077', name: 'Kamal Hasan', dept: 'BBA', clearanceStatus: 'Approved' },
            { id: '2020-4-45-055', name: 'Sultana Razia', dept: 'B. Pharm', clearanceStatus: 'Pending' }
          ],
          columns: ['Student ID', 'Name', 'Department', 'Final Clearance Status'],
          totalCount: 8
        }
      case 'earned-credit-cgpa':
        return {
          title: 'Students with Earned Credit & CGPA',
          data: [
            { id: '2021-1-60-001', name: 'Ahmed Hassan', dept: 'CSE', totalCredit: 102, cgpa: 3.75 },
            { id: '2021-1-60-002', name: 'Fatima Khan', dept: 'CSE', totalCredit: 89, cgpa: 3.42 },
            { id: '2021-2-50-015', name: 'Mohammad Ali', dept: 'BBA', totalCredit: 78, cgpa: 3.21 },
            { id: '2020-3-55-088', name: 'Sarah Ahmed', dept: 'Textile', totalCredit: 120, cgpa: 3.89 },
            { id: '2022-4-45-012', name: 'Karim Rahman', dept: 'B. Pharm', totalCredit: 67, cgpa: 3.56 },
            { id: '2021-3-40-105', name: 'Nadia Sultana', dept: 'EEE', totalCredit: 95, cgpa: 3.12 },
            { id: '2020-1-60-088', name: 'Rafiq Ahmed', dept: 'CSE', totalCredit: 115, cgpa: 3.65 },
            { id: '2021-2-50-033', name: 'Salma Khatun', dept: 'BBA', totalCredit: 92, cgpa: 2.98 }
          ],
          columns: ['Student ID', 'Name', 'Department', 'Total Credit', 'CGPA'],
          totalCount: 8
        }
      case 'pending-approval':
        return {
          title: 'Registrations Pending Advisor Approval',
          data: [
            { id: '2021-1-60-001', name: 'Ahmed Hassan', advisorName: 'Dr. Rahman Ahmed', submissionDate: '2024-01-20', leadTime: 1 },
            { id: '2021-1-60-002', name: 'Fatima Khan', advisorName: 'Prof. Sarah Khan', submissionDate: '2024-01-19', leadTime: 2 },
            { id: '2021-2-50-015', name: 'Mohammad Ali', advisorName: 'Dr. Mohammad Ali', submissionDate: '2024-01-15', leadTime: 6 },
            { id: '2020-3-55-088', name: 'Sarah Ahmed', advisorName: 'Dr. Rahman Ahmed', submissionDate: '2024-01-17', leadTime: 4 },
            { id: '2022-4-45-012', name: 'Karim Rahman', advisorName: 'Prof. Nusrat Jahan', submissionDate: '2024-01-18', leadTime: 3 },
            { id: '2021-3-40-105', name: 'Nadia Sultana', advisorName: 'Dr. Khalil Ahmed', submissionDate: '2024-01-14', leadTime: 7 },
            { id: '2020-1-60-077', name: 'Imran Hossain', advisorName: 'Dr. Rahman Ahmed', submissionDate: '2024-01-16', leadTime: 5 },
            { id: '2021-4-45-025', name: 'Rashida Begum', advisorName: 'Prof. Sarah Khan', submissionDate: '2024-01-20', leadTime: 1 }
          ],
          columns: ['Student ID', 'Name', 'Advisor Name', 'Submission Date', 'Lead Time'],
          totalCount: 8
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

  const handleViewStudent = (student: any) => {
    const studentDetail = {
      ...student,
      courses: [
        { courseId: 'CSE401', courseName: 'Software Engineering', type: student.courseType, credit: 3 },
        { courseId: 'CSE403', courseName: 'Database Management System', type: student.courseType, credit: 3 },
        { courseId: 'CSE405', courseName: 'Computer Networks', type: 'Regular', credit: 3 },
        { courseId: 'MAT301', courseName: 'Statistics and Probability', type: 'Regular', credit: 3 },
        { courseId: 'ENG301', courseName: 'Technical Writing', type: 'Regular', credit: 2 }
      ]
    }
    setSelectedStudent(studentDetail)
    setShowStudentDetail(true)
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
              <h2 className="text-2xl font-bold text-deep-plum">{reportData?.title}</h2>
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

          {/* Report-specific Filters */}
          <Card className="bg-gray-50">
            <CardContent className="p-4">
              <h4 className="font-semibold text-deep-plum mb-3">Filters</h4>
              <div className={`grid grid-cols-1 ${selectedReportType === 'unregistered-previous' || selectedReportType === 'dropout-list' ? 'md:grid-cols-2' : 'md:grid-cols-3'} gap-4`}>

                {/* Department Filter - available for all reports */}
                <div>
                  <Label htmlFor="dept-filter">Department</Label>
                  <Select value={filters.program || 'all'} onValueChange={(value) => {
                    setFilters({...filters, program: value === 'all' ? undefined : value})
                    setTimeout(applyFilters, 100)
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      {mockReportData.programs.map(program => (
                        <SelectItem key={program} value={program}>{program}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Search by ID - available for all reports */}
                <div>
                  <Label htmlFor="id-search">Search by Student ID</Label>
                  <Input
                    id="id-search"
                    placeholder="Enter student ID..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value)
                      setTimeout(applyFilters, 300)
                    }}
                  />
                </div>

                {/* Semester Filter - NOT shown for unregistered or dropout reports */}
                {selectedReportType !== 'unregistered-previous' && selectedReportType !== 'dropout-list' && (
                  <div>
                    <Label htmlFor="semester-filter">Semester</Label>
                    <Select value={filters.semester || 'all'} onValueChange={(value) => {
                      setFilters({...filters, semester: value === 'all' ? undefined : value})
                      setTimeout(applyFilters, 100)
                    }}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select semester" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Semesters</SelectItem>
                        {mockReportData.semesters.map(semester => (
                          <SelectItem key={semester} value={semester}>{semester}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Conditional filters based on report type */}
                {selectedReportType === 'registered-list' && (
                  <div>
                    <Label htmlFor="course-type">Course Type</Label>
                    <Select value={filters.courseCode || 'all'} onValueChange={(value) => {
                      setFilters({...filters, courseCode: value === 'all' ? undefined : value})
                      setTimeout(applyFilters, 100)
                    }}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="regular">Regular</SelectItem>
                        <SelectItem value="retake">Retake</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {selectedReportType === 'earned-credit-cgpa' && (
                  <div>
                    <Label htmlFor="cgpa-filter">Minimum CGPA</Label>
                    <Select value={filters.cgpaThreshold?.toString() || 'all'} onValueChange={(value) => {
                      setFilters({...filters, cgpaThreshold: value === 'all' ? undefined : parseFloat(value)})
                      setTimeout(applyFilters, 100)
                    }}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select CGPA" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All CGPAs</SelectItem>
                        <SelectItem value="3.5">3.5 and above</SelectItem>
                        <SelectItem value="3.0">3.0 and above</SelectItem>
                        <SelectItem value="2.5">2.5 and above</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {selectedReportType === 'completed-list' && (
                  <div>
                    <Label htmlFor="clearance-status">Clearance Status</Label>
                    <Select value={filters.individual ? 'pending' : filters.individual === false ? 'approved' : 'all'} onValueChange={(value) => {
                      setFilters({...filters, individual: value === 'pending' ? true : value === 'approved' ? false : undefined})
                      setTimeout(applyFilters, 100)
                    }}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {selectedReportType === 'pending-approval' && (
                  <div>
                    <Label htmlFor="lead-time">Lead Time</Label>
                    <Select value={filters.teacherId || 'all'} onValueChange={(value) => {
                      setFilters({...filters, teacherId: value === 'all' ? undefined : value})
                      setTimeout(applyFilters, 100)
                    }}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Times</SelectItem>
                        <SelectItem value="safe">Safe (3 days or less)</SelectItem>
                        <SelectItem value="overdue">Overdue (more than 3 days)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

              </div>
            </CardContent>
          </Card>

          {reportData?.totalCount && (
            <Card className="mb-4">
              <CardContent className="p-4">
                <div className="text-lg font-semibold text-deep-plum">
                  Total {reportData.title.includes('Dropout') ? 'Dropout Students' :
                         reportData.title.includes('Unregistered') ? 'Unregistered Students' :
                         reportData.title.includes('Completed') ? 'Completed Students' : 'Students'}: {reportData.totalCount}
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardContent className="p-0">
              {reportData?.data?.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      {reportData?.columns?.map((column: string, index: number) => (
                        <TableHead key={index}>{column}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reportData?.data?.map((row: any, index: number) => (
                      <TableRow key={index}>
                        {Object.keys(row).map((key, cellIndex) => {
                          if (key === 'totalCredits' || key === 'creditsCompleted') return null;
                          return (
                            <TableCell key={cellIndex}>
                              {key === 'clearanceStatus' ? (
                                <Badge className={row[key] === 'Approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                                  {row[key]}
                                </Badge>
                              ) : key === 'courseType' ? (
                                <Badge className={row[key] === 'Retake' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}>
                                  {row[key]}
                                </Badge>
                              ) : key === 'leadTime' ? (
                                <Badge className={row[key] > 3 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}>
                                  {row[key]} day{row[key] !== 1 ? 's' : ''}
                                </Badge>
                              ) : key === 'cgpa' ? (
                                <Badge className={row[key] >= 3.5 ? 'bg-green-100 text-green-800' : row[key] >= 3.0 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}>
                                  {row[key]}
                                </Badge>
                              ) : (
                                row[key]
                              )}
                            </TableCell>
                          )
                        })}
                        {row.totalCredits && (
                          <TableCell>{row.totalCredits}</TableCell>
                        )}
                        {row.creditsCompleted && (
                          <TableCell>{row.creditsCompleted}</TableCell>
                        )}
                        {selectedReportType === 'registered-list' && (
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewStudent(row)}
                            >
                              View
                            </Button>
                          </TableCell>
                        )}
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

          {/* Student Detail Modal */}
          {showStudentDetail && selectedStudent && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-deep-plum">Student Details</h3>
                    <p className="text-gray-600">{selectedStudent.name} ({selectedStudent.id})</p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setShowStudentDetail(false)}
                  >
                    ✕
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Personal Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p><strong>Student ID:</strong> {selectedStudent.id}</p>
                        <p><strong>Name:</strong> {selectedStudent.name}</p>
                        <p><strong>Department:</strong> {selectedStudent.dept}</p>
                        <p><strong>Course Type:</strong>
                          <Badge className={selectedStudent.courseType === 'Retake' ? 'bg-red-100 text-red-800 ml-2' : 'bg-blue-100 text-blue-800 ml-2'}>
                            {selectedStudent.courseType}
                          </Badge>
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Academic Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p><strong>Total Credits:</strong> {selectedStudent.totalCredits}</p>
                        <p><strong>Courses Registered:</strong> {selectedStudent.courses?.length || 0}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Registered Courses</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Course ID</TableHead>
                          <TableHead>Course Name</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Credit</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedStudent.courses?.map((course: any, index: number) => (
                          <TableRow key={index}>
                            <TableCell>{course.courseId}</TableCell>
                            <TableCell>{course.courseName}</TableCell>
                            <TableCell>
                              <Badge className={course.type === 'Retake' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}>
                                {course.type}
                              </Badge>
                            </TableCell>
                            <TableCell>{course.credit}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    <div className="mt-4 text-right">
                      <strong>Total Credits: {selectedStudent.courses?.reduce((sum: number, course: any) => sum + course.credit, 0) || 0}</strong>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Student Detail Modal */}
          {showStudentDetail && selectedStudent && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-deep-plum">Student Details</h3>
                    <p className="text-gray-600">{selectedStudent.name} ({selectedStudent.id})</p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setShowStudentDetail(false)}
                  >
                    ✕
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Personal Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p><strong>Student ID:</strong> {selectedStudent.id}</p>
                        <p><strong>Name:</strong> {selectedStudent.name}</p>
                        <p><strong>Department:</strong> {selectedStudent.dept}</p>
                        <p><strong>Course Type:</strong>
                          <Badge className={selectedStudent.courseType === 'Retake' ? 'bg-red-100 text-red-800 ml-2' : 'bg-blue-100 text-blue-800 ml-2'}>
                            {selectedStudent.courseType}
                          </Badge>
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Academic Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p><strong>Total Credits:</strong> {selectedStudent.totalCredits}</p>
                        <p><strong>Courses Registered:</strong> {selectedStudent.courses?.length || 0}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Registered Courses</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Course ID</TableHead>
                          <TableHead>Course Name</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Credit</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedStudent.courses?.map((course: any, index: number) => (
                          <TableRow key={index}>
                            <TableCell>{course.courseId}</TableCell>
                            <TableCell>{course.courseName}</TableCell>
                            <TableCell>
                              <Badge className={course.type === 'Retake' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}>
                                {course.type}
                              </Badge>
                            </TableCell>
                            <TableCell>{course.credit}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    <div className="mt-4 text-right">
                      <strong>Total Credits: {selectedStudent.courses?.reduce((sum: number, course: any) => sum + course.credit, 0) || 0}</strong>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
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
          <CardDescription>Generate detailed reports for student data analysis</CardDescription>
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
                      {mockReportData.semesters.map(semester => (
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
                      {mockReportData.programs.map(program => (
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
                      {mockReportData.terms.map(term => (
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
            <h2 className="text-2xl font-bold text-deep-plum">{reportData?.title}</h2>
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
                  {reportData?.columns?.map((column: string, index: number) => (
                    <TableHead key={index}>{column}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {reportData?.data?.map((row: any, index: number) => (
                  <TableRow key={index}>
                    {Object.values(row).map((value: any, cellIndex: number) => (
                      <TableCell key={cellIndex}>
                        {cellIndex === (reportData?.columns?.length || 0) - 1 && reportData?.title?.includes('Attendance Report') ? (
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
                        {mockReportData.semesters.map(semester => (
                          <SelectItem key={semester} value={semester}>{semester}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Program</Label>
                    <Select value={filters.program || ''} onValueChange={(value) => setFilters({...filters, program: value, courseCode: ''})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select program" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockReportData.programs.map(program => (
                          <SelectItem key={program} value={program}>{program}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Course Code</Label>
                    <Select
                      value={filters.courseCode || ''}
                      onValueChange={(value) => setFilters({...filters, courseCode: value})}
                      disabled={!filters.program}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={filters.program ? "Select course" : "Select program first"} />
                      </SelectTrigger>
                      <SelectContent>
                        {mockReportData.courses
                          .filter(course => !filters.program || course.code.startsWith(filters.program))
                          .map(course => (
                            <SelectItem key={course.code} value={course.code}>
                              {course.code} - {course.name}
                            </SelectItem>
                          ))
                        }
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
            <h2 className="text-2xl font-bold text-deep-plum">{reportData?.title}</h2>
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
                  {reportData?.columns?.map((column: string, index: number) => (
                    <TableHead key={index}>{column}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {reportData?.data?.map((row: any, index: number) => (
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
                        {mockReportData.teachers.map(teacher => (
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
                        {mockReportData.semesters.map(semester => (
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
                        {mockReportData.programs.map(program => (
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                <p className="text-sm font-medium text-gray-600">Teacher Reports</p>
                <p className="text-2xl font-bold text-purple-600">2</p>
              </div>
              <GraduationCap className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

      </div>

      {/* Report Categories */}
      <Tabs defaultValue="students" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
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
      </Tabs>
    </div>
  )
}
