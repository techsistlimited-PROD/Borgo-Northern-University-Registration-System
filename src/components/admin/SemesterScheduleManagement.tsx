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
  Settings,
  Clock,
  User,
  Info
} from 'lucide-react'

interface SystemAudit {
  dateCreated: string // ISO string with BDT time
  createdBy: string // "ID Name" format
  lastUpdated: string // ISO string with BDT time  
  lastUpdatedBy: string // "ID Name" format
  createdBySession: string // Session ID
  lastUpdatedBySession: string // Session ID
}

interface SemesterSchedule {
  id: string
  academicYear: string
  semesterType: 'Tri-Semester' | 'Bi-Semester'
  
  // Registration dates with time
  registrationStartDate: string // DateTime
  registrationEndDate: string // DateTime
  
  // Class dates (date only)
  classStartDate: string
  classEndDate: string
  
  // Payment dates (date only)
  firstInstallmentLastDate: string
  secondInstallmentLastDate: string
  thirdInstallmentLastDate: string
  
  // Mid Term dates (date only)
  midTermStartDate: string
  midTermLastDate: string
  
  // First Exam dates (date only)
  firstExamStartDate: string
  firstExamLastDate: string
  
  // TER fill up dates (date only)
  terFillUpStartDate: string
  terFillUpLastDate: string
  
  // Add/Drop dates (date only)
  addDropStartDate: string
  addDropLastDate: string
  
  // Semester Drop date (date only)
  semesterDropLastDate: string
  
  status: 'draft' | 'active' | 'completed'
  
  // System audit information
  systemAudit: SystemAudit
}

// Mock data with system audit information
const mockSchedules: SemesterSchedule[] = [
  {
    id: '1',
    academicYear: '2024',
    semesterType: 'Tri-Semester',
    registrationStartDate: '2024-01-01T00:01:00+06:00',
    registrationEndDate: '2024-01-10T23:59:00+06:00',
    classStartDate: '2024-01-15',
    classEndDate: '2024-04-15',
    firstInstallmentLastDate: '2024-01-20',
    secondInstallmentLastDate: '2024-02-20',
    thirdInstallmentLastDate: '2024-03-20',
    midTermStartDate: '2024-03-01',
    midTermLastDate: '2024-03-10',
    firstExamStartDate: '2024-04-20',
    firstExamLastDate: '2024-04-28',
    terFillUpStartDate: '2024-04-01',
    terFillUpLastDate: '2024-04-15',
    addDropStartDate: '2024-01-15',
    addDropLastDate: '2024-01-25',
    semesterDropLastDate: '2024-02-15',
    status: 'active',
    systemAudit: {
      dateCreated: '2023-12-01T10:30:00+06:00',
      createdBy: 'ADM001 John Admin',
      lastUpdated: '2024-01-05T14:20:00+06:00',
      lastUpdatedBy: 'ADM002 Sarah Manager',
      createdBySession: 'SES_2023120110301234',
      lastUpdatedBySession: 'SES_2024010514205678'
    }
  },
  {
    id: '2',
    academicYear: '2025',
    semesterType: 'Bi-Semester',
    registrationStartDate: '2025-01-01T00:01:00+06:00',
    registrationEndDate: '2025-01-10T23:59:00+06:00',
    classStartDate: '2025-01-15',
    classEndDate: '2025-05-15',
    firstInstallmentLastDate: '2025-01-20',
    secondInstallmentLastDate: '2025-03-20',
    thirdInstallmentLastDate: '',
    midTermStartDate: '2025-03-15',
    midTermLastDate: '2025-03-25',
    firstExamStartDate: '2025-05-20',
    firstExamLastDate: '2025-05-28',
    terFillUpStartDate: '2025-05-01',
    terFillUpLastDate: '2025-05-15',
    addDropStartDate: '2025-01-15',
    addDropLastDate: '2025-01-25',
    semesterDropLastDate: '2025-03-01',
    status: 'draft',
    systemAudit: {
      dateCreated: '2024-10-15T09:15:00+06:00',
      createdBy: 'ADM001 John Admin',
      lastUpdated: '2024-11-20T16:45:00+06:00',
      lastUpdatedBy: 'ADM001 John Admin',
      createdBySession: 'SES_2024101509151234',
      lastUpdatedBySession: 'SES_2024112016455678'
    }
  }
]

// Helper function to format BDT datetime
const formatBDTDateTime = (isoString: string) => {
  const date = new Date(isoString)
  return date.toLocaleString('en-BD', {
    timeZone: 'Asia/Dhaka',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  }) + ' BDT'
}

