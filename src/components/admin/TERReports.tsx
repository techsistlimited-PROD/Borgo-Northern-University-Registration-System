import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  FileText,
  Eye,
  Star,
  User,
  BookOpen,
  Filter,
  Download,
  Search
} from 'lucide-react'

// Mock TER data - would come from database
const mockTERData = [
  {
    teacherName: 'Dr. Abdul Rahman',
    courseCode: 'CSE2301',
    courseName: 'Database Management Systems',
    sections: ['A', 'B'],
    totalStudents: 95,
    responsesReceived: 87,
    averageScore: 4.2,
    evaluationCount: 87,
    students: [
      {
        studentId: '2021-1-60-001',
        studentName: 'Ahmed Hassan',
        section: 'A',
        courseName: 'Database Management Systems',
        score: 4.5,
        comments: 'Excellent teacher with clear explanations and helpful examples.',
        submittedAt: '2024-09-10'
      },
      {
        studentId: '2021-1-60-002', 
        studentName: 'Fatima Khan',
        section: 'A',
        courseName: 'Database Management Systems',
        score: 4.0,
        comments: 'Good teaching style, could provide more practical examples.',
        submittedAt: '2024-09-12'
      },
      {
        studentId: '2021-1-60-045',
        studentName: 'Mohammad Ali',
        section: 'B',
        courseName: 'Database Management Systems', 
        score: 4.3,
        comments: 'Very knowledgeable and approachable. Explains concepts well.',
        submittedAt: '2024-09-11'
      }
      // More students would be included here...
    ]
  },
  {
    teacherName: 'Prof. Ahmed Hassan',
    courseCode: 'CSE2315',
    courseName: 'Software Engineering',
    sections: ['B'],
    totalStudents: 45,
    responsesReceived: 42,
    averageScore: 3.8,
    evaluationCount: 42,
    students: [
      {
        studentId: '2021-1-60-003',
        studentName: 'Sarah Ahmed',
        section: 'B', 
        courseName: 'Software Engineering',
        score: 3.5,
        comments: 'Good theoretical knowledge but needs more hands-on examples.',
        submittedAt: '2024-09-09'
      },
      {
        studentId: '2021-1-60-004',
        studentName: 'Rahul Sharma',
        section: 'B',
        courseName: 'Software Engineering',
        score: 4.2,
        comments: 'Engaging lectures and useful real-world examples.',
        submittedAt: '2024-09-13'
      }
      // More students would be included here...
    ]
  },
  {
    teacherName: 'Dr. Khalid Khan',
    courseCode: 'CSE2345',
    courseName: 'Computer Networks',
    sections: ['A', 'C'],
    totalStudents: 78,
    responsesReceived: 71,
    averageScore: 4.5,
    evaluationCount: 71,
    students: [
      {
        studentId: '2021-1-60-005',
        studentName: 'Marium Sultana',
        section: 'A',
        courseName: 'Computer Networks',
        score: 4.8,
        comments: 'Outstanding teacher! Makes complex topics easy to understand.',
        submittedAt: '2024-09-08'
      },
      {
        studentId: '2021-1-60-006',
        studentName: 'Karim Hassan',
        section: 'C',
        courseName: 'Computer Networks',
        score: 4.3,
        comments: 'Very good at explaining protocols and network concepts.',
        submittedAt: '2024-09-14'
      }
      // More students would be included here...
    ]
  },
  {
    teacherName: 'Ms. Fatima Ahmed',
    courseCode: 'ENG2201',
    courseName: 'Technical Writing',
    sections: ['C'],
    totalStudents: 50,
    responsesReceived: 48,
    averageScore: 3.9,
    evaluationCount: 48,
    students: [
      {
        studentId: '2021-1-60-007',
        studentName: 'Nadia Islam',
        section: 'C',
        courseName: 'Technical Writing',
        score: 4.0,
        comments: 'Helpful feedback on writing assignments and clear guidelines.',
        submittedAt: '2024-09-07'
      }
      // More students would be included here...
    ]
  }
]

const allTeachers = [
  'Dr. Abdul Rahman',
  'Prof. Ahmed Hassan', 
  'Dr. Khalid Khan',
  'Ms. Fatima Ahmed',
  'Dr. Mohammad Islam',
  'Prof. Sarah Khan'
]

const allCourses = [
  { code: 'CSE2301', name: 'Database Management Systems' },
  { code: 'CSE2315', name: 'Software Engineering' },
  { code: 'CSE2345', name: 'Computer Networks' },
  { code: 'ENG2201', name: 'Technical Writing' },
  { code: 'MATH2203', name: 'Statistics & Probability' },
  { code: 'CSE2401', name: 'Algorithms' }
]

interface TERReportsProps {}

