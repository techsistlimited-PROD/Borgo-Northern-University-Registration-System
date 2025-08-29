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
  program: string
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
  program: string
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
  program: string
}

// Mock attendance data with multiple programs
const attendanceRecords: AttendanceRecord[] = [
  // CSE students
  { id: '1', studentId: '2021-1-60-001', studentName: 'Ahmed Rahman', date: '2024-01-15', status: 'present', courseCode: 'CSE401', section: 'A', program: 'CSE' },
  { id: '2', studentId: '2021-1-60-002', studentName: 'Fatima Khan', date: '2024-01-15', status: 'absent', courseCode: 'CSE401', section: 'A', program: 'CSE' },
  { id: '3', studentId: '2021-1-60-003', studentName: 'Mohammad Ali', date: '2024-01-15', status: 'present', courseCode: 'CSE401', section: 'A', program: 'CSE' },
  { id: '4', studentId: '2021-1-60-001', studentName: 'Ahmed Rahman', date: '2024-01-17', status: 'late', courseCode: 'CSE401', section: 'A', program: 'CSE' },
  { id: '5', studentId: '2021-1-60-002', studentName: 'Fatima Khan', date: '2024-01-17', status: 'present', courseCode: 'CSE401', section: 'A', program: 'CSE' },
  
  // BBA students
  { id: '6', studentId: '2021-2-50-001', studentName: 'Ruma Begum', date: '2024-01-15', status: 'present', courseCode: 'BBA401', section: 'A', program: 'BBA' },
  { id: '7', studentId: '2021-2-50-002', studentName: 'Karim Hassan', date: '2024-01-15', status: 'absent', courseCode: 'BBA401', section: 'A', program: 'BBA' },
  { id: '8', studentId: '2021-2-50-003', studentName: 'Salma Ahmed', date: '2024-01-15', status: 'present', courseCode: 'BBA401', section: 'A', program: 'BBA' },
  { id: '9', studentId: '2021-2-50-001', studentName: 'Ruma Begum', date: '2024-01-17', status: 'present', courseCode: 'BBA401', section: 'A', program: 'BBA' },
  { id: '10', studentId: '2021-2-50-002', studentName: 'Karim Hassan', date: '2024-01-17', status: 'late', courseCode: 'BBA401', section: 'A', program: 'BBA' },
  
  // EEE students
  { id: '11', studentId: '2021-3-40-001', studentName: 'Nasir Uddin', date: '2024-01-15', status: 'present', courseCode: 'EEE301', section: 'A', program: 'EEE' },
  { id: '12', studentId: '2021-3-40-002', studentName: 'Ayesha Sultana', date: '2024-01-15', status: 'present', courseCode: 'EEE301', section: 'A', program: 'EEE' },
  { id: '13', studentId: '2021-3-40-003', studentName: 'Rafiq Khan', date: '2024-01-15', status: 'absent', courseCode: 'EEE301', section: 'A', program: 'EEE' },
  { id: '14', studentId: '2021-3-40-001', studentName: 'Nasir Uddin', date: '2024-01-17', status: 'present', courseCode: 'EEE301', section: 'A', program: 'EEE' },
  { id: '15', studentId: '2021-3-40-002', studentName: 'Ayesha Sultana', date: '2024-01-17', status: 'late', courseCode: 'EEE301', section: 'A', program: 'EEE' },
  
  // Textile students
  { id: '16', studentId: '2021-3-55-001', studentName: 'Habib Rahman', date: '2024-01-15', status: 'present', courseCode: 'TEX201', section: 'A', program: 'Textile Engineering' },
  { id: '17', studentId: '2021-3-55-002', studentName: 'Nadia Islam', date: '2024-01-15', status: 'absent', courseCode: 'TEX201', section: 'A', program: 'Textile Engineering' },
  { id: '18', studentId: '2021-3-55-003', studentName: 'Omar Faruk', date: '2024-01-15', status: 'present', courseCode: 'TEX201', section: 'A', program: 'Textile Engineering' },
  
  // B. Pharm students
  { id: '19', studentId: '2021-4-45-001', studentName: 'Taslima Khatun', date: '2024-01-15', status: 'present', courseCode: 'PHR301', section: 'A', program: 'B. Pharm' },
  { id: '20', studentId: '2021-4-45-002', studentName: 'Rashid Ahmed', date: '2024-01-15', status: 'late', courseCode: 'PHR301', section: 'A', program: 'B. Pharm' },
  { id: '21', studentId: '2021-4-45-003', studentName: 'Sultana Razia', date: '2024-01-15', status: 'present', courseCode: 'PHR301', section: 'A', program: 'B. Pharm' }
]

