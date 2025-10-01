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
  Calendar
} from 'lucide-react'

export const AddDropCourses = () => {
  const [filterProgramType, setFilterProgramType] = useState('all')
  const [filterProgram, setFilterProgram] = useState('all')
  const [filterSemester, setFilterSemester] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [pendingAction, setPendingAction] = useState<any>(null)

  // Deadline for add/drop course applications (example: February 15, 2024)
  const addDropDeadline = new Date('2024-02-15T23:59:59')
  const currentDate = new Date()
  const isDeadlinePassed = currentDate > addDropDeadline
  const daysUntilDeadline = Math.ceil((addDropDeadline.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24))

  // Student's currently enrolled courses
  const enrolledCourses = [
    'CSE101', 'MAT101', 'PHY101', 'ENG101', 'CSE201', 'MAT201'
  ]

  // All available courses
  const allCourses = [
    { code: 'CSE101', title: 'Programming Fundamentals', credits: 3, program: 'CSE', semester: 1, type: 'undergraduate', capacity: '320/350', status: 'Available' },
    { code: 'CSE102', title: 'Programming Lab', credits: 1, program: 'CSE', semester: 1, type: 'undergraduate', capacity: '300/320', status: 'Available' },
    { code: 'CSE201', title: 'Data Structures', credits: 3, program: 'CSE', semester: 2, type: 'undergraduate', capacity: '280/300', status: 'Available' },
    { code: 'CSE202', title: 'Data Structures Lab', credits: 1, program: 'CSE', semester: 2, type: 'undergraduate', capacity: '270/280', status: 'Available' },
    { code: 'CSE301', title: 'Algorithms', credits: 3, program: 'CSE', semester: 3, type: 'undergraduate', capacity: '240/280', status: 'Available' },
    { code: 'CSE302', title: 'Database Systems', credits: 3, program: 'CSE', semester: 3, type: 'undergraduate', capacity: '220/250', status: 'Available' },
    { code: 'CSE401', title: 'Software Engineering', credits: 3, program: 'CSE', semester: 4, type: 'undergraduate', capacity: '310/350', status: 'Available' },
    { code: 'CSE402', title: 'Computer Networks', credits: 3, program: 'CSE', semester: 4, type: 'undergraduate', capacity: '290/320', status: 'Available' },
    { code: 'CSE501', title: 'Artificial Intelligence', credits: 3, program: 'CSE', semester: 5, type: 'undergraduate', capacity: '180/200', status: 'Available' },
    { code: 'CSE502', title: 'Machine Learning', credits: 3, program: 'CSE', semester: 5, type: 'undergraduate', capacity: '160/180', status: 'Available' },
    
    // BBA Courses
    { code: 'BBA101', title: 'Principles of Management', credits: 3, program: 'BBA', semester: 1, type: 'undergraduate', capacity: '180/200', status: 'Available' },
    { code: 'BBA201', title: 'Organizational Behavior', credits: 3, program: 'BBA', semester: 2, type: 'undergraduate', capacity: '170/190', status: 'Available' },
    { code: 'BBA301', title: 'Strategic Management', credits: 3, program: 'BBA', semester: 3, type: 'undergraduate', capacity: '140/160', status: 'Available' },
    
    // EEE Courses
    { code: 'EEE101', title: 'Electrical Circuits I', credits: 3, program: 'EEE', semester: 1, type: 'undergraduate', capacity: '200/220', status: 'Available' },
    { code: 'EEE201', title: 'Circuit Analysis', credits: 3, program: 'EEE', semester: 2, type: 'undergraduate', capacity: '180/200', status: 'Available' },
    
    // Common Courses
    { code: 'MAT101', title: 'Calculus I', credits: 3, program: 'Common', semester: 1, type: 'undergraduate', capacity: '300/350', status: 'Available' },
    { code: 'MAT201', title: 'Calculus II', credits: 3, program: 'Common', semester: 2, type: 'undergraduate', capacity: '280/320', status: 'Available' },
    { code: 'PHY101', title: 'Physics I', credits: 3, program: 'Common', semester: 1, type: 'undergraduate', capacity: '280/320', status: 'Available' },
    { code: 'PHY201', title: 'Physics II', credits: 3, program: 'Common', semester: 2, type: 'undergraduate', capacity: '260/300', status: 'Available' },
    { code: 'ENG101', title: 'English I', credits: 3, program: 'Common', semester: 1, type: 'undergraduate', capacity: '350/400', status: 'Available' },
    { code: 'ENG201', title: 'English II', credits: 3, program: 'Common', semester: 2, type: 'undergraduate', capacity: '330/380', status: 'Available' },
  ]

  // Student's add/drop applications
  const [applications, setApplications] = useState([
    { id: 1, courseCode: 'CSE301', action: 'Add', status: 'Pending', submittedAt: '2024-01-15 10:30' },
    { id: 2, courseCode: 'PHY101', action: 'Drop', status: 'Under Review', submittedAt: '2024-01-14 14:20' },
  ])

  // Filter courses based on selected filters and search term
  const filteredCourses = allCourses.filter(course => {
    const matchesProgramType = filterProgramType === 'all' || course.type === filterProgramType
    const matchesProgram = filterProgram === 'all' || course.program === filterProgram
    const matchesSemester = filterSemester === 'all' || course.semester.toString() === filterSemester
    const matchesSearch = !searchTerm ||
      course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.title.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesProgramType && matchesProgram && matchesSemester && matchesSearch
  })

  const handleAction = (course: any, action: 'Add' | 'Drop') => {
    setPendingAction({ course, action })
    setShowConfirmDialog(true)
  }

  const confirmAction = () => {
    if (!pendingAction) return

    const { course, action } = pendingAction
    
    // Create new application
    const newApplication = {
      id: applications.length + 1,
      courseCode: course.code,
      action,
      status: 'Pending',
      submittedAt: new Date().toLocaleString()
    }
    
    setApplications(prev => [...prev, newApplication])
    setShowConfirmDialog(false)
    setPendingAction(null)
    
    // Show success message based on action
    if (action === 'Add') {
      alert(`Your request to ADD ${course.code} - ${course.title} has been submitted to Academic Affairs (ACAD) for review. You will be notified once it's processed.`)
    } else {
      alert(`Your request to DROP ${course.code} - ${course.title} has been submitted to Academic Affairs (ACAD) for review. You will be notified once it's processed.`)
    }
  }

  const isEnrolled = (courseCode: string) => enrolledCourses.includes(courseCode)
  const hasPendingApplication = (courseCode: string) =>
    applications.some(app => app.courseCode === courseCode && (app.status === 'Pending' || app.status === 'Under Review'))

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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-deep-plum">Add/Drop Courses</h1>
          <p className="text-gray-600 mt-1">Apply to add or drop courses for the current semester</p>
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
                Add/Drop Course Application Deadline
              </h3>
              <p className={`text-sm ${
                isDeadlinePassed
                  ? 'text-red-700'
                  : daysUntilDeadline <= 3
                  ? 'text-yellow-700'
                  : 'text-blue-700'
              }`}>
                <strong>Deadline:</strong> {formatDeadlineDate(addDropDeadline)}
              </p>
              {isDeadlinePassed ? (
                <p className="text-sm text-red-700 mt-1 font-medium">
                  ⚠️ The deadline has passed. Add/Drop course applications are no longer accepted for this semester.
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
      <Card>
        <CardHeader>
          <CardTitle>Your Applications</CardTitle>
          <CardDescription>Track the status of your add/drop requests</CardDescription>
        </CardHeader>
        <CardContent>
          {applications.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Course Code</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submitted</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applications.map((app) => (
                  <TableRow key={app.id}>
                    <TableCell className="font-medium">{app.courseCode}</TableCell>
                    <TableCell>
                      <Badge variant={app.action === 'Add' ? 'default' : 'secondary'}>
                        {app.action === 'Add' ? <Plus className="w-3 h-3 mr-1" /> : <Minus className="w-3 h-3 mr-1" />}
                        {app.action}
                      </Badge>
                    </TableCell>
                    <TableCell>{getStatusBadge(app.status)}</TableCell>
                    <TableCell className="text-sm text-gray-600">{app.submittedAt}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No add/drop applications submitted yet</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Course Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Course Filters & Search</CardTitle>
          <CardDescription>Filter available courses and submit add/drop requests</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-5 gap-4">
            <div className="space-y-2">
              <Label>Program Type</Label>
              <Select value={filterProgramType} onValueChange={setFilterProgramType}>
                <SelectTrigger>
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="undergraduate">Undergraduate</SelectItem>
                  <SelectItem value="postgraduate">Postgraduate</SelectItem>
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
                  <SelectItem value="all">All Programs</SelectItem>
                  <SelectItem value="CSE">CSE</SelectItem>
                  <SelectItem value="BBA">BBA</SelectItem>
                  <SelectItem value="EEE">EEE</SelectItem>
                  <SelectItem value="Common">Common Courses</SelectItem>
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
                  <SelectItem value="1">1st Semester</SelectItem>
                  <SelectItem value="2">2nd Semester</SelectItem>
                  <SelectItem value="3">3rd Semester</SelectItem>
                  <SelectItem value="4">4th Semester</SelectItem>
                  <SelectItem value="5">5th Semester</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Search Courses</Label>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search by code, title..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex items-end">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setFilterProgramType('all')
                  setFilterProgram('all')
                  setFilterSemester('all')
                  setSearchTerm('')
                }}
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Available Courses */}
      <Card>
        <CardHeader>
          <CardTitle>Available Courses ({filteredCourses.length})</CardTitle>
          <CardDescription>
            Select courses to add or drop. Green badges indicate courses you're currently enrolled in.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Course Code</TableHead>
                <TableHead>Course Title</TableHead>
                <TableHead>Credits</TableHead>
                <TableHead>Program</TableHead>
                <TableHead>Semester</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCourses.map((course) => {
                const enrolled = isEnrolled(course.code)
                const pending = hasPendingApplication(course.code)
                
                return (
                  <TableRow key={course.code}>
                    <TableCell className="font-medium">{course.code}</TableCell>
                    <TableCell>{course.title}</TableCell>
                    <TableCell>{course.credits}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{course.program}</Badge>
                    </TableCell>
                    <TableCell>{course.semester}</TableCell>
                    <TableCell>{course.capacity}</TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        {enrolled && (
                          <Badge variant="default" className="bg-green-100 text-green-800">
                            Enrolled
                          </Badge>
                        )}
                        {pending && (
                          <Badge variant="secondary">
                            Pending
                          </Badge>
                        )}
                        {!enrolled && !pending && (
                          <Badge variant="secondary">
                            {course.status}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        {enrolled ? (
                          <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleAction(course, 'Drop')}
                          disabled={pending || isDeadlinePassed}
                          className="text-red-600 hover:text-red-700"
                        >
                            <Minus className="w-4 h-4 mr-1" />
                            Drop
                          </Button>
                        ) : (
                          <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleAction(course, 'Add')}
                          disabled={pending || isDeadlinePassed}
                          className="text-green-600 hover:text-green-700"
                        >
                            <Plus className="w-4 h-4 mr-1" />
                            Add
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>

          {filteredCourses.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No courses match your current filter criteria</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm {pendingAction?.action} Course</DialogTitle>
          </DialogHeader>
          
          {pendingAction && (
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">
                  {pendingAction.action === 'Add' ? 'Add Course Request' : 'Drop Course Request'}
                </h4>
                <p className="text-blue-700">
                  <strong>Course:</strong> {pendingAction.course.code} - {pendingAction.course.title}
                </p>
                <p className="text-blue-700">
                  <strong>Credits:</strong> {pendingAction.course.credits}
                </p>
                <p className="text-blue-700">
                  <strong>Action:</strong> {pendingAction.action} this course
                </p>
              </div>
              
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-yellow-800">Important Notice:</p>
                    <p className="text-yellow-700 mt-1">
                      Your request will be sent to Academic Affairs (ACAD) for review. 
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
                <Button onClick={confirmAction}>
                  Submit Request
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
