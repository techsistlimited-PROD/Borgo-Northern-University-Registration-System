import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Eye, CheckCircle2, XCircle, Play, AlertTriangle } from 'lucide-react'
import { CreditTransferRequest } from '@/coe/data/creditTransfers'
import { canProceed, getStatusColor } from '@/coe/utils/creditTransfer'

interface CTRequestTableProps {
  requests: CreditTransferRequest[]
  selectedIds: string[]
  onSelect: (id: string) => void
  onSelectAll: (checked: boolean) => void
  onView: (request: CreditTransferRequest) => void
  onEvaluate: (request: CreditTransferRequest) => void
  onApprove: (id: string) => void
  onReject: (id: string) => void
  onApply: (id: string) => void
}

export default function CTRequestTable({
  requests,
  selectedIds,
  onSelect,
  onSelectAll,
  onView,
  onEvaluate,
  onApprove,
  onReject,
  onApply
}: CTRequestTableProps) {
  const [sortBy, setSortBy] = useState<keyof CreditTransferRequest>('updatedAt')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const handleSort = (field: keyof CreditTransferRequest) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('asc')
    }
  }

  const sortedRequests = [...requests].sort((a, b) => {
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

  const totalPages = Math.ceil(sortedRequests.length / itemsPerPage)
  const startIdx = (currentPage - 1) * itemsPerPage
  const paginatedRequests = sortedRequests.slice(startIdx, startIdx + itemsPerPage)

  const allSelected = paginatedRequests.length > 0 && paginatedRequests.every(r => selectedIds.includes(r.id))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Credit Transfer Request Queue</CardTitle>
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
                <th className="p-3 text-left cursor-pointer hover:bg-gray-100" onClick={() => handleSort('programCode')}>
                  Program {sortBy === 'programCode' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th className="p-3 text-left cursor-pointer hover:bg-gray-100" onClick={() => handleSort('campus')}>
                  Campus {sortBy === 'campus' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th className="p-3 text-left">Source Univ.</th>
                <th className="p-3 text-left">Credits</th>
                <th className="p-3 text-left cursor-pointer hover:bg-gray-100" onClick={() => handleSort('status')}>
                  Status {sortBy === 'status' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th className="p-3 text-left cursor-pointer hover:bg-gray-100" onClick={() => handleSort('updatedAt')}>
                  Updated {sortBy === 'updatedAt' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedRequests.map(request => {
                const evalGating = canProceed(request, 'evaluate')
                const approveGating = canProceed(request, 'approve')
                const applyGating = canProceed(request, 'apply')
                const isBlocked = !evalGating.allowed || !approveGating.allowed || !applyGating.allowed

                return (
                  <tr key={request.id} className={`border-b hover:bg-gray-50 ${isBlocked ? 'bg-red-50' : ''}`}>
                    <td className="p-3">
                      <Checkbox
                        checked={selectedIds.includes(request.id)}
                        onCheckedChange={() => onSelect(request.id)}
                      />
                    </td>
                    <td className="p-3">
                      <div className="font-medium">{request.studentId}</div>
                      <div className="text-xs text-gray-600">{request.studentName}</div>
                    </td>
                    <td className="p-3">{request.programCode}</td>
                    <td className="p-3">{request.campus}</td>
                    <td className="p-3 text-xs">{request.sourceUniversity}</td>
                    <td className="p-3">
                      <div className="text-xs">
                        <div className="font-semibold">{request.totals.mappedCredits}/{request.totals.sourceCredits}</div>
                        {request.totals.waivedCredits > 0 && (
                          <div className="text-blue-600">+{request.totals.waivedCredits} waived</div>
                        )}
                      </div>
                    </td>
                    <td className="p-3">
                      <Badge className={getStatusColor(request.status)}>
                        {request.status}
                      </Badge>
                    </td>
                    <td className="p-3 text-xs text-gray-600">{request.updatedAt}</td>
                    <td className="p-3">
                      <div className="flex gap-1 flex-wrap">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onView(request)}
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>

                        {(request.status === 'Requested' || request.status === 'Under Review') && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => onEvaluate(request)}
                            disabled={!evalGating.allowed}
                            title={evalGating.allowed ? 'Evaluate' : evalGating.reason}
                          >
                            <CheckCircle2 className={`w-4 h-4 ${evalGating.allowed ? 'text-purple-600' : 'text-gray-400'}`} />
                          </Button>
                        )}

                        {request.status === 'Evaluated' && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => onApprove(request.id)}
                            disabled={!approveGating.allowed}
                            title={approveGating.allowed ? 'Approve' : approveGating.reason}
                          >
                            <CheckCircle2 className={`w-4 h-4 ${approveGating.allowed ? 'text-green-600' : 'text-gray-400'}`} />
                          </Button>
                        )}

                        {(request.status === 'Requested' || request.status === 'Under Review' || request.status === 'Evaluated') && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => onReject(request.id)}
                            title="Reject"
                          >
                            <XCircle className="w-4 h-4 text-red-600" />
                          </Button>
                        )}

                        {request.status === 'Approved' && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => onApply(request.id)}
                            disabled={!applyGating.allowed}
                            title={applyGating.allowed ? 'Apply' : applyGating.reason}
                          >
                            <Play className={`w-4 h-4 ${applyGating.allowed ? 'text-blue-600' : 'text-gray-400'}`} />
                          </Button>
                        )}

                        {isBlocked && (
                          <AlertTriangle
                            className="w-4 h-4 text-red-600"
                            title={evalGating.reason || approveGating.reason || applyGating.reason}
                          />
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
              Showing {startIdx + 1}-{Math.min(startIdx + itemsPerPage, sortedRequests.length)} of {sortedRequests.length}
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
