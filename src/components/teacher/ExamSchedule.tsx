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
  ChevronRight,
  BookOpen,
  AlertCircle,
  CheckCircle
} from 'lucide-react'

interface ExamSchedule {
  id: string
  examDate: string
  examTime: string
  duration: string // Duration in hours
  courseCode: string
  courseName: string
  section: string
  examType: 'midterm' | 'final'
  room: string
  building: string
  totalStudents: number
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled'
  coInvigilator?: string
  specialInstructions?: string
}

// Mock exam schedule data
const examSchedules: ExamSchedule[] = [
  {
    id: '1',
    examDate: '2024-02-15',
    examTime: '09:00',
    duration: '1.5', // 1.5 hours for midterm
    courseCode: 'CSE401',
    courseName: 'Database Management Systems',
    section: 'A',
    examType: 'midterm',
    room: 'Room 301',
    building: 'Academic Building',
    totalStudents: 42,
    status: 'scheduled',
    coInvigilator: 'Dr. Sarah Khan',
    specialInstructions: 'Calculator allowed'
  },
  {
    id: '2',
    examDate: '2024-02-16',
    examTime: '14:00',
    duration: '2', // 2 hours for final
    courseCode: 'CSE303',
    courseName: 'Data Structures and Algorithms',
    section: 'A',
    examType: 'final',
    room: 'Room 205',
    building: 'Academic Building',
    totalStudents: 40,
    status: 'scheduled',
    coInvigilator: 'Prof. Rahman Ali'
  },
  {
    id: '3',
    examDate: '2024-02-17',
    examTime: '10:30',
    duration: '1.5',
    courseCode: 'CSE401',
    courseName: 'Database Management Systems',
    section: 'B',
    examType: 'midterm',
    room: 'Room 301',
    building: 'Academic Building',
    totalStudents: 38,
    status: 'scheduled',
    coInvigilator: 'Dr. Computer Expert'
  },
  {
    id: '4',
    examDate: '2024-02-12',
    examTime: '09:00',
    duration: '2',
    courseCode: 'CSE303',
    courseName: 'Data Structures and Algorithms',
    section: 'B',
    examType: 'final',
    room: 'Room 205',
    building: 'Academic Building',
    totalStudents: 35,
    status: 'completed',
    coInvigilator: 'Dr. Math Wizard'
  },
  {
    id: '5',
    examDate: '2024-02-20',
    examTime: '14:00',
    duration: '1.5',
    courseCode: 'CSE405',
    courseName: 'Computer Networks',
    section: 'A',
    examType: 'midterm',
    room: 'Room 103',
    building: 'IT Building',
    totalStudents: 45,
    status: 'scheduled',
    coInvigilator: 'Dr. Network Pro',
    specialInstructions: 'Open book exam'
  },
  {
    id: '6',
    examDate: '2024-02-22',
    examTime: '09:00',
    duration: '2',
    courseCode: 'CSE401',
    courseName: 'Database Management Systems',
    section: 'C',
    examType: 'final',
    room: 'Room 301',
    building: 'Academic Building',
    totalStudents: 39,
    status: 'scheduled',
    coInvigilator: 'Dr. Database Master'
  }
]

