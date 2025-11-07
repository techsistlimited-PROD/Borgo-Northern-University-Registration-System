import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Download, Plus, FileText, X } from 'lucide-react'
import { ADMISSION_ACTIONS, AdmissionAction, ActionType, ActionStatus, RequestedChange } from '@/coe/data/admissionActions'
import { SEMESTERS } from '@/coe/data/semesters'
import { PROGRAMS } from '@/coe/data/programs'
import AdmissionActionsTable from '@/coe/components/AdmissionActionsTable'
import ActionDetailDrawer from '@/coe/components/ActionDetailDrawer'
import ActionCreateDialog from '@/coe/components/ActionCreateDialog'
import { toCsv, downloadCsv, canApproveOrApply } from '@/coe/utils/admissionActions'

export default function AdmissionActionsView() {
  const [actions, setActions] = useState<AdmissionAction[]>(ADMISSION_ACTIONS)
  const [selectedSemester, setSelectedSemester] = useState(SEMESTERS.find(s => s.isActive)?.id || '')
  const [selectedProgram, setSelectedProgram] = useState('All')
  const [selectedCampus, setSelectedCampus] = useState('All')
  const [selectedTypes, setSelectedTypes] = useState<ActionType[]>([])
  const [selectedStatuses, setSelectedStatuses] = useState<ActionStatus[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [detailAction, setDetailAction] = useState<AdmissionAction | null>(null)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showRejectDialog, setShowRejectDialog] = useState(false)
  const [rejectingId, setRejectingId] = useState<string | null>(null)
  const [rejectReason, setRejectReason] = useState('')
  const [showBulkDialog, setShowBulkDialog] = useState(false)
  const [bulkAction, setBulkAction] = useState<'approve' | 'reject' | 'apply' | null>(null)

  const programs = ['All', ...PROGRAMS.map(p => p.code)]
  const campuses = ['All', 'Permanent', 'Banani', 'Mirpur']
  const actionTypes: ActionType[] = ['STUDENT_INFO_UPDATE', 'PROGRAM_CHANGE', 'CAMPUS_CHANGE', 'ADMISSION_CANCEL', 'READMISSION']
  const statuses: ActionStatus[] = ['Requested', 'Under Review', 'Approved', 'Rejected', 'Applied']

  const filteredActions = useMemo(() => {
    return actions.filter(a => {
      if (selectedProgram !== 'All' && a.currentProgram !== selectedProgram) return false
      if (selectedCampus !== 'All' && a.currentCampus !== selectedCampus) return false
      if (selectedTypes.length > 0 && !selectedTypes.includes(a.actionType)) return false
      if (selectedStatuses.length > 0 && !selectedStatuses.includes(a.status)) return false
      if (searchTerm) {
        const term = searchTerm.toLowerCase()
        return (
          a.studentId.toLowerCase().includes(term) ||
          a.studentName.toLowerCase().includes(term)
        )
      }
      return true
    })
  }, [actions, selectedProgram, selectedCampus, selectedTypes, selectedStatuses, searchTerm])

  const handleApprove = (ids: string[]) => {
    setActions(prevActions =>
      prevActions.map(a => {
        if (ids.includes(a.id) && (a.status === 'Requested' || a.status === 'Under Review')) {
          const gating = canApproveOrApply(a)
          if (!gating.allowed) return a
          
          return {
            ...a,
            status: 'Approved' as const,
            updatedAt: new Date().toISOString().split('T')[0],
            audit: [
              ...a.audit,
              {
                action: 'Approved',
                by: 'Exam Officer',
                date: new Date().toISOString().split('T')[0],
                remarks: 'Approved for processing'
              }
            ]
          }
        }
        return a
      })
    )
  }

  const handleReject = (ids: string[], reason: string) => {
    setActions(prevActions =>
      prevActions.map(a => {
        if (ids.includes(a.id)) {
          return {
            ...a,
            status: 'Rejected' as const,
            updatedAt: new Date().toISOString().split('T')[0],
            remarks: `Rejected: ${reason}`,
            audit: [
              ...a.audit,
              {
                action: 'Rejected',
                by: 'Exam Officer',
                date: new Date().toISOString().split('T')[0],
                remarks: reason
              }
            ]
          }
        }
        return a
      })
    )
  }

  const handleApply = (ids: string[]) => {
    setActions(prevActions =>
      prevActions.map(a => {
        if (ids.includes(a.id) && a.status === 'Approved') {
          const gating = canApproveOrApply(a)
          if (!gating.allowed) return a

          const updatedAction: AdmissionAction = {
            ...a,
            status: 'Applied' as const,
            updatedAt: new Date().toISOString().split('T')[0],
            audit: [
              ...a.audit,
              {
                action: 'Applied',
                by: 'System',
                date: new Date().toISOString().split('T')[0],
                remarks: 'Changes applied to student record'
              }
            ]
          }

          if (a.actionType === 'PROGRAM_CHANGE' && a.requestedChange.to) {
            updatedAction.currentProgram = a.requestedChange.to
          }
          if (a.actionType === 'CAMPUS_CHANGE' && a.requestedChange.to) {
            updatedAction.currentCampus = a.requestedChange.to
          }

          return updatedAction
        }
        return a
      })
    )
  }

  const handleSingleReject = () => {
    if (!rejectingId || !rejectReason.trim() || rejectReason.length < 10) {
      alert('Rejection reason must be at least 10 characters.')
      return
    }
    handleReject([rejectingId], rejectReason)
    setShowRejectDialog(false)
    setRejectingId(null)
    setRejectReason('')
  }

  const handleBulkAction = () => {
    if (!bulkAction) return
    const selectedActions = actions.filter(a => selectedIds.includes(a.id))
    
    if (bulkAction === 'approve') {
      handleApprove(selectedIds)
    } else if (bulkAction === 'apply') {
      handleApply(selectedIds)
    } else if (bulkAction === 'reject') {
      if (!rejectReason.trim() || rejectReason.length < 10) {
        alert('Rejection reason must be at least 10 characters.')
        return
      }
      handleReject(selectedIds, rejectReason)
    }
    
    setShowBulkDialog(false)
    setBulkAction(null)
    setRejectReason('')
    setSelectedIds([])
  }

  const handleExportCsv = () => {
    const csv = toCsv(filteredActions)
    downloadCsv(csv, `admission-actions-${Date.now()}.csv`)
  }

  const handlePrint = (action: AdmissionAction) => {
    setDetailAction(action)
    setTimeout(() => {
      window.print()
    }, 100)
  }

  const handleCreate = (data: {
    studentId: string
    studentName: string
    currentProgram: string
    currentCampus: string
    currentBatch: string
    actionType: ActionType
    requestedChange: RequestedChange
  }) => {
    const newAction: AdmissionAction = {
      id: `aa-${Date.now()}`,
      studentId: data.studentId,
      studentName: data.studentName,
      currentProgram: data.currentProgram,
      currentCampus: data.currentCampus,
      currentBatch: data.currentBatch,
      requestedChange: data.requestedChange,
      actionType: data.actionType,
      status: 'Requested',
      requestedAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      remarks: 'Newly created request',
      attachments: [],
      audit: [
        {
          action: 'Requested',
          by: 'Student Portal',
          date: new Date().toISOString().split('T')[0],
          remarks: 'Initial request submitted'
        }
      ]
    }
    setActions([newAction, ...actions])
  }

  const toggleTypeFilter = (type: ActionType) => {
    if (selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter(t => t !== type))
    } else {
      setSelectedTypes([...selectedTypes, type])
    }
  }

  const toggleStatusFilter = (status: ActionStatus) => {
    if (selectedStatuses.includes(status)) {
      setSelectedStatuses(selectedStatuses.filter(s => s !== status))
    } else {
      setSelectedStatuses([...selectedStatuses, status])
    }
  }

  const clearFilters = () => {
    setSelectedProgram('All')
    setSelectedCampus('All')
    setSelectedTypes([])
    setSelectedStatuses([])
    setSearchTerm('')
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-deep-plum">Admission Actions</h1>
          <p className="text-sm text-gray-600">Manage student academic action requests</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={handleExportCsv}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button size="sm" onClick={() => setShowCreateDialog(true)} className="bg-deep-plum hover:bg-accent-purple">
            <Plus className="w-4 h-4 mr-2" />
            New Action
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
            <label className="text-xs font-medium mb-2 block">Action Type</label>
            <div className="flex flex-wrap gap-2">
              {actionTypes.map(type => (
                <Badge
                  key={type}
                  variant={selectedTypes.includes(type) ? 'default' : 'outline'}
                  className={`cursor-pointer ${selectedTypes.includes(type) ? 'bg-deep-plum' : ''}`}
                  onClick={() => toggleTypeFilter(type)}
                >
                  {type.replace('_', ' ')}
                  {selectedTypes.includes(type) && <X className="w-3 h-3 ml-1" />}
                </Badge>
              ))}
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
              Showing {filteredActions.length} of {actions.length} actions
            </div>
            <Button size="sm" variant="outline" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      <AdmissionActionsTable
        actions={filteredActions}
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
            setSelectedIds(filteredActions.map(a => a.id))
          } else {
            setSelectedIds([])
          }
        }}
        onView={(action) => setDetailAction(action)}
        onApprove={(id) => handleApprove([id])}
        onReject={(id) => {
          setRejectingId(id)
          setShowRejectDialog(true)
        }}
        onApply={(id) => handleApply([id])}
        onPrint={handlePrint}
      />

      {selectedIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-deep-plum text-white px-6 py-4 rounded-lg shadow-2xl z-50 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="font-medium">{selectedIds.length} selected</span>
          </div>
          
          <div className="flex gap-2">
            <Button size="sm" variant="secondary" onClick={() => { setBulkAction('approve'); setShowBulkDialog(true); }}>
              Approve
            </Button>
            <Button size="sm" variant="secondary" onClick={() => { setBulkAction('reject'); setShowBulkDialog(true); }}>
              Reject
            </Button>
            <Button size="sm" variant="secondary" onClick={() => { setBulkAction('apply'); setShowBulkDialog(true); }}>
              Apply
            </Button>
            <Button size="sm" variant="secondary" onClick={handleExportCsv}>
              <Download className="w-4 h-4 mr-1" />
              Export
            </Button>
          </div>
          
          <Button size="sm" variant="ghost" onClick={() => setSelectedIds([])} className="text-white hover:text-white hover:bg-white/20">
            Clear
          </Button>
        </div>
      )}

      {detailAction && (
        <ActionDetailDrawer
          action={detailAction}
          onClose={() => setDetailAction(null)}
          onApprove={handleApprove}
          onReject={handleReject}
          onApply={handleApply}
        />
      )}

      <ActionCreateDialog
        open={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        onCreate={handleCreate}
      />

      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Request</DialogTitle>
            <DialogDescription>Provide a detailed reason for rejection (min 10 characters).</DialogDescription>
          </DialogHeader>
          <Input
            placeholder="Enter rejection reason..."
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectDialog(false)}>Cancel</Button>
            <Button onClick={handleSingleReject} className="bg-red-600 hover:bg-red-700">Reject</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showBulkDialog} onOpenChange={setShowBulkDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Bulk Action</DialogTitle>
            <DialogDescription>
              {bulkAction === 'approve' && `Approve ${selectedIds.length} request(s)?`}
              {bulkAction === 'apply' && `Apply ${selectedIds.length} approved request(s)?`}
              {bulkAction === 'reject' && 'Provide rejection reason for selected requests:'}
            </DialogDescription>
          </DialogHeader>
          {bulkAction === 'reject' && (
            <Input
              placeholder="Enter rejection reason (min 10 chars)..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBulkDialog(false)}>Cancel</Button>
            <Button onClick={handleBulkAction} className="bg-deep-plum hover:bg-accent-purple">
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
