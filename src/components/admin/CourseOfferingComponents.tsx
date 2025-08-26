import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
  Upload,
  Download,
  Users,
  Clock,
  BookOpen,
  AlertCircle
} from 'lucide-react'

export const Syllabuses = () => {
  const [selectedType, setSelectedType] = useState('')
  const [selectedProgram, setSelectedProgram] = useState('')
  
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
        { semester: 2, courses: ['CSE201 - Data Structures', 'MAT201 - Calculus II', 'PHY201 - Physics II', 'ENG201 - English II', 'CSE202 - Data Structures Lab', 'CSE203 - Digital Logic'] },
        { semester: 3, courses: ['CSE301 - Algorithms', 'MAT301 - Linear Algebra', 'CSE302 - Database Systems', 'CSE303 - Computer Organization', 'CSE304 - Database Lab'] },
        // Continue for all 12 semesters...
      ]
    },
    'BBA': {
      semesters: 8, // Bi-semester
      type: 'Bi-semester', 
      courses: [
        { semester: 1, courses: ['BBA101 - Principles of Management', 'ECO101 - Microeconomics', 'ACC101 - Financial Accounting', 'ENG101 - Business English', 'MAT101 - Business Mathematics'] },
        { semester: 2, courses: ['BBA201 - Organizational Behavior', 'ECO201 - Macroeconomics', 'ACC201 - Management Accounting', 'MKT201 - Principles of Marketing', 'FIN201 - Corporate Finance'] },
        // Continue for all 8 semesters...
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
      {selectedProgram && syllabusData[selectedProgram as keyof typeof syllabusData] && (
        <Card>
          <CardHeader>
            <CardTitle>
              {selectedProgram} Syllabus - {syllabusData[selectedProgram as keyof typeof syllabusData].type}
            </CardTitle>
            <CardDescription>
              {syllabusData[selectedProgram as keyof typeof syllabusData].semesters} semesters total
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {syllabusData[selectedProgram as keyof typeof syllabusData].courses.map((semesterData, index) => (
                <Card key={index}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Semester {semesterData.semester}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {semesterData.courses.map((course, courseIndex) => (
                        <div key={courseIndex} className="flex justify-between items-center p-2 bg-lavender-bg rounded">
                          <span className="text-sm">{course}</span>
                          <div className="flex space-x-1">
                            <Button size="sm" variant="outline" className="h-6 w-6 p-0">
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button size="sm" variant="outline" className="h-6 w-6 p-0">
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                      <Button size="sm" variant="outline" className="w-full mt-2">
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
    { id: 'A', capacity: 45, enrolled: 45, maxCapacity: 50, status: 'Full', teacher: 'Dr. Rahman Ahmed', teacherId: 'T001', schedule: 'Sun, Tue 10:00-11:30', room: 'Room 301' },
    { id: 'B', capacity: 50, enrolled: 48, maxCapacity: 50, status: 'Available', teacher: 'Prof. Sarah Khan', teacherId: 'T002', schedule: 'Mon, Wed 14:00-15:30', room: 'Room 302' },
    { id: 'C', capacity: 50, enrolled: 30, maxCapacity: 50, status: 'Available', teacher: '', teacherId: '', schedule: '', room: '' },
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

  const handleDeleteSection = (sectionId: string) => {
    if (confirm(`Are you sure you want to delete Section ${sectionId}?`)) {
      alert(`Section ${sectionId} deleted successfully`)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-deep-plum">Course Offering</h1>
        <div className="flex space-x-2">
          <Button 
            variant={mode === 'single' ? 'default' : 'outline'}
            onClick={() => setMode('single')}
          >
            Single Student
          </Button>
          <Button 
            variant={mode === 'bulk' ? 'default' : 'outline'}
            onClick={() => setMode('bulk')}
          >
            Bulk Students
          </Button>
        </div>
      </div>
      
      {/* Course Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Course Selection</CardTitle>
          <CardDescription>Select course and configure offering details</CardDescription>
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
                      {course.code} - {course.title}
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
                <span className="font-semibold">Course Capacity Status</span>
              </div>
              <p className="text-sm text-gray-600">
                Total capacity: {courses.find(c => c.code === selectedCourse)?.capacity} students
              </p>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Student Assignment */}
      {selectedCourse && (
        <Card>
          <CardHeader>
            <CardTitle>
              {mode === 'single' ? 'Add Single Student' : 'Add Multiple Students'}
            </CardTitle>
            <CardDescription>
              Assign students to course sections
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {mode === 'single' ? (
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Student ID</Label>
                      <Input placeholder="Enter student ID" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Section</Label>
                      <Select>
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
                              Section {section.id} - {section.capacity} 
                              {section.status === 'Full' && ' (Full)'}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>From Student ID</Label>
                      <Input placeholder="Starting ID" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>To Student ID</Label>
                      <Input placeholder="Ending ID" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Section</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select section" />
                        </SelectTrigger>
                        <SelectContent>
                          {sections.map((section) => (
                            <SelectItem key={section.id} value={section.id}>
                              Section {section.id} - {section.capacity}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start space-x-2">
                    <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-yellow-800">Capacity Check</p>
                      <p className="text-sm text-yellow-700">
                        System will automatically check if the selected section has enough capacity for the student range.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Class Schedule */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-deep-plum mb-4">Class Schedule</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Weekdays</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select days" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="st">Sunday & Tuesday</SelectItem>
                        <SelectItem value="mw">Monday & Wednesday</SelectItem>
                        <SelectItem value="tr">Tuesday & Thursday</SelectItem>
                        <SelectItem value="mwf">Monday, Wednesday & Friday</SelectItem>
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
                        <SelectItem value="1200-1330">12:00 - 01:30 PM</SelectItem>
                        <SelectItem value="1400-1530">02:00 - 03:30 PM</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Teacher Employee ID</Label>
                    <Input placeholder="Enter teacher ID" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Room</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select room" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="room101">Room 101</SelectItem>
                        <SelectItem value="room102">Room 102</SelectItem>
                        <SelectItem value="lab1">Computer Lab 1</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-4 pt-4">
                <Button className="nu-button-primary">
                  {mode === 'single' ? 'Add Student' : 'Add Students'}
                </Button>
                <Button variant="outline">Check Conflicts</Button>
                <Button variant="outline">Reset Form</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export const SectionManagement = () => {
  const [activeView, setActiveView] = useState('view') // 'view', 'create', 'edit'
  
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
      days: 'Sunday & Tuesday',
      timeSlot: '10:00 - 11:30 AM',
      room: 'Room 301'
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
      days: 'Monday & Wednesday',
      timeSlot: '02:00 - 03:30 PM',
      room: 'Room 302'
    }
  ]

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
        <Card>
          <CardHeader>
            <CardTitle>All Sections</CardTitle>
            <CardDescription>Manage course sections and their details</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Year</TableHead>
                  <TableHead>Program</TableHead>
                  <TableHead>Semester</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Section</TableHead>
                  <TableHead>Capacity</TableHead>
                  <TableHead>Teacher</TableHead>
                  <TableHead>Schedule</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sections.map((section) => (
                  <TableRow key={section.id}>
                    <TableCell>{section.year}</TableCell>
                    <TableCell>{section.program}</TableCell>
                    <TableCell>{section.semester}</TableCell>
                    <TableCell>{section.course}</TableCell>
                    <TableCell>
                      <span className="font-semibold">{section.sectionName}</span>
                    </TableCell>
                    <TableCell>
                      <span className={section.enrolled === section.capacity ? 'text-red-600' : 'text-green-600'}>
                        {section.enrolled}/{section.capacity}
                      </span>
                    </TableCell>
                    <TableCell>{section.teacher}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{section.days}</div>
                        <div className="text-gray-500">{section.timeSlot}</div>
                        <div className="text-gray-500">{section.room}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
      
      {activeView === 'create' && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Section</CardTitle>
            <CardDescription>Add a new course section</CardDescription>
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
              
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Course</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select course" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cse401">CSE401 - Software Engineering</SelectItem>
                      <SelectItem value="cse403">CSE403 - Database Systems</SelectItem>
                      <SelectItem value="bba401">BBA401 - Strategic Management</SelectItem>
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
