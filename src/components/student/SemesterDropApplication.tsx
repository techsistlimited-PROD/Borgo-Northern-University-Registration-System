import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  AlertCircle,
  CheckCircle,
  Clock,
  X,
  Calendar,
  BookOpen,
  GraduationCap,
  FileText
} from 'lucide-react'

export const SemesterDropApplication = () => {
  const [reason, setReason] = useState('')
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [applicationSubmitted, setApplicationSubmitted] = useState(false)

  // Deadline for semester drop applications (example: January 31, 2024)
  const semesterDropDeadline = new Date('2024-01-31T23:59:59')
  const currentDate = new Date()
  const isDeadlinePassed = currentDate > semesterDropDeadline
  const daysUntilDeadline = Math.ceil((semesterDropDeadline.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24))

  // Sample current semester application
  const [currentApplication, setCurrentApplication] = useState<any>(null)

  // Student's current semester registration details
  const currentSemesterInfo = {
    semester: 'Fall 2024',
    registrationDate: '2024-01-10',
    totalCredits: 18,
    registeredCourses: [
      { code: 'CSE301', title: 'Algorithms', credits: 3, faculty: 'Dr. Ahmed Hassan' },
      { code: 'CSE302', title: 'Database Systems', credits: 3, faculty: 'Prof. Fatima Khan' },
      { code: 'CSE303', title: 'Computer Organization', credits: 3, faculty: 'Dr. Mohammad Ali' },
      { code: 'CSE304', title: 'Database Lab', credits: 1, faculty: 'Prof. Fatima Khan' },
      { code: 'MAT301', title: 'Linear Algebra', credits: 3, faculty: 'Dr. Sarah Ahmed' },
      { code: 'ENG301', title: 'Technical Writing', credits: 3, faculty: 'Ms. Ayesha Rahman' },
      { code: 'ECO201', title: 'Macroeconomics', credits: 3, faculty: 'Prof. Nasir Khan' }
    ]
  }

  const handleSubmitApplication = () => {
    if (!reason.trim()) {
      alert('Please provide a reason for semester drop')
      return
    }

    const newApplication = {
      id: 1,
      semester: currentSemesterInfo.semester,
      reason: reason.trim(),
      status: 'Under Review',
      submittedAt: new Date().toLocaleString(),
      totalCredits: currentSemesterInfo.totalCredits,
      coursesCount: currentSemesterInfo.registeredCourses.length
    }

    setCurrentApplication(newApplication)
    setApplicationSubmitted(true)
    setShowConfirmDialog(false)
    setReason('')

    alert('Your semester drop application has been submitted to Academic Affairs (ACAD) for review. You will be notified via email once it\'s processed.')
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
          <h1 className="text-3xl font-bold text-deep-plum">Semester Drop Application</h1>
          <p className="text-gray-600 mt-1">Apply to drop your current semester registration</p>
        </div>
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
                  ⚠️ The deadline has passed. Semester drop applications are no longer accepted for this semester.
                </p>
              ) : (
                <p className="text-sm text-blue-700 mt-1">
                  {daysUntilDeadline > 0 ? (
                    <>📅 You have <strong>{daysUntilDeadline} day{daysUntilDeadline !== 1 ? 's' : ''}</strong> remaining to submit your application.</>
                  ) : (
                    <><Clock className="w-4 h-4 inline mr-1" />Today is the last day to submit your application!</>
                  )}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Application Status */}
      {currentApplication && (
        <Card>
          <CardHeader>
            <CardTitle>Your Semester Drop Application</CardTitle>
            <CardDescription>Current application status</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Semester</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Courses</TableHead>
                  <TableHead>Credits</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">{currentApplication.semester}</TableCell>
                  <TableCell>{getStatusBadge(currentApplication.status)}</TableCell>
                  <TableCell className="text-sm text-gray-600">{currentApplication.submittedAt}</TableCell>
                  <TableCell>{currentApplication.coursesCount} courses</TableCell>
                  <TableCell>{currentApplication.totalCredits} credits</TableCell>
                </TableRow>
              </TableBody>
            </Table>
            
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <Label className="text-sm font-medium text-gray-500">Your Reason</Label>
              <p className="mt-1">{currentApplication.reason}</p>
            </div>

            <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="flex items-start space-x-2">
                <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-yellow-800">Application Under Review</p>
                  <p className="text-yellow-700 mt-1">
                    Your semester drop application is being reviewed by Academic Affairs (ACAD). 
                    You will be notified via email once a decision is made. Processing typically takes 3-5 business days.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Current Semester Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <GraduationCap className="w-5 h-5" />
            <span>Current Semester Registration</span>
          </CardTitle>
          <CardDescription>Your registered courses for {currentSemesterInfo.semester}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">{currentSemesterInfo.registeredCourses.length}</p>
              <p className="text-sm text-gray-600">Registered Courses</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">{currentSemesterInfo.totalCredits}</p>
              <p className="text-sm text-gray-600">Total Credits</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-2xl font-bold text-purple-600">{currentSemesterInfo.semester}</p>
              <p className="text-sm text-gray-600">Current Semester</p>
            </div>
          </div>

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
              {currentSemesterInfo.registeredCourses.map((course, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{course.code}</TableCell>
                  <TableCell>{course.title}</TableCell>
                  <TableCell>{course.credits}</TableCell>
                  <TableCell>{course.faculty}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Application Form */}
      {!currentApplication && !isDeadlinePassed && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="w-5 h-5" />
              <span>Submit Semester Drop Application</span>
            </CardTitle>
            <CardDescription>
              Please provide a detailed reason for dropping your semester registration
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reason">Reason for Semester Drop *</Label>
                <textarea
                  id="reason"
                  className="w-full p-3 border rounded-lg resize-none"
                  rows={6}
                  placeholder="Please provide a detailed reason for dropping your semester registration (e.g., medical issues, family emergency, financial difficulties, personal circumstances, etc.)"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />
                <p className="text-sm text-gray-500">
                  Minimum 50 characters required. Please be specific about your circumstances.
                </p>
              </div>

              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-red-800">Important Notice</p>
                    <ul className="text-red-700 mt-1 list-disc list-inside space-y-1">
                      <li>Dropping a semester may affect your academic progress and graduation timeline</li>
                      <li>You may need to re-register for courses in future semesters</li>
                      <li>Financial implications may apply (consult with Student Accounts)</li>
                      <li>This action cannot be undone once approved</li>
                      <li>Scholarship and financial aid may be affected</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={() => setShowConfirmDialog(true)}
                  disabled={!reason.trim() || reason.trim().length < 50}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Submit Semester Drop Application
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Locked State for Past Deadline */}
      {!currentApplication && isDeadlinePassed && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6 text-center">
            <div className="text-red-600 mb-4">
              <X className="w-16 h-16 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-red-800 mb-2">Applications Closed</h3>
              <p className="text-red-700">
                The deadline for semester drop applications has passed.
              </p>
              <p className="text-red-700 mt-2">
                <strong>Deadline was:</strong> {formatDeadlineDate(semesterDropDeadline)}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-red-200 max-w-md mx-auto">
              <p className="text-sm text-gray-700">
                For exceptional circumstances, please contact Academic Affairs directly:
              </p>
              <p className="text-sm font-medium text-gray-800 mt-2">
                📧 acadaffairs@nu.edu.bd<br />
                📞 +880-2-123456789
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-800">Confirm Semester Drop Application</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="bg-red-50 p-4 rounded-lg">
              <h4 className="font-semibold text-red-800 mb-2">Application Summary</h4>
              <p className="text-red-700">
                <strong>Semester:</strong> {currentSemesterInfo.semester}
              </p>
              <p className="text-red-700">
                <strong>Total Courses:</strong> {currentSemesterInfo.registeredCourses.length}
              </p>
              <p className="text-red-700">
                <strong>Total Credits:</strong> {currentSemesterInfo.totalCredits}
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-2">Your Reason</h4>
              <p className="text-sm text-gray-700">{reason}</p>
            </div>
            
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <div className="flex items-start space-x-2">
                <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-yellow-800">Final Confirmation Required</p>
                  <p className="text-yellow-700 mt-1">
                    Once submitted, your application will be reviewed by Academic Affairs (ACAD). 
                    This process is irreversible and may have academic and financial implications.
                    Make sure you have consulted with your academic advisor before proceeding.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmitApplication} className="bg-red-600 hover:bg-red-700">
                Confirm & Submit Application
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
