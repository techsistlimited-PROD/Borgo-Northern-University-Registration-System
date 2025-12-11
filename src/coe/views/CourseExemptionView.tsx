import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Download, X } from 'lucide-react'
import { COURSE_EXEMPTION_REQUESTS, CourseExemptionRequest, CEStatus, RequestedCourse } from '@/coe/data/courseExemptions'
import { SEMESTERS } from '@/coe/data/semesters'
import { PROGRAMS } from '@/coe/data/programs'
import CERequestTable from '@/coe/components/CERequestTable'
import CEDetailDrawer from '@/coe/components/CEDetailDrawer'
import CEBulkBar from '@/coe/components/CEBulkBar'
import CEDecisionDialog from '@/coe/components/CEDecisionDialog'
import { toCsv, downloadCsv, fakeToast, validateExemption } from '@/coe/utils/courseExemption'

export default function CourseExemptionView() {
  const [requests, setRequests] = useState<CourseExemptionRequest[]>(COURSE_EXEMPTION_REQUESTS)
  const [selectedSemester, setSelectedSemester] = useState(SEMESTERS.find(s => s.isActive)?.id || '')
  const [selectedProgram, setSelectedProgram] = useState('All')
  const [selectedCampus, setSelectedCampus] = useState('All')
  const [selectedStatuses, setSelectedStatuses] = useState<CEStatus[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [detailRequest, setDetailRequest] = useState<CourseExemptionRequest | null>(null)
  const [showDecisionDialog, setShowDecisionDialog] = useState(false)
  const [decisionAction, setDecisionAction] = useState<'approve' | 'reject' | null>(null)
  const [decisionTargetId, setDecisionTargetId] = useState<string | null>(null)

  const programs = ['All', ...PROGRAMS.map(p => p.code)]
  const campuses = ['All', 'Permanent', 'Banani', 'Mirpur']
  const statuses: CEStatus[] = ['Requested', 'Under Review', 'Evaluated', 'Approved', 'Rejected', 'Applied']

  const filteredRequests = useMemo(() => {
    return requests.filter(r => {
      if (selectedProgram !== 'All' && r.programCode !== selectedProgram) return false
      if (selectedCampus !== 'All' && r.campus !== selectedCampus) return false
      if (selectedStatuses.length > 0 && !selectedStatuses.includes(r.status)) return false
      if (searchTerm) {
        const term = searchTerm.toLowerCase()
        return (
          r.studentId.toLowerCase().includes(term) ||
          r.studentName.toLowerCase().includes(term)
        )
      }
      return true
    })
  }, [requests, selectedProgram, selectedCampus, selectedStatuses, searchTerm])

  const handleEvaluate = (request: CourseExemptionRequest) => {
    setDetailRequest(request)
  }

  const handleEvaluateSave = (id: string, exemptedCourses: RequestedCourse[]) => {
    setRequests(prevRequests =>
      prevRequests.map(r => {
        if (r.id === id) {
          const validation = validateExemption({ ...r, exemptedCourses })
          
          if (!validation.ok) {
            fakeToast(validation.message || 'Validation failed')
            return r
          }

          return {
            ...r,
            exemptedCourses,
            status: 'Evaluated' as const,
            updatedAt: new Date().toISOString().split('T')[0],
            audit: [
              ...r.audit,
              {
                action: 'Evaluated',
                by: 'Exam Officer',
                date: new Date().toISOString().split('T')[0],
                remarks: `${exemptedCourses.filter(c => c.selected).length} course(s) marked for exemption`
              }
            ]
          }
        }
        return r
      })
    )
    fakeToast('Evaluation saved - status updated to Evaluated')
  }

  const handleApprove = (ids: string[], notes: string) => {
    setRequests(prevRequests =>
      prevRequests.map(r => {
        if (ids.includes(r.id) && r.status === 'Evaluated') {
          return {
            ...r,
            status: 'Approved' as const,
            updatedAt: new Date().toISOString().split('T')[0],
            notes: notes || r.notes,
            audit: [
              ...r.audit,
              {
                action: 'Approved',
                by: 'Academic Committee',
                date: new Date().toISOString().split('T')[0],
                remarks: notes || 'Exemption approved'
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
            notes: `Rejected: ${reason}`,
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
                remarks: 'Exemptions applied to student record'
              }
            ]
          }
        }
        return r
      })
    )
    fakeToast(`${ids.length} exemption(s) applied to student records`)
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

  const handleDecisionConfirm = (notes: string) => {
    if (!decisionTargetId) return

    if (decisionAction === 'approve') {
      handleApprove([decisionTargetId], notes)
    } else if (decisionAction === 'reject') {
      handleReject([decisionTargetId], notes)
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
    downloadCsv(csv, `course-exemptions-${Date.now()}.csv`)
  }

  const toggleStatusFilter = (status: CEStatus) => {
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
          <h1 className="text-2xl font-bold text-deep-plum">Course Exemption</h1>
          <p className="text-sm text-gray-600">Manage course exemption requests</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={handleExportCsv}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
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
                placeholder="Student ID or Name..."
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

      <CERequestTable
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
        <CEDetailDrawer
          request={detailRequest}
          onClose={() => setDetailRequest(null)}
          onEvaluate={handleEvaluateSave}
          onApprove={handleSingleApprove}
          onReject={handleSingleReject}
        />
      )}

      <CEBulkBar
        selectedRequests={requests.filter(r => selectedIds.includes(r.id))}
        onApprove={handleApprove}
        onReject={handleReject}
        onApply={handleApply}
        onExport={handleExportCsv}
        onClearSelection={() => setSelectedIds([])}
      />

      <CEDecisionDialog
        open={showDecisionDialog}
        action={decisionAction}
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
