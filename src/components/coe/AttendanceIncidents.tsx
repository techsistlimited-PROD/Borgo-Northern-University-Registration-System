import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AlertTriangle, Save, Lock, FileText } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'

export default function AttendanceIncidents() {
  const [showIncidentModal, setShowIncidentModal] = useState(false)
  const [selectedIncident, setSelectedIncident] = useState<any>(null)
  const [showNewIncidentModal, setShowNewIncidentModal] = useState(false)
  const [showSubmitConfirmation, setShowSubmitConfirmation] = useState(false)
  const [showExpulsionDialog, setShowExpulsionDialog] = useState(false)
  const [expulsionStudent, setExpulsionStudent] = useState<any>(null)
  const [attendanceRecords, setAttendanceRecords] = useState([
    { seat: '01', candidateCode: 'CND-2025-0001', name: 'Ayesha Rahman', status: 'Present', notes: '' },
    { seat: '02', candidateCode: 'CND-2025-0144', name: 'Nishat Sultana', status: 'Present', notes: '' },
    { seat: '03', candidateCode: 'CND-2025-0089', name: 'Tanvir Ahmed', status: 'Late', notes: '' },
    { seat: '04', candidateCode: 'CND-2025-0212', name: 'Arman Chowdhury', status: 'Absent', notes: '' }
  ])

  const handleMarkAllPresent = () => {
    setAttendanceRecords(prev => prev.map(record => ({ ...record, status: 'Present' })))
    alert('All students marked as Present')
  }

  const handleSaveDraft = () => {
    alert('Attendance draft saved successfully')
  }

  const handleSubmitAttendance = () => {
    setShowSubmitConfirmation(true)
  }

  const confirmSubmitAttendance = () => {
    setShowSubmitConfirmation(false)
    alert('Attendance submitted successfully. Lock applied.')
  }

  const handleUpdateStatus = (index: number, newStatus: string) => {
    setAttendanceRecords(prev => {
      const updated = [...prev]
      updated[index].status = newStatus
      return updated
    })
  }

  const handleUpdateNotes = (index: number, notes: string) => {
    setAttendanceRecords(prev => {
      const updated = [...prev]
      updated[index].notes = notes
      return updated
    })
  }

  const attendanceData = attendanceRecords

  const incidents = [
    { 
      id: 'INC-2025-009', 
      room: 'Center A / 501', 
      category: 'Unauthorized Device', 
      candidateCode: 'CND-2025-0144', 
      status: 'Pending Decision', 
      description: 'Student found with mobile phone during exam',
      statusColor: 'bg-red-100 text-red-800'
    },
    { 
      id: 'INC-2025-010', 
      room: 'Center B / Auditorium', 
      category: 'Talking / Disturbance', 
      candidateCode: 'Room-wide', 
      status: 'Decision Applied', 
      description: 'Two students talking during exam',
      statusColor: 'bg-green-100 text-green-800'
    }
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-deep-plum">Attendance & Incidents</h1>
          <p className="text-sm text-gray-600 mt-1">Manage exam attendance and incident reports</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
          <input type="date" className="w-full p-2 border rounded-md text-sm" defaultValue="2025-11-02" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Session Time</label>
          <select className="w-full p-2 border rounded-md text-sm">
            <option>10:00–12:00</option>
            <option>14:00–16:00</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Room</label>
          <select className="w-full p-2 border rounded-md text-sm">
            <option>Center A / Room 501</option>
            <option>Center B / Room 301</option>
            <option>Center B / Auditorium</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
          <select className="w-full p-2 border rounded-md text-sm">
            <option>CSE 2211 - Data Structures</option>
            <option>BBA 1102 - Management</option>
            <option>LAW 302 - Constitutional Law</option>
          </select>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Room Roster & Attendance</CardTitle>
              <CardDescription>CSE 2211 - Data Structures | Center A / Room 501</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleMarkAllPresent}>Mark All Present</Button>
              <Button variant="outline" size="sm" onClick={handleSaveDraft}>
                <Save className="w-4 h-4 mr-2" />
                Save Draft
              </Button>
              <Button className="nu-button-primary" size="sm" onClick={handleSubmitAttendance}>Submit Attendance</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Seat No</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Candidate Code</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Student Name</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Status</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Notes</th>
                </tr>
              </thead>
              <tbody>
                {attendanceData.map((row, idx) => (
                  <tr key={idx} className="border-b hover:bg-gray-50">
                    <td className="p-3 text-sm font-medium">{row.seat}</td>
                    <td className="p-3 text-sm font-mono">{row.candidateCode}</td>
                    <td className="p-3 text-sm">{row.name}</td>
                    <td className="p-3">
                      <select
                        className="p-1 border rounded text-sm"
                        value={row.status}
                        onChange={(e) => handleUpdateStatus(idx, e.target.value)}
                      >
                        <option value="Present">Present</option>
                        <option value="Late">Late</option>
                        <option value="Absent">Absent</option>
                        <option value="Expelled">Expelled</option>
                      </select>
                    </td>
                    <td className="p-3">
                      <input
                        type="text"
                        placeholder="Add notes..."
                        className="p-1 border rounded text-sm w-full"
                        value={row.notes}
                        onChange={(e) => handleUpdateNotes(idx, e.target.value)}
                      />
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
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Incident Reports</CardTitle>
              <CardDescription>View and manage examination incidents</CardDescription>
            </div>
            <Button className="nu-button-primary" size="sm" onClick={() => setShowNewIncidentModal(true)}>
              <AlertTriangle className="w-4 h-4 mr-2" />
              File New Incident
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Ticket ID</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Room</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Category</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Candidate Code</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Description</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Status</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {incidents.map((incident) => (
                  <tr key={incident.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 text-sm font-mono">{incident.id}</td>
                    <td className="p-3 text-sm">{incident.room}</td>
                    <td className="p-3 text-sm">{incident.category}</td>
                    <td className="p-3 text-sm font-mono">{incident.candidateCode}</td>
                    <td className="p-3 text-sm">{incident.description}</td>
                    <td className="p-3">
                      <Badge className={incident.statusColor}>{incident.status}</Badge>
                    </td>
                    <td className="p-3">
                      {incident.status === 'Pending Decision' && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setSelectedIncident(incident)
                            setShowIncidentModal(true)
                          }}
                        >
                          Review
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showIncidentModal} onOpenChange={setShowIncidentModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Incident Resolution: {selectedIncident?.id}</DialogTitle>
            <DialogDescription>
              Review incident details and apply controller decision
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Room:</span>
                <p className="font-medium">{selectedIncident?.room}</p>
              </div>
              <div>
                <span className="text-gray-600">Category:</span>
                <p className="font-medium">{selectedIncident?.category}</p>
              </div>
              <div>
                <span className="text-gray-600">Candidate Code:</span>
                <p className="font-medium font-mono">{selectedIncident?.candidateCode}</p>
              </div>
              <div>
                <span className="text-gray-600">Status:</span>
                <Badge className={selectedIncident?.statusColor}>{selectedIncident?.status}</Badge>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <p className="p-3 bg-gray-50 rounded-md text-sm">{selectedIncident?.description}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Controller Action</label>
              <select className="w-full p-2 border rounded-md">
                <option>Select action...</option>
                <option>Cancel Script</option>
                <option>Deduct Marks (-10)</option>
                <option>Ban Next Midterm</option>
                <option>Warning Only</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Decision Reason (Required)</label>
              <textarea
                className="w-full p-2 border rounded-md"
                rows={3}
                placeholder="Enter reason for decision..."
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowIncidentModal(false)}>Cancel</Button>
              <Button className="nu-button-primary" onClick={() => {
                setShowIncidentModal(false)
                alert('Decision applied successfully')
              }}>Apply Decision</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showNewIncidentModal} onOpenChange={setShowNewIncidentModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>File New Incident</DialogTitle>
            <DialogDescription>
              Report an examination incident or violation
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Room</label>
                <select className="w-full p-2 border rounded-md">
                  <option>Center A / Room 501</option>
                  <option>Center B / Room 301</option>
                  <option>Center B / Auditorium</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select className="w-full p-2 border rounded-md">
                  <option>Unauthorized Device</option>
                  <option>Talking / Disturbance</option>
                  <option>Cheating / Copying</option>
                  <option>Late Arrival</option>
                  <option>Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Candidate Code</label>
              <input
                type="text"
                className="w-full p-2 border rounded-md"
                placeholder="e.g., CND-2025-0144 or 'Room-wide'"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description (Required)</label>
              <textarea
                className="w-full p-2 border rounded-md"
                rows={4}
                placeholder="Provide detailed description of the incident..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Time of Incident</label>
              <input type="time" className="w-full p-2 border rounded-md" />
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowNewIncidentModal(false)}>Cancel</Button>
              <Button className="nu-button-primary" onClick={() => {
                setShowNewIncidentModal(false)
                alert('Incident report filed successfully. Ticket ID will be generated.')
              }}>File Incident</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showSubmitConfirmation} onOpenChange={setShowSubmitConfirmation}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Attendance Submission</DialogTitle>
            <DialogDescription>
              Are you sure you want to submit this attendance? This action will lock the attendance and cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-md">
              <div className="flex items-start gap-2">
                <Lock className="w-5 h-5 text-amber-600 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-amber-800">Attendance will be locked</p>
                  <p className="text-amber-700 mt-1">Once submitted, you will not be able to modify this attendance record.</p>
                </div>
              </div>
            </div>

            <div className="text-sm space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-600">Session:</span>
                <span className="font-medium">CSE 2211 - Data Structures</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Room:</span>
                <span className="font-medium">Center A / Room 501</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Students:</span>
                <span className="font-medium">{attendanceData.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Present:</span>
                <span className="font-medium text-green-600">
                  {attendanceData.filter(r => r.status === 'Present').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Absent:</span>
                <span className="font-medium text-red-600">
                  {attendanceData.filter(r => r.status === 'Absent').length}
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowSubmitConfirmation(false)}>Cancel</Button>
              <Button className="nu-button-primary" onClick={confirmSubmitAttendance}>
                <Lock className="w-4 h-4 mr-2" />
                Submit & Lock
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
