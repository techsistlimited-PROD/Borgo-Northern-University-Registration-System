import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  BookOpen,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  User,
  Phone,
  Calendar,
  GraduationCap,
  DollarSign,
  AlertTriangle,
  Bell,
  CreditCard,
  Lock,
  Unlock,
  FileText,
  MessageCircle,
  Info
} from 'lucide-react'

// Student holds and financial information
const studentHolds = {
  hasFinancialHold: true,
  hasConductHold: false,
  hasAcademicHold: false,
  financialDetails: {
    totalDue: 45000,
    semesterFee: 35000,
    libraryFine: 500,
    hostleDue: 9500,
    lastPaymentDate: '2024-08-15',
    nextInstallmentDue: '2024-12-15'
  },
  conductDetails: null,
  academicDetails: null
}

// Notification system
const notifications = [
  {
    id: 1,
    type: 'warning',
    title: 'Financial Hold Active',
    message: 'Your registration is blocked due to outstanding dues of ৳45,000. Please clear your dues to proceed.',
    timestamp: '2024-01-15 14:30',
    isRead: false,
    priority: 'high'
  },
  {
    id: 2,
    type: 'info',
    title: 'Registration Reminder',
    message: 'Fall 2024 registration ends in 3 days. Please complete your course selection.',
    timestamp: '2024-01-14 09:00',
    isRead: true,
    priority: 'medium'
  },
  {
    id: 3,
    type: 'success',
    title: 'Teacher Approval Required',
    message: 'Your registration is pending approval from Dr. Aminul Islam. Contact: 01712345678',
    timestamp: '2024-01-13 16:45',
    isRead: false,
    priority: 'high'
  },
  {
    id: 4,
    type: 'info',
    title: 'Registration Period Started',
    message: 'Fall 2024 semester registration is now open. Last date: January 20, 2024.',
    timestamp: '2024-01-10 08:00',
    isRead: true,
    priority: 'medium'
  }
]

// Pre-registration schedule
const preRegistrationSchedule = {
  isPreRegistrationOpen: true,
  preRegistrationStart: '2024-01-05',
  preRegistrationEnd: '2024-01-12',
  mainRegistrationStart: '2024-01-15',
  mainRegistrationEnd: '2024-01-20',
  classStartDate: '2024-01-25'
}

// Performance and remaining courses data
const academicPerformance = {
  overallCGPA: 3.45,
  totalCreditsCompleted: 84,
  totalCreditsRequired: 144,
  remainingCredits: 60,
  expectedGraduationSemester: 'Fall 2025',
  remainingCourses: [
    { courseCode: 'CSE 4101', courseTitle: 'Software Project Management', credits: 3, isCore: true },
    { courseCode: 'CSE 4102', courseTitle: 'Software Project Lab', credits: 1, isCore: true },
    { courseCode: 'CSE 4201', courseTitle: 'Machine Learning', credits: 3, isCore: false },
    { courseCode: 'CSE 4301', courseTitle: 'Computer Security', credits: 3, isCore: false },
    { courseCode: 'CSE 4999', courseTitle: 'Final Project', credits: 4, isCore: true }
  ]
}

// Mock data for last registration
const lastRegistration = {
  semester: 'Summer 2025',
  semesterNo: 4,
  registrationType: 'Regular',
  isApprovedByTeacher: true,
  totalCreditTaken: 15.0,
  registeredCourses: [
    { serial: 1, courseCode: 'CSE 2301', courseTitle: 'Database Management Systems', section: 'A', creditHour: 3.0 },
    { serial: 2, courseCode: 'CSE 2302', courseTitle: 'Database Lab', section: 'A', creditHour: 1.0 },
    { serial: 3, courseCode: 'CSE 2315', courseTitle: 'Software Engineering', section: 'B', creditHour: 3.0 },
    { serial: 4, courseCode: 'CSE 2316', courseTitle: 'Software Engineering Lab', section: 'B', creditHour: 1.0 },
    { serial: 5, courseCode: 'CSE 2345', courseTitle: 'Computer Networks', section: 'A', creditHour: 3.0 },
    { serial: 6, courseCode: 'ENG 2201', courseTitle: 'Technical Writing', section: 'C', creditHour: 2.0 },
    { serial: 7, courseCode: 'MATH 2203', courseTitle: 'Statistics & Probability', section: 'A', creditHour: 2.0 }
  ]
}

