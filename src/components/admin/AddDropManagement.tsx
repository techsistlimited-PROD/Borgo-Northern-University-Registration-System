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
  Plus,
  Minus,
  Search,
  AlertCircle,
  CheckCircle,
  Clock,
  X,
  Filter,
  Download,
  Eye,
  Check,
  Ban
} from 'lucide-react'

export const AddDropManagement = () => {
  const [filterProgram, setFilterProgram] = useState('all')
  const [filterSession, setFilterSession] = useState('all')
  const [filterSemester, setFilterSemester] = useState('all')
  const [filterCourseCode, setFilterCourseCode] = useState('')
  const [filterCourseName, setFilterCourseName] = useState('')
  const [filterAction, setFilterAction] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [showViewDialog, setShowViewDialog] = useState(false)
  const [showActionDialog, setShowActionDialog] = useState(false)
  const [selectedApplication, setSelectedApplication] = useState<any>(null)
  const [pendingAction, setPendingAction] = useState<'approve' | 'reject' | null>(null)
  const [actionReason, setActionReason] = useState('')

  // Sample add/drop applications data
  const [applications, setApplications] = useState([
    {
      id: 1,
      studentId: '2024-1-60-001',
      studentName: 'Ahmed Hassan',
      program: 'CSE',
      session: 'Fall',
      semester: '3rd',
      courseCode: 'CSE301',
      courseName: 'Algorithms',
      action: 'Add',
      status: 'Pending',
      submittedAt: '2024-01-15 10:30',
      reason: 'Need to complete prerequisites for higher level courses',
      currentCGPA: '3.45',
      completedCredits: 45
    },
    {
      id: 2,
      studentId: '2024-1-60-002',
      studentName: 'Fatima Rahman',
      program: 'CSE',
      session: 'Fall',
      semester: '2nd',
      courseCode: 'PHY101',
      courseName: 'Physics I',
      action: 'Drop',
      status: 'Under Review',
      submittedAt: '2024-01-14 14:20',
      reason: 'Time conflict with mandatory internship',
      currentCGPA: '3.78',
      completedCredits: 30
    },
    {
      id: 3,
      studentId: '2024-1-50-015',
      studentName: 'Mohammad Ali',
      program: 'BBA',
      session: 'Summer',
      semester: '4th',
      courseCode: 'BBA401',
      courseName: 'International Business',
      action: 'Add',
      status: 'Pending',
      submittedAt: '2024-01-13 09:45',
      reason: 'Interested in international business specialization',
      currentCGPA: '3.62',
      completedCredits: 90
    },
    {
      id: 4,
      studentId: '2024-1-60-025',
      studentName: 'Sarah Khan',
      program: 'CSE',
      session: 'Fall',
      semester: '5th',
      courseCode: 'CSE502',
      courseName: 'Machine Learning',
      action: 'Add',
      status: 'Approved',
      submittedAt: '2024-01-12 11:15',
      reason: 'Career focus on AI and data science',
      currentCGPA: '3.89',
      completedCredits: 120,
      processedAt: '2024-01-16 09:30',
      processedBy: 'Dr. Academic Head'
    },
    {
      id: 5,
      studentId: '2024-1-40-008',
      studentName: 'Nasir Ahmed',
      program: 'EEE',
      session: 'Winter',
      semester: '3rd',
      courseCode: 'EEE301',
      courseName: 'Electronics I',
      action: 'Drop',
      status: 'Rejected',
      submittedAt: '2024-01-10 16:20',
      reason: 'Financial difficulties',
      currentCGPA: '2.95',
      completedCredits: 60,
      processedAt: '2024-01-15 14:45',
      processedBy: 'Dr. Academic Head',
      rejectionReason: 'Course is mandatory for degree completion'
    },
    {
      id: 6,
      studentId: '2024-1-70-012',
      studentName: 'Ayesha Begum',
      program: 'MBA',
      session: 'Fall',
      semester: '2nd',
      courseCode: 'MBA802',
      courseName: 'International Marketing',
      action: 'Add',
      status: 'Pending',
      submittedAt: '2024-01-16 13:10',
      reason: 'Focus on global marketing strategies',
      currentCGPA: '3.55',
      completedCredits: 18
    }
  ])

  // Filter applications based on all criteria
  const filteredApplications = applications.filter(app => {
    const matchesProgram = filterProgram === 'all' || app.program === filterProgram
    const matchesSession = filterSession === 'all' || app.session === filterSession
    const matchesSemester = filterSemester === 'all' || app.semester === filterSemester
    const matchesCourseCode = !filterCourseCode || app.courseCode.toLowerCase().includes(filterCourseCode.toLowerCase())
    const matchesCourseName = !filterCourseName || app.courseName.toLowerCase().includes(filterCourseName.toLowerCase())
    const matchesAction = filterAction === 'all' || app.action === filterAction
    const matchesStatus = filterStatus === 'all' || app.status === filterStatus
    const matchesSearch = !searchTerm || 
      app.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.courseCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.courseName.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesProgram && matchesSession && matchesSemester && matchesCourseCode && 
           matchesCourseName && matchesAction && matchesStatus && matchesSearch
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
          processedBy: 'Current Admin',
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
    alert(`Application for ${selectedApplication.courseCode} has been ${actionText} successfully.`)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Pending':
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />Pending</Badge>
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

  const getActionBadge = (action: string) => {
    return action === 'Add' ? (
      <Badge variant="default" className="bg-blue-100 text-blue-800">
        <Plus className="w-3 h-3 mr-1" />Add
      </Badge>
    ) : (
      <Badge variant="secondary" className="bg-orange-100 text-orange-800">
        <Minus className="w-3 h-3 mr-1" />Drop
      </Badge>
    )
  }

  const handlePrintReport = () => {
    const printContent = `
      <html>
        <head>
          <title>Add/Drop Applications Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f5f5f5; font-weight: bold; }
            .header { text-align: center; margin-bottom: 20px; }
            .summary { margin-bottom: 20px; padding: 10px; background-color: #f9f9f9; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Northern University</h1>
            <h2>Add/Drop Applications Report</h2>
            <p>Generated on: ${new Date().toLocaleString()}</p>
          </div>
          
          <div class="summary">
            <h3>Summary</h3>
            <p><strong>Total Applications:</strong> ${filteredApplications.length}</p>
            <p><strong>Pending:</strong> ${filteredApplications.filter(app => app.status === 'Pending').length}</p>
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
                <th>Course Code</th>
                <th>Course Name</th>
                <th>Action</th>
                <th>Status</th>
                <th>Submitted</th>
                <th>CGPA</th>
              </tr>
            </thead>
            <tbody>
              ${filteredApplications.map(app => `
                <tr>
                  <td>${app.studentId}</td>
                  <td>${app.studentName}</td>
                  <td>${app.program}</td>
                  <td>${app.courseCode}</td>
                  <td>${app.courseName}</td>
                  <td>${app.action}</td>
                  <td>${app.status}</td>
                  <td>${app.submittedAt}</td>
                  <td>${app.currentCGPA}</td>
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
    setFilterCourseCode('')
    setFilterCourseName('')
    setFilterAction('all')
    setFilterStatus('all')
    setSearchTerm('')
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-deep-plum">Add/Drop Applications Management</h1>
          <p className="text-gray-600 mt-1">Review and process student add/drop course requests</p>
        </div>
        <Button onClick={handlePrintReport} className="flex items-center space-x-2">
          <Download className="w-4 h-4" />
          <span>Print Report</span>
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Applications</p>
                <p className="text-2xl font-bold">{filteredApplications.length}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Review</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {filteredApplications.filter(app => app.status === 'Pending' || app.status === 'Under Review').length}
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
          <CardDescription>Filter applications by various criteria</CardDescription>
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
              <Label>Action</Label>
              <Select value={filterAction} onValueChange={setFilterAction}>
                <SelectTrigger>
                  <SelectValue placeholder="All Actions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Actions</SelectItem>
                  <SelectItem value="Add">Add Course</SelectItem>
                  <SelectItem value="Drop">Drop Course</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Course Code</Label>
              <Input
                placeholder="e.g., CSE301"
                value={filterCourseCode}
                onChange={(e) => setFilterCourseCode(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Course Name</Label>
              <Input
                placeholder="e.g., Algorithms"
                value={filterCourseName}
                onChange={(e) => setFilterCourseName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Under Review">Under Review</SelectItem>
                  <SelectItem value="Approved">Approved</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Search</Label>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Student ID, Name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-4">
            <Button variant="outline" onClick={clearAllFilters}>
              Clear All Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Applications Table */}
      <Card>
        <CardHeader>
          <CardTitle>Applications ({filteredApplications.length})</CardTitle>
          <CardDescription>Review and process student add/drop requests</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Program</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>CGPA</TableHead>
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
                      <p className="font-medium">{app.courseCode}</p>
                      <p className="text-sm text-gray-600">{app.courseName}</p>
                    </div>
                  </TableCell>
                  <TableCell>{getActionBadge(app.action)}</TableCell>
                  <TableCell>{getStatusBadge(app.status)}</TableCell>
                  <TableCell className="text-sm text-gray-600">{app.submittedAt}</TableCell>
                  <TableCell className="font-medium">{app.currentCGPA}</TableCell>
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
                      {(app.status === 'Pending' || app.status === 'Under Review') && (
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
              <p>No applications match your current filter criteria</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Application Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Application Details</DialogTitle>
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
                    <Label className="text-sm font-medium text-gray-500">Course Information</Label>
                    <p className="text-lg font-medium">{selectedApplication.courseCode}</p>
                    <p className="text-sm text-gray-600">{selectedApplication.courseName}</p>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Request Details</Label>
                    <p>Action: {getActionBadge(selectedApplication.action)}</p>
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
                <Label className="text-sm font-medium text-gray-500">Student's Reason</Label>
                <p className="mt-1 p-3 bg-gray-50 rounded-lg">{selectedApplication.reason}</p>
              </div>
              
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
              {pendingAction === 'approve' ? 'Approve Application' : 'Reject Application'}
            </DialogTitle>
          </DialogHeader>
          
          {selectedApplication && (
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Application Summary</h4>
                <p><strong>Student:</strong> {selectedApplication.studentName} ({selectedApplication.studentId})</p>
                <p><strong>Course:</strong> {selectedApplication.courseCode} - {selectedApplication.courseName}</p>
                <p><strong>Action:</strong> {selectedApplication.action}</p>
                <p><strong>Current CGPA:</strong> {selectedApplication.currentCGPA}</p>
              </div>
              
              {pendingAction === 'reject' && (
                <div className="space-y-2">
                  <Label>Reason for Rejection *</Label>
                  <textarea
                    className="w-full p-3 border rounded-lg resize-none"
                    rows={3}
                    placeholder="Please provide a reason for rejection..."
                    value={actionReason}
                    onChange={(e) => setActionReason(e.target.value)}
                  />
                </div>
              )}

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowActionDialog(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={confirmAction}
                  disabled={pendingAction === 'reject' && !actionReason.trim()}
                  className={pendingAction === 'approve' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
                >
                  {pendingAction === 'approve' ? 'Approve' : 'Reject'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
