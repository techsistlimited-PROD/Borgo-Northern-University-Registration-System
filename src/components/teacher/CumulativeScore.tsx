import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
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
  BookOpen
} from 'lucide-react'

interface Student {
  id: string
  studentId: string
  name: string
  email: string
}

interface AssessmentScore {
  studentId: string
  assessmentId: string
  score: number
  maxScore: number
}

interface CumulativeScoreEntry {
  studentId: string
  totalAssessmentMarks: number
  maxAssessmentMarks: number
  calculatedScore: number
  finalScore: number
  publishDate?: string
  isFinalized: boolean
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

// Mock assessment scores
const assessmentScores: AssessmentScore[] = [
  // CSE401 Section A students' scores
  { studentId: '2021-1-60-001', assessmentId: '1', score: 18, maxScore: 20 }, // Class test
  { studentId: '2021-1-60-001', assessmentId: '2', score: 8, maxScore: 10 },  // Quiz
  { studentId: '2021-1-60-001', assessmentId: '3', score: 20, maxScore: 25 }, // Assignment
  
  { studentId: '2021-1-60-002', assessmentId: '1', score: 15, maxScore: 20 },
  { studentId: '2021-1-60-002', assessmentId: '2', score: 9, maxScore: 10 },
  { studentId: '2021-1-60-002', assessmentId: '3', score: 22, maxScore: 25 },
  
  { studentId: '2021-1-60-003', assessmentId: '1', score: 16, maxScore: 20 },
  { studentId: '2021-1-60-003', assessmentId: '2', score: 7, maxScore: 10 },
  { studentId: '2021-1-60-003', assessmentId: '3', score: 18, maxScore: 25 },
  
  { studentId: '2021-1-60-004', assessmentId: '1', score: 19, maxScore: 20 },
  { studentId: '2021-1-60-004', assessmentId: '2', score: 10, maxScore: 10 },
  { studentId: '2021-1-60-004', assessmentId: '3', score: 23, maxScore: 25 },
  
  { studentId: '2021-1-60-005', assessmentId: '1', score: 14, maxScore: 20 },
  { studentId: '2021-1-60-005', assessmentId: '2', score: 6, maxScore: 10 },
  { studentId: '2021-1-60-005', assessmentId: '3', score: 16, maxScore: 25 }
]

export default function CumulativeScore() {
  const [selectedSection, setSelectedSection] = useState<string>('')
  const [publishDate, setPublishDate] = useState<string>(new Date().toISOString().split('T')[0])
  const [cumulativeScores, setCumulativeScores] = useState<Record<string, CumulativeScoreEntry>>({})
  const [isCalculating, setIsCalculating] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const selectedSectionData = sections.find(section => section.id === selectedSection)
  const students = selectedSection ? studentsData[selectedSection] || [] : []

  const calculateStudentScore = (studentId: string): { total: number; max: number; percentage: number; calculatedScore: number } => {
    const studentScores = assessmentScores.filter(score => score.studentId === studentId)
    const total = studentScores.reduce((sum, score) => sum + score.score, 0)
    const max = studentScores.reduce((sum, score) => sum + score.maxScore, 0)
    const percentage = max > 0 ? (total / max) * 100 : 0
    const calculatedScore = Math.round((percentage * 30) / 100)
    
    return { total, max, percentage, calculatedScore }
  }

  const handleCalculateScores = async () => {
    if (!selectedSection) {
      alert('Please select a section first')
      return
    }

    setIsCalculating(true)
    
    try {
      // Simulate calculation delay
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const newScores: Record<string, CumulativeScoreEntry> = {}
      
      students.forEach(student => {
        const { total, max, calculatedScore } = calculateStudentScore(student.studentId)
        newScores[student.id] = {
          studentId: student.studentId,
          totalAssessmentMarks: total,
          maxAssessmentMarks: max,
          calculatedScore,
          finalScore: calculatedScore,
          isFinalized: false
        }
      })
      
      setCumulativeScores(newScores)
    } catch (error) {
      alert('Error calculating scores. Please try again.')
    } finally {
      setIsCalculating(false)
    }
  }

  const handleScoreChange = (studentId: string, newScore: number) => {
    if (newScore < 0 || newScore > 30) return
    
    setCumulativeScores(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        finalScore: newScore
      }
    }))
  }

  const handleSaveScores = async () => {
    if (!selectedSection || Object.keys(cumulativeScores).length === 0) {
      alert('Please calculate scores first')
      return
    }

    setIsSaving(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mark all scores as finalized
      setCumulativeScores(prev => {
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
      
      alert('Cumulative scores saved successfully!')
    } catch (error) {
      alert('Error saving scores. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDownloadReport = () => {
    alert('Cumulative score report downloaded successfully!')
  }

  const getScoreStatus = (score: number) => {
    if (score >= 27) return { status: 'Excellent', color: 'text-green-600', bgColor: 'bg-green-100' }
    if (score >= 24) return { status: 'Very Good', color: 'text-blue-600', bgColor: 'bg-blue-100' }
    if (score >= 21) return { status: 'Good', color: 'text-yellow-600', bgColor: 'bg-yellow-100' }
    if (score >= 18) return { status: 'Satisfactory', color: 'text-orange-600', bgColor: 'bg-orange-100' }
    return { status: 'Needs Improvement', color: 'text-red-600', bgColor: 'bg-red-100' }
  }

  const getStats = () => {
    const scores = Object.values(cumulativeScores)
    if (scores.length === 0) return { average: 0, highest: 0, lowest: 0, passCount: 0 }
    
    const finalScores = scores.map(s => s.finalScore)
    const average = finalScores.reduce((sum, score) => sum + score, 0) / finalScores.length
    const highest = Math.max(...finalScores)
    const lowest = Math.min(...finalScores)
    const passCount = finalScores.filter(score => score >= 18).length
    
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
          <h1 className="text-3xl font-bold text-deep-plum">Cumulative Score</h1>
          <p className="text-gray-600 mt-1">Convert continuous assessment marks to final score (out of 30)</p>
        </div>
        {Object.keys(cumulativeScores).length > 0 && (
          <Button onClick={handleDownloadReport} variant="outline" className="flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Download Report</span>
          </Button>
        )}
      </div>

      {/* Section Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5" />
            <span>Section & Date Selection</span>
          </CardTitle>
          <CardDescription>Select the section and publish date for cumulative score entry</CardDescription>
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
                onClick={handleCalculateScores} 
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
                    <span>Calculate Scores</span>
                  </>
                )}
              </Button>
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
                    Section {selectedSectionData.sectionName} • {selectedSectionData.totalStudents} students
                  </p>
                </div>
                <Badge variant="outline">
                  <Users className="w-4 h-4 mr-1" />
                  Continuous Assessment
                </Badge>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Statistics */}
      {Object.keys(cumulativeScores).length > 0 && (
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

      {/* Score Entry Table */}
      {Object.keys(cumulativeScores).length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="w-5 h-5" />
                  <span>Cumulative Score Entry</span>
                </CardTitle>
                <CardDescription>
                  Review calculated scores and make adjustments if needed (Max: 30 marks)
                </CardDescription>
              </div>
              
              <Button 
                onClick={handleSaveScores}
                disabled={isSaving || Object.values(cumulativeScores).some(s => s.isFinalized)}
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
                    <th className="border border-gray-200 px-4 py-3 text-center font-medium">Assessment Total</th>
                    <th className="border border-gray-200 px-4 py-3 text-center font-medium">Percentage</th>
                    <th className="border border-gray-200 px-4 py-3 text-center font-medium">Calculated Score</th>
                    <th className="border border-gray-200 px-4 py-3 text-center font-medium">Final Score (30)</th>
                    <th className="border border-gray-200 px-4 py-3 text-center font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => {
                    const scoreData = cumulativeScores[student.id]
                    if (!scoreData) return null
                    
                    const percentage = scoreData.maxAssessmentMarks > 0 
                      ? Math.round((scoreData.totalAssessmentMarks / scoreData.maxAssessmentMarks) * 100)
                      : 0
                    const statusInfo = getScoreStatus(scoreData.finalScore)
                    
                    return (
                      <tr key={student.id} className="hover:bg-gray-50">
                        <td className="border border-gray-200 px-4 py-3 font-mono">
                          {student.studentId}
                        </td>
                        <td className="border border-gray-200 px-4 py-3 font-medium">
                          {student.name}
                        </td>
                        <td className="border border-gray-200 px-4 py-3 text-center">
                          {scoreData.totalAssessmentMarks}/{scoreData.maxAssessmentMarks}
                        </td>
                        <td className="border border-gray-200 px-4 py-3 text-center">
                          <Badge variant={percentage >= 75 ? 'default' : percentage >= 60 ? 'secondary' : 'destructive'}>
                            {percentage}%
                          </Badge>
                        </td>
                        <td className="border border-gray-200 px-4 py-3 text-center font-medium">
                          {scoreData.calculatedScore}
                        </td>
                        <td className="border border-gray-200 px-4 py-3 text-center">
                          {scoreData.isFinalized ? (
                            <span className="font-medium text-green-600">
                              {scoreData.finalScore}
                              <CheckCircle className="w-4 h-4 inline ml-1" />
                            </span>
                          ) : (
                            <div className="flex items-center justify-center space-x-2">
                              <Input
                                type="number"
                                min="0"
                                max="30"
                                value={scoreData.finalScore}
                                onChange={(e) => handleScoreChange(student.id, parseInt(e.target.value) || 0)}
                                className="w-20 text-center"
                              />
                              {scoreData.finalScore !== scoreData.calculatedScore && (
                                <AlertTriangle className="w-4 h-4 text-yellow-600" />
                              )}
                            </div>
                          )}
                        </td>
                        <td className="border border-gray-200 px-4 py-3 text-center">
                          <Badge className={`${statusInfo.bgColor} ${statusInfo.color} border-0`}>
                            {statusInfo.status}
                          </Badge>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {Object.values(cumulativeScores).some(s => s.isFinalized) && (
              <div className="mt-4 p-4 bg-green-50 rounded-lg flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-green-800">
                  Scores have been finalized and published on {publishDate}
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
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Select Section to Calculate Scores</h3>
              <p className="text-gray-500">Choose a section from the dropdown above to begin calculating cumulative scores</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