// Mock data for available courses in new registration
const availableCourses = [
  { courseCode: 'CSE 3101', courseTitle: 'Operating Systems', credit: 3.0, sections: ['A', 'B', 'C'] },
  { courseCode: 'CSE 3102', courseTitle: 'Operating Systems Lab', credit: 1.0, sections: ['A', 'B', 'C'] },
  { courseCode: 'CSE 3201', courseTitle: 'Computer Graphics', credit: 3.0, sections: ['A', 'B'] },
  { courseCode: 'CSE 3202', courseTitle: 'Computer Graphics Lab', credit: 1.0, sections: ['A', 'B'] },
  { courseCode: 'CSE 3301', courseTitle: 'Artificial Intelligence', credit: 3.0, sections: ['A'] },
  { courseCode: 'MATH 3101', courseTitle: 'Numerical Analysis', credit: 3.0, sections: ['A', 'B'] },
  { courseCode: 'ENG 3101', courseTitle: 'Business Communication', credit: 2.0, sections: ['A', 'B', 'C'] }
]

// Mock data for all registrations
const allRegistrations = [
  {
    semester: 'Fall 2024',
    semesterNo: 1,
    registrationType: 'Regular',
    hasAccountsClearance: false,
    courses: [
      { serial: 1, courseCode: 'CSE 1101', courseTitle: 'Introduction to Programming', section: 'B', creditHour: 3.0, terFillUp: 'Done', terFillAt: '28/09/2024 11:45 PM', resultStatus: 'Result Published' },
      { serial: 2, courseCode: 'CSE 1102', courseTitle: 'Programming Lab', section: 'B', creditHour: 1.0, terFillUp: 'Done', terFillAt: '28/09/2024 11:42 PM', resultStatus: 'Result Published' },
      { serial: 3, courseCode: 'ENG 1101', courseTitle: 'English Fundamentals', section: 'B', creditHour: 3.0, terFillUp: 'Done', terFillAt: '28/09/2024 11:48 PM', resultStatus: 'Result Published' },
      { serial: 4, courseCode: 'MATH 1101', courseTitle: 'Calculus I', section: 'B', creditHour: 3.0, terFillUp: 'Done', terFillAt: '28/09/2024 11:50 PM', resultStatus: 'Result Published' }
    ]
  },
  {
    semester: 'Spring 2025',
    semesterNo: 2,
    registrationType: 'Regular',
    hasAccountsClearance: true,
    courses: [
      { serial: 1, courseCode: 'CSE 1201', courseTitle: 'Data Structures', section: 'A', creditHour: 3.0, terFillUp: 'Done', terFillAt: '15/04/2025 10:30 PM', resultStatus: 'Result Published' },
      { serial: 2, courseCode: 'CSE 1202', courseTitle: 'Data Structures Lab', section: 'A', creditHour: 1.0, terFillUp: 'Done', terFillAt: '15/04/2025 10:28 PM', resultStatus: 'Result Published' },
      { serial: 3, courseCode: 'CSE 1221', courseTitle: 'Digital Logic Design', section: 'A', creditHour: 3.0, terFillUp: 'Done', terFillAt: '15/04/2025 10:35 PM', resultStatus: 'Result Published' },
      { serial: 4, courseCode: 'ENG 1201', courseTitle: 'English Communication', section: 'A', creditHour: 3.0, terFillUp: 'Done', terFillAt: '15/04/2025 10:33 PM', resultStatus: 'Result Published' },
      { serial: 5, courseCode: 'MATH 1201', courseTitle: 'Calculus II', section: 'A', creditHour: 3.0, terFillUp: 'Done', terFillAt: '15/04/2025 10:37 PM', resultStatus: 'Result Published' }
    ]
  },
  {
    semester: 'Summer 2025',
    semesterNo: 3,
    registrationType: 'Regular',
    hasAccountsClearance: true,
    courses: [
      { serial: 1, courseCode: 'CSE 2101', courseTitle: 'Object Oriented Programming', section: 'A', creditHour: 3.0, terFillUp: 'Done', terFillAt: '25/08/2025 09:15 PM', resultStatus: 'Result Published' },
      { serial: 2, courseCode: 'CSE 2102', courseTitle: 'OOP Lab', section: 'A', creditHour: 1.0, terFillUp: 'Done', terFillAt: '25/08/2025 09:12 PM', resultStatus: 'Result Published' },
      { serial: 3, courseCode: 'CSE 2201', courseTitle: 'Algorithms', section: 'A', creditHour: 3.0, terFillUp: 'Done', terFillAt: '25/08/2025 09:20 PM', resultStatus: 'Result Published' },
      { serial: 4, courseCode: 'CSE 2202', courseTitle: 'Algorithms Lab', section: 'A', creditHour: 1.0, terFillUp: 'Done', terFillAt: '25/08/2025 09:18 PM', resultStatus: 'Result Published' },
      { serial: 5, courseCode: 'MATH 2101', courseTitle: 'Linear Algebra', section: 'A', creditHour: 3.0, terFillUp: 'Done', terFillAt: '25/08/2025 09:25 PM', resultStatus: 'Result Published' }
    ]
  },
  {
    semester: 'Fall 2025',
    semesterNo: 4,
    registrationType: 'Regular',
    hasAccountsClearance: false,
    courses: lastRegistration.registeredCourses.map(course => ({
      ...course,
      terFillUp: 'Not Done Yet',
      terFillAt: '',
      resultStatus: 'Pending'
    }))
  }
]