// Mock exam attendance data
interface ExamAttendanceRecord {
  id: string
  studentId: string
  studentName: string
  courseCode: string
  section: string
  program: string
  examType: 'midterm' | 'final'
  examDate: string
  status: 'present' | 'absent'
}

const examAttendanceRecords: ExamAttendanceRecord[] = [
  // CSE midterm/final
  { id: '1', studentId: '2021-1-60-001', studentName: 'Ahmed Rahman', courseCode: 'CSE401', section: 'A', program: 'CSE', examType: 'midterm', examDate: '2024-02-15', status: 'present' },
  { id: '2', studentId: '2021-1-60-002', studentName: 'Fatima Khan', courseCode: 'CSE401', section: 'A', program: 'CSE', examType: 'midterm', examDate: '2024-02-15', status: 'absent' },
  { id: '3', studentId: '2021-1-60-003', studentName: 'Mohammad Ali', courseCode: 'CSE401', section: 'A', program: 'CSE', examType: 'midterm', examDate: '2024-02-15', status: 'present' },
  { id: '4', studentId: '2021-1-60-001', studentName: 'Ahmed Rahman', courseCode: 'CSE401', section: 'A', program: 'CSE', examType: 'final', examDate: '2024-03-20', status: 'present' },
  { id: '5', studentId: '2021-1-60-002', studentName: 'Fatima Khan', courseCode: 'CSE401', section: 'A', program: 'CSE', examType: 'final', examDate: '2024-03-20', status: 'present' },
  
  // BBA midterm/final
  { id: '6', studentId: '2021-2-50-001', studentName: 'Ruma Begum', courseCode: 'BBA401', section: 'A', program: 'BBA', examType: 'midterm', examDate: '2024-02-16', status: 'present' },
  { id: '7', studentId: '2021-2-50-002', studentName: 'Karim Hassan', courseCode: 'BBA401', section: 'A', program: 'BBA', examType: 'midterm', examDate: '2024-02-16', status: 'absent' },
  { id: '8', studentId: '2021-2-50-003', studentName: 'Salma Ahmed', courseCode: 'BBA401', section: 'A', program: 'BBA', examType: 'midterm', examDate: '2024-02-16', status: 'present' },
  { id: '9', studentId: '2021-2-50-001', studentName: 'Ruma Begum', courseCode: 'BBA401', section: 'A', program: 'BBA', examType: 'final', examDate: '2024-03-21', status: 'present' },
  { id: '10', studentId: '2021-2-50-002', studentName: 'Karim Hassan', courseCode: 'BBA401', section: 'A', program: 'BBA', examType: 'final', examDate: '2024-03-21', status: 'present' },
  
  // EEE midterm/final
  { id: '11', studentId: '2021-3-40-001', studentName: 'Nasir Uddin', courseCode: 'EEE301', section: 'A', program: 'EEE', examType: 'midterm', examDate: '2024-02-17', status: 'present' },
  { id: '12', studentId: '2021-3-40-002', studentName: 'Ayesha Sultana', courseCode: 'EEE301', section: 'A', program: 'EEE', examType: 'midterm', examDate: '2024-02-17', status: 'absent' },
  { id: '13', studentId: '2021-3-40-003', studentName: 'Rafiq Khan', courseCode: 'EEE301', section: 'A', program: 'EEE', examType: 'midterm', examDate: '2024-02-17', status: 'present' },
  { id: '14', studentId: '2021-3-40-001', studentName: 'Nasir Uddin', courseCode: 'EEE301', section: 'A', program: 'EEE', examType: 'final', examDate: '2024-03-22', status: 'present' },
  { id: '15', studentId: '2021-3-40-002', studentName: 'Ayesha Sultana', courseCode: 'EEE301', section: 'A', program: 'EEE', examType: 'final', examDate: '2024-03-22', status: 'present' }
]

