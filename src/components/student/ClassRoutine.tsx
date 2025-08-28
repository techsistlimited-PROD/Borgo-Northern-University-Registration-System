import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { 
  Calendar,
  Clock,
  MapPin,
  User,
  BookOpen
} from 'lucide-react'

// Mock class routine data for current semester
const currentSemesterRoutine = {
  semester: 'Fall 2025',
  schedule: [
    {
      timeSlot: '08:00 - 09:30',
      saturday: { course: 'CSE 2301', title: 'Database Systems', section: 'A', room: 'Room 301', instructor: 'Dr. Rahman' },
      sunday: { course: 'CSE 2315', title: 'Software Engineering', section: 'B', room: 'Room 205', instructor: 'Prof. Ahmed' },
      monday: null,
      tuesday: { course: 'CSE 2301', title: 'Database Systems', section: 'A', room: 'Room 301', instructor: 'Dr. Rahman' },
      wednesday: { course: 'CSE 2315', title: 'Software Engineering', section: 'B', room: 'Room 205', instructor: 'Prof. Ahmed' },
      thursday: null,
      friday: null
    },
    {
      timeSlot: '10:00 - 11:30',
      saturday: { course: 'CSE 2302', title: 'Database Lab', section: 'A', room: 'Lab 2', instructor: 'Md. Hassan' },
      sunday: null,
      monday: { course: 'CSE 2345', title: 'Computer Networks', section: 'A', room: 'Room 401', instructor: 'Dr. Khan' },
      tuesday: null,
      wednesday: { course: 'CSE 2345', title: 'Computer Networks', section: 'A', room: 'Room 401', instructor: 'Dr. Khan' },
      thursday: { course: 'CSE 2316', title: 'Software Engineering Lab', section: 'B', room: 'Lab 1', instructor: 'Prof. Ahmed' },
      friday: null
    },
    {
      timeSlot: '12:00 - 01:30',
      saturday: null,
      sunday: { course: 'ENG 2201', title: 'Technical Writing', section: 'C', room: 'Room 102', instructor: 'Ms. Fatima' },
      monday: null,
      tuesday: { course: 'ENG 2201', title: 'Technical Writing', section: 'C', room: 'Room 102', instructor: 'Ms. Fatima' },
      wednesday: null,
      thursday: null,
      friday: null
    },
    {
      timeSlot: '02:00 - 03:30',
      saturday: { course: 'MATH 2203', title: 'Statistics & Probability', section: 'A', room: 'Room 301', instructor: 'Dr. Islam' },
      sunday: null,
      monday: { course: 'MATH 2203', title: 'Statistics & Probability', section: 'A', room: 'Room 301', instructor: 'Dr. Islam' },
      tuesday: null,
      wednesday: null,
      thursday: null,
      friday: null
    }
  ]
}

// Mock class routine data for previous semester
const previousSemesterRoutine = {
  semester: 'Summer 2025',
  schedule: [
    {
      timeSlot: '08:00 - 09:30',
      saturday: { course: 'CSE 2101', title: 'Object Oriented Programming', section: 'A', room: 'Room 201', instructor: 'Dr. Hasan' },
      sunday: { course: 'CSE 2201', title: 'Algorithms', section: 'A', room: 'Room 301', instructor: 'Prof. Ali' },
      monday: null,
      tuesday: { course: 'CSE 2101', title: 'Object Oriented Programming', section: 'A', room: 'Room 201', instructor: 'Dr. Hasan' },
      wednesday: { course: 'CSE 2201', title: 'Algorithms', section: 'A', room: 'Room 301', instructor: 'Prof. Ali' },
      thursday: null,
      friday: null
    },
    {
      timeSlot: '10:00 - 11:30',
      saturday: { course: 'CSE 2102', title: 'OOP Lab', section: 'A', room: 'Lab 1', instructor: 'Md. Karim' },
      sunday: null,
      monday: { course: 'MATH 2101', title: 'Linear Algebra', section: 'A', room: 'Room 105', instructor: 'Dr. Rahman' },
      tuesday: null,
      wednesday: { course: 'MATH 2101', title: 'Linear Algebra', section: 'A', room: 'Room 105', instructor: 'Dr. Rahman' },
      thursday: { course: 'CSE 2202', title: 'Algorithms Lab', section: 'A', room: 'Lab 2', instructor: 'Prof. Ali' },
      friday: null
    }
  ]
}

const days = ['saturday', 'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday']
const dayLabels = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']

interface ClassCellProps {
  classInfo: {
    course: string
    title: string
    section: string
    room: string
    instructor: string
  } | null
}

const ClassCell = ({ classInfo }: ClassCellProps) => {
  if (!classInfo) {
    return (
      <TableCell className="text-center text-gray-400 bg-gray-50">
        <div className="py-2">No Class</div>
      </TableCell>
    )
  }

  return (
    <TableCell className="p-2">
      <div className="bg-deep-plum text-white rounded-lg p-3 text-sm">
        <div className="font-bold mb-1">{classInfo.course}</div>
        <div className="text-xs mb-1">{classInfo.title}</div>
        <div className="flex items-center justify-between text-xs">
          <span className="bg-white bg-opacity-20 px-2 py-1 rounded">Sec: {classInfo.section}</span>
        </div>
        <div className="flex items-center mt-2 text-xs">
          <MapPin className="w-3 h-3 mr-1" />
          <span>{classInfo.room}</span>
        </div>
        <div className="flex items-center mt-1 text-xs">
          <User className="w-3 h-3 mr-1" />
          <span className="truncate">{classInfo.instructor}</span>
        </div>
      </div>
    </TableCell>
  )
}

