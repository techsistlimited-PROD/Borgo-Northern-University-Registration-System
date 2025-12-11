import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CheckCircle2, XCircle } from 'lucide-react'

interface CEDecisionDialogProps {
  open: boolean
  action: 'approve' | 'reject' | null
  onClose: () => void
  onConfirm: (notes: string) => void
}

export default function CEDecisionDialog({
  open,
  action,
  onClose,
  onConfirm
}: CEDecisionDialogProps) {
  const [notes, setNotes] = useState('')

  const handleConfirm = () => {
    if (!notes.trim()) {
      alert(`Please provide ${action === 'approve' ? 'approval notes' : 'rejection reason'}.`)
      return
    }
    onConfirm(notes)
    setNotes('')
  }

  const handleClose = () => {
    setNotes('')
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {action === 'approve' ? (
              <><CheckCircle2 className="w-5 h-5 text-green-600" />Approve Exemption Request</>
            ) : (
              <><XCircle className="w-5 h-5 text-red-600" />Reject Exemption Request</>
            )}
          </DialogTitle>
          <DialogDescription>
            {action === 'approve'
              ? 'Provide notes for approving this exemption request.'
              : 'Provide a reason for rejecting this exemption request.'
            }
          </DialogDescription>
        </DialogHeader>

        <div>
          <label className="text-sm font-medium mb-1 block">
            {action === 'approve' ? 'Approval Notes' : 'Rejection Reason'}
          </label>
          <Input
            placeholder={action === 'approve' ? 'Enter approval notes...' : 'Enter rejection reason...'}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>Cancel</Button>
          <Button
            onClick={handleConfirm}
            className={action === 'approve' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
          >
            {action === 'approve' ? 'Approve' : 'Reject'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
