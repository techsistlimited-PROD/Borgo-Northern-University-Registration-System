import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Download,
  Filter,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'

interface ClassSchedule {
  id: string
  courseCode: string
  courseName: string
  section: string
  day: string
  startTime: string
  endTime: string
  room: string
  building: string
  studentsEnrolled: number
  maxCapacity: number
  semester: string
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled'
}

// Mock data for teacher's assigned classes
const teacherSchedule: ClassSchedule[] = [
  {
    id: '1',
    courseCode: 'CSE401',
    courseName: 'Database Management Systems',
    section: 'A',
    day: 'Sunday',
    startTime: '08:00',
    endTime: '09:30',
    room: 'Room 301',
    building: 'Academic Building',
    studentsEnrolled: 42,
    maxCapacity: 45,
    semester: 'Fall 2024',
    status: 'scheduled'
  },
  {
    id: '2',
    courseCode: 'CSE401',
    courseName: 'Database Management Systems',
    section: 'B',
    day: 'Monday',
    startTime: '10:00',
    endTime: '11:30',
    room: 'Room 205',
    building: 'Academic Building',
    studentsEnrolled: 38,
    maxCapacity: 40,
    semester: 'Fall 2024',
    status: 'scheduled'
  },
  {
    id: '3',
    courseCode: 'CSE303',
    courseName: 'Data Structures and Algorithms',
    section: 'A',
    day: 'Tuesday',
    startTime: '14:00',
    endTime: '15:30',
    room: 'Room 301',
    building: 'Academic Building',
    studentsEnrolled: 40,
    maxCapacity: 45,
    semester: 'Fall 2024',
    status: 'scheduled'
  },
  {
    id: '4',
    courseCode: 'CSE303',
    courseName: 'Data Structures and Algorithms',
    section: 'B',
    day: 'Wednesday',
    startTime: '08:00',
    endTime: '09:30',
    room: 'Room 205',
    building: 'Academic Building',
    studentsEnrolled: 35,
    maxCapacity: 40,
    semester: 'Fall 2024',
    status: 'scheduled'
  },
  {
    id: '5',
    courseCode: 'CSE401',
    courseName: 'Database Management Systems',
    section: 'C',
    day: 'Thursday',
    startTime: '14:00',
    endTime: '15:30',
    room: 'Room 301',
    building: 'Academic Building',
    studentsEnrolled: 39,
    maxCapacity: 45,
    semester: 'Fall 2024',
    status: 'scheduled'
  }
]

const timeSlots = [
  '08:00-09:30', '10:00-11:30', '12:00-13:30', '14:00-15:30', '16:00-17:30'
]

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday']

