import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { FileDown, Printer, Eye } from 'lucide-react'
import { TRAINING_PROGRAMS, TRAINING_SESSIONS, NOMINATIONS, type TrainingProgram } from '@/lib/hrmDemoSeed'

export default function TrainingCalendar() {
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'list'>('list')
  const [selectedDept, setSelectedDept] = useState('all')
  const [selectedAudience, setSelectedAudience] = useState('all')
  const [selectedType, setSelectedType] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedMode, setSelectedMode] = useState('all')
  const [viewProgram, setViewProgram] = useState<TrainingProgram | null>(null)
  const [showParticipantsModal, setShowParticipantsModal] = useState(false)

  const filteredPrograms = TRAINING_PROGRAMS.filter(p => {
    if (selectedDept !== 'all' && p.dept !== selectedDept) return false
    if (selectedAudience !== 'all' && p.audience !== selectedAudience) return false
    if (selectedType !== 'all' && p.type !== selectedType) return false
    if (selectedStatus !== 'all' && p.status !== selectedStatus) return false
    if (selectedMode !== 'all' && p.mode !== selectedMode) return false
    return true
  })

  const getStatusBadge = (status: TrainingProgram['status']) => {
    const variants = {
      Upcoming: 'bg-yellow-100 text-yellow-800',
      Ongoing: 'bg-blue-100 text-blue-800',
      Completed: 'bg-green-100 text-green-800'
    }
    return variants[status]
  }

  const programSessions = viewProgram 
    ? TRAINING_SESSIONS.filter(s => s.trainingId === viewProgram.id)
    : []

  const programNominations = viewProgram
    ? NOMINATIONS.filter(n => n.trainingId === viewProgram.id)
    : []

  const nominatedCount = programNominations.filter(n => n.status === 'Nominated').length
  const approvedCount = programNominations.filter(n => n.status === 'Approved').length
  const rejectedCount = programNominations.filter(n => n.status === 'Rejected').length

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Training Calendar</h2>
          <p className="text-gray-600">Manage training programs and schedules</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <FileDown className="w-4 h-4" />
            Export Calendar (PDF)
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Printer className="w-4 h-4" />
            Print
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Filters</CardTitle>
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                List
              </Button>
              <Button
                variant={viewMode === 'month' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('month')}
              >
                Month
              </Button>
              <Button
                variant={viewMode === 'week' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('week')}
              >
                Week
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Department</label>
              <Select value={selectedDept} onValueChange={setSelectedDept}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  <SelectItem value="CSE">CSE</SelectItem>
                  <SelectItem value="BBA">BBA</SelectItem>
                  <SelectItem value="HR">HR</SelectItem>
                  <SelectItem value="Accounts">Accounts</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Audience</label>
              <Select value={selectedAudience} onValueChange={setSelectedAudience}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="Faculty">Faculty</SelectItem>
                  <SelectItem value="Admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Type</label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Workshop">Workshop</SelectItem>
                  <SelectItem value="Seminar">Seminar</SelectItem>
                  <SelectItem value="Course">Course</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Status</label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Upcoming">Upcoming</SelectItem>
                  <SelectItem value="Ongoing">Ongoing</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Mode</label>
              <Select value={selectedMode} onValueChange={setSelectedMode}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Modes</SelectItem>
                  <SelectItem value="Online">Online</SelectItem>
                  <SelectItem value="On-site">On-site</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPrograms.map((program) => (
          <Card key={program.id} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setViewProgram(program)}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg">{program.title}</CardTitle>
                <Badge className={getStatusBadge(program.status)}>{program.status}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Trainer:</span>
                  <span className="font-medium">{program.trainer}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Mode:</span>
                  <span className="font-medium">{program.mode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-medium">{program.durationDays} days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Capacity:</span>
                  <span className="font-medium">{program.registered}/{program.capacity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Dates:</span>
                  <span className="font-medium text-xs">{program.startDate} to {program.endDate}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Sheet open={!!viewProgram} onOpenChange={() => setViewProgram(null)}>
        <SheetContent className="w-[600px] sm:max-w-[600px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Training Program Details</SheetTitle>
          </SheetHeader>
          {viewProgram && (
            <div className="mt-6 space-y-6">
              <div>
                <h3 className="font-semibold mb-3">Overview</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm text-gray-500">Title</label>
                    <p className="font-medium">{viewProgram.title}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Type</label>
                    <p className="font-medium">{viewProgram.type}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Department</label>
                    <p className="font-medium">{viewProgram.dept}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Audience</label>
                    <p className="font-medium">{viewProgram.audience}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Trainer</label>
                    <p className="font-medium">{viewProgram.trainer}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Mode</label>
                    <p className="font-medium">{viewProgram.mode}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Location</label>
                    <p className="font-medium">{viewProgram.location}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Duration</label>
                    <p className="font-medium">{viewProgram.durationDays} days</p>
                  </div>
                  <div className="col-span-2">
                    <label className="text-sm text-gray-500">Description</label>
                    <p className="text-sm mt-1">{viewProgram.description}</p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">Sessions</h3>
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left">Date</th>
                      <th className="px-3 py-2 text-left">Time</th>
                      <th className="px-3 py-2 text-left">Room</th>
                      <th className="px-3 py-2 text-left">Slot</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {programSessions.map((session) => (
                      <tr key={session.id}>
                        <td className="px-3 py-2">{session.date}</td>
                        <td className="px-3 py-2">{session.startTime} - {session.endTime}</td>
                        <td className="px-3 py-2">{session.room}</td>
                        <td className="px-3 py-2">{session.slotCode}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">Participants</h3>
                  <Button variant="outline" size="sm" onClick={() => setShowParticipantsModal(true)}>
                    View List
                  </Button>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-yellow-50 p-3 rounded">
                    <p className="text-xs text-gray-600">Nominated</p>
                    <p className="text-2xl font-bold text-yellow-600">{nominatedCount}</p>
                  </div>
                  <div className="bg-green-50 p-3 rounded">
                    <p className="text-xs text-gray-600">Approved</p>
                    <p className="text-2xl font-bold text-green-600">{approvedCount}</p>
                  </div>
                  <div className="bg-red-50 p-3 rounded">
                    <p className="text-xs text-gray-600">Rejected</p>
                    <p className="text-2xl font-bold text-red-600">{rejectedCount}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button className="flex-1">Nominate Employee</Button>
                {viewProgram.status !== 'Completed' && (
                  <Button variant="outline" className="flex-1">Mark Attendance</Button>
                )}
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      <Dialog open={showParticipantsModal} onOpenChange={setShowParticipantsModal}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Participants List</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <div className="mb-4 flex justify-end">
              <Button size="sm">Export CSV</Button>
            </div>
            <div className="max-h-96 overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-3 py-2 text-left">Name</th>
                    <th className="px-3 py-2 text-left">Dept</th>
                    <th className="px-3 py-2 text-left">Designation</th>
                    <th className="px-3 py-2 text-left">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {programNominations.map((nom) => (
                    <tr key={nom.id}>
                      <td className="px-3 py-2">{nom.empName}</td>
                      <td className="px-3 py-2">{nom.dept}</td>
                      <td className="px-3 py-2">{nom.designation}</td>
                      <td className="px-3 py-2">
                        <Badge variant={nom.status === 'Approved' ? 'default' : 'secondary'}>
                          {nom.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
