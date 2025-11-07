import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Eye, Printer } from 'lucide-react'
import { DocumentRecord } from '@/coe/data/documents'
import { getCertificateTypeCode } from '@/coe/data/certificates'

interface DocPrintTableProps {
  documents: DocumentRecord[]
  selectedIds: string[]
  onSelect: (id: string) => void
  onSelectAll: (checked: boolean) => void
  onPreview: (doc: DocumentRecord) => void
  onPrint: (doc: DocumentRecord) => void
}

export default function DocPrintTable({
  documents,
  selectedIds,
  onSelect,
  onSelectAll,
  onPreview,
  onPrint
}: DocPrintTableProps) {
  const [sortBy, setSortBy] = useState<keyof DocumentRecord>('issuedDate')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const handleSort = (field: keyof DocumentRecord) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('asc')
    }
  }

  const sortedDocuments = [...documents].sort((a, b) => {
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

  const totalPages = Math.ceil(sortedDocuments.length / itemsPerPage)
  const startIdx = (currentPage - 1) * itemsPerPage
  const paginatedDocuments = sortedDocuments.slice(startIdx, startIdx + itemsPerPage)

  const allSelected = paginatedDocuments.length > 0 && paginatedDocuments.every(d => selectedIds.includes(d.id))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Document Print Queue</CardTitle>
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
                <th className="p-3 text-left cursor-pointer hover:bg-gray-100" onClick={() => handleSort('documentType')}>
                  Type {sortBy === 'documentType' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th className="p-3 text-left cursor-pointer hover:bg-gray-100" onClick={() => handleSort('issuedDate')}>
                  Issued {sortBy === 'issuedDate' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th className="p-3 text-left">Serial</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedDocuments.map(doc => {
                const typeCode = getCertificateTypeCode(doc.documentType)
                
                return (
                  <tr key={doc.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      <Checkbox
                        checked={selectedIds.includes(doc.id)}
                        onCheckedChange={() => onSelect(doc.id)}
                      />
                    </td>
                    <td className="p-3">
                      <div className="font-medium">{doc.studentId}</div>
                      <div className="text-xs text-gray-600">{doc.studentName}</div>
                    </td>
                    <td className="p-3">
                      <div>{doc.programCode}</div>
                      <div className="text-xs text-gray-600">{doc.batch}</div>
                    </td>
                    <td className="p-3 text-sm">{doc.campus}</td>
                    <td className="p-3">
                      <Badge variant="outline" className="text-xs">
                        {typeCode}
                      </Badge>
                    </td>
                    <td className="p-3 text-xs text-gray-600">{doc.issuedDate}</td>
                    <td className="p-3">
                      <div className="text-xs font-mono">{doc.serial}</div>
                      <div className="text-xs text-gray-500">{doc.qrToken}</div>
                    </td>
                    <td className="p-3">
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onPreview(doc)}
                          title="Preview"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onPrint(doc)}
                          title="Print"
                        >
                          <Printer className="w-4 h-4 text-deep-plum" />
                        </Button>
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
              Showing {startIdx + 1}-{Math.min(startIdx + itemsPerPage, sortedDocuments.length)} of {sortedDocuments.length}
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
