import { useState } from 'react'
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
  GraduationCap
} from 'lucide-react'

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
}

export const SemesterRegistration = ({ activeTab = 'last' }: SemesterRegistrationProps) => {
  const [selectedCourses, setSelectedCourses] = useState<{[key: string]: {selected: boolean, section: string}}>({})
  const [registrationClosed, setRegistrationClosed] = useState(false) // In real app, this would be calculated based on dates

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
        <Badge className="bg-blue-100 text-blue-800">
          <BookOpen className="w-4 h-4 mr-1" />
          Course Registration
        </Badge>
      </div>

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
          {registrationClosed ? (
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
                        <span className="font-medium text-green-700">Advisor Contact:</span>
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

                  <div className="mt-6 flex justify-between items-center">
                    <div className="text-sm text-gray-600">
                      <AlertCircle className="w-4 h-4 inline mr-1" />
                      Please ensure you select sections for all chosen courses
                    </div>
                    <Button 
                      onClick={handleSubmitRegistration}
                      className="nu-button-primary"
                      disabled={getTotalSelectedCredits() === 0}
                    >
                      Submit Registration
                    </Button>
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
