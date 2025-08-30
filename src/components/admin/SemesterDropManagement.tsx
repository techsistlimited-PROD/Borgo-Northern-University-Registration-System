import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
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
import {
  Search,
  AlertCircle,
  CheckCircle,
  Clock,
  X,
  Filter,
  Download,
  Eye,
  Check,
  Ban,
  Calendar,
  GraduationCap,
  BookOpen
} from 'lucide-react'

export const SemesterDropManagement = () => {
  const [filterProgram, setFilterProgram] = useState('all')
  const [filterSession, setFilterSession] = useState('all')
  const [filterSemester, setFilterSemester] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [showViewDialog, setShowViewDialog] = useState(false)
  const [showActionDialog, setShowActionDialog] = useState(false)
  const [selectedApplication, setSelectedApplication] = useState<any>(null)
  const [pendingAction, setPendingAction] = useState<'approve' | 'reject' | null>(null)
  const [actionReason, setActionReason] = useState('')

  // Deadline for semester drop applications
  const semesterDropDeadline = new Date('2024-01-31T23:59:59')
  const currentDate = new Date()
  const isDeadlinePassed = currentDate > semesterDropDeadline
  const daysUntilDeadline = Math.ceil((semesterDropDeadline.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24))

  // Sample semester drop applications data
  const [applications, setApplications] = useState([
    {
      id: 1,
      studentId: '2024-1-60-001',
      studentName: 'Ahmed Hassan',
      program: 'CSE',
      session: 'Fall',
      semester: '3rd',
      currentSemester: 'Fall 2024',
      status: 'Under Review',
      submittedAt: '2024-01-15 10:30',
      reason: 'Severe family financial crisis due to father\'s job loss. Unable to continue with semester fees and need to take a break to support family income.',
      currentCGPA: '3.45',
      completedCredits: 45,
      registeredCourses: [
        { code: 'CSE301', title: 'Algorithms', credits: 3, faculty: 'Dr. Rahman' },
        { code: 'CSE302', title: 'Database Systems', credits: 3, faculty: 'Prof. Khan' },
        { code: 'CSE303', title: 'Computer Organization', credits: 3, faculty: 'Dr. Ali' },
        { code: 'CSE304', title: 'Database Lab', credits: 1, faculty: 'Prof. Khan' },
        { code: 'MAT301', title: 'Linear Algebra', credits: 3, faculty: 'Dr. Ahmed' },
        { code: 'ENG301', title: 'Technical Writing', credits: 3, faculty: 'Ms. Rahman' },
        { code: 'ECO201', title: 'Macroeconomics', credits: 3, faculty: 'Prof. Nasir' }
      ],
      totalCredits: 19
    },
    {
      id: 2,
      studentId: '2024-1-60-002',
      studentName: 'Fatima Rahman',
      program: 'CSE',
      session: 'Fall',
      semester: '2nd',
      currentSemester: 'Fall 2024',
      status: 'Under Review',
      submittedAt: '2024-01-14 14:20',
      reason: 'Diagnosed with chronic illness requiring extensive medical treatment and hospitalization. Doctor advised complete rest for 6 months.',
      currentCGPA: '3.78',
      completedCredits: 30,
      registeredCourses: [
        { code: 'CSE201', title: 'Data Structures', credits: 3, faculty: 'Dr. Hassan' },
        { code: 'CSE202', title: 'Data Structures Lab', credits: 1, faculty: 'Dr. Hassan' },
        { code: 'MAT201', title: 'Calculus II', credits: 3, faculty: 'Prof. Ahmed' },
        { code: 'PHY201', title: 'Physics II', credits: 3, faculty: 'Dr. Khan' },
        { code: 'PHY202', title: 'Physics Lab II', credits: 1, faculty: 'Dr. Khan' },
        { code: 'ENG201', title: 'English II', credits: 3, faculty: 'Ms. Begum' }
      ],
      totalCredits: 14
    },
    {
      id: 3,
      studentId: '2024-1-50-015',
      studentName: 'Mohammad Ali',
      program: 'BBA',
      session: 'Fall',
      semester: '4th',
      currentSemester: 'Fall 2024',
      status: 'Under Review',
      submittedAt: '2024-01-13 09:45',
      reason: 'Accepted a critical job opportunity that requires immediate start and cannot be deferred. Need to pause studies temporarily.',
      currentCGPA: '3.62',
      completedCredits: 90,
      registeredCourses: [
        { code: 'BBA401', title: 'International Business', credits: 3, faculty: 'Prof. Rahman' },
        { code: 'BBA402', title: 'E-Commerce', credits: 3, faculty: 'Dr. Khan' },
        { code: 'BBA403', title: 'Supply Chain Management', credits: 3, faculty: 'Prof. Ali' },
        { code: 'ACC301', title: 'Cost Accounting', credits: 3, faculty: 'Ms. Ahmed' },
        { code: 'ECO301', title: 'Business Economics', credits: 3, faculty: 'Dr. Hassan' }
      ],
      totalCredits: 15
    },
    {
      id: 4,
      studentId: '2024-1-60-025',
      studentName: 'Sarah Khan',
      program: 'CSE',
      session: 'Fall',
      semester: '5th',
      currentSemester: 'Fall 2024',
      status: 'Approved',
      submittedAt: '2024-01-12 11:15',
      reason: 'Selected for prestigious international exchange program at MIT. Will continue studies there and transfer credits back.',
      currentCGPA: '3.89',
      completedCredits: 120,
      registeredCourses: [
        { code: 'CSE501', title: 'Artificial Intelligence', credits: 3, faculty: 'Dr. Rahman' },
        { code: 'CSE502', title: 'Machine Learning', credits: 3, faculty: 'Prof. Khan' },
        { code: 'CSE503', title: 'Web Technologies', credits: 3, faculty: 'Dr. Ali' },
        { code: 'CSE504', title: 'Mobile App Development', credits: 3, faculty: 'Ms. Ahmed' }
      ],
      totalCredits: 12,
      processedAt: '2024-01-16 09:30',
      processedBy: 'Dr. Academic Head',
      approvalNote: 'Approved for international exchange program participation'
    },
    {
      id: 5,
      studentId: '2024-1-40-008',
      studentName: 'Nasir Ahmed',
      program: 'EEE',
      session: 'Fall',
      semester: '3rd',
      currentSemester: 'Fall 2024',
      status: 'Rejected',
      submittedAt: '2024-01-10 16:20',
      reason: 'Want to switch to CSE program and restart from 1st semester.',
      currentCGPA: '2.95',
      completedCredits: 60,
      registeredCourses: [
        { code: 'EEE301', title: 'Electronics I', credits: 3, faculty: 'Dr. Hassan' },
        { code: 'EEE302', title: 'Signals and Systems', credits: 3, faculty: 'Prof. Khan' },
        { code: 'EEE303', title: 'Electronics Lab I', credits: 1, faculty: 'Dr. Hassan' },
        { code: 'MAT301', title: 'Linear Algebra', credits: 3, faculty: 'Dr. Ahmed' }
      ],
      totalCredits: 10,
      processedAt: '2024-01-15 14:45',
      processedBy: 'Dr. Academic Head',
      rejectionReason: 'Program transfer requests should be handled through separate program transfer application process, not semester drop.'
    },
    {
      id: 6,
      studentId: '2024-1-70-012',
      studentName: 'Ayesha Begum',
      program: 'MBA',
      session: 'Fall',
      semester: '2nd',
      currentSemester: 'Fall 2024',
      status: 'Under Review',
      submittedAt: '2024-01-16 13:10',
      reason: 'Pregnancy complications requiring bed rest as advised by doctor. Cannot attend classes or take exams.',
      currentCGPA: '3.55',
      completedCredits: 18,
      registeredCourses: [
        { code: 'MBA802', title: 'International Marketing', credits: 3, faculty: 'Prof. Rahman' },
        { code: 'MBA803', title: 'Corporate Finance', credits: 3, faculty: 'Dr. Khan' },
        { code: 'MBA804', title: 'Operations Research', credits: 3, faculty: 'Prof. Ali' }
      ],
      totalCredits: 9
    }
  ])

  // Filter applications based on all criteria
  const filteredApplications = applications.filter(app => {
    const matchesProgram = filterProgram === 'all' || app.program === filterProgram
    const matchesSession = filterSession === 'all' || app.session === filterSession
    const matchesSemester = filterSemester === 'all' || app.semester === filterSemester
    const matchesStatus = filterStatus === 'all' || app.status === filterStatus
    const matchesSearch = !searchTerm || 
      app.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.reason.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesProgram && matchesSession && matchesSemester && matchesStatus && matchesSearch
  })

  const handleViewApplication = (application: any) => {
    setSelectedApplication(application)
    setShowViewDialog(true)
  }

  const handleAction = (application: any, action: 'approve' | 'reject') => {
    setSelectedApplication(application)
    setPendingAction(action)
    setActionReason('')
    setShowActionDialog(true)
  }

  const confirmAction = () => {
    if (!selectedApplication || !pendingAction) return

    const updatedApplications = applications.map(app => {
      if (app.id === selectedApplication.id) {
        return {
          ...app,
          status: pendingAction === 'approve' ? 'Approved' : 'Rejected',
          processedAt: new Date().toLocaleString(),
          processedBy: 'Current ACAD',
          ...(pendingAction === 'approve' && { approvalNote: actionReason }),
          ...(pendingAction === 'reject' && { rejectionReason: actionReason })
        }
      }
      return app
    })

    setApplications(updatedApplications)
    setShowActionDialog(false)
    setSelectedApplication(null)
    setPendingAction(null)
    setActionReason('')

    const actionText = pendingAction === 'approve' ? 'approved' : 'rejected'
    alert(`Semester drop application for ${selectedApplication.studentName} has been ${actionText} successfully.`)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Under Review':
        return <Badge variant="default"><AlertCircle className="w-3 h-3 mr-1" />Under Review</Badge>
      case 'Approved':
        return <Badge variant="default" className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Approved</Badge>
      case 'Rejected':
        return <Badge variant="destructive"><X className="w-3 h-3 mr-1" />Rejected</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const handlePrintReport = () => {
    const printContent = `
      <html>
        <head>
          <title>Semester Drop Applications Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; font-size: 12px; }
            th { background-color: #f5f5f5; font-weight: bold; }
            .header { text-align: center; margin-bottom: 20px; }
            .summary { margin-bottom: 20px; padding: 10px; background-color: #f9f9f9; }
            .deadline { margin-bottom: 20px; padding: 10px; background-color: ${isDeadlinePassed ? '#fee' : '#eff'}; border: 1px solid ${isDeadlinePassed ? '#fcc' : '#cfc'}; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Northern University</h1>
            <h2>Semester Drop Applications Report</h2>
            <p>Generated on: ${new Date().toLocaleString()}</p>
          </div>
          
          <div class="deadline">
            <h3>Application Deadline Information</h3>
            <p><strong>Deadline:</strong> ${semesterDropDeadline.toLocaleString()}</p>
            <p><strong>Status:</strong> ${isDeadlinePassed ? 'CLOSED - Deadline has passed' : `OPEN - ${daysUntilDeadline} days remaining`}</p>
          </div>
          
          <div class="summary">
            <h3>Summary</h3>
            <p><strong>Total Applications:</strong> ${filteredApplications.length}</p>
            <p><strong>Under Review:</strong> ${filteredApplications.filter(app => app.status === 'Under Review').length}</p>
            <p><strong>Approved:</strong> ${filteredApplications.filter(app => app.status === 'Approved').length}</p>
            <p><strong>Rejected:</strong> ${filteredApplications.filter(app => app.status === 'Rejected').length}</p>
          </div>

          <table>
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Student Name</th>
                <th>Program</th>
                <th>Semester</th>
                <th>Status</th>
                <th>Submitted</th>
                <th>CGPA</th>
                <th>Credits</th>
                <th>Reason (Summary)</th>
              </tr>
            </thead>
            <tbody>
              ${filteredApplications.map(app => `
                <tr>
                  <td>${app.studentId}</td>
                  <td>${app.studentName}</td>
                  <td>${app.program}</td>
                  <td>${app.semester}</td>
                  <td>${app.status}</td>
                  <td>${app.submittedAt}</td>
                  <td>${app.currentCGPA}</td>
                  <td>${app.totalCredits}</td>
                  <td>${app.reason.substring(0, 100)}${app.reason.length > 100 ? '...' : ''}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `

    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(printContent)
      printWindow.document.close()
      printWindow.print()
    }
  }

  const clearAllFilters = () => {
    setFilterProgram('all')
    setFilterSession('all')
    setFilterSemester('all')
    setFilterStatus('all')
    setSearchTerm('')
  }

  const formatDeadlineDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-deep-plum">Semester Drop Applications Management</h1>
          <p className="text-gray-600 mt-1">Review and process student semester drop requests</p>
        </div>
        <Button onClick={handlePrintReport} className="flex items-center space-x-2">
          <Download className="w-4 h-4" />
          <span>Print Report</span>
        </Button>
      </div>

      {/* Deadline Information */}
      <Card className={`border-l-4 ${isDeadlinePassed ? 'border-l-red-500 bg-red-50' : daysUntilDeadline <= 3 ? 'border-l-yellow-500 bg-yellow-50' : 'border-l-blue-500 bg-blue-50'}`}>
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <Calendar className={`w-6 h-6 mt-1 ${isDeadlinePassed ? 'text-red-600' : daysUntilDeadline <= 3 ? 'text-yellow-600' : 'text-blue-600'}`} />
            <div>
              <h3 className={`font-semibold ${isDeadlinePassed ? 'text-red-800' : daysUntilDeadline <= 3 ? 'text-yellow-800' : 'text-blue-800'}`}>
                Semester Drop Application Deadline
              </h3>
              <p className={`text-sm ${isDeadlinePassed ? 'text-red-700' : daysUntilDeadline <= 3 ? 'text-yellow-700' : 'text-blue-700'}`}>
                <strong>Deadline:</strong> {formatDeadlineDate(semesterDropDeadline)}
              </p>
              {isDeadlinePassed ? (
                <p className="text-sm text-red-700 mt-1 font-medium">
                  🔒 Applications are now closed. No new semester drop applications can be submitted.
                </p>
              ) : (
                <p className="text-sm text-blue-700 mt-1">
                  {daysUntilDeadline > 0 ? (
                    <>📅 Applications close in <strong>{daysUntilDeadline} day{daysUntilDeadline !== 1 ? 's' : ''}</strong></>
                  ) : (
                    <><Clock className="w-4 h-4 inline mr-1" />Last day for applications!</>
                  )}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Applications</p>
                <p className="text-2xl font-bold">{filteredApplications.length}</p>
              </div>
              <GraduationCap className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Under Review</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {filteredApplications.filter(app => app.status === 'Under Review').length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-green-600">
                  {filteredApplications.filter(app => app.status === 'Approved').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-red-600">
                  {filteredApplications.filter(app => app.status === 'Rejected').length}
                </p>
              </div>
              <X className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="w-5 h-5" />
            <span>Application Filters</span>
          </CardTitle>
          <CardDescription>Filter semester drop applications by various criteria</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4 mb-4">
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
                  <SelectItem value="MBA">MBA</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Session</Label>
              <Select value={filterSession} onValueChange={setFilterSession}>
                <SelectTrigger>
                  <SelectValue placeholder="All Sessions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sessions</SelectItem>
                  <SelectItem value="Fall">Fall</SelectItem>
                  <SelectItem value="Summer">Summer</SelectItem>
                  <SelectItem value="Winter">Winter</SelectItem>
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
                  <SelectItem value="1st">1st Semester</SelectItem>
                  <SelectItem value="2nd">2nd Semester</SelectItem>
                  <SelectItem value="3rd">3rd Semester</SelectItem>
                  <SelectItem value="4th">4th Semester</SelectItem>
                  <SelectItem value="5th">5th Semester</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Under Review">Under Review</SelectItem>
                  <SelectItem value="Approved">Approved</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Search</Label>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Student ID, Name, or Reason..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex items-end">
              <Button variant="outline" onClick={clearAllFilters} className="w-full">
                Clear All Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Applications Table */}
      <Card>
        <CardHeader>
          <CardTitle>Semester Drop Applications ({filteredApplications.length})</CardTitle>
          <CardDescription>Review and process semester drop requests</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Program</TableHead>
                <TableHead>Current Semester</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>CGPA</TableHead>
                <TableHead>Credits</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredApplications.map((app) => (
                <TableRow key={app.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{app.studentName}</p>
                      <p className="text-sm text-gray-600">{app.studentId}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{app.program}</Badge>
                    <p className="text-xs text-gray-600 mt-1">{app.session} - {app.semester}</p>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{app.currentSemester}</p>
                      <p className="text-sm text-gray-600">{app.registeredCourses.length} courses</p>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(app.status)}</TableCell>
                  <TableCell className="text-sm text-gray-600">{app.submittedAt}</TableCell>
                  <TableCell className="font-medium">{app.currentCGPA}</TableCell>
                  <TableCell className="font-medium">{app.totalCredits}</TableCell>
                  <TableCell>
                    <div className="flex space-x-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewApplication(app)}
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      {app.status === 'Under Review' && !isDeadlinePassed && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleAction(app, 'approve')}
                            className="text-green-600 hover:text-green-700"
                            title="Approve"
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleAction(app, 'reject')}
                            className="text-red-600 hover:text-red-700"
                            title="Reject"
                          >
                            <Ban className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredApplications.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No semester drop applications match your current filter criteria</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Application Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Semester Drop Application Details</DialogTitle>
          </DialogHeader>
          
          {selectedApplication && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Student Information</Label>
                    <p className="text-lg font-medium">{selectedApplication.studentName}</p>
                    <p className="text-sm text-gray-600">ID: {selectedApplication.studentId}</p>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Academic Details</Label>
                    <p>Program: {selectedApplication.program}</p>
                    <p>Session: {selectedApplication.session}</p>
                    <p>Semester: {selectedApplication.semester}</p>
                    <p>Current CGPA: {selectedApplication.currentCGPA}</p>
                    <p>Completed Credits: {selectedApplication.completedCredits}</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Current Registration</Label>
                    <p className="text-lg font-medium">{selectedApplication.currentSemester}</p>
                    <p className="text-sm text-gray-600">{selectedApplication.registeredCourses.length} courses, {selectedApplication.totalCredits} credits</p>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Application Details</Label>
                    <p>Status: {getStatusBadge(selectedApplication.status)}</p>
                    <p>Submitted: {selectedApplication.submittedAt}</p>
                    {selectedApplication.processedAt && (
                      <>
                        <p>Processed: {selectedApplication.processedAt}</p>
                        <p>Processed by: {selectedApplication.processedBy}</p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-500">Student's Reason for Semester Drop</Label>
                <p className="mt-1 p-3 bg-gray-50 rounded-lg">{selectedApplication.reason}</p>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-500 mb-3 block">Registered Courses ({selectedApplication.registeredCourses.length})</Label>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Course Code</TableHead>
                      <TableHead>Course Title</TableHead>
                      <TableHead>Credits</TableHead>
                      <TableHead>Faculty</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedApplication.registeredCourses.map((course: any, index: number) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{course.code}</TableCell>
                        <TableCell>{course.title}</TableCell>
                        <TableCell>{course.credits}</TableCell>
                        <TableCell>{course.faculty}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              {selectedApplication.approvalNote && (
                <div>
                  <Label className="text-sm font-medium text-gray-500">Approval Note</Label>
                  <p className="mt-1 p-3 bg-green-50 rounded-lg text-green-700">{selectedApplication.approvalNote}</p>
                </div>
              )}

              {selectedApplication.rejectionReason && (
                <div>
                  <Label className="text-sm font-medium text-gray-500">Rejection Reason</Label>
                  <p className="mt-1 p-3 bg-red-50 rounded-lg text-red-700">{selectedApplication.rejectionReason}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Action Confirmation Dialog */}
      <Dialog open={showActionDialog} onOpenChange={setShowActionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {pendingAction === 'approve' ? 'Approve Semester Drop Application' : 'Reject Semester Drop Application'}
            </DialogTitle>
          </DialogHeader>
          
          {selectedApplication && (
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Application Summary</h4>
                <p><strong>Student:</strong> {selectedApplication.studentName} ({selectedApplication.studentId})</p>
                <p><strong>Program:</strong> {selectedApplication.program}</p>
                <p><strong>Current Semester:</strong> {selectedApplication.currentSemester}</p>
                <p><strong>Registered Courses:</strong> {selectedApplication.registeredCourses.length} courses ({selectedApplication.totalCredits} credits)</p>
                <p><strong>Current CGPA:</strong> {selectedApplication.currentCGPA}</p>
              </div>
              
              <div className="space-y-2">
                <Label>{pendingAction === 'approve' ? 'Approval Note (Optional)' : 'Reason for Rejection *'}</Label>
                <textarea
                  className="w-full p-3 border rounded-lg resize-none"
                  rows={3}
                  placeholder={pendingAction === 'approve' ? 
                    "Add any additional notes for approval..." : 
                    "Please provide a reason for rejection..."
                  }
                  value={actionReason}
                  onChange={(e) => setActionReason(e.target.value)}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowActionDialog(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={confirmAction}
                  disabled={pendingAction === 'reject' && !actionReason.trim()}
                  className={pendingAction === 'approve' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
                >
                  {pendingAction === 'approve' ? 'Approve Application' : 'Reject Application'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
