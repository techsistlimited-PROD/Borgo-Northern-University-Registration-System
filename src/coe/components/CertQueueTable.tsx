import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Eye, CheckCircle2, Package, XCircle, Printer, AlertTriangle } from 'lucide-react'
import { CertificateRequest, getCertificateTypeCode } from '@/coe/data/certificates'
import { canIssueOrPrint, getStatusColor } from '@/coe/utils/certificates'

interface CertQueueTableProps {
  requests: CertificateRequest[]
  selectedIds: string[]
  onSelect: (id: string) => void
  onSelectAll: (checked: boolean) => void
  onPreview: (request: CertificateRequest) => void
  onMarkReady: (id: string) => void
  onMarkCollected: (id: string) => void
  onReject: (id: string) => void
  onPrint: (request: CertificateRequest) => void
}

export default function CertQueueTable({
  requests,
  selectedIds,
  onSelect,
  onSelectAll,
  onPreview,
  onMarkReady,
  onMarkCollected,
  onReject,
  onPrint
}: CertQueueTableProps) {
  const [sortBy, setSortBy] = useState<keyof CertificateRequest>('requestDate')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const handleSort = (field: keyof CertificateRequest) => {
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
        <CardTitle>Certificate Request Queue</CardTitle>
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
                <th className="p-3 text-left cursor-pointer hover:bg-gray-100" onClick={() => handleSort('documentType')}>
                  Type {sortBy === 'documentType' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th className="p-3 text-left cursor-pointer hover:bg-gray-100" onClick={() => handleSort('status')}>
                  Status {sortBy === 'status' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th className="p-3 text-left cursor-pointer hover:bg-gray-100" onClick={() => handleSort('requestDate')}>
                  Requested {sortBy === 'requestDate' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th className="p-3 text-left">Serial</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedRequests.map(request => {
                const gating = canIssueOrPrint(request)
                const typeCode = getCertificateTypeCode(request.documentType)
                const isBlocked = !gating.allowed

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
                    <td className="p-3">
                      <div>{request.programCode}</div>
                      <div className="text-xs text-gray-600">{request.campus}</div>
                    </td>
                    <td className="p-3">
                      <Badge variant="outline" className="text-xs">
                        {typeCode}
                      </Badge>
                      {request.urgentRequest && (
                        <Badge className="ml-1 bg-red-100 text-red-800 text-xs">Urgent</Badge>
                      )}
                    </td>
                    <td className="p-3">
                      <Badge className={getStatusColor(request.status)}>
                        {request.status}
                      </Badge>
                    </td>
                    <td className="p-3 text-xs text-gray-600">{request.requestDate}</td>
                    <td className="p-3 text-xs text-gray-600">{request.serial || '—'}</td>
                    <td className="p-3">
                      <div className="flex gap-1 flex-wrap">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onPreview(request)}
                          title="Preview"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>

                        {(request.status === 'Requested' || request.status === 'Processing') && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => onMarkReady(request.id)}
                            disabled={isBlocked}
                            title={isBlocked ? gating.reason : 'Mark Ready'}
                          >
                            <CheckCircle2 className={`w-4 h-4 ${isBlocked ? 'text-gray-400' : 'text-green-600'}`} />
                          </Button>
                        )}

                        {request.status === 'Ready' && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => onMarkCollected(request.id)}
                            title="Mark Collected"
                          >
                            <Package className="w-4 h-4 text-blue-600" />
                          </Button>
                        )}

                        {(request.status === 'Requested' || request.status === 'Processing') && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => onReject(request.id)}
                            title="Reject"
                          >
                            <XCircle className="w-4 h-4 text-red-600" />
                          </Button>
                        )}

                        {request.status === 'Ready' && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => onPrint(request)}
                            disabled={isBlocked}
                            title={isBlocked ? gating.reason : 'Print'}
                          >
                            <Printer className={`w-4 h-4 ${isBlocked ? 'text-gray-400' : 'text-deep-plum'}`} />
                          </Button>
                        )}

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
