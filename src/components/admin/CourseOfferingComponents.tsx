import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
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
  Plus,
  Edit,
  Trash2,
  Save,
  Users,
  AlertCircle,
  Search,
  Info
} from 'lucide-react'

export const Syllabuses = () => {
  const syllabusData = {
    'CSE': {
      semesters: 12, // Tri-semester (back to original)
      type: 'Tri-semester',
      courses: [
        { semester: 1, courses: ['CSE101 - Programming Fundamentals', 'MAT101 - Calculus I', 'PHY101 - Physics I', 'ENG101 - English I', 'CSE102 - Programming Lab'] },
        { semester: 2, courses: ['CSE201 - Data Structures', 'MAT201 - Calculus II', 'PHY201 - Physics II', 'ENG201 - English II', 'CSE202 - Data Structures Lab'] },
        { semester: 3, courses: ['CSE301 - Algorithms', 'MAT301 - Linear Algebra', 'CSE302 - Database Systems', 'CSE303 - Computer Organization', 'CSE304 - Database Lab'] },
        { semester: 4, courses: ['CSE401 - Software Engineering', 'CSE402 - Computer Networks', 'CSE403 - Operating Systems', 'EEE201 - Digital Logic Design'] },
        { semester: 5, courses: ['CSE501 - Artificial Intelligence', 'CSE502 - Machine Learning', 'CSE503 - Web Technologies', 'CSE504 - Mobile App Development'] },
        { semester: 6, courses: ['CSE601 - Computer Graphics', 'CSE602 - Cyber Security', 'CSE603 - Cloud Computing', 'CSE604 - Data Mining'] },
        { semester: 7, courses: ['CSE701 - Distributed Systems', 'CSE702 - Blockchain Technology', 'CSE703 - IoT Systems', 'CSE704 - Big Data Analytics'] },
        { semester: 8, courses: ['CSE801 - Advanced Algorithms', 'CSE802 - Computer Vision', 'CSE803 - Natural Language Processing', 'CSE804 - Robotics'] },
        { semester: 9, courses: ['CSE901 - Project Work I', 'CSE902 - Research Methodology', 'CSE903 - Ethics in Computing', 'CSE904 - Entrepreneurship'] },
        { semester: 10, courses: ['CSE1001 - Project Work II', 'CSE1002 - Industry Internship', 'CSE1003 - Advanced Topics in AI', 'CSE1004 - Thesis Writing'] },
        { semester: 11, courses: ['CSE1101 - Capstone Project I', 'CSE1102 - Seminar & Presentation', 'CSE1103 - Advanced Database Systems', 'CSE1104 - Software Architecture'] },
        { semester: 12, courses: ['CSE1201 - Capstone Project II', 'CSE1202 - Professional Practice', 'CSE1203 - Advanced Web Technologies', 'CSE1204 - Final Thesis Defense'] }
      ]
    },
    'BBA': {
      semesters: 8, // Bi-semester (back to original)
      type: 'Bi-semester',
      courses: [
        { semester: 1, courses: ['BBA101 - Principles of Management', 'ECO101 - Microeconomics', 'ACC101 - Financial Accounting', 'ENG101 - Business English', 'MAT101 - Business Mathematics'] },
        { semester: 2, courses: ['BBA201 - Organizational Behavior', 'ECO201 - Macroeconomics', 'ACC201 - Management Accounting', 'MKT201 - Principles of Marketing', 'FIN201 - Corporate Finance'] },
        { semester: 3, courses: ['BBA301 - Strategic Management', 'BBA302 - Human Resource Management', 'BBA303 - Operations Management', 'BBA304 - Business Research Methods'] },
        { semester: 4, courses: ['BBA401 - International Business', 'BBA402 - E-Commerce', 'BBA403 - Supply Chain Management', 'BBA404 - Business Ethics'] },
        { semester: 5, courses: ['BBA501 - Leadership & Change Management', 'BBA502 - Digital Marketing', 'BBA503 - Investment Analysis', 'BBA504 - Project Management'] },
        { semester: 6, courses: ['BBA601 - Business Analytics', 'BBA602 - Entrepreneurship', 'BBA603 - Risk Management', 'BBA604 - Corporate Governance'] },
        { semester: 7, courses: ['BBA701 - Internship Program', 'BBA702 - Business Simulation', 'BBA703 - Advanced Strategic Management', 'BBA704 - Capstone Project I'] },
        { semester: 8, courses: ['BBA801 - Final Project Defense', 'BBA802 - Professional Development', 'BBA803 - Global Business Environment', 'BBA804 - Business Consulting'] }
      ]
    }
  }

  const [selectedType, setSelectedType] = useState('all')
  const [selectedProgram, setSelectedProgram] = useState('all')
  const [syllabusState, setSyllabusState] = useState(syllabusData)

  const handleAddCourse = (program: string, semester: number) => {
    const courseCode = prompt('Enter course code (e.g., CSE305):')
    const courseName = prompt('Enter course name (e.g., Computer Networks):')

    if (courseCode && courseName) {
      const newCourse = `${courseCode} - ${courseName}`
      setSyllabusState(prev => ({
        ...prev,
        [program]: {
          ...prev[program as keyof typeof prev],
          courses: prev[program as keyof typeof prev].courses.map(sem =>
            sem.semester === semester
              ? { ...sem, courses: [...sem.courses, newCourse] }
              : sem
          )
        }
      }))
      alert(`Course "${newCourse}" added to ${program} Semester ${semester}`)
    }
  }

  const handleEditCourse = (program: string, semester: number, courseIndex: number, currentCourse: string) => {
    const [currentCode, ...currentNameParts] = currentCourse.split(' - ')
    const currentName = currentNameParts.join(' - ')

    const newCode = prompt('Enter course code:', currentCode)
    const newName = prompt('Enter course name:', currentName)

    if (newCode && newName) {
      const updatedCourse = `${newCode} - ${newName}`
      setSyllabusState(prev => ({
        ...prev,
        [program]: {
          ...prev[program as keyof typeof prev],
          courses: prev[program as keyof typeof prev].courses.map(sem =>
            sem.semester === semester
              ? {
                  ...sem,
                  courses: sem.courses.map((course, index) =>
                    index === courseIndex ? updatedCourse : course
                  )
                }
              : sem
          )
        }
      }))
      alert(`Course updated to "${updatedCourse}"`)
    }
  }

  const handleDeleteCourse = (program: string, semester: number, courseIndex: number) => {
    if (confirm('Are you sure you want to delete this course?')) {
      setSyllabusState(prev => ({
        ...prev,
        [program]: {
          ...prev[program as keyof typeof prev],
          courses: prev[program as keyof typeof prev].courses.map(sem =>
            sem.semester === semester
              ? {
                  ...sem,
                  courses: sem.courses.filter((_, index) => index !== courseIndex)
                }
              : sem
          )
        }
      }))
      alert('Course deleted successfully')
    }
  }
  
  const programs = [
    'CSE (Computer Science & Engineering)',
    'BBA (Bachelor of Business Administration)',
    'EEE (Electrical and Electronic Engineering)',
    'MBA (Master of Business Administration)',
    'Common (Common Foundation Courses)'
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-deep-plum">Syllabuses Management</h1>
        <Button className="nu-button-primary flex items-center space-x-2">
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </Button>
      </div>
      
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Syllabus Filters</CardTitle>
          <CardDescription>Select program to view and edit syllabus</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Program Type</Label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="undergraduate">Undergraduate</SelectItem>
                  <SelectItem value="postgraduate">Postgraduate</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Program</Label>
              <Select value={selectedProgram} onValueChange={setSelectedProgram}>
                <SelectTrigger>
                  <SelectValue placeholder="Select program" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Programs</SelectItem>
                  {programs.map((program) => (
                    <SelectItem key={program} value={program.split(' ')[0]}>{program}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Syllabus Display */}
      {selectedProgram && selectedProgram !== 'all' && syllabusState[selectedProgram as keyof typeof syllabusState] && (
        <Card>
          <CardHeader>
            <CardTitle>
              {selectedProgram} Syllabus - {syllabusState[selectedProgram as keyof typeof syllabusState].type}
            </CardTitle>
            <CardDescription>
              {syllabusState[selectedProgram as keyof typeof syllabusState].semesters} semesters total
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {syllabusState[selectedProgram as keyof typeof syllabusState].courses.map((semesterData, index) => (
                <Card key={index}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Semester {semesterData.semester}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {semesterData.courses.map((course, courseIndex) => (
                        <div key={courseIndex} className="flex justify-between items-center p-2 bg-lavender-bg rounded">
                          <span className="text-sm flex-1 mr-2">{course}</span>
                          <div className="flex space-x-1">
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-6 w-6 p-0"
                              onClick={() => handleEditCourse(selectedProgram, semesterData.semester, courseIndex, course)}
                            >
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                              onClick={() => handleDeleteCourse(selectedProgram, semesterData.semester, courseIndex)}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full mt-2"
                        onClick={() => handleAddCourse(selectedProgram, semesterData.semester)}
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        Add Course
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Show All Programs Overview when 'all' is selected */}
      {selectedProgram === 'all' && (
        <div className="space-y-6">
          {Object.entries(syllabusState).map(([programKey, programData]) => (
            <Card key={programKey}>
              <CardHeader>
                <CardTitle>
                  {programKey} Program - {programData.type}
                </CardTitle>
                <CardDescription>
                  {programData.semesters} semesters total • {programData.courses.reduce((total, sem) => total + sem.courses.length, 0)} courses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {programData.courses.map((semesterData, index) => (
                    <Card key={index} className="bg-gray-50">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">Semester {semesterData.semester}</CardTitle>
                        <Badge variant="outline">{semesterData.courses.length} courses</Badge>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-1">
                          {semesterData.courses.slice(0, 3).map((course, courseIndex) => (
                            <div key={courseIndex} className="text-xs text-gray-600 p-1 bg-white rounded">
                              {course}
                            </div>
                          ))}
                          {semesterData.courses.length > 3 && (
                            <div className="text-xs text-gray-500 italic">
                              +{semesterData.courses.length - 3} more courses...
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export const OfferCourses = () => {
  const [mode, setMode] = useState('single') // 'single' or 'bulk'
  const [selectedCourse, setSelectedCourse] = useState('')
  const [selectedSection, setSelectedSection] = useState('')
  const [teacherEmployeeId, setTeacherEmployeeId] = useState('')
  const [sectionCapacity, setSectionCapacity] = useState('')
  const [bulkStudentRange, setBulkStudentRange] = useState({ from: '', to: '' })

  // Filter states
  const [filterProgramType, setFilterProgramType] = useState('all')
  const [filterProgram, setFilterProgram] = useState('all')
  const [filterSemester, setFilterSemester] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  // Student assignment states
  const [showStudentModal, setShowStudentModal] = useState(false)
  const [currentSectionForStudents, setCurrentSectionForStudents] = useState('')
  const [newStudentId, setNewStudentId] = useState('')
  const [bulkStudentFrom, setBulkStudentFrom] = useState('')
  const [bulkStudentTo, setBulkStudentTo] = useState('')
  const [studentAssignmentMode, setStudentAssignmentMode] = useState('single') // 'single' or 'bulk'

  // Sample student data for sections
  const [sectionStudents, setSectionStudents] = useState<{[key: string]: string[]}>({
    'A': [
      '2024-1-60-001', '2024-1-60-002', '2024-1-60-003', '2024-1-60-004', '2024-1-60-005',
      '2024-1-60-006', '2024-1-60-007', '2024-1-60-008', '2024-1-60-009', '2024-1-60-010',
      '2024-1-60-011', '2024-1-60-012', '2024-1-60-013', '2024-1-60-014', '2024-1-60-015',
      '2024-1-60-016', '2024-1-60-017', '2024-1-60-018', '2024-1-60-019', '2024-1-60-020',
      '2024-1-60-021', '2024-1-60-022', '2024-1-60-023', '2024-1-60-024', '2024-1-60-025',
      '2024-1-60-026', '2024-1-60-027', '2024-1-60-028', '2024-1-60-029', '2024-1-60-030',
      '2024-1-60-031', '2024-1-60-032', '2024-1-60-033', '2024-1-60-034', '2024-1-60-035',
      '2024-1-60-036', '2024-1-60-037', '2024-1-60-038', '2024-1-60-039', '2024-1-60-040',
      '2024-1-60-041', '2024-1-60-042', '2024-1-60-043', '2024-1-60-044', '2024-1-60-045',
      '2024-1-60-046', '2024-1-60-047', '2024-1-60-048', '2024-1-60-049', '2024-1-60-050'
    ],
    'B': [
      '2024-1-60-051', '2024-1-60-052', '2024-1-60-053', '2024-1-60-054', '2024-1-60-055',
      '2024-1-60-056', '2024-1-60-057', '2024-1-60-058', '2024-1-60-059', '2024-1-60-060',
      '2024-1-60-061', '2024-1-60-062', '2024-1-60-063', '2024-1-60-064', '2024-1-60-065',
      '2024-1-60-066', '2024-1-60-067', '2024-1-60-068', '2024-1-60-069', '2024-1-60-070',
      '2024-1-60-071', '2024-1-60-072', '2024-1-60-073', '2024-1-60-074', '2024-1-60-075',
      '2024-1-60-076', '2024-1-60-077', '2024-1-60-078', '2024-1-60-079', '2024-1-60-080',
      '2024-1-60-081', '2024-1-60-082', '2024-1-60-083', '2024-1-60-084', '2024-1-60-085',
      '2024-1-60-086', '2024-1-60-087', '2024-1-60-088', '2024-1-60-089', '2024-1-60-090',
      '2024-1-60-091', '2024-1-60-092', '2024-1-60-093', '2024-1-60-094', '2024-1-60-095',
      '2024-1-60-096', '2024-1-60-097', '2024-1-60-098'
    ],
    'C': [
      '2024-1-60-101', '2024-1-60-102', '2024-1-60-103', '2024-1-60-104', '2024-1-60-105',
      '2024-1-60-106', '2024-1-60-107', '2024-1-60-108', '2024-1-60-109', '2024-1-60-110',
      '2024-1-60-111', '2024-1-60-112', '2024-1-60-113', '2024-1-60-114', '2024-1-60-115',
      '2024-1-60-116', '2024-1-60-117', '2024-1-60-118', '2024-1-60-119', '2024-1-60-120',
      '2024-1-60-121', '2024-1-60-122', '2024-1-60-123', '2024-1-60-124', '2024-1-60-125',
      '2024-1-60-126', '2024-1-60-127', '2024-1-60-128', '2024-1-60-129', '2024-1-60-130'
    ]
  })

  const allCourses = [
    // CSE Courses
    { code: 'CSE101', title: 'Programming Fundamentals', capacity: '320/350', credits: 3, program: 'CSE', semester: 1, type: 'undergraduate' },
    { code: 'CSE102', title: 'Programming Lab', capacity: '300/320', credits: 1, program: 'CSE', semester: 1, type: 'undergraduate' },
    { code: 'CSE201', title: 'Data Structures', capacity: '280/300', credits: 3, program: 'CSE', semester: 2, type: 'undergraduate' },
    { code: 'CSE202', title: 'Data Structures Lab', capacity: '270/280', credits: 1, program: 'CSE', semester: 2, type: 'undergraduate' },
    { code: 'CSE301', title: 'Algorithms', capacity: '240/280', credits: 3, program: 'CSE', semester: 3, type: 'undergraduate' },
    { code: 'CSE302', title: 'Database Systems', capacity: '220/250', credits: 3, program: 'CSE', semester: 3, type: 'undergraduate' },
    { code: 'CSE303', title: 'Computer Organization', capacity: '200/230', credits: 3, program: 'CSE', semester: 3, type: 'undergraduate' },
    { code: 'CSE304', title: 'Database Lab', capacity: '210/240', credits: 1, program: 'CSE', semester: 3, type: 'undergraduate' },
    { code: 'CSE401', title: 'Software Engineering', capacity: '310/350', credits: 3, program: 'CSE', semester: 4, type: 'undergraduate' },
    { code: 'CSE402', title: 'Computer Networks', capacity: '290/320', credits: 3, program: 'CSE', semester: 4, type: 'undergraduate' },
    { code: 'CSE403', title: 'Operating Systems', capacity: '260/300', credits: 3, program: 'CSE', semester: 4, type: 'undergraduate' },
    { code: 'CSE404', title: 'Software Engineering Lab', capacity: '280/300', credits: 1, program: 'CSE', semester: 4, type: 'undergraduate' },
    { code: 'CSE501', title: 'Artificial Intelligence', capacity: '180/200', credits: 3, program: 'CSE', semester: 5, type: 'undergraduate' },
    { code: 'CSE502', title: 'Machine Learning', capacity: '160/180', credits: 3, program: 'CSE', semester: 5, type: 'undergraduate' },
    { code: 'CSE503', title: 'Web Technologies', capacity: '200/220', credits: 3, program: 'CSE', semester: 5, type: 'undergraduate' },
    { code: 'CSE504', title: 'Mobile App Development', capacity: '150/170', credits: 3, program: 'CSE', semester: 5, type: 'undergraduate' },
    { code: 'CSE601', title: 'Computer Graphics', capacity: '120/140', credits: 3, program: 'CSE', semester: 6, type: 'undergraduate' },
    { code: 'CSE602', title: 'Cyber Security', capacity: '140/160', credits: 3, program: 'CSE', semester: 6, type: 'undergraduate' },
    { code: 'CSE603', title: 'Cloud Computing', capacity: '110/130', credits: 3, program: 'CSE', semester: 6, type: 'undergraduate' },
    { code: 'CSE604', title: 'Data Mining', capacity: '100/120', credits: 3, program: 'CSE', semester: 6, type: 'undergraduate' },
    { code: 'CSE701', title: 'Distributed Systems', capacity: '90/110', credits: 3, program: 'CSE', semester: 7, type: 'undergraduate' },
    { code: 'CSE702', title: 'Blockchain Technology', capacity: '80/100', credits: 3, program: 'CSE', semester: 7, type: 'undergraduate' },
    { code: 'CSE703', title: 'IoT Systems', capacity: '85/105', credits: 3, program: 'CSE', semester: 7, type: 'undergraduate' },
    { code: 'CSE704', title: 'Big Data Analytics', capacity: '95/115', credits: 3, program: 'CSE', semester: 7, type: 'undergraduate' },
    { code: 'CSE801', title: 'Advanced Algorithms', capacity: '70/90', credits: 3, program: 'CSE', semester: 8, type: 'undergraduate' },
    { code: 'CSE802', title: 'Computer Vision', capacity: '65/85', credits: 3, program: 'CSE', semester: 8, type: 'undergraduate' },
    { code: 'CSE803', title: 'Natural Language Processing', capacity: '60/80', credits: 3, program: 'CSE', semester: 8, type: 'undergraduate' },
    { code: 'CSE804', title: 'Robotics', capacity: '55/75', credits: 3, program: 'CSE', semester: 8, type: 'undergraduate' },

    // BBA Courses
    { code: 'BBA101', title: 'Principles of Management', capacity: '180/200', credits: 3, program: 'BBA', semester: 1, type: 'undergraduate' },
    { code: 'BBA102', title: 'Business English', capacity: '190/210', credits: 3, program: 'BBA', semester: 1, type: 'undergraduate' },
    { code: 'BBA201', title: 'Organizational Behavior', capacity: '170/190', credits: 3, program: 'BBA', semester: 2, type: 'undergraduate' },
    { code: 'BBA202', title: 'Principles of Marketing', capacity: '160/180', credits: 3, program: 'BBA', semester: 2, type: 'undergraduate' },
    { code: 'BBA301', title: 'Strategic Management', capacity: '140/160', credits: 3, program: 'BBA', semester: 3, type: 'undergraduate' },
    { code: 'BBA302', title: 'Human Resource Management', capacity: '150/170', credits: 3, program: 'BBA', semester: 3, type: 'undergraduate' },
    { code: 'BBA303', title: 'Operations Management', capacity: '135/155', credits: 3, program: 'BBA', semester: 3, type: 'undergraduate' },
    { code: 'BBA401', title: 'International Business', capacity: '120/140', credits: 3, program: 'BBA', semester: 4, type: 'undergraduate' },
    { code: 'BBA402', title: 'E-Commerce', capacity: '110/130', credits: 3, program: 'BBA', semester: 4, type: 'undergraduate' },
    { code: 'BBA403', title: 'Supply Chain Management', capacity: '105/125', credits: 3, program: 'BBA', semester: 4, type: 'undergraduate' },
    { code: 'BBA501', title: 'Leadership & Change Management', capacity: '100/120', credits: 3, program: 'BBA', semester: 5, type: 'undergraduate' },
    { code: 'BBA502', title: 'Digital Marketing', capacity: '95/115', credits: 3, program: 'BBA', semester: 5, type: 'undergraduate' },
    { code: 'BBA503', title: 'Investment Analysis', capacity: '90/110', credits: 3, program: 'BBA', semester: 5, type: 'undergraduate' },
    { code: 'BBA601', title: 'Business Analytics', capacity: '85/105', credits: 3, program: 'BBA', semester: 6, type: 'undergraduate' },
    { code: 'BBA602', title: 'Entrepreneurship', capacity: '80/100', credits: 3, program: 'BBA', semester: 6, type: 'undergraduate' },
    { code: 'BBA603', title: 'Risk Management', capacity: '75/95', credits: 3, program: 'BBA', semester: 6, type: 'undergraduate' },

    // EEE Courses
    { code: 'EEE101', title: 'Electrical Circuits I', capacity: '200/220', credits: 3, program: 'EEE', semester: 1, type: 'undergraduate' },
    { code: 'EEE102', title: 'Electrical Circuits Lab I', capacity: '190/210', credits: 1, program: 'EEE', semester: 1, type: 'undergraduate' },
    { code: 'EEE201', title: 'Circuit Analysis', capacity: '180/200', credits: 3, program: 'EEE', semester: 2, type: 'undergraduate' },
    { code: 'EEE202', title: 'Digital Logic Design', capacity: '170/190', credits: 3, program: 'EEE', semester: 2, type: 'undergraduate' },
    { code: 'EEE203', title: 'Circuit Analysis Lab', capacity: '165/185', credits: 1, program: 'EEE', semester: 2, type: 'undergraduate' },
    { code: 'EEE301', title: 'Electronics I', capacity: '160/180', credits: 3, program: 'EEE', semester: 3, type: 'undergraduate' },
    { code: 'EEE302', title: 'Signals and Systems', capacity: '150/170', credits: 3, program: 'EEE', semester: 3, type: 'undergraduate' },
    { code: 'EEE303', title: 'Electronics Lab I', capacity: '145/165', credits: 1, program: 'EEE', semester: 3, type: 'undergraduate' },
    { code: 'EEE401', title: 'Power Systems', capacity: '140/160', credits: 3, program: 'EEE', semester: 4, type: 'undergraduate' },
    { code: 'EEE402', title: 'Control Systems', capacity: '135/155', credits: 3, program: 'EEE', semester: 4, type: 'undergraduate' },
    { code: 'EEE403', title: 'Microprocessors', capacity: '130/150', credits: 3, program: 'EEE', semester: 4, type: 'undergraduate' },
    { code: 'EEE501', title: 'Communications Engineering', capacity: '120/140', credits: 3, program: 'EEE', semester: 5, type: 'undergraduate' },
    { code: 'EEE502', title: 'Embedded Systems', capacity: '115/135', credits: 3, program: 'EEE', semester: 5, type: 'undergraduate' },
    { code: 'EEE503', title: 'Renewable Energy Systems', capacity: '110/130', credits: 3, program: 'EEE', semester: 5, type: 'undergraduate' },

    // MBA Courses (Postgraduate)
    { code: 'MBA701', title: 'Advanced Strategic Management', capacity: '60/80', credits: 3, program: 'MBA', semester: 1, type: 'postgraduate' },
    { code: 'MBA702', title: 'Leadership and Ethics', capacity: '55/75', credits: 3, program: 'MBA', semester: 1, type: 'postgraduate' },
    { code: 'MBA703', title: 'Financial Management', capacity: '65/85', credits: 3, program: 'MBA', semester: 1, type: 'postgraduate' },
    { code: 'MBA801', title: 'Operations Research', capacity: '50/70', credits: 3, program: 'MBA', semester: 2, type: 'postgraduate' },
    { code: 'MBA802', title: 'International Marketing', capacity: '45/65', credits: 3, program: 'MBA', semester: 2, type: 'postgraduate' },
    { code: 'MBA803', title: 'Corporate Finance', capacity: '55/75', credits: 3, program: 'MBA', semester: 2, type: 'postgraduate' },

    // Mathematics Courses
    { code: 'MAT101', title: 'Calculus I', capacity: '300/350', credits: 3, program: 'Common', semester: 1, type: 'undergraduate' },
    { code: 'MAT201', title: 'Calculus II', capacity: '280/320', credits: 3, program: 'Common', semester: 2, type: 'undergraduate' },
    { code: 'MAT301', title: 'Linear Algebra', capacity: '250/280', credits: 3, program: 'Common', semester: 3, type: 'undergraduate' },
    { code: 'MAT401', title: 'Differential Equations', capacity: '200/230', credits: 3, program: 'Common', semester: 4, type: 'undergraduate' },

    // Physics Courses
    { code: 'PHY101', title: 'Physics I', capacity: '280/320', credits: 3, program: 'Common', semester: 1, type: 'undergraduate' },
    { code: 'PHY102', title: 'Physics Lab I', capacity: '270/310', credits: 1, program: 'Common', semester: 1, type: 'undergraduate' },
    { code: 'PHY201', title: 'Physics II', capacity: '260/300', credits: 3, program: 'Common', semester: 2, type: 'undergraduate' },
    { code: 'PHY202', title: 'Physics Lab II', capacity: '250/290', credits: 1, program: 'Common', semester: 2, type: 'undergraduate' },

    // English Courses
    { code: 'ENG101', title: 'English I', capacity: '350/400', credits: 3, program: 'Common', semester: 1, type: 'undergraduate' },
    { code: 'ENG201', title: 'English II', capacity: '330/380', credits: 3, program: 'Common', semester: 2, type: 'undergraduate' },
    { code: 'ENG301', title: 'Technical Writing', capacity: '200/250', credits: 3, program: 'Common', semester: 3, type: 'undergraduate' },

    // Economics Courses
    { code: 'ECO101', title: 'Microeconomics', capacity: '200/240', credits: 3, program: 'Common', semester: 1, type: 'undergraduate' },
    { code: 'ECO201', title: 'Macroeconomics', capacity: '190/230', credits: 3, program: 'Common', semester: 2, type: 'undergraduate' },

    // Accounting Courses
    { code: 'ACC101', title: 'Financial Accounting', capacity: '180/220', credits: 3, program: 'Common', semester: 1, type: 'undergraduate' },
    { code: 'ACC201', title: 'Management Accounting', capacity: '170/210', credits: 3, program: 'Common', semester: 2, type: 'undergraduate' },
  ]

  const sections = [
    { id: 'A', capacity: 45, enrolled: 50, maxCapacity: 50, status: 'Full', teacher: 'Dr. Rahman Ahmed', teacherId: 'T001', schedule: 'Sun, Tue 10:00-11:30', room: 'Room 301', offered: true, offerStatus: 'Offered' },
    { id: 'B', capacity: 50, enrolled: 48, maxCapacity: 50, status: 'Available', teacher: 'Prof. Sarah Khan', teacherId: 'T002', schedule: 'Mon, Wed 14:00-15:30', room: 'Room 302', offered: true, offerStatus: 'Offered' },
    { id: 'C', capacity: 50, enrolled: 30, maxCapacity: 50, status: 'Available', teacher: '', teacherId: '', schedule: '', room: '', offered: false, offerStatus: 'Pending' },
  ]

  // Update section enrolled count based on actual student assignments
  const getUpdatedSections = () => {
    return sections.map(section => ({
      ...section,
      enrolled: sectionStudents[section.id]?.length || 0,
      status: (sectionStudents[section.id]?.length || 0) >= section.maxCapacity ? 'Full' : 'Available'
    }))
  }

  // Filter courses based on selected filters and search term
  const filteredCourses = allCourses.filter(course => {
    const matchesProgramType = filterProgramType === 'all' || course.type === filterProgramType
    const matchesProgram = filterProgram === 'all' || course.program === filterProgram
    const matchesSemester = filterSemester === 'all' || course.semester.toString() === filterSemester
    const matchesSearch = !searchTerm ||
      course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.program.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesProgramType && matchesProgram && matchesSemester && matchesSearch
  })

  const teachers = [
    { id: 'T001', name: 'Dr. Rahman Ahmed', department: 'CSE', email: 'rahman.ahmed@nu.edu.bd' },
    { id: 'T002', name: 'Prof. Sarah Khan', department: 'CSE', email: 'sarah.khan@nu.edu.bd' },
    { id: 'T003', name: 'Dr. Mohammad Ali', department: 'CSE', email: 'mohammad.ali@nu.edu.bd' },
    { id: 'T004', name: 'Dr. Fatima Rahman', department: 'BBA', email: 'fatima.rahman@nu.edu.bd' },
    { id: 'T005', name: 'Prof. Ahmed Hassan', department: 'EEE', email: 'ahmed.hassan@nu.edu.bd' },
    { id: 'T006', name: 'Dr. Nasir Uddin', department: 'EEE', email: 'nasir.uddin@nu.edu.bd' },
    { id: 'T007', name: 'Prof. Ayesha Begum', department: 'BBA', email: 'ayesha.begum@nu.edu.bd' },
    { id: 'T008', name: 'Dr. Karim Hassan', department: 'CSE', email: 'karim.hassan@nu.edu.bd' },
    { id: 'T009', name: 'Prof. Rashida Khatun', department: 'MBA', email: 'rashida.khatun@nu.edu.bd' },
    { id: 'T010', name: 'Dr. Mahmud Ali', department: 'EEE', email: 'mahmud.ali@nu.edu.bd' },
  ]

  const handleAssignTeacher = () => {
    if (!selectedCourse || !selectedSection || !teacherEmployeeId) {
      alert('Please select course, section, and teacher')
      return
    }
    alert(`Teacher ${teacherEmployeeId} assigned to ${selectedCourse} Section ${selectedSection}`)
  }

  const handleBulkAssignment = () => {
    if (!selectedCourse || !selectedSection || !bulkStudentRange.from || !bulkStudentRange.to) {
      alert('Please fill all required fields for bulk assignment')
      return
    }

    const fromId = parseInt(bulkStudentRange.from.split('-').pop() || '0')
    const toId = parseInt(bulkStudentRange.to.split('-').pop() || '0')
    const studentCount = toId - fromId + 1

    const section = sections.find(s => s.id === selectedSection)
    if (section && (section.enrolled + studentCount) > section.maxCapacity) {
      alert(`Section capacity exceeded! Available spots: ${section.maxCapacity - section.enrolled}`)
      return
    }

    alert(`${studentCount} students assigned to ${selectedCourse} Section ${selectedSection}`)
  }

  const handleOfferCourseToSection = () => {
    if (!selectedCourse || !selectedSection) {
      alert('Please select both course and section')
      return
    }
    alert(`Course ${selectedCourse} has been offered to Section ${selectedSection}`)
  }

  const handleOfferSection = (sectionId: string) => {
    if (confirm(`Are you sure you want to offer Section ${sectionId}?`)) {
      alert(`Section ${sectionId} has been offered successfully!`)
      // In real implementation, update the section status in the database
    }
  }

  const handleWithdrawOffer = (sectionId: string) => {
    if (confirm(`Are you sure you want to withdraw the offer for Section ${sectionId}?`)) {
      alert(`Offer for Section ${sectionId} has been withdrawn.`)
      // In real implementation, update the section status in the database
    }
  }

  const handleOpenStudentModal = (sectionId: string) => {
    setCurrentSectionForStudents(sectionId)
    setShowStudentModal(true)
    setNewStudentId('')
    setBulkStudentFrom('')
    setBulkStudentTo('')
  }

  const handleAddSingleStudent = () => {
    if (!newStudentId || !currentSectionForStudents) {
      alert('Please enter a student ID')
      return
    }

    const section = getUpdatedSections().find(s => s.id === currentSectionForStudents)
    if (!section) return

    const currentStudents = sectionStudents[currentSectionForStudents] || []

    if (currentStudents.includes(newStudentId)) {
      alert('Student is already assigned to this section')
      return
    }

    if (currentStudents.length >= section.maxCapacity) {
      alert(`Section capacity exceeded! Maximum capacity: ${section.maxCapacity}`)
      return
    }

    setSectionStudents(prev => ({
      ...prev,
      [currentSectionForStudents]: [...currentStudents, newStudentId]
    }))

    setNewStudentId('')
    alert(`Student ${newStudentId} added to Section ${currentSectionForStudents}`)
  }

  const handleAddBulkStudents = () => {
    if (!bulkStudentFrom || !bulkStudentTo || !currentSectionForStudents) {
      alert('Please fill all bulk assignment fields')
      return
    }

    const section = getUpdatedSections().find(s => s.id === currentSectionForStudents)
    if (!section) return

    const currentStudents = sectionStudents[currentSectionForStudents] || []

    // Extract base pattern and numbers from student IDs
    const fromMatch = bulkStudentFrom.match(/^(.+-)(\\d+)$/)
    const toMatch = bulkStudentTo.match(/^(.+-)(\\d+)$/)

    if (!fromMatch || !toMatch) {
      alert('Please use proper student ID format (e.g., 2024-1-60-001)')
      return
    }

    const [, fromBase, fromNum] = fromMatch
    const [, toBase, toNum] = toMatch

    if (fromBase !== toBase) {
      alert('Student ID patterns must match (same prefix)')
      return
    }

    const fromNumber = parseInt(fromNum)
    const toNumber = parseInt(toNum)

    if (fromNumber > toNumber) {
      alert('"From" student ID number must be less than or equal to "To" student ID number')
      return
    }

    const studentsToAdd = []
    for (let i = fromNumber; i <= toNumber; i++) {
      const studentId = `${fromBase}${i.toString().padStart(3, '0')}`
      if (!currentStudents.includes(studentId)) {
        studentsToAdd.push(studentId)
      }
    }

    if (currentStudents.length + studentsToAdd.length > section.maxCapacity) {
      const availableSpots = section.maxCapacity - currentStudents.length
      alert(`Section capacity exceeded! Available spots: ${availableSpots}, trying to add: ${studentsToAdd.length}`)
      return
    }

    setSectionStudents(prev => ({
      ...prev,
      [currentSectionForStudents]: [...currentStudents, ...studentsToAdd]
    }))

    setBulkStudentFrom('')
    setBulkStudentTo('')
    alert(`${studentsToAdd.length} students added to Section ${currentSectionForStudents}`)
  }

  const handleRemoveStudent = (studentId: string) => {
    if (!currentSectionForStudents) return

    if (confirm(`Are you sure you want to remove student ${studentId} from Section ${currentSectionForStudents}?`)) {
      setSectionStudents(prev => ({
        ...prev,
        [currentSectionForStudents]: (prev[currentSectionForStudents] || []).filter(id => id !== studentId)
      }))
      alert(`Student ${studentId} removed from Section ${currentSectionForStudents}`)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-deep-plum">Offer Courses</h1>
          <p className="text-gray-600 mt-1">Assign courses to existing sections and manage teacher assignments</p>
        </div>
        <div className="flex space-x-2">
          <Button
            variant={mode === 'single' ? 'default' : 'outline'}
            onClick={() => setMode('single')}
          >
            Single Entry
          </Button>
          <Button
            variant={mode === 'bulk' ? 'default' : 'outline'}
            onClick={() => setMode('bulk')}
          >
            Bulk Entry
          </Button>
        </div>
      </div>

      {/* Course Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Course Filters & Search</CardTitle>
          <CardDescription>Filter courses by program type, program, semester and search by keywords</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-5 gap-4">
            <div className="space-y-2">
              <Label>Program Type</Label>
              <Select value={filterProgramType} onValueChange={setFilterProgramType}>
                <SelectTrigger>
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="undergraduate">Undergraduate</SelectItem>
                  <SelectItem value="postgraduate">Postgraduate</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Program</Label>
              <Select value={filterProgram} onValueChange={setFilterProgram}>
                <SelectTrigger>
                  <SelectValue placeholder="All Programs" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Programs</SelectItem>
                  <SelectItem value="CSE">CSE</SelectItem>
                  <SelectItem value="BBA">BBA</SelectItem>
                  <SelectItem value="EEE">EEE</SelectItem>
                  <SelectItem value="MBA">MBA</SelectItem>
                  <SelectItem value="Common">Common Courses</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Semester</Label>
              <Select value={filterSemester} onValueChange={setFilterSemester}>
                <SelectTrigger>
                  <SelectValue placeholder="All Semesters" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Semesters</SelectItem>
                  <SelectItem value="1">1st Semester</SelectItem>
                  <SelectItem value="2">2nd Semester</SelectItem>
                  <SelectItem value="3">3rd Semester</SelectItem>
                  <SelectItem value="4">4th Semester</SelectItem>
                  <SelectItem value="5">5th Semester</SelectItem>
                  <SelectItem value="6">6th Semester</SelectItem>
                  <SelectItem value="7">7th Semester</SelectItem>
                  <SelectItem value="8">8th Semester</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Search Courses</Label>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search by code, title..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex items-end">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setFilterProgramType('all')
                  setFilterProgram('all')
                  setFilterSemester('all')
                  setSearchTerm('')
                }}
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Course Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Course Selection & Section Configuration</CardTitle>
          <CardDescription>
            Found {filteredCourses.length} courses. Select a course to manage sections and teacher assignments.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label>Available Courses ({filteredCourses.length})</Label>
              <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                <SelectTrigger>
                  <SelectValue placeholder="Select course from filtered results" />
                </SelectTrigger>
                <SelectContent>
                  {filteredCourses.map((course) => (
                    <SelectItem key={course.code} value={course.code}>
                      {course.code} - {course.title} ({course.credits} credits) - {course.program} Semester {course.semester}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {selectedCourse && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Users className="w-5 h-5 text-blue-600" />
                <span className="font-semibold">Course Information</span>
              </div>
              <div className="grid md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="font-medium">Total Capacity:</p>
                  <p>{filteredCourses.find(c => c.code === selectedCourse)?.capacity} students</p>
                </div>
                <div>
                  <p className="font-medium">Credits:</p>
                  <p>{filteredCourses.find(c => c.code === selectedCourse)?.credits}</p>
                </div>
                <div>
                  <p className="font-medium">Program:</p>
                  <p>{filteredCourses.find(c => c.code === selectedCourse)?.program}</p>
                </div>
                <div>
                  <p className="font-medium">Semester:</p>
                  <p>{filteredCourses.find(c => c.code === selectedCourse)?.semester}</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Section Management */}
      {selectedCourse && (
        <Card>
          <CardHeader>
            <CardTitle>Existing Sections for {selectedCourse}</CardTitle>
            <CardDescription>
              Offer this course to existing sections and manage teacher assignments.
              Need a new section? Create it in <strong>Section Management</strong> first.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {getUpdatedSections().map((section) => (
                <div key={section.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="text-lg font-semibold">Section {section.id}</h4>
                        <Badge variant={section.enrolled >= section.maxCapacity ? 'destructive' : 'default'}>
                          {section.enrolled}/{section.maxCapacity} students
                        </Badge>
                        <Badge variant={section.offered ? 'default' : 'secondary'}>
                          {section.offerStatus}
                        </Badge>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p><span className="font-medium">Teacher:</span> {section.teacher || 'Not assigned'}</p>
                          <p><span className="font-medium">Teacher ID:</span> {section.teacherId || 'N/A'}</p>
                        </div>
                        <div>
                          <p><span className="font-medium">Schedule:</span> {section.schedule || 'Not set'}</p>
                          <p><span className="font-medium">Room:</span> {section.room || 'Not assigned'}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenStudentModal(section.id)}
                        className="flex items-center space-x-1"
                      >
                        <Users className="w-4 h-4" />
                        <span>Assign/Remove Students</span>
                      </Button>
                      {!section.offered ? (
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleOfferSection(section.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Offer Section
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleWithdrawOffer(section.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          Withdraw Offer
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Information Box - Redirect to Section Management */}
              <div className="border-2 border-dashed border-blue-200 bg-blue-50 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Info className="w-6 h-6 text-blue-600 mt-1" />
                  <div>
                    <h4 className="text-lg font-semibold text-blue-800 mb-2">Need to Create a New Section?</h4>
                    <p className="text-blue-700 mb-3">
                      Section creation has been moved to <strong>Section Management</strong> for better organization.
                      Create your section there first, then come back here to assign courses and teachers.
                    </p>
                    <div className="bg-white rounded-lg p-3 border border-blue-200">
                      <p className="text-sm text-blue-600 font-medium">Workflow:</p>
                      <ol className="text-sm text-blue-600 ml-4 mt-1 list-decimal">
                        <li>Go to <strong>Section Management → Create New Section</strong></li>
                        <li>Set up section details (program, capacity, schedule, room)</li>
                        <li>Come back here to assign courses to the section</li>
                        <li>Assign teachers to specific courses</li>
                      </ol>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Course to Section Assignment */}
      {selectedCourse && (
        <Card>
          <CardHeader>
            <CardTitle>Assign Course to Section</CardTitle>
            <CardDescription>Offer the selected course to an existing section and assign a teacher</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>Target Section</Label>
                <Select value={selectedSection} onValueChange={setSelectedSection}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select section" />
                  </SelectTrigger>
                  <SelectContent>
                    {sections.map((section) => (
                      <SelectItem key={section.id} value={section.id}>
                        Section {section.id} ({section.enrolled}/{section.maxCapacity} students)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Assign Teacher</Label>
                <Select value={teacherEmployeeId} onValueChange={setTeacherEmployeeId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select teacher" />
                  </SelectTrigger>
                  <SelectContent>
                    {teachers.map((teacher) => (
                      <SelectItem key={teacher.id} value={teacher.id}>
                        {teacher.id} - {teacher.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button onClick={handleOfferCourseToSection} className="w-full">
                  Offer Course
                </Button>
              </div>

              <div className="flex items-end">
                <Button onClick={handleAssignTeacher} variant="outline" className="w-full">
                  Assign Teacher
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Student Assignment */}
      {selectedCourse && (
        <Card>
          <CardHeader>
            <CardTitle>
              {mode === 'single' ? 'Single Student Assignment' : 'Bulk Student Assignment'}
            </CardTitle>
            <CardDescription>
              Assign students to course sections with capacity enforcement
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {mode === 'single' ? (
                <div className="space-y-4">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Student ID</Label>
                      <Input placeholder="e.g., 2021-1-60-001" />
                      <p className="text-xs text-gray-500">Example: 2021-1-60-001</p>
                    </div>

                    <div className="space-y-2">
                      <Label>Section</Label>
                      <Select value={selectedSection} onValueChange={setSelectedSection}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select section" />
                        </SelectTrigger>
                        <SelectContent>
                          {sections.map((section) => (
                            <SelectItem
                              key={section.id}
                              value={section.id}
                              disabled={section.status === 'Full'}
                            >
                              Section {section.id} - {section.enrolled}/{section.maxCapacity}
                              {section.status === 'Full' && ' (Full)'}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-end">
                      <Button className="w-full">Add Student</Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label>From Student ID</Label>
                      <Input
                        placeholder="e.g., 2021-1-60-001"
                        value={bulkStudentRange.from}
                        onChange={(e) => setBulkStudentRange(prev => ({ ...prev, from: e.target.value }))}
                      />
                      <p className="text-xs text-gray-500">Start: 2021-1-60-001</p>
                    </div>

                    <div className="space-y-2">
                      <Label>To Student ID</Label>
                      <Input
                        placeholder="e.g., 2021-1-60-050"
                        value={bulkStudentRange.to}
                        onChange={(e) => setBulkStudentRange(prev => ({ ...prev, to: e.target.value }))}
                      />
                      <p className="text-xs text-gray-500">End: 2021-1-60-050</p>
                    </div>

                    <div className="space-y-2">
                      <Label>Section</Label>
                      <Select value={selectedSection} onValueChange={setSelectedSection}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select section" />
                        </SelectTrigger>
                        <SelectContent>
                          {sections.map((section) => (
                            <SelectItem key={section.id} value={section.id}>
                              Section {section.id} - {section.enrolled}/{section.maxCapacity}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-end">
                      <Button onClick={handleBulkAssignment} className="w-full">
                        Bulk Assign
                      </Button>
                    </div>
                  </div>

                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start space-x-2">
                    <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-yellow-800">Capacity Check</p>
                      <p className="text-sm text-yellow-700">
                        System will automatically check section capacity and prevent over-enrollment.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Student Assignment Modal */}
      <Dialog open={showStudentModal} onOpenChange={setShowStudentModal}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Manage Students - Section {currentSectionForStudents}</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Section Info */}
            {currentSectionForStudents && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Users className="w-5 h-5 text-blue-600" />
                    <span className="font-semibold">Section {currentSectionForStudents}</span>
                  </div>
                  <Badge variant={getUpdatedSections().find(s => s.id === currentSectionForStudents)?.status === 'Full' ? 'destructive' : 'default'}>
                    {sectionStudents[currentSectionForStudents]?.length || 0} / {getUpdatedSections().find(s => s.id === currentSectionForStudents)?.maxCapacity || 0} students
                  </Badge>
                </div>
              </div>
            )}

            {/* Assignment Mode Toggle */}
            <div className="flex space-x-2">
              <Button
                variant={studentAssignmentMode === 'single' ? 'default' : 'outline'}
                onClick={() => setStudentAssignmentMode('single')}
                size="sm"
              >
                Single Student
              </Button>
              <Button
                variant={studentAssignmentMode === 'bulk' ? 'default' : 'outline'}
                onClick={() => setStudentAssignmentMode('bulk')}
                size="sm"
              >
                Bulk Assignment
              </Button>
            </div>

            {/* Single Student Assignment */}
            {studentAssignmentMode === 'single' && (
              <Card>
                <CardHeader>
                  <CardTitle>Add Single Student</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex space-x-2">
                    <div className="flex-1">
                      <Input
                        placeholder="Enter student ID (e.g., 2024-1-60-001)"
                        value={newStudentId}
                        onChange={(e) => setNewStudentId(e.target.value)}
                      />
                    </div>
                    <Button onClick={handleAddSingleStudent}>
                      <Plus className="w-4 h-4 mr-1" />
                      Add Student
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Bulk Student Assignment */}
            {studentAssignmentMode === 'bulk' && (
              <Card>
                <CardHeader>
                  <CardTitle>Bulk Student Assignment</CardTitle>
                  <CardDescription>Add multiple students using a range of student IDs</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>From Student ID</Label>
                      <Input
                        placeholder="e.g., 2024-1-60-001"
                        value={bulkStudentFrom}
                        onChange={(e) => setBulkStudentFrom(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>To Student ID</Label>
                      <Input
                        placeholder="e.g., 2024-1-60-050"
                        value={bulkStudentTo}
                        onChange={(e) => setBulkStudentTo(e.target.value)}
                      />
                    </div>
                    <div className="flex items-end">
                      <Button onClick={handleAddBulkStudents} className="w-full">
                        <Plus className="w-4 h-4 mr-1" />
                        Add Range
                      </Button>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                      <div className="text-sm">
                        <p className="font-medium text-yellow-800">Bulk Assignment Rules:</p>
                        <ul className="text-yellow-700 mt-1 list-disc ml-4">
                          <li>Student IDs must follow the same pattern (e.g., 2024-1-60-001)</li>
                          <li>System will check section capacity and prevent over-enrollment</li>
                          <li>Duplicate students will be automatically skipped</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Current Students List */}
            <Card>
              <CardHeader>
                <CardTitle>Registered Students ({sectionStudents[currentSectionForStudents]?.length || 0})</CardTitle>
                <CardDescription>Click on a student to remove them from this section</CardDescription>
              </CardHeader>
              <CardContent>
                {sectionStudents[currentSectionForStudents]?.length ? (
                  <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-2 max-h-60 overflow-y-auto">
                    {sectionStudents[currentSectionForStudents].map((studentId) => (
                      <div
                        key={studentId}
                        className="flex items-center justify-between p-2 bg-gray-50 rounded border hover:bg-red-50 cursor-pointer transition-colors"
                        onClick={() => handleRemoveStudent(studentId)}
                      >
                        <span className="text-sm font-mono">{studentId}</span>
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No students assigned to this section yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export const SectionManagement = () => {
  const [activeView, setActiveView] = useState('view') // 'view', 'create', 'edit'
  const [filterProgram, setFilterProgram] = useState('all')
  const [filterCourse, setFilterCourse] = useState('all')
  const [filterTeacher, setFilterTeacher] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [editingSection, setEditingSection] = useState<any>(null)
  const [viewingSection, setViewingSection] = useState<any>(null)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [newSection, setNewSection] = useState({
    year: '',
    program: '',
    semester: '',
    course: '',
    sectionName: '',
    capacity: '',
    teacher: '',
    teacherId: '',
    days: '',
    timeSlot: '',
    room: '',
    status: 'Active'
  })

  const sections = [
    // CSE Sections
    {
      id: 1,
      year: '2024',
      program: 'CSE',
      semester: '1st',
      course: 'CSE101 - Programming Fundamentals',
      sectionName: 'A',
      capacity: 50,
      enrolled: 48,
      teacher: 'Dr. Ahmad Hassan',
      teacherId: 'T001',
      days: 'Sunday & Tuesday',
      timeSlot: '08:00 - 09:30 AM',
      room: 'Room 301',
      status: 'Active'
    },
    {
      id: 2,
      year: '2024',
      program: 'CSE',
      semester: '1st',
      course: 'CSE101 - Programming Fundamentals',
      sectionName: 'B',
      capacity: 50,
      enrolled: 50,
      teacher: 'Prof. Sarah Ahmed',
      teacherId: 'T002',
      days: 'Monday & Wednesday',
      timeSlot: '10:00 - 11:30 AM',
      room: 'Room 302',
      status: 'Full'
    },
    {
      id: 3,
      year: '2024',
      program: 'CSE',
      semester: '2nd',
      course: 'CSE201 - Data Structures',
      sectionName: 'A',
      capacity: 45,
      enrolled: 42,
      teacher: 'Dr. Karim Hassan',
      teacherId: 'T008',
      days: 'Sunday & Tuesday',
      timeSlot: '12:00 - 01:30 PM',
      room: 'Room 303',
      status: 'Active'
    },
    {
      id: 4,
      year: '2024',
      program: 'CSE',
      semester: '4th',
      course: 'CSE401 - Software Engineering',
      sectionName: 'A',
      capacity: 50,
      enrolled: 45,
      teacher: 'Dr. Mohammad Ali',
      teacherId: 'T003',
      days: 'Thursday & Friday',
      timeSlot: '02:00 - 03:30 PM',
      room: 'Room 304',
      status: 'Active'
    },
    {
      id: 5,
      year: '2024',
      program: 'CSE',
      semester: '5th',
      course: 'CSE501 - Artificial Intelligence',
      sectionName: 'A',
      capacity: 40,
      enrolled: 35,
      teacher: 'Prof. Sarah Ahmed',
      teacherId: 'T002',
      days: 'Monday & Wednesday',
      timeSlot: '04:00 - 05:30 PM',
      room: 'Room 305',
      status: 'Active'
    },

    // BBA Sections
    {
      id: 6,
      year: '2024',
      program: 'BBA',
      semester: '1st',
      course: 'BBA101 - Principles of Management',
      sectionName: 'A',
      capacity: 45,
      enrolled: 40,
      teacher: 'Dr. Fatima Rahman',
      teacherId: 'T004',
      days: 'Sunday & Tuesday',
      timeSlot: '08:00 - 09:30 AM',
      room: 'Room 201',
      status: 'Active'
    },
    {
      id: 7,
      year: '2024',
      program: 'BBA',
      semester: '1st',
      course: 'BBA101 - Principles of Management',
      sectionName: 'B',
      capacity: 45,
      enrolled: 43,
      teacher: 'Prof. Ayesha Begum',
      teacherId: 'T007',
      days: 'Monday & Wednesday',
      timeSlot: '10:00 - 11:30 AM',
      room: 'Room 202',
      status: 'Active'
    },
    {
      id: 8,
      year: '2024',
      program: 'BBA',
      semester: '3rd',
      course: 'BBA301 - Strategic Management',
      sectionName: 'A',
      capacity: 40,
      enrolled: 35,
      teacher: 'Prof. Rashida Khatun',
      teacherId: 'T009',
      days: 'Thursday & Friday',
      timeSlot: '12:00 - 01:30 PM',
      room: 'Room 203',
      status: 'Active'
    },
    {
      id: 9,
      year: '2024',
      program: 'BBA',
      semester: '5th',
      course: 'BBA501 - Leadership & Change Management',
      sectionName: 'A',
      capacity: 35,
      enrolled: 30,
      teacher: 'Dr. Fatima Rahman',
      teacherId: 'T004',
      days: 'Sunday & Tuesday',
      timeSlot: '02:00 - 03:30 PM',
      room: 'Room 204',
      status: 'Active'
    },

    // EEE Sections
    {
      id: 10,
      year: '2024',
      program: 'EEE',
      semester: '1st',
      course: 'EEE101 - Electrical Circuits I',
      sectionName: 'A',
      capacity: 45,
      enrolled: 42,
      teacher: 'Prof. Ahmed Hassan',
      teacherId: 'T005',
      days: 'Sunday & Tuesday',
      timeSlot: '08:00 - 09:30 AM',
      room: 'Room 401',
      status: 'Active'
    },
    {
      id: 11,
      year: '2024',
      program: 'EEE',
      semester: '2nd',
      course: 'EEE201 - Circuit Analysis',
      sectionName: 'A',
      capacity: 45,
      enrolled: 38,
      teacher: 'Dr. Nasir Uddin',
      teacherId: 'T006',
      days: 'Monday & Wednesday',
      timeSlot: '10:00 - 11:30 AM',
      room: 'Room 402',
      status: 'Active'
    },
    {
      id: 12,
      year: '2024',
      program: 'EEE',
      semester: '4th',
      course: 'EEE401 - Power Systems',
      sectionName: 'A',
      capacity: 40,
      enrolled: 35,
      teacher: 'Dr. Mahmud Ali',
      teacherId: 'T010',
      days: 'Thursday & Friday',
      timeSlot: '12:00 - 01:30 PM',
      room: 'Room 403',
      status: 'Active'
    },

    // MBA Sections
    {
      id: 13,
      year: '2024',
      program: 'MBA',
      semester: '1st',
      course: 'MBA701 - Advanced Strategic Management',
      sectionName: 'A',
      capacity: 30,
      enrolled: 25,
      teacher: 'Prof. Rashida Khatun',
      teacherId: 'T009',
      days: 'Saturday & Sunday',
      timeSlot: '09:00 - 10:30 AM',
      room: 'Room 501',
      status: 'Active'
    },
    {
      id: 14,
      year: '2024',
      program: 'MBA',
      semester: '2nd',
      course: 'MBA801 - Operations Research',
      sectionName: 'A',
      capacity: 30,
      enrolled: 22,
      teacher: 'Prof. Ayesha Begum',
      teacherId: 'T007',
      days: 'Saturday & Sunday',
      timeSlot: '11:00 - 12:30 PM',
      room: 'Room 502',
      status: 'Active'
    },

    // Common Course Sections
    {
      id: 15,
      year: '2024',
      program: 'Common',
      semester: '1st',
      course: 'MAT101 - Calculus I',
      sectionName: 'A',
      capacity: 60,
      enrolled: 55,
      teacher: 'Dr. Mohammad Ali',
      teacherId: 'T003',
      days: 'Sunday & Tuesday',
      timeSlot: '10:00 - 11:30 AM',
      room: 'Room 101',
      status: 'Active'
    },
    {
      id: 16,
      year: '2024',
      program: 'Common',
      semester: '1st',
      course: 'ENG101 - English I',
      sectionName: 'A',
      capacity: 50,
      enrolled: 47,
      teacher: 'Dr. Ahmad Hassan',
      teacherId: 'T001',
      days: 'Monday & Wednesday',
      timeSlot: '08:00 - 09:30 AM',
      room: 'Room 102',
      status: 'Active'
    },
    {
      id: 17,
      year: '2024',
      program: 'Common',
      semester: '1st',
      course: 'PHY101 - Physics I',
      sectionName: 'B',
      capacity: 50,
      enrolled: 50,
      teacher: 'Dr. Karim Hassan',
      teacherId: 'T008',
      days: 'Thursday & Friday',
      timeSlot: '02:00 - 03:30 PM',
      room: 'Room 103',
      status: 'Full'
    }
  ]

  const teachers = [
    { id: 'T001', name: 'Dr. Ahmad Hassan', department: 'CSE' },
    { id: 'T002', name: 'Prof. Sarah Ahmed', department: 'CSE' },
    { id: 'T003', name: 'Dr. Mohammad Ali', department: 'CSE' },
    { id: 'T004', name: 'Dr. Fatima Rahman', department: 'BBA' },
    { id: 'T005', name: 'Prof. Ahmed Hassan', department: 'EEE' },
  ]

  const courses = [
    // CSE Courses
    { code: 'CSE101', title: 'Programming Fundamentals', program: 'CSE' },
    { code: 'CSE201', title: 'Data Structures', program: 'CSE' },
    { code: 'CSE301', title: 'Algorithms', program: 'CSE' },
    { code: 'CSE302', title: 'Database Systems', program: 'CSE' },
    { code: 'CSE401', title: 'Software Engineering', program: 'CSE' },
    { code: 'CSE402', title: 'Computer Networks', program: 'CSE' },
    { code: 'CSE403', title: 'Operating Systems', program: 'CSE' },
    { code: 'CSE501', title: 'Artificial Intelligence', program: 'CSE' },
    { code: 'CSE502', title: 'Machine Learning', program: 'CSE' },
    { code: 'CSE503', title: 'Web Technologies', program: 'CSE' },
    { code: 'CSE601', title: 'Computer Graphics', program: 'CSE' },
    { code: 'CSE602', title: 'Cyber Security', program: 'CSE' },
    { code: 'CSE701', title: 'Distributed Systems', program: 'CSE' },
    { code: 'CSE801', title: 'Advanced Algorithms', program: 'CSE' },

    // BBA Courses
    { code: 'BBA101', title: 'Principles of Management', program: 'BBA' },
    { code: 'BBA201', title: 'Organizational Behavior', program: 'BBA' },
    { code: 'BBA301', title: 'Strategic Management', program: 'BBA' },
    { code: 'BBA302', title: 'Human Resource Management', program: 'BBA' },
    { code: 'BBA401', title: 'International Business', program: 'BBA' },
    { code: 'BBA402', title: 'E-Commerce', program: 'BBA' },
    { code: 'BBA501', title: 'Leadership & Change Management', program: 'BBA' },
    { code: 'BBA502', title: 'Digital Marketing', program: 'BBA' },
    { code: 'BBA601', title: 'Business Analytics', program: 'BBA' },
    { code: 'BBA602', title: 'Entrepreneurship', program: 'BBA' },

    // EEE Courses
    { code: 'EEE101', title: 'Electrical Circuits I', program: 'EEE' },
    { code: 'EEE201', title: 'Circuit Analysis', program: 'EEE' },
    { code: 'EEE202', title: 'Digital Logic Design', program: 'EEE' },
    { code: 'EEE301', title: 'Electronics I', program: 'EEE' },
    { code: 'EEE302', title: 'Signals and Systems', program: 'EEE' },
    { code: 'EEE401', title: 'Power Systems', program: 'EEE' },
    { code: 'EEE402', title: 'Control Systems', program: 'EEE' },
    { code: 'EEE403', title: 'Microprocessors', program: 'EEE' },
    { code: 'EEE501', title: 'Communications Engineering', program: 'EEE' },
    { code: 'EEE502', title: 'Embedded Systems', program: 'EEE' },

    // MBA Courses
    { code: 'MBA701', title: 'Advanced Strategic Management', program: 'MBA' },
    { code: 'MBA702', title: 'Leadership and Ethics', program: 'MBA' },
    { code: 'MBA703', title: 'Financial Management', program: 'MBA' },
    { code: 'MBA801', title: 'Operations Research', program: 'MBA' },
    { code: 'MBA802', title: 'International Marketing', program: 'MBA' },
    { code: 'MBA803', title: 'Corporate Finance', program: 'MBA' },

    // Common Courses
    { code: 'MAT101', title: 'Calculus I', program: 'Common' },
    { code: 'MAT201', title: 'Calculus II', program: 'Common' },
    { code: 'MAT301', title: 'Linear Algebra', program: 'Common' },
    { code: 'PHY101', title: 'Physics I', program: 'Common' },
    { code: 'PHY201', title: 'Physics II', program: 'Common' },
    { code: 'ENG101', title: 'English I', program: 'Common' },
    { code: 'ENG201', title: 'English II', program: 'Common' },
    { code: 'ECO101', title: 'Microeconomics', program: 'Common' },
    { code: 'ECO201', title: 'Macroeconomics', program: 'Common' },
    { code: 'ACC101', title: 'Financial Accounting', program: 'Common' },
    { code: 'ACC201', title: 'Management Accounting', program: 'Common' },
  ]

  const filteredSections = sections.filter(section => {
    const matchesProgram = filterProgram === 'all' || section.program === filterProgram
    const matchesCourse = filterCourse === 'all' || section.course.includes(filterCourse)
    const matchesTeacher = filterTeacher === 'all' || section.teacherId === filterTeacher
    const matchesSearch = !searchTerm ||
      section.sectionName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      section.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
      section.teacher.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesProgram && matchesCourse && matchesTeacher && matchesSearch
  })

  const handleDeleteSection = (sectionId: number) => {
    if (confirm('Are you sure you want to delete this section? This action cannot be undone.')) {
      alert(`Section ${sectionId} deleted successfully!`)
    }
  }

  const handleViewSection = (section: any) => {
    setViewingSection(section)
    setShowViewModal(true)
  }

  const handleEditSection = (section: any) => {
    setEditingSection(section)
    setShowEditModal(true)
  }

  const handleUpdateSection = () => {
    if (editingSection) {
      alert(`Section ${editingSection.sectionName} updated successfully!`)
      setShowEditModal(false)
      setEditingSection(null)
    }
  }

  const handleCreateSection = () => {
    if (!newSection.year || !newSection.program || !newSection.semester || !newSection.sectionName || !newSection.capacity) {
      alert('Please fill all required fields')
      return
    }

    alert(`New section ${newSection.sectionName} created successfully for ${newSection.program}!`)
    setNewSection({
      year: '',
      program: '',
      semester: '',
      course: '',
      sectionName: '',
      capacity: '',
      teacher: '',
      teacherId: '',
      days: '',
      timeSlot: '',
      room: '',
      status: 'Active'
    })
    setActiveView('view')
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-deep-plum">Section Management</h1>
          <p className="text-gray-600 mt-1">Create and manage course sections</p>
        </div>
        <div className="flex space-x-2">
          <Button
            variant={activeView === 'view' ? 'default' : 'outline'}
            onClick={() => setActiveView('view')}
          >
            View All Sections
          </Button>
          <Button
            variant={activeView === 'create' ? 'default' : 'outline'}
            onClick={() => setActiveView('create')}
            className="flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Section</span>
          </Button>
        </div>
      </div>

      {activeView === 'view' && (
        <>
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Section Filters</CardTitle>
              <CardDescription>Filter and search sections</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-5 gap-4">
                <div className="space-y-2">
                  <Label>Program</Label>
                  <Select value={filterProgram} onValueChange={setFilterProgram}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Programs" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Programs</SelectItem>
                      <SelectItem value="CSE">CSE</SelectItem>
                      <SelectItem value="BBA">BBA</SelectItem>
                      <SelectItem value="EEE">EEE</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Course</Label>
                  <Select value={filterCourse} onValueChange={setFilterCourse}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Courses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Courses</SelectItem>
                      {courses.map((course) => (
                        <SelectItem key={course.code} value={course.code}>
                          {course.code} - {course.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Teacher</Label>
                  <Select value={filterTeacher} onValueChange={setFilterTeacher}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Teachers" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Teachers</SelectItem>
                      {teachers.map((teacher) => (
                        <SelectItem key={teacher.id} value={teacher.id}>
                          {teacher.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Search</Label>
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                      placeholder="Search sections..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="flex items-end">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setFilterProgram('all')
                      setFilterCourse('all')
                      setFilterTeacher('all')
                      setSearchTerm('')
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sections Table */}
          <Card>
            <CardHeader>
              <CardTitle>All Sections ({filteredSections.length})</CardTitle>
              <CardDescription>Manage course sections and their details</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Year</TableHead>
                    <TableHead>Program</TableHead>
                    <TableHead>Course</TableHead>
                    <TableHead>Section</TableHead>
                    <TableHead>Capacity</TableHead>
                    <TableHead>Teacher</TableHead>
                    <TableHead>Schedule</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSections.map((section) => (
                    <TableRow key={section.id}>
                      <TableCell>{section.year}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{section.program}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{section.course}</div>
                        <div className="text-sm text-gray-500">{section.semester} Semester</div>
                      </TableCell>
                      <TableCell>
                        <span className="font-semibold text-lg">{section.sectionName}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <span className={section.enrolled === section.capacity ? 'text-red-600 font-medium' : 'text-green-600'}>
                            {section.enrolled}/{section.capacity}
                          </span>
                          <Badge variant={section.status === 'Full' ? 'destructive' : 'default'}>
                            {section.status}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{section.teacher}</div>
                          <div className="text-sm text-gray-500">ID: {section.teacherId}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium">{section.days}</div>
                          <div className="text-gray-500">{section.timeSlot}</div>
                          <div className="text-gray-500">{section.room}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={section.status === 'Active' ? 'default' : section.status === 'Full' ? 'destructive' : 'secondary'}>
                          {section.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewSection(section)}
                            title="View Section Details"
                          >
                            <Users className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditSection(section)}
                            title="Edit Section"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteSection(section.id)}
                            className="text-red-600 hover:text-red-700"
                            title="Delete Section"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {filteredSections.length === 0 && (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">No Sections Found</h3>
                  <p className="text-gray-500">No sections match your current filter criteria</p>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}

      {activeView === 'create' && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Section</CardTitle>
            <CardDescription>Set up section details first, then assign courses and teachers from Course Offering menu</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Basic Section Information */}
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h3 className="font-medium text-blue-800 mb-3">Step 1: Basic Section Setup</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Academic Year *</Label>
                    <Select value={newSection.year} onValueChange={(value) => setNewSection({...newSection, year: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select year" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2024">2024</SelectItem>
                        <SelectItem value="2025">2025</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Program *</Label>
                    <Select value={newSection.program} onValueChange={(value) => setNewSection({...newSection, program: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select program" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CSE">CSE</SelectItem>
                        <SelectItem value="BBA">BBA</SelectItem>
                        <SelectItem value="EEE">EEE</SelectItem>
                        <SelectItem value="MBA">MBA</SelectItem>
                        <SelectItem value="Common">Common</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Semester *</Label>
                    <Select value={newSection.semester} onValueChange={(value) => setNewSection({...newSection, semester: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select semester" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1st">1st Semester</SelectItem>
                        <SelectItem value="2nd">2nd Semester</SelectItem>
                        <SelectItem value="3rd">3rd Semester</SelectItem>
                        <SelectItem value="4th">4th Semester</SelectItem>
                        <SelectItem value="5th">5th Semester</SelectItem>
                        <SelectItem value="6th">6th Semester</SelectItem>
                        <SelectItem value="7th">7th Semester</SelectItem>
                        <SelectItem value="8th">8th Semester</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Section Details */}
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h3 className="font-medium text-green-800 mb-3">Step 2: Section Configuration</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Section Name *</Label>
                    <Input
                      placeholder="e.g., A, B, C, D"
                      value={newSection.sectionName}
                      onChange={(e) => setNewSection({...newSection, sectionName: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Section Capacity *</Label>
                    <Input
                      type="number"
                      placeholder="Maximum students (e.g., 50)"
                      value={newSection.capacity}
                      onChange={(e) => setNewSection({...newSection, capacity: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              {/* Schedule Setup */}
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <h3 className="font-medium text-purple-800 mb-3">Step 3: Schedule & Room Assignment</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Class Days</Label>
                    <Select value={newSection.days} onValueChange={(value) => setNewSection({...newSection, days: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select days" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Sunday & Tuesday">Sunday & Tuesday</SelectItem>
                        <SelectItem value="Monday & Wednesday">Monday & Wednesday</SelectItem>
                        <SelectItem value="Tuesday & Thursday">Tuesday & Thursday</SelectItem>
                        <SelectItem value="Wednesday & Friday">Wednesday & Friday</SelectItem>
                        <SelectItem value="Thursday & Saturday">Thursday & Saturday</SelectItem>
                        <SelectItem value="Saturday & Sunday">Saturday & Sunday</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Time Slot</Label>
                    <Select value={newSection.timeSlot} onValueChange={(value) => setNewSection({...newSection, timeSlot: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="08:00 - 09:30 AM">08:00 - 09:30 AM</SelectItem>
                        <SelectItem value="10:00 - 11:30 AM">10:00 - 11:30 AM</SelectItem>
                        <SelectItem value="12:00 - 01:30 PM">12:00 - 01:30 PM</SelectItem>
                        <SelectItem value="02:00 - 03:30 PM">02:00 - 03:30 PM</SelectItem>
                        <SelectItem value="04:00 - 05:30 PM">04:00 - 05:30 PM</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Room Assignment</Label>
                    <Select value={newSection.room} onValueChange={(value) => setNewSection({...newSection, room: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select room" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Room 101">Room 101</SelectItem>
                        <SelectItem value="Room 102">Room 102</SelectItem>
                        <SelectItem value="Room 103">Room 103</SelectItem>
                        <SelectItem value="Room 201">Room 201</SelectItem>
                        <SelectItem value="Room 202">Room 202</SelectItem>
                        <SelectItem value="Room 203">Room 203</SelectItem>
                        <SelectItem value="Room 301">Room 301</SelectItem>
                        <SelectItem value="Room 302">Room 302</SelectItem>
                        <SelectItem value="Room 303">Room 303</SelectItem>
                        <SelectItem value="Room 401">Room 401</SelectItem>
                        <SelectItem value="Room 402">Room 402</SelectItem>
                        <SelectItem value="Room 403">Room 403</SelectItem>
                        <SelectItem value="Room 501">Room 501</SelectItem>
                        <SelectItem value="Room 502">Room 502</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Information Box */}
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-yellow-800">Next Steps</p>
                    <p className="text-sm text-yellow-700">
                      After creating this section, go to <strong>Course Offering → Offer Courses</strong> to:
                      <br />• Assign specific courses to this section
                      <br />• Assign teachers to courses
                      <br />• Manage student enrollments
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4">
                <Button variant="outline" onClick={() => setActiveView('view')}>
                  Cancel
                </Button>
                <Button onClick={handleCreateSection} className="flex items-center space-x-2">
                  <Plus className="w-4 h-4" />
                  <span>Create Section</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* View Section Modal */}
      <Dialog open={showViewModal} onOpenChange={setShowViewModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Section Details - {viewingSection?.course} Section {viewingSection?.sectionName}
            </DialogTitle>
          </DialogHeader>

          {viewingSection && (
            <div className="space-y-4 mt-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">Year</Label>
                  <p className="text-lg">{viewingSection.year}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Program</Label>
                  <p className="text-lg">{viewingSection.program}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Course</Label>
                  <p className="text-lg">{viewingSection.course}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Section</Label>
                  <p className="text-lg">{viewingSection.sectionName}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Capacity</Label>
                  <p className="text-lg">{viewingSection.enrolled}/{viewingSection.capacity}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Teacher</Label>
                  <p className="text-lg">{viewingSection.teacher}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Schedule</Label>
                  <p className="text-lg">{viewingSection.days}</p>
                  <p className="text-sm text-gray-600">{viewingSection.timeSlot}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Room</Label>
                  <p className="text-lg">{viewingSection.room}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Section Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              Edit Section - {editingSection?.course} Section {editingSection?.sectionName}
            </DialogTitle>
          </DialogHeader>

          {editingSection && (
            <div className="space-y-6 mt-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Year</Label>
                  <Select value={editingSection.year} onValueChange={(value) => setEditingSection({...editingSection, year: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2024">2024</SelectItem>
                      <SelectItem value="2025">2025</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Program</Label>
                  <Select value={editingSection.program} onValueChange={(value) => setEditingSection({...editingSection, program: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CSE">CSE</SelectItem>
                      <SelectItem value="BBA">BBA</SelectItem>
                      <SelectItem value="EEE">EEE</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Section Name</Label>
                  <Input
                    value={editingSection.sectionName}
                    onChange={(e) => setEditingSection({...editingSection, sectionName: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Capacity</Label>
                  <Input
                    type="number"
                    value={editingSection.capacity}
                    onChange={(e) => setEditingSection({...editingSection, capacity: parseInt(e.target.value)})}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Teacher</Label>
                  <Select value={editingSection.teacherId} onValueChange={(value) => {
                    const teacher = teachers.find(t => t.id === value)
                    setEditingSection({...editingSection, teacherId: value, teacher: teacher?.name || ''})
                  }}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {teachers.map((teacher) => (
                        <SelectItem key={teacher.id} value={teacher.id}>
                          {teacher.id} - {teacher.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Schedule Days</Label>
                  <Select value={editingSection.days} onValueChange={(value) => setEditingSection({...editingSection, days: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Sunday & Tuesday">Sunday & Tuesday</SelectItem>
                      <SelectItem value="Monday & Wednesday">Monday & Wednesday</SelectItem>
                      <SelectItem value="Thursday & Friday">Thursday & Friday</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Time Slot</Label>
                  <Select value={editingSection.timeSlot} onValueChange={(value) => setEditingSection({...editingSection, timeSlot: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="08:00 - 09:30 AM">08:00 - 09:30 AM</SelectItem>
                      <SelectItem value="10:00 - 11:30 AM">10:00 - 11:30 AM</SelectItem>
                      <SelectItem value="02:00 - 03:30 PM">02:00 - 03:30 PM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Room</Label>
                  <Select value={editingSection.room} onValueChange={(value) => setEditingSection({...editingSection, room: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Room 201">Room 201</SelectItem>
                      <SelectItem value="Room 301">Room 301</SelectItem>
                      <SelectItem value="Room 401">Room 401</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => {
                  setShowEditModal(false)
                  setEditingSection(null)
                }}>Cancel</Button>
                <Button onClick={handleUpdateSection}>Update Section</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
