import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
  User,
  BookOpen,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react'

// Mock current semester courses with sections and teachers
const availableCourses = [
  { courseSection: 'CSE2301A', courseName: 'Database Management Systems', teacher: 'Dr. Abdul Rahman' },
  { courseSection: 'CSE2315B', courseName: 'Software Engineering', teacher: 'Prof. Ahmed Hassan' },
  { courseSection: 'CSE2345A', courseName: 'Computer Networks', teacher: 'Dr. Khalid Khan' },
  { courseSection: 'ENG2201C', courseName: 'Technical Writing', teacher: 'Ms. Fatima Ahmed' },
  { courseSection: 'MATH2203A', courseName: 'Statistics & Probability', teacher: 'Dr. Mohammad Islam' }
]

// TER evaluation categories and questions
const evaluationData = [
  {
    category: 'Subject Matter Knowledge',
    questions: [
      'Teacher demonstrates comprehensive knowledge of the subject',
      'Provides accurate and up-to-date information',
      'Explains concepts clearly and thoroughly'
    ]
  },
  {
    category: 'Presentation and Management',
    questions: [
      'Uses effective teaching methods and techniques',
      'Manages classroom time efficiently',
      'Maintains good classroom discipline'
    ]
  },
  {
    category: 'Student Engagement',
    questions: [
      'Motivates students with relevant examples',
      'Encourages student participation and questions',
      'Shows concern for student learning progress'
    ]
  },
  {
    category: 'Course Organization',
    questions: [
      'Provides clear lesson plans and objectives',
      'Gives timely feedback on assignments',
      'Makes course materials easily accessible'
    ]
  }
]

const responseOptions = [
  { value: '5', label: 'Strongly Agree' },
  { value: '4', label: 'Agree' },
  { value: '3', label: 'Neutral' },
  { value: '2', label: 'Disagree' },
  { value: '1', label: 'Strongly Disagree' }
]

interface TERFormProps {}

export const TERForm = ({}: TERFormProps) => {
  const [selectedCourse, setSelectedCourse] = useState('')
  const [assignedTeacher, setAssignedTeacher] = useState('')
  const [responses, setResponses] = useState<{[key: string]: string}>({})
  const [comments, setComments] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [submittedCourse, setSubmittedCourse] = useState('')

  const handleCourseChange = (courseSection: string) => {
    setSelectedCourse(courseSection)
    const course = availableCourses.find(c => c.courseSection === courseSection)
    setAssignedTeacher(course?.teacher || '')
    setResponses({}) // Reset responses when course changes
  }

  const handleResponseChange = (questionKey: string, value: string) => {
    setResponses(prev => ({
      ...prev,
      [questionKey]: value
    }))
  }

  const handleSubmit = () => {
    // Validate all questions are answered
    const totalQuestions = evaluationData.reduce((sum, category) => sum + category.questions.length, 0)
    const answeredQuestions = Object.keys(responses).length

    if (answeredQuestions !== totalQuestions) {
      alert('Please answer all questions before submitting.')
      return
    }

    if (!selectedCourse) {
      alert('Please select a course.')
      return
    }

    // Submit TER
    setSubmittedCourse(selectedCourse)
    setSubmitted(true)
    
    // Reset form after showing success message
    setTimeout(() => {
      setSelectedCourse('')
      setAssignedTeacher('')
      setResponses({})
      setComments('')
      setSubmitted(false)
      setSubmittedCourse('')
    }, 3000)
  }

  const isDeadlinePassed = false // This would be calculated based on admin-set deadline

  if (submitted) {
    return (
      <div className="space-y-6">
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="text-center">
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-green-800 mb-2">TER Submitted Successfully!</h3>
              <p className="text-green-700">
                TER filled up successfully for <strong>{submittedCourse}</strong>.
              </p>
              <p className="text-sm text-green-600 mt-2">
                Thank you for your feedback. This window will close automatically.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-deep-plum">TER Fill Up - Fall 2025</h1>
        <Badge className="bg-blue-100 text-blue-800">
          <FileText className="w-4 h-4 mr-1" />
          Teacher Evaluation
        </Badge>
      </div>

      {isDeadlinePassed ? (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-red-800 mb-2">TER Submission Deadline Passed</h3>
              <p className="text-red-700">
                The deadline for TER submission has passed. Please contact the academic office for assistance.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Course Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Course Selection</CardTitle>
              <CardDescription>Select the course you want to evaluate</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="course">Select Course and Section</Label>
                  <Select value={selectedCourse} onValueChange={handleCourseChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select course and section" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableCourses.map((course) => (
                        <SelectItem key={course.courseSection} value={course.courseSection}>
                          {course.courseSection} - {course.courseName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="teacher">Assigned Teacher</Label>
                  <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                    <User className="w-5 h-5 text-gray-600" />
                    <span className="font-medium text-gray-800">
                      {assignedTeacher || 'Please select a course first'}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Evaluation Form */}
          {selectedCourse && (
            <Card>
              <CardHeader>
                <CardTitle>Teacher Evaluation Form</CardTitle>
                <CardDescription>
                  Please evaluate your teacher based on the following criteria
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {evaluationData.map((category, categoryIndex) => (
                    <div key={categoryIndex} className="space-y-4">
                      <h3 className="text-lg font-semibold text-deep-plum border-b pb-2">
                        {category.category}
                      </h3>
                      
                      <div className="space-y-4">
                        {category.questions.map((question, questionIndex) => {
                          const questionKey = `${categoryIndex}-${questionIndex}`
                          const serialNumber = 
                            evaluationData.slice(0, categoryIndex).reduce((sum, cat) => sum + cat.questions.length, 0) + 
                            questionIndex + 1

                          return (
                            <div key={questionKey} className="bg-gray-50 p-4 rounded-lg">
                              <div className="flex items-start space-x-4">
                                <div className="w-8 h-8 bg-deep-plum text-white rounded-full flex items-center justify-center text-sm font-bold">
                                  {serialNumber}
                                </div>
                                <div className="flex-1">
                                  <p className="font-medium text-gray-800 mb-3">{question}</p>
                                  <Select 
                                    value={responses[questionKey] || ''} 
                                    onValueChange={(value) => handleResponseChange(questionKey, value)}
                                  >
                                    <SelectTrigger className="w-full">
                                      <SelectValue placeholder="Select your response" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {responseOptions.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                          {option.label}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                  
                  {/* Comments Section */}
                  <div className="space-y-4 pt-6 border-t">
                    <h3 className="text-lg font-semibold text-deep-plum">Additional Comments</h3>
                    <div className="space-y-2">
                      <Label htmlFor="comments">What did you like and dislike about this teacher?</Label>
                      <Textarea
                        id="comments"
                        placeholder="Please share your thoughts about the teacher's performance, teaching methods, and areas for improvement..."
                        value={comments}
                        onChange={(e) => setComments(e.target.value)}
                        rows={4}
                        className="w-full"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-center pt-6">
                    <Button 
                      onClick={handleSubmit}
                      className="nu-button-primary px-8 py-3 text-lg"
                      disabled={Object.keys(responses).length === 0}
                    >
                      <FileText className="w-5 h-5 mr-2" />
                      Submit TER
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Instructions */}
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="pt-6">
              <div className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-blue-800 mb-2">Important Instructions:</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• TER submission is mandatory for all enrolled courses</li>
                    <li>• Please evaluate your teacher honestly and constructively</li>
                    <li>• All responses are confidential and anonymous</li>
                    <li>• You must complete the evaluation before the deadline</li>
                    <li>• Once submitted, you cannot modify your responses</li>
                    <li>• Your feedback helps improve the quality of education</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
