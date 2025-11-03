import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, Download, Users } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { SEMESTERS, CAMPUSES, PROGRAMS, EXAM_TYPES, ROOMS, INVIGILATORS } from '@/lib/seedData'

export default function InvigilationDuty() {
  const [showAssignModal, setShowAssignModal] = useState(false)
  const [selectedSession, setSelectedSession] = useState<any>(null)

  const sessions = [
    { date: '02 Nov 2025', time: '10:00-12:00', type: 'Final', course: 'CSE 2211 / CSE-A', room: 'AT-303', capacity: 48, invigilators: ['Dr. Nusrat Jahan', 'Engr. Shakil Rahman'], status: 'Scheduled' },
    { date: '02 Nov 2025', time: '10:00-12:00', type: 'Final', course: 'BBA 1102 / BBA-A', room: 'AT-305', capacity: 120, invigilators: ['Prof. Nazmul Karim', 'Farzana Kabir'], status: 'Scheduled' },
    { date: '02 Nov 2025', time: '14:00-16:00', type: 'Final', course: 'LAW 302 / LAW-302', room: 'DHC-201', capacity: 60, invigilators: [], status: 'Unassigned' },
    { date: '03 Nov 2025', time: '10:00-12:00', type: 'Midterm', course: 'CSE 1101 / CSE-B', room: 'AT-303', capacity: 48, invigilators: ['Dr. Tanvir Hasan'], status: 'Scheduled' },
    { date: '03 Nov 2025', time: '14:00-16:00', type: 'Final', course: 'MBA 5107 / MBA-MKT', room: 'SB-N105', capacity: 32, invigilators: ['Prof. Ahmed Khan', 'Dr. Tasnim Rahman'], status: 'Locked' }
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-deep-plum">Invigilation Duty Assignment</h1>
          <p className="text-sm text-gray-600 mt-1">Assign invigilators to examination sessions</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Create Session
          </Button>
          <Button variant="outline">
            <Users className="w-4 h-4 mr-2" />
            Auto-Assign
          </Button>
          <Button className="nu-button-primary">
            <Download className="w-4 h-4 mr-2" />
            Export Duty Sheet
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
          <select className="w-full p-2 border rounded-md text-sm">
            {SEMESTERS.map(sem => (
              <option key={sem.code} value={sem.code}>{sem.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Campus</label>
          <select className="w-full p-2 border rounded-md text-sm">
            {CAMPUSES.map(campus => (
              <option key={campus.code} value={campus.code}>{campus.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Program</label>
          <select className="w-full p-2 border rounded-md text-sm">
            <option>All Programs</option>
            {PROGRAMS.map(prog => (
              <option key={prog.code} value={prog.code}>{prog.code}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Exam Type</label>
          <select className="w-full p-2 border rounded-md text-sm">
            {EXAM_TYPES.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
          <input type="date" className="w-full p-2 border rounded-md text-sm" defaultValue="2025-11-02" />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Exam Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Date</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Time Slot</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Exam Type</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Course / Section</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Room</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Capacity</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Assigned Invigilators</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Status</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((session, idx) => (
                  <tr key={idx} className="border-b hover:bg-gray-50">
                    <td className="p-3 text-sm">{session.date}</td>
                    <td className="p-3 text-sm font-mono">{session.time}</td>
                    <td className="p-3 text-sm">{session.type}</td>
                    <td className="p-3 text-sm font-medium">{session.course}</td>
                    <td className="p-3 text-sm">{session.room}</td>
                    <td className="p-3 text-sm">{session.capacity}</td>
                    <td className="p-3">
                      <div className="flex flex-wrap gap-1">
                        {session.invigilators.length > 0 ? (
                          session.invigilators.map((inv, i) => (
                            <Badge key={i} className="bg-blue-100 text-blue-800 text-xs">{inv}</Badge>
                          ))
                        ) : (
                          <Badge className="bg-red-100 text-red-800 text-xs">Unassigned</Badge>
                        )}
                      </div>
                    </td>
                    <td className="p-3">
                      <Badge className={
                        session.status === 'Locked' ? 'bg-purple-100 text-purple-800' :
                        session.status === 'Unassigned' ? 'bg-red-100 text-red-800' :
                        'bg-green-100 text-green-800'
                      }>
                        {session.status}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setSelectedSession(session)
                          setShowAssignModal(true)
                        }}
                      >
                        Assign
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showAssignModal} onOpenChange={setShowAssignModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Assign Invigilators</DialogTitle>
            <DialogDescription>Assign faculty to examination session</DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-md space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Date:</span>
                <span className="font-medium">{selectedSession?.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Time Slot:</span>
                <span className="font-medium">{selectedSession?.time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Course:</span>
                <span className="font-medium">{selectedSession?.course}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Room:</span>
                <span className="font-medium">{selectedSession?.room} (Cap: {selectedSession?.capacity})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Min Invigilators Required:</span>
                <span className="font-semibold text-deep-plum">
                  {Math.ceil((selectedSession?.capacity || 0) / 60)}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Invigilators</label>
              <div className="border rounded-md p-3 max-h-64 overflow-y-auto space-y-2">
                {INVIGILATORS.map(inv => (
                  <div key={inv.id} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded">
                    <input type="checkbox" id={inv.id} />
                    <label htmlFor={inv.id} className="flex-1 text-sm cursor-pointer">
                      <span className="font-medium">{inv.name}</span>
                      <span className="text-gray-500 ml-2">({inv.dept})</span>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAssignModal(false)}>Cancel</Button>
            <Button variant="outline">Clear Assignments</Button>
            <Button className="nu-button-primary">Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