// Current semester info for new registration
const currentSemesterInfo = {
  semester: 'Fall 2025',
  registrationStartDate: '01/10/2025',
  registrationEndDate: '15/10/2025',
  classStartDate: '20/10/2025',
  teacherName: 'Dr. Aminul Islam',
  teacherContact: '01712345678'
}

interface SemesterRegistrationProps {
  activeTab?: string
  studentHolds?: {
    hasFinancialHold: boolean
    hasConductHold: boolean
    hasAcademicHold: boolean
    financialDetails: {
      totalDue: number
      semesterFee: number
      libraryFine: number
      hostleDue: number
      lastPaymentDate: string
      nextInstallmentDue: string
    }
    conductDetails: any
    academicDetails: any
  }
}

export const SemesterRegistration = ({ activeTab = 'last', studentHolds }: SemesterRegistrationProps) => {
  const [selectedCourses, setSelectedCourses] = useState<{[key: string]: {selected: boolean, section: string}}>({})
  const [registrationClosed, setRegistrationClosed] = useState(false) // In real app, this would be calculated based on dates
  const [showNotifications, setShowNotifications] = useState(false)
  const [unreadNotifications, setUnreadNotifications] = useState(notifications.filter(n => !n.isRead).length)
  const [registrationBlocked, setRegistrationBlocked] = useState(studentHolds.hasFinancialHold || studentHolds.hasConductHold || studentHolds.hasAcademicHold)

  useEffect(() => {
    // Check for completed courses that student is trying to register for
    const checkCompletedCourses = () => {
      // Mock check - in real app, this would check against academic history
      const completedCourses = ['CSE 2301'] // Example completed course
      selectedCourses && Object.keys(selectedCourses).forEach(courseCode => {
        if (completedCourses.includes(courseCode) && selectedCourses[courseCode].selected) {
          alert(`Warning: You have already completed ${courseCode} with a passing grade. Please contact ACAD if you need to re-register.`)
        }
      })
    }

    checkCompletedCourses()
  }, [selectedCourses])

  const handlePayDues = () => {
    alert('Redirecting to payment portal...')
    // In real app, this would redirect to payment system
  }

  const contactFinanceOffice = () => {
    alert('Contact Finance Office: +880-1711-123456 or finance@nu.edu.bd')
  }

  const markNotificationAsRead = (notificationId: number) => {
    setUnreadNotifications(prev => Math.max(0, prev - 1))
  }

  const handleCourseSelection = (courseCode: string, selected: boolean) => {
    setSelectedCourses(prev => ({
      ...prev,
      [courseCode]: { ...prev[courseCode], selected }
    }))
  }

  const handleSectionSelection = (courseCode: string, section: string) => {
    setSelectedCourses(prev => ({
      ...prev,
      [courseCode]: { ...prev[courseCode], section }
    }))
  }

  const getTotalSelectedCredits = () => {
    return Object.entries(selectedCourses)
      .filter(([_, data]) => data.selected)
      .reduce((total, [courseCode, _]) => {
        const course = availableCourses.find(c => c.courseCode === courseCode)
        return total + (course?.credit || 0)
      }, 0)
  }

  const handleSubmitRegistration = () => {
    // In real app, this would submit to backend
    alert('Registration submitted successfully! Redirecting to Last Registration...')
    setActiveTab('last')
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-deep-plum">Semester Registration</h1>
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative"
          >
            <Bell className="w-4 h-4 mr-2" />
            Notifications
            {unreadNotifications > 0 && (
              <Badge className="absolute -top-2 -right-2 bg-red-500 text-white px-1 min-w-5 h-5 text-xs">
                {unreadNotifications}
              </Badge>
            )}
          </Button>
          <Badge className="bg-blue-100 text-blue-800">
            <BookOpen className="w-4 h-4 mr-1" />
            Course Registration
          </Badge>
        </div>
      </div>

      {/* Notifications Panel */}
      {showNotifications && (
        <Card className="border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bell className="w-5 h-5" />
              <span>Notifications</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 rounded-lg border-l-4 ${
                    notification.type === 'warning' ? 'border-yellow-400 bg-yellow-50' :
                    notification.type === 'error' ? 'border-red-400 bg-red-50' :
                    notification.type === 'success' ? 'border-green-400 bg-green-50' :
                    'border-blue-400 bg-blue-50'
                  } ${!notification.isRead ? 'ring-2 ring-blue-200' : ''}`}
                  onClick={() => markNotificationAsRead(notification.id)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{notification.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                      <p className="text-xs text-gray-500 mt-2">{notification.timestamp}</p>
                    </div>
                    <Badge variant={notification.priority === 'high' ? 'destructive' : notification.priority === 'medium' ? 'default' : 'secondary'}>
                      {notification.priority}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Student Holds Alert */}
      {registrationBlocked && (
        <Card className="border-red-500 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-800 flex items-center space-x-2">
              <Lock className="w-5 h-5" />
              <span>Registration Blocked</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {studentHolds.hasFinancialHold && (
                <div className="p-4 bg-red-100 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <DollarSign className="w-6 h-6 text-red-600 mt-1" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-red-800">Financial Hold</h4>
                      <p className="text-red-700 text-sm mt-1">
                        You have outstanding dues of ৳{studentHolds.financialDetails.totalDue.toLocaleString()}.
                        Registration is blocked until payment is made.
                      </p>
                      <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Semester Fee:</span> ৳{studentHolds.financialDetails.semesterFee.toLocaleString()}
                        </div>
                        <div>
                          <span className="font-medium">Hostel Due:</span> ৳{studentHolds.financialDetails.hostleDue.toLocaleString()}
                        </div>
                        <div>
                          <span className="font-medium">Library Fine:</span> ৳{studentHolds.financialDetails.libraryFine.toLocaleString()}
                        </div>
                        <div>
                          <span className="font-medium">Next Installment:</span> {studentHolds.financialDetails.nextInstallmentDue}
                        </div>
                      </div>
                      <div className="mt-4 flex space-x-3">
                        <Button onClick={handlePayDues} className="bg-green-600 hover:bg-green-700">
                          <CreditCard className="w-4 h-4 mr-2" />
                          Pay Online
                        </Button>
                        <Button variant="outline" onClick={contactFinanceOffice}>
                          <Phone className="w-4 h-4 mr-2" />
                          Contact Finance
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {studentHolds.hasConductHold && (
                <div className="p-4 bg-yellow-100 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="w-6 h-6 text-yellow-600 mt-1" />
                    <div>
                      <h4 className="font-semibold text-yellow-800">Conduct Hold</h4>
                      <p className="text-yellow-700 text-sm mt-1">
                        There is a conduct hold on your account. Please contact the Student Affairs office.
                      </p>
                      <Button variant="outline" className="mt-3">
                        <Phone className="w-4 h-4 mr-2" />
                        Contact Student Affairs
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {studentHolds.hasAcademicHold && (
                <div className="p-4 bg-orange-100 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <GraduationCap className="w-6 h-6 text-orange-600 mt-1" />
                    <div>
                      <h4 className="font-semibold text-orange-800">Academic Hold</h4>
                      <p className="text-orange-700 text-sm mt-1">
                        There is an academic hold on your account. Please contact the Academic office.
                      </p>
                      <Button variant="outline" className="mt-3">
                        <Phone className="w-4 h-4 mr-2" />
                        Contact ACAD
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pre-Registration Notice */}
      {preRegistrationSchedule.isPreRegistrationOpen && (
        <Card className="border-blue-500 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-800 flex items-center space-x-2">
              <Calendar className="w-5 h-5" />
              <span>Pre-Registration Period</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-blue-700 font-medium">Pre-Registration:</span>
                  <span className="text-blue-800">{preRegistrationSchedule.preRegistrationStart} - {preRegistrationSchedule.preRegistrationEnd}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700 font-medium">Main Registration:</span>
                  <span className="text-blue-800">{preRegistrationSchedule.mainRegistrationStart} - {preRegistrationSchedule.mainRegistrationEnd}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-blue-700 font-medium">Classes Start:</span>
                  <span className="text-blue-800">{preRegistrationSchedule.classStartDate}</span>
                </div>
                <p className="text-blue-700 text-sm">
                  <Info className="w-4 h-4 inline mr-1" />
                  Pre-register now to secure your preferred courses and sections.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Academic Performance Summary */}
      <Card className="border-purple-200 bg-purple-50">
        <CardHeader>
          <CardTitle className="text-purple-800 flex items-center space-x-2">
            <GraduationCap className="w-5 h-5" />
            <span>Academic Progress</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4 mb-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-800">{academicPerformance.overallCGPA}</p>
              <p className="text-sm text-purple-600">Overall CGPA</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-800">{academicPerformance.totalCreditsCompleted}</p>
              <p className="text-sm text-purple-600">Credits Completed</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-800">{academicPerformance.remainingCredits}</p>
              <p className="text-sm text-purple-600">Credits Remaining</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-purple-800">{academicPerformance.expectedGraduationSemester}</p>
              <p className="text-sm text-purple-600">Expected Graduation</p>
            </div>
          </div>

          <div className="mt-4">
            <h4 className="font-semibold text-purple-800 mb-2">Remaining Core Courses</h4>
            <div className="flex flex-wrap gap-2">
              {academicPerformance.remainingCourses.filter(c => c.isCore).map(course => (
                <Badge key={course.courseCode} variant="outline" className="text-purple-700">
                  {course.courseCode} - {course.credits} credits
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="last">Last Registration</TabsTrigger>
          <TabsTrigger value="new">New Registration</TabsTrigger>
          <TabsTrigger value="all">All Registration</TabsTrigger>
        </TabsList>

        {/* Last Registration Tab */}
        <TabsContent value="last" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Last Registration Details</CardTitle>
              <CardDescription>Your most recent semester registration</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6 mb-6">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">Semester:</span>
                    <span className="font-semibold text-deep-plum">{lastRegistration.semester}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">Semester No:</span>
                    <span>{lastRegistration.semesterNo}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">Registration Type:</span>
                    <span>{lastRegistration.registrationType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">Teacher Approved:</span>
                    <Badge className={lastRegistration.isApprovedByTeacher ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                      {lastRegistration.isApprovedByTeacher ? (
                        <CheckCircle className="w-3 h-3 mr-1" />
                      ) : (
                        <Clock className="w-3 h-3 mr-1" />
                      )}
                      {lastRegistration.isApprovedByTeacher ? 'Yes' : 'Pending'}
                    </Badge>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">Total Credits:</span>
                    <span className="font-bold text-deep-plum">{lastRegistration.totalCreditTaken}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-deep-plum mb-3">Registered Courses</h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Serial</TableHead>
                      <TableHead>Course Code</TableHead>
                      <TableHead>Course Title</TableHead>
                      <TableHead>Section</TableHead>
                      <TableHead>Credit Hour</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {lastRegistration.registeredCourses.map((course) => (
                      <TableRow key={course.serial}>
                        <TableCell>{course.serial}</TableCell>
                        <TableCell className="font-medium">{course.courseCode}</TableCell>
                        <TableCell>{course.courseTitle}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{course.section}</Badge>
                        </TableCell>
                        <TableCell>{course.creditHour}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* New Registration Tab */}
        <TabsContent value="new" className="space-y-4">
          {registrationBlocked ? (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="pt-6">
                <div className="text-center">
                  <Lock className="w-16 h-16 text-red-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-red-800 mb-2">Registration Blocked</h3>
                  <p className="text-red-700">
                    Your registration is currently blocked due to active holds. Please resolve the issues shown above to proceed.
                  </p>
                  <div className="mt-4 flex justify-center space-x-3">
                    {studentHolds.hasFinancialHold && (
                      <Button onClick={handlePayDues} className="bg-green-600 hover:bg-green-700">
                        <CreditCard className="w-4 h-4 mr-2" />
                        Pay Dues
                      </Button>
                    )}
                    <Button variant="outline" onClick={() => alert('Contact support: +880-1711-123456')}>
                      <Phone className="w-4 h-4 mr-2" />
                      Contact Support
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : registrationClosed ? (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="pt-6">
                <div className="text-center">
                  <XCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-red-800 mb-2">Registration Closed</h3>
                  <p className="text-red-700">
                    The registration period for this semester has ended. Please contact the academic office for assistance.
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Current Semester Info */}
              <Card className="border-green-200 bg-green-50">
                <CardHeader>
                  <CardTitle className="text-green-800">Current Semester Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-green-700">Semester:</span>
                        <span className="font-bold text-green-800">{currentSemesterInfo.semester}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-green-700">Registration Start:</span>
                        <span>{currentSemesterInfo.registrationStartDate}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-green-700">Registration End:</span>
                        <span>{currentSemesterInfo.registrationEndDate}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-green-700">Class Start:</span>
                        <span>{currentSemesterInfo.classStartDate}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-green-700">Academic Advisor:</span>
                        <span>{currentSemesterInfo.teacherName}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-green-700">Contact:</span>
                        <span>{currentSemesterInfo.teacherContact}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Course Selection */}
              <Card>
                <CardHeader>
                  <CardTitle>Available Courses</CardTitle>
                  <CardDescription>
                    Select courses for {currentSemesterInfo.semester} semester
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4 flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      Selected Credits: <span className="font-bold text-deep-plum">{getTotalSelectedCredits()}</span> / 21 (Max)
                    </span>
                  </div>

                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">Select</TableHead>
                        <TableHead>Course Code</TableHead>
                        <TableHead>Course Title</TableHead>
                        <TableHead>Credit</TableHead>
                        <TableHead>Section</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {availableCourses.map((course) => (
                        <TableRow key={course.courseCode}>
                          <TableCell>
                            <input
                              type="checkbox"
                              checked={selectedCourses[course.courseCode]?.selected || false}
                              onChange={(e) => handleCourseSelection(course.courseCode, e.target.checked)}
                              className="w-4 h-4 text-deep-plum"
                            />
                          </TableCell>
                          <TableCell className="font-medium">{course.courseCode}</TableCell>
                          <TableCell>{course.courseTitle}</TableCell>
                          <TableCell>{course.credit}</TableCell>
                          <TableCell>
                            <Select
                              disabled={!selectedCourses[course.courseCode]?.selected}
                              onValueChange={(value) => handleSectionSelection(course.courseCode, value)}
                            >
                              <SelectTrigger className="w-20">
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                              <SelectContent>
                                {course.sections.map((section) => (
                                  <SelectItem key={section} value={section}>
                                    {section}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  <div className="mt-6 space-y-4">
                    {/* Warnings and Notices */}
                    <div className="space-y-2">
                      {getTotalSelectedCredits() > 18 && (
                        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start space-x-2">
                          <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                          <div>
                            <p className="text-yellow-800 font-medium">Credit Overload Warning</p>
                            <p className="text-yellow-700 text-sm">
                              You have selected {getTotalSelectedCredits()} credits. Overload (&gt;18 credits) requires special approval.
                            </p>
                          </div>
                        </div>
                      )}

                      {getTotalSelectedCredits() < 12 && getTotalSelectedCredits() > 0 && (
                        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-start space-x-2">
                          <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                          <div>
                            <p className="text-blue-800 font-medium">Minimum Credit Notice</p>
                            <p className="text-blue-700 text-sm">
                              Minimum 12 credits required for full-time status. Current: {getTotalSelectedCredits()} credits.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Teacher Approval Notice */}
                    <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                      <div className="flex items-start space-x-2">
                        <User className="w-5 h-5 text-purple-600 mt-0.5" />
                        <div>
                          <p className="text-purple-800 font-medium">Teacher Approval Required</p>
                          <p className="text-purple-700 text-sm">
                            Your registration will be sent to {currentSemesterInfo.teacherName} for approval.
                            You can edit your registration until it is approved.
                          </p>
                          <div className="mt-2 flex items-center space-x-4 text-sm">
                            <span className="text-purple-600">
                              <Phone className="w-4 h-4 inline mr-1" />
                              {currentSemesterInfo.teacherContact}
                            </span>
                            <span className="text-purple-600">
                              <Clock className="w-4 h-4 inline mr-1" />
                              Auto-notification if pending &gt;72 hours
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-600">
                        <AlertCircle className="w-4 h-4 inline mr-1" />
                        Please ensure you select sections for all chosen courses
                      </div>
                      <Button
                        onClick={handleSubmitRegistration}
                        className="nu-button-primary"
                        disabled={getTotalSelectedCredits() === 0 || registrationBlocked}
                      >
                        {registrationBlocked ? (
                          <>
                            <Lock className="w-4 h-4 mr-2" />
                            Registration Blocked
                          </>
                        ) : (
                          <>
                            <FileText className="w-4 h-4 mr-2" />
                            Submit for Approval
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        {/* All Registration Tab */}
        <TabsContent value="all" className="space-y-4">
          {allRegistrations.map((registration, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-deep-plum">{registration.semester}</CardTitle>
                  <div className="flex space-x-2">
                    <Badge variant="outline">Semester No: {registration.semesterNo}</Badge>
                    <Badge className={registration.hasAccountsClearance ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                      Accounts: {registration.hasAccountsClearance ? 'Clear' : 'Pending'}
                    </Badge>
                  </div>
                </div>
                <CardDescription>
                  Registration Type: {registration.registrationType}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Serial</TableHead>
                      <TableHead>Course Code</TableHead>
                      <TableHead>Course Title</TableHead>
                      <TableHead>Section</TableHead>
                      <TableHead>Credit Hour</TableHead>
                      <TableHead>TER Fill Up</TableHead>
                      <TableHead>TER Fill At</TableHead>
                      <TableHead>Result Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {registration.courses.map((course) => (
                      <TableRow key={course.serial}>
                        <TableCell>{course.serial}</TableCell>
                        <TableCell className="font-medium">{course.courseCode}</TableCell>
                        <TableCell>{course.courseTitle}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{course.section}</Badge>
                        </TableCell>
                        <TableCell>{course.creditHour}</TableCell>
                        <TableCell>
                          <Badge className={course.terFillUp === 'Done' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                            {course.terFillUp === 'Done' ? (
                              <CheckCircle className="w-3 h-3 mr-1" />
                            ) : (
                              <Clock className="w-3 h-3 mr-1" />
                            )}
                            {course.terFillUp}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">{course.terFillAt}</TableCell>
                        <TableCell>
                          <Badge className={course.resultStatus === 'Result Published' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}>
                            {course.resultStatus}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
