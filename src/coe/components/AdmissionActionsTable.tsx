import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Eye, CheckCircle2, XCircle, Play, Printer, AlertTriangle } from 'lucide-react'
import { AdmissionAction } from '@/coe/data/admissionActions'
import { canApproveOrApply, getActionTypeLabel, getStatusColor } from '@/coe/utils/admissionActions'

interface AdmissionActionsTableProps {
  actions: AdmissionAction[]
  selectedIds: string[]
  onSelect: (id: string) => void
  onSelectAll: (checked: boolean) => void
  onView: (action: AdmissionAction) => void
  onApprove: (id: string) => void
  onReject: (id: string) => void
  onApply: (id: string) => void
  onPrint: (action: AdmissionAction) => void
}

export default function AdmissionActionsTable({
  actions,
  selectedIds,
  onSelect,
  onSelectAll,
  onView,
  onApprove,
  onReject,
  onApply,
  onPrint
}: AdmissionActionsTableProps) {
  const [sortBy, setSortBy] = useState<keyof AdmissionAction>('requestedAt')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const handleSort = (field: keyof AdmissionAction) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('asc')
    }
  }

  const sortedActions = [...actions].sort((a, b) => {
    const aVal = a[sortBy]
    const bVal = b[sortBy]
    if (aVal === bVal) return 0
    if (aVal === null) return 1
    if (bVal === null) return -1
    if (sortOrder === 'asc') {
      return aVal > bVal ? 1 : -1
    } else {
      return aVal < bVal ? 1 : -1
    }
  })

  const totalPages = Math.ceil(sortedActions.length / itemsPerPage)
  const startIdx = (currentPage - 1) * itemsPerPage
  const paginatedActions = sortedActions.slice(startIdx, startIdx + itemsPerPage)

  const allSelected = paginatedActions.length > 0 && paginatedActions.every(a => selectedIds.includes(a.id))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Action Request Queue</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="p-3 text-left">
                  <Checkbox
                    checked={allSelected}
                    onCheckedChange={(checked) => onSelectAll(!!checked)}
                  />
                </th>
                <th className="p-3 text-left cursor-pointer hover:bg-gray-100" onClick={() => handleSort('studentId')}>
                  Student {sortBy === 'studentId' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th className="p-3 text-left cursor-pointer hover:bg-gray-100" onClick={() => handleSort('currentProgram')}>
                  Program {sortBy === 'currentProgram' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th className="p-3 text-left cursor-pointer hover:bg-gray-100" onClick={() => handleSort('currentCampus')}>
                  Campus {sortBy === 'currentCampus' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th className="p-3 text-left cursor-pointer hover:bg-gray-100" onClick={() => handleSort('actionType')}>
                  Type {sortBy === 'actionType' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th className="p-3 text-left cursor-pointer hover:bg-gray-100" onClick={() => handleSort('status')}>
                  Status {sortBy === 'status' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th className="p-3 text-left cursor-pointer hover:bg-gray-100" onClick={() => handleSort('requestedAt')}>
                  Requested {sortBy === 'requestedAt' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedActions.map(action => {
                const gating = canApproveOrApply(action)
                const isBlocked = !gating.allowed
                const canApprove = (action.status === 'Requested' || action.status === 'Under Review') && !isBlocked
                const canReject = action.status === 'Requested' || action.status === 'Under Review'
                const canApplyAction = action.status === 'Approved' && !isBlocked

                return (
                  <tr key={action.id} className={`border-b hover:bg-gray-50 ${isBlocked ? 'bg-red-50' : ''}`}>
                    <td className="p-3">
                      <Checkbox
                        checked={selectedIds.includes(action.id)}
                        onCheckedChange={() => onSelect(action.id)}
                      />
                    </td>
                    <td className="p-3">
                      <div className="font-medium">{action.studentId}</div>
                      <div className="text-xs text-gray-600">{action.studentName}</div>
                    </td>
                    <td className="p-3">{action.currentProgram}</td>
                    <td className="p-3">
                      <div>{action.currentCampus}</div>
                      <div className="text-xs text-gray-600">{action.currentBatch}</div>
                    </td>
                    <td className="p-3">
                      <Badge variant="outline" className="text-xs">
                        {getActionTypeLabel(action.actionType)}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <Badge className={getStatusColor(action.status)}>
                        {action.status}
                      </Badge>
                    </td>
                    <td className="p-3 text-xs text-gray-600">
                      <div>{action.requestedAt}</div>
                      <div className="text-gray-500">Upd: {action.updatedAt}</div>
                    </td>
                    <td className="p-3">
                      <div className="flex gap-1 flex-wrap">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onView(action)}
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>

                        {canApprove && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => onApprove(action.id)}
                            title="Approve"
                          >
                            <CheckCircle2 className="w-4 h-4 text-purple-600" />
                          </Button>
                        )}

                        {canReject && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => onReject(action.id)}
                            title="Reject"
                          >
                            <XCircle className="w-4 h-4 text-red-600" />
                          </Button>
                        )}

                        {canApplyAction && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => onApply(action.id)}
                            title="Apply"
                          >
                            <Play className="w-4 h-4 text-blue-600" />
                          </Button>
                        )}

                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onPrint(action)}
                          title="Print Summary"
                        >
                          <Printer className="w-4 h-4 text-deep-plum" />
                        </Button>

                        {isBlocked && (
                          <AlertTriangle className="w-4 h-4 text-red-600" title={gating.reason} />
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-4 pt-4 border-t">
            <div className="text-sm text-gray-600">
              Showing {startIdx + 1}-{Math.min(startIdx + itemsPerPage, sortedActions.length)} of {sortedActions.length}
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <Button
                    key={page}
                    size="sm"
                    variant={page === currentPage ? 'default' : 'outline'}
                    onClick={() => setCurrentPage(page)}
                    className={page === currentPage ? 'bg-deep-plum' : ''}
                  >
                    {page}
                  </Button>
                ))}
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
