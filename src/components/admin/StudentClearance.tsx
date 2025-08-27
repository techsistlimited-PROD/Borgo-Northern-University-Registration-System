import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
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
  User,
  Calendar,
  Award,
  GraduationCap,
  DollarSign,
  BookOpen,
  Shield,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Filter,
  Building,
  AlertTriangle
} from 'lucide-react'

// Mock student clearance data
const mockClearanceData = [
  {
    studentId: '2021-1-60-001',
    studentName: 'Ahmed Hassan Rahman',
    department: 'CSE',
    semester: 'Fall 2024',
    semesterNo: 8,
    program: 'BSc in CSE',
    status: 'pending',
    appliedDate: '2024-09-15',
    clearanceType: 'exam',
    examType: 'Final',
    academicHistory: {
      totalCreditsCompleted: 148,
      totalCreditsRequired: 152,
      cgpa: 3.45,
      currentSemesterCredits: 12,
      outstandingCourses: ['CSE498', 'CSE499']
    },
    financialReport: {
      totalDue: 0,
      semesterFee: 'Paid',
      libraryFine: 0,
      hostleDue: 0,
      lastPayment: '2024-09-10'
    },
    otherClearances: {
      library: { status: 'approved', comments: 'All books returned. No outstanding dues.', date: '2024-09-12' },
      lab: { status: 'approved', comments: 'All equipment returned in good condition.', date: '2024-09-11' },
      studentWelfare: { status: 'approved', comments: 'Excellent conduct throughout academic tenure.', date: '2024-09-13' }
    }
  },
  {
    studentId: '2021-1-60-002',
    studentName: 'Fatima Khan',
    department: 'CSE',
    semester: 'Fall 2024',
    semesterNo: 6,
    program: 'BSc in CSE',
    status: 'pending',
    appliedDate: '2024-09-14',
    clearanceType: 'exam',
    examType: 'Mid',
    academicHistory: {
      totalCreditsCompleted: 98,
      totalCreditsRequired: 152,
      cgpa: 3.75,
      currentSemesterCredits: 15,
      outstandingCourses: []
    },
    financialReport: {
      totalDue: 5000,
      semesterFee: 'Partial',
      libraryFine: 0,
      hostleDue: 5000,
      lastPayment: '2024-08-20'
    },
    otherClearances: {
      library: { status: 'approved', comments: 'All clear.', date: '2024-09-10' },
      lab: { status: 'pending', comments: 'Waiting for final lab report submission.', date: null },
      studentWelfare: { status: 'approved', comments: 'Good conduct record.', date: '2024-09-12' }
    }
  },
  {
    studentId: '2020-1-60-001',
    studentName: 'Mohammad Ali Hasan',
    department: 'CSE',
    semester: 'Fall 2024',
    semesterNo: 9,
    program: 'BSc in CSE',
    status: 'pending',
    appliedDate: '2024-09-16',
    clearanceType: 'final',
    examType: null,
    academicHistory: {
      totalCreditsCompleted: 152,
      totalCreditsRequired: 152,
      cgpa: 3.82,
      currentSemesterCredits: 0,
      outstandingCourses: []
    },
    financialReport: {
      totalDue: 0,
      semesterFee: 'Paid',
      libraryFine: 0,
      hostleDue: 0,
      lastPayment: '2024-09-05'
    },
    otherClearances: {
      library: { status: 'approved', comments: 'All books returned. Thesis submitted.', date: '2024-09-14' },
      lab: { status: 'approved', comments: 'All equipment and projects completed.', date: '2024-09-13' },
      studentWelfare: { status: 'approved', comments: 'Exemplary behavior throughout studies.', date: '2024-09-15' }
    },
    eligibilityCheck: {
      creditsCompleted: true,
      financeCleared: true,
      libraryCleared: true,
      labCleared: true,
      studentWelfareCleared: true,
      overallEligible: true
    }
  }
]

const departments = ['CSE', 'BBA', 'EEE', 'Textile Engineering', 'B. Pharm']
const semesters = ['Fall 2024', 'Spring 2024', 'Summer 2024']

interface StudentClearanceProps {
  clearanceType: 'exam' | 'final'
}

