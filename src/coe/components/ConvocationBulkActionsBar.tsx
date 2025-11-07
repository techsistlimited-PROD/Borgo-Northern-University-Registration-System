import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, XCircle, DollarSign, Download, Printer, X } from 'lucide-react'

interface ConvocationBulkActionsBarProps {
  selectedCount: number
  onApprove: () => void
  onReject: () => void
  onMarkPaid: () => void
  onExport: () => void
  onPrint: () => void
  onClear: () => void
}

export default function ConvocationBulkActionsBar({
  selectedCount,
  onApprove,
  onReject,
  onMarkPaid,
  onExport,
  onPrint,
  onClear
}: ConvocationBulkActionsBarProps) {
  if (selectedCount === 0) return null

  return (
    <Card className="fixed bottom-6 left-1/2 transform -translate-x-1/2 shadow-lg border-purple-200 bg-white z-50">
      <div className="flex items-center gap-4 px-6 py-4">
        <div className="font-medium text-deep-plum">
          {selectedCount} registration{selectedCount > 1 ? 's' : ''} selected
        </div>
        <div className="flex gap-2">
          <Button size="sm" onClick={onApprove} className="nu-button-primary">
            <CheckCircle className="w-4 h-4 mr-2" />
            Approve
          </Button>
          <Button size="sm" variant="outline" onClick={onReject}>
            <XCircle className="w-4 h-4 mr-2" />
            Reject
          </Button>
          <Button size="sm" variant="outline" onClick={onMarkPaid}>
            <DollarSign className="w-4 h-4 mr-2" />
            Mark Paid
          </Button>
          <Button size="sm" variant="outline" onClick={onExport}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button size="sm" variant="outline" onClick={onPrint}>
            <Printer className="w-4 h-4 mr-2" />
            Print
          </Button>
        </div>
        <Button size="sm" variant="ghost" onClick={onClear}>
          <X className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  )
}
