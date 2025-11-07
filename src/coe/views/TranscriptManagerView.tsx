import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Download, Eye, CheckCircle, Package, FileText, HelpCircle } from 'lucide-react'
import { TRANSCRIPTS, Transcript } from '@/coe/data/transcripts'
import { getAllSemesters, getAllPrograms } from '@/coe/data/selectors'

interface TranscriptRequest {
  id: string
  studentId: string
  studentName: string
  programCode: string
  creditsCompleted: number
  cgpa: number
  status: 'Requested' | 'Processing' | 'Ready' | 'Collected'
  requestDate: string
  readyDate: string | null
  collectedDate: string | null
}

export default function TranscriptManagerView() {
  const semesters = getAllSemesters()
  const programs = getAllPrograms()

  const [selectedSemester, setSelectedSemester] = useState('ALL')
  const [selectedProgram, setSelectedProgram] = useState('ALL')
  const [searchTerm, setSearchTerm] = useState('')
  const [showPreviewDrawer, setShowPreviewDrawer] = useState(false)
  const [selectedTranscript, setSelectedTranscript] = useState<Transcript | null>(null)
  const [showHelpPopover, setShowHelpPopover] = useState(false)

  const [transcriptRequests, setTranscriptRequests] = useState<TranscriptRequest[]>([
    {
      id: 'req-001',
      studentId: 'STU-2023-0001',
      studentName: 'Nishat Sultana',
      programCode: 'CSE',
      creditsCompleted: 19.5,
      cgpa: 3.96,
      status: 'Ready',
      requestDate: '2025-11-15',
      readyDate: '2025-11-16',
      collectedDate: null
    },
    {
      id: 'req-002',
      studentId: 'STU-2024-0101',
      studentName: 'Farzana Kabir',
      programCode: 'BBA',
      creditsCompleted: 9,
      cgpa: 3.68,
      status: 'Processing',
      requestDate: '2025-11-17',
      readyDate: null,
      collectedDate: null
    },
    {
      id: 'req-003',
      studentId: 'STU-2021-0001',
      studentName: 'Tahmina Akter',
      programCode: 'LLB',
      creditsCompleted: 132,
      cgpa: 3.82,
      status: 'Collected',
      requestDate: '2025-10-10',
      readyDate: '2025-10-12',
      collectedDate: '2025-10-15'
    }
  ])

  const filteredRequests = useMemo(() => {
    let filtered = transcriptRequests

    if (selectedProgram !== 'ALL') {
      filtered = filtered.filter(r => r.programCode === selectedProgram)
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        r => r.studentId.toLowerCase().includes(term) || r.studentName.toLowerCase().includes(term)
      )
    }

    return filtered
  }, [transcriptRequests, selectedProgram, searchTerm])

  const handlePreview = (studentId: string) => {
    const transcript = TRANSCRIPTS.find(t => t.studentId === studentId)
    if (transcript) {
      setSelectedTranscript(transcript)
      setShowPreviewDrawer(true)
    }
  }

  const handleMarkReady = (id: string) => {
    setTranscriptRequests(
      transcriptRequests.map(r =>
        r.id === id
          ? { ...r, status: 'Ready', readyDate: new Date().toISOString().split('T')[0] }
          : r
      )
    )
  }

  const handleMarkCollected = (id: string) => {
    setTranscriptRequests(
      transcriptRequests.map(r =>
        r.id === id
          ? { ...r, status: 'Collected', collectedDate: new Date().toISOString().split('T')[0] }
          : r
      )
    )
  }

  const handleDownloadPDF = (studentId: string) => {
    alert(`Generating PDF for ${studentId}...`)
    window.print()
  }

  const handleExportCSV = () => {
    const csvRows = [
      ['Student ID', 'Name', 'Program', 'Credits', 'CGPA', 'Status', 'Requested', 'Ready', 'Collected'],
      ...filteredRequests.map(r => [
        r.studentId,
        r.studentName,
        r.programCode,
        r.creditsCompleted.toString(),
        r.cgpa.toFixed(2),
        r.status,
        r.requestDate,
        r.readyDate || '',
        r.collectedDate || ''
      ])
    ]

    const csvContent = csvRows.map(row => row.join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `transcripts-queue-${new Date().toISOString().split('T')[0]}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  const getStatusBadge = (status: TranscriptRequest['status']) => {
    const variants: Record<TranscriptRequest['status'], string> = {
      Requested: 'bg-gray-100 text-gray-700',
      Processing: 'bg-amber-100 text-amber-700',
      Ready: 'bg-green-100 text-green-700',
      Collected: 'bg-blue-100 text-blue-700'
    }
    return <Badge className={variants[status]}>{status}</Badge>
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-deep-plum">Transcript Manager</h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage student transcript requests and generation
          </p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              onMouseEnter={() => setShowHelpPopover(true)}
              onMouseLeave={() => setShowHelpPopover(false)}
            >
              <HelpCircle className="w-4 h-4" />
            </Button>
            {showHelpPopover && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-white border shadow-lg rounded-md p-4 z-10">
                <p className="text-xs text-gray-700">
                  Transcripts show complete academic record with semester-wise courses, grades, credits, and CGPA.
                  Process requests from Requested → Processing → Ready → Collected.
                </p>
              </div>
            )}
          </div>
          <Button size="sm" variant="outline" onClick={handleExportCSV}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-gray-700">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Program</label>
              <select
                value={selectedProgram}
                onChange={e => setSelectedProgram(e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                {programs.map(prog => (
                  <option key={prog.id} value={prog.code}>
                    {prog.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Search Student</label>
              <Input
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Student ID or Name..."
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Transcript Request Queue</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-3 border-b font-semibold">Student ID</th>
                  <th className="text-left p-3 border-b font-semibold">Student Name</th>
                  <th className="text-left p-3 border-b font-semibold">Program</th>
                  <th className="text-right p-3 border-b font-semibold">Credits Completed</th>
                  <th className="text-right p-3 border-b font-semibold">CGPA</th>
                  <th className="text-left p-3 border-b font-semibold">Status</th>
                  <th className="text-left p-3 border-b font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-gray-500">
                      No transcript requests found
                    </td>
                  </tr>
                ) : (
                  filteredRequests.map(request => (
                    <tr key={request.id} className="border-b hover:bg-gray-50">
                      <td className="p-3 font-mono text-xs">{request.studentId}</td>
                      <td className="p-3 font-medium">{request.studentName}</td>
                      <td className="p-3">{request.programCode}</td>
                      <td className="p-3 text-right">{request.creditsCompleted}</td>
                      <td className="p-3 text-right font-semibold">{request.cgpa.toFixed(2)}</td>
                      <td className="p-3">{getStatusBadge(request.status)}</td>
                      <td className="p-3">
                        <div className="flex gap-1 flex-wrap">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handlePreview(request.studentId)}
                            title="Preview"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          {request.status === 'Requested' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleMarkReady(request.id)}
                              title="Mark as Ready"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                          )}
                          {request.status === 'Processing' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleMarkReady(request.id)}
                              title="Mark as Ready"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                          )}
                          {request.status === 'Ready' && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleMarkCollected(request.id)}
                                title="Mark as Collected"
                              >
                                <Package className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                className="bg-gradient-to-r from-deep-plum to-accent-purple text-white"
                                onClick={() => handleDownloadPDF(request.studentId)}
                                title="Download PDF"
                              >
                                <FileText className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showPreviewDrawer} onOpenChange={setShowPreviewDrawer}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Transcript Preview</DialogTitle>
          </DialogHeader>

          {selectedTranscript && (
            <div className="space-y-4 print:text-black">
              <div className="border-b pb-4">
                <h2 className="text-xl font-bold text-deep-plum">Northern University Bangladesh</h2>
                <p className="text-sm text-gray-600">Official Academic Transcript</p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <label className="font-semibold text-gray-700">Student ID:</label>
                  <span className="ml-2">{selectedTranscript.studentId}</span>
                </div>
                <div>
                  <label className="font-semibold text-gray-700">Student Name:</label>
                  <span className="ml-2">{selectedTranscript.studentName}</span>
                </div>
                <div>
                  <label className="font-semibold text-gray-700">Program:</label>
                  <span className="ml-2">{selectedTranscript.programName}</span>
                </div>
                <div>
                  <label className="font-semibold text-gray-700">Batch:</label>
                  <span className="ml-2">{selectedTranscript.batch}</span>
                </div>
                <div>
                  <label className="font-semibold text-gray-700">Enrollment Date:</label>
                  <span className="ml-2">{selectedTranscript.enrollmentDate}</span>
                </div>
                <div>
                  <label className="font-semibold text-gray-700">Status:</label>
                  <span className="ml-2">
                    <Badge>{selectedTranscript.status}</Badge>
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                {selectedTranscript.semesters.map((semester, idx) => (
                  <Card key={idx} className="border">
                    <CardHeader className="pb-3 bg-gray-50">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-semibold">{semester.semesterName}</CardTitle>
                        <div className="flex gap-4 text-xs">
                          <span>
                            <strong>Credits:</strong> {semester.earnedCredit}/{semester.totalCredit}
                          </span>
                          <span>
                            <strong>GPA:</strong> {semester.gpa.toFixed(2)}
                          </span>
                          <span>
                            <strong>CGPA:</strong> {semester.cgpa.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-3">
                      <table className="w-full text-xs">
                        <thead className="border-b">
                          <tr>
                            <th className="text-left p-2">Course Code</th>
                            <th className="text-left p-2">Course Name</th>
                            <th className="text-right p-2">Credit</th>
                            <th className="text-center p-2">Grade</th>
                            <th className="text-right p-2">GP</th>
                          </tr>
                        </thead>
                        <tbody>
                          {semester.courses.map((course, cidx) => (
                            <tr key={cidx} className="border-b">
                              <td className="p-2 font-mono">{course.courseCode}</td>
                              <td className="p-2">{course.courseName}</td>
                              <td className="p-2 text-right">{course.credit}</td>
                              <td className="p-2 text-center">
                                <Badge variant="outline">{course.letterGrade}</Badge>
                              </td>
                              <td className="p-2 text-right">{course.gradePoint.toFixed(2)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="border-t pt-4 grid grid-cols-2 gap-4 text-sm font-semibold">
                <div>
                  <span className="text-gray-700">Total Credits Required:</span>
                  <span className="ml-2">{selectedTranscript.totalCreditsRequired}</span>
                </div>
                <div>
                  <span className="text-gray-700">Total Credits Earned:</span>
                  <span className="ml-2">{selectedTranscript.totalCreditsEarned}</span>
                </div>
                <div>
                  <span className="text-gray-700">Final CGPA:</span>
                  <span className="ml-2 text-deep-plum text-lg">{selectedTranscript.finalCGPA.toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-gray-700">Classification:</span>
                  <span className="ml-2 text-deep-plum">{selectedTranscript.classification}</span>
                </div>
              </div>

              <div className="flex justify-end gap-2 print:hidden">
                <Button variant="outline" onClick={() => setShowPreviewDrawer(false)}>
                  Close
                </Button>
                <Button
                  className="bg-gradient-to-r from-deep-plum to-accent-purple text-white"
                  onClick={() => window.print()}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Print / Download PDF
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