const programs = ['CSE', 'BBA', 'EEE', 'Textile Engineering', 'B. Pharm']
const semesters = ['Fall 2024', 'Spring 2024', 'Summer 2024', 'Fall 2023']

const getSections = (program?: string) => {
  if (!program) return []
  
  const sectionMap: Record<string, any[]> = {
    'CSE': [
      { id: 'CSE401-A', label: 'CSE401 - Section A', courseCode: 'CSE401', section: 'A' },
      { id: 'CSE401-B', label: 'CSE401 - Section B', courseCode: 'CSE401', section: 'B' },
      { id: 'CSE303-A', label: 'CSE303 - Section A', courseCode: 'CSE303', section: 'A' }
    ],
    'BBA': [
      { id: 'BBA401-A', label: 'BBA401 - Section A', courseCode: 'BBA401', section: 'A' },
      { id: 'BBA401-B', label: 'BBA401 - Section B', courseCode: 'BBA401', section: 'B' },
      { id: 'BBA301-A', label: 'BBA301 - Section A', courseCode: 'BBA301', section: 'A' }
    ],
    'EEE': [
      { id: 'EEE301-A', label: 'EEE301 - Section A', courseCode: 'EEE301', section: 'A' },
      { id: 'EEE301-B', label: 'EEE301 - Section B', courseCode: 'EEE301', section: 'B' },
      { id: 'EEE401-A', label: 'EEE401 - Section A', courseCode: 'EEE401', section: 'A' }
    ],
    'Textile Engineering': [
      { id: 'TEX201-A', label: 'TEX201 - Section A', courseCode: 'TEX201', section: 'A' },
      { id: 'TEX301-A', label: 'TEX301 - Section A', courseCode: 'TEX301', section: 'A' }
    ],
    'B. Pharm': [
      { id: 'PHR301-A', label: 'PHR301 - Section A', courseCode: 'PHR301', section: 'A' },
      { id: 'PHR401-A', label: 'PHR401 - Section A', courseCode: 'PHR401', section: 'A' }
    ]
  }
  
  return sectionMap[program] || []
}

