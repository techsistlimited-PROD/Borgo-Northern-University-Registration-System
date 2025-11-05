import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, Download, Users, X, AlertTriangle, Check } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'

type Invigilator = {
  id: string
  name: string
  initials: string
  dept: string
}

type Session = {
  id: string
  date: string
  slot: string
  slotTime: string
  courseCode: string
  section: string
  courseName: string
  roomCode: string
  roomName: string
  capacity: number
  assignedIds: string[]
  status: 'Draft' | 'Locked'
}

const availableInvigilators: Invigilator[] = [
  { id: 'nj', name: 'Dr. Nusrat Jahan', initials: 'NJ', dept: 'CSE' },
  { id: 'sr', name: 'Engr. Shakil Rahman', initials: 'SR', dept: 'CSE' },
  { id: 'th', name: 'Dr. Tanvir Hasan', initials: 'TH', dept: 'BBA' },
  { id: 'fk', name: 'Ms. Farzana Kabir', initials: 'FK', dept: 'BBA' },
  { id: 'ta', name: 'Prof. Tahmina Akter', initials: 'TA', dept: 'LAW' },
  { id: 'ak', name: 'Dr. Ahmed Karim', initials: 'AK', dept: 'CSE' },
  { id: 'rh', name: 'Dr. Raihan Hossain', initials: 'RH', dept: 'EEE' },
  { id: 'ss', name: 'Ms. Sabrina Sultana', initials: 'SS', dept: 'BBA' }
]

