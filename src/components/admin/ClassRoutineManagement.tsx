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
  Upload,
  Download,
  Calendar,
  Clock,
  Building,
  Users,
  Filter,
  Eye,
  Edit,
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react'

export const ClassRoutineManagement = () => {
  const [activeTab, setActiveTab] = useState('upload') // 'upload', 'rooms', 'schedule', 'attendance'
  const [selectedSemester, setSelectedSemester] = useState('all')
  const [selectedProgram, setSelectedProgram] = useState('all')
  const [selectedSlot, setSelectedSlot] = useState('all')
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadErrors, setUploadErrors] = useState<string[]>([])

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate file type
      const allowedTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
        'application/vnd.ms-excel', // .xls
        'text/csv' // .csv
      ]

      if (!allowedTypes.includes(file.type)) {
        alert('Please upload only Excel (.xlsx, .xls) or CSV (.csv) files')
        return
      }

      setUploadedFile(file)
      setUploadErrors([])
    }
  }

  const processFile = async () => {
    if (!uploadedFile) {
      alert('Please select a file first')
      return
    }

    setIsUploading(true)
    setUploadProgress(0)

    // Mock file processing with progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsUploading(false)

          // Mock validation errors
          const mockErrors = [
            'Row 5: Invalid time slot format. Expected HH:MM-HH:MM',
            'Row 12: Room R999 does not exist in the system',
            'Row 18: Teacher ID T999 not found'
          ]

          if (Math.random() > 0.7) { // 30% chance of errors
            setUploadErrors(mockErrors.slice(0, Math.floor(Math.random() * 3) + 1))
          } else {
            alert('File processed successfully! Routine uploaded.')
            setUploadedFile(null)
          }

          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  const downloadTemplate = () => {
    // Mock download template functionality
    alert('Template downloaded: class_routine_template.xlsx')
  }
  
  const rooms = [
    { 
      id: 'R101', 
      name: 'Room 101', 
      capacity: 50, 
      type: 'Classroom',
      building: 'Main Building',
      status: 'Available',
      currentClass: null
    },
    { 
      id: 'R102', 
      name: 'Room 102', 
      capacity: 45, 
      type: 'Classroom',
      building: 'Main Building',
      status: 'Occupied',
      currentClass: 'CSE401 - Section A'
    },
    { 
      id: 'LAB1', 
      name: 'Computer Lab 1', 
      capacity: 30, 
      type: 'Laboratory',
      building: 'Engineering Block',
      status: 'Available',
      currentClass: null
    },
    { 
      id: 'LAB2', 
      name: 'Computer Lab 2', 
      capacity: 30, 
      type: 'Laboratory',
      building: 'Engineering Block',
      status: 'Maintenance',
      currentClass: null
    }
  ]

  const timeSlots = [
    { id: '1', time: '08:00 - 09:30', type: 'Day' },
    { id: '2', time: '10:00 - 11:30', type: 'Day' },
    { id: '3', time: '12:00 - 01:30', type: 'Day' },
    { id: '4', time: '02:00 - 03:30', type: 'Day' },
    { id: '5', time: '04:00 - 05:30', type: 'Day' },
    { id: '6', time: '06:00 - 07:30', type: 'Evening' },
    { id: '7', time: '07:30 - 09:00', type: 'Evening' }
  ]

  const scheduleData = [
    {
      day: 'Sunday',
      slots: [
        { time: '08:00-09:30', course: 'CSE401', section: 'A', teacher: 'Dr. Ahmad', room: 'R101', students: 45 },
        { time: '10:00-11:30', course: 'BBA201', section: 'B', teacher: 'Prof. Khan', room: 'R102', students: 40 },
        { time: '12:00-01:30', course: 'EEE301', section: 'A', teacher: 'Dr. Rahman', room: 'R103', students: 38 },
      ]
    },
    {
      day: 'Monday', 
      slots: [
        { time: '08:00-09:30', course: 'CSE403', section: 'A', teacher: 'Prof. Ahmed', room: 'LAB1', students: 30 },
        { time: '10:00-11:30', course: 'BBA301', section: 'A', teacher: 'Dr. Hassan', room: 'R101', students: 42 },
      ]
    }
  ]

  const attendanceData = [
    {
      date: '2024-01-15',
      course: 'CSE401',
      section: 'A',
      teacher: 'Dr. Ahmad Hassan',
      teacherId: 'T001',
      room: 'R101',
      timeSlot: '08:00-09:30',
      status: 'Held',
      studentsPresent: 42,
      totalStudents: 45
    },
    {
      date: '2024-01-15',
      course: 'BBA201',
      section: 'B', 
      teacher: 'Prof. Khan',
      teacherId: 'T002',
      room: 'R102',
      timeSlot: '10:00-11:30',
      status: 'Not Held',
      studentsPresent: 0,
      totalStudents: 40
    }
  ]

  const renderUploadSection = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Upload Class Routines</CardTitle>
          <CardDescription>Upload semester and program-wise class routines via Excel/CSV</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="space-y-2">
              <Label>Semester Duration</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tri">Tri-Semester</SelectItem>
                  <SelectItem value="bi">Bi-Semester</SelectItem>
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
              <Label>Slot Type</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select slot" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">Day Slots</SelectItem>
                  <SelectItem value="evening">Evening Slots</SelectItem>
                  <SelectItem value="both">Both Day & Evening</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Upload Routine File</h3>
            <p className="text-gray-500 mb-4">Drag and drop your Excel/CSV file here, or click to browse</p>
            <Button className="nu-button-primary">
              Choose File
            </Button>
          </div>
          
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">File Format Requirements:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Excel (.xlsx) or CSV (.csv) format</li>
              <li>• Columns: Day, Time Slot, Course Code, Section, Teacher ID, Room, Student Count</li>
              <li>• Separate files for different programs and semesters</li>
              <li>• Include both day and evening slots if applicable</li>
            </ul>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Time Slot Configuration</CardTitle>
            <CardDescription>Manage unique time slots</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="font-semibold text-deep-plum">Day Slots</div>
              {timeSlots.filter(slot => slot.type === 'Day').map((slot) => (
                <div key={slot.id} className="flex justify-between items-center p-2 bg-green-50 rounded">
                  <span className="text-sm">{slot.time}</span>
                  <Button size="sm" variant="outline">
                    <Edit className="w-3 h-3" />
                  </Button>
                </div>
              ))}
              
              <div className="font-semibold text-deep-plum mt-4">Evening Slots</div>
              {timeSlots.filter(slot => slot.type === 'Evening').map((slot) => (
                <div key={slot.id} className="flex justify-between items-center p-2 bg-blue-50 rounded">
                  <span className="text-sm">{slot.time}</span>
                  <Button size="sm" variant="outline">
                    <Edit className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Recent Uploads</CardTitle>
            <CardDescription>Recently uploaded routine files</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { file: 'CSE_Fall2024_Routine.xlsx', date: '2024-01-15', status: 'Processed' },
                { file: 'BBA_Fall2024_Routine.xlsx', date: '2024-01-14', status: 'Processing' },
                { file: 'EEE_Fall2024_Routine.csv', date: '2024-01-13', status: 'Failed' }
              ].map((upload, index) => (
                <div key={index} className="flex justify-between items-center p-3 border rounded">
                  <div>
                    <div className="font-medium text-sm">{upload.file}</div>
                    <div className="text-xs text-gray-500">{upload.date}</div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${
                    upload.status === 'Processed' ? 'bg-green-100 text-green-800' :
                    upload.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {upload.status}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const renderRoomManagement = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Room Filters</CardTitle>
          <CardDescription>Filter rooms by availability and usage</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            <Select value={selectedSlot} onValueChange={setSelectedSlot}>
              <SelectTrigger>
                <SelectValue placeholder="Time Slot" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Slots</SelectItem>
                {timeSlots.map((slot) => (
                  <SelectItem key={slot.id} value={slot.id}>{slot.time}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Day" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Days</SelectItem>
                <SelectItem value="sunday">Sunday</SelectItem>
                <SelectItem value="monday">Monday</SelectItem>
                <SelectItem value="tuesday">Tuesday</SelectItem>
                <SelectItem value="wednesday">Wednesday</SelectItem>
                <SelectItem value="thursday">Thursday</SelectItem>
              </SelectContent>
            </Select>
            
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Availability" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Rooms</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="occupied">Occupied</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>
            
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Building" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Buildings</SelectItem>
                <SelectItem value="main">Main Building</SelectItem>
                <SelectItem value="engineering">Engineering Block</SelectItem>
                <SelectItem value="business">Business Building</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Room Status Overview</CardTitle>
          <CardDescription>Real-time room availability and usage</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Room ID</TableHead>
                <TableHead>Room Name</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Building</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Current Class</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rooms.map((room) => (
                <TableRow key={room.id}>
                  <TableCell className="font-medium">{room.id}</TableCell>
                  <TableCell>{room.name}</TableCell>
                  <TableCell>{room.capacity}</TableCell>
                  <TableCell>{room.type}</TableCell>
                  <TableCell>{room.building}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {room.status === 'Available' && <CheckCircle className="w-4 h-4 text-green-500" />}
                      {room.status === 'Occupied' && <XCircle className="w-4 h-4 text-red-500" />}
                      {room.status === 'Maintenance' && <AlertTriangle className="w-4 h-4 text-yellow-500" />}
                      <span className={
                        room.status === 'Available' ? 'text-green-600' :
                        room.status === 'Occupied' ? 'text-red-600' : 'text-yellow-600'
                      }>
                        {room.status}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {room.currentClass || '-'}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )

  const renderScheduleView = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Class Schedule Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <Select value={selectedSemester} onValueChange={setSelectedSemester}>
              <SelectTrigger>
                <SelectValue placeholder="Select Semester" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fall2024">Fall 2024</SelectItem>
                <SelectItem value="spring2024">Spring 2024</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={selectedProgram} onValueChange={setSelectedProgram}>
              <SelectTrigger>
                <SelectValue placeholder="Select Program" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cse">CSE</SelectItem>
                <SelectItem value="bba">BBA</SelectItem>
                <SelectItem value="eee">EEE</SelectItem>
              </SelectContent>
            </Select>
            
            <Button className="nu-button-primary flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Export Schedule</span>
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Weekly Class Schedule</CardTitle>
          <CardDescription>Current semester class routine</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {scheduleData.map((dayData, dayIndex) => (
              <div key={dayIndex}>
                <h3 className="text-lg font-semibold text-deep-plum mb-3">{dayData.day}</h3>
                <div className="grid gap-3">
                  {dayData.slots.map((slot, slotIndex) => (
                    <div key={slotIndex} className="flex items-center justify-between p-3 border rounded-lg bg-lavender-bg">
                      <div className="flex items-center space-x-4">
                        <div className="text-sm font-medium text-deep-plum">{slot.time}</div>
                        <div className="text-sm">
                          <span className="font-semibold">{slot.course}</span> - Section {slot.section}
                        </div>
                        <div className="text-sm text-gray-600">{slot.teacher}</div>
                        <div className="text-sm text-gray-600">{slot.room}</div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-sm text-gray-600">
                          <Users className="w-4 h-4 inline mr-1" />
                          {slot.students} students
                        </div>
                        <Button size="sm" variant="outline">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderAttendanceTracking = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Class Attendance Tracking</CardTitle>
          <CardDescription>Track classes held/not held based on teacher attendance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="space-y-2">
              <Label>Date Range</Label>
              <Input type="date" />
            </div>
            <div className="space-y-2">
              <Label>Teacher ID</Label>
              <Input placeholder="Enter teacher ID" />
            </div>
            <div className="space-y-2">
              <Label>Room</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select room" />
                </SelectTrigger>
                <SelectContent>
                  {rooms.map((room) => (
                    <SelectItem key={room.id} value={room.id}>{room.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Section</TableHead>
                <TableHead>Teacher</TableHead>
                <TableHead>Room</TableHead>
                <TableHead>Time Slot</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Attendance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attendanceData.map((record, index) => (
                <TableRow key={index}>
                  <TableCell>{record.date}</TableCell>
                  <TableCell>{record.course}</TableCell>
                  <TableCell>{record.section}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{record.teacher}</div>
                      <div className="text-sm text-gray-500">ID: {record.teacherId}</div>
                    </div>
                  </TableCell>
                  <TableCell>{record.room}</TableCell>
                  <TableCell>{record.timeSlot}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {record.status === 'Held' ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-500" />
                      )}
                      <span className={record.status === 'Held' ? 'text-green-600' : 'text-red-600'}>
                        {record.status}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {record.status === 'Held' ? (
                      <span>{record.studentsPresent}/{record.totalStudents}</span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-deep-plum">Central Class Routine & Room Management</h1>
      </div>
      
      {/* Tab Navigation */}
      <Card>
        <CardHeader>
          <CardTitle>Management Sections</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <Button 
              variant={activeTab === 'upload' ? 'default' : 'outline'}
              onClick={() => setActiveTab('upload')}
              className="flex items-center space-x-2"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Routines</span>
            </Button>
            <Button 
              variant={activeTab === 'rooms' ? 'default' : 'outline'}
              onClick={() => setActiveTab('rooms')}
              className="flex items-center space-x-2"
            >
              <Building className="w-4 h-4" />
              <span>Room Management</span>
            </Button>
            <Button 
              variant={activeTab === 'schedule' ? 'default' : 'outline'}
              onClick={() => setActiveTab('schedule')}
              className="flex items-center space-x-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Schedule View</span>
            </Button>
            <Button 
              variant={activeTab === 'attendance' ? 'default' : 'outline'}
              onClick={() => setActiveTab('attendance')}
              className="flex items-center space-x-2"
            >
              <Clock className="w-4 h-4" />
              <span>Attendance Tracking</span>
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Content based on active tab */}
      {activeTab === 'upload' && renderUploadSection()}
      {activeTab === 'rooms' && renderRoomManagement()}
      {activeTab === 'schedule' && renderScheduleView()}
      {activeTab === 'attendance' && renderAttendanceTracking()}
    </div>
  )
}