export const TERReports = ({}: TERReportsProps) => {
  const [selectedTeacher, setSelectedTeacher] = useState('all')
  const [selectedCourse, setSelectedCourse] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedTERDetail, setSelectedTERDetail] = useState<any>(null)

  // Filter the data based on selected filters
  const filteredData = mockTERData.filter(item => {
    const matchesTeacher = selectedTeacher === 'all' || item.teacherName === selectedTeacher
    const matchesCourse = selectedCourse === 'all' || item.courseCode === selectedCourse
    const matchesSearch = !searchQuery || 
      item.teacherName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.courseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.courseCode.toLowerCase().includes(searchQuery.toLowerCase())
    
    return matchesTeacher && matchesCourse && matchesSearch
  })

  const handleViewDetails = (terData: any) => {
    setSelectedTERDetail(terData)
    setShowDetailModal(true)
  }

  const getScoreColor = (score: number) => {
    if (score >= 4.5) return 'text-green-600 bg-green-100'
    if (score >= 4.0) return 'text-blue-600 bg-blue-100'
    if (score >= 3.5) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  const handleExport = () => {
    alert('Exporting TER report data...')
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-deep-plum">TER Reports</h1>
          <p className="text-gray-600 mt-1">Teacher Evaluation Reports by Students</p>
        </div>
        <Badge className="bg-purple-100 text-purple-800">
          <FileText className="w-4 h-4 mr-1" />
          Evaluation Analytics
        </Badge>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Courses</p>
                <p className="text-2xl font-bold text-deep-plum">{mockTERData.length}</p>
              </div>
              <BookOpen className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Teachers</p>
                <p className="text-2xl font-bold text-green-600">{new Set(mockTERData.map(d => d.teacherName)).size}</p>
              </div>
              <User className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Rating</p>
                <p className="text-2xl font-bold text-purple-600">
                  {(mockTERData.reduce((sum, d) => sum + d.averageScore, 0) / mockTERData.length).toFixed(1)}
                </p>
              </div>
              <Star className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Response Rate</p>
                <p className="text-2xl font-bold text-orange-600">
                  {Math.round((mockTERData.reduce((sum, d) => sum + d.responsesReceived, 0) / 
                              mockTERData.reduce((sum, d) => sum + d.totalStudents, 0)) * 100)}%
                </p>
              </div>
              <FileText className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="w-5 h-5" />
            <span>Filter TER Reports</span>
          </CardTitle>
          <CardDescription>Filter reports by teacher, course, or search</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Teacher</Label>
              <Select value={selectedTeacher} onValueChange={setSelectedTeacher}>
                <SelectTrigger>
                  <SelectValue placeholder="All teachers" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Teachers</SelectItem>
                  {allTeachers.map(teacher => (
                    <SelectItem key={teacher} value={teacher}>
                      {teacher}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Course</Label>
              <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                <SelectTrigger>
                  <SelectValue placeholder="All courses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Courses</SelectItem>
                  {allCourses.map(course => (
                    <SelectItem key={course.code} value={course.code}>
                      {course.code} - {course.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Search</Label>
              <Input
                placeholder="Search teacher or course..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex items-end space-x-2">
              <Button 
                variant="outline" 
                onClick={() => {
                  setSelectedTeacher('')
                  setSelectedCourse('')
                  setSearchQuery('')
                }}
              >
                Clear
              </Button>
              <Button onClick={handleExport}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* TER Reports Table */}
      <Card>
        <CardHeader>
          <CardTitle>Teacher Evaluation Reports ({filteredData.length})</CardTitle>
          <CardDescription>Average student ratings and feedback for each course</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Teacher Name</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Sections</TableHead>
                <TableHead>Students</TableHead>
                <TableHead>Responses</TableHead>
                <TableHead>Performance Score</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{item.teacherName}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{item.courseCode}</div>
                      <div className="text-sm text-gray-600">{item.courseName}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {item.sections.map(section => (
                        <Badge key={section} variant="outline" className="text-xs">
                          {section}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>{item.totalStudents}</TableCell>
                  <TableCell>
                    <div>
                      <span className="font-medium">{item.responsesReceived}</span>
                      <span className="text-sm text-gray-500">
                        ({Math.round((item.responsesReceived / item.totalStudents) * 100)}%)
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Badge className={`${getScoreColor(item.averageScore)} font-bold`}>
                        {item.averageScore.toFixed(1)}
                      </Badge>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map(star => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${
                              star <= Math.round(item.averageScore)
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleViewDetails(item)}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      See Detail
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredData.length === 0 && (
            <div className="text-center py-8">
              <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">No Results Found</h3>
              <p className="text-gray-500">
                Try adjusting your filters or search criteria
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail Modal */}
      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="sm:max-w-[900px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              TER Details - {selectedTERDetail?.teacherName}
            </DialogTitle>
            <DialogDescription>
              Detailed student evaluations for {selectedTERDetail?.courseCode} - {selectedTERDetail?.courseName}
            </DialogDescription>
          </DialogHeader>

          {selectedTERDetail && (
            <div className="space-y-6">
              {/* Summary */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-deep-plum">{selectedTERDetail.averageScore.toFixed(1)}</div>
                  <div className="text-sm text-gray-600">Average Score</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{selectedTERDetail.responsesReceived}</div>
                  <div className="text-sm text-gray-600">Responses</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{selectedTERDetail.totalStudents}</div>
                  <div className="text-sm text-gray-600">Total Students</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {Math.round((selectedTERDetail.responsesReceived / selectedTERDetail.totalStudents) * 100)}%
                  </div>
                  <div className="text-sm text-gray-600">Response Rate</div>
                </div>
              </div>

              {/* Student Details Table */}
              <div>
                <h4 className="font-semibold text-deep-plum mb-4">Individual Student Evaluations</h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student ID</TableHead>
                      <TableHead>Student Name</TableHead>
                      <TableHead>Section</TableHead>
                      <TableHead>Score</TableHead>
                      <TableHead>Comments</TableHead>
                      <TableHead>Submitted</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedTERDetail.students.map((student: any, index: number) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{student.studentId}</TableCell>
                        <TableCell>{student.studentName}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{student.section}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={`${getScoreColor(student.score)} font-bold`}>
                            {student.score.toFixed(1)}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-xs">
                          <div className="truncate" title={student.comments}>
                            {student.comments}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {student.submittedAt}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