function WeeklyScheduleGrid({ schedule }: { schedule: ClassSchedule[] }) {
  const getClassForTimeSlot = (day: string, timeSlot: string) => {
    return schedule.find(class_ => {
      const classTime = `${class_.startTime}-${class_.endTime}`
      return class_.day === day && classTime === timeSlot
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 border-blue-300 text-blue-800'
      case 'ongoing': return 'bg-green-100 border-green-300 text-green-800'
      case 'completed': return 'bg-gray-100 border-gray-300 text-gray-800'
      case 'cancelled': return 'bg-red-100 border-red-300 text-red-800'
      default: return 'bg-gray-100 border-gray-300 text-gray-800'
    }
  }

  return (
    <div className="overflow-x-auto">
      <div className="min-w-full">
        <div className="grid grid-cols-6 gap-2">
          {/* Header */}
          <div className="bg-deep-plum text-white p-3 font-medium text-center rounded-tl-lg">
            Time
          </div>
          {days.map(day => (
            <div key={day} className="bg-deep-plum text-white p-3 font-medium text-center">
              {day}
            </div>
          ))}

          {/* Time slots */}
          {timeSlots.map((timeSlot, timeIndex) => (
            <>
              <div key={timeSlot} className="bg-gray-50 p-3 font-medium text-center border-r">
                {timeSlot}
              </div>
              {days.map(day => {
                const class_ = getClassForTimeSlot(day, timeSlot)
                return (
                  <div key={`${day}-${timeSlot}`} className="border border-gray-200 p-2 min-h-[100px]">
                    {class_ ? (
                      <div className={`p-3 rounded-lg border-2 h-full ${getStatusColor(class_.status)}`}>
                        <div className="font-medium text-sm">{class_.courseCode}</div>
                        <div className="text-xs mt-1">Section {class_.section}</div>
                        <div className="text-xs mt-1 flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          {class_.room}
                        </div>
                        <div className="text-xs mt-1 flex items-center">
                          <Users className="w-3 h-3 mr-1" />
                          {class_.studentsEnrolled}/{class_.maxCapacity}
                        </div>
                      </div>
                    ) : (
                      <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                        Free
                      </div>
                    )}
                  </div>
                )
              })}
            </>
          ))}
        </div>
      </div>
    </div>
  )
}

function ClassListView({ schedule }: { schedule: ClassSchedule[] }) {
  const [sortBy, setSortBy] = useState<'day' | 'time' | 'course'>('day')

  const sortedSchedule = [...schedule].sort((a, b) => {
    switch (sortBy) {
      case 'day':
        const dayOrder = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday']
        return dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day)
      case 'time':
        return a.startTime.localeCompare(b.startTime)
      case 'course':
        return a.courseCode.localeCompare(b.courseCode)
      default:
        return 0
    }
  })

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'scheduled': return 'default'
      case 'ongoing': return 'default'
      case 'completed': return 'secondary'
      case 'cancelled': return 'destructive'
      default: return 'secondary'
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Class List</h3>
        <Select value={sortBy} onValueChange={(value: 'day' | 'time' | 'course') => setSortBy(value)}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="day">Sort by Day</SelectItem>
            <SelectItem value="time">Sort by Time</SelectItem>
            <SelectItem value="course">Sort by Course</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4">
        {sortedSchedule.map((class_) => (
          <Card key={class_.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="font-semibold text-lg">{class_.courseCode}</h4>
                    <Badge variant="outline">Section {class_.section}</Badge>
                    <Badge variant={getStatusBadgeVariant(class_.status)}>
                      {class_.status}
                    </Badge>
                  </div>
                  <p className="text-gray-600 mb-2">{class_.courseName}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span>{class_.day}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span>{class_.startTime} - {class_.endTime}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span>{class_.room}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-gray-500" />
                      <span>{class_.studentsEnrolled}/{class_.maxCapacity} students</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                  <Button variant="outline" size="sm">
                    Take Attendance
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

// Semester calendar configuration
const semesterConfig = {
  'Fall 2024': {
    startDate: new Date('2024-01-25'),
    midtermWeek: 8,
    endOfClassesWeek: 15,
    currentWeek: 3 // Simulated current week
  },
  'Spring 2024': {
    startDate: new Date('2024-05-15'),
    midtermWeek: 8,
    endOfClassesWeek: 15,
    currentWeek: 10
  },
  'Summer 2024': {
    startDate: new Date('2024-09-10'),
    midtermWeek: 6,
    endOfClassesWeek: 12,
    currentWeek: 12
  }
}

export default function TeacherClassRoutine() {
  const [selectedSemester, setSelectedSemester] = useState('Fall 2024')
  const [selectedWeek, setSelectedWeek] = useState(1)
  const [activeView, setActiveView] = useState<'grid' | 'list'>('grid')

  const currentSemesterConfig = semesterConfig[selectedSemester as keyof typeof semesterConfig]

  const getWeekStatus = (week: number) => {
    const currentWeek = currentSemesterConfig.currentWeek
    if (week < currentWeek) return 'past'
    if (week === currentWeek) return 'current'
    return 'upcoming'
  }

  const getWeekLabel = (week: number) => {
    if (week === currentSemesterConfig.midtermWeek) return 'Midterm Week'
    if (week === currentSemesterConfig.endOfClassesWeek) return 'End of Classes'
    return `Week ${week}`
  }

  const getWeekStatusColor = (status: string) => {
    switch (status) {
      case 'past': return 'text-gray-500 bg-gray-100'
      case 'current': return 'text-green-700 bg-green-100 font-semibold'
      case 'upcoming': return 'text-blue-700 bg-blue-100'
      default: return 'text-gray-700 bg-gray-50'
    }
  }

  const handleExportSchedule = () => {
    // Mock export functionality
    alert('Schedule exported successfully!')
  }

  const handlePreviousWeek = () => {
    setSelectedWeek(prev => Math.max(1, prev - 1))
  }

  const handleNextWeek = () => {
    setSelectedWeek(prev => Math.min(16, prev + 1))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-deep-plum">My Class Routine</h1>
          <p className="text-gray-600 mt-1">View and manage your teaching schedule</p>
        </div>
        <Button onClick={handleExportSchedule} className="flex items-center space-x-2">
          <Download className="w-4 h-4" />
          <span>Export Schedule</span>
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium">Filters:</span>
            </div>
            
            <Select value={selectedSemester} onValueChange={setSelectedSemester}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Fall 2024">Fall 2024</SelectItem>
                <SelectItem value="Spring 2024">Spring 2024</SelectItem>
                <SelectItem value="Summer 2024">Summer 2024</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePreviousWeek}
                disabled={selectedWeek === 1}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <div className={`px-3 py-1 rounded-lg text-sm ${getWeekStatusColor(getWeekStatus(selectedWeek))}`}>
                <div className="flex items-center space-x-2">
                  <span>{getWeekLabel(selectedWeek)}</span>
                  {getWeekStatus(selectedWeek) === 'current' && <Clock className="w-4 h-4" />}
                  {selectedWeek === currentSemesterConfig.midtermWeek && <Calendar className="w-4 h-4" />}
                  {selectedWeek === currentSemesterConfig.endOfClassesWeek && <Calendar className="w-4 h-4" />}
                </div>
                <div className="text-xs opacity-75">
                  {getWeekStatus(selectedWeek) === 'past' && 'Classes Taken'}
                  {getWeekStatus(selectedWeek) === 'current' && 'Running Week'}
                  {getWeekStatus(selectedWeek) === 'upcoming' && 'Upcoming'}
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNextWeek}
                disabled={selectedWeek === 16}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            <div className="ml-auto">
              <Tabs value={activeView} onValueChange={(value: 'grid' | 'list') => setActiveView(value)}>
                <TabsList>
                  <TabsTrigger value="grid">Grid View</TabsTrigger>
                  <TabsTrigger value="list">List View</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Schedule Content */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Schedule - Week {selectedWeek}</CardTitle>
          <CardDescription>
            Your class schedule for {selectedSemester}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {activeView === 'grid' ? (
            <WeeklyScheduleGrid schedule={teacherSchedule} />
          ) : (
            <ClassListView schedule={teacherSchedule} />
          )}
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Classes</p>
                <p className="text-2xl font-bold text-deep-plum">{teacherSchedule.length}</p>
              </div>
              <Calendar className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Students</p>
                <p className="text-2xl font-bold text-deep-plum">
                  {teacherSchedule.reduce((sum, class_) => sum + class_.studentsEnrolled, 0)}
                </p>
              </div>
              <Users className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Unique Courses</p>
                <p className="text-2xl font-bold text-deep-plum">
                  {new Set(teacherSchedule.map(class_ => class_.courseCode)).size}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Weekly Hours</p>
                <p className="text-2xl font-bold text-deep-plum">
                  {teacherSchedule.length * 1.5}
                </p>
              </div>
              <Clock className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
