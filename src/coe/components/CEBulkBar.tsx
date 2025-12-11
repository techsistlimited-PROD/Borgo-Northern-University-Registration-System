import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { CheckCircle2, XCircle, Download, Play, AlertCircle } from 'lucide-react'
import { CourseExemptionRequest } from '@/coe/data/courseExemptions'
import { canProceed } from '@/coe/utils/courseExemption'

interface CEBulkBarProps {
  selectedRequests: CourseExemptionRequest[]
  onApprove: (ids: string[], notes: string) => void
  onReject: (ids: string[], reason: string) => void
  onApply: (ids: string[]) => void
  onExport: () => void
  onClearSelection: () => void
}

export default function CEBulkBar({
  selectedRequests,
  onApprove,
  onReject,
  onApply,
  onExport,
  onClearSelection
}: CEBulkBarProps) {
  const [showDialog, setShowDialog] = useState(false)
  const [action, setAction] = useState<'approve' | 'reject' | 'apply' | null>(null)
  const [notes, setNotes] = useState('')

  const handleAction = () => {
    if (action === 'approve') {
      if (!notes.trim()) {
        alert('Please provide approval notes.')
        return
      }
      const eligibleIds = selectedRequests
        .filter(r => canProceed(r, 'approve').allowed)
        .map(r => r.id)
      onApprove(eligibleIds, notes)
    } else if (action === 'reject') {
      if (!notes.trim()) {
        alert('Please provide rejection reason.')
        return
      }
      onReject(selectedRequests.map(r => r.id), notes)
    } else if (action === 'apply') {
      const eligibleIds = selectedRequests
        .filter(r => canProceed(r, 'apply').allowed)
        .map(r => r.id)
      onApply(eligibleIds)
    }
    
    setShowDialog(false)
    setAction(null)
    setNotes('')
    onClearSelection()
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
          <Button
            size="sm"
            variant="secondary"
            onClick={() => { setAction('approve'); setShowDialog(true); }}
          >
            Approve
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => { setAction('reject'); setShowDialog(true); }}
          >
            <XCircle className="w-4 h-4 mr-1" />
            Reject
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => { setAction('apply'); setShowDialog(true); }}
          >
            <Play className="w-4 h-4 mr-1" />
            Apply
          </Button>
          <Button size="sm" variant="secondary" onClick={onExport}>
            <Download className="w-4 h-4 mr-1" />
            Export
          </Button>
        </div>
        
        <Button
          size="sm"
          variant="ghost"
          onClick={onClearSelection}
          className="text-white hover:text-white hover:bg-white/20"
        >
          Clear
        </Button>
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-600" />
              Confirm Bulk Action
            </DialogTitle>
            <DialogDescription>
              {action === 'approve' && `Approve ${selectedRequests.length} exemption request(s)?`}
              {action === 'apply' && `Apply ${selectedRequests.length} approved request(s)?`}
              {action === 'reject' && `Reject ${selectedRequests.length} request(s)?`}
            </DialogDescription>
          </DialogHeader>
          <div>
            <label className="text-sm font-medium mb-1 block">
              {action === 'approve' && 'Approval Notes (Required)'}
              {action === 'reject' && 'Rejection Reason (Required)'}
              {action === 'apply' && 'Application Notes (Optional)'}
            </label>
            <Input
              placeholder={action === 'reject' ? 'Enter rejection reason...' : 'Enter notes...'}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>Cancel</Button>
            <Button onClick={handleAction} className="bg-deep-plum hover:bg-accent-purple">
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
