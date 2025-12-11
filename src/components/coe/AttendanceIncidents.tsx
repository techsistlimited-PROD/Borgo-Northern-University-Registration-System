import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AlertTriangle, Save, Lock, FileText } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'

// Sample rosters for different course/room combinations
const ROSTER_DATA: Record<string, any[]> = {
  'CSE 2211 - Data Structures|Center A / Room 501': [
    { seat: '01', candidateCode: 'CND-2025-0001', name: 'Ayesha Rahman', status: 'Present', notes: '' },
    { seat: '02', candidateCode: 'CND-2025-0144', name: 'Nishat Sultana', status: 'Present', notes: '' },
    { seat: '03', candidateCode: 'CND-2025-0089', name: 'Tanvir Ahmed', status: 'Late', notes: '' },
    { seat: '04', candidateCode: 'CND-2025-0212', name: 'Arman Chowdhury', status: 'Absent', notes: '' }
  ],
  'LAW 302 - Constitutional Law|Center B / Room 301': [
    { seat: '01', candidateCode: 'CND-2025-0215', name: 'Fariha Karim', status: 'Present', notes: '' },
    { seat: '02', candidateCode: 'CND-2025-0216', name: 'Rashid Hasan', status: 'Present', notes: '' },
    { seat: '03', candidateCode: 'CND-2025-0217', name: 'Nadia Sultana', status: 'Present', notes: '' },
    { seat: '04', candidateCode: 'CND-2025-0218', name: 'Imran Ahmed', status: 'Late', notes: '' },
    { seat: '05', candidateCode: 'CND-2025-0219', name: 'Sadia Rahman', status: 'Absent', notes: '' }
  ],
  'BBA 1102 - Management|Center B / Auditorium': [
    { seat: '01', candidateCode: 'CND-2025-0301', name: 'Tasneem Haque', status: 'Present', notes: '' },
    { seat: '02', candidateCode: 'CND-2025-0302', name: 'Fahim Khan', status: 'Present', notes: '' },
    { seat: '03', candidateCode: 'CND-2025-0303', name: 'Labiba Chowdhury', status: 'Present', notes: '' },
    { seat: '04', candidateCode: 'CND-2025-0304', name: 'Sakib Mahmud', status: 'Present', notes: '' },
    { seat: '05', candidateCode: 'CND-2025-0305', name: 'Maliha Islam', status: 'Late', notes: '' },
    { seat: '06', candidateCode: 'CND-2025-0306', name: 'Raihan Uddin', status: 'Absent', notes: '' }
  ]
}

