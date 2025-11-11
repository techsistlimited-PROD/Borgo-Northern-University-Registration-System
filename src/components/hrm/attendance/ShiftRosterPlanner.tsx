import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { 
  Clock, 
  Plus, 
  Edit, 
  Trash2, 
  Users, 
  Calendar,
  Save,
  X,
  CalendarDays
} from 'lucide-react'
import { HRM_SHIFTS, HRM_ROSTER, HRM_EMPLOYEES, type Shift, type Roster } from '@/lib/hrmStatic'
import { DEMO_MODE, showDemoToast } from '@/config/demo'

type ViewMode = 'shifts' | 'roster'

export default function ShiftRosterPlanner() {
  const [viewMode, setViewMode] = useState<ViewMode>('shifts')
  
  // Shift Management State
  const [shifts, setShifts] = useState<Shift[]>(HRM_SHIFTS)
  const [showShiftDialog, setShowShiftDialog] = useState(false)
  const [editingShift, setEditingShift] = useState<Shift | null>(null)
  const [shiftForm, setShiftForm] = useState({
    id: '',
    name: '',
    start: '',
    end: '',
    type: 'Regular' as 'Regular' | 'Night' | 'Flex',
    campus: '',
    remarks: ''
  })

  // Roster Management State
  const [rosters, setRosters] = useState<Roster[]>(HRM_ROSTER)
  const [showRosterDialog, setShowRosterDialog] = useState(false)
  const [editingRoster, setEditingRoster] = useState<Roster | null>(null)
  const [rosterForm, setRosterForm] = useState({
    dept: '',
    date: '',
    shiftId: '',
    employees: [] as string[]
  })
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedDept, setSelectedDept] = useState('')

  // Get unique departments
  const departments = Array.from(new Set(HRM_EMPLOYEES.map(e => e.department)))

  // Get employees by department
  const getEmployeesByDept = (dept: string) => {
    return HRM_EMPLOYEES.filter(e => e.department === dept)
  }

  // Shift CRUD Operations
  const handleCreateShift = () => {
    setEditingShift(null)
    setShiftForm({
      id: `S${Date.now()}`,
      name: '',
      start: '',
      end: '',
      type: 'Regular',
      campus: '',
      remarks: ''
    })
    setShowShiftDialog(true)
  }

  const handleEditShift = (shift: Shift) => {
    setEditingShift(shift)
    setShiftForm({
      id: shift.id,
      name: shift.name,
      start: shift.start,
      end: shift.end,
      type: shift.type,
      campus: shift.campus,
      remarks: shift.remarks || ''
    })
    setShowShiftDialog(true)
  }

  const handleSaveShift = () => {
    if (DEMO_MODE) {
      if (editingShift) {
        const updated = shifts.map(s => s.id === shiftForm.id ? { ...shiftForm } : s)
        setShifts(updated)
        alert(showDemoToast('Shift updated successfully'))
      } else {
        setShifts([...shifts, { ...shiftForm }])
        alert(showDemoToast('Shift created successfully'))
      }
      setShowShiftDialog(false)
      return
    }
  }

  const handleDeleteShift = (shiftId: string) => {
    if (DEMO_MODE) {
      if (confirm('Are you sure you want to delete this shift?')) {
        setShifts(shifts.filter(s => s.id !== shiftId))
        alert(showDemoToast('Shift deleted successfully'))
      }
    }
  }

  // Roster CRUD Operations
  const handleCreateRoster = () => {
    setEditingRoster(null)
    setRosterForm({
      dept: '',
      date: '',
      shiftId: '',
      employees: []
    })
    setShowRosterDialog(true)
  }

  const handleEditRoster = (roster: Roster) => {
    setEditingRoster(roster)
    setRosterForm({
      dept: roster.dept,
      date: roster.date,
      shiftId: roster.shiftId,
      employees: roster.employees
    })
    setShowRosterDialog(true)
  }

  const handleSaveRoster = () => {
    if (DEMO_MODE) {
      if (editingRoster) {
        const updated = rosters.map(r => 
          r.dept === editingRoster.dept && r.date === editingRoster.date 
            ? { ...rosterForm } 
            : r
        )
        setRosters(updated)
        alert(showDemoToast('Roster updated successfully'))
      } else {
        setRosters([...rosters, { ...rosterForm }])
        alert(showDemoToast('Roster created successfully'))
      }
      setShowRosterDialog(false)
      return
    }
  }

  const handleDeleteRoster = (dept: string, date: string) => {
    if (DEMO_MODE) {
      if (confirm('Are you sure you want to delete this roster?')) {
        setRosters(rosters.filter(r => !(r.dept === dept && r.date === date)))
        alert(showDemoToast('Roster deleted successfully'))
      }
    }
  }

  const toggleEmployeeInRoster = (empId: string) => {
    setRosterForm(prev => ({
      ...prev,
      employees: prev.employees.includes(empId)
        ? prev.employees.filter(id => id !== empId)
        : [...prev.employees, empId]
    }))
  }

  // Filter rosters
  const filteredRosters = rosters.filter(r => {
    if (selectedDate && r.date !== selectedDate) return false
    if (selectedDept && r.dept !== selectedDept) return false
    return true
  })

  // Get shift by ID
  const getShiftById = (id: string) => shifts.find(s => s.id === id)

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-deep-plum">Shift & Roster Planner</h1>
          <p className="text-gray-600 text-sm mt-1">Manage employee shifts and roster assignments</p>
        </div>
        <div className="flex space-x-2">
          <Button
            variant={viewMode === 'shifts' ? 'default' : 'outline'}
            onClick={() => setViewMode('shifts')}
          >
            <Clock className="w-4 h-4 mr-2" />
            Shifts
          </Button>
          <Button
            variant={viewMode === 'roster' ? 'default' : 'outline'}
            onClick={() => setViewMode('roster')}
          >
            <CalendarDays className="w-4 h-4 mr-2" />
            Roster
          </Button>
        </div>
      </div>

      {/* Shift Management View */}
      {viewMode === 'shifts' && (
        <>
          <div className="flex justify-between items-center">
            <div className="grid grid-cols-3 gap-4 flex-1">
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-3xl font-bold text-blue-600">{shifts.length}</p>
                  <p className="text-sm">Total Shifts</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-3xl font-bold text-green-600">
                    {shifts.filter(s => s.type === 'Regular').length}
                  </p>
                  <p className="text-sm">Regular Shifts</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-3xl font-bold text-purple-600">
                    {shifts.filter(s => s.type === 'Night').length}
                  </p>
                  <p className="text-sm">Night Shifts</p>
                </CardContent>
              </Card>
            </div>
            <Button onClick={handleCreateShift} className="ml-4 bg-deep-plum hover:bg-deep-plum/90">
              <Plus className="w-4 h-4 mr-2" />
              Create Shift
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Shift Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Shift ID</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Name</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Type</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Start Time</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">End Time</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Duration</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Campus</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {shifts.map(shift => {
                      const startHour = parseInt(shift.start.split(':')[0])
                      const startMin = parseInt(shift.start.split(':')[1])
                      const endHour = parseInt(shift.end.split(':')[0])
                      const endMin = parseInt(shift.end.split(':')[1])
                      const duration = (endHour * 60 + endMin) - (startHour * 60 + startMin)
                      const durationHours = Math.floor(Math.abs(duration) / 60)
                      const durationMins = Math.abs(duration) % 60

                      return (
                        <tr key={shift.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm font-medium">{shift.id}</td>
                          <td className="px-4 py-3 text-sm">{shift.name}</td>
                          <td className="px-4 py-3 text-sm">
                            <Badge variant={
                              shift.type === 'Regular' ? 'default' : 
                              shift.type === 'Night' ? 'secondary' : 'outline'
                            }>
                              {shift.type}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-sm">{shift.start}</td>
                          <td className="px-4 py-3 text-sm">{shift.end}</td>
                          <td className="px-4 py-3 text-sm">
                            {durationHours}h {durationMins}m
                          </td>
                          <td className="px-4 py-3 text-sm">{shift.campus}</td>
                          <td className="px-4 py-3 text-sm">
                            <div className="flex space-x-1">
                              <Button 
                                size="sm" 
                                variant="ghost"
                                onClick={() => handleEditShift(shift)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost"
                                onClick={() => handleDeleteShift(shift.id)}
                                className="text-red-600"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Roster Management View */}
      {viewMode === 'roster' && (
        <>
          <div className="flex justify-between items-center">
            <div className="flex space-x-4">
              <div>
                <label className="block text-sm font-medium mb-1">Filter by Date</label>
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-48"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Filter by Department</label>
                <select
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                  className="w-48 p-2 border rounded-md"
                >
                  <option value="">All Departments</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
            </div>
            <Button onClick={handleCreateRoster} className="bg-deep-plum hover:bg-deep-plum/90">
              <Plus className="w-4 h-4 mr-2" />
              Create Roster
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-3xl font-bold text-blue-600">{rosters.length}</p>
                <p className="text-sm">Total Rosters</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-3xl font-bold text-green-600">
                  {Array.from(new Set(rosters.map(r => r.date))).length}
                </p>
                <p className="text-sm">Scheduled Days</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-3xl font-bold text-purple-600">
                  {rosters.reduce((acc, r) => acc + r.employees.length, 0)}
                </p>
                <p className="text-sm">Total Assignments</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Roster Assignments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Date</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Department</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Shift</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Time</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Assigned Employees</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Count</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredRosters.map((roster, idx) => {
                      const shift = getShiftById(roster.shiftId)
                      const assignedEmps = roster.employees.map(empId => 
                        HRM_EMPLOYEES.find(e => e.id === empId)
                      ).filter(Boolean)

                      return (
                        <tr key={idx} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm font-medium">
                            {new Date(roster.date).toLocaleDateString('en-GB')}
                          </td>
                          <td className="px-4 py-3 text-sm">{roster.dept}</td>
                          <td className="px-4 py-3 text-sm">
                            <Badge>{shift?.name || roster.shiftId}</Badge>
                          </td>
                          <td className="px-4 py-3 text-sm">
                            {shift ? `${shift.start} - ${shift.end}` : '-'}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <div className="flex flex-wrap gap-1">
                              {assignedEmps.map(emp => emp && (
                                <Badge key={emp.id} variant="outline" className="text-xs">
                                  {emp.name}
                                </Badge>
                              ))}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <Badge variant="secondary">{roster.employees.length}</Badge>
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <div className="flex space-x-1">
                              <Button 
                                size="sm" 
                                variant="ghost"
                                onClick={() => handleEditRoster(roster)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost"
                                onClick={() => handleDeleteRoster(roster.dept, roster.date)}
                                className="text-red-600"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Shift Dialog */}
      <Dialog open={showShiftDialog} onOpenChange={setShowShiftDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingShift ? 'Edit Shift' : 'Create New Shift'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Shift Name *</label>
                <Input
                  value={shiftForm.name}
                  onChange={(e) => setShiftForm({ ...shiftForm, name: e.target.value })}
                  placeholder="e.g., Morning Shift"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Shift Type *</label>
                <select
                  value={shiftForm.type}
                  onChange={(e) => setShiftForm({ ...shiftForm, type: e.target.value as any })}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="Regular">Regular</option>
                  <option value="Night">Night</option>
                  <option value="Flex">Flex</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Start Time *</label>
                <Input
                  type="time"
                  value={shiftForm.start}
                  onChange={(e) => setShiftForm({ ...shiftForm, start: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">End Time *</label>
                <Input
                  type="time"
                  value={shiftForm.end}
                  onChange={(e) => setShiftForm({ ...shiftForm, end: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Campus *</label>
              <select
                value={shiftForm.campus}
                onChange={(e) => setShiftForm({ ...shiftForm, campus: e.target.value })}
                className="w-full p-2 border rounded-md"
              >
                <option value="">Select campus</option>
                <option value="Permanent Campus">Permanent Campus</option>
                <option value="Banani Campus">Banani Campus</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Remarks</label>
              <Input
                value={shiftForm.remarks}
                onChange={(e) => setShiftForm({ ...shiftForm, remarks: e.target.value })}
                placeholder="Optional notes"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-4 border-t">
              <Button variant="outline" onClick={() => setShowShiftDialog(false)}>
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button 
                onClick={handleSaveShift}
                disabled={!shiftForm.name || !shiftForm.start || !shiftForm.end || !shiftForm.campus}
                className="bg-deep-plum hover:bg-deep-plum/90"
              >
                <Save className="w-4 h-4 mr-2" />
                {editingShift ? 'Update' : 'Create'} Shift
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Roster Dialog */}
      <Dialog open={showRosterDialog} onOpenChange={setShowRosterDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingRoster ? 'Edit Roster' : 'Create New Roster'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Date *</label>
                <Input
                  type="date"
                  value={rosterForm.date}
                  onChange={(e) => setRosterForm({ ...rosterForm, date: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Department *</label>
                <select
                  value={rosterForm.dept}
                  onChange={(e) => setRosterForm({ ...rosterForm, dept: e.target.value, employees: [] })}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Select department</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Shift *</label>
              <select
                value={rosterForm.shiftId}
                onChange={(e) => setRosterForm({ ...rosterForm, shiftId: e.target.value })}
                className="w-full p-2 border rounded-md"
              >
                <option value="">Select shift</option>
                {shifts.map(shift => (
                  <option key={shift.id} value={shift.id}>
                    {shift.name} ({shift.start} - {shift.end})
                  </option>
                ))}
              </select>
            </div>

            {rosterForm.dept && (
              <div>
                <label className="block text-sm font-medium mb-2">
                  Assign Employees ({rosterForm.employees.length} selected)
                </label>
                <div className="border rounded-md p-3 max-h-64 overflow-y-auto space-y-2">
                  {getEmployeesByDept(rosterForm.dept).map(emp => (
                    <label 
                      key={emp.id} 
                      className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                    >
                      <input
                        type="checkbox"
                        checked={rosterForm.employees.includes(emp.id)}
                        onChange={() => toggleEmployeeInRoster(emp.id)}
                        className="rounded"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{emp.name}</p>
                        <p className="text-xs text-gray-600">
                          {emp.designation} - {emp.id}
                        </p>
                      </div>
                      <Badge variant="outline">{emp.status}</Badge>
                    </label>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-2 pt-4 border-t">
              <Button variant="outline" onClick={() => setShowRosterDialog(false)}>
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button 
                onClick={handleSaveRoster}
                disabled={!rosterForm.date || !rosterForm.dept || !rosterForm.shiftId || rosterForm.employees.length === 0}
                className="bg-deep-plum hover:bg-deep-plum/90"
              >
                <Save className="w-4 h-4 mr-2" />
                {editingRoster ? 'Update' : 'Create'} Roster
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
