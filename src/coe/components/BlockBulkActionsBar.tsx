import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Unlock, DollarSign, FileText, AlertTriangle, Download, X } from 'lucide-react'

interface BlockBulkActionsBarProps {
  selectedCount: number
  onClearBlocks: () => void
  onMarkDisciplinary: () => void
  onMarkFinance: () => void
  onMarkTER: () => void
  onExportSelected: () => void
  onClearSelection: () => void
}

export default function BlockBulkActionsBar({
  selectedCount,
  onClearBlocks,
  onMarkDisciplinary,
  onMarkFinance,
  onMarkTER,
  onExportSelected,
  onClearSelection
}: BlockBulkActionsBarProps) {
  if (selectedCount === 0) return null

  return (
    <div className="bg-gradient-to-r from-deep-plum to-accent-purple text-white p-4 rounded-md mb-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Badge className="bg-white text-deep-plum">{selectedCount} selected</Badge>
        <Button size="sm" variant="outline" className="bg-white text-deep-plum hover:bg-gray-100" onClick={onClearBlocks}>
          <Unlock className="w-4 h-4 mr-2" />
          Clear Blocks
        </Button>
        <Button size="sm" variant="outline" className="bg-white text-deep-plum hover:bg-gray-100" onClick={onMarkDisciplinary}>
          <AlertTriangle className="w-4 h-4 mr-2" />
          Mark Disciplinary
        </Button>
        <Button size="sm" variant="outline" className="bg-white text-deep-plum hover:bg-gray-100" onClick={onMarkFinance}>
          <DollarSign className="w-4 h-4 mr-2" />
          Mark Finance
        </Button>
        <Button size="sm" variant="outline" className="bg-white text-deep-plum hover:bg-gray-100" onClick={onMarkTER}>
          <FileText className="w-4 h-4 mr-2" />
          Mark TER
        </Button>
        <Button size="sm" variant="outline" className="bg-white text-deep-plum hover:bg-gray-100" onClick={onExportSelected}>
          <Download className="w-4 h-4 mr-2" />
          Export Selected
        </Button>
      </div>
      <Button size="sm" variant="outline" className="bg-white text-deep-plum hover:bg-gray-100" onClick={onClearSelection}>
        <X className="w-4 h-4 mr-2" />
        Clear
      </Button>
    </div>
  )
}
