import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Download, Plus, X } from 'lucide-react'
import { CREDIT_TRANSFER_REQUESTS, CreditTransferRequest, CTStatus, CourseMapping } from '@/coe/data/creditTransfers'
import { SEMESTERS } from '@/coe/data/semesters'
import { PROGRAMS } from '@/coe/data/programs'
import CTRequestTable from '@/coe/components/CTRequestTable'
import CTDetailDrawer from '@/coe/components/CTDetailDrawer'
import CTBulkBar from '@/coe/components/CTBulkBar'
import CTDecisionDialog from '@/coe/components/CTDecisionDialog'
import CTImportTranscriptDrawer from '@/coe/components/CTImportTranscriptDrawer'
import { toCsv, downloadCsv, computeTotals, fakeToast } from '@/coe/utils/creditTransfer'

export default function CreditTransferView() {
  const [requests, setRequests] = useState<CreditTransferRequest[]>(CREDIT_TRANSFER_REQUESTS)
  const [selectedSemester, setSelectedSemester] = useState(SEMESTERS.find(s => s.isActive)?.id || '')
  const [selectedProgram, setSelectedProgram] = useState('All')
  const [selectedCampus, setSelectedCampus] = useState('All')
  const [selectedStatuses, setSelectedStatuses] = useState<CTStatus[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [detailRequest, setDetailRequest] = useState<CreditTransferRequest | null>(null)
  const [showImportDrawer, setShowImportDrawer] = useState(false)
  const [showDecisionDialog, setShowDecisionDialog] = useState(false)
  const [decisionAction, setDecisionAction] = useState<'approve' | 'reject' | null>(null)
  const [decisionTargetId, setDecisionTargetId] = useState<string | null>(null)

  const programs = ['All', ...PROGRAMS.map(p => p.code)]
  const campuses = ['All', 'Permanent', 'Banani', 'Mirpur']
  const statuses: CTStatus[] = ['Requested', 'Under Review', 'Evaluated', 'Approved', 'Rejected', 'Applied']

  const filteredRequests = useMemo(() => {
    return requests.filter(r => {
      if (selectedProgram !== 'All' && r.programCode !== selectedProgram) return false
      if (selectedCampus !== 'All' && r.campus !== selectedCampus) return false
      if (selectedStatuses.length > 0 && !selectedStatuses.includes(r.status)) return false
      if (searchTerm) {
        const term = searchTerm.toLowerCase()
        return (
          r.studentId.toLowerCase().includes(term) ||
          r.studentName.toLowerCase().includes(term) ||
          r.sourceUniversity.toLowerCase().includes(term)
        )
      }
      return true
    })
  }, [requests, selectedProgram, selectedCampus, selectedStatuses, searchTerm])

  const handleEvaluate = (request: CreditTransferRequest) => {
    setDetailRequest(request)
  }

  const handleEvaluateSave = (id: string, mappings: CourseMapping[]) => {
    const totals = computeTotals(mappings)
    setRequests(prevRequests =>
      prevRequests.map(r => {
        if (r.id === id) {
          return {
            ...r,
            mappings,
            totals,
            status: 'Evaluated' as const,
            evaluator: 'Dr. Evaluator',
            updatedAt: new Date().toISOString().split('T')[0],
            audit: [
              ...r.audit,
              {
                action: 'Evaluated',
                by: 'Exam Officer',
                date: new Date().toISOString().split('T')[0],
                remarks: 'Course mapping completed'
              }
            ]
          }
        }
        return r
      })
    )
    fakeToast('Evaluation saved successfully')
  }

  const handleApprove = (ids: string[], remarks: string = '') => {
    setRequests(prevRequests =>
      prevRequests.map(r => {
        if (ids.includes(r.id) && r.status === 'Evaluated') {
          return {
            ...r,
            status: 'Approved' as const,
            updatedAt: new Date().toISOString().split('T')[0],
            decision: {
              approvedBy: 'Academic Committee',
              decisionAt: new Date().toISOString().split('T')[0],
              remarks: remarks || 'Approved for transfer'
            },
            audit: [
              ...r.audit,
              {
                action: 'Approved',
                by: 'Academic Committee',
                date: new Date().toISOString().split('T')[0],
                remarks: remarks || 'Approved for transfer'
              }
            ]
          }
        }
        return r
      })
    )
    fakeToast(`${ids.length} request(s) approved`)
  }

  const handleReject = (ids: string[], reason: string) => {
    setRequests(prevRequests =>
      prevRequests.map(r => {
        if (ids.includes(r.id)) {
          return {
            ...r,
            status: 'Rejected' as const,
            updatedAt: new Date().toISOString().split('T')[0],
            decision: {
              approvedBy: 'Academic Committee',
              decisionAt: new Date().toISOString().split('T')[0],
              remarks: reason
            },
            audit: [
              ...r.audit,
              {
                action: 'Rejected',
                by: 'Academic Committee',
                date: new Date().toISOString().split('T')[0],
                remarks: reason
              }
            ]
          }
        }
        return r
      })
    )
    fakeToast(`${ids.length} request(s) rejected`)
  }

  const handleApply = (ids: string[]) => {
    setRequests(prevRequests =>
      prevRequests.map(r => {
        if (ids.includes(r.id) && r.status === 'Approved') {
          return {
            ...r,
            status: 'Applied' as const,
            updatedAt: new Date().toISOString().split('T')[0],
            audit: [
              ...r.audit,
              {
                action: 'Applied',
                by: 'Registrar',
                date: new Date().toISOString().split('T')[0],
                remarks: 'Credits added to student record'
              }
            ]
          }
        }
        return r
      })
    )
    fakeToast(`${ids.length} request(s) applied to student records`)
  }

  const handleCreate = (data: {
    studentId: string
    studentName: string
    programCode: string
    campus: string
    sourceUniversity: string
    sourceSystem: 'Manual' | 'CSV'
    mappings: Partial<CourseMapping>[]
  }) => {
    const fullMappings: CourseMapping[] = data.mappings.map(m => ({
      sourceCode: m.sourceCode || '',
      sourceTitle: m.sourceTitle || '',
      sourceCredit: m.sourceCredit || 0,
      sourceGrade: m.sourceGrade,
      targetCode: m.targetCode,
      targetTitle: m.targetTitle,
      targetCredit: m.targetCredit,
      decision: m.decision || 'Map',
      reason: m.reason
    }))

    const totals = computeTotals(fullMappings)

    const newRequest: CreditTransferRequest = {
      id: `ct-${Date.now()}`,
      requestId: `CT-2025-${String(requests.length + 1).padStart(3, '0')}`,
      studentId: data.studentId,
      studentName: data.studentName,
      programCode: data.programCode,
      campus: data.campus,
      sourceUniversity: data.sourceUniversity,
      sourceSystem: data.sourceSystem,
      sourceGPA: null,
      sourceCredits: totals.sourceCredits,
      requestedAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      status: 'Requested',
      evaluator: null,
      notes: 'Newly created request',
      mappings: fullMappings,
      totals,
      decision: {
        approvedBy: null,
        decisionAt: null,
        remarks: ''
      },
      audit: [
        {
          action: 'Requested',
          by: 'Student Portal',
          date: new Date().toISOString().split('T')[0],
          remarks: `Import via ${data.sourceSystem}`
        }
      ]
    }

    setRequests([newRequest, ...requests])
    fakeToast('Transfer request created successfully')
  }

  const handleSingleApprove = (id: string) => {
    setDecisionAction('approve')
    setDecisionTargetId(id)
    setShowDecisionDialog(true)
  }

  const handleSingleReject = (id: string) => {
    setDecisionAction('reject')
    setDecisionTargetId(id)
    setShowDecisionDialog(true)
  }

  const handleDecisionConfirm = (remarks: string) => {
    if (!decisionTargetId) return

    if (decisionAction === 'approve') {
      handleApprove([decisionTargetId], remarks)
    } else if (decisionAction === 'reject') {
      handleReject([decisionTargetId], remarks)
    }

    setShowDecisionDialog(false)
    setDecisionAction(null)
    setDecisionTargetId(null)
  }

  const handleExportCsv = () => {
    const exportRequests = selectedIds.length > 0
      ? requests.filter(r => selectedIds.includes(r.id))
      : filteredRequests
    const csv = toCsv(exportRequests)
    downloadCsv(csv, `credit-transfer-${Date.now()}.csv`)
  }

  const toggleStatusFilter = (status: CTStatus) => {
    if (selectedStatuses.includes(status)) {
      setSelectedStatuses(selectedStatuses.filter(s => s !== status))
    } else {
      setSelectedStatuses([...selectedStatuses, status])
    }
  }

  const clearFilters = () => {
    setSelectedProgram('All')
    setSelectedCampus('All')
    setSelectedStatuses([])
    setSearchTerm('')
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-deep-plum">Credit Transfer Console</h1>
          <p className="text-sm text-gray-600">Evaluate and approve credit transfer requests</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={handleExportCsv}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button size="sm" onClick={() => setShowImportDrawer(true)} className="bg-deep-plum hover:bg-accent-purple">
            <Plus className="w-4 h-4 mr-2" />
            New Request
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-5 gap-4">
            <div>
              <label className="text-xs font-medium mb-1 block">Semester</label>
              <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                <SelectTrigger className="text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SEMESTERS.map(sem => (
                    <SelectItem key={sem.id} value={sem.id}>
                      {sem.name} {sem.isActive && '(Active)'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-xs font-medium mb-1 block">Program</label>
              <Select value={selectedProgram} onValueChange={setSelectedProgram}>
                <SelectTrigger className="text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {programs.map(prog => (
                    <SelectItem key={prog} value={prog}>{prog}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-xs font-medium mb-1 block">Campus</label>
              <Select value={selectedCampus} onValueChange={setSelectedCampus}>
                <SelectTrigger className="text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {campuses.map(campus => (
                    <SelectItem key={campus} value={campus}>{campus}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="col-span-2">
              <label className="text-xs font-medium mb-1 block">Search</label>
              <Input
                placeholder="Student ID, Name, or University..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="text-sm"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium mb-2 block">Status</label>
            <div className="flex flex-wrap gap-2">
              {statuses.map(status => (
                <Badge
                  key={status}
                  variant={selectedStatuses.includes(status) ? 'default' : 'outline'}
                  className={`cursor-pointer ${selectedStatuses.includes(status) ? 'bg-deep-plum' : ''}`}
                  onClick={() => toggleStatusFilter(status)}
                >
                  {status}
                  {selectedStatuses.includes(status) && <X className="w-3 h-3 ml-1" />}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center pt-2">
            <div className="text-sm text-gray-600">
              Showing {filteredRequests.length} of {requests.length} requests
            </div>
            <Button size="sm" variant="outline" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      <CTRequestTable
        requests={filteredRequests}
        selectedIds={selectedIds}
        onSelect={(id) => {
          if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(i => i !== id))
          } else {
            setSelectedIds([...selectedIds, id])
          }
        }}
        onSelectAll={(checked) => {
          if (checked) {
            setSelectedIds(filteredRequests.map(r => r.id))
          } else {
            setSelectedIds([])
          }
        }}
        onView={(request) => setDetailRequest(request)}
        onEvaluate={handleEvaluate}
        onApprove={handleSingleApprove}
        onReject={handleSingleReject}
        onApply={(id) => handleApply([id])}
      />

      {detailRequest && (
        <CTDetailDrawer
          request={detailRequest}
          onClose={() => setDetailRequest(null)}
          onEvaluate={handleEvaluateSave}
          onApprove={handleSingleApprove}
          onReject={handleSingleReject}
          onApply={(id) => handleApply([id])}
        />
      )}

      <CTBulkBar
        selectedRequests={requests.filter(r => selectedIds.includes(r.id))}
        onApprove={(ids) => {
          setDecisionAction('approve')
          setDecisionTargetId(ids[0])
          handleApprove(ids)
        }}
        onReject={handleReject}
        onApply={handleApply}
        onExport={handleExportCsv}
        onClearSelection={() => setSelectedIds([])}
      />

      <CTImportTranscriptDrawer
        open={showImportDrawer}
        onClose={() => setShowImportDrawer(false)}
        onCreate={handleCreate}
      />

      <CTDecisionDialog
        open={showDecisionDialog}
        action={decisionAction}
        requestCount={1}
        onClose={() => {
          setShowDecisionDialog(false)
          setDecisionAction(null)
          setDecisionTargetId(null)
        }}
        onConfirm={handleDecisionConfirm}
      />
    </div>
  )
}
