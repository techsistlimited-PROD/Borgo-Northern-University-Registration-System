import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Shuffle, Download } from 'lucide-react'

export default function SeatPlanGenerator() {
  const [generated, setGenerated] = useState(false)
  const [activeTab, setActiveTab] = useState<'room' | 'student' | 'invigilator'>('room')

  const generateSeatPlan = () => {
    setGenerated(true)
  }

  const roomViewData = [
    { seat: 'A-501 / Seat 01', candidateCode: 'CND-2025-0001', program: 'BSc CSE', section: 'CSE-A' },
    { seat: 'A-501 / Seat 02', candidateCode: 'CND-2025-0144', program: 'BBA', section: 'BBA-B' },
    { seat: 'A-501 / Seat 03', candidateCode: 'CND-2025-0089', program: 'BSc CSE', section: 'CSE-B' },
    { seat: 'A-501 / Seat 04', candidateCode: 'CND-2025-0212', program: 'LLB', section: 'LAW-302' }
  ]

  const studentViewData = [
    { name: 'Ayesha Rahman', id: 'CSE-25-011234', session: '02 Nov 10:00–12:00', room: 'Center A / 501', seat: 'Seat 27' },
    { name: 'Tanvir Ahmed', id: 'BBA-25-004412', session: '02 Nov 10:00–12:00', room: 'Center A / 501', seat: 'Seat 14' },
    { name: 'Nishat Sultana', id: 'LLB-24-000771', session: '02 Nov 10:00–12:00', room: 'Center B / Auditorium', seat: 'Seat 42' }
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-deep-plum">Seat Plan Generator</h1>
          <p className="text-sm text-gray-600 mt-1">Generate and manage examination seating arrangements</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Configuration</CardTitle>
          <CardDescription>Select session and room parameters</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Session</label>
              <select className="w-full p-2 border rounded-md">
                <option>02 Nov 2025 · 10:00–12:00</option>
                <option>02 Nov 2025 · 14:00–16:00</option>
                <option>03 Nov 2025 · 10:00–12:00</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Available Rooms</label>
            <div className="space-y-2">
              {[
                { name: 'Center A / Room 501', capacity: 50 },
                { name: 'Center A / Room 502', capacity: 48 },
                { name: 'Center B / Auditorium', capacity: 120 }
              ].map((room) => (
                <div key={room.name} className="flex items-center space-x-2 p-2 border rounded-md">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span className="text-sm flex-1">{room.name}</span>
                  <Badge variant="outline">Capacity: {room.capacity}</Badge>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Pattern Rules</label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <input type="checkbox" defaultChecked className="rounded" />
                <span className="text-sm">Alternate by Program/Section</span>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" defaultChecked className="rounded" />
                <span className="text-sm">Keep special accommodation seats front-left</span>
              </div>
            </div>
          </div>

          <Button onClick={generateSeatPlan} className="nu-button-primary">
            <Shuffle className="w-4 h-4 mr-2" />
            Generate Seat Plan
          </Button>
        </CardContent>
      </Card>

      {generated && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Generated Seat Plan</CardTitle>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export XLSX
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="border-b mb-4">
              <div className="flex space-x-4">
                <button
                  onClick={() => setActiveTab('room')}
                  className={`pb-2 px-1 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'room' ? 'border-deep-plum text-deep-plum' : 'border-transparent text-gray-500'
                  }`}
                >
                  Room View
                </button>
                <button
                  onClick={() => setActiveTab('student')}
                  className={`pb-2 px-1 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'student' ? 'border-deep-plum text-deep-plum' : 'border-transparent text-gray-500'
                  }`}
                >
                  Student View
                </button>
                <button
                  onClick={() => setActiveTab('invigilator')}
                  className={`pb-2 px-1 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'invigilator' ? 'border-deep-plum text-deep-plum' : 'border-transparent text-gray-500'
                  }`}
                >
                  Invigilator Pack
                </button>
              </div>
            </div>

            {activeTab === 'room' && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3 text-sm font-medium text-gray-700">Seat No</th>
                      <th className="text-left p-3 text-sm font-medium text-gray-700">Candidate Code</th>
                      <th className="text-left p-3 text-sm font-medium text-gray-700">Program</th>
                      <th className="text-left p-3 text-sm font-medium text-gray-700">Section</th>
                    </tr>
                  </thead>
                  <tbody>
                    {roomViewData.map((row, idx) => (
                      <tr key={idx} className="border-b hover:bg-gray-50">
                        <td className="p-3 text-sm font-medium">{row.seat}</td>
                        <td className="p-3 text-sm font-mono">{row.candidateCode}</td>
                        <td className="p-3 text-sm">{row.program}</td>
                        <td className="p-3 text-sm">{row.section}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'student' && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3 text-sm font-medium text-gray-700">Student Name</th>
                      <th className="text-left p-3 text-sm font-medium text-gray-700">University ID</th>
                      <th className="text-left p-3 text-sm font-medium text-gray-700">Session Slot</th>
                      <th className="text-left p-3 text-sm font-medium text-gray-700">Assigned Room</th>
                      <th className="text-left p-3 text-sm font-medium text-gray-700">Seat No</th>
                    </tr>
                  </thead>
                  <tbody>
                    {studentViewData.map((row, idx) => (
                      <tr key={idx} className="border-b hover:bg-gray-50">
                        <td className="p-3 text-sm">{row.name}</td>
                        <td className="p-3 text-sm font-mono">{row.id}</td>
                        <td className="p-3 text-sm">{row.session}</td>
                        <td className="p-3 text-sm">{row.room}</td>
                        <td className="p-3 text-sm font-medium">{row.seat}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'invigilator' && (
              <div className="space-y-4">
                <p className="text-sm text-gray-600">Download invigilator packs for examination sessions</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button variant="outline" className="justify-start">
                    <Download className="w-4 h-4 mr-2" />
                    Attendance Sheet PDF
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <Download className="w-4 h-4 mr-2" />
                    Room List PDF
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <Download className="w-4 h-4 mr-2" />
                    Incident Report Template
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
