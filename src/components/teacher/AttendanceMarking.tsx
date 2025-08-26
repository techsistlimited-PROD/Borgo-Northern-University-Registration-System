import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { 
  Calendar, 
  Users, 
  UserCheck, 
  UserX, 
  Save, 
  RotateCcw,
  CheckCircle,
  XCircle,
  Clock,
  BookOpen
} from 'lucide-react'

interface Student {
  id: string
  studentId: string
  name: string
  email: string
  status?: 'present' | 'absent' | 'late'
}

interface Section {
  id: string
  courseCode: string
  courseName: string
  sectionName: string
  schedule: string
  totalStudents: number
}

// Mock data for teacher's sections
const teacherSections: Section[] = [
  {
    id: '1',
    courseCode: 'CSE401',
    courseName: 'Database Management Systems',
    sectionName: 'A',
    schedule: 'Sun, Tue - 08:00-09:30',
    totalStudents: 42
  },
  {
    id: '2',
    courseCode: 'CSE401',
    courseName: 'Database Management Systems',
    sectionName: 'B',
    schedule: 'Mon, Wed - 10:00-11:30',
    totalStudents: 38
  },
  {
    id: '3',
    courseCode: 'CSE303',
    courseName: 'Data Structures and Algorithms',
    sectionName: 'A',
    schedule: 'Tue, Thu - 14:00-15:30',
    totalStudents: 40
  },
  {
    id: '4',
    courseCode: 'CSE401',
    courseName: 'Database Management Systems',
    sectionName: 'C',
    schedule: 'Thu, Fri - 14:00-15:30',
    totalStudents: 39
  }
]

// Mock students data for different sections
const studentsData: Record<string, Student[]> = {
  '1': [
    { id: '1', studentId: '2021-1-60-001', name: 'Ahmed Rahman', email: 'ahmed.rahman@student.nu.edu.bd' },
    { id: '2', studentId: '2021-1-60-002', name: 'Fatima Khan', email: 'fatima.khan@student.nu.edu.bd' },
    { id: '3', studentId: '2021-1-60-003', name: 'Mohammad Ali', email: 'mohammad.ali@student.nu.edu.bd' },
    { id: '4', studentId: '2021-1-60-004', name: 'Ayesha Ahmed', email: 'ayesha.ahmed@student.nu.edu.bd' },
    { id: '5', studentId: '2021-1-60-005', name: 'Rashid Hasan', email: 'rashid.hasan@student.nu.edu.bd' }
  ],
  '2': [
    { id: '6', studentId: '2021-1-60-006', name: 'Nabila Sultana', email: 'nabila.sultana@student.nu.edu.bd' },
    { id: '7', studentId: '2021-1-60-007', name: 'Karim Uddin', email: 'karim.uddin@student.nu.edu.bd' },
    { id: '8', studentId: '2021-1-60-008', name: 'Lamia Haque', email: 'lamia.haque@student.nu.edu.bd' },
    { id: '9', studentId: '2021-1-60-009', name: 'Shamsul Islam', email: 'shamsul.islam@student.nu.edu.bd' }
  ],
  '3': [
    { id: '10', studentId: '2021-1-60-010', name: 'Ruma Begum', email: 'ruma.begum@student.nu.edu.bd' },
    { id: '11', studentId: '2021-1-60-011', name: 'Tariq Ahmed', email: 'tariq.ahmed@student.nu.edu.bd' },
    { id: '12', studentId: '2021-1-60-012', name: 'Shahida Khatun', email: 'shahida.khatun@student.nu.edu.bd' }
  ],
  '4': [
    { id: '13', studentId: '2021-1-60-013', name: 'Habib Rahman', email: 'habib.rahman@student.nu.edu.bd' },
    { id: '14', studentId: '2021-1-60-014', name: 'Nasreen Akter', email: 'nasreen.akter@student.nu.edu.bd' },
    { id: '15', studentId: '2021-1-60-015', name: 'Mizanur Rahman', email: 'mizanur.rahman@student.nu.edu.bd' }
  ]
}

