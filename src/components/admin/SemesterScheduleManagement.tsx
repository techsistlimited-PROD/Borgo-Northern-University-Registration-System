import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import {
  Calendar,
  Plus,
  Edit2,
  Trash2,
  Save,
  Download,
  CheckCircle,
  AlertCircle,
  Settings
} from 'lucide-react'

interface SemesterSchedule {
  id: string
  academicYear: string
  systemType: 'bi-semester' | 'tri-semester'
  semesters: SemesterDetail[]
  createdDate: string
  status: 'draft' | 'active' | 'completed'
  createdBy: string
}

interface SemesterDetail {
  id: string
  name: string
  type: 'spring' | 'summer' | 'fall'
  startDate: string
  endDate: string
  registrationStartDate: string
  registrationEndDate: string
  classStartDate: string
  classEndDate: string
  midtermStartDate: string
  midtermEndDate: string
  finalExamStartDate: string
  finalExamEndDate: string
  resultPublishDate: string
  status: 'upcoming' | 'registration' | 'ongoing' | 'exam' | 'completed'
}

// Mock data for semester schedules
const mockSchedules: SemesterSchedule[] = [
  {
    id: '1',
    academicYear: '2024',
    systemType: 'tri-semester',
    createdDate: '2023-12-01',
    status: 'active',
    createdBy: 'Admin',
    semesters: [
      {
        id: '1',
        name: 'Spring 2024',
        type: 'spring',
        startDate: '2024-01-15',
        endDate: '2024-04-30',
        registrationStartDate: '2024-01-01',
        registrationEndDate: '2024-01-10',
        classStartDate: '2024-01-15',
        classEndDate: '2024-04-15',
        midtermStartDate: '2024-03-01',
        midtermEndDate: '2024-03-10',
        finalExamStartDate: '2024-04-20',
        finalExamEndDate: '2024-04-28',
        resultPublishDate: '2024-05-05',
        status: 'completed'
      },
      {
        id: '2',
        name: 'Summer 2024',
        type: 'summer',
        startDate: '2024-05-15',
        endDate: '2024-08-30',
        registrationStartDate: '2024-05-01',
        registrationEndDate: '2024-05-10',
        classStartDate: '2024-05-15',
        classEndDate: '2024-08-15',
        midtermStartDate: '2024-07-01',
        midtermEndDate: '2024-07-10',
        finalExamStartDate: '2024-08-20',
        finalExamEndDate: '2024-08-28',
        resultPublishDate: '2024-09-05',
        status: 'completed'
      },
      {
        id: '3',
        name: 'Fall 2024',
        type: 'fall',
        startDate: '2024-09-15',
        endDate: '2024-12-30',
        registrationStartDate: '2024-09-01',
        registrationEndDate: '2024-09-10',
        classStartDate: '2024-09-15',
        classEndDate: '2024-12-15',
        midtermStartDate: '2024-11-01',
        midtermEndDate: '2024-11-10',
        finalExamStartDate: '2024-12-20',
        finalExamEndDate: '2024-12-28',
        resultPublishDate: '2025-01-05',
        status: 'ongoing'
      }
    ]
  },
  {
    id: '2',
    academicYear: '2025',
    systemType: 'tri-semester',
    createdDate: '2024-10-01',
    status: 'draft',
    createdBy: 'Admin',
    semesters: [
      {
        id: '4',
        name: 'Spring 2025',
        type: 'spring',
        startDate: '2025-01-15',
        endDate: '2025-04-30',
        registrationStartDate: '2025-01-01',
        registrationEndDate: '2025-01-10',
        classStartDate: '2025-01-15',
        classEndDate: '2025-04-15',
        midtermStartDate: '2025-03-01',
        midtermEndDate: '2025-03-10',
        finalExamStartDate: '2025-04-20',
        finalExamEndDate: '2025-04-28',
        resultPublishDate: '2025-05-05',
        status: 'upcoming'
      }
    ]
  }
]

