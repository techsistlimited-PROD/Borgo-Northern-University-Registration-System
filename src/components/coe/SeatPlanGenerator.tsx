import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Shuffle, Download } from 'lucide-react'
import { DEMO_MODE, showDemoToast } from '@/config/demo'

export default function SeatPlanGenerator() {
  const [generated, setGenerated] = useState(false)
  const [activeTab, setActiveTab] = useState<'room' | 'student' | 'invigilator'>('room')

  const handleExportXLSX = () => {
    if (DEMO_MODE) {
      alert(showDemoToast('Export seat plan as XLSX'))
      return
    }

    alert('Exporting seat plan as XLSX...')
  }

  const handleAttendanceSheet = () => {
    if (DEMO_MODE) {
      alert(showDemoToast('Download attendance sheet PDF'))
      return
    }

    const printWindow = window.open('', '_blank')
    if (!printWindow) return

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Attendance Sheet</title>
  <style>
    @page { size: A4 portrait; margin: 15mm; }
    body { font-family: Arial, sans-serif; font-size: 10pt; padding: 15px; }
    .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 15px; margin-bottom: 20px; }
    .header h1 { font-size: 18pt; font-weight: bold; margin: 5px 0; }
    .header h2 { font-size: 12pt; margin: 5px 0; color: #666; }
    table { width: 100%; border-collapse: collapse; margin: 15px 0; }
    th, td { border: 1px solid #333; padding: 8px; text-align: left; font-size: 9pt; }
    th { background: #e0e0e0; font-weight: bold; }
    .sig-column { width: 150px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>Northern University Bangladesh</h1>
    <h2>Examination Attendance Sheet</h2>
    <p>Room: [Room Name] | Date: [Date] | Time: [Time Slot]</p>
  </div>
  <table>
    <thead>
      <tr>
        <th style="width: 40px;">No.</th>
        <th>Seat No</th>
        <th>Candidate Code</th>
        <th>Student Name</th>
        <th>Program</th>
        <th class="sig-column">Signature</th>
      </tr>
    </thead>
    <tbody>
      ${roomViewData.map((row, idx) => `
        <tr>
          <td>${idx + 1}</td>
          <td>${row.seat}</td>
          <td>${row.candidateCode}</td>
          <td>[Student Name]</td>
          <td>${row.program}</td>
          <td class="sig-column"></td>
        </tr>
      `).join('')}
    </tbody>
  </table>
  <div style="margin-top: 40px;">
    <p><strong>Invigilator Signature: ________________</strong></p>
    <p><strong>Date/Time: ________________</strong></p>
  </div>
  <script>window.onload = function() { window.print(); }</script>
</body>
</html>
    `

    printWindow.document.write(html)
    printWindow.document.close()
  }

  const handleRoomList = () => {
    if (DEMO_MODE) {
      alert(showDemoToast('Download room list PDF'))
      return
    }

    const printWindow = window.open('', '_blank')
    if (!printWindow) return

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Room List</title>
  <style>
    @page { size: A4 portrait; margin: 15mm; }
    body { font-family: Arial, sans-serif; font-size: 10pt; padding: 15px; }
    .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 15px; margin-bottom: 20px; }
    .header h1 { font-size: 18pt; font-weight: bold; margin: 5px 0; }
    .header h2 { font-size: 12pt; margin: 5px 0; color: #666; }
    table { width: 100%; border-collapse: collapse; margin: 15px 0; }
    th, td { border: 1px solid #333; padding: 6px; text-align: left; font-size: 9pt; }
    th { background: #e0e0e0; font-weight: bold; }
  </style>
</head>
<body>
  <div class="header">
    <h1>Northern University Bangladesh</h1>
    <h2>Examination Room List</h2>
  </div>
  <table>
    <thead>
      <tr>
        <th>Seat No</th>
        <th>Candidate Code</th>
        <th>Program</th>
        <th>Section</th>
      </tr>
    </thead>
    <tbody>
      ${roomViewData.map(row => `
        <tr>
          <td>${row.seat}</td>
          <td>${row.candidateCode}</td>
          <td>${row.program}</td>
          <td>${row.section}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>
  <script>window.onload = function() { window.print(); }</script>
</body>
</html>
    `

    printWindow.document.write(html)
    printWindow.document.close()
  }

  const handleIncidentReport = () => {
    if (DEMO_MODE) {
      alert(showDemoToast('Download incident report template'))
      return
    }

    const printWindow = window.open('', '_blank')
    if (!printWindow) return

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Incident Report Template</title>
  <style>
    @page { size: A4 portrait; margin: 15mm; }
    body { font-family: Arial, sans-serif; font-size: 10pt; padding: 15px; }
    .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 15px; margin-bottom: 20px; }
    .header h1 { font-size: 18pt; font-weight: bold; margin: 5px 0; }
    .header h2 { font-size: 12pt; margin: 5px 0; color: #666; }
    .field { margin: 15px 0; }
    .field label { font-weight: bold; display: block; margin-bottom: 5px; }
    .field-line { border-bottom: 1px solid #333; min-height: 20px; }
    .field-area { border: 1px solid #333; min-height: 100px; padding: 5px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>Northern University Bangladesh</h1>
    <h2>Examination Incident Report</h2>
  </div>
  <div class="field">
    <label>Date:</label>
    <div class="field-line"></div>
  </div>
  <div class="field">
    <label>Exam Session:</label>
    <div class="field-line"></div>
  </div>
  <div class="field">
    <label>Room:</label>
    <div class="field-line"></div>
  </div>
  <div class="field">
    <label>Reported By (Invigilator):</label>
    <div class="field-line"></div>
  </div>
  <div class="field">
    <label>Nature of Incident:</label>
    <div class="field-area"></div>
  </div>
  <div class="field">
    <label>Student(s) Involved (if applicable):</label>
    <div class="field-area"></div>
  </div>
  <div class="field">
    <label>Action Taken:</label>
    <div class="field-area"></div>
  </div>
  <div style="margin-top: 60px;">
    <p><strong>Invigilator Signature: ________________ Date: ________</strong></p>
    <p><strong>Exam Controller Signature: ________________ Date: ________</strong></p>
  </div>
  <script>window.onload = function() { window.print(); }</script>
</body>
</html>
    `

    printWindow.document.write(html)
    printWindow.document.close()
  }

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
              <Button variant="outline" size="sm" onClick={handleExportXLSX}>
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
                  <Button variant="outline" className="justify-start" onClick={handleAttendanceSheet}>
                    <Download className="w-4 h-4 mr-2" />
                    Attendance Sheet PDF
                  </Button>
                  <Button variant="outline" className="justify-start" onClick={handleRoomList}>
                    <Download className="w-4 h-4 mr-2" />
                    Room List PDF
                  </Button>
                  <Button variant="outline" className="justify-start" onClick={handleIncidentReport}>
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