export default function AttendanceIncidents() {
  const [selectedDate, setSelectedDate] = useState('2025-11-02')
  const [selectedSession, setSelectedSession] = useState('10:00–12:00')
  const [selectedRoom, setSelectedRoom] = useState('Center B / Room 301')
  const [selectedCourse, setSelectedCourse] = useState('LAW 302 - Constitutional Law')

  const [showIncidentModal, setShowIncidentModal] = useState(false)
  const [selectedIncident, setSelectedIncident] = useState<any>(null)
  const [showNewIncidentModal, setShowNewIncidentModal] = useState(false)
  const [showSubmitConfirmation, setShowSubmitConfirmation] = useState(false)
  const [showExpulsionDialog, setShowExpulsionDialog] = useState(false)
  const [expulsionStudent, setExpulsionStudent] = useState<any>(null)

  const rosterKey = `${selectedCourse}|${selectedRoom}`
  const baseRoster = ROSTER_DATA[rosterKey] || ROSTER_DATA['CSE 2211 - Data Structures|Center A / Room 501']

  const [attendanceRecords, setAttendanceRecords] = useState(baseRoster)

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

    // If status changed to Expelled, prompt for expulsion case
    if (newStatus === 'Expelled') {
      const student = attendanceRecords[index]
      setExpulsionStudent(student)
      setShowExpulsionDialog(true)
    }
  }

  const handlePrintShowCauseLetter = () => {
    window.print()
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
          <input
            type="date"
            className="w-full p-2 border rounded-md text-sm"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Session Time</label>
          <select
            className="w-full p-2 border rounded-md text-sm"
            value={selectedSession}
            onChange={(e) => setSelectedSession(e.target.value)}
          >
            <option>10:00–12:00</option>
            <option>14:00–16:00</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Room</label>
          <select
            className="w-full p-2 border rounded-md text-sm"
            value={selectedRoom}
            onChange={(e) => {
              setSelectedRoom(e.target.value)
              const newKey = `${selectedCourse}|${e.target.value}`
              const newRoster = ROSTER_DATA[newKey] || baseRoster
              setAttendanceRecords(newRoster)
            }}
          >
            <option>Center A / Room 501</option>
            <option>Center B / Room 301</option>
            <option>Center B / Auditorium</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
          <select
            className="w-full p-2 border rounded-md text-sm"
            value={selectedCourse}
            onChange={(e) => {
              setSelectedCourse(e.target.value)
              const newKey = `${e.target.value}|${selectedRoom}`
              const newRoster = ROSTER_DATA[newKey] || baseRoster
              setAttendanceRecords(newRoster)
            }}
          >
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
              <CardDescription>{selectedCourse} | {selectedRoom}</CardDescription>
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
                <span className="font-medium">{selectedCourse}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Room:</span>
                <span className="font-medium">{selectedRoom}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date & Time:</span>
                <span className="font-medium">{selectedDate} | {selectedSession}</span>
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

      <Dialog open={showExpulsionDialog} onOpenChange={setShowExpulsionDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Expulsion Case — Generate Show-Cause Letter</DialogTitle>
            <DialogDescription>
              Student marked as Expelled from examination. Generate and print show-cause notice.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div className="p-4 bg-red-50 border border-red-200 rounded-md">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-red-800">Expulsion Case Initiated</p>
                  <p className="text-red-700 mt-1">
                    This student has been expelled from the current examination. A show-cause letter will be generated.
                    All exam attempts for this session will be nullified and marked as "0" on grade sheets.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Candidate Code:</span>
                <p className="font-medium font-mono">{expulsionStudent?.candidateCode}</p>
              </div>
              <div>
                <span className="text-gray-600">Student Name:</span>
                <p className="font-medium">{expulsionStudent?.name}</p>
              </div>
              <div>
                <span className="text-gray-600">Seat No:</span>
                <p className="font-medium">{expulsionStudent?.seat}</p>
              </div>
              <div>
                <span className="text-gray-600">Exam Session:</span>
                <p className="font-medium">{selectedCourse} - Final Exam</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Expulsion (Required)</label>
              <textarea
                className="w-full p-2 border rounded-md"
                rows={3}
                placeholder="Enter detailed reason (e.g., Found with unauthorized materials, Mobile phone usage, Impersonation...)"
              />
            </div>

            <div className="border-2 border-purple-600 rounded-lg p-6 bg-white print:border-purple-800">
              <div className="text-center mb-6 print:mb-8">
                <h2 className="text-2xl font-bold text-deep-plum">Northern University Bangladesh</h2>
                <p className="text-sm text-gray-600 mt-1">Controller of Examinations</p>
                <div className="mt-4 pt-4 border-t">
                  <h3 className="text-lg font-bold text-red-700">SHOW-CAUSE NOTICE</h3>
                  <p className="text-sm text-gray-600 mt-1">Expulsion from Examination</p>
                </div>
              </div>

              <div className="space-y-4 text-sm">
                <div className="flex justify-between">
                  <div>
                    <strong>Ref No:</strong> COE/EXP/2025/{Math.floor(Math.random() * 1000).toString().padStart(4, '0')}
                  </div>
                  <div>
                    <strong>Date:</strong> {new Date().toLocaleDateString()}
                  </div>
                </div>

                <div className="mt-6 space-y-2">
                  <div><strong>To:</strong> {expulsionStudent?.name}</div>
                  <div><strong>Student ID:</strong> {expulsionStudent?.candidateCode}</div>
                  <div><strong>Examination:</strong> {selectedCourse} (Final Exam)</div>
                  <div><strong>Date & Session:</strong> {selectedDate} | {selectedSession}</div>
                </div>

                <div className="mt-6 leading-relaxed">
                  <p className="font-semibold mb-2">Subject: Show-Cause Notice for Expulsion from Examination</p>

                  <p className="mt-4">Dear Student,</p>

                  <p className="mt-3">
                    This is to inform you that you have been expelled from the above-mentioned examination
                    due to violation of examination rules and regulations. The specific reason for your
                    expulsion is as follows:
                  </p>

                  <div className="my-4 p-3 bg-red-50 border border-red-200 rounded italic">
                    [Reason: To be filled by invigilator]
                  </div>

                  <p className="mt-3">
                    As per university examination policy, this incident constitutes a serious breach of
                    academic integrity. Consequently:
                  </p>

                  <ul className="list-disc ml-6 mt-2 space-y-1">
                    <li>Your examination script for this session has been cancelled</li>
                    <li>You will receive a grade of "0" for this examination attempt</li>
                    <li>This incident will be recorded in your academic file</li>
                    <li>You may be barred from future examinations pending disciplinary review</li>
                  </ul>

                  <p className="mt-4">
                    You are hereby required to submit a written explanation within <strong>7 (seven) days</strong>
                    from the date of this notice, explaining why further disciplinary action should not be taken
                    against you.
                  </p>

                  <p className="mt-3">
                    Failure to respond within the stipulated time will result in ex-parte proceedings.
                  </p>

                  <p className="mt-6">Sincerely,</p>

                  <div className="mt-12 mb-2">
                    <div className="border-t border-gray-400 w-48"></div>
                    <p className="font-semibold mt-1">Controller of Examinations</p>
                    <p className="text-xs text-gray-600">Northern University Bangladesh</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t text-xs text-gray-500">
                <p><strong>CC:</strong> Dean of Faculty, Head of Department, Disciplinary Committee</p>
                <p className="mt-1"><strong>Note:</strong> This is an auto-generated notice. Signature and seal to be affixed before dispatch.</p>
              </div>
            </div>

            <div className="flex justify-end gap-2 print:hidden">
              <Button variant="outline" onClick={() => setShowExpulsionDialog(false)}>Cancel</Button>
              <Button variant="outline" onClick={handlePrintShowCauseLetter}>
                <FileText className="w-4 h-4 mr-2" />
                Print Show-Cause Letter
              </Button>
              <Button className="nu-button-primary" onClick={() => {
                setShowExpulsionDialog(false)
                alert('Expulsion case recorded. Show-cause letter generated. Student exam attempt nullified.')
              }}>
                <AlertTriangle className="w-4 h-4 mr-2" />
                Confirm Expulsion
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
