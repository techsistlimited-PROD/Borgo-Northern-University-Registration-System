import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { CheckCircle2, XCircle, Download, AlertCircle } from 'lucide-react'
import { CertificateRequest } from '@/coe/data/certificates'
import { canIssueOrPrint, toCsv, downloadCsv } from '@/coe/utils/certificates'

interface CertBulkActionsBarProps {
  selectedRequests: CertificateRequest[]
  onMarkReady: (ids: string[]) => void
  onMarkCollected: (ids: string[]) => void
  onReject: (ids: string[], reason: string) => void
  onClearSelection: () => void
}

export default function CertBulkActionsBar({
  selectedRequests,
  onMarkReady,
  onMarkCollected,
  onReject,
  onClearSelection
}: CertBulkActionsBarProps) {
  const [showRejectDialog, setShowRejectDialog] = useState(false)
  const [rejectReason, setRejectReason] = useState('')
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [confirmAction, setConfirmAction] = useState<'ready' | 'collected' | null>(null)

  const handleMarkReady = () => {
    const blockedRequests = selectedRequests.filter(r => !canIssueOrPrint(r).allowed)
    if (blockedRequests.length > 0) {
      alert(`${blockedRequests.length} request(s) are blocked and cannot be marked ready.`)
      return
    }
    setConfirmAction('ready')
    setShowConfirmDialog(true)
  }

  const handleMarkCollected = () => {
    setConfirmAction('collected')
    setShowConfirmDialog(true)
  }

  const handleConfirm = () => {
    if (confirmAction === 'ready') {
      const eligibleIds = selectedRequests
        .filter(r => canIssueOrPrint(r).allowed && (r.status === 'Requested' || r.status === 'Processing'))
        .map(r => r.id)
      onMarkReady(eligibleIds)
    } else if (confirmAction === 'collected') {
      const eligibleIds = selectedRequests
        .filter(r => r.status === 'Ready')
        .map(r => r.id)
      onMarkCollected(eligibleIds)
    }
    setShowConfirmDialog(false)
    setConfirmAction(null)
    onClearSelection()
  }

  const handleReject = () => {
    if (!rejectReason.trim()) {
      alert('Please provide a reason for rejection.')
      return
    }
    const ids = selectedRequests.map(r => r.id)
    onReject(ids, rejectReason)
    setShowRejectDialog(false)
    setRejectReason('')
    onClearSelection()
  }

  const handleExportSelected = () => {
    const csv = toCsv(selectedRequests)
    downloadCsv(csv, `certificates-selected-${Date.now()}.csv`)
  }

  if (selectedRequests.length === 0) return null

  return (
    <>
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-deep-plum text-white px-6 py-4 rounded-lg shadow-2xl z-50 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5" />
          <span className="font-medium">{selectedRequests.length} selected</span>
        </div>
        
        <div className="flex gap-2">
          <Button size="sm" variant="secondary" onClick={handleMarkReady}>
            Mark Ready
          </Button>
          <Button size="sm" variant="secondary" onClick={handleMarkCollected}>
            Mark Collected
          </Button>
          <Button size="sm" variant="secondary" onClick={() => setShowRejectDialog(true)}>
            <XCircle className="w-4 h-4 mr-1" />
            Reject
          </Button>
          <Button size="sm" variant="secondary" onClick={handleExportSelected}>
            <Download className="w-4 h-4 mr-1" />
            Export CSV
          </Button>
        </div>
        
        <Button size="sm" variant="ghost" onClick={onClearSelection} className="text-white hover:text-white hover:bg-white/20">
          Clear
        </Button>
      </div>

      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Selected Requests</DialogTitle>
            <DialogDescription>
              Provide a reason for rejecting {selectedRequests.length} request(s).
            </DialogDescription>
          </DialogHeader>
          <Input
            placeholder="Enter rejection reason..."
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectDialog(false)}>Cancel</Button>
            <Button onClick={handleReject} className="bg-red-600 hover:bg-red-700">Reject All</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-600" />
              Confirm Bulk Action
            </DialogTitle>
            <DialogDescription>
              {confirmAction === 'ready' && `Mark ${selectedRequests.length} request(s) as Ready?`}
              {confirmAction === 'collected' && `Mark ${selectedRequests.length} request(s) as Collected?`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>Cancel</Button>
            <Button onClick={handleConfirm} className="bg-deep-plum hover:bg-accent-purple">Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
