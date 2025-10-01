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
  ArrowRight,
  AlertCircle,
  CheckCircle,
  Clock,
  X,
  Calendar,
  BookOpen,
  Users,
  FileText
} from 'lucide-react'

export const StudentSectionChangeApplication = () => {
  const [selectedCourse, setSelectedCourse] = useState('')
  const [selectedTargetSection, setSelectedTargetSection] = useState('')
  const [reason, setReason] = useState('')
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)

  // Deadline for section change applications (example: March 1, 2024)
  const sectionChangeDeadline = new Date('2024-03-01T23:59:59')
  const currentDate = new Date()
  const isDeadlinePassed = currentDate > sectionChangeDeadline
  const daysUntilDeadline = Math.ceil((sectionChangeDeadline.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24))

  // Student's current registered courses and sections
  const currentRegistrations = [
    {
      courseCode: 'CSE301',
      courseName: 'Algorithms',
      currentSection: 'A',
      credits: 3,
      instructor: 'Dr. Ahmed Hassan',
      schedule: 'Sun, Tue 10:00-11:30',
      room: 'Room 201'
    },
    {
      courseCode: 'CSE302',
      courseName: 'Database Systems',
      currentSection: 'B',
      credits: 3,
      instructor: 'Prof. Sarah Ahmed',
      schedule: 'Mon, Wed 14:00-15:30',
      room: 'Room 305'
    },
    {
      courseCode: 'CSE303',
      courseName: 'Computer Organization',
      currentSection: 'A',
      credits: 3,
      instructor: 'Dr. Rahman Ali',
      schedule: 'Thu, Fri 08:00-09:30',
      room: 'Room 102'
    },
    {
      courseCode: 'MAT301',
      courseName: 'Linear Algebra',
      currentSection: 'C',
      credits: 3,
      instructor: 'Dr. Mathematics Expert',
      schedule: 'Sun, Wed 16:00-17:30',
      room: 'Room 401'
    },
    {
      courseCode: 'ENG301',
      courseName: 'Technical Writing',
      currentSection: 'A',
      credits: 3,
      instructor: 'Ms. English Teacher',
      schedule: 'Tue, Thu 12:00-13:30',
      room: 'Room 503'
    }
  ]

  // Available sections for each course
  const availableSections = {
    'CSE301': [
      { section: 'A', capacity: 50, enrolled: 48, instructor: 'Dr. Ahmed Hassan', schedule: 'Sun, Tue 10:00-11:30', room: 'Room 201' },
      { section: 'B', capacity: 50, enrolled: 42, instructor: 'Prof. Fatima Khan', schedule: 'Mon, Wed 14:00-15:30', room: 'Room 305' },
      { section: 'C', capacity: 45, enrolled: 35, instructor: 'Dr. Ali Rahman', schedule: 'Thu, Fri 08:00-09:30', room: 'Room 102' }
    ],
    'CSE302': [
      { section: 'A', capacity: 50, enrolled: 47, instructor: 'Dr. Database Expert', schedule: 'Sun, Tue 14:00-15:30', room: 'Room 203' },
      { section: 'B', capacity: 50, enrolled: 44, instructor: 'Prof. Sarah Ahmed', schedule: 'Mon, Wed 14:00-15:30', room: 'Room 305' },
      { section: 'C', capacity: 45, enrolled: 32, instructor: 'Dr. SQL Master', schedule: 'Thu, Fri 10:00-11:30', room: 'Room 107' }
    ],
    'CSE303': [
      { section: 'A', capacity: 50, enrolled: 45, instructor: 'Dr. Rahman Ali', schedule: 'Thu, Fri 08:00-09:30', room: 'Room 102' },
      { section: 'B', capacity: 50, enrolled: 38, instructor: 'Prof. Hardware Expert', schedule: 'Sun, Tue 16:00-17:30', room: 'Room 201' }
    ],
    'MAT301': [
      { section: 'A', capacity: 40, enrolled: 38, instructor: 'Dr. Calculus Pro', schedule: 'Mon, Wed 10:00-11:30', room: 'Room 301' },
      { section: 'B', capacity: 40, enrolled: 35, instructor: 'Prof. Linear Expert', schedule: 'Tue, Thu 14:00-15:30', room: 'Room 302' },
      { section: 'C', capacity: 35, enrolled: 28, instructor: 'Dr. Mathematics Expert', schedule: 'Sun, Wed 16:00-17:30', room: 'Room 401' }
    ],
    'ENG301': [
      { section: 'A', capacity: 30, enrolled: 28, instructor: 'Ms. English Teacher', schedule: 'Tue, Thu 12:00-13:30', room: 'Room 503' },
      { section: 'B', capacity: 30, enrolled: 25, instructor: 'Prof. Writing Expert', schedule: 'Sun, Wed 08:00-09:30', room: 'Room 501' }
    ]
  }

  // Student's section change applications
  const [applications, setApplications] = useState([
    {
      id: 1,
      courseCode: 'CSE302',
      courseName: 'Database Systems',
      fromSection: 'B',
      toSection: 'C',
      reason: 'Schedule conflict with part-time job. Evening classes work better for me.',
      status: 'Under Review',
      submittedAt: '2024-01-15 10:30',
      instructor: 'Dr. SQL Master',
      newSchedule: 'Thu, Fri 10:00-11:30'
    }
  ])

  const handleSubmitApplication = () => {
    if (!selectedCourse || !selectedTargetSection || !reason.trim()) {
      alert('Please fill all required fields')
      return
    }

    const courseInfo = currentRegistrations.find(course => course.courseCode === selectedCourse)
    const targetSectionInfo = availableSections[selectedCourse as keyof typeof availableSections]?.find(
      section => section.section === selectedTargetSection
    )

    if (!courseInfo || !targetSectionInfo) {
      alert('Invalid course or section selection')
      return
    }

    if (targetSectionInfo.enrolled >= targetSectionInfo.capacity) {
      alert(`Section ${selectedTargetSection} is full (${targetSectionInfo.enrolled}/${targetSectionInfo.capacity}). Please choose another section.`)
      return
    }

    const newApplication = {
      id: applications.length + 1,
      courseCode: selectedCourse,
      courseName: courseInfo.courseName,
      fromSection: courseInfo.currentSection,
      toSection: selectedTargetSection,
      reason: reason.trim(),
      status: 'Under Review',
      submittedAt: new Date().toLocaleString(),
      instructor: targetSectionInfo.instructor,
      newSchedule: targetSectionInfo.schedule
    }

    setApplications(prev => [...prev, newApplication])
    setShowConfirmDialog(false)
    setSelectedCourse('')
    setSelectedTargetSection('')
    setReason('')

    alert('Your section change application has been submitted to Academic Affairs (ACAD) for review. You will be notified via email once it\'s processed.')
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

  const getCurrentCourseInfo = () => {
    return currentRegistrations.find(course => course.courseCode === selectedCourse)
  }

  const getTargetSectionInfo = () => {
    if (!selectedCourse || !selectedTargetSection) return null
    return availableSections[selectedCourse as keyof typeof availableSections]?.find(
      section => section.section === selectedTargetSection
    )
  }

  const hasExistingApplication = (courseCode: string) => {
    return applications.some(app => app.courseCode === courseCode && (app.status === 'Under Review' || app.status === 'Approved'))
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-deep-plum">Section Change Application</h1>
          <p className="text-gray-600 mt-1">Apply to change your course sections</p>
        </div>
      </div>

      {/* Deadline Information */}
      <Card className={`border-l-4 ${
        isDeadlinePassed 
          ? 'border-l-red-500 bg-red-50' 
          : daysUntilDeadline <= 3 
          ? 'border-l-yellow-500 bg-yellow-50' 
          : 'border-l-blue-500 bg-blue-50'
      }`}>
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <Calendar className={`w-6 h-6 mt-1 ${
              isDeadlinePassed 
                ? 'text-red-600' 
                : daysUntilDeadline <= 3 
                ? 'text-yellow-600' 
                : 'text-blue-600'
            }`} />
            <div>
              <h3 className={`font-semibold ${
                isDeadlinePassed 
                  ? 'text-red-800' 
                  : daysUntilDeadline <= 3 
                  ? 'text-yellow-800' 
                  : 'text-blue-800'
              }`}>
                Section Change Application Deadline
              </h3>
              <p className={`text-sm ${
                isDeadlinePassed 
                  ? 'text-red-700' 
                  : daysUntilDeadline <= 3 
                  ? 'text-yellow-700' 
                  : 'text-blue-700'
              }`}>
                <strong>Deadline:</strong> {formatDeadlineDate(sectionChangeDeadline)}
              </p>
              {isDeadlinePassed ? (
                <p className="text-sm text-red-700 mt-1 font-medium">
                  ⚠️ The deadline has passed. Section change applications are no longer accepted for this semester.
                </p>
              ) : (
                <p className="text-sm text-blue-700 mt-1">
                  {daysUntilDeadline > 0 ? (
                    <>📅 You have <strong>{daysUntilDeadline} day{daysUntilDeadline !== 1 ? 's' : ''}</strong> remaining to submit your applications.</>
                  ) : (
                    <><Clock className="w-4 h-4 inline mr-1" />Today is the last day to submit your applications!</>
                  )}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Applications Status */}
      {applications.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Your Section Change Applications</CardTitle>
            <CardDescription>Track the status of your section change requests</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Course</TableHead>
                  <TableHead>Section Change</TableHead>
                  <TableHead>New Instructor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submitted</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applications.map((app) => (
                  <TableRow key={app.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{app.courseCode}</p>
                        <p className="text-sm text-gray-600">{app.courseName}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono bg-gray-100 px-2 py-1 rounded text-sm">
                          Section {app.fromSection}
                        </span>
                        <ArrowRight className="w-4 h-4 text-gray-400" />
                        <span className="font-mono bg-blue-100 px-2 py-1 rounded text-sm">
                          Section {app.toSection}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{app.newSchedule}</p>
                    </TableCell>
                    <TableCell className="text-sm">{app.instructor}</TableCell>
                    <TableCell>{getStatusBadge(app.status)}</TableCell>
                    <TableCell className="text-sm text-gray-600">{app.submittedAt}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Current Registered Courses */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5" />
            <span>Your Current Course Sections</span>
          </CardTitle>
          <CardDescription>Your registered courses and current sections for Fall 2024</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Course</TableHead>
                <TableHead>Current Section</TableHead>
                <TableHead>Instructor</TableHead>
                <TableHead>Schedule</TableHead>
                <TableHead>Room</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentRegistrations.map((course, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{course.courseCode}</p>
                      <p className="text-sm text-gray-600">{course.courseName}</p>
                      <p className="text-xs text-gray-500">{course.credits} credits</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-mono">
                      Section {course.currentSection}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">{course.instructor}</TableCell>
                  <TableCell className="text-sm">{course.schedule}</TableCell>
                  <TableCell className="text-sm">{course.room}</TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedCourse(course.courseCode)}
                      disabled={isDeadlinePassed || hasExistingApplication(course.courseCode)}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      {hasExistingApplication(course.courseCode) ? 'Applied' : 'Apply Change'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Section Change Application Form */}
      {selectedCourse && !isDeadlinePassed && !hasExistingApplication(selectedCourse) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span>Section Change Application</span>
            </CardTitle>
            <CardDescription>
              Apply to change section for {getCurrentCourseInfo()?.courseCode} - {getCurrentCourseInfo()?.courseName}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Current Section Info */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">Current Section</h4>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p><span className="font-medium">Section:</span> {getCurrentCourseInfo()?.currentSection}</p>
                    <p><span className="font-medium">Instructor:</span> {getCurrentCourseInfo()?.instructor}</p>
                  </div>
                  <div>
                    <p><span className="font-medium">Schedule:</span> {getCurrentCourseInfo()?.schedule}</p>
                    <p><span className="font-medium">Room:</span> {getCurrentCourseInfo()?.room}</p>
                  </div>
                </div>
              </div>

              {/* Target Section Selection */}
              <div className="space-y-2">
                <Label>Select New Section *</Label>
                <Select value={selectedTargetSection} onValueChange={setSelectedTargetSection}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a different section" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableSections[selectedCourse as keyof typeof availableSections]?.map(section => (
                      <SelectItem 
                        key={section.section} 
                        value={section.section}
                        disabled={
                          section.section === getCurrentCourseInfo()?.currentSection || 
                          section.enrolled >= section.capacity
                        }
                      >
                        Section {section.section} - {section.instructor} 
                        ({section.enrolled}/{section.capacity})
                        {section.enrolled >= section.capacity && ' (Full)'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Target Section Details */}
              {selectedTargetSection && getTargetSectionInfo() && (
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">New Section Details</h4>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p><span className="font-medium">Section:</span> {getTargetSectionInfo()?.section}</p>
                      <p><span className="font-medium">Instructor:</span> {getTargetSectionInfo()?.instructor}</p>
                    </div>
                    <div>
                      <p><span className="font-medium">Schedule:</span> {getTargetSectionInfo()?.schedule}</p>
                      <p><span className="font-medium">Capacity:</span> {getTargetSectionInfo()?.enrolled}/{getTargetSectionInfo()?.capacity}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Reason for Change */}
              <div className="space-y-2">
                <Label htmlFor="reason">Reason for Section Change *</Label>
                <textarea
                  id="reason"
                  className="w-full p-3 border rounded-lg resize-none"
                  rows={4}
                  placeholder="Please provide a detailed reason for the section change (e.g., schedule conflict, transportation issues, academic preferences, etc.)"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />
                <p className="text-sm text-gray-500">
                  Minimum 20 characters required. Be specific about your circumstances.
                </p>
              </div>

              {/* Important Notice */}
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-yellow-800">Important Notice</p>
                    <ul className="text-yellow-700 mt-1 list-disc list-inside space-y-1">
                      <li>Section changes are subject to availability and approval</li>
                      <li>Your current section seat will be released only after approval</li>
                      <li>Changes may affect your class schedule and room assignments</li>
                      <li>Medical or urgent family reasons receive priority consideration</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-3">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSelectedCourse('')
                    setSelectedTargetSection('')
                    setReason('')
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => setShowConfirmDialog(true)}
                  disabled={!selectedTargetSection || !reason.trim() || reason.trim().length < 20}
                >
                  Submit Application
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Locked State for Past Deadline */}
      {isDeadlinePassed && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6 text-center">
            <div className="text-red-600 mb-4">
              <X className="w-16 h-16 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-red-800 mb-2">Applications Closed</h3>
              <p className="text-red-700">
                The deadline for section change applications has passed.
              </p>
              <p className="text-red-700 mt-2">
                <strong>Deadline was:</strong> {formatDeadlineDate(sectionChangeDeadline)}
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
            <DialogTitle>Confirm Section Change Application</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Application Summary</h4>
              <p className="text-blue-700">
                <strong>Course:</strong> {getCurrentCourseInfo()?.courseCode} - {getCurrentCourseInfo()?.courseName}
              </p>
              <div className="flex items-center space-x-2 mt-2">
                <span className="font-mono bg-white px-2 py-1 rounded text-sm">
                  Section {getCurrentCourseInfo()?.currentSection}
                </span>
                <ArrowRight className="w-4 h-4 text-blue-600" />
                <span className="font-mono bg-white px-2 py-1 rounded text-sm">
                  Section {selectedTargetSection}
                </span>
              </div>
              <p className="text-blue-700 mt-2">
                <strong>New Instructor:</strong> {getTargetSectionInfo()?.instructor}
              </p>
              <p className="text-blue-700">
                <strong>New Schedule:</strong> {getTargetSectionInfo()?.schedule}
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
                    You will be notified via email once your application is processed.
                    Processing typically takes 2-3 business days.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmitApplication}>
                Confirm & Submit Application
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