export const ClassRoutine = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-deep-plum">Class Routine</h1>
        <Badge className="bg-blue-100 text-blue-800">
          <Calendar className="w-4 h-4 mr-1" />
          Academic Schedule
        </Badge>
      </div>

      <Tabs defaultValue="current" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="current">Current Semester Routine</TabsTrigger>
          <TabsTrigger value="previous">Previous Semester Routine</TabsTrigger>
        </TabsList>

        {/* Current Semester Routine */}
        <TabsContent value="current">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-deep-plum" />
                <span>{currentSemesterRoutine.semester} Class Routine</span>
              </CardTitle>
              <CardDescription>
                Your current semester class schedule
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-32 font-semibold text-deep-plum">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-2" />
                          Time Slot
                        </div>
                      </TableHead>
                      {dayLabels.map((day) => (
                        <TableHead key={day} className="text-center min-w-40 font-semibold text-deep-plum">
                          {day}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentSemesterRoutine.schedule.map((timeSlot, index) => (
                      <TableRow key={index} className="h-32">
                        <TableCell className="font-medium text-deep-plum bg-lavender-bg border-r-2 border-deep-plum">
                          <div className="text-center">
                            <div className="font-bold">{timeSlot.timeSlot.split(' - ')[0]}</div>
                            <div className="text-sm">to</div>
                            <div className="font-bold">{timeSlot.timeSlot.split(' - ')[1]}</div>
                          </div>
                        </TableCell>
                        {days.map((day) => (
                          <ClassCell 
                            key={day} 
                            classInfo={timeSlot[day as keyof typeof timeSlot] as any} 
                          />
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Current Semester Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Course Summary</CardTitle>
              <CardDescription>Overview of your current semester courses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {currentSemesterRoutine.schedule
                  .flatMap(slot => days.map(day => slot[day as keyof typeof slot]))
                  .filter(Boolean)
                  .reduce((unique: any[], classInfo: any) => {
                    if (!unique.find(c => c.course === classInfo.course)) {
                      unique.push(classInfo)
                    }
                    return unique
                  }, [])
                  .map((classInfo: any, index: number) => (
                    <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg">
                      <div className="w-3 h-3 bg-deep-plum rounded-full"></div>
                      <div className="flex-1">
                        <div className="font-semibold text-deep-plum">{classInfo.course}</div>
                        <div className="text-sm text-gray-600">{classInfo.title}</div>
                        <div className="text-xs text-gray-500">
                          Section {classInfo.section} • {classInfo.instructor}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Previous Semester Routine */}
        <TabsContent value="previous">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-gray-600" />
                <span>{previousSemesterRoutine.semester} Class Routine</span>
              </CardTitle>
              <CardDescription>
                Your previous semester class schedule for reference
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-32 font-semibold text-gray-600">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-2" />
                          Time Slot
                        </div>
                      </TableHead>
                      {dayLabels.map((day) => (
                        <TableHead key={day} className="text-center min-w-40 font-semibold text-gray-600">
                          {day}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {previousSemesterRoutine.schedule.map((timeSlot, index) => (
                      <TableRow key={index} className="h-32">
                        <TableCell className="font-medium text-gray-600 bg-gray-100 border-r-2 border-gray-400">
                          <div className="text-center">
                            <div className="font-bold">{timeSlot.timeSlot.split(' - ')[0]}</div>
                            <div className="text-sm">to</div>
                            <div className="font-bold">{timeSlot.timeSlot.split(' - ')[1]}</div>
                          </div>
                        </TableCell>
                        {days.map((day) => {
                          const classInfo = timeSlot[day as keyof typeof timeSlot] as any
                          if (!classInfo) {
                            return (
                              <TableCell key={day} className="text-center text-gray-400 bg-gray-50">
                                <div className="py-2">No Class</div>
                              </TableCell>
                            )
                          }
                          
                          return (
                            <TableCell key={day} className="p-2">
                              <div className="bg-gray-600 text-white rounded-lg p-3 text-sm">
                                <div className="font-bold mb-1">{classInfo.course}</div>
                                <div className="text-xs mb-1">{classInfo.title}</div>
                                <div className="flex items-center justify-between text-xs">
                                  <span className="bg-white bg-opacity-20 px-2 py-1 rounded">Sec: {classInfo.section}</span>
                                </div>
                                <div className="flex items-center mt-2 text-xs">
                                  <MapPin className="w-3 h-3 mr-1" />
                                  <span>{classInfo.room}</span>
                                </div>
                                <div className="flex items-center mt-1 text-xs">
                                  <User className="w-3 h-3 mr-1" />
                                  <span className="truncate">{classInfo.instructor}</span>
                                </div>
                              </div>
                            </TableCell>
                          )
                        })}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Instructions */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <BookOpen className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-800 mb-2">How to Read Your Class Routine:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Each colored block represents a class session</li>
                <li>• Course code and title are shown at the top of each block</li>
                <li>• Section, room, and instructor information are provided</li>
                <li>• Empty cells indicate no scheduled classes for that time slot</li>
                <li>• Lab sessions are typically 2 hours, theory classes are 1.5 hours</li>
                <li>• Contact your instructors directly for any class-related queries</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
