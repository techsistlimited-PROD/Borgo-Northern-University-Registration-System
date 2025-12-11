import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CheckCircle2, XCircle } from 'lucide-react'

interface CTDecisionDialogProps {
  open: boolean
  action: 'approve' | 'reject' | null
  requestCount: number
  onClose: () => void
  onConfirm: (remarks: string) => void
}

export default function CTDecisionDialog({
  open,
  action,
  requestCount,
  onClose,
  onConfirm
}: CTDecisionDialogProps) {
  const [remarks, setRemarks] = useState('')

  const handleConfirm = () => {
    if (action === 'reject' && !remarks.trim()) {
      alert('Please provide a reason for rejection.')
      return
    }
    onConfirm(remarks)
    setRemarks('')
  }

  const handleClose = () => {
    setRemarks('')
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {action === 'approve' ? (
              <><CheckCircle2 className="w-5 h-5 text-green-600" />Approve Transfer Request</>
            ) : (
              <><XCircle className="w-5 h-5 text-red-600" />Reject Transfer Request</>
            )}
          </DialogTitle>
          <DialogDescription>
            {action === 'approve'
              ? `Approve ${requestCount === 1 ? 'this request' : `${requestCount} request(s)`} for credit transfer?`
              : `Provide a reason for rejecting ${requestCount === 1 ? 'this request' : `${requestCount} request(s)`}.`
            }
          </DialogDescription>
        </DialogHeader>

        <div>
          <label className="text-sm font-medium mb-1 block">
            {action === 'approve' ? 'Remarks (Optional)' : 'Rejection Reason'}
          </label>
          <Input
            placeholder={action === 'approve' ? 'Additional notes...' : 'Enter reason...'}
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
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
