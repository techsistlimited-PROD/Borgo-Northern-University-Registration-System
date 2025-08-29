import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
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
  Calculator,
  Save,
  Download,
  RefreshCw,
  Users,
  Award,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  Calendar,
  BookOpen,
  FileText,
  Clock,
  Star,
  Eye,
  Send
} from 'lucide-react'

interface Student {
  id: string
  studentId: string
  name: string
  email: string
}

interface StudentResult {
  studentId: string
  name: string
  midtermMarks: number
  cumulativeMarks: number
  finalMarks: number
  totalMarks: number
  gpa: number
  grade: string
  status: 'draft' | 'published'
}

interface SectionResult {
  sectionId: string
  courseCode: string
  courseName: string
  section: string
  semester: string
  midtermStatus: 'pending' | 'submitted' | 'processed'
  cumulativeStatus: 'pending' | 'submitted' | 'processed'
  finalStatus: 'pending' | 'submitted' | 'processed'
  resultsStatus: 'draft' | 'calculated' | 'published'
  totalStudents: number
  publishedStudents?: number
  lastUpdated: string
}

interface Section {
  id: string
  courseCode: string
  courseName: string
  sectionName: string
  totalStudents: number
  semester: string
}

// Mock data
const sections: Section[] = [
  { id: '1', courseCode: 'CSE401', courseName: 'Database Management Systems', sectionName: 'A', totalStudents: 42, semester: 'Fall 2024' },
  { id: '2', courseCode: 'CSE401', courseName: 'Database Management Systems', sectionName: 'B', totalStudents: 38, semester: 'Fall 2024' },
  { id: '3', courseCode: 'CSE303', courseName: 'Data Structures and Algorithms', sectionName: 'A', totalStudents: 40, semester: 'Fall 2024' },
  { id: '4', courseCode: 'CSE401', courseName: 'Database Management Systems', sectionName: 'C', totalStudents: 39, semester: 'Fall 2024' }
]

const sectionResults: SectionResult[] = [
  {
    sectionId: '1',
    courseCode: 'CSE401',
    courseName: 'Database Management Systems',
    section: 'A',
    semester: 'Fall 2024',
    midtermStatus: 'submitted',
    cumulativeStatus: 'submitted',
    finalStatus: 'submitted',
    resultsStatus: 'calculated',
    totalStudents: 42,
    publishedStudents: 0,
    lastUpdated: '2024-01-15'
  },
  {
    sectionId: '2',
    courseCode: 'CSE401',
    courseName: 'Database Management Systems', 
    section: 'B',
    semester: 'Fall 2024',
    midtermStatus: 'submitted',
    cumulativeStatus: 'submitted',
    finalStatus: 'pending',
    resultsStatus: 'draft',
    totalStudents: 38,
    publishedStudents: 0,
    lastUpdated: '2024-01-14'
  },
  {
    sectionId: '3',
    courseCode: 'CSE303',
    courseName: 'Data Structures and Algorithms',
    section: 'A', 
    semester: 'Fall 2024',
    midtermStatus: 'submitted',
    cumulativeStatus: 'pending',
    finalStatus: 'pending',
    resultsStatus: 'draft',
    totalStudents: 40,
    publishedStudents: 0,
    lastUpdated: '2024-01-13'
  }
]

const studentsData: Record<string, Student[]> = {
  '1': [
    { id: '1', studentId: '2021-1-60-001', name: 'Ahmed Rahman', email: 'ahmed.rahman@student.nu.edu.bd' },
    { id: '2', studentId: '2021-1-60-002', name: 'Fatima Khan', email: 'fatima.khan@student.nu.edu.bd' },
    { id: '3', studentId: '2021-1-60-003', name: 'Mohammad Ali', email: 'mohammad.ali@student.nu.edu.bd' },
    { id: '4', studentId: '2021-1-60-004', name: 'Ayesha Ahmed', email: 'ayesha.ahmed@student.nu.edu.bd' },
    { id: '5', studentId: '2021-1-60-005', name: 'Rashid Hasan', email: 'rashid.hasan@student.nu.edu.bd' }
  ]
}