function ExamScheduleGrid({ schedule }: { schedule: ExamSchedule[] }) {
  const timeSlots = [
    '08:00', '09:00', '10:00', '10:30', '11:00', '12:00', '14:00', '15:00', '16:00'
  ]

  // Group schedules by date
  const scheduleByDate = schedule.reduce((acc, exam) => {
    if (!acc[exam.examDate]) {
      acc[exam.examDate] = []
    }
    acc[exam.examDate].push(exam)
    return acc
  }, {} as Record<string, ExamSchedule[]>)

  const sortedDates = Object.keys(scheduleByDate).sort()

  const getStatusColor = (status: string, examType: string) => {
    const baseColor = examType === 'midterm' 
      ? 'border-blue-300 text-blue-800' 
      : 'border-purple-300 text-purple-800'
    
    switch (status) {
      case 'scheduled': return `bg-blue-50 ${baseColor}`
      case 'ongoing': return 'bg-yellow-100 border-yellow-300 text-yellow-800'
      case 'completed': return 'bg-green-100 border-green-300 text-green-800'
      case 'cancelled': return 'bg-red-100 border-red-300 text-red-800'
      default: return `bg-gray-100 ${baseColor}`
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  return (
    <div className="space-y-6">
      {sortedDates.map(date => (
        <div key={date} className="space-y-2">
          <h3 className="text-lg font-semibold text-deep-plum border-b pb-2">
            {formatDate(date)} ({new Date(date).toLocaleDateString()})
          </h3>
          
          <div className="grid gap-4">
            {scheduleByDate[date]
              .sort((a, b) => a.examTime.localeCompare(b.examTime))
              .map(exam => (
                <div
                  key={exam.id}
                  className={`p-4 rounded-lg border-2 ${getStatusColor(exam.status, exam.examType)}`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-semibold">{exam.courseCode}</h4>
                        <Badge variant={exam.examType === 'midterm' ? 'default' : 'secondary'}>
                          {exam.examType.charAt(0).toUpperCase() + exam.examType.slice(1)}
                        </Badge>
                        <Badge variant="outline">Section {exam.section}</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{exam.courseName}</p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{exam.examTime} ({exam.duration} hrs)</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4" />
                          <span>{exam.room}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="w-4 h-4" />
                          <span>{exam.totalStudents} students</span>
                        </div>
                        {exam.coInvigilator && (
                          <div className="flex items-center space-x-1">
                            <Users className="w-4 h-4" />
                            <span>w/ {exam.coInvigilator}</span>
                          </div>
                        )}
                      </div>
                      
                      {exam.specialInstructions && (
                        <div className="mt-2 p-2 bg-yellow-50 rounded text-sm">
                          <AlertCircle className="w-4 h-4 inline mr-1" />
                          <strong>Note:</strong> {exam.specialInstructions}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Badge variant={
                        exam.status === 'completed' ? 'default' :
                        exam.status === 'ongoing' ? 'secondary' :
                        exam.status === 'cancelled' ? 'destructive' : 'outline'
                      }>
                        {exam.status === 'completed' && <CheckCircle className="w-3 h-3 mr-1" />}
                        {exam.status === 'ongoing' && <Clock className="w-3 h-3 mr-1" />}
                        {exam.status.charAt(0).toUpperCase() + exam.status.slice(1)}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function ExamScheduleList({ schedule }: { schedule: ExamSchedule[] }) {
  const [sortBy, setSortBy] = useState<'date' | 'time' | 'course' | 'type'>('date')

  const sortedSchedule = [...schedule].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(a.examDate).getTime() - new Date(b.examDate).getTime()
      case 'time':
        return a.examTime.localeCompare(b.examTime)
      case 'course':
        return a.courseCode.localeCompare(b.courseCode)
      case 'type':
        return a.examType.localeCompare(b.examType)
      default:
        return 0
    }
  })

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'completed': return 'default'
      case 'ongoing': return 'secondary'
      case 'cancelled': return 'destructive'
      default: return 'outline'
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Exam Schedule List</h3>
        <Select value={sortBy} onValueChange={(value: 'date' | 'time' | 'course' | 'type') => setSortBy(value)}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date">Sort by Date</SelectItem>
            <SelectItem value="time">Sort by Time</SelectItem>
            <SelectItem value="course">Sort by Course</SelectItem>
            <SelectItem value="type">Sort by Type</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4">
        {sortedSchedule.map((exam) => (
          <Card key={exam.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="font-semibold text-lg">{exam.courseCode}</h4>
                    <Badge variant={exam.examType === 'midterm' ? 'default' : 'secondary'}>
                      {exam.examType.charAt(0).toUpperCase() + exam.examType.slice(1)} Exam
                    </Badge>
                    <Badge variant="outline">Section {exam.section}</Badge>
                  </div>
                  <p className="text-gray-600 mb-3">{exam.courseName}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span>{formatDate(exam.examDate)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span>{exam.examTime} ({exam.duration} hours)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span>{exam.room}, {exam.building}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-gray-500" />
                      <span>{exam.totalStudents} students</span>
                    </div>
                    {exam.coInvigilator && (
                      <div className="flex items-center space-x-2">
                        <BookOpen className="w-4 h-4 text-gray-500" />
                        <span>Co-invigilator: {exam.coInvigilator}</span>
                      </div>
                    )}
                  </div>
                  
                  {exam.specialInstructions && (
                    <div className="mt-3 p-2 bg-yellow-50 rounded-lg text-sm">
                      <AlertCircle className="w-4 h-4 inline mr-1 text-yellow-600" />
                      <strong>Special Instructions:</strong> {exam.specialInstructions}
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col items-end space-y-2">
                  <Badge variant={getStatusBadgeVariant(exam.status)}>
                    {exam.status === 'completed' && <CheckCircle className="w-3 h-3 mr-1" />}
                    {exam.status === 'ongoing' && <Clock className="w-3 h-3 mr-1" />}
                    {exam.status.charAt(0).toUpperCase() + exam.status.slice(1)}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default function ExamSchedule() {
  const [selectedExamType, setSelectedExamType] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [activeView, setActiveView] = useState<'timeline' | 'list'>('timeline')

  const filteredSchedule = examSchedules.filter(exam => {
    const matchesType = selectedExamType === 'all' || exam.examType === selectedExamType
    const matchesStatus = selectedStatus === 'all' || exam.status === selectedStatus
    return matchesType && matchesStatus
  })

  const handleExportSchedule = () => {
    alert('Exam schedule exported successfully!')
  }

  const getScheduleStats = () => {
    const total = filteredSchedule.length
    const midterms = filteredSchedule.filter(e => e.examType === 'midterm').length
    const finals = filteredSchedule.filter(e => e.examType === 'final').length
    const completed = filteredSchedule.filter(e => e.status === 'completed').length
    const upcoming = filteredSchedule.filter(e => e.status === 'scheduled').length

    return { total, midterms, finals, completed, upcoming }
  }

  const stats = getScheduleStats()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-deep-plum">Exam Invigilation Schedule</h1>
          <p className="text-gray-600 mt-1">Your assigned exam invigilation duties</p>
        </div>
        <Button onClick={handleExportSchedule} className="flex items-center space-x-2">
          <Download className="w-4 h-4" />
          <span>Export Schedule</span>
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-deep-plum">{stats.total}</p>
              <p className="text-sm text-gray-600">Total Exams</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{stats.midterms}</p>
              <p className="text-sm text-gray-600">Midterm Exams</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">{stats.finals}</p>
              <p className="text-sm text-gray-600">Final Exams</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
              <p className="text-sm text-gray-600">Completed</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">{stats.upcoming}</p>
              <p className="text-sm text-gray-600">Upcoming</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium">Filters:</span>
            </div>
            
            <Select value={selectedExamType} onValueChange={setSelectedExamType}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Exam Types</SelectItem>
                <SelectItem value="midterm">Midterm Exams</SelectItem>
                <SelectItem value="final">Final Exams</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            <div className="ml-auto">
              <Tabs value={activeView} onValueChange={(value: 'timeline' | 'list') => setActiveView(value)}>
                <TabsList>
                  <TabsTrigger value="timeline">Timeline View</TabsTrigger>
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
          <CardTitle>Exam Invigilation Schedule</CardTitle>
          <CardDescription>
            {filteredSchedule.length} exam(s) found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {activeView === 'timeline' ? (
            <ExamScheduleGrid schedule={filteredSchedule} />
          ) : (
            <ExamScheduleList schedule={filteredSchedule} />
          )}
        </CardContent>
      </Card>

      {/* Information Card */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-800 mb-2">Invigilation Guidelines:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Arrive at the exam room 15 minutes before the scheduled time</li>
                <li>• Midterm exams duration: 1.5 hours, Final exams duration: 2 hours</li>
                <li>• Coordinate with co-invigilators for proper exam conduct</li>
                <li>• Report any irregularities to the examination committee immediately</li>
                <li>• Ensure all mobile devices are switched off or silent</li>
                <li>• Verify student identity before allowing entry to the exam room</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
