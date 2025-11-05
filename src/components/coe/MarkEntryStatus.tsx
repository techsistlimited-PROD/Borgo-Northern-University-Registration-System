import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Download, Lock, Unlock, Eye } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useState } from 'react'

export default function MarkEntryStatus() {
  const [selectedSection, setSelectedSection] = useState<any>(null)
  const [showMarksGrid, setShowMarksGrid] = useState(false)

  const markEntries = [
    { code: 'CSE 2211', title: 'Data Structures', section: 'CSE-B', faculty: 'Dr. Nusrat Jahan', students: 48, status: 'Submitted', locked: false, lastUpdate: '02 Nov 2025 · 14:32' },
    { code: 'CSE 2211', title: 'Data Structures', section: 'CSE-A', faculty: 'Dr. Nusrat Jahan', students: 45, status: 'In Progress', locked: false, lastUpdate: '01 Nov 2025 · 09:15' },
    { code: 'BBA 1102', title: 'Principles of Management', section: 'BBA-A', faculty: 'Farzana Kabir', students: 52, status: 'Not Started', locked: false, lastUpdate: '-' },
    { code: 'LAW 302', title: 'Constitutional Law II', section: 'LAW-302', faculty: 'Md. Shakil Rahman', students: 38, status: 'Submitted', locked: true, lastUpdate: '30 Oct 2025 · 16:45' }
  ]

  const marksGridData = [
    { id: 'CSE-25-011234', name: 'Ayesha Rahman', attendance: 10, ct: 18, midterm: 26, final: 35, total: 89, grade: 'A-' },
    { id: 'CSE-25-011255', name: 'Tanvir Ahmed', attendance: 8, ct: 15, midterm: 22, final: 30, total: 75, grade: 'B+' },
    { id: 'BBA-25-004412', name: 'Nishat Sultana', attendance: 9, ct: 19, midterm: 28, final: 38, total: 94, grade: 'A' }
  ]

  const getStatusBadge = (status: string) => {
    const styles: any = {
      'Not Started': 'bg-red-100 text-red-800',
      'In Progress': 'bg-amber-100 text-amber-800',
      'Submitted': 'bg-green-100 text-green-800',
      'Locked': 'bg-purple-100 text-purple-800'
    }
    return <Badge className={styles[status] || 'bg-gray-100 text-gray-800'}>{status}</Badge>
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-deep-plum">Mark Entry Status</h1>
          <p className="text-sm text-gray-600 mt-1">Track faculty mark submission progress</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
          <select className="w-full p-2 border rounded-md text-sm">
            <option>Fall 2025</option>
            <option>Summer 2025</option>
            <option>Spring 2025</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
          <select className="w-full p-2 border rounded-md text-sm">
            <option>All Departments</option>
            <option>CSE</option>
            <option>BBA</option>
            <option>Law</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Course Code</label>
          <input type="text" placeholder="Search..." className="w-full p-2 border rounded-md text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select className="w-full p-2 border rounded-md text-sm">
            <option>All Status</option>
            <option>Not Started</option>
            <option>In Progress</option>
            <option>Submitted</option>
            <option>Locked</option>
          </select>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Mark Submission Overview</CardTitle>
          <CardDescription>View and manage faculty mark entry progress</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Course Code</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Course Title</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Section</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Faculty</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Students</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Status</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Last Update</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {markEntries.map((entry, idx) => (
                  <tr key={idx} className="border-b hover:bg-gray-50">
                    <td className="p-3 text-sm font-medium">{entry.code}</td>
                    <td className="p-3 text-sm">{entry.title}</td>
                    <td className="p-3 text-sm">{entry.section}</td>
                    <td className="p-3 text-sm">{entry.faculty}</td>
                    <td className="p-3 text-sm">{entry.students}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        {getStatusBadge(entry.status)}
                        {entry.locked && <Lock className="w-3 h-3 text-purple-600" />}
                      </div>
                    </td>
                    <td className="p-3 text-sm text-gray-600">{entry.lastUpdate}</td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            setSelectedSection(entry)
                            setShowMarksGrid(true)
                          }}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        {entry.status === 'Submitted' && !entry.locked && (
                          <Button variant="ghost" size="sm" onClick={() => alert('Locking marks for ' + entry.code + ' ' + entry.section)}>
                            <Lock className="w-4 h-4" />
                          </Button>
                        )}
                        {entry.locked && (
                          <Button variant="ghost" size="sm" onClick={() => alert('Unlocking marks for ' + entry.code + ' ' + entry.section)}>
                            <Unlock className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showMarksGrid} onOpenChange={setShowMarksGrid}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Marks Grid: {selectedSection?.code} - {selectedSection?.section}</DialogTitle>
            <DialogDescription>
              Faculty: {selectedSection?.faculty} | Students: {selectedSection?.students}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <Badge>Tab: Audit Trail</Badge>
                <Badge>Tab: Mark Entry</Badge>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Import XLSX
                </Button>
                {selectedSection?.status === 'Submitted' && !selectedSection?.locked && (
                  <Button className="nu-button-primary" size="sm">
                    <Lock className="w-4 h-4 mr-2" />
                    Lock Marks
                  </Button>
                )}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left p-2 font-medium">Student ID</th>
                    <th className="text-left p-2 font-medium">Student Name</th>
                    <th className="text-left p-2 font-medium">Attendance (10)</th>
                    <th className="text-left p-2 font-medium">CT (20)</th>
                    <th className="text-left p-2 font-medium">Midterm (30)</th>
                    <th className="text-left p-2 font-medium">Final (40)</th>
                    <th className="text-left p-2 font-medium">Total (100)</th>
                    <th className="text-left p-2 font-medium">Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {marksGridData.map((row, idx) => (
                    <tr key={idx} className="border-b hover:bg-gray-50">
                      <td className="p-2 font-mono text-xs">{row.id}</td>
                      <td className="p-2">{row.name}</td>
                      <td className="p-2 text-center">{row.attendance}</td>
                      <td className="p-2 text-center">{row.ct}</td>
                      <td className="p-2 text-center">{row.midterm}</td>
                      <td className="p-2 text-center">{row.final}</td>
                      <td className="p-2 text-center font-semibold">{row.total}</td>
                      <td className="p-2">
                        <Badge className="bg-mint-green text-deep-plum">{row.grade}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="text-sm font-medium mb-2">Audit Trail (Recent Changes)</h4>
              <div className="space-y-1 text-xs text-gray-600">
                <p>• 02 Nov 14:32 — Midterm mark for CSE-25-011234 changed 26 → 28 by Dr. Nusrat (Reason: Recheck script)</p>
                <p>• 02 Nov 14:15 — Final mark for CSE-25-011255 changed 28 → 30 by Dr. Nusrat (Reason: Calculation error)</p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