export default function AttendanceMarking() {
  const [selectedSection, setSelectedSection] = useState<string>('')
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  )
  const [attendanceType, setAttendanceType] = useState<'class' | 'midterm' | 'final'>('class')
  const [attendance, setAttendance] = useState<Record<string, 'present' | 'absent' | 'late'>>({})
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  const selectedSectionData = teacherSections.find(section => section.id === selectedSection)
  const students = selectedSection ? studentsData[selectedSection] || [] : []

  const handleAttendanceChange = (studentId: string, status: 'present' | 'absent' | 'late') => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: status
    }))
  }

  const handleMarkAllPresent = () => {
    const allPresent = students.reduce((acc, student) => {
      acc[student.id] = 'present'
      return acc
    }, {} as Record<string, 'present' | 'absent' | 'late'>)
    setAttendance(allPresent)
  }

  const handleMarkAllAbsent = () => {
    const allAbsent = students.reduce((acc, student) => {
      acc[student.id] = 'absent'
      return acc
    }, {} as Record<string, 'present' | 'absent' | 'late'>)
    setAttendance(allAbsent)
  }

  const handleReset = () => {
    setAttendance({})
  }

  const handleSaveAttendance = async () => {
    if (!selectedSection || !selectedDate) {
      alert('Please select section and date')
      return
    }

    setIsSaving(true)
    
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
      
      // Reset form after successful save
      setAttendance({})
    } catch (error) {
      alert('Failed to save attendance. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const getAttendanceStats = () => {
    const totalStudents = students.length
    const markedStudents = Object.keys(attendance).length
    const presentCount = Object.values(attendance).filter(status => status === 'present').length
    const absentCount = Object.values(attendance).filter(status => status === 'absent').length
    const lateCount = Object.values(attendance).filter(status => status === 'late').length

    return { totalStudents, markedStudents, presentCount, absentCount, lateCount }
  }

  const stats = getAttendanceStats()

  const getStatusIcon = (status: 'present' | 'absent' | 'late') => {
    switch (status) {
      case 'present':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'absent':
        return <XCircle className="w-4 h-4 text-red-600" />
      case 'late':
        return <Clock className="w-4 h-4 text-yellow-600" />
      default:
        return null
    }
  }

  const getStatusBadgeVariant = (status: 'present' | 'absent' | 'late') => {
    switch (status) {
      case 'present':
        return 'default'
      case 'absent':
        return 'destructive'
      case 'late':
        return 'secondary'
      default:
        return 'outline'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-deep-plum">Mark Attendance</h1>
          <p className="text-gray-600 mt-1">Select section and date to mark student attendance</p>
        </div>
        {saveSuccess && (
          <Badge className="bg-green-100 text-green-800 border-green-300">
            <CheckCircle className="w-4 h-4 mr-1" />
            Attendance saved successfully!
          </Badge>
        )}
      </div>

      {/* Section and Date Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="w-5 h-5" />
            <span>Class Information</span>
          </CardTitle>
          <CardDescription>Select the section and date for attendance marking</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="section">Select Section</Label>
              <Select value={selectedSection} onValueChange={setSelectedSection}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a section" />
                </SelectTrigger>
                <SelectContent>
                  {teacherSections.map((section) => (
                    <SelectItem key={section.id} value={section.id}>
                      {section.courseCode} - Section {section.sectionName} ({section.totalStudents} students)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Select Date</Label>
              <Input
                id="date"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
          </div>

          {selectedSectionData && (
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-deep-plum">
                    {selectedSectionData.courseCode} - {selectedSectionData.courseName}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Section {selectedSectionData.sectionName} • {selectedSectionData.schedule}
                  </p>
                </div>
                <Badge variant="outline">
                  <Users className="w-4 h-4 mr-1" />
                  {selectedSectionData.totalStudents} students
                </Badge>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Attendance Stats */}
      {selectedSection && students.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-deep-plum">{stats.totalStudents}</p>
                <p className="text-sm text-gray-600">Total Students</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{stats.presentCount}</p>
                <p className="text-sm text-gray-600">Present</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">{stats.absentCount}</p>
                <p className="text-sm text-gray-600">Absent</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-600">{stats.lateCount}</p>
                <p className="text-sm text-gray-600">Late</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{stats.markedStudents}</p>
                <p className="text-sm text-gray-600">Marked</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Student List */}
      {selectedSection && students.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span>Student List</span>
                </CardTitle>
                <CardDescription>Mark attendance for each student</CardDescription>
              </div>
              
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleMarkAllPresent}
                  className="text-green-600 hover:bg-green-50"
                >
                  <UserCheck className="w-4 h-4 mr-1" />
                  All Present
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleMarkAllAbsent}
                  className="text-red-600 hover:bg-red-50"
                >
                  <UserX className="w-4 h-4 mr-1" />
                  All Absent
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleReset}
                  className="text-gray-600 hover:bg-gray-50"
                >
                  <RotateCcw className="w-4 h-4 mr-1" />
                  Reset
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {students.map((student) => (
                <div
                  key={student.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-600">
                        {student.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-medium">{student.name}</h4>
                      <p className="text-sm text-gray-500">{student.studentId}</p>
                    </div>
                    {attendance[student.id] && (
                      <Badge variant={getStatusBadgeVariant(attendance[student.id])}>
                        {getStatusIcon(attendance[student.id])}
                        <span className="ml-1 capitalize">{attendance[student.id]}</span>
                      </Badge>
                    )}
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      variant={attendance[student.id] === 'present' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleAttendanceChange(student.id, 'present')}
                      className={attendance[student.id] === 'present' ? 'bg-green-600 hover:bg-green-700' : 'text-green-600 hover:bg-green-50'}
                    >
                      <UserCheck className="w-4 h-4 mr-1" />
                      Present
                    </Button>
                    <Button
                      variant={attendance[student.id] === 'late' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleAttendanceChange(student.id, 'late')}
                      className={attendance[student.id] === 'late' ? 'bg-yellow-600 hover:bg-yellow-700' : 'text-yellow-600 hover:bg-yellow-50'}
                    >
                      <Clock className="w-4 h-4 mr-1" />
                      Late
                    </Button>
                    <Button
                      variant={attendance[student.id] === 'absent' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleAttendanceChange(student.id, 'absent')}
                      className={attendance[student.id] === 'absent' ? 'bg-red-600 hover:bg-red-700' : 'text-red-600 hover:bg-red-50'}
                    >
                      <UserX className="w-4 h-4 mr-1" />
                      Absent
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {students.length > 0 && (
              <div className="mt-6 flex justify-center">
                <Button
                  onClick={handleSaveAttendance}
                  disabled={isSaving || Object.keys(attendance).length === 0}
                  className="px-8"
                >
                  {isSaving ? (
                    <>
                      <RotateCcw className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Attendance
                    </>
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {!selectedSection && (
        <Card>
          <CardContent className="py-20">
            <div className="text-center">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Select a Section</h3>
              <p className="text-gray-500">Choose a section from the dropdown above to start marking attendance</p>
            </div>
          </CardContent>
        </Card>
      )}

      {selectedSection && students.length === 0 && (
        <Card>
          <CardContent className="py-20">
            <div className="text-center">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Students Found</h3>
              <p className="text-gray-500">No students are enrolled in this section</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