function DateWiseReport() {
  const [selectedProgram, setSelectedProgram] = useState<string>('')
  const [selectedSemester, setSelectedSemester] = useState<string>('')
  const [selectedSection, setSelectedSection] = useState<string>('')
  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')

  const sections = getSections(selectedProgram)

  const generateDateWiseData = (): DateWiseRecord[] => {
    if (!selectedSection) return []

    const sectionData = sections.find(s => s.id === selectedSection)
    if (!sectionData) return []

    // Filter records by program, section and date range
    let filteredRecords = attendanceRecords.filter(record => 
      record.program === selectedProgram &&
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
        attendancePercentage,
        program: selectedProgram
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
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="space-y-2">
              <Label htmlFor="program">Program</Label>
              <Select value={selectedProgram} onValueChange={(value) => {
                setSelectedProgram(value)
                setSelectedSection('')
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Select program" />
                </SelectTrigger>
                <SelectContent>
                  {programs.map(program => (
                    <SelectItem key={program} value={program}>
                      {program}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="semester">Semester</Label>
              <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                <SelectTrigger>
                  <SelectValue placeholder="Select semester" />
                </SelectTrigger>
                <SelectContent>
                  {semesters.map(semester => (
                    <SelectItem key={semester} value={semester}>
                      {semester}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="section">Section</Label>
              <Select 
                value={selectedSection} 
                onValueChange={setSelectedSection}
                disabled={!selectedProgram}
              >
                <SelectTrigger>
                  <SelectValue placeholder={selectedProgram ? "Select section" : "Select program first"} />
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
          </div>
          
          <div className="mt-4 flex justify-end">
            <Button onClick={handleDownloadReport} disabled={!selectedSection} className="w-32">
              <Download className="w-4 h-4 mr-2" />
              Download Report
            </Button>
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
  const [selectedProgram, setSelectedProgram] = useState<string>('')
  const [selectedSemester, setSelectedSemester] = useState<string>('')
  const [selectedSection, setSelectedSection] = useState<string>('')
  const [searchStudent, setSearchStudent] = useState<string>('')

  const sections = getSections(selectedProgram)

  const generateStudentWiseData = (): StudentWiseRecord[] => {
    if (!selectedSection) return []

    const sectionData = sections.find(s => s.id === selectedSection)
    if (!sectionData) return []

    // Filter records by program and section
    const filteredRecords = attendanceRecords.filter(record => 
      record.program === selectedProgram &&
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
        section: sectionData.section,
        program: selectedProgram
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
              <Label htmlFor="program">Program</Label>
              <Select value={selectedProgram} onValueChange={(value) => {
                setSelectedProgram(value)
                setSelectedSection('')
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Select program" />
                </SelectTrigger>
                <SelectContent>
                  {programs.map(program => (
                    <SelectItem key={program} value={program}>
                      {program}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="semester">Semester</Label>
              <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                <SelectTrigger>
                  <SelectValue placeholder="Select semester" />
                </SelectTrigger>
                <SelectContent>
                  {semesters.map(semester => (
                    <SelectItem key={semester} value={semester}>
                      {semester}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="section">Section</Label>
              <Select 
                value={selectedSection} 
                onValueChange={setSelectedSection}
                disabled={!selectedProgram}
              >
                <SelectTrigger>
                  <SelectValue placeholder={selectedProgram ? "Select section" : "Select program first"} />
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
          </div>

          <div className="mt-4 flex justify-end">
            <Button onClick={handleDownloadReport} disabled={!selectedSection} className="w-32">
              <Download className="w-4 h-4 mr-2" />
              Download Report
            </Button>
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
                <p className="text-sm text-gray-600">Poor Attendance (&lt;60%)</p>
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

function ExamAttendanceReport() {
  const [selectedProgram, setSelectedProgram] = useState<string>('')
  const [selectedSemester, setSelectedSemester] = useState<string>('')
  const [selectedSection, setSelectedSection] = useState<string>('')

  const sections = getSections(selectedProgram)

  const getMidtermAbsentees = () => {
    if (!selectedSection) return []

    const sectionData = sections.find(s => s.id === selectedSection)
    if (!sectionData) return []

    // Filter midterm exam records for absent students
    return examAttendanceRecords.filter(record =>
      record.program === selectedProgram &&
      record.courseCode === sectionData.courseCode &&
      record.section === sectionData.section &&
      record.examType === 'midterm' &&
      record.status === 'absent'
    )
  }

  const absentStudents = getMidtermAbsentees()

  const handleDownloadReport = () => {
    alert('Midterm exam absentees report downloaded successfully!')
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="program">Program</Label>
              <Select value={selectedProgram} onValueChange={(value) => {
                setSelectedProgram(value)
                setSelectedSection('')
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Select program" />
                </SelectTrigger>
                <SelectContent>
                  {programs.map(program => (
                    <SelectItem key={program} value={program}>
                      {program}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="semester">Semester</Label>
              <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                <SelectTrigger>
                  <SelectValue placeholder="Select semester" />
                </SelectTrigger>
                <SelectContent>
                  {semesters.map(semester => (
                    <SelectItem key={semester} value={semester}>
                      {semester}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="section">Section</Label>
              <Select 
                value={selectedSection} 
                onValueChange={setSelectedSection}
                disabled={!selectedProgram}
              >
                <SelectTrigger>
                  <SelectValue placeholder={selectedProgram ? "Select section" : "Select program first"} />
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
          </div>

          <div className="mt-4 flex justify-end">
            <Button onClick={handleDownloadReport} disabled={!selectedSection} className="w-32">
              <Download className="w-4 h-4 mr-2" />
              Download Report
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      {selectedSection && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <XCircle className="w-8 h-8 text-red-600" />
              <div>
                <h3 className="font-semibold text-red-800">Midterm Exam Absentees</h3>
                <p className="text-red-700 text-sm">
                  {absentStudents.length} student(s) were absent during midterm examination
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Absentees List */}
      {selectedSection && (
        <Card>
          <CardHeader>
            <CardTitle className="text-red-700">Students Absent in Midterm Exam</CardTitle>
            <CardDescription>
              List of students who missed the midterm examination (as reported by course teacher)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {absentStudents.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-200">
                  <thead>
                    <tr className="bg-red-50">
                      <th className="border border-gray-200 px-4 py-3 text-left font-medium">Student ID</th>
                      <th className="border border-gray-200 px-4 py-3 text-left font-medium">Student Name</th>
                      <th className="border border-gray-200 px-4 py-3 text-left font-medium">Course</th>
                      <th className="border border-gray-200 px-4 py-3 text-center font-medium">Section</th>
                      <th className="border border-gray-200 px-4 py-3 text-center font-medium">Exam Date</th>
                      <th className="border border-gray-200 px-4 py-3 text-center font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {absentStudents.map((student, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="border border-gray-200 px-4 py-3 font-mono">
                          {student.studentId}
                        </td>
                        <td className="border border-gray-200 px-4 py-3 font-medium">
                          {student.studentName}
                        </td>
                        <td className="border border-gray-200 px-4 py-3">
                          {student.courseCode}
                        </td>
                        <td className="border border-gray-200 px-4 py-3 text-center">
                          {student.section}
                        </td>
                        <td className="border border-gray-200 px-4 py-3 text-center">
                          {new Date(student.examDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </td>
                        <td className="border border-gray-200 px-4 py-3 text-center">
                          <Badge variant="destructive">
                            <XCircle className="w-3 h-3 mr-1" />
                            Absent
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <p className="text-green-600 font-medium">No students were absent in the midterm exam!</p>
                <p className="text-gray-500 text-sm">All students attended the midterm examination.</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function FinalExamAttendanceReport() {
  const [selectedProgram, setSelectedProgram] = useState<string>('')
  const [selectedSemester, setSelectedSemester] = useState<string>('')
  const [selectedSection, setSelectedSection] = useState<string>('')

  const sections = getSections(selectedProgram)

  const getFinalExamAttendance = () => {
    if (!selectedSection) return []

    const sectionData = sections.find(s => s.id === selectedSection)
    if (!sectionData) return []

    // Get all students who have final exam records for this section
    const finalExamRecords = examAttendanceRecords.filter(record =>
      record.program === selectedProgram &&
      record.courseCode === sectionData.courseCode &&
      record.section === sectionData.section &&
      record.examType === 'final'
    )

    return finalExamRecords
  }

  const finalExamStudents = getFinalExamAttendance()

  const handleDownloadReport = () => {
    alert('Final exam attendance report downloaded successfully!')
  }

  const getAttendanceStats = () => {
    const total = finalExamStudents.length
    const attended = finalExamStudents.filter(s => s.status === 'present').length
    const absent = finalExamStudents.filter(s => s.status === 'absent').length
    return { total, attended, absent }
  }

  const stats = getAttendanceStats()

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="program">Program</Label>
              <Select value={selectedProgram} onValueChange={(value) => {
                setSelectedProgram(value)
                setSelectedSection('')
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Select program" />
                </SelectTrigger>
                <SelectContent>
                  {programs.map(program => (
                    <SelectItem key={program} value={program}>
                      {program}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="semester">Semester</Label>
              <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                <SelectTrigger>
                  <SelectValue placeholder="Select semester" />
                </SelectTrigger>
                <SelectContent>
                  {semesters.map(semester => (
                    <SelectItem key={semester} value={semester}>
                      {semester}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="section">Section</Label>
              <Select 
                value={selectedSection} 
                onValueChange={setSelectedSection}
                disabled={!selectedProgram}
              >
                <SelectTrigger>
                  <SelectValue placeholder={selectedProgram ? "Select section" : "Select program first"} />
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
          </div>

          <div className="mt-4 flex justify-end">
            <Button onClick={handleDownloadReport} disabled={!selectedSection} className="w-32">
              <Download className="w-4 h-4 mr-2" />
              Download Report
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      {selectedSection && finalExamStudents.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-deep-plum">{stats.total}</p>
                <p className="text-sm text-gray-600">Total Students</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{stats.attended}</p>
                <p className="text-sm text-gray-600">Attended</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">{stats.absent}</p>
                <p className="text-sm text-gray-600">Absent</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Final Exam Attendance List */}
      {selectedSection && (
        <Card>
          <CardHeader>
            <CardTitle className="text-purple-700">Final Exam Attendance List</CardTitle>
            <CardDescription>
              Final exam attendance with Y for attended and N for absent
            </CardDescription>
          </CardHeader>
          <CardContent>
            {finalExamStudents.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-200">
                  <thead>
                    <tr className="bg-purple-50">
                      <th className="border border-gray-200 px-4 py-3 text-left font-medium">Student ID</th>
                      <th className="border border-gray-200 px-4 py-3 text-left font-medium">Student Name</th>
                      <th className="border border-gray-200 px-4 py-3 text-left font-medium">Course</th>
                      <th className="border border-gray-200 px-4 py-3 text-center font-medium">Section</th>
                      <th className="border border-gray-200 px-4 py-3 text-center font-medium">Exam Date</th>
                      <th className="border border-gray-200 px-4 py-3 text-center font-medium">Attended</th>
                    </tr>
                  </thead>
                  <tbody>
                    {finalExamStudents.map((student, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="border border-gray-200 px-4 py-3 font-mono">
                          {student.studentId}
                        </td>
                        <td className="border border-gray-200 px-4 py-3 font-medium">
                          {student.studentName}
                        </td>
                        <td className="border border-gray-200 px-4 py-3">
                          {student.courseCode}
                        </td>
                        <td className="border border-gray-200 px-4 py-3 text-center">
                          {student.section}
                        </td>
                        <td className="border border-gray-200 px-4 py-3 text-center">
                          {new Date(student.examDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </td>
                        <td className="border border-gray-200 px-4 py-3 text-center">
                          <span className={`text-2xl font-bold ${
                            student.status === 'present' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {student.status === 'present' ? 'Y' : 'N'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No final exam attendance data available for the selected section</p>
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
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="date-wise" className="flex items-center space-x-2">
            <Calendar className="w-4 h-4" />
            <span>Date-wise Report</span>
          </TabsTrigger>
          <TabsTrigger value="student-wise" className="flex items-center space-x-2">
            <Users className="w-4 h-4" />
            <span>Student-wise Report</span>
          </TabsTrigger>
          <TabsTrigger value="exam-absences" className="flex items-center space-x-2">
            <XCircle className="w-4 h-4" />
            <span>Midterm Absences</span>
          </TabsTrigger>
          <TabsTrigger value="final-attendance" className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4" />
            <span>Final Exam List</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="date-wise" className="space-y-6">
          <DateWiseReport />
        </TabsContent>

        <TabsContent value="student-wise" className="space-y-6">
          <StudentWiseReport />
        </TabsContent>

        <TabsContent value="exam-absences" className="space-y-6">
          <ExamAttendanceReport />
        </TabsContent>

        <TabsContent value="final-attendance" className="space-y-6">
          <FinalExamAttendanceReport />
        </TabsContent>
      </Tabs>
    </div>
  )
}
