import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import {
  Plus,
  Calendar,
  Users,
  Edit,
  Trash2,
  Save,
  Download,
  FileText,
  Clock,
  Award,
  BookOpen,
  Presentation,
  ClipboardList,
  CheckCircle,
  AlertCircle
} from 'lucide-react'

interface AssessmentItem {
  id: string
  type: 'class-test' | 'quiz' | 'presentation' | 'assignment'
  title: string
  description: string
  courseCode: string
  section: string
  totalMarks: number
  publishDate: string
  dueDate?: string
  status: 'draft' | 'published' | 'completed'
  studentsSubmitted?: number
  totalStudents?: number
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

const mockAssessments: AssessmentItem[] = [
  {
    id: '1',
    type: 'class-test',
    title: 'Mid-Module Test 1',
    description: 'Test covering SQL basics and database design',
    courseCode: 'CSE401',
    section: 'A',
    totalMarks: 20,
    publishDate: '2024-01-15',
    dueDate: '2024-01-15',
    status: 'completed',
    studentsSubmitted: 40,
    totalStudents: 42
  },
  {
    id: '2',
    type: 'quiz',
    title: 'Quick Quiz on Normalization',
    description: 'Short quiz on database normalization forms',
    courseCode: 'CSE401',
    section: 'A',
    totalMarks: 10,
    publishDate: '2024-01-20',
    dueDate: '2024-01-20',
    status: 'published',
    studentsSubmitted: 35,
    totalStudents: 42
  },
  {
    id: '3',
    type: 'assignment',
    title: 'Database Design Project',
    description: 'Design and implement a complete database system',
    courseCode: 'CSE401',
    section: 'B',
    totalMarks: 25,
    publishDate: '2024-01-10',
    dueDate: '2024-01-30',
    status: 'published',
    studentsSubmitted: 28,
    totalStudents: 38
  },
  {
    id: '4',
    type: 'presentation',
    title: 'Data Structure Analysis',
    description: 'Present analysis of different data structures',
    courseCode: 'CSE303',
    section: 'A',
    totalMarks: 15,
    publishDate: '2024-01-25',
    dueDate: '2024-02-05',
    status: 'draft',
    totalStudents: 40
  }
]

function CreateAssessment({ onClose, onSave }: { onClose: () => void; onSave: (assessment: Partial<AssessmentItem>) => void }) {
  const [formData, setFormData] = useState<Partial<AssessmentItem>>({
    type: 'class-test',
    status: 'draft',
    publishDate: new Date().toISOString().split('T')[0]
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
    onClose()
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'class-test': return <FileText className="w-4 h-4" />
      case 'quiz': return <ClipboardList className="w-4 h-4" />
      case 'presentation': return <Presentation className="w-4 h-4" />
      case 'assignment': return <BookOpen className="w-4 h-4" />
      default: return <FileText className="w-4 h-4" />
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Plus className="w-5 h-5" />
          <span>Create New Assessment</span>
        </CardTitle>
        <CardDescription>Add a new class test, quiz, presentation, or assignment</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Assessment Type</Label>
              <Select 
                value={formData.type} 
                onValueChange={(value: 'class-test' | 'quiz' | 'presentation' | 'assignment') => 
                  setFormData(prev => ({ ...prev, type: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="class-test">
                    <div className="flex items-center space-x-2">
                      <FileText className="w-4 h-4" />
                      <span>Class Test</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="quiz">
                    <div className="flex items-center space-x-2">
                      <ClipboardList className="w-4 h-4" />
                      <span>Quiz</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="presentation">
                    <div className="flex items-center space-x-2">
                      <Presentation className="w-4 h-4" />
                      <span>Presentation</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="assignment">
                    <div className="flex items-center space-x-2">
                      <BookOpen className="w-4 h-4" />
                      <span>Assignment</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="section">Section</Label>
              <Select 
                value={formData.courseCode && formData.section ? `${formData.courseCode}-${formData.section}` : ''} 
                onValueChange={(value) => {
                  const [courseCode, section] = value.split('-')
                  setFormData(prev => ({ ...prev, courseCode, section }))
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select section" />
                </SelectTrigger>
                <SelectContent>
                  {sections.map(section => (
                    <SelectItem key={section.id} value={`${section.courseCode}-${section.sectionName}`}>
                      {section.courseCode} - Section {section.sectionName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Enter assessment title"
              value={formData.title || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter assessment description"
              value={formData.description || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="totalMarks">Total Marks</Label>
              <Input
                id="totalMarks"
                type="number"
                min="1"
                placeholder="e.g., 20"
                value={formData.totalMarks || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, totalMarks: parseInt(e.target.value) }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="publishDate">Publish Date</Label>
              <Input
                id="publishDate"
                type="date"
                value={formData.publishDate || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, publishDate: e.target.value }))}
                required
              />
            </div>

            {(formData.type === 'assignment' || formData.type === 'presentation') && (
              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={formData.dueDate || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                />
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="outline" onClick={() => setFormData(prev => ({ ...prev, status: 'draft' }))}>
              Save as Draft
            </Button>
            <Button type="submit" onClick={() => setFormData(prev => ({ ...prev, status: 'published' }))}>
              Publish
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

function AssessmentsList({ assessments, onEdit, onDelete }: { 
  assessments: AssessmentItem[];
  onEdit: (assessment: AssessmentItem) => void;
  onDelete: (id: string) => void;
}) {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'class-test': return <FileText className="w-4 h-4 text-blue-600" />
      case 'quiz': return <ClipboardList className="w-4 h-4 text-green-600" />
      case 'presentation': return <Presentation className="w-4 h-4 text-purple-600" />
      case 'assignment': return <BookOpen className="w-4 h-4 text-orange-600" />
      default: return <FileText className="w-4 h-4" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft': return <Badge variant="secondary">Draft</Badge>
      case 'published': return <Badge variant="default">Published</Badge>
      case 'completed': return <Badge variant="outline" className="text-green-600 border-green-600">Completed</Badge>
      default: return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getProgressInfo = (assessment: AssessmentItem) => {
    if (assessment.status === 'completed' && assessment.studentsSubmitted && assessment.totalStudents) {
      const percentage = Math.round((assessment.studentsSubmitted / assessment.totalStudents) * 100)
      return `${assessment.studentsSubmitted}/${assessment.totalStudents} (${percentage}%)`
    }
    if (assessment.status === 'published' && assessment.studentsSubmitted && assessment.totalStudents) {
      const percentage = Math.round((assessment.studentsSubmitted / assessment.totalStudents) * 100)
      return `${assessment.studentsSubmitted}/${assessment.totalStudents} submitted (${percentage}%)`
    }
    return assessment.totalStudents ? `${assessment.totalStudents} students` : '-'
  }

  return (
    <div className="space-y-4">
      {assessments.map(assessment => (
        <Card key={assessment.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  {getTypeIcon(assessment.type)}
                  <h3 className="font-semibold text-lg">{assessment.title}</h3>
                  {getStatusBadge(assessment.status)}
                </div>
                
                <p className="text-gray-600 mb-3">{assessment.description}</p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <BookOpen className="w-4 h-4 text-gray-500" />
                    <span>{assessment.courseCode} - {assessment.section}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Award className="w-4 h-4 text-gray-500" />
                    <span>{assessment.totalMarks} marks</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span>{new Date(assessment.publishDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-gray-500" />
                    <span>{getProgressInfo(assessment)}</span>
                  </div>
                </div>

                {assessment.dueDate && (
                  <div className="mt-2 flex items-center space-x-2 text-sm">
                    <Clock className="w-4 h-4 text-yellow-600" />
                    <span className="text-yellow-600">Due: {new Date(assessment.dueDate).toLocaleDateString()}</span>
                  </div>
                )}
              </div>

              <div className="flex space-x-2 ml-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(assessment)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDelete(assessment.id)}
                  className="text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                >
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default function ContinuousAssessment() {
  const [assessments, setAssessments] = useState<AssessmentItem[]>(mockAssessments)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [selectedType, setSelectedType] = useState<string>('all')
  const [selectedSection, setSelectedSection] = useState<string>('all')

  const handleCreateAssessment = (newAssessment: Partial<AssessmentItem>) => {
    const assessment: AssessmentItem = {
      id: Date.now().toString(),
      type: newAssessment.type!,
      title: newAssessment.title!,
      description: newAssessment.description || '',
      courseCode: newAssessment.courseCode!,
      section: newAssessment.section!,
      totalMarks: newAssessment.totalMarks!,
      publishDate: newAssessment.publishDate!,
      dueDate: newAssessment.dueDate,
      status: newAssessment.status!,
      totalStudents: sections.find(s => s.courseCode === newAssessment.courseCode && s.sectionName === newAssessment.section)?.totalStudents
    }
    
    setAssessments(prev => [assessment, ...prev])
  }

  const handleEditAssessment = (assessment: AssessmentItem) => {
    // TODO: Implement edit functionality
    alert(`Edit functionality for ${assessment.title} coming soon!`)
  }

  const handleDeleteAssessment = (id: string) => {
    if (confirm('Are you sure you want to delete this assessment?')) {
      setAssessments(prev => prev.filter(a => a.id !== id))
    }
  }

  const filteredAssessments = assessments.filter(assessment => {
    const typeMatch = selectedType === 'all' || assessment.type === selectedType
    const sectionMatch = selectedSection === 'all' || `${assessment.courseCode}-${assessment.section}` === selectedSection
    return typeMatch && sectionMatch
  })

  const getAssessmentStats = () => {
    const total = assessments.length
    const published = assessments.filter(a => a.status === 'published').length
    const completed = assessments.filter(a => a.status === 'completed').length
    const drafts = assessments.filter(a => a.status === 'draft').length
    
    return { total, published, completed, drafts }
  }

  const stats = getAssessmentStats()

  if (showCreateForm) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-deep-plum">Create Assessment</h1>
            <p className="text-gray-600 mt-1">Add a new continuous assessment item</p>
          </div>
        </div>
        <CreateAssessment 
          onClose={() => setShowCreateForm(false)}
          onSave={handleCreateAssessment}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-deep-plum">Continuous Assessment</h1>
          <p className="text-gray-600 mt-1">Manage class tests, quizzes, presentations, and assignments</p>
        </div>
        <Button onClick={() => setShowCreateForm(true)} className="flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Create Assessment</span>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Assessments</p>
                <p className="text-2xl font-bold text-deep-plum">{stats.total}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Published</p>
                <p className="text-2xl font-bold text-green-600">{stats.published}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-purple-600">{stats.completed}</p>
              </div>
              <Award className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Drafts</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.drafts}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <Label htmlFor="type-filter">Type:</Label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="class-test">Class Tests</SelectItem>
                  <SelectItem value="quiz">Quizzes</SelectItem>
                  <SelectItem value="presentation">Presentations</SelectItem>
                  <SelectItem value="assignment">Assignments</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Label htmlFor="section-filter">Section:</Label>
              <Select value={selectedSection} onValueChange={setSelectedSection}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sections</SelectItem>
                  {sections.map(section => (
                    <SelectItem key={section.id} value={`${section.courseCode}-${section.sectionName}`}>
                      {section.courseCode} - Section {section.sectionName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Assessments List */}
      <Card>
        <CardHeader>
          <CardTitle>Assessment Items</CardTitle>
          <CardDescription>
            {filteredAssessments.length} assessment(s) found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredAssessments.length > 0 ? (
            <AssessmentsList 
              assessments={filteredAssessments}
              onEdit={handleEditAssessment}
              onDelete={handleDeleteAssessment}
            />
          ) : (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Assessments Found</h3>
              <p className="text-gray-500 mb-4">Create your first assessment to get started</p>
              <Button onClick={() => setShowCreateForm(true)} className="flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>Create Assessment</span>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