// Mock results data for section calculation
const mockStudentResults: Record<string, StudentResult[]> = {
  '1': [
    {
      studentId: '2021-1-60-001',
      name: 'Ahmed Rahman',
      midtermMarks: 23,
      cumulativeMarks: 25,
      finalMarks: 34,
      totalMarks: 82,
      gpa: 3.45,
      grade: 'A-',
      status: 'draft'
    },
    {
      studentId: '2021-1-60-002',
      name: 'Fatima Khan',
      midtermMarks: 27,
      cumulativeMarks: 25,
      finalMarks: 24,
      totalMarks: 76,
      gpa: 3.20,
      grade: 'B+',
      status: 'draft'
    },
    {
      studentId: '2021-1-60-003',
      name: 'Mohammad Ali',
      midtermMarks: 19,
      cumulativeMarks: 22,
      finalMarks: 29,
      totalMarks: 70,
      gpa: 2.95,
      grade: 'B',
      status: 'draft'
    },
    {
      studentId: '2021-1-60-004',
      name: 'Ayesha Ahmed',
      midtermMarks: 15,
      cumulativeMarks: 28,
      finalMarks: 31,
      totalMarks: 74,
      gpa: 3.15,
      grade: 'B+',
      status: 'draft'
    },
    {
      studentId: '2021-1-60-005',
      name: 'Rashid Hasan',
      midtermMarks: 10,
      cumulativeMarks: 20,
      finalMarks: 39,
      totalMarks: 69,
      gpa: 2.85,
      grade: 'B-',
      status: 'draft'
    }
  ]
}

