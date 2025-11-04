import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Plus, Edit, Trash2, Calendar } from 'lucide-react'
import { HRM_SHIFTS, HRM_ROSTER, HRM_EMPLOYEES, type Shift, type Roster } from '@/lib/hrmStatic'

export default function ShiftRosterPlanner() {
  const [shifts, setShifts] = useState<Shift[]>(HRM_SHIFTS)
  const [roster, setRoster] = useState<Roster[]>(HRM_ROSTER)
  const [isAddShiftOpen, setIsAddShiftOpen] = useState(false)
  const [isAssignShiftOpen, setIsAssignShiftOpen] = useState(false)

  const [newShift, setNewShift] = useState<Partial<Shift>>({
    name: '',
    start: '08:30',
    end: '16:30',
    type: 'Regular',
    campus: 'Permanent Campus'
  })

  const handleAddShift = () => {
    if (newShift.name && newShift.start && newShift.end) {
      const shift: Shift = {
        id: `S${shifts.length + 1}`,
        name: newShift.name,
        start: newShift.start,
        end: newShift.end,
        type: newShift.type as 'Regular' | 'Night' | 'Flex',
        campus: newShift.campus || 'Permanent Campus',
        remarks: newShift.remarks
      }
      setShifts([...shifts, shift])
      setIsAddShiftOpen(false)
      setNewShift({ name: '', start: '08:30', end: '16:30', type: 'Regular', campus: 'Permanent Campus' })
    }
  }

  const handleDeleteShift = (id: string) => {
    setShifts(shifts.filter(s => s.id !== id))
  }

  const getShiftById = (id: string) => shifts.find(s => s.id === id)
  const getEmployeeById = (id: string) => HRM_EMPLOYEES.find(e => e.id === id)

  const next7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date('2025-01-20')
    date.setDate(date.getDate() + i)
    return date.toISOString().split('T')[0]
  })

  const depts = ['CSE', 'BBA', 'HR', 'Accounts', 'IT']

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Shift & Roster Planner</h2>
          <p className="text-gray-600">Manage shifts and assign rosters</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isAddShiftOpen} onOpenChange={setIsAddShiftOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4" />
                Add Shift
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Shift</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <label className="text-sm font-medium">Shift Name</label>
                  <Input 
                    value={newShift.name} 
                    onChange={(e) => setNewShift({...newShift, name: e.target.value})}
                    placeholder="e.g. Morning Shift"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Start Time</label>
                    <Input 
                      type="time" 
                      value={newShift.start} 
                      onChange={(e) => setNewShift({...newShift, start: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">End Time</label>
                    <Input 
                      type="time" 
                      value={newShift.end} 
                      onChange={(e) => setNewShift({...newShift, end: e.target.value})}
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Type</label>
                  <Select value={newShift.type} onValueChange={(val) => setNewShift({...newShift, type: val as 'Regular' | 'Night' | 'Flex'})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Regular">Regular</SelectItem>
                      <SelectItem value="Night">Night</SelectItem>
                      <SelectItem value="Flex">Flex</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Campus</label>
                  <Input 
                    value={newShift.campus} 
                    onChange={(e) => setNewShift({...newShift, campus: e.target.value})}
                    placeholder="Permanent Campus"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Remarks</label>
                  <Input 
                    value={newShift.remarks || ''} 
                    onChange={(e) => setNewShift({...newShift, remarks: e.target.value})}
                    placeholder="Optional notes"
                  />
                </div>
                <Button onClick={handleAddShift} className="w-full">Add Shift</Button>
              </div>
            </DialogContent>
          </Dialog>
          <Button variant="outline" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Generate Roster
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Shift List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Start - End</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Campus</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {shifts.map((shift) => (
                  <tr key={shift.id}>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{shift.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{shift.start} - {shift.end}</td>
                    <td className="px-4 py-3">
                      <Badge variant={shift.type === 'Regular' ? 'default' : shift.type === 'Night' ? 'destructive' : 'secondary'}>
                        {shift.type}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{shift.campus}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteShift(shift.id)}>
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>7-Day Roster Calendar</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase border">Department</th>
                  {next7Days.map(date => (
                    <th key={date} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase border">
                      {new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {depts.map(dept => (
                  <tr key={dept}>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 border">{dept}</td>
                    {next7Days.map(date => {
                      const rosterEntry = roster.find(r => r.dept === dept && r.date === date)
                      const shift = rosterEntry ? getShiftById(rosterEntry.shiftId) : null
                      return (
                        <td key={date} className="px-4 py-3 border">
                          {rosterEntry ? (
                            <div className="space-y-1">
                              <Badge className="mb-1">{shift?.name}</Badge>
                              <div className="flex flex-wrap gap-1">
                                {rosterEntry.employees.map(empId => {
                                  const emp = getEmployeeById(empId)
                                  return (
                                    <span key={empId} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                                      {emp?.name.split(' ')[0]}
                                    </span>
                                  )
                                })}
                              </div>
                            </div>
                          ) : (
                            <Button variant="ghost" size="sm" className="text-xs">
                              Assign
                            </Button>
                          )}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
