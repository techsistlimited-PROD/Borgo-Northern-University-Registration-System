import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Eye, ArrowUpDown } from 'lucide-react'

export interface CorrectionQueueItem {
  id: string
  requestId: string
  studentId: string
  studentName: string
  programCode: string
  courseCode: string
  courseName: string
  section: string
  examType: string
  type: string
  requestedChange: string
  status: 'Draft' | 'Submitted' | 'Under Review' | 'Approved' | 'Rejected' | 'Applied'
  submittedOn: string
  lastUpdated: string
}

interface CorrectionQueueTableProps {
  data: CorrectionQueueItem[]
  selectedIds: string[]
  onSelectionChange: (ids: string[]) => void
  onView: (id: string) => void
  compact?: boolean
}

export default function CorrectionQueueTable({
  data,
  selectedIds,
  onSelectionChange,
  onView,
  compact = false
}: CorrectionQueueTableProps) {
  const [sortField, setSortField] = useState<keyof CorrectionQueueItem>('submittedOn')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')

  const handleSort = (field: keyof CorrectionQueueItem) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const sortedData = [...data].sort((a, b) => {
    const aVal = a[sortField]
    const bVal = b[sortField]
    if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1
    if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1
    return 0
  })

  const handleSelectAll = () => {
    if (selectedIds.length === data.length) {
      onSelectionChange([])
    } else {
      onSelectionChange(data.map(d => d.id))
    }
  }

  const handleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
      onSelectionChange(selectedIds.filter(sid => sid !== id))
    } else {
      onSelectionChange([...selectedIds, id])
    }
  }

  const getStatusBadge = (status: CorrectionQueueItem['status']) => {
    const variants: Record<CorrectionQueueItem['status'], { bg: string; text: string }> = {
      Draft: { bg: 'bg-gray-200', text: 'text-gray-700' },
      Submitted: { bg: 'bg-blue-100', text: 'text-blue-700' },
      'Under Review': { bg: 'bg-amber-100', text: 'text-amber-700' },
      Approved: { bg: 'bg-green-100', text: 'text-green-700' },
      Rejected: { bg: 'bg-red-100', text: 'text-red-700' },
      Applied: { bg: 'bg-purple-100', text: 'text-purple-700' }
    }
    const variant = variants[status]
    return (
      <Badge className={`${variant.bg} ${variant.text} border-0`}>
        {status}
      </Badge>
    )
  }

  const getTypeBadge = (type: string) => {
    return <Badge variant="outline" className="text-xs">{type}</Badge>
  }

  return (
    <div className="border rounded-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              <th className="text-left p-3 border-b">
                <Checkbox
                  checked={selectedIds.length === data.length && data.length > 0}
                  onCheckedChange={handleSelectAll}
                />
              </th>
              <th className="text-left p-3 border-b font-semibold">
                <button onClick={() => handleSort('requestId')} className="flex items-center gap-1 hover:text-deep-plum">
                  Ref No
                  <ArrowUpDown className="w-3 h-3" />
                </button>
              </th>
              <th className="text-left p-3 border-b font-semibold">
                <button onClick={() => handleSort('studentName')} className="flex items-center gap-1 hover:text-deep-plum">
                  Student
                  <ArrowUpDown className="w-3 h-3" />
                </button>
              </th>
              <th className="text-left p-3 border-b font-semibold">Program • Course • Section</th>
              <th className="text-left p-3 border-b font-semibold">Exam Type</th>
              <th className="text-left p-3 border-b font-semibold">Type</th>
              <th className="text-left p-3 border-b font-semibold">Requested Change</th>
              <th className="text-left p-3 border-b font-semibold">
                <button onClick={() => handleSort('status')} className="flex items-center gap-1 hover:text-deep-plum">
                  Status
                  <ArrowUpDown className="w-3 h-3" />
                </button>
              </th>
              <th className="text-left p-3 border-b font-semibold">
                <button onClick={() => handleSort('submittedOn')} className="flex items-center gap-1 hover:text-deep-plum">
                  Submitted
                  <ArrowUpDown className="w-3 h-3" />
                </button>
              </th>
              <th className="text-left p-3 border-b font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedData.length === 0 ? (
              <tr>
                <td colSpan={10} className="p-8 text-center text-gray-500">
                  No correction requests found
                </td>
              </tr>
            ) : (
              sortedData.map(item => (
                <tr key={item.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">
                    <Checkbox
                      checked={selectedIds.includes(item.id)}
                      onCheckedChange={() => handleSelectOne(item.id)}
                    />
                  </td>
                  <td className="p-3 font-mono text-xs">{item.requestId}</td>
                  <td className="p-3">
                    <div className="font-medium text-deep-plum">{item.studentName}</div>
                    <div className="text-xs text-gray-600">{item.studentId}</div>
                  </td>
                  <td className="p-3 text-xs">
                    <div>{item.programCode} • {item.courseCode}</div>
                    <div className="text-gray-600">Section {item.section}</div>
                  </td>
                  <td className="p-3 text-xs">{item.examType}</td>
                  <td className="p-3">{getTypeBadge(item.type)}</td>
                  <td className="p-3 text-xs max-w-xs truncate" title={item.requestedChange}>
                    {item.requestedChange}
                  </td>
                  <td className="p-3">{getStatusBadge(item.status)}</td>
                  <td className="p-3 text-xs text-gray-600">{item.submittedOn}</td>
                  <td className="p-3">
                    <Button size="sm" variant="outline" onClick={() => onView(item.id)}>
                      <Eye className="w-3 h-3 mr-1" />
                      View
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
