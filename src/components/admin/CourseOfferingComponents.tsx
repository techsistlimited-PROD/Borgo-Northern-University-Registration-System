import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
  Plus,
  Edit,
  Trash2,
  Save,
  Users,
  AlertCircle,
  Search
} from 'lucide-react'

export const Syllabuses = () => {
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
    'BBA (Bachelor of Business Administration)',
    'CSE (Computer Science & Engineering)', 
    'EEE (Electrical and Electronic Engineering)',
    'MBA (Master of Business Administration)',
    'MBM (Master of Business Management)'
  ]

  const syllabusData = {
    'CSE': {
      semesters: 12, // Tri-semester
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
      semesters: 8, // Bi-semester
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
      {selectedProgram && syllabusState[selectedProgram as keyof typeof syllabusState] && (
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

  const courses = [
    { code: 'CSE401', title: 'Software Engineering', capacity: '310/350', credits: 3 },
    { code: 'CSE403', title: 'Database Systems', capacity: '180/200', credits: 3 },
    { code: 'BBA401', title: 'Strategic Management', capacity: '95/120', credits: 3 },
    { code: 'CSE301', title: 'Data Structures', capacity: '240/280', credits: 3 },
    { code: 'EEE201', title: 'Circuit Analysis', capacity: '150/180', credits: 3 },
  ]

  const sections = [
    { id: 'A', capacity: 45, enrolled: 50, maxCapacity: 50, status: 'Full', teacher: 'Dr. Rahman Ahmed', teacherId: 'T001', schedule: 'Sun, Tue 10:00-11:30', room: 'Room 301', offered: true, offerStatus: 'Offered' },
    { id: 'B', capacity: 50, enrolled: 48, maxCapacity: 50, status: 'Available', teacher: 'Prof. Sarah Khan', teacherId: 'T002', schedule: 'Mon, Wed 14:00-15:30', room: 'Room 302', offered: true, offerStatus: 'Offered' },
    { id: 'C', capacity: 50, enrolled: 30, maxCapacity: 50, status: 'Available', teacher: '', teacherId: '', schedule: '', room: '', offered: false, offerStatus: 'Pending' },
  ]

  const teachers = [
    { id: 'T001', name: 'Dr. Rahman Ahmed', department: 'CSE', email: 'rahman.ahmed@nu.edu.bd' },
    { id: 'T002', name: 'Prof. Sarah Khan', department: 'CSE', email: 'sarah.khan@nu.edu.bd' },
    { id: 'T003', name: 'Dr. Mohammad Ali', department: 'CSE', email: 'mohammad.ali@nu.edu.bd' },
    { id: 'T004', name: 'Dr. Fatima Rahman', department: 'BBA', email: 'fatima.rahman@nu.edu.bd' },
    { id: 'T005', name: 'Prof. Ahmed Hassan', department: 'EEE', email: 'ahmed.hassan@nu.edu.bd' },
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

  const handleCreateSection = () => {
    if (!selectedCourse || !sectionCapacity) {
      alert('Please select course and set capacity')
      return
    }
    alert(`New section created for ${selectedCourse} with capacity ${sectionCapacity}`)
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-deep-plum">Course Offering & Section Management</h1>
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

      {/* Course Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Course & Section Configuration</CardTitle>
          <CardDescription>Select course and manage sections with teacher assignments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Program Type</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="undergraduate">Undergraduate</SelectItem>
                  <SelectItem value="postgraduate">Postgraduate</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Program</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select program" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cse">CSE</SelectItem>
                  <SelectItem value="bba">BBA</SelectItem>
                  <SelectItem value="eee">EEE</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Course</Label>
              <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                <SelectTrigger>
                  <SelectValue placeholder="Select course" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((course) => (
                    <SelectItem key={course.code} value={course.code}>
                      {course.code} - {course.title} ({course.credits} credits)
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
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <p>Total capacity: {courses.find(c => c.code === selectedCourse)?.capacity} students</p>
                <p>Credits: {courses.find(c => c.code === selectedCourse)?.credits}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Section Management */}
      {selectedCourse && (
        <Card>
          <CardHeader>
            <CardTitle>Existing Sections</CardTitle>
            <CardDescription>Manage sections and teacher assignments for {selectedCourse}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sections.map((section) => (
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

              {/* Create New Section */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                <h4 className="text-lg font-semibold mb-3">Create New Section</h4>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label>Section Capacity</Label>
                    <Input
                      type="number"
                      placeholder="Max students"
                      value={sectionCapacity}
                      onChange={(e) => setSectionCapacity(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Unoccupied Teacher</Label>
                    <Select value={teacherEmployeeId} onValueChange={setTeacherEmployeeId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select teacher" />
                      </SelectTrigger>
                      <SelectContent>
                        {teachers.filter(teacher => !sections.some(section => section.teacherId === teacher.id)).map((teacher) => (
                          <SelectItem key={teacher.id} value={teacher.id}>
                            {teacher.name} ({teacher.id})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Select Weekdays</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose days" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sun-tue">Sunday & Tuesday</SelectItem>
                        <SelectItem value="mon-wed">Monday & Wednesday</SelectItem>
                        <SelectItem value="tue-thu">Tuesday & Thursday</SelectItem>
                        <SelectItem value="wed-fri">Wednesday & Friday</SelectItem>
                        <SelectItem value="thu-sat">Thursday & Saturday</SelectItem>
                        <SelectItem value="sat-sun">Saturday & Sunday</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Room & Time Slot</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Available slots" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="room301-0800">Room 301 - 08:00-09:30</SelectItem>
                        <SelectItem value="room302-1000">Room 302 - 10:00-11:30</SelectItem>
                        <SelectItem value="room303-1200">Room 303 - 12:00-13:30</SelectItem>
                        <SelectItem value="room401-1400">Room 401 - 14:00-15:30</SelectItem>
                        <SelectItem value="room402-1600">Room 402 - 16:00-17:30</SelectItem>
                        <SelectItem value="room501-0930">Room 501 - 09:30-11:00</SelectItem>
                        <SelectItem value="room502-1130">Room 502 - 11:30-13:00</SelectItem>
                        <SelectItem value="room503-1530">Room 503 - 15:30-17:00</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-end md:col-span-2 lg:col-span-4">
                    <Button onClick={handleCreateSection} className="w-full">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Section
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Teacher Assignment */}
      {selectedCourse && (
        <Card>
          <CardHeader>
            <CardTitle>Teacher Assignment</CardTitle>
            <CardDescription>Assign or update teachers for existing sections</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Section</Label>
                <Select value={selectedSection} onValueChange={setSelectedSection}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select section" />
                  </SelectTrigger>
                  <SelectContent>
                    {sections.map((section) => (
                      <SelectItem key={section.id} value={section.id}>
                        Section {section.id}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Teacher</Label>
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
                <Button onClick={handleAssignTeacher} className="w-full">
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
    </div>
  )
}

export const SectionManagement = () => {
  const [activeView, setActiveView] = useState('view') // 'view', 'create', 'edit'
  const [filterProgram, setFilterProgram] = useState('all')
  const [filterCourse, setFilterCourse] = useState('all')
  const [filterTeacher, setFilterTeacher] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  const sections = [
    {
      id: 1,
      year: '2024',
      program: 'CSE',
      semester: '8th',
      course: 'CSE401 - Software Engineering',
      sectionName: 'A',
      capacity: 50,
      enrolled: 45,
      teacher: 'Dr. Ahmad Hassan',
      teacherId: 'T001',
      days: 'Sunday & Tuesday',
      timeSlot: '10:00 - 11:30 AM',
      room: 'Room 301',
      status: 'Active'
    },
    {
      id: 2,
      year: '2024',
      program: 'CSE',
      semester: '8th',
      course: 'CSE401 - Software Engineering',
      sectionName: 'B',
      capacity: 50,
      enrolled: 50,
      teacher: 'Prof. Sarah Ahmed',
      teacherId: 'T002',
      days: 'Monday & Wednesday',
      timeSlot: '02:00 - 03:30 PM',
      room: 'Room 302',
      status: 'Full'
    },
    {
      id: 3,
      year: '2024',
      program: 'BBA',
      semester: '6th',
      course: 'BBA401 - Strategic Management',
      sectionName: 'A',
      capacity: 40,
      enrolled: 35,
      teacher: 'Dr. Fatima Rahman',
      teacherId: 'T004',
      days: 'Thursday & Friday',
      timeSlot: '08:00 - 09:30 AM',
      room: 'Room 201',
      status: 'Active'
    },
    {
      id: 4,
      year: '2024',
      program: 'EEE',
      semester: '4th',
      course: 'EEE201 - Circuit Analysis',
      sectionName: 'A',
      capacity: 45,
      enrolled: 38,
      teacher: 'Prof. Ahmed Hassan',
      teacherId: 'T005',
      days: 'Monday & Wednesday',
      timeSlot: '10:00 - 11:30 AM',
      room: 'Room 401',
      status: 'Active'
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
    { code: 'CSE401', title: 'Software Engineering', program: 'CSE' },
    { code: 'BBA401', title: 'Strategic Management', program: 'BBA' },
    { code: 'EEE201', title: 'Circuit Analysis', program: 'EEE' },
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

  const handleChangeTeacher = (sectionId: number) => {
    const newTeacherId = prompt('Enter new teacher ID:')
    if (newTeacherId) {
      const teacher = teachers.find(t => t.id === newTeacherId)
      if (teacher) {
        alert(`Teacher changed to ${teacher.name} for section ${sectionId}`)
      } else {
        alert('Teacher not found!')
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-deep-plum">Section Management</h1>
        <div className="flex space-x-2">
          <Button
            variant={activeView === 'view' ? 'default' : 'outline'}
            onClick={() => setActiveView('view')}
          >
            View Sections
          </Button>
          <Button
            variant={activeView === 'create' ? 'default' : 'outline'}
            onClick={() => setActiveView('create')}
            className="flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Create Section</span>
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
                            onClick={() => handleChangeTeacher(section.id)}
                            title="Change Teacher"
                          >
                            <Users className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
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
            <CardDescription>Add a new course section with teacher assignment</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-6">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Year</Label>
                  <Select>
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
                  <Label>Program</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select program" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cse">CSE</SelectItem>
                      <SelectItem value="bba">BBA</SelectItem>
                      <SelectItem value="eee">EEE</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Semester</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select semester" />
                    </SelectTrigger>
                    <SelectContent>
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
              </div>

              <div className="grid md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>Course</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select course" />
                    </SelectTrigger>
                    <SelectContent>
                      {courses.map((course) => (
                        <SelectItem key={course.code} value={course.code}>
                          {course.code} - {course.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Section Name</Label>
                  <Input placeholder="e.g., A, B, C" />
                </div>

                <div className="space-y-2">
                  <Label>Capacity</Label>
                  <Input type="number" placeholder="Maximum students" />
                </div>

                <div className="space-y-2">
                  <Label>Teacher</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Assign teacher" />
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
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select days" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sun-tue">Sunday & Tuesday</SelectItem>
                      <SelectItem value="mon-wed">Monday & Wednesday</SelectItem>
                      <SelectItem value="thu-fri">Thursday & Friday</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Time Slot</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0800-0930">08:00 - 09:30 AM</SelectItem>
                      <SelectItem value="1000-1130">10:00 - 11:30 AM</SelectItem>
                      <SelectItem value="1400-1530">02:00 - 03:30 PM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Room</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select room" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="room201">Room 201</SelectItem>
                      <SelectItem value="room301">Room 301</SelectItem>
                      <SelectItem value="room401">Room 401</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex space-x-4">
                <Button type="submit" className="nu-button-primary">
                  Create Section
                </Button>
                <Button type="button" variant="outline" onClick={() => setActiveView('view')}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
