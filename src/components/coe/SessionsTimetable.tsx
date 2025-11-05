import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Eye, Users, FileText, Download, AlertTriangle } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { useState } from 'react'

export default function SessionsTimetable() {
  const [showSessionPreview, setShowSessionPreview] = useState(false)
  const [showInvigilatorModal, setShowInvigilatorModal] = useState(false)
  const [showPaperModal, setShowPaperModal] = useState(false)
  const [selectedSession, setSelectedSession] = useState<any>(null)

  const sessions = [
    { 
      date: '02 Nov 2025', 
      time: '10:00–12:00', 
      code: 'CSE 2211', 
      title: 'Data Structures', 
      sections: 'CSE-A, CSE-B', 
      rooms: 'Block A-501, A-502', 
      invigilatorsAssigned: true,
      paperStatus: 'Approved'
    },
    { 
      date: '02 Nov 2025', 
      time: '14:00–16:00', 
      code: 'BBA 1102', 
      title: 'Principles of Management', 
      sections: 'BBA-A', 
      rooms: 'Block B-301', 
      invigilatorsAssigned: false,
      paperStatus: 'Pending Moderation'
    },
    { 
      date: '03 Nov 2025', 
      time: '10:00–12:00', 
      code: 'LAW 302', 
      title: 'Constitutional Law II', 
      sections: 'LAW-302', 
      rooms: 'Auditorium', 
      invigilatorsAssigned: true,
      paperStatus: 'Printed'
    }
  ]

  const conflicts = [
    'Faculty double-booked: Dr. Shakil is already invigilator in Room 502',
    'Room capacity exceeded in A-501 (58/50 seats)'
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-deep-plum">Sessions & Timetable</h1>
          <p className="text-sm text-gray-600 mt-1">Build the master exam timetable</p>
        </div>
        <Button className="nu-button-primary">
          <Download className="w-4 h-4 mr-2" />
          Export Duty Sheet PDF
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
          <select className="w-full p-2 border rounded-md">
            <option>Fall 2025</option>
            <option>Summer 2025</option>
            <option>Spring 2025</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Exam Type</label>
          <select className="w-full p-2 border rounded-md">
            <option>Final</option>
            <option>Midterm</option>
            <option>Improvement</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
          <input type="date" className="w-full p-2 border rounded-md" defaultValue="2025-11-02" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Campus / Center</label>
          <select className="w-full p-2 border rounded-md">
            <option>All Centers</option>
            <option>Permanent Campus</option>
            <option>Banani Campus</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Exam Sessions</CardTitle>
              <CardDescription>Manage exam sessions, rooms, and assignments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3 text-sm font-medium text-gray-700">Date</th>
                      <th className="text-left p-3 text-sm font-medium text-gray-700">Time Slot</th>
                      <th className="text-left p-3 text-sm font-medium text-gray-700">Course</th>
                      <th className="text-left p-3 text-sm font-medium text-gray-700">Sections</th>
                      <th className="text-left p-3 text-sm font-medium text-gray-700">Room(s)</th>
                      <th className="text-left p-3 text-sm font-medium text-gray-700">Invigilators</th>
                      <th className="text-left p-3 text-sm font-medium text-gray-700">Paper Status</th>
                      <th className="text-left p-3 text-sm font-medium text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sessions.map((session, idx) => (
                      <tr key={idx} className="border-b hover:bg-gray-50">
                        <td className="p-3 text-sm">{session.date}</td>
                        <td className="p-3 text-sm">{session.time}</td>
                        <td className="p-3 text-sm">
                          <div className="font-medium">{session.code}</div>
                          <div className="text-xs text-gray-600">{session.title}</div>
                        </td>
                        <td className="p-3 text-sm">{session.sections}</td>
                        <td className="p-3 text-sm">{session.rooms}</td>
                        <td className="p-3">
                          {session.invigilatorsAssigned ? (
                            <Badge className="bg-green-100 text-green-800">Yes</Badge>
                          ) : (
                            <Badge className="bg-red-100 text-red-800">No</Badge>
                          )}
                        </td>
                        <td className="p-3 text-sm">{session.paperStatus}</td>
                        <td className="p-3">
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm" onClick={() => { setSelectedSession(session); setShowSessionPreview(true) }}>
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => { setSelectedSession(session); setShowInvigilatorModal(true) }}>
                              <Users className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => { setSelectedSession(session); setShowPaperModal(true) }}>
                              <FileText className="w-4 h-4" />
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
        </div>

        <div>
          <Card className="border-amber-200 bg-amber-50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                Conflict Alerts
              </CardTitle>
              <CardDescription>Issues requiring attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {conflicts.map((conflict, idx) => (
                  <div key={idx} className="p-3 bg-white rounded-md border border-amber-200">
                    <p className="text-sm text-amber-900">{conflict}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 space-y-2">
                <Button variant="outline" className="w-full" size="sm">
                  Publish Session to Portal
                </Button>
                <Button variant="outline" className="w-full" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export Duty Sheet
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={showSessionPreview} onOpenChange={setShowSessionPreview}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Session Preview</DialogTitle>
            <DialogDescription>View session details</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div><strong>Date:</strong> {selectedSession?.date}</div>
            <div><strong>Time:</strong> {selectedSession?.time}</div>
            <div><strong>Course:</strong> {selectedSession?.code} — {selectedSession?.title}</div>
            <div><strong>Sections:</strong> {selectedSession?.sections}</div>
            <div><strong>Rooms:</strong> {selectedSession?.rooms}</div>
            <div><strong>Invigilators Assigned:</strong> {selectedSession?.invigilatorsAssigned ? 'Yes' : 'No'}</div>
            <div><strong>Paper Status:</strong> {selectedSession?.paperStatus}</div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSessionPreview(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showInvigilatorModal} onOpenChange={setShowInvigilatorModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manage Invigilators</DialogTitle>
            <DialogDescription>Assign or view invigilators for this session</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <p className="text-sm">Invigilator assignments for <strong>{selectedSession?.code}</strong> — {selectedSession?.date}</p>
            <ul className="list-disc ml-6">
              <li>Dr. A. Rahman — Room A-501</li>
              <li>Ms. Sultana — Room A-502</li>
            </ul>
            <p className="text-sm text-gray-500">Use the full Invigilation Duty module to make permanent changes.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowInvigilatorModal(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showPaperModal} onOpenChange={setShowPaperModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Exam Paper</DialogTitle>
            <DialogDescription>Preview or download the exam paper</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <p className="text-sm">Paper for <strong>{selectedSession?.code}</strong></p>
            <div className="p-4 bg-gray-50 rounded-md border">[Paper content preview would appear here in production]</div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPaperModal(false)}>Close</Button>
            <Button className="nu-button-primary">Download Paper</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  )
}