function SentReports() {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>
      case 'submitted':
        return <Badge variant="default">Submitted</Badge>
      case 'processed':
        return <Badge className="bg-green-100 text-green-800">Processed</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getResultsStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return <Badge variant="secondary">Draft</Badge>
      case 'calculated':
        return <Badge variant="outline" className="text-blue-600 border-blue-600">Calculated</Badge>
      case 'published':
        return <Badge className="bg-green-100 text-green-800">Published</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-deep-plum">Sent Reports Overview</h2>
          <p className="text-gray-600">Monitor teacher submissions and processing status</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Send className="w-5 h-5" />
            <span>Section Reports Status</span>
          </CardTitle>
          <CardDescription>Track midterm, cumulative, and final exam submissions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Course</TableHead>
                  <TableHead>Section</TableHead>
                  <TableHead>Semester</TableHead>
                  <TableHead>Students</TableHead>
                  <TableHead>Midterm</TableHead>
                  <TableHead>Cumulative</TableHead>
                  <TableHead>Final</TableHead>
                  <TableHead>Results Status</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sectionResults.map((section) => (
                  <TableRow key={section.sectionId}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{section.courseCode}</div>
                        <div className="text-sm text-gray-500">{section.courseName}</div>
                      </div>
                    </TableCell>
                    <TableCell>{section.section}</TableCell>
                    <TableCell>{section.semester}</TableCell>
                    <TableCell>{section.totalStudents}</TableCell>
                    <TableCell>{getStatusBadge(section.midtermStatus)}</TableCell>
                    <TableCell>{getStatusBadge(section.cumulativeStatus)}</TableCell>
                    <TableCell>{getStatusBadge(section.finalStatus)}</TableCell>
                    <TableCell>{getResultsStatusBadge(section.resultsStatus)}</TableCell>
                    <TableCell>{new Date(section.lastUpdated).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function GPACalculation() {
  const [selectedSection, setSelectedSection] = useState<string>('')
  const [publishDate, setPublishDate] = useState<string>(new Date().toISOString().split('T')[0])
  const [studentResults, setStudentResults] = useState<StudentResult[]>([])
  const [isCalculating, setIsCalculating] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)

  const selectedSectionData = sections.find(section => section.id === selectedSection)

  const handleCalculateGPA = async () => {
    if (!selectedSection) {
      alert('Please select a section first')
      return
    }

    setIsCalculating(true)

    try {
      // Simulate calculation delay
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Load mock data for the selected section
      const sectionData = mockStudentResults[selectedSection] || []
      setStudentResults(sectionData)

      alert('GPA calculated successfully for all students!')
    } catch (error) {
      alert('Error calculating GPA. Please try again.')
    } finally {
      setIsCalculating(false)
    }
  }

  const handlePublishResults = async () => {
    if (studentResults.length === 0) {
      alert('Please calculate GPA first')
      return
    }

    setIsPublishing(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Mark all results as published
      setStudentResults(prev => prev.map(student => ({
        ...student,
        status: 'published'
      })))
      
      alert('Results published successfully for the entire section!')
    } catch (error) {
      alert('Error publishing results. Please try again.')
    } finally {
      setIsPublishing(false)
    }
  }

  const getGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return 'text-green-600 bg-green-100'
    if (grade.startsWith('B')) return 'text-blue-600 bg-blue-100'
    if (grade.startsWith('C')) return 'text-yellow-600 bg-yellow-100'
    if (grade.startsWith('D')) return 'text-orange-600 bg-orange-100'
    return 'text-red-600 bg-red-100'
  }

  const getStats = () => {
    if (studentResults.length === 0) return { average: 0, highest: 0, lowest: 0, passCount: 0 }

    const gpas = studentResults.map(s => s.gpa)
    const average = gpas.reduce((sum, gpa) => sum + gpa, 0) / gpas.length
    const highest = Math.max(...gpas)
    const lowest = Math.min(...gpas)
    const passCount = gpas.filter(gpa => gpa >= 2.0).length

    return {
      average: Math.round(average * 100) / 100,
      highest,
      lowest,
      passCount,
      total: studentResults.length
    }
  }

  const stats = getStats()

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-deep-plum">GPA Calculation & Publishing</h2>
          <p className="text-gray-600">Calculate and publish final results section-wise</p>
        </div>
        {studentResults.length > 0 && (
          <Button onClick={() => alert('Report downloaded')} variant="outline" className="flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Download Report</span>
          </Button>
        )}
      </div>

      {/* Section Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calculator className="w-5 h-5" />
            <span>Section & Result Configuration</span>
          </CardTitle>
          <CardDescription>Select section and configure result publishing settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="section">Select Section</Label>
              <Select value={selectedSection} onValueChange={setSelectedSection}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a section" />
                </SelectTrigger>
                <SelectContent>
                  {sections.map((section) => (
                    <SelectItem key={section.id} value={section.id}>
                      {section.courseCode} - Section {section.sectionName} ({section.totalStudents} students)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="publishDate">Publish Date</Label>
              <Input
                id="publishDate"
                type="date"
                value={publishDate}
                onChange={(e) => setPublishDate(e.target.value)}
              />
            </div>

            <div className="flex items-end">
              <Button 
                onClick={handleCalculateGPA} 
                disabled={!selectedSection || isCalculating}
                className="w-full flex items-center space-x-2"
              >
                {isCalculating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Calculating...</span>
                  </>
                ) : (
                  <>
                    <Calculator className="w-4 h-4" />
                    <span>Calculate GPA</span>
                  </>
                )}
              </Button>
            </div>
          </div>

          {selectedSectionData && (
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-deep-plum">
                    {selectedSectionData.courseCode} - {selectedSectionData.courseName}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Section {selectedSectionData.sectionName} • {selectedSectionData.semester}
                  </p>
                </div>
                <Badge variant="outline">
                  <Users className="w-4 h-4 mr-1" />
                  {selectedSectionData.totalStudents} Students
                </Badge>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Statistics */}
      {studentResults.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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
                <p className="text-2xl font-bold text-green-600">{stats.average}</p>
                <p className="text-sm text-gray-600">Average GPA</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{stats.highest}</p>
                <p className="text-sm text-gray-600">Highest GPA</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-600">{stats.lowest}</p>
                <p className="text-sm text-gray-600">Lowest GPA</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">{stats.passCount}</p>
                <p className="text-sm text-gray-600">Passing (≥2.0)</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Results Table */}
      {studentResults.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="w-5 h-5" />
                  <span>Final Results - Section {selectedSectionData?.sectionName}</span>
                </CardTitle>
                <CardDescription>
                  Review calculated GPA and publish results for the entire section
                </CardDescription>
              </div>
              
              <Button 
                onClick={handlePublishResults}
                disabled={isPublishing || studentResults.every(s => s.status === 'published')}
                className="flex items-center space-x-2"
              >
                {isPublishing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Publishing...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Publish Results</span>
                  </>
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-200 px-4 py-3 text-left font-medium">Student ID</th>
                    <th className="border border-gray-200 px-4 py-3 text-left font-medium">Student Name</th>
                    <th className="border border-gray-200 px-4 py-3 text-center font-medium">Midterm (30)</th>
                    <th className="border border-gray-200 px-4 py-3 text-center font-medium">Cumulative (30)</th>
                    <th className="border border-gray-200 px-4 py-3 text-center font-medium">Final (40)</th>
                    <th className="border border-gray-200 px-4 py-3 text-center font-medium">Total (100)</th>
                    <th className="border border-gray-200 px-4 py-3 text-center font-medium">CGPA</th>
                    <th className="border border-gray-200 px-4 py-3 text-center font-medium">Grade</th>
                    <th className="border border-gray-200 px-4 py-3 text-center font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {studentResults.map((student) => (
                    <tr key={student.studentId} className="hover:bg-gray-50">
                      <td className="border border-gray-200 px-4 py-3 font-mono">
                        {student.studentId}
                      </td>
                      <td className="border border-gray-200 px-4 py-3 font-medium">
                        {student.name}
                      </td>
                      <td className="border border-gray-200 px-4 py-3 text-center">
                        {student.midtermMarks}
                      </td>
                      <td className="border border-gray-200 px-4 py-3 text-center">
                        {student.cumulativeMarks}
                      </td>
                      <td className="border border-gray-200 px-4 py-3 text-center">
                        {student.finalMarks}
                      </td>
                      <td className="border border-gray-200 px-4 py-3 text-center font-medium">
                        {student.totalMarks}
                      </td>
                      <td className="border border-gray-200 px-4 py-3 text-center font-bold">
                        {student.cgpa}
                      </td>
                      <td className="border border-gray-200 px-4 py-3 text-center">
                        <Badge className={`${getGradeColor(student.grade)} border-0`}>
                          {student.grade}
                        </Badge>
                      </td>
                      <td className="border border-gray-200 px-4 py-3 text-center">
                        {student.status === 'published' ? (
                          <Badge className="bg-green-100 text-green-800 border-0">
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Published
                          </Badge>
                        ) : (
                          <Badge variant="outline">
                            <Clock className="w-4 h-4 mr-1" />
                            Draft
                          </Badge>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {studentResults.some(s => s.status === 'published') && (
              <div className="mt-4 p-4 bg-green-50 rounded-lg flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-green-800">
                  Results have been published on {publishDate}
                </span>
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
              <Calculator className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Select Section to Calculate CGPA</h3>
              <p className="text-gray-500">Choose a section from the dropdown above to begin CGPA calculation and result publishing</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default function ResultsGrades() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-deep-plum">Results & Grades Management</h1>
          <p className="text-gray-600 mt-1">View teacher submissions, calculate CGPA, and publish final results</p>
        </div>
        <Badge className="bg-purple-100 text-purple-800">
          <Award className="w-4 h-4 mr-1" />
          Admin Control Panel
        </Badge>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Sections</p>
                <p className="text-2xl font-bold text-deep-plum">4</p>
              </div>
              <BookOpen className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ready for Results</p>
                <p className="text-2xl font-bold text-green-600">1</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Submissions</p>
                <p className="text-2xl font-bold text-orange-600">3</p>
              </div>
              <Clock className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Published Results</p>
                <p className="text-2xl font-bold text-purple-600">0</p>
              </div>
              <Star className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="sent-reports" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="sent-reports" className="flex items-center space-x-2">
            <Send className="w-4 h-4" />
            <span>Sent Reports</span>
          </TabsTrigger>
          <TabsTrigger value="cgpa-calculation" className="flex items-center space-x-2">
            <Calculator className="w-4 h-4" />
            <span>CGPA Calculation</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sent-reports">
          <SentReports />
        </TabsContent>

        <TabsContent value="cgpa-calculation">
          <CGPACalculation />
        </TabsContent>
      </Tabs>
    </div>
  )
}
