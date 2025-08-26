import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { 
  Save, 
  Download,
  RefreshCw,
  Users,
  Award,
  CheckCircle,
  AlertTriangle,
  Calendar,
  BookOpen,
  FileText,
  Edit,
  Clock
} from 'lucide-react'

interface Student {
  id: string
  studentId: string
  name: string
  email: string
}

interface MidtermScoreEntry {
  studentId: string
  score: number
  publishDate?: string
  isFinalized: boolean
  examDate?: string
  examDuration?: string
}

interface Section {
  id: string
  courseCode: string
  courseName: string
  sectionName: string
  totalStudents: number
}

// Mock data
const sections: Section[] = [
  { id: '1', courseCode: 'CSE401', courseName: 'Database Management Systems', sectionName: 'A', totalStudents: 42 },
  { id: '2', courseCode: 'CSE401', courseName: 'Database Management Systems', sectionName: 'B', totalStudents: 38 },
  { id: '3', courseCode: 'CSE303', courseName: 'Data Structures and Algorithms', sectionName: 'A', totalStudents: 40 },
  { id: '4', courseCode: 'CSE401', courseName: 'Database Management Systems', sectionName: 'C', totalStudents: 39 }
]

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
  ]
}

export default function MidtermMarks() {
  const [selectedSection, setSelectedSection] = useState<string>('')
  const [publishDate, setPublishDate] = useState<string>(new Date().toISOString().split('T')[0])
  const [examDate, setExamDate] = useState<string>('')
  const [examDuration, setExamDuration] = useState<string>('3 hours')
  const [midtermScores, setMidtermScores] = useState<Record<string, MidtermScoreEntry>>({})
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const selectedSectionData = sections.find(section => section.id === selectedSection)
  const students = selectedSection ? studentsData[selectedSection] || [] : []

  const handleLoadSection = async () => {
    if (!selectedSection) return

    setIsLoading(true)
    
    try {
      // Simulate loading delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Initialize empty scores for all students
      const initialScores: Record<string, MidtermScoreEntry> = {}
      students.forEach(student => {
        initialScores[student.id] = {
          studentId: student.studentId,
          score: 0,
          isFinalized: false,
          examDate,
          examDuration
        }
      })
      
      setMidtermScores(initialScores)
    } catch (error) {
      alert('Error loading section data. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleScoreChange = (studentId: string, newScore: number) => {
    if (newScore < 0 || newScore > 30) return
    
    setMidtermScores(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        score: newScore
      }
    }))
  }

  const handleBulkScoreEntry = (scores: string) => {
    try {
      const scoreArray = scores.split('\n').map(line => line.trim()).filter(line => line)
      
      if (scoreArray.length !== students.length) {
        alert(`Please enter exactly ${students.length} scores (one per line)`)
        return
      }

      const updatedScores = { ...midtermScores }
      students.forEach((student, index) => {
        const score = parseInt(scoreArray[index])
        if (!isNaN(score) && score >= 0 && score <= 30) {
          updatedScores[student.id] = {
            ...updatedScores[student.id],
            score
          }
        }
      })
      
      setMidtermScores(updatedScores)
    } catch (error) {
      alert('Error processing bulk scores. Please check the format.')
    }
  }

  const handleSaveScores = async () => {
    if (!selectedSection || Object.keys(midtermScores).length === 0) {
      alert('Please load a section and enter scores first')
      return
    }

    // Validate all scores are entered
    const hasEmptyScores = Object.values(midtermScores).some(entry => 
      entry.score === undefined || entry.score === null
    )

    if (hasEmptyScores) {
      alert('Please enter scores for all students before saving')
      return
    }

    setIsSaving(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Mark all scores as finalized
      setMidtermScores(prev => {
        const updated = { ...prev }
        Object.keys(updated).forEach(key => {
          updated[key] = {
            ...updated[key],
            publishDate,
            isFinalized: true
          }
        })
        return updated
      })
      
      alert('Midterm marks saved and published successfully!')
    } catch (error) {
      alert('Error saving marks. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDownloadReport = () => {
    alert('Midterm marks report downloaded successfully!')
  }

  const getScoreGrade = (score: number) => {
    if (score >= 27) return { grade: 'A+', color: 'text-green-600', bgColor: 'bg-green-100' }
    if (score >= 24) return { grade: 'A', color: 'text-green-600', bgColor: 'bg-green-100' }
    if (score >= 21) return { grade: 'A-', color: 'text-blue-600', bgColor: 'bg-blue-100' }
    if (score >= 18) return { grade: 'B+', color: 'text-blue-600', bgColor: 'bg-blue-100' }
    if (score >= 15) return { grade: 'B', color: 'text-yellow-600', bgColor: 'bg-yellow-100' }
    if (score >= 12) return { grade: 'B-', color: 'text-yellow-600', bgColor: 'bg-yellow-100' }
    if (score >= 9) return { grade: 'C+', color: 'text-orange-600', bgColor: 'bg-orange-100' }
    if (score >= 6) return { grade: 'C', color: 'text-orange-600', bgColor: 'bg-orange-100' }
    if (score >= 3) return { grade: 'D', color: 'text-red-600', bgColor: 'bg-red-100' }
    return { grade: 'F', color: 'text-red-600', bgColor: 'bg-red-100' }
  }

  const getStats = () => {
    const scores = Object.values(midtermScores)
    if (scores.length === 0) return { average: 0, highest: 0, lowest: 0, passCount: 0 }
    
    const scoreValues = scores.map(s => s.score).filter(s => s !== undefined)
    if (scoreValues.length === 0) return { average: 0, highest: 0, lowest: 0, passCount: 0 }
    
    const average = scoreValues.reduce((sum, score) => sum + score, 0) / scoreValues.length
    const highest = Math.max(...scoreValues)
    const lowest = Math.min(...scoreValues)
    const passCount = scoreValues.filter(score => score >= 18).length
    
    return { 
      average: Math.round(average * 100) / 100, 
      highest, 
      lowest, 
      passCount,
      total: scores.length
    }
  }

  const stats = getStats()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-deep-plum">Midterm Marks Entry</h1>
          <p className="text-gray-600 mt-1">Enter and manage midterm examination marks (out of 30)</p>
        </div>
        {Object.keys(midtermScores).length > 0 && (
          <Button onClick={handleDownloadReport} variant="outline" className="flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Download Report</span>
          </Button>
        )}
      </div>

      {/* Section and Exam Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="w-5 h-5" />
            <span>Exam Details</span>
          </CardTitle>
          <CardDescription>Configure section and exam information for midterm marks entry</CardDescription>
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
                  {sections.map((section) => (
                    <SelectItem key={section.id} value={section.id}>
                      {section.courseCode} - Section {section.sectionName} ({section.totalStudents} students)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="examDate">Exam Date</Label>
              <Input
                id="examDate"
                type="date"
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="examDuration">Exam Duration</Label>
              <Select value={examDuration} onValueChange={setExamDuration}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2 hours">2 hours</SelectItem>
                  <SelectItem value="2.5 hours">2.5 hours</SelectItem>
                  <SelectItem value="3 hours">3 hours</SelectItem>
                  <SelectItem value="3.5 hours">3.5 hours</SelectItem>
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
          </div>

          <div className="flex space-x-2">
            <Button 
              onClick={handleLoadSection} 
              disabled={!selectedSection || isLoading}
              className="flex items-center space-x-2"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Loading...</span>
                </>
              ) : (
                <>
                  <Users className="w-4 h-4" />
                  <span>Load Section</span>
                </>
              )}
            </Button>
          </div>

          {selectedSectionData && (
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-deep-plum">
                    {selectedSectionData.courseCode} - {selectedSectionData.courseName}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Section {selectedSectionData.sectionName} • Midterm Examination
                  </p>
                  {examDate && (
                    <p className="text-sm text-gray-600">
                      Exam Date: {new Date(examDate).toLocaleDateString()} • Duration: {examDuration}
                    </p>
                  )}
                </div>
                <Badge variant="outline">
                  <Award className="w-4 h-4 mr-1" />
                  Max: 30 Marks
                </Badge>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Statistics */}
      {Object.keys(midtermScores).length > 0 && (
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
                <p className="text-sm text-gray-600">Average Score</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{stats.highest}</p>
                <p className="text-sm text-gray-600">Highest Score</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-600">{stats.lowest}</p>
                <p className="text-sm text-gray-600">Lowest Score</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">{stats.passCount}</p>
                <p className="text-sm text-gray-600">Passing (≥18)</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Marks Entry Table */}
      {Object.keys(midtermScores).length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="w-5 h-5" />
                  <span>Midterm Marks Entry</span>
                </CardTitle>
                <CardDescription>
                  Enter midterm examination marks for each student (0-30 marks)
                </CardDescription>
              </div>
              
              <Button 
                onClick={handleSaveScores}
                disabled={isSaving || Object.values(midtermScores).some(s => s.isFinalized)}
                className="flex items-center space-x-2"
              >
                {isSaving ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save & Publish</span>
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
                    <th className="border border-gray-200 px-4 py-3 text-center font-medium">Marks (30)</th>
                    <th className="border border-gray-200 px-4 py-3 text-center font-medium">Percentage</th>
                    <th className="border border-gray-200 px-4 py-3 text-center font-medium">Grade</th>
                    <th className="border border-gray-200 px-4 py-3 text-center font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => {
                    const scoreData = midtermScores[student.id]
                    if (!scoreData) return null
                    
                    const percentage = Math.round((scoreData.score / 30) * 100)
                    const gradeInfo = getScoreGrade(scoreData.score)
                    
                    return (
                      <tr key={student.id} className="hover:bg-gray-50">
                        <td className="border border-gray-200 px-4 py-3 font-mono">
                          {student.studentId}
                        </td>
                        <td className="border border-gray-200 px-4 py-3 font-medium">
                          {student.name}
                        </td>
                        <td className="border border-gray-200 px-4 py-3 text-center">
                          {scoreData.isFinalized ? (
                            <span className="font-medium text-green-600">
                              {scoreData.score}
                              <CheckCircle className="w-4 h-4 inline ml-1" />
                            </span>
                          ) : (
                            <Input
                              type="number"
                              min="0"
                              max="30"
                              value={scoreData.score}
                              onChange={(e) => handleScoreChange(student.id, parseInt(e.target.value) || 0)}
                              className="w-20 text-center"
                            />
                          )}
                        </td>
                        <td className="border border-gray-200 px-4 py-3 text-center">
                          <Badge variant={percentage >= 75 ? 'default' : percentage >= 60 ? 'secondary' : 'destructive'}>
                            {percentage}%
                          </Badge>
                        </td>
                        <td className="border border-gray-200 px-4 py-3 text-center">
                          <Badge className={`${gradeInfo.bgColor} ${gradeInfo.color} border-0`}>
                            {gradeInfo.grade}
                          </Badge>
                        </td>
                        <td className="border border-gray-200 px-4 py-3 text-center">
                          {scoreData.isFinalized ? (
                            <Badge className="bg-green-100 text-green-800 border-0">
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Published
                            </Badge>
                          ) : (
                            <Badge variant="outline">
                              <Edit className="w-4 h-4 mr-1" />
                              Draft
                            </Badge>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {Object.values(midtermScores).some(s => s.isFinalized) && (
              <div className="mt-4 p-4 bg-green-50 rounded-lg flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-green-800">
                  Midterm marks have been published on {publishDate}
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
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Select Section for Midterm Marks</h3>
              <p className="text-gray-500">Choose a section and configure exam details to begin entering midterm marks</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
