import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, XCircle, Eye, Play, X } from 'lucide-react'

interface CorrectionBulkActionsBarProps {
  selectedCount: number
  onApprove: () => void
  onReject: () => void
  onMarkUnderReview: () => void
  onApplyChanges: () => void
  onClearSelection: () => void
}

export default function CorrectionBulkActionsBar({
  selectedCount,
  onApprove,
  onReject,
  onMarkUnderReview,
  onApplyChanges,
  onClearSelection
}: CorrectionBulkActionsBarProps) {
  if (selectedCount === 0) return null

  return (
    <div className="bg-gradient-to-r from-deep-plum to-accent-purple text-white p-4 rounded-md mb-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Badge className="bg-white text-deep-plum">{selectedCount} selected</Badge>
        <Button size="sm" variant="outline" className="bg-white text-deep-plum hover:bg-gray-100" onClick={onApprove}>
          <CheckCircle className="w-4 h-4 mr-2" />
          Approve
        </Button>
        <Button size="sm" variant="outline" className="bg-white text-deep-plum hover:bg-gray-100" onClick={onReject}>
          <XCircle className="w-4 h-4 mr-2" />
          Reject
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="bg-white text-deep-plum hover:bg-gray-100"
          onClick={onMarkUnderReview}
        >
          <Eye className="w-4 h-4 mr-2" />
          Mark Under Review
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="bg-white text-deep-plum hover:bg-gray-100"
          onClick={onApplyChanges}
        >
          <Play className="w-4 h-4 mr-2" />
          Apply Changes
        </Button>
      </div>
      <Button size="sm" variant="outline" className="bg-white text-deep-plum hover:bg-gray-100" onClick={onClearSelection}>
        <X className="w-4 h-4 mr-2" />
        Clear
      </Button>
    </div>
  )
}