export const StudentClearance = ({ clearanceType }: StudentClearanceProps) => {
  const [selectedDepartment, setSelectedDepartment] = useState('all')
  const [selectedSemester, setSelectedSemester] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<any>(null)

  // Filter data based on clearance type
  const filteredData = mockClearanceData.filter(student => {
    const matchesType = student.clearanceType === clearanceType
    const matchesDepartment = !selectedDepartment || student.department === selectedDepartment
    const matchesSemester = clearanceType === 'exam' ? (!selectedSemester || student.semester === selectedSemester) : true
    const matchesStatus = !selectedStatus || student.status === selectedStatus
    const matchesSearch = !searchQuery || 
      student.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchQuery.toLowerCase())
    
    return matchesType && matchesDepartment && matchesSemester && matchesStatus && matchesSearch
  })

  const handleViewDetails = (student: any) => {
    setSelectedStudent(student)
    setShowDetailModal(true)
  }

  const handleAction = (action: 'approve' | 'hold' | 'reject') => {
    // In real implementation, this would update the database
    alert(`Student clearance ${action}ed for ${selectedStudent?.studentName}`)
    setShowDetailModal(false)
  }

  const handleDownloadClearance = () => {
    if (selectedStudent?.status === 'approved') {
      alert(`Downloading clearance certificate for ${selectedStudent.studentName}`)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getClearanceStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'rejected': return <XCircle className="w-4 h-4 text-red-600" />
      case 'pending': return <Clock className="w-4 h-4 text-yellow-600" />
      default: return <AlertTriangle className="w-4 h-4 text-gray-600" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-deep-plum">
            {clearanceType === 'exam' ? 'Exam Clearance' : 'Final Clearance for Certificates'}
          </h1>
          <p className="text-gray-600 mt-1">
            {clearanceType === 'exam' 
              ? 'Manage student exam clearance applications' 
              : 'Manage final clearance applications for degree certificates'
            }
          </p>
        </div>
        <Badge className="bg-purple-100 text-purple-800">
          {clearanceType === 'exam' ? <Calendar className="w-4 h-4 mr-1" /> : <Award className="w-4 h-4 mr-1" />}
          {clearanceType === 'exam' ? 'Exam Clearance' : 'Final Clearance'}
        </Badge>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Applications</p>
                <p className="text-2xl font-bold text-deep-plum">{filteredData.length}</p>
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
                  {filteredData.filter(s => s.status === 'pending').length}
                </p>
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
                <p className="text-2xl font-bold text-green-600">
                  {filteredData.filter(s => s.status === 'approved').length}
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
                  {filteredData.filter(s => s.status === 'rejected').length}
                </p>
              </div>
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="w-5 h-5" />
            <span>Filters</span>
          </CardTitle>
          <CardDescription>Filter clearance applications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-5 gap-4">
            <div className="space-y-2">
              <Label>Department</Label>
              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger>
                  <SelectValue placeholder="All departments" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {departments.map(dept => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {clearanceType === 'exam' && (
              <div className="space-y-2">
                <Label>Semester</Label>
                <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                  <SelectTrigger>
                    <SelectValue placeholder="All semesters" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Semesters</SelectItem>
                    {semesters.map(semester => (
                      <SelectItem key={semester} value={semester}>{semester}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Search</Label>
              <Input
                placeholder="Student name or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex items-end">
              <Button 
                variant="outline" 
                onClick={() => {
                  setSelectedDepartment('')
                  setSelectedSemester('')
                  setSelectedStatus('')
                  setSearchQuery('')
                }}
              >
                Clear All
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Students Table */}
      <Card>
        <CardHeader>
          <CardTitle>Clearance Applications ({filteredData.length})</CardTitle>
          <CardDescription>
            {clearanceType === 'exam' 
              ? 'Students applying for exam clearance' 
              : 'Students applying for final degree clearance'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student ID</TableHead>
                <TableHead>Student Name</TableHead>
                <TableHead>Department</TableHead>
                {clearanceType === 'exam' && <TableHead>Semester</TableHead>}
                {clearanceType === 'exam' && <TableHead>Exam Type</TableHead>}
                <TableHead>Applied Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((student, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{student.studentId}</TableCell>
                  <TableCell>{student.studentName}</TableCell>
                  <TableCell>{student.department}</TableCell>
                  {clearanceType === 'exam' && <TableCell>{student.semester}</TableCell>}
                  {clearanceType === 'exam' && (
                    <TableCell>
                      <Badge variant="outline">{student.examType}</Badge>
                    </TableCell>
                  )}
                  <TableCell>{student.appliedDate}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getClearanceStatusIcon(student.status)}
                      <Badge className={getStatusColor(student.status)}>
                        {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleViewDetails(student)}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Review
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Detail Modal */}
      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="sm:max-w-[900px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Student Clearance Review - {selectedStudent?.studentName}
            </DialogTitle>
            <DialogDescription>
              Review all clearance requirements and make approval decision
            </DialogDescription>
          </DialogHeader>

          {selectedStudent && (
            <div className="space-y-6">
              {/* Student Basic Info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <label className="text-sm font-medium text-gray-600">Student ID</label>
                  <p className="font-semibold">{selectedStudent.studentId}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Department</label>
                  <p className="font-semibold">{selectedStudent.department}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Program</label>
                  <p className="font-semibold">{selectedStudent.program}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Semester No</label>
                  <p className="font-semibold">{selectedStudent.semesterNo}</p>
                </div>
              </div>

              {/* Tabbed Review Sections */}
              <Tabs defaultValue="academic" className="space-y-4">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="academic">Academic History</TabsTrigger>
                  <TabsTrigger value="financial">Financial Report</TabsTrigger>
                  <TabsTrigger value="other">Other Clearances</TabsTrigger>
                </TabsList>

                <TabsContent value="academic">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <GraduationCap className="w-5 h-5" />
                        <span>Academic History</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">
                            {selectedStudent.academicHistory.totalCreditsCompleted}
                          </div>
                          <div className="text-sm text-blue-600">Credits Completed</div>
                        </div>
                        <div className="text-center p-3 bg-purple-50 rounded-lg">
                          <div className="text-2xl font-bold text-purple-600">
                            {selectedStudent.academicHistory.totalCreditsRequired}
                          </div>
                          <div className="text-sm text-purple-600">Credits Required</div>
                        </div>
                        <div className="text-center p-3 bg-green-50 rounded-lg">
                          <div className="text-2xl font-bold text-green-600">
                            {selectedStudent.academicHistory.cgpa}
                          </div>
                          <div className="text-sm text-green-600">CGPA</div>
                        </div>
                        <div className="text-center p-3 bg-orange-50 rounded-lg">
                          <div className="text-2xl font-bold text-orange-600">
                            {selectedStudent.academicHistory.currentSemesterCredits}
                          </div>
                          <div className="text-sm text-orange-600">Current Credits</div>
                        </div>
                      </div>
                      
                      {selectedStudent.academicHistory.outstandingCourses.length > 0 && (
                        <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                          <h4 className="font-semibold text-yellow-800 mb-2">Outstanding Courses</h4>
                          <div className="flex flex-wrap gap-2">
                            {selectedStudent.academicHistory.outstandingCourses.map((course: string) => (
                              <Badge key={course} className="bg-yellow-100 text-yellow-800">
                                {course}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="financial">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <DollarSign className="w-5 h-5" />
                        <span>Financial Report</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <span className="font-medium">Total Outstanding Dues</span>
                          <span className={`font-bold ${
                            selectedStudent.financialReport.totalDue === 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            ৳{selectedStudent.financialReport.totalDue.toLocaleString()}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex justify-between items-center p-3 border rounded-lg">
                            <span>Semester Fee</span>
                            <Badge className={
                              selectedStudent.financialReport.semesterFee === 'Paid' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }>
                              {selectedStudent.financialReport.semesterFee}
                            </Badge>
                          </div>
                          
                          <div className="flex justify-between items-center p-3 border rounded-lg">
                            <span>Library Fine</span>
                            <span>৳{selectedStudent.financialReport.libraryFine}</span>
                          </div>
                          
                          <div className="flex justify-between items-center p-3 border rounded-lg">
                            <span>Hostel Due</span>
                            <span>৳{selectedStudent.financialReport.hostleDue}</span>
                          </div>
                          
                          <div className="flex justify-between items-center p-3 border rounded-lg">
                            <span>Last Payment</span>
                            <span>{selectedStudent.financialReport.lastPayment}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="other">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Shield className="w-5 h-5" />
                        <span>Other Clearances</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {/* Library Clearance */}
                        <div className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <BookOpen className="w-5 h-5 text-blue-600" />
                              <span className="font-medium">Library Clearance</span>
                            </div>
                            <Badge className={
                              selectedStudent.otherClearances.library.status === 'approved'
                                ? 'bg-green-100 text-green-800'
                                : selectedStudent.otherClearances.library.status === 'pending'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-red-100 text-red-800'
                            }>
                              {selectedStudent.otherClearances.library.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-1">
                            {selectedStudent.otherClearances.library.comments}
                          </p>
                          {selectedStudent.otherClearances.library.date && (
                            <p className="text-xs text-gray-500">
                              Date: {selectedStudent.otherClearances.library.date}
                            </p>
                          )}
                        </div>

                        {/* Lab Clearance */}
                        <div className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <Building className="w-5 h-5 text-green-600" />
                              <span className="font-medium">Lab Clearance</span>
                            </div>
                            <Badge className={
                              selectedStudent.otherClearances.lab.status === 'approved'
                                ? 'bg-green-100 text-green-800'
                                : selectedStudent.otherClearances.lab.status === 'pending'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-red-100 text-red-800'
                            }>
                              {selectedStudent.otherClearances.lab.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-1">
                            {selectedStudent.otherClearances.lab.comments}
                          </p>
                          {selectedStudent.otherClearances.lab.date && (
                            <p className="text-xs text-gray-500">
                              Date: {selectedStudent.otherClearances.lab.date}
                            </p>
                          )}
                        </div>

                        {/* Student Welfare Clearance */}
                        <div className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <User className="w-5 h-5 text-purple-600" />
                              <span className="font-medium">Student Welfare Department</span>
                            </div>
                            <Badge className={
                              selectedStudent.otherClearances.studentWelfare.status === 'approved'
                                ? 'bg-green-100 text-green-800'
                                : selectedStudent.otherClearances.studentWelfare.status === 'pending'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-red-100 text-red-800'
                            }>
                              {selectedStudent.otherClearances.studentWelfare.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-1">
                            {selectedStudent.otherClearances.studentWelfare.comments}
                          </p>
                          {selectedStudent.otherClearances.studentWelfare.date && (
                            <p className="text-xs text-gray-500">
                              Date: {selectedStudent.otherClearances.studentWelfare.date}
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              {/* Final Clearance Eligibility Check */}
              {clearanceType === 'final' && selectedStudent.eligibilityCheck && (
                <Card className="border-blue-500">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-blue-800">
                      <CheckCircle className="w-5 h-5" />
                      <span>Final Clearance Eligibility Check</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="flex items-center space-x-2">
                        {selectedStudent.eligibilityCheck.creditsCompleted ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-600" />
                        )}
                        <span className="text-sm">Credits Completed (152/152)</span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {selectedStudent.eligibilityCheck.financeCleared ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-600" />
                        )}
                        <span className="text-sm">Finance Cleared</span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {selectedStudent.eligibilityCheck.libraryCleared ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-600" />
                        )}
                        <span className="text-sm">Library Cleared</span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {selectedStudent.eligibilityCheck.labCleared ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-600" />
                        )}
                        <span className="text-sm">Lab Cleared</span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {selectedStudent.eligibilityCheck.studentWelfareCleared ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-600" />
                        )}
                        <span className="text-sm">Student Welfare Cleared</span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {selectedStudent.eligibilityCheck.overallEligible ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-600" />
                        )}
                        <span className="text-sm font-semibold">Overall Eligible</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          <DialogFooter>
            <div className="flex justify-between items-center w-full">
              <div className="flex space-x-2">
                {selectedStudent?.status === 'approved' && (
                  <Button onClick={handleDownloadClearance} variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Download Certificate
                  </Button>
                )}
              </div>
              
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => handleAction('reject')}
                  className="text-red-600 hover:bg-red-50"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => handleAction('hold')}
                  className="text-yellow-600 hover:bg-yellow-50"
                >
                  <Clock className="w-4 h-4 mr-2" />
                  Hold
                </Button>
                <Button 
                  onClick={() => handleAction('approve')}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Approve
                </Button>
              </div>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