export default function InvigilationDuty() {
  const [showAssignModal, setShowAssignModal] = useState(false)
  const [showStatusModal, setShowStatusModal] = useState(false)
  const [selectedSession, setSelectedSession] = useState<Session | null>(null)
  const [selectedInvigilators, setSelectedInvigilators] = useState<string[]>([])
  const [validationErrors, setValidationErrors] = useState<string[]>([])

  const [sessions, setSessions] = useState<Session[]>([
    { id: '1', date: '2025-11-10', slot: 'Morning', slotTime: '09:00 - 11:00', courseCode: 'CSE1101', section: 'A', courseName: 'Programming Fundamentals', roomCode: 'AT-303', roomName: 'Academic Tower A', capacity: 48, assignedIds: ['nj', 'sr'], status: 'Draft' },
    { id: '2', date: '2025-11-10', slot: 'Afternoon', slotTime: '13:00 - 15:00', courseCode: 'CSE1101', section: 'B', courseName: 'Programming Fundamentals', roomCode: 'AT-305', roomName: 'Academic Tower A', capacity: 120, assignedIds: ['nj', 'sr'], status: 'Locked' },
    { id: '3', date: '2025-11-10', slot: 'Evening', slotTime: '16:00 - 18:00', courseCode: 'CSE1101', section: 'C', courseName: 'Programming Fundamentals', roomCode: 'SB-N105', roomName: 'Science Block North', capacity: 32, assignedIds: ['th', 'fk'], status: 'Locked' },
    { id: '4', date: '2025-11-10', slot: 'Morning', slotTime: '09:00 - 11:00', courseCode: 'CSE1102', section: 'A', courseName: 'Programming Fundamentals Lab', roomCode: 'DHC-201', roomName: 'Dhaka Campus Main', capacity: 60, assignedIds: ['nj', 'sr'], status: 'Locked' },
    { id: '5', date: '2025-11-10', slot: 'Afternoon', slotTime: '13:00 - 15:00', courseCode: 'CSE1102', section: 'B', courseName: 'Programming Fundamentals Lab', roomCode: 'BAN-401', roomName: 'Banani Tower', capacity: 80, assignedIds: ['th', 'fk'], status: 'Locked' },
    { id: '6', date: '2025-11-10', slot: 'Evening', slotTime: '16:00 - 18:00', courseCode: 'CSE2205', section: 'A', courseName: 'Data Structures & Algorithms', roomCode: 'AT-303', roomName: 'Academic Tower A', capacity: 48, assignedIds: ['nj', 'sr'], status: 'Draft' },
    { id: '7', date: '2025-11-10', slot: 'Morning', slotTime: '09:00 - 11:00', courseCode: 'CSE2205', section: 'B', courseName: 'Data Structures & Algorithms', roomCode: 'AT-305', roomName: 'Academic Tower A', capacity: 120, assignedIds: ['nj', 'sr'], status: 'Locked' },
    { id: '8', date: '2025-11-10', slot: 'Afternoon', slotTime: '13:00 - 15:00', courseCode: 'CSE2205', section: 'C', courseName: 'Data Structures & Algorithms', roomCode: 'SB-N105', roomName: 'Science Block North', capacity: 32, assignedIds: ['th', 'fk'], status: 'Locked' },
    { id: '9', date: '2025-11-10', slot: 'Evening', slotTime: '16:00 - 18:00', courseCode: 'CSE2206', section: 'A', courseName: 'Data Structures Lab', roomCode: 'DHC-201', roomName: 'Dhaka Campus Main', capacity: 60, assignedIds: ['nj', 'sr'], status: 'Locked' },
    { id: '10', date: '2025-11-11', slot: 'Morning', slotTime: '09:00 - 11:00', courseCode: 'CSE2206', section: 'B', courseName: 'Data Structures Lab', roomCode: 'BAN-401', roomName: 'Banani Tower', capacity: 80, assignedIds: ['nj', 'sr'], status: 'Locked' },
    { id: '11', date: '2025-11-11', slot: 'Afternoon', slotTime: '13:00 - 15:00', courseCode: 'CSE2303', section: 'A', courseName: 'Digital Logic Design', roomCode: 'AT-303', roomName: 'Academic Tower A', capacity: 48, assignedIds: ['nj', 'sr'], status: 'Draft' },
    { id: '12', date: '2025-11-11', slot: 'Evening', slotTime: '16:00 - 18:00', courseCode: 'CSE2303', section: 'B', courseName: 'Digital Logic Design', roomCode: 'AT-305', roomName: 'Academic Tower A', capacity: 120, assignedIds: ['nj', 'sr'], status: 'Locked' },
    { id: '13', date: '2025-11-11', slot: 'Morning', slotTime: '09:00 - 11:00', courseCode: 'CSE2303', section: 'C', courseName: 'Digital Logic Design', roomCode: 'SB-N105', roomName: 'Science Block North', capacity: 32, assignedIds: ['nj', 'sr'], status: 'Locked' },
    { id: '14', date: '2025-11-11', slot: 'Afternoon', slotTime: '13:00 - 15:00', courseCode: 'CSE2304', section: 'A', courseName: 'Digital Logic Design Lab', roomCode: 'DHC-201', roomName: 'Dhaka Campus Main', capacity: 60, assignedIds: ['nj', 'sr'], status: 'Locked' },
    { id: '15', date: '2025-11-11', slot: 'Evening', slotTime: '16:00 - 18:00', courseCode: 'CSE2304', section: 'B', courseName: 'Digital Logic Design Lab', roomCode: 'BAN-401', roomName: 'Banani Tower', capacity: 80, assignedIds: ['nj', 'sr'], status: 'Locked' },
    { id: '16', date: '2025-11-11', slot: 'Morning', slotTime: '09:00 - 11:00', courseCode: 'CSE3401', section: 'A', courseName: 'Database Management Systems', roomCode: 'AT-303', roomName: 'Academic Tower A', capacity: 48, assignedIds: ['nj', 'sr'], status: 'Draft' },
    { id: '17', date: '2025-11-11', slot: 'Afternoon', slotTime: '13:00 - 15:00', courseCode: 'CSE3401', section: 'B', courseName: 'Database Management Systems', roomCode: 'AT-305', roomName: 'Academic Tower A', capacity: 120, assignedIds: ['nj', 'sr'], status: 'Locked' },
    { id: '18', date: '2025-11-11', slot: 'Evening', slotTime: '16:00 - 18:00', courseCode: 'CSE3401', section: 'C', courseName: 'Database Management Systems', roomCode: 'SB-N105', roomName: 'Science Block North', capacity: 32, assignedIds: ['nj', 'sr'], status: 'Locked' },
    { id: '19', date: '2025-11-12', slot: 'Morning', slotTime: '09:00 - 11:00', courseCode: 'CSE3402', section: 'A', courseName: 'Database Management Systems Lab', roomCode: 'DHC-201', roomName: 'Dhaka Campus Main', capacity: 60, assignedIds: ['nj', 'sr'], status: 'Locked' },
    { id: '20', date: '2025-11-12', slot: 'Afternoon', slotTime: '13:00 - 15:00', courseCode: 'CSE3402', section: 'B', courseName: 'Database Management Systems Lab', roomCode: 'BAN-401', roomName: 'Banani Tower', capacity: 80, assignedIds: ['nj', 'sr'], status: 'Locked' },
    { id: '21', date: '2025-11-12', slot: 'Evening', slotTime: '16:00 - 18:00', courseCode: 'CSE3501', section: 'A', courseName: 'Computer Networks', roomCode: 'AT-303', roomName: 'Academic Tower A', capacity: 48, assignedIds: ['nj', 'sr'], status: 'Draft' },
    { id: '22', date: '2025-11-12', slot: 'Morning', slotTime: '09:00 - 11:00', courseCode: 'CSE3501', section: 'B', courseName: 'Computer Networks', roomCode: 'AT-305', roomName: 'Academic Tower A', capacity: 120, assignedIds: ['nj', 'sr'], status: 'Locked' },
    { id: '23', date: '2025-11-12', slot: 'Afternoon', slotTime: '13:00 - 15:00', courseCode: 'CSE3501', section: 'C', courseName: 'Computer Networks', roomCode: 'SB-N105', roomName: 'Science Block North', capacity: 32, assignedIds: ['nj', 'sr'], status: 'Locked' },
    { id: '24', date: '2025-11-12', slot: 'Evening', slotTime: '16:00 - 18:00', courseCode: 'CSE4601', section: 'A', courseName: 'Software Engineering', roomCode: 'DHC-201', roomName: 'Dhaka Campus Main', capacity: 60, assignedIds: ['nj', 'sr'], status: 'Locked' },
    { id: '25', date: '2025-11-12', slot: 'Morning', slotTime: '09:00 - 11:00', courseCode: 'CSE4601', section: 'B', courseName: 'Software Engineering', roomCode: 'BAN-401', roomName: 'Banani Tower', capacity: 80, assignedIds: ['nj', 'sr'], status: 'Locked' },
    { id: '26', date: '2025-11-12', slot: 'Afternoon', slotTime: '13:00 - 15:00', courseCode: 'CSE4601', section: 'C', courseName: 'Software Engineering', roomCode: 'AT-303', roomName: 'Academic Tower A', capacity: 48, assignedIds: ['nj', 'sr'], status: 'Draft' },
    { id: '27', date: '2025-11-12', slot: 'Evening', slotTime: '16:00 - 18:00', courseCode: 'BUS1101', section: 'A', courseName: 'Principles of Management', roomCode: 'AT-305', roomName: 'Academic Tower A', capacity: 120, assignedIds: ['nj', 'sr'], status: 'Locked' },
    { id: '28', date: '2025-11-13', slot: 'Morning', slotTime: '09:00 - 11:00', courseCode: 'BUS1101', section: 'B', courseName: 'Principles of Management', roomCode: 'SB-N105', roomName: 'Science Block North', capacity: 32, assignedIds: ['nj', 'sr'], status: 'Locked' },
    { id: '29', date: '2025-11-13', slot: 'Afternoon', slotTime: '13:00 - 15:00', courseCode: 'BUS1101', section: 'C', courseName: 'Principles of Management', roomCode: 'DHC-201', roomName: 'Dhaka Campus Main', capacity: 60, assignedIds: ['nj', 'sr'], status: 'Locked' },
    { id: '30', date: '2025-11-13', slot: 'Evening', slotTime: '16:00 - 18:00', courseCode: 'BUS1201', section: 'A', courseName: 'Principles of Accounting', roomCode: 'BAN-401', roomName: 'Banani Tower', capacity: 80, assignedIds: ['ta'], status: 'Locked' }
  ])

  const getInvigilatorsByIds = (ids: string[]) => {
    return ids.map(id => availableInvigilators.find(inv => inv.id === id)).filter(Boolean) as Invigilator[]
  }

  const validateAssignment = (sessionId: string, invigilatorIds: string[]): string[] => {
    const errors: string[] = []
    const session = sessions.find(s => s.id === sessionId)
    if (!session) return errors

    invigilatorIds.forEach(invId => {
      const conflictingSessions = sessions.filter(s => 
        s.id !== sessionId &&
        s.date === session.date &&
        s.slot === session.slot &&
        s.assignedIds.includes(invId)
      )

      if (conflictingSessions.length > 0) {
        const inv = availableInvigilators.find(i => i.id === invId)
        conflictingSessions.forEach(cs => {
          errors.push(
            `${inv?.name} (${inv?.initials}) is already assigned to ${cs.courseCode}-${cs.section} in ${cs.roomCode} at the same time`
          )
        })
      }
    })

    return errors
  }

  const handleOpenAssignModal = (session: Session) => {
    setSelectedSession(session)
    setSelectedInvigilators([...session.assignedIds])
    setValidationErrors([])
    setShowAssignModal(true)
  }

  const handleToggleInvigilator = (invId: string) => {
    setSelectedInvigilators(prev => {
      if (prev.includes(invId)) {
        return prev.filter(id => id !== invId)
      } else {
        return [...prev, invId]
      }
    })
  }

  const handleSaveAssignments = () => {
    if (!selectedSession) return

    const errors = validateAssignment(selectedSession.id, selectedInvigilators)
    
    if (errors.length > 0) {
      setValidationErrors(errors)
      return
    }

    setSessions(prev => prev.map(s => 
      s.id === selectedSession.id 
        ? { ...s, assignedIds: selectedInvigilators }
        : s
    ))

    setShowAssignModal(false)
    alert('Invigilator assignments saved successfully')
  }

  const handleStatusChange = (sessionId: string, newStatus: 'Draft' | 'Locked') => {
    setSessions(prev => prev.map(s => 
      s.id === sessionId 
        ? { ...s, status: newStatus }
        : s
    ))
    setShowStatusModal(false)
    alert(`Status changed to ${newStatus}`)
  }

  const handleOpenStatusModal = (session: Session) => {
    setSelectedSession(session)
    setShowStatusModal(true)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-deep-plum">Invigilation Duty Assignment</h1>
          <p className="text-sm text-gray-600 mt-1">Assign invigilators to examination sessions</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => alert('Creating new session...')}>
            <Plus className="w-4 h-4 mr-2" />
            Create Session
          </Button>
          <Button variant="outline" onClick={() => alert('Auto-assigning invigilators based on availability...')}>
            <Users className="w-4 h-4 mr-2" />
            Auto-Assign
          </Button>
          <Button className="nu-button-primary" onClick={() => alert('Exporting duty sheet as PDF...')}>
            <Download className="w-4 h-4 mr-2" />
            Export Duty Sheet
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Exam Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-medium text-gray-700">Date</th>
                  <th className="text-left p-3 font-medium text-gray-700">Slot</th>
                  <th className="text-left p-3 font-medium text-gray-700">Course/Section</th>
                  <th className="text-left p-3 font-medium text-gray-700">Room</th>
                  <th className="text-left p-3 font-medium text-gray-700">Capacity</th>
                  <th className="text-left p-3 font-medium text-gray-700">Assigned</th>
                  <th className="text-left p-3 font-medium text-gray-700">Status</th>
                  <th className="text-left p-3 font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((session) => {
                  const assignedInvigilators = getInvigilatorsByIds(session.assignedIds)
                  return (
                    <tr key={session.id} className="border-b hover:bg-gray-50">
                      <td className="p-3">{session.date}</td>
                      <td className="p-3">
                        <div className="font-medium">{session.slot}</div>
                        <div className="text-xs text-gray-600">{session.slotTime}</div>
                      </td>
                      <td className="p-3">
                        <div className="font-medium">{session.courseCode} - {session.section}</div>
                        <div className="text-xs text-gray-600">{session.courseName}</div>
                      </td>
                      <td className="p-3">
                        <div className="font-medium">{session.roomCode}</div>
                        <div className="text-xs text-gray-600">{session.roomName}</div>
                      </td>
                      <td className="p-3 text-center">{session.capacity}</td>
                      <td className="p-3">
                        <button 
                          className="text-left hover:bg-gray-100 p-1 rounded transition-colors w-full"
                          onClick={() => handleOpenAssignModal(session)}
                        >
                          {assignedInvigilators.length > 0 ? (
                            <div>
                              <div className="font-medium text-deep-plum">{assignedInvigilators.length}</div>
                              <div className="text-xs text-gray-600">
                                {assignedInvigilators.map(inv => inv.initials).join(', ')}
                              </div>
                            </div>
                          ) : (
                            <Badge className="bg-red-100 text-red-800">Unassigned</Badge>
                          )}
                        </button>
                      </td>
                      <td className="p-3">
                        <button onClick={() => handleOpenStatusModal(session)}>
                          <Badge className={
                            session.status === 'Locked' 
                              ? 'bg-purple-100 text-purple-800 cursor-pointer hover:bg-purple-200' 
                              : 'bg-gray-100 text-gray-800 cursor-pointer hover:bg-gray-200'
                          }>
                            {session.status}
                          </Badge>
                        </button>
                      </td>
                      <td className="p-3">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleOpenAssignModal(session)}
                        >
                          Assign
                        </Button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showAssignModal} onOpenChange={setShowAssignModal}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Assign Invigilators</DialogTitle>
            <DialogDescription>Manage invigilator assignments for this exam session</DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-md space-y-2 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-medium">{selectedSession?.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Slot:</span>
                  <span className="font-medium">{selectedSession?.slot} ({selectedSession?.slotTime})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Course:</span>
                  <span className="font-medium">{selectedSession?.courseCode}-{selectedSession?.section}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Room:</span>
                  <span className="font-medium">{selectedSession?.roomCode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Capacity:</span>
                  <span className="font-medium">{selectedSession?.capacity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Recommended:</span>
                  <span className="font-semibold text-deep-plum">
                    {selectedSession ? Math.ceil(selectedSession.capacity / 40) : 0} invigilators
                  </span>
                </div>
              </div>
            </div>

            {validationErrors.length > 0 && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <h4 className="font-medium text-red-800 mb-2">Assignment Conflicts</h4>
                    <ul className="space-y-1 text-sm text-red-700">
                      {validationErrors.map((error, idx) => (
                        <li key={idx}>• {error}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium text-gray-700">
                  Currently Assigned ({selectedInvigilators.length})
                </label>
                {selectedInvigilators.length > 0 && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSelectedInvigilators([])}
                  >
                    Clear All
                  </Button>
                )}
              </div>
              
              {selectedInvigilators.length > 0 && (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                  <div className="flex flex-wrap gap-2">
                    {selectedInvigilators.map(invId => {
                      const inv = availableInvigilators.find(i => i.id === invId)
                      return inv ? (
                        <Badge key={invId} className="bg-blue-100 text-blue-800 pr-1 flex items-center gap-1">
                          {inv.name} ({inv.initials})
                          <button 
                            onClick={() => handleToggleInvigilator(invId)}
                            className="ml-1 hover:bg-blue-200 rounded-full p-0.5"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ) : null
                    })}
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Available Faculty</label>
              <div className="border rounded-md p-3 max-h-64 overflow-y-auto space-y-1">
                {availableInvigilators.map(inv => {
                  const isSelected = selectedInvigilators.includes(inv.id)
                  const otherSessionsOnSameSlot = sessions.filter(s => 
                    s.id !== selectedSession?.id &&
                    s.date === selectedSession?.date &&
                    s.slot === selectedSession?.slot &&
                    s.assignedIds.includes(inv.id)
                  )
                  const hasConflict = otherSessionsOnSameSlot.length > 0

                  return (
                    <div 
                      key={inv.id} 
                      className={`flex items-center justify-between p-2 rounded cursor-pointer transition-colors ${
                        isSelected ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50'
                      } ${hasConflict ? 'opacity-50' : ''}`}
                      onClick={() => !hasConflict && handleToggleInvigilator(inv.id)}
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <input 
                          type="checkbox" 
                          checked={isSelected}
                          onChange={() => {}}
                          disabled={hasConflict}
                          className="cursor-pointer"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">{inv.name}</span>
                            <Badge className="bg-gray-100 text-gray-700 text-xs">{inv.initials}</Badge>
                            <span className="text-xs text-gray-500">({inv.dept})</span>
                          </div>
                          {hasConflict && (
                            <div className="text-xs text-red-600 mt-1">
                              Already in {otherSessionsOnSameSlot[0].roomCode} at this time
                            </div>
                          )}
                        </div>
                      </div>
                      {isSelected && (
                        <Check className="w-5 h-5 text-blue-600" />
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAssignModal(false)}>Cancel</Button>
            <Button className="nu-button-primary" onClick={handleSaveAssignments}>
              Save Assignments
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showStatusModal} onOpenChange={setShowStatusModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Status</DialogTitle>
            <DialogDescription>Update the status of this exam session</DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="p-3 bg-gray-50 rounded-md text-sm">
              <div className="font-medium">{selectedSession?.courseCode}-{selectedSession?.section}</div>
              <div className="text-gray-600">{selectedSession?.date} • {selectedSession?.slot}</div>
            </div>

            <div className="space-y-3">
              <div 
                className={`p-3 border-2 rounded-md cursor-pointer transition-colors ${
                  selectedSession?.status === 'Draft' ? 'border-gray-400 bg-gray-50' : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => selectedSession && handleStatusChange(selectedSession.id, 'Draft')}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Draft</div>
                    <div className="text-xs text-gray-600">Session is editable, assignments can be changed</div>
                  </div>
                  {selectedSession?.status === 'Draft' && (
                    <Check className="w-5 h-5 text-green-600" />
                  )}
                </div>
              </div>

              <div 
                className={`p-3 border-2 rounded-md cursor-pointer transition-colors ${
                  selectedSession?.status === 'Locked' ? 'border-purple-400 bg-purple-50' : 'border-gray-200 hover:border-purple-300'
                }`}
                onClick={() => selectedSession && handleStatusChange(selectedSession.id, 'Locked')}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Locked</div>
                    <div className="text-xs text-gray-600">Session is finalized, assignments are locked</div>
                  </div>
                  {selectedSession?.status === 'Locked' && (
                    <Check className="w-5 h-5 text-green-600" />
                  )}
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowStatusModal(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
