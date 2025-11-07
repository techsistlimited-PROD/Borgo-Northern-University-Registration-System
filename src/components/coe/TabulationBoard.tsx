import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Eye, Download, CheckCircle, XCircle, AlertTriangle, Edit3 } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useState } from 'react'
import { RESULT_CORRECTION_QUEUE } from '@/coe/data/resultCorrectionQueue'

export default function TabulationBoard() {
  const [showSheetModal, setShowSheetModal] = useState(false)
  const [selectedProgram, setSelectedProgram] = useState<any>(null)
  const [showOnlyCorrected, setShowOnlyCorrected] = useState(false)

  const appliedCorrections = RESULT_CORRECTION_QUEUE.filter(c => c.status === 'Approved' || c.auditTrail.some(a => a.action === 'Applied'))
  const correctedStudentIds = new Set(appliedCorrections.map(c => c.studentId))

  const tabulationData = [
    {
      program: 'BSc CSE',
      semester: 'Fall 2025',
      sections: 24,
      avgGPA: 3.42,
      passPercent: 82,
      failPercent: 18,
      status: 'Board Approved',
      statusColor: 'bg-green-100 text-green-800'
    },
    {
      program: 'BBA',
      semester: 'Fall 2025',
      sections: 14,
      avgGPA: 3.11,
      passPercent: 78,
      failPercent: 22,
      status: 'Pending Board Approval',
      statusColor: 'bg-amber-100 text-amber-800'
    },
    {
      program: 'LLB (Hons)',
      semester: 'Fall 2025',
      sections: 12,
      avgGPA: 3.28,
      passPercent: 85,
      failPercent: 15,
      status: 'Published',
      statusColor: 'bg-blue-100 text-blue-800'
    }
  ]

  const tabulationSheetData = [
    { id: 'CSE-25-011234', name: 'Ayesha Rahman', cse2211: 'A-', cse2203: 'B+', mat1101: 'A', totalMarks: 267, gpa: 3.61, result: 'Passed', hasCorrectionapplied: false },
    { id: 'CSE-25-011255', name: 'Tanvir Ahmed', cse2211: 'B+', cse2203: 'A-', mat1101: 'B', totalMarks: 245, gpa: 3.28, result: 'Passed', hasCorrectionApplied: false },
    { id: 'STU-2023-0004', name: 'Raihan Ahmed', cse2211: 'A-', cse2203: 'A-', mat1101: 'B+', totalMarks: 256, gpa: 3.45, result: 'Passed', hasCorrectionApplied: true }
  ].map(row => ({
    ...row,
    hasCorrectionApplied: correctedStudentIds.has(row.id)
  }))

  const filteredSheetData = showOnlyCorrected
    ? tabulationSheetData.filter(row => row.hasCorrectionApplied)
    : tabulationSheetData

  const discrepancies = [
    '2 cases where Midterm vs Final scaling looks off',
    '1 student marked as "Absent Final" but grade not F/AB'
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-deep-plum">Tabulation Board</h1>
          <p className="text-sm text-gray-600 mt-1">Finalize results and board approval</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Program</label>
          <select className="w-full p-2 border rounded-md">
            <option>All Programs</option>
            <option>BSc CSE</option>
            <option>BBA</option>
            <option>LLB</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
          <select className="w-full p-2 border rounded-md">
            <option>Fall 2025</option>
            <option>Summer 2025</option>
            <option>Spring 2025</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select className="w-full p-2 border rounded-md">
            <option>All Status</option>
            <option>Pending Board Approval</option>
            <option>Board Approved</option>
            <option>Published</option>
          </select>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Program Tabulation Overview</CardTitle>
          <CardDescription>Review and approve examination results by program</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Program</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Semester</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Sections</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Avg GPA</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Pass %</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Fail %</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Status</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tabulationData.map((item, idx) => (
                  <tr key={idx} className="border-b hover:bg-gray-50">
                    <td className="p-3 text-sm font-medium">{item.program}</td>
                    <td className="p-3 text-sm">{item.semester}</td>
                    <td className="p-3 text-sm">{item.sections}</td>
                    <td className="p-3 text-sm font-semibold">{item.avgGPA.toFixed(2)}</td>
                    <td className="p-3">
                      <span className="text-sm text-green-600 font-medium">{item.passPercent}%</span>
                    </td>
                    <td className="p-3">
                      <span className="text-sm text-red-600 font-medium">{item.failPercent}%</span>
                    </td>
                    <td className="p-3">
                      <Badge className={item.statusColor}>{item.status}</Badge>
                    </td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            setSelectedProgram(item)
                            setShowSheetModal(true)
                          }}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        {item.status === 'Pending Board Approval' && (
                          <Button className="nu-button-primary" size="sm" onClick={() => alert('Approved tabulation for ' + item.program)}>
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Approve
                          </Button>
                        )}
                        <Button variant="outline" size="sm" onClick={() => alert('Sent back tabulation for ' + item.program)}>
                          <XCircle className="w-4 h-4 mr-1" />
                          Send Back
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

      <Dialog open={showSheetModal} onOpenChange={setShowSheetModal}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Tabulation Sheet: {selectedProgram?.program} - {selectedProgram?.semester}</DialogTitle>
            <DialogDescription>
              Review detailed marks and grades for board approval
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export XLSX
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export PDF (Board Signature)
                </Button>
                <Button variant="outline" size="sm">
                  Show Distribution
                </Button>
              </div>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={showOnlyCorrected}
                  onChange={(e) => setShowOnlyCorrected(e.target.checked)}
                  className="rounded"
                />
                <span>Show only corrected rows</span>
              </label>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left p-2 font-medium">Student ID</th>
                    <th className="text-left p-2 font-medium">Student Name</th>
                    <th className="text-left p-2 font-medium">CSE2211</th>
                    <th className="text-left p-2 font-medium">CSE2203</th>
                    <th className="text-left p-2 font-medium">MAT1101</th>
                    <th className="text-left p-2 font-medium">Total Marks</th>
                    <th className="text-left p-2 font-medium">GPA</th>
                    <th className="text-left p-2 font-medium">Result</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSheetData.map((row, idx) => (
                    <tr key={idx} className={`border-b hover:bg-gray-50 ${row.hasCorrectionApplied ? 'bg-blue-50/30' : ''}`}>
                      <td className="p-2 font-mono text-xs">{row.id}</td>
                      <td className="p-2">
                        <div className="flex items-center gap-2">
                          {row.name}
                          {row.hasCorrectionApplied && (
                            <Badge className="bg-blue-100 text-blue-700 text-xs flex items-center gap-1">
                              <Edit3 className="w-3 h-3" />
                              Adjusted by Correction
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="p-2 text-center">{row.cse2211}</td>
                      <td className="p-2 text-center">{row.cse2203}</td>
                      <td className="p-2 text-center">{row.mat1101}</td>
                      <td className="p-2 text-center font-semibold">{row.totalMarks}</td>
                      <td className="p-2 text-center font-semibold">{row.gpa}</td>
                      <td className="p-2">
                        <Badge className="bg-green-100 text-green-800">{row.result}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Card className="border-amber-200 bg-amber-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  Discrepancies Detected
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1 text-sm text-amber-900">
                  {discrepancies.map((disc, idx) => (
                    <li key={idx}>• {disc}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
