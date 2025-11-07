import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Download, Plus, FileText, XCircle, X } from 'lucide-react'
import { CERTIFICATE_REQUESTS, CertificateRequest, getCertificateTypes, CertificateType } from '@/coe/data/certificates'
import { SEMESTERS } from '@/coe/data/semesters'
import { PROGRAMS } from '@/coe/data/programs'
import CertQueueTable from '@/coe/components/CertQueueTable'
import CertPreviewDrawer from '@/coe/components/CertPreviewDrawer'
import CertBulkActionsBar from '@/coe/components/CertBulkActionsBar'
import CertIssueDialog from '@/coe/components/CertIssueDialog'
import { generateSerial, generateQrToken, toCsv, downloadCsv } from '@/coe/utils/certificates'

export default function CertificatesManagerView() {
  const [requests, setRequests] = useState<CertificateRequest[]>(CERTIFICATE_REQUESTS)
  const [selectedSemester, setSelectedSemester] = useState(SEMESTERS.find(s => s.isActive)?.id || '')
  const [selectedProgram, setSelectedProgram] = useState('All')
  const [selectedTypes, setSelectedTypes] = useState<CertificateType[]>([])
  const [selectedStatuses, setSelectedStatuses] = useState<CertificateRequest['status'][]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [previewRequest, setPreviewRequest] = useState<CertificateRequest | null>(null)
  const [showIssueDialog, setShowIssueDialog] = useState(false)
  const [showRejectDialog, setShowRejectDialog] = useState(false)
  const [rejectingId, setRejectingId] = useState<string | null>(null)
  const [rejectReason, setRejectReason] = useState('')

  const certificateTypes = getCertificateTypes()
  const programs = ['All', ...PROGRAMS.map(p => p.code)]
  const statuses: CertificateRequest['status'][] = ['Requested', 'Processing', 'Ready', 'Collected', 'Rejected']

  const filteredRequests = useMemo(() => {
    return requests.filter(r => {
      if (selectedProgram !== 'All' && r.programCode !== selectedProgram) return false
      if (selectedTypes.length > 0 && !selectedTypes.includes(r.documentType)) return false
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
  }, [requests, selectedProgram, selectedTypes, selectedStatuses, searchTerm])

  const handleMarkReady = (ids: string[]) => {
    setRequests(prevRequests =>
      prevRequests.map(r => {
        if (ids.includes(r.id) && (r.status === 'Requested' || r.status === 'Processing')) {
          const index = prevRequests.findIndex(req => req.id === r.id)
          return {
            ...r,
            status: 'Ready' as const,
            readyDate: new Date().toISOString().split('T')[0],
            processedDate: r.processedDate || new Date().toISOString().split('T')[0],
            processedBy: r.processedBy || 'COE Office',
            serial: r.serial || generateSerial(r, index),
            qrToken: r.qrToken || generateQrToken(r)
          }
        }
        return r
      })
    )
  }

  const handleMarkCollected = (ids: string[]) => {
    setRequests(prevRequests =>
      prevRequests.map(r => {
        if (ids.includes(r.id) && r.status === 'Ready') {
          return {
            ...r,
            status: 'Collected' as const,
            collectionDate: new Date().toISOString().split('T')[0],
            collectedBy: r.studentName
          }
        }
        return r
      })
    )
  }

  const handleReject = (ids: string[], reason: string) => {
    setRequests(prevRequests =>
      prevRequests.map(r => {
        if (ids.includes(r.id)) {
          return {
            ...r,
            status: 'Rejected' as const,
            rejectedReason: reason,
            processedDate: new Date().toISOString().split('T')[0],
            processedBy: 'COE Office',
            notes: `Rejected: ${reason}`
          }
        }
        return r
      })
    )
  }

  const handleSingleReject = () => {
    if (!rejectingId || !rejectReason.trim()) return
    handleReject([rejectingId], rejectReason)
    setShowRejectDialog(false)
    setRejectingId(null)
    setRejectReason('')
  }

  const handleExportCsv = () => {
    const csv = toCsv(filteredRequests)
    downloadCsv(csv, `certificates-queue-${Date.now()}.csv`)
  }

  const handlePrint = (request: CertificateRequest) => {
    setPreviewRequest(request)
    setTimeout(() => {
      window.print()
    }, 100)
  }

  const handleIssue = (data: {
    studentId: string
    studentName: string
    programCode: string
    batch: string
    campus: string
    creditsCompleted: number
    cgpa: number | null
    documentType: CertificateType
    purpose: string
  }) => {
    const newRequest: CertificateRequest = {
      id: `cert-${Date.now()}`,
      requestId: `CERT-2025-${String(requests.length + 1).padStart(3, '0')}`,
      studentId: data.studentId,
      studentName: data.studentName,
      programCode: data.programCode,
      batch: data.batch,
      campus: data.campus,
      creditsCompleted: data.creditsCompleted,
      cgpa: data.cgpa,
      documentType: data.documentType,
      purpose: data.purpose,
      quantity: 1,
      requestDate: new Date().toISOString().split('T')[0],
      status: 'Requested',
      processedBy: null,
      processedDate: null,
      readyDate: null,
      collectedBy: null,
      collectionDate: null,
      rejectedReason: null,
      notes: 'Newly created request',
      urgentRequest: false,
      serial: null,
      qrToken: null
    }
    setRequests([newRequest, ...requests])
  }

  const toggleTypeFilter = (type: CertificateType) => {
    if (selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter(t => t !== type))
    } else {
      setSelectedTypes([...selectedTypes, type])
    }
  }

  const toggleStatusFilter = (status: CertificateRequest['status']) => {
    if (selectedStatuses.includes(status)) {
      setSelectedStatuses(selectedStatuses.filter(s => s !== status))
    } else {
      setSelectedStatuses([...selectedStatuses, status])
    }
  }

  const clearFilters = () => {
    setSelectedProgram('All')
    setSelectedTypes([])
    setSelectedStatuses([])
    setSearchTerm('')
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-deep-plum">Certificates Manager</h1>
          <p className="text-sm text-gray-600">Manage certificate requests and issuance</p>
        </div>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={handleExportCsv}>
                <FileText className="w-4 h-4 mr-2" />
                Export CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => window.print()}>
                <FileText className="w-4 h-4 mr-2" />
                Print Queue
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button size="sm" onClick={() => setShowIssueDialog(true)} className="bg-deep-plum hover:bg-accent-purple">
            <Plus className="w-4 h-4 mr-2" />
            New Issue
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-4 gap-4">
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
            <label className="text-xs font-medium mb-2 block">Certificate Types</label>
            <div className="flex flex-wrap gap-2">
              {certificateTypes.map(type => (
                <Badge
                  key={type}
                  variant={selectedTypes.includes(type) ? 'default' : 'outline'}
                  className={`cursor-pointer ${selectedTypes.includes(type) ? 'bg-deep-plum' : ''}`}
                  onClick={() => toggleTypeFilter(type)}
                >
                  {type}
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
              Showing {filteredRequests.length} of {requests.length} requests
            </div>
            <Button size="sm" variant="outline" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      <CertQueueTable
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
        onPreview={(request) => setPreviewRequest(request)}
        onMarkReady={(id) => handleMarkReady([id])}
        onMarkCollected={(id) => handleMarkCollected([id])}
        onReject={(id) => {
          setRejectingId(id)
          setShowRejectDialog(true)
        }}
        onPrint={handlePrint}
      />

      {previewRequest && (
        <CertPreviewDrawer
          request={previewRequest}
          onClose={() => setPreviewRequest(null)}
        />
      )}

      <CertBulkActionsBar
        selectedRequests={requests.filter(r => selectedIds.includes(r.id))}
        onMarkReady={handleMarkReady}
        onMarkCollected={handleMarkCollected}
        onReject={handleReject}
        onClearSelection={() => setSelectedIds([])}
      />

      <CertIssueDialog
        open={showIssueDialog}
        onClose={() => setShowIssueDialog(false)}
        onIssue={handleIssue}
      />

      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Request</DialogTitle>
            <DialogDescription>Provide a reason for rejecting this certificate request.</DialogDescription>
          </DialogHeader>
          <Input
            placeholder="Enter rejection reason..."
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectDialog(false)}>Cancel</Button>
            <Button onClick={handleSingleReject} className="bg-red-600 hover:bg-red-700">
              <XCircle className="w-4 h-4 mr-2" />
              Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