function CreateScheduleForm({ 
  onClose, 
  editingSchedule 
}: { 
  onClose: () => void;
  editingSchedule?: SemesterSchedule;
}) {
  const [academicYear, setAcademicYear] = useState(editingSchedule?.academicYear || '')
  const [systemType, setSystemType] = useState<'bi-semester' | 'tri-semester'>(
    editingSchedule?.systemType || 'tri-semester'
  )
  const [semesters, setSemesters] = useState<SemesterDetail[]>(
    editingSchedule?.semesters || []
  )

  const handleAddSemester = () => {
    const semesterTypes = systemType === 'bi-semester' 
      ? ['spring', 'fall'] 
      : ['spring', 'summer', 'fall']
    
    const nextType = semesterTypes[semesters.length % semesterTypes.length] as 'spring' | 'summer' | 'fall'
    
    const newSemester: SemesterDetail = {
      id: Date.now().toString(),
      name: `${nextType.charAt(0).toUpperCase() + nextType.slice(1)} ${academicYear}`,
      type: nextType,
      startDate: '',
      endDate: '',
      registrationStartDate: '',
      registrationEndDate: '',
      classStartDate: '',
      classEndDate: '',
      midtermStartDate: '',
      midtermEndDate: '',
      finalExamStartDate: '',
      finalExamEndDate: '',
      resultPublishDate: '',
      status: 'upcoming'
    }
    
    setSemesters([...semesters, newSemester])
  }

  const handleUpdateSemester = (index: number, field: string, value: string) => {
    const updatedSemesters = [...semesters]
    updatedSemesters[index] = { ...updatedSemesters[index], [field]: value }
    setSemesters(updatedSemesters)
  }

  const handleRemoveSemester = (index: number) => {
    setSemesters(semesters.filter((_, i) => i !== index))
  }

  const handleSave = () => {
    // Mock save functionality
    alert('Semester schedule saved successfully!')
    onClose()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800'
      case 'registration': return 'bg-yellow-100 text-yellow-800'
      case 'ongoing': return 'bg-green-100 text-green-800'
      case 'exam': return 'bg-purple-100 text-purple-800'
      case 'completed': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>
            {editingSchedule ? 'Edit Semester Schedule' : 'Create New Semester Schedule'}
          </CardTitle>
          <CardDescription>
            Set up semester timeline for the academic year
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="academicYear">Academic Year</Label>
              <Input
                id="academicYear"
                placeholder="e.g., 2025"
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="systemType">System Type</Label>
              <Select value={systemType} onValueChange={(value: 'bi-semester' | 'tri-semester') => setSystemType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bi-semester">Bi-Semester (Spring & Fall)</SelectItem>
                  <SelectItem value="tri-semester">Tri-Semester (Spring, Summer & Fall)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Semester Details</h3>
            <Button onClick={handleAddSemester} disabled={!academicYear} className="flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Add Semester</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Semester Configuration */}
      {semesters.map((semester, index) => (
        <Card key={semester.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="w-5 h-5" />
                <span>{semester.name}</span>
                <Badge className={getStatusColor(semester.status)}>
                  {semester.status}
                </Badge>
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleRemoveSemester(index)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Semester Start Date</Label>
                <Input
                  type="date"
                  value={semester.startDate}
                  onChange={(e) => handleUpdateSemester(index, 'startDate', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Semester End Date</Label>
                <Input
                  type="date"
                  value={semester.endDate}
                  onChange={(e) => handleUpdateSemester(index, 'endDate', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Status</Label>
                <Select 
                  value={semester.status} 
                  onValueChange={(value) => handleUpdateSemester(index, 'status', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                    <SelectItem value="registration">Registration</SelectItem>
                    <SelectItem value="ongoing">Ongoing</SelectItem>
                    <SelectItem value="exam">Exam Period</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-medium text-sm text-gray-700 mb-3">Important Dates</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs">Registration Start</Label>
                  <Input
                    type="date"
                    value={semester.registrationStartDate}
                    onChange={(e) => handleUpdateSemester(index, 'registrationStartDate', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-xs">Registration End</Label>
                  <Input
                    type="date"
                    value={semester.registrationEndDate}
                    onChange={(e) => handleUpdateSemester(index, 'registrationEndDate', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-xs">Classes Start</Label>
                  <Input
                    type="date"
                    value={semester.classStartDate}
                    onChange={(e) => handleUpdateSemester(index, 'classStartDate', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-xs">Classes End</Label>
                  <Input
                    type="date"
                    value={semester.classEndDate}
                    onChange={(e) => handleUpdateSemester(index, 'classEndDate', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-xs">Midterm Start</Label>
                  <Input
                    type="date"
                    value={semester.midtermStartDate}
                    onChange={(e) => handleUpdateSemester(index, 'midtermStartDate', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-xs">Midterm End</Label>
                  <Input
                    type="date"
                    value={semester.midtermEndDate}
                    onChange={(e) => handleUpdateSemester(index, 'midtermEndDate', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-xs">Final Exam Start</Label>
                  <Input
                    type="date"
                    value={semester.finalExamStartDate}
                    onChange={(e) => handleUpdateSemester(index, 'finalExamStartDate', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-xs">Final Exam End</Label>
                  <Input
                    type="date"
                    value={semester.finalExamEndDate}
                    onChange={(e) => handleUpdateSemester(index, 'finalExamEndDate', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <Label className="text-xs">Result Publish Date</Label>
                  <Input
                    type="date"
                    value={semester.resultPublishDate}
                    onChange={(e) => handleUpdateSemester(index, 'resultPublishDate', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleSave} className="flex items-center space-x-2">
          <Save className="w-4 h-4" />
          <span>{editingSchedule ? 'Update' : 'Create'} Schedule</span>
        </Button>
      </div>
    </div>
  )
}

function SchedulesList({ 
  schedules, 
  onEdit 
}: { 
  schedules: SemesterSchedule[];
  onEdit: (schedule: SemesterSchedule) => void;
}) {
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active': return 'default'
      case 'draft': return 'secondary'
      case 'completed': return 'outline'
      default: return 'secondary'
    }
  }

  const handleDelete = (scheduleId: string) => {
    if (confirm('Are you sure you want to delete this schedule?')) {
      alert(`Schedule ${scheduleId} deleted successfully!`)
    }
  }

  const handleExport = (schedule: SemesterSchedule) => {
    alert(`Exporting schedule for ${schedule.academicYear}...`)
  }

  return (
    <div className="space-y-4">
      {schedules.map(schedule => (
        <Card key={schedule.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5" />
                  <span>Academic Year {schedule.academicYear}</span>
                  <Badge variant={getStatusBadgeVariant(schedule.status)}>
                    {schedule.status}
                  </Badge>
                  <Badge variant="outline">
                    {schedule.systemType}
                  </Badge>
                </CardTitle>
                <CardDescription>
                  Created on {new Date(schedule.createdDate).toLocaleDateString()} by {schedule.createdBy}
                </CardDescription>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExport(schedule)}
                  className="flex items-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Export</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(schedule)}
                  className="flex items-center space-x-2"
                >
                  <Edit2 className="w-4 h-4" />
                  <span>Edit</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(schedule.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {schedule.semesters.map(semester => (
                <div key={semester.id} className="border rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{semester.name}</h4>
                    <Badge className={`text-xs ${
                      semester.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                      semester.status === 'registration' ? 'bg-yellow-100 text-yellow-800' :
                      semester.status === 'ongoing' ? 'bg-green-100 text-green-800' :
                      semester.status === 'exam' ? 'bg-purple-100 text-purple-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {semester.status}
                    </Badge>
                  </div>
                  <div className="text-xs text-gray-600 space-y-1">
                    <div className="flex justify-between">
                      <span>Duration:</span>
                      <span>{new Date(semester.startDate).toLocaleDateString()} - {new Date(semester.endDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Registration:</span>
                      <span>{new Date(semester.registrationStartDate).toLocaleDateString()} - {new Date(semester.registrationEndDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Classes:</span>
                      <span>{new Date(semester.classStartDate).toLocaleDateString()} - {new Date(semester.classEndDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default function SemesterScheduleManagement() {
  const schedules = mockSchedules
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingSchedule, setEditingSchedule] = useState<SemesterSchedule | undefined>()
  const [filterYear, setFilterYear] = useState('')
  const [filterStatus, setFilterStatus] = useState('')

  const filteredSchedules = schedules.filter(schedule => {
    const matchesYear = !filterYear || schedule.academicYear.includes(filterYear)
    const matchesStatus = !filterStatus || schedule.status === filterStatus
    return matchesYear && matchesStatus
  })

  const handleEdit = (schedule: SemesterSchedule) => {
    setEditingSchedule(schedule)
    setShowCreateForm(true)
  }

  const handleCloseForm = () => {
    setShowCreateForm(false)
    setEditingSchedule(undefined)
  }

  const uniqueYears = [...new Set(schedules.map(s => s.academicYear))].sort()

  if (showCreateForm) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-deep-plum">
              {editingSchedule ? 'Edit' : 'Create'} Semester Schedule
            </h1>
            <p className="text-gray-600 mt-1">
              {editingSchedule ? 'Modify existing' : 'Set up new'} academic semester timeline
            </p>
          </div>
        </div>
        
        <CreateScheduleForm onClose={handleCloseForm} editingSchedule={editingSchedule} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-deep-plum">Semester Schedule Management</h1>
          <p className="text-gray-600 mt-1">Create and manage academic semester schedules</p>
        </div>
        <Button 
          onClick={() => setShowCreateForm(true)}
          className="flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Schedule</span>
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Schedules</p>
                <p className="text-2xl font-bold text-deep-plum">{schedules.length}</p>
              </div>
              <Calendar className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Schedules</p>
                <p className="text-2xl font-bold text-green-600">
                  {schedules.filter(s => s.status === 'active').length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Draft Schedules</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {schedules.filter(s => s.status === 'draft').length}
                </p>
              </div>
              <AlertCircle className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tri-Semester</p>
                <p className="text-2xl font-bold text-purple-600">
                  {schedules.filter(s => s.systemType === 'tri-semester').length}
                </p>
              </div>
              <Settings className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <div className="space-y-2">
              <Label htmlFor="filterYear">Academic Year</Label>
              <Select value={filterYear} onValueChange={setFilterYear}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="All Years" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Years</SelectItem>
                  {uniqueYears.map(year => (
                    <SelectItem key={year} value={year}>{year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="filterStatus">Status</Label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Statuses</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Schedules List */}
      <Card>
        <CardHeader>
          <CardTitle>Academic Schedules</CardTitle>
          <CardDescription>
            {filteredSchedules.length} schedule(s) found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredSchedules.length > 0 ? (
            <SchedulesList schedules={filteredSchedules} onEdit={handleEdit} />
          ) : (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Schedules Found</h3>
              <p className="text-gray-500 mb-4">
                No academic schedules match your current filter criteria
              </p>
              <Button onClick={() => setShowCreateForm(true)}>
                Create First Schedule
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
