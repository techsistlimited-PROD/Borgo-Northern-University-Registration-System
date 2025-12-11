import { useState, useMemo } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Download, Upload } from 'lucide-react'
import { CBEMeeting, CBECandidate, CBE_MEETINGS, CBE_CANDIDATES, getCandidatesByMeeting } from '../data/cbe'
import { downloadCBECsv, downloadMeetingsCsv } from '../utils/cbe'
import CBEMeetingTable from '../components/CBEMeetingTable'
import CBECandidateDrawer from '../components/CBECandidateDrawer'
import CBEBulkBar from '../components/CBEBulkBar'
import CBECreateMeetingDialog from '../components/CBECreateMeetingDialog'
import CBEImportCandidatesDrawer from '../components/CBEImportCandidatesDrawer'

export default function CBEConsoleView() {
  const [meetings, setMeetings] = useState<CBEMeeting[]>(CBE_MEETINGS)
  const [candidates, setCandidates] = useState<CBECandidate[]>(CBE_CANDIDATES)
  const [selectedMeeting, setSelectedMeeting] = useState<CBEMeeting | null>(null)
  const [selectedCandidate, setSelectedCandidate] = useState<CBECandidate | null>(null)
  const [selectedCandidateIds, setSelectedCandidateIds] = useState<string[]>([])
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showImportDrawer, setShowImportDrawer] = useState(false)
  const [showCandidateDrawer, setShowCandidateDrawer] = useState(false)

  const [filters, setFilters] = useState({
    semester: 'all',
    program: 'all',
    meetingNo: '',
    status: 'all',
    search: ''
  })

  const filteredMeetings = useMemo(() => {
    return meetings.filter(m => {
      if (filters.status !== 'all' && m.status !== filters.status) return false
      if (filters.meetingNo && !m.number.toLowerCase().includes(filters.meetingNo.toLowerCase())) return false
      if (filters.search && !m.title.toLowerCase().includes(filters.search.toLowerCase())) return false
      return true
    })
  }, [meetings, filters])

  const meetingCandidates = useMemo(() => {
    if (!selectedMeeting) return []
    return candidates.filter(c => c.meetingId === selectedMeeting.id)
  }, [candidates, selectedMeeting])

  const handleCreateMeeting = (data: any) => {
    const newMeeting: CBEMeeting = {
      id: `cbe-m-${Date.now()}`,
      number: data.number,
      title: data.title,
      meetingDate: data.meetingDate,
      coveredSemFrom: data.coveredSemFrom,
      coveredSemTo: data.coveredSemTo,
      remarks: data.remarks,
      status: 'Draft',
      createdBy: 'COE Office',
      createdDate: new Date().toISOString().split('T')[0],
      publishedDate: null,
      candidatesCount: 0
    }
    setMeetings([newMeeting, ...meetings])
  }

  const handlePublishMeeting = (meeting: CBEMeeting) => {
    setMeetings(meetings.map(m =>
      m.id === meeting.id
        ? { ...m, status: 'Published' as const, publishedDate: new Date().toISOString().split('T')[0] }
        : m
    ))
  }

  const handleCloseMeeting = (meeting: CBEMeeting) => {
    setMeetings(meetings.map(m =>
      m.id === meeting.id ? { ...m, status: 'Closed' as const } : m
    ))
  }

  const handleViewMeeting = (meeting: CBEMeeting) => {
    setSelectedMeeting(meeting)
  }

  const handleCandidateDecision = (candidateId: string, decision: 'Eligible' | 'Not Eligible' | 'Withheld', notes: string) => {
    setCandidates(candidates.map(c =>
      c.id === candidateId
        ? {
            ...c,
            decision,
            notes,
            decidedBy: 'COE Office',
            decidedDate: new Date().toISOString().split('T')[0],
            auditLog: [
              ...c.auditLog,
              {
                action: `Decision: ${decision}`,
                by: 'COE Office',
                date: new Date().toISOString(),
                remarks: notes
              }
            ]
          }
        : c
    ))
  }

  const handleBulkApprove = () => {
    setCandidates(candidates.map(c =>
      selectedCandidateIds.includes(c.id)
        ? {
            ...c,
            decision: 'Eligible' as const,
            decidedBy: 'COE Office',
            decidedDate: new Date().toISOString().split('T')[0]
          }
        : c
    ))
    setSelectedCandidateIds([])
  }

  const handleBulkWithhold = () => {
    setCandidates(candidates.map(c =>
      selectedCandidateIds.includes(c.id)
        ? { ...c, decision: 'Withheld' as const }
        : c
    ))
    setSelectedCandidateIds([])
  }

  const handleBulkReject = () => {
    setCandidates(candidates.map(c =>
      selectedCandidateIds.includes(c.id)
        ? { ...c, decision: 'Not Eligible' as const }
        : c
    ))
    setSelectedCandidateIds([])
  }

  const handleBulkExport = () => {
    const selected = candidates.filter(c => selectedCandidateIds.includes(c.id))
    downloadCBECsv(selected)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-deep-plum">CBE Console</h1>
          <p className="text-gray-600 mt-1">
            Manage Controller of Examinations Board meetings and candidate eligibility
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowCreateDialog(true)} className="nu-button-primary">
            <Plus className="w-4 h-4 mr-2" />
            Create Meeting
          </Button>
          <Button variant="outline" onClick={() => downloadMeetingsCsv(meetings)}>
            <Download className="w-4 h-4 mr-2" />
            Export Meetings
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-4">
            <Select value={filters.status} onValueChange={(v) => setFilters({ ...filters, status: v })}>
              <SelectTrigger>
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Draft">Draft</SelectItem>
                <SelectItem value="Published">Published</SelectItem>
                <SelectItem value="Closed">Closed</SelectItem>
              </SelectContent>
            </Select>
            <Input
              placeholder="Meeting No..."
              value={filters.meetingNo}
              onChange={(e) => setFilters({ ...filters, meetingNo: e.target.value })}
            />
            <Input
              placeholder="Search..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>CBE Meetings</CardTitle>
            <div className="text-sm text-gray-500">
              {filteredMeetings.length} meeting{filteredMeetings.length !== 1 ? 's' : ''}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <CBEMeetingTable
            meetings={filteredMeetings}
            onView={handleViewMeeting}
            onEdit={() => {}}
            onPublish={handlePublishMeeting}
            onClose={handleCloseMeeting}
          />
        </CardContent>
      </Card>

      {selectedMeeting && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Candidates - {selectedMeeting.number}</CardTitle>
                <p className="text-sm text-gray-600 mt-1">{selectedMeeting.title}</p>
              </div>
              <Button onClick={() => setShowImportDrawer(true)} variant="outline">
                <Upload className="w-4 h-4 mr-2" />
                Import Candidates
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {meetingCandidates.map((candidate) => (
                <div
                  key={candidate.id}
                  className="flex justify-between items-center p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => {
                    setSelectedCandidate(candidate)
                    setShowCandidateDrawer(true)
                  }}
                >
                  <div className="flex-1">
                    <div className="font-medium">{candidate.studentName}</div>
                    <div className="text-sm text-gray-600">
                      {candidate.studentId} • {candidate.program} • CGPA: {candidate.cgpa.toFixed(2)} • Credits: {candidate.completedCredits}
                    </div>
                  </div>
                  <div className="text-sm">
                    Decision: <span className="font-medium">{candidate.decision}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <CBECandidateDrawer
        open={showCandidateDrawer}
        onClose={() => setShowCandidateDrawer(false)}
        candidate={selectedCandidate}
        onDecision={handleCandidateDecision}
      />

      <CBEBulkBar
        selectedCount={selectedCandidateIds.length}
        onApprove={handleBulkApprove}
        onWithhold={handleBulkWithhold}
        onReject={handleBulkReject}
        onExport={handleBulkExport}
        onClear={() => setSelectedCandidateIds([])}
      />

      <CBECreateMeetingDialog
        open={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        onCreate={handleCreateMeeting}
      />

      <CBEImportCandidatesDrawer
        open={showImportDrawer}
        onClose={() => setShowImportDrawer(false)}
        meetingId={selectedMeeting?.id || ''}
        onImport={(newCandidates) => {
          const importedCandidates = newCandidates.map((nc, idx) => ({
            id: `cbe-c-${Date.now()}-${idx}`,
            meetingId: selectedMeeting?.id || '',
            studentId: nc.studentId,
            studentName: nc.studentName,
            program: nc.program,
            admitYear: nc.studentId.split('-')[1] || '2021',
            completedCredits: nc.completedCredits,
            cgpa: nc.cgpa,
            decision: 'Pending' as const,
            notes: '',
            decidedBy: null,
            decidedDate: null,
            auditLog: [
              {
                action: 'Imported',
                by: 'COE Office',
                date: new Date().toISOString(),
                remarks: 'Manually imported'
              }
            ]
          }))
          setCandidates([...candidates, ...importedCandidates])
          if (selectedMeeting) {
            setMeetings(meetings.map(m =>
              m.id === selectedMeeting.id
                ? { ...m, candidatesCount: m.candidatesCount + importedCandidates.length }
                : m
            ))
          }
        }}
      />
    </div>
  )
}
