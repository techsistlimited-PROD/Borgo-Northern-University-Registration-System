import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { 
  Calendar, 
  Users, 
  Download,
  BarChart3,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  XCircle,
  Clock,
  Filter,
  FileText,
  Search
} from 'lucide-react'

interface AttendanceRecord {
  id: string
  studentId: string
  studentName: string
  date: string
  status: 'present' | 'absent' | 'late'
  courseCode: string
  section: string
}

interface DateWiseRecord {
  date: string
  courseCode: string
  section: string
  totalStudents: number
  presentCount: number
  absentCount: number
  lateCount: number
  attendancePercentage: number
}

interface StudentWiseRecord {
  studentId: string
  studentName: string
  totalClasses: number
  presentCount: number
  absentCount: number
  lateCount: number
  attendancePercentage: number
  courseCode: string
  section: string
}

// Mock attendance data
const attendanceRecords: AttendanceRecord[] = [
  { id: '1', studentId: '2021-1-60-001', studentName: 'Ahmed Rahman', date: '2024-01-15', status: 'present', courseCode: 'CSE401', section: 'A' },
  { id: '2', studentId: '2021-1-60-002', studentName: 'Fatima Khan', date: '2024-01-15', status: 'absent', courseCode: 'CSE401', section: 'A' },
  { id: '3', studentId: '2021-1-60-003', studentName: 'Mohammad Ali', date: '2024-01-15', status: 'present', courseCode: 'CSE401', section: 'A' },
  { id: '4', studentId: '2021-1-60-001', studentName: 'Ahmed Rahman', date: '2024-01-17', status: 'late', courseCode: 'CSE401', section: 'A' },
  { id: '5', studentId: '2021-1-60-002', studentName: 'Fatima Khan', date: '2024-01-17', status: 'present', courseCode: 'CSE401', section: 'A' },
  { id: '6', studentId: '2021-1-60-001', studentName: 'Ahmed Rahman', date: '2024-01-22', status: 'present', courseCode: 'CSE401', section: 'A' },
  { id: '7', studentId: '2021-1-60-004', studentName: 'Ayesha Ahmed', date: '2024-01-15', status: 'present', courseCode: 'CSE303', section: 'A' },
  { id: '8', studentId: '2021-1-60-005', studentName: 'Rashid Hasan', date: '2024-01-15', status: 'absent', courseCode: 'CSE303', section: 'A' }
]

const sections = [
  { id: 'CSE401-A', label: 'CSE401 - Section A', courseCode: 'CSE401', section: 'A' },
  { id: 'CSE401-B', label: 'CSE401 - Section B', courseCode: 'CSE401', section: 'B' },
  { id: 'CSE303-A', label: 'CSE303 - Section A', courseCode: 'CSE303', section: 'A' },
  { id: 'CSE401-C', label: 'CSE401 - Section C', courseCode: 'CSE401', section: 'C' }
]