// Helper function to get current user (mock)
const getCurrentUser = () => ({ id: 'ADM001', name: 'John Admin' })
const getCurrentSessionId = () => `SES_${Date.now()}`

function CreateScheduleForm({ 
  onClose, 
  editingSchedule 
}: { 
  onClose: () => void;
  editingSchedule?: SemesterSchedule;
}) {
  const [formData, setFormData] = useState<Partial<SemesterSchedule>>({
    academicYear: editingSchedule?.academicYear || '',
    semesterType: editingSchedule?.semesterType || 'Tri-Semester',
    registrationStartDate: editingSchedule?.registrationStartDate || '',
    registrationEndDate: editingSchedule?.registrationEndDate || '',
    classStartDate: editingSchedule?.classStartDate || '',
    classEndDate: editingSchedule?.classEndDate || '',
    firstInstallmentLastDate: editingSchedule?.firstInstallmentLastDate || '',
    secondInstallmentLastDate: editingSchedule?.secondInstallmentLastDate || '',
    thirdInstallmentLastDate: editingSchedule?.thirdInstallmentLastDate || '',
    midTermStartDate: editingSchedule?.midTermStartDate || '',
    midTermLastDate: editingSchedule?.midTermLastDate || '',
    firstExamStartDate: editingSchedule?.firstExamStartDate || '',
    firstExamLastDate: editingSchedule?.firstExamLastDate || '',
    terFillUpStartDate: editingSchedule?.terFillUpStartDate || '',
    terFillUpLastDate: editingSchedule?.terFillUpLastDate || '',
    addDropStartDate: editingSchedule?.addDropStartDate || '',
    addDropLastDate: editingSchedule?.addDropLastDate || '',
    semesterDropLastDate: editingSchedule?.semesterDropLastDate || '',
    status: editingSchedule?.status || 'draft'
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    const currentUser = getCurrentUser()
    const currentTime = new Date().toISOString()
    const sessionId = getCurrentSessionId()
    
    if (editingSchedule) {
      // Update existing schedule
      const updatedSchedule: SemesterSchedule = {
        ...editingSchedule,
        ...formData,
        systemAudit: {
          ...editingSchedule.systemAudit,
          lastUpdated: currentTime,
          lastUpdatedBy: `${currentUser.id} ${currentUser.name}`,
          lastUpdatedBySession: sessionId
        }
      } as SemesterSchedule
      
      alert('Semester schedule updated successfully!')
    } else {
      // Create new schedule
      const newSchedule: SemesterSchedule = {
        ...formData,
        id: Date.now().toString(),
        systemAudit: {
          dateCreated: currentTime,
          createdBy: `${currentUser.id} ${currentUser.name}`,
          lastUpdated: currentTime,
          lastUpdatedBy: `${currentUser.id} ${currentUser.name}`,
          createdBySession: sessionId,
          lastUpdatedBySession: sessionId
        }
      } as SemesterSchedule
      
      alert('Semester schedule created successfully!')
    }
    
    onClose()
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
            Configure semester timeline and important dates
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="academicYear">Academic Year</Label>
              <Input
                id="academicYear"
                placeholder="e.g., 2025"
                value={formData.academicYear}
                onChange={(e) => handleInputChange('academicYear', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="semesterType">Semester Type</Label>
              <Select 
                value={formData.semesterType} 
                onValueChange={(value) => handleInputChange('semesterType', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Tri-Semester">Tri-Semester</SelectItem>
                  <SelectItem value="Bi-Semester">Bi-Semester</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Registration Dates */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="w-5 h-5" />
            <span>Registration Period</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="registrationStartDate">Registration Start Date & Time</Label>
              <Input
                id="registrationStartDate"
                type="datetime-local"
                value={formData.registrationStartDate?.slice(0, 16)}
                onChange={(e) => handleInputChange('registrationStartDate', e.target.value + ':00+06:00')}
              />
              <p className="text-xs text-gray-500">e.g., 13/04/25 12:01 AM</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="registrationEndDate">Registration End Date & Time</Label>
              <Input
                id="registrationEndDate"
                type="datetime-local"
                value={formData.registrationEndDate?.slice(0, 16)}
                onChange={(e) => handleInputChange('registrationEndDate', e.target.value + ':00+06:00')}
              />
              <p className="text-xs text-gray-500">e.g., 13/04/25 12:01 AM</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Class Dates */}
      <Card>
        <CardHeader>
          <CardTitle>Class Period</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="classStartDate">Class Start Date</Label>
              <Input
                id="classStartDate"
                type="date"
                value={formData.classStartDate}
                onChange={(e) => handleInputChange('classStartDate', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="classEndDate">Class End Date</Label>
              <Input
                id="classEndDate"
                type="date"
                value={formData.classEndDate}
                onChange={(e) => handleInputChange('classEndDate', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Dates */}
      <Card>
        <CardHeader>
          <CardTitle>Installment Payment Dates</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstInstallmentLastDate">First Installment Last Date</Label>
              <Input
                id="firstInstallmentLastDate"
                type="date"
                value={formData.firstInstallmentLastDate}
                onChange={(e) => handleInputChange('firstInstallmentLastDate', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="secondInstallmentLastDate">Second Installment Last Date</Label>
              <Input
                id="secondInstallmentLastDate"
                type="date"
                value={formData.secondInstallmentLastDate}
                onChange={(e) => handleInputChange('secondInstallmentLastDate', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="thirdInstallmentLastDate">Third Installment Last Date</Label>
              <Input
                id="thirdInstallmentLastDate"
                type="date"
                value={formData.thirdInstallmentLastDate}
                onChange={(e) => handleInputChange('thirdInstallmentLastDate', e.target.value)}
              />
              <p className="text-xs text-gray-500">Leave empty for Bi-Semester</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mid Term Dates */}
      <Card>
        <CardHeader>
          <CardTitle>Mid Term Period</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="midTermStartDate">Mid Term Start Date</Label>
              <Input
                id="midTermStartDate"
                type="date"
                value={formData.midTermStartDate}
                onChange={(e) => handleInputChange('midTermStartDate', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="midTermLastDate">Mid Term Last Date</Label>
              <Input
                id="midTermLastDate"
                type="date"
                value={formData.midTermLastDate}
                onChange={(e) => handleInputChange('midTermLastDate', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* First Exam Dates */}
      <Card>
        <CardHeader>
          <CardTitle>First Exam Period</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstExamStartDate">First Exam Start Date</Label>
              <Input
                id="firstExamStartDate"
                type="date"
                value={formData.firstExamStartDate}
                onChange={(e) => handleInputChange('firstExamStartDate', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="firstExamLastDate">First Exam Last Date</Label>
              <Input
                id="firstExamLastDate"
                type="date"
                value={formData.firstExamLastDate}
                onChange={(e) => handleInputChange('firstExamLastDate', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* TER Fill Up Dates */}
      <Card>
        <CardHeader>
          <CardTitle>TER Fill Up Period</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="terFillUpStartDate">TER Fill Up Start Date</Label>
              <Input
                id="terFillUpStartDate"
                type="date"
                value={formData.terFillUpStartDate}
                onChange={(e) => handleInputChange('terFillUpStartDate', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="terFillUpLastDate">TER Fill Up Last Date</Label>
              <Input
                id="terFillUpLastDate"
                type="date"
                value={formData.terFillUpLastDate}
                onChange={(e) => handleInputChange('terFillUpLastDate', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add/Drop Dates */}
      <Card>
        <CardHeader>
          <CardTitle>Add/Drop Period</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="addDropStartDate">Add/Drop Start Date</Label>
              <Input
                id="addDropStartDate"
                type="date"
                value={formData.addDropStartDate}
                onChange={(e) => handleInputChange('addDropStartDate', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="addDropLastDate">Add/Drop Last Date</Label>
              <Input
                id="addDropLastDate"
                type="date"
                value={formData.addDropLastDate}
                onChange={(e) => handleInputChange('addDropLastDate', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Semester Drop Date */}
      <Card>
        <CardHeader>
          <CardTitle>Semester Drop</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="semesterDropLastDate">Semester Drop Last Date</Label>
              <Input
                id="semesterDropLastDate"
                type="date"
                value={formData.semesterDropLastDate}
                onChange={(e) => handleInputChange('semesterDropLastDate', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Schedule Status</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value) => handleInputChange('status', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Information (for editing) */}
      {editingSchedule && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Info className="w-5 h-5" />
              <span>System Information</span>
            </CardTitle>
            <CardDescription>
              Automatically collected system data
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <Label className="text-sm font-medium text-gray-600">Date Created</Label>
                  <p className="text-sm">{formatBDTDateTime(editingSchedule.systemAudit.dateCreated)}</p>
                </div>
                
                <div className="bg-gray-50 p-3 rounded-lg">
                  <Label className="text-sm font-medium text-gray-600">Created By</Label>
                  <p className="text-sm">{editingSchedule.systemAudit.createdBy}</p>
                </div>
                
                <div className="bg-gray-50 p-3 rounded-lg">
                  <Label className="text-sm font-medium text-gray-600">Created By Session</Label>
                  <p className="text-sm font-mono text-xs">{editingSchedule.systemAudit.createdBySession}</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <Label className="text-sm font-medium text-gray-600">Last Updated</Label>
                  <p className="text-sm">{formatBDTDateTime(editingSchedule.systemAudit.lastUpdated)}</p>
                </div>
                
                <div className="bg-gray-50 p-3 rounded-lg">
                  <Label className="text-sm font-medium text-gray-600">Last Updated By</Label>
                  <p className="text-sm">{editingSchedule.systemAudit.lastUpdatedBy}</p>
                </div>
                
                <div className="bg-gray-50 p-3 rounded-lg">
                  <Label className="text-sm font-medium text-gray-600">Last Updated By Session</Label>
                  <p className="text-sm font-mono text-xs">{editingSchedule.systemAudit.lastUpdatedBySession}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

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
  onEdit,
  onView
}: {
  schedules: SemesterSchedule[];
  onEdit: (schedule: SemesterSchedule) => void;
  onView: (schedule: SemesterSchedule) => void;
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
    if (confirm('Are you sure you want to delete this schedule? This action cannot be undone.')) {
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
                    {schedule.semesterType}
                  </Badge>
                </CardTitle>
                <CardDescription className="mt-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    <div>Created: {formatBDTDateTime(schedule.systemAudit.dateCreated)}</div>
                    <div>Created by: {schedule.systemAudit.createdBy}</div>
                    <div>Last Updated: {formatBDTDateTime(schedule.systemAudit.lastUpdated)}</div>
                    <div>Updated by: {schedule.systemAudit.lastUpdatedBy}</div>
                  </div>
                </CardDescription>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onView(schedule)}
                  className="flex items-center space-x-2"
                >
                  <Info className="w-4 h-4" />
                  <span>View</span>
                </Button>
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
            <div className="space-y-4">
              {/* Key Dates Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-gray-700">Registration Period</h4>
                  <div className="text-xs text-gray-600">
                    <div>Start: {formatBDTDateTime(schedule.registrationStartDate)}</div>
                    <div>End: {formatBDTDateTime(schedule.registrationEndDate)}</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-gray-700">Class Period</h4>
                  <div className="text-xs text-gray-600">
                    <div>Start: {new Date(schedule.classStartDate).toLocaleDateString()}</div>
                    <div>End: {new Date(schedule.classEndDate).toLocaleDateString()}</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-gray-700">Payment Deadlines</h4>
                  <div className="text-xs text-gray-600">
                    <div>1st: {new Date(schedule.firstInstallmentLastDate).toLocaleDateString()}</div>
                    <div>2nd: {new Date(schedule.secondInstallmentLastDate).toLocaleDateString()}</div>
                    {schedule.thirdInstallmentLastDate && (
                      <div>3rd: {new Date(schedule.thirdInstallmentLastDate).toLocaleDateString()}</div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="border-t border-gray-200 my-4" />
              
              {/* System Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-sm text-gray-700 mb-3 flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>System Audit Trail</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs text-gray-600">
                  <div>
                    <span className="font-medium">Created Session:</span>
                    <div className="font-mono">{schedule.systemAudit.createdBySession}</div>
                  </div>
                  <div>
                    <span className="font-medium">Updated Session:</span>
                    <div className="font-mono">{schedule.systemAudit.lastUpdatedBySession}</div>
                  </div>
                </div>
              </div>
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
  const [filterYear, setFilterYear] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterType, setFilterType] = useState('all')

  const filteredSchedules = schedules.filter(schedule => {
    const matchesYear = filterYear === 'all' || schedule.academicYear.includes(filterYear)
    const matchesStatus = filterStatus === 'all' || schedule.status === filterStatus
    const matchesType = filterType === 'all' || schedule.semesterType === filterType
    return matchesYear && matchesStatus && matchesType
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
              {editingSchedule ? 'Modify existing' : 'Set up new'} academic semester timeline with all required dates
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
          <p className="text-gray-600 mt-1">Create and manage comprehensive academic semester schedules</p>
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
                  {schedules.filter(s => s.semesterType === 'Tri-Semester').length}
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
                  <SelectItem value="all">All Years</SelectItem>
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
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="filterType">Semester Type</Label>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Tri-Semester">Tri-Semester</SelectItem>
                  <SelectItem value="Bi-Semester">Bi-Semester</SelectItem>
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
            {filteredSchedules.length} schedule(s) found with complete audit trail
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