function DateWiseReport() {
  const [selectedSection, setSelectedSection] = useState<string>('')
  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')

  const generateDateWiseData = (): DateWiseRecord[] => {
    if (!selectedSection) return []

    const sectionData = sections.find(s => s.id === selectedSection)
    if (!sectionData) return []

    // Filter records by section and date range
    let filteredRecords = attendanceRecords.filter(record => 
      record.courseCode === sectionData.courseCode && 
      record.section === sectionData.section
    )

    if (startDate) {
      filteredRecords = filteredRecords.filter(record => record.date >= startDate)
    }
    if (endDate) {
      filteredRecords = filteredRecords.filter(record => record.date <= endDate)
    }

    // Group by date
    const dateGroups: Record<string, AttendanceRecord[]> = {}
    filteredRecords.forEach(record => {
      if (!dateGroups[record.date]) {
        dateGroups[record.date] = []
      }
      dateGroups[record.date].push(record)
    })

    // Generate date-wise summary
    return Object.entries(dateGroups).map(([date, records]) => {
      const presentCount = records.filter(r => r.status === 'present').length
      const absentCount = records.filter(r => r.status === 'absent').length
      const lateCount = records.filter(r => r.status === 'late').length
      const totalStudents = records.length
      const attendancePercentage = totalStudents > 0 ? Math.round(((presentCount + lateCount) / totalStudents) * 100) : 0

      return {
        date,
        courseCode: sectionData.courseCode,
        section: sectionData.section,
        totalStudents,
        presentCount,
        absentCount,
        lateCount,
        attendancePercentage
      }
    }).sort((a, b) => b.date.localeCompare(a.date))
  }

  const dateWiseData = generateDateWiseData()

  const handleDownloadReport = () => {
    alert('Date-wise attendance report downloaded successfully!')
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="section">Section</Label>
              <Select value={selectedSection} onValueChange={setSelectedSection}>
                <SelectTrigger>
                  <SelectValue placeholder="Select section" />
                </SelectTrigger>
                <SelectContent>
                  {sections.map(section => (
                    <SelectItem key={section.id} value={section.id}>
                      {section.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>

            <div className="flex items-end">
              <Button onClick={handleDownloadReport} disabled={!selectedSection} className="w-full">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Date-wise Report Table */}
      {selectedSection && (
        <Card>
          <CardHeader>
            <CardTitle>Date-wise Attendance Report</CardTitle>
            <CardDescription>
              Attendance summary for each class date
            </CardDescription>
          </CardHeader>
          <CardContent>
            {dateWiseData.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-200">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-200 px-4 py-3 text-left font-medium">Date</th>
                      <th className="border border-gray-200 px-4 py-3 text-left font-medium">Course</th>
                      <th className="border border-gray-200 px-4 py-3 text-center font-medium">Total Students</th>
                      <th className="border border-gray-200 px-4 py-3 text-center font-medium">Present</th>
                      <th className="border border-gray-200 px-4 py-3 text-center font-medium">Late</th>
                      <th className="border border-gray-200 px-4 py-3 text-center font-medium">Absent</th>
                      <th className="border border-gray-200 px-4 py-3 text-center font-medium">Attendance %</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dateWiseData.map((record, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="border border-gray-200 px-4 py-3">
                          {new Date(record.date).toLocaleDateString('en-US', { 
                            weekday: 'short',
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </td>
                        <td className="border border-gray-200 px-4 py-3">
                          {record.courseCode} - Section {record.section}
                        </td>
                        <td className="border border-gray-200 px-4 py-3 text-center">
                          {record.totalStudents}
                        </td>
                        <td className="border border-gray-200 px-4 py-3 text-center">
                          <span className="text-green-600 font-medium">{record.presentCount}</span>
                        </td>
                        <td className="border border-gray-200 px-4 py-3 text-center">
                          <span className="text-yellow-600 font-medium">{record.lateCount}</span>
                        </td>
                        <td className="border border-gray-200 px-4 py-3 text-center">
                          <span className="text-red-600 font-medium">{record.absentCount}</span>
                        </td>
                        <td className="border border-gray-200 px-4 py-3 text-center">
                          <Badge 
                            variant={record.attendancePercentage >= 75 ? 'default' : record.attendancePercentage >= 50 ? 'secondary' : 'destructive'}
                          >
                            {record.attendancePercentage}%
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No attendance data available for the selected criteria</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function StudentWiseReport() {
  const [selectedSection, setSelectedSection] = useState<string>('')
  const [searchStudent, setSearchStudent] = useState<string>('')

  const generateStudentWiseData = (): StudentWiseRecord[] => {
    if (!selectedSection) return []

    const sectionData = sections.find(s => s.id === selectedSection)
    if (!sectionData) return []

    // Filter records by section
    const filteredRecords = attendanceRecords.filter(record => 
      record.courseCode === sectionData.courseCode && 
      record.section === sectionData.section
    )

    // Group by student
    const studentGroups: Record<string, AttendanceRecord[]> = {}
    filteredRecords.forEach(record => {
      if (!studentGroups[record.studentId]) {
        studentGroups[record.studentId] = []
      }
      studentGroups[record.studentId].push(record)
    })

    // Generate student-wise summary
    let studentData = Object.entries(studentGroups).map(([studentId, records]) => {
      const presentCount = records.filter(r => r.status === 'present').length
      const absentCount = records.filter(r => r.status === 'absent').length
      const lateCount = records.filter(r => r.status === 'late').length
      const totalClasses = records.length
      const attendancePercentage = totalClasses > 0 ? Math.round(((presentCount + lateCount) / totalClasses) * 100) : 0

      return {
        studentId,
        studentName: records[0].studentName,
        totalClasses,
        presentCount,
        absentCount,
        lateCount,
        attendancePercentage,
        courseCode: sectionData.courseCode,
        section: sectionData.section
      }
    })

    // Filter by search term
    if (searchStudent) {
      studentData = studentData.filter(student => 
        student.studentName.toLowerCase().includes(searchStudent.toLowerCase()) ||
        student.studentId.toLowerCase().includes(searchStudent.toLowerCase())
      )
    }

    return studentData.sort((a, b) => b.attendancePercentage - a.attendancePercentage)
  }

  const studentWiseData = generateStudentWiseData()

  const handleDownloadReport = () => {
    alert('Student-wise attendance report downloaded successfully!')
  }

  const getAttendanceStatus = (percentage: number) => {
    if (percentage >= 90) return { status: 'Excellent', color: 'text-green-600', icon: TrendingUp }
    if (percentage >= 75) return { status: 'Good', color: 'text-blue-600', icon: CheckCircle }
    if (percentage >= 60) return { status: 'Satisfactory', color: 'text-yellow-600', icon: Clock }
    return { status: 'Poor', color: 'text-red-600', icon: TrendingDown }
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="section">Section</Label>
              <Select value={selectedSection} onValueChange={setSelectedSection}>
                <SelectTrigger>
                  <SelectValue placeholder="Select section" />
                </SelectTrigger>
                <SelectContent>
                  {sections.map(section => (
                    <SelectItem key={section.id} value={section.id}>
                      {section.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="search">Search Student</Label>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Student name or ID"
                  value={searchStudent}
                  onChange={(e) => setSearchStudent(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="md:col-span-2 flex items-end">
              <Button onClick={handleDownloadReport} disabled={!selectedSection} className="w-full">
                <Download className="w-4 h-4 mr-2" />
                Download Report
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      {selectedSection && studentWiseData.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-deep-plum">{studentWiseData.length}</p>
                <p className="text-sm text-gray-600">Total Students</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {studentWiseData.filter(s => s.attendancePercentage >= 75).length}
                </p>
                <p className="text-sm text-gray-600">Good Attendance (≥75%)</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-600">
                  {studentWiseData.filter(s => s.attendancePercentage >= 60 && s.attendancePercentage < 75).length}
                </p>
                <p className="text-sm text-gray-600">Average (60-74%)</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">
                  {studentWiseData.filter(s => s.attendancePercentage < 60).length}
                </p>
                <p className="text-sm text-gray-600">Poor Attendance (<60%)</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Student-wise Report Table */}
      {selectedSection && (
        <Card>
          <CardHeader>
            <CardTitle>Student-wise Attendance Report</CardTitle>
            <CardDescription>
              Individual student attendance summary with percentages
            </CardDescription>
          </CardHeader>
          <CardContent>
            {studentWiseData.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-200">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-200 px-4 py-3 text-left font-medium">Student ID</th>
                      <th className="border border-gray-200 px-4 py-3 text-left font-medium">Student Name</th>
                      <th className="border border-gray-200 px-4 py-3 text-center font-medium">Total Classes</th>
                      <th className="border border-gray-200 px-4 py-3 text-center font-medium">Present</th>
                      <th className="border border-gray-200 px-4 py-3 text-center font-medium">Late</th>
                      <th className="border border-gray-200 px-4 py-3 text-center font-medium">Absent</th>
                      <th className="border border-gray-200 px-4 py-3 text-center font-medium">Attendance %</th>
                      <th className="border border-gray-200 px-4 py-3 text-center font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {studentWiseData.map((student, index) => {
                      const statusInfo = getAttendanceStatus(student.attendancePercentage)
                      const StatusIcon = statusInfo.icon
                      
                      return (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="border border-gray-200 px-4 py-3 font-mono">
                            {student.studentId}
                          </td>
                          <td className="border border-gray-200 px-4 py-3 font-medium">
                            {student.studentName}
                          </td>
                          <td className="border border-gray-200 px-4 py-3 text-center">
                            {student.totalClasses}
                          </td>
                          <td className="border border-gray-200 px-4 py-3 text-center">
                            <span className="text-green-600 font-medium">{student.presentCount}</span>
                          </td>
                          <td className="border border-gray-200 px-4 py-3 text-center">
                            <span className="text-yellow-600 font-medium">{student.lateCount}</span>
                          </td>
                          <td className="border border-gray-200 px-4 py-3 text-center">
                            <span className="text-red-600 font-medium">{student.absentCount}</span>
                          </td>
                          <td className="border border-gray-200 px-4 py-3 text-center">
                            <Badge 
                              variant={student.attendancePercentage >= 75 ? 'default' : student.attendancePercentage >= 60 ? 'secondary' : 'destructive'}
                            >
                              {student.attendancePercentage}%
                            </Badge>
                          </td>
                          <td className="border border-gray-200 px-4 py-3 text-center">
                            <div className={`flex items-center justify-center space-x-1 ${statusInfo.color}`}>
                              <StatusIcon className="w-4 h-4" />
                              <span className="text-sm font-medium">{statusInfo.status}</span>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">
                  {searchStudent ? 'No students found matching your search' : 'No attendance data available for the selected section'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default function AttendanceReports() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-deep-plum">Attendance Reports</h1>
          <p className="text-gray-600 mt-1">View and download attendance reports by date or student</p>
        </div>
      </div>

      {/* Report Tabs */}
      <Tabs defaultValue="date-wise" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="date-wise" className="flex items-center space-x-2">
            <Calendar className="w-4 h-4" />
            <span>Date-wise Report</span>
          </TabsTrigger>
          <TabsTrigger value="student-wise" className="flex items-center space-x-2">
            <Users className="w-4 h-4" />
            <span>Student-wise Report</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="date-wise" className="space-y-6">
          <DateWiseReport />
        </TabsContent>

        <TabsContent value="student-wise" className="space-y-6">
          <StudentWiseReport />
        </TabsContent>
      </Tabs>
    </div>
  )
}